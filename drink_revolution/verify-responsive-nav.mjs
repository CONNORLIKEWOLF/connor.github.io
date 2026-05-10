import { readFileSync } from "node:fs";

const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

const specificity = (selector) => {
  const ids = (selector.match(/#[\w-]+/g) || []).length;
  const classes = (selector.match(/\.[\w-]+/g) || []).length;
  const attributes = (selector.match(/\[[^\]]+\]/g) || []).length;
  const pseudos = (selector.match(/:[\w-]+(?:\([^)]*\))?/g) || []).length;
  const elementSource = selector
    .replace(/#[\w-]+/g, " ")
    .replace(/\.[\w-]+/g, " ")
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/::?[\w-]+(?:\([^)]*\))?/g, " ")
    .replace(/[>+~*]/g, " ");
  const elements = elementSource.split(/\s+/).filter(Boolean).length;
  return [ids, classes + attributes + pseudos, elements];
};

const compareSpecificity = (a, b) => {
  for (let i = 0; i < 3; i += 1) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
};

const selectorsMatchSiteNav = (selector, { mobileOpen = false } = {}) => {
  if (selector === ".site-nav") return true;
  if (selector === ".site-header .site-nav") return true;
  if (selector === ".site-header nav") return true;
  if (selector === ".nav-toggle-input:checked ~ .site-nav") return mobileOpen;
  if (selector === ".site-header .nav-toggle-input:checked ~ .site-nav") return mobileOpen;
  return false;
};

const readRules = ({ mobile, mobileOpen = false }) => {
  const rules = [];
  let order = 0;

  const skipSpaceAndComments = (text, start) => {
    let i = start;
    while (i < text.length) {
      if (/\s/.test(text[i])) {
        i += 1;
        continue;
      }

      if (text.startsWith("/*", i)) {
        const end = text.indexOf("*/", i + 2);
        i = end === -1 ? text.length : end + 2;
        continue;
      }

      break;
    }
    return i;
  };

  const findMatchingBrace = (text, openIndex) => {
    let depth = 0;
    let quote = "";

    for (let i = openIndex; i < text.length; i += 1) {
      const char = text[i];
      const previous = text[i - 1];

      if (quote) {
        if (char === quote && previous !== "\\") quote = "";
        continue;
      }

      if (char === '"' || char === "'") {
        quote = char;
        continue;
      }

      if (char === "{") depth += 1;
      if (char === "}") {
        depth -= 1;
        if (depth === 0) return i;
      }
    }

    return -1;
  };

  const parseBlock = (text, active = true) => {
    let i = 0;

    while (i < text.length) {
      i = skipSpaceAndComments(text, i);
      if (i >= text.length) break;

      if (text.startsWith("@media", i)) {
        const open = text.indexOf("{", i);
        if (open === -1) break;

        const query = text.slice(i, open);
        const close = findMatchingBrace(text, open);
        if (close === -1) break;

        const maxWidth = query.match(/max-width:\s*(\d+)px/);
        const mediaApplies = !maxWidth || mobile <= Number(maxWidth[1]);
        parseBlock(text.slice(open + 1, close), active && mediaApplies);
        i = close + 1;
        continue;
      }

      const open = text.indexOf("{", i);
      if (open === -1) break;

      const selector = text.slice(i, open).trim();
      const close = findMatchingBrace(text, open);
      if (close === -1) break;

      if (!selector.startsWith("@")) {
        pushRule(rules, selector, text.slice(open + 1, close), active, mobileOpen, order);
        order += 1;
      }

      i = close + 1;
    }
  };

  parseBlock(css);
  return rules;
};

const pushRule = (rules, selectorText, body, active, mobileOpen, order) => {
  if (!active) return;

  for (const selector of selectorText.split(",").map((value) => value.trim())) {
    if (!selectorsMatchSiteNav(selector, { mobileOpen })) continue;

    const display = body.match(/display\s*:\s*([^;]+);/);
    const position = body.match(/position\s*:\s*([^;]+);/);
    if (!display && !position) continue;

    rules.push({
      selector,
      order,
      specificity: specificity(selector),
      display: display?.[1].trim(),
      position: position?.[1].trim(),
    });
  }
};

const compute = (options) => {
  const result = {};
  for (const rule of readRules(options)) {
    for (const property of ["display", "position"]) {
      if (!rule[property]) continue;

      const previous = result[property];
      if (
        !previous
        || compareSpecificity(previous.specificity, rule.specificity) < 0
        || (
          compareSpecificity(previous.specificity, rule.specificity) === 0
          && previous.order <= rule.order
        )
      ) {
        result[property] = rule;
      }
    }
  }
  return {
    display: result.display?.display,
    displayRule: result.display,
    position: result.position?.position,
    positionRule: result.position,
  };
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const mobileClosed = compute({ mobile: 390, mobileOpen: false });
assert(
  mobileClosed.display === "none",
  `mobile closed nav should be display:none; got ${JSON.stringify(mobileClosed.displayRule)}`,
);

const mobileOpen = compute({ mobile: 390, mobileOpen: true });
assert(
  mobileOpen.display === "grid" && mobileOpen.position === "fixed",
  `mobile open nav should be fixed grid overlay; got ${JSON.stringify(mobileOpen)}`,
);

const desktop = compute({ mobile: 1440, mobileOpen: false });
assert(
  desktop.display === "flex" && desktop.position !== "fixed",
  `desktop nav should stay inline flex; got ${JSON.stringify(desktop)}`,
);

console.log("PASS responsive nav cascade checks");
