import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const artifactsDir = resolve("output", "verification");
const fixturePath = resolve(".tmp", "verify-nav-fixture.html");
const html = readFileSync(resolve("index.html"), "utf8");

mkdirSync(artifactsDir, { recursive: true });
mkdirSync(resolve(".tmp"), { recursive: true });

const header = html.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0];
if (!header) {
  throw new Error("Could not find .site-header in index.html");
}

writeFileSync(fixturePath, `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="../styles.css">
  <style>
    body { min-height: 1600px; }
    .fixture-content {
      position: relative;
      z-index: 10;
      min-height: 100dvh;
      display: grid;
      place-items: center;
      color: var(--ink);
      font-family: var(--font-display);
      font-size: 40px;
    }
  </style>
</head>
<body class="is-ready no-webgl">
${header}
<main class="fixture-content">DRINK REVOLUTION</main>
<script>
(() => {
  const params = new URLSearchParams(location.search);
  if (params.get("checked") === "1") {
    document.querySelector(".nav-toggle-input").checked = true;
  }

  const nav = document.querySelector(".site-nav");
  const styles = getComputedStyle(nav);
  const rect = nav.getBoundingClientRect();
  const metrics = {
    navDisplay: styles.display,
    navPosition: styles.position,
    navWidth: Math.round(rect.width),
    navHeight: Math.round(rect.height),
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    headerDisplay: getComputedStyle(document.querySelector(".site-header")).display,
  };
  const pre = document.createElement("pre");
  pre.id = "metrics";
  pre.textContent = JSON.stringify(metrics);
  pre.style.cssText = "position:fixed;left:0;bottom:0;z-index:9999;background:#fff;color:#000;font:12px monospace;max-width:100%;white-space:pre-wrap;";
  document.body.appendChild(pre);
})();
</script>
</body>
</html>`);

const runChrome = (args) => new Promise((resolveRun, rejectRun) => {
  const child = spawn(chromePath, args, { stdio: ["ignore", "pipe", "pipe"] });
  let stdout = "";
  let stderr = "";

  child.stdout.on("data", (chunk) => { stdout += chunk; });
  child.stderr.on("data", (chunk) => { stderr += chunk; });
  child.on("error", rejectRun);
  child.on("exit", (code) => {
    if (code === 0) resolveRun({ stdout, stderr });
    else rejectRun(new Error(`Chrome exited ${code}\n${stdout}\n${stderr}`));
  });
});

const fixtureUrl = `file:///${fixturePath.replace(/\\/g, "/")}`;

const verify = async ({ name, width, height, checked = false }) => {
  const profileDir = resolve(".tmp", `chrome-profile-${name}-${process.pid}`);
  const screenshotPath = resolve(artifactsDir, `${name}.png`);
  mkdirSync(profileDir, { recursive: true });

  const dataUrl = `${fixtureUrl}?checked=${checked ? "1" : "0"}`;
  const dumped = await runChrome([
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--user-data-dir=${profileDir}-dump`,
    `--window-size=${width},${height}`,
    "--dump-dom",
    dataUrl,
  ]);

  const metricsText = dumped.stdout.match(/<pre id="metrics"[^>]*>(.*?)<\/pre>/)?.[1];
  if (!metricsText) {
    throw new Error(`Unable to read metrics for ${name}`);
  }
  const metrics = JSON.parse(metricsText.replace(/&quot;/g, '"').replace(/&amp;/g, "&"));

  await runChrome([
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--user-data-dir=${profileDir}`,
    `--window-size=${width},${height}`,
    `--screenshot=${screenshotPath}`,
    dataUrl,
  ]);

  rmSync(profileDir, { recursive: true, force: true });
  rmSync(`${profileDir}-dump`, { recursive: true, force: true });
  return { metrics, screenshotPath };
};

const mobileClosed = await verify({ name: "mobile-closed", width: 390, height: 844 });
const mobileOpen = await verify({ name: "mobile-open", width: 390, height: 844, checked: true });
const desktop = await verify({ name: "desktop", width: 1440, height: 1000 });

if (mobileClosed.metrics.navDisplay !== "none") {
  throw new Error(`mobile closed nav should be hidden: ${JSON.stringify(mobileClosed)}`);
}
if (mobileOpen.metrics.navDisplay !== "grid" || mobileOpen.metrics.navPosition !== "fixed") {
  throw new Error(`mobile open nav should be fixed grid: ${JSON.stringify(mobileOpen)}`);
}
if (desktop.metrics.navDisplay !== "flex" || desktop.metrics.navPosition === "fixed") {
  throw new Error(`desktop nav should stay inline: ${JSON.stringify(desktop)}`);
}
if (mobileClosed.metrics.scrollWidth > mobileClosed.metrics.innerWidth) {
  throw new Error(`mobile closed viewport has horizontal overflow: ${JSON.stringify(mobileClosed)}`);
}

rmSync(resolve(".tmp"), { recursive: true, force: true });

console.log(JSON.stringify({ mobileClosed, mobileOpen, desktop }, null, 2));
