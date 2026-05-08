const copy = {
  zh: {
    skipLink: "跳到正文",
    navAtelier: "工作室",
    navServices: "服务",
    navSpaces: "空间",
    navMaterials: "材质",
    heroKicker: "Private Residence Campaign / 2026",
    heroTitle: "安静的<br />居所<br />有光经过",
    heroIntro: "为高密度城市里的私宅、陈列空间与慢生活场景，建立克制而耐看的室内叙事",
    heroLink: "浏览空间",
    railScopeTitle: "Scope",
    railScope: "私宅 / 家具陈列 / 材质顾问",
    railRoomsTitle: "Rooms",
    railRooms: "客厅、餐厅、卧室与安静过渡区",
    railMethodTitle: "Method",
    railMethod: "从光线、动线和触感开始，而不是从风格开始",
    introTitle: "我们把家当作一种缓慢展开的编辑版面",
    introBody:
      "Maison Luma 以比例、光线、触感和留白为秩序 每个房间不是展示风格，而是让人的日常动作被重新安放：一杯水、一把椅子、一段午后的阴影",
    servicesTitle: "从一间房，到完整居住系统",
    servicesBody:
      "我们把审美判断落到可执行的平面、材质、家具、灯光和现场细节里 每个项目保留清晰节奏，不追求堆满，而追求住进去之后仍然成立",
    serviceOneTitle: "私宅整案",
    serviceOneBody: "平面梳理、空间比例、硬装界面、灯光与家具配置",
    serviceTwoTitle: "家具与陈列",
    serviceTwoBody: "为已完成空间重新建立尺度、坐感、收纳和视觉停顿",
    serviceThreeTitle: "材质顾问",
    serviceThreeBody: "色板、石材、木作、织物和金属细节的组合建议",
    processOne: "初步判断",
    processTwo: "方案方向",
    processThree: "现场落地",
    spacesTitle: "空间像一本低声翻页的杂志",
    projectOne: "暖灰会客室",
    projectTwo: "石材餐厅",
    projectThree: "低声卧室",
    materialsTitle: "用触感取代装饰",
    materialsBody:
      "亚麻、洞石、烟熏橡木、手工灰泥和细砂金属被放在同一套光线里 我们保留材质天然的不均匀，让空间有呼吸，而不是被抛光成样板间",
    materialOneTitle: "Palette",
    materialOneBody: "米白、暖灰、炭灰与低饱和木色",
    materialTwoTitle: "Light",
    materialTwoBody: "柔化自然光，避免强烈边界",
    materialThreeTitle: "Objects",
    materialThreeBody: "少量家具，留出人的尺度",
    campaignTitle: "不是更满，而是更准确",
    campaignBody:
      "一个高级的房间不急着解释自己 它把背景、路径、坐下来的位置和窗边的沉默安排好，然后退后一步",
    enquiryTitle: "先从一段清楚的空间描述开始",
    enquiryBody:
      "适合私宅、精品商业空间与需要重新整理气质的房间 请附上城市、面积、现状照片和期待完成时间",
    enquiryLink: "studio@maison-luma.example",
    enquiryMeta: "Hong Kong / Shanghai / 可远程沟通"
  },
  en: {
    skipLink: "Skip to content",
    navAtelier: "Atelier",
    navServices: "Services",
    navSpaces: "Spaces",
    navMaterials: "Materials",
    heroKicker: "Private Residence Campaign / 2026",
    heroTitle: "Rooms<br />Held<br />By Light",
    heroIntro:
      "Quiet interiors for private residences, collected rooms, and daily rituals that ask for patience rather than spectacle.",
    heroLink: "View spaces",
    railScopeTitle: "Scope",
    railScope: "Residences / furniture staging / material direction",
    railRoomsTitle: "Rooms",
    railRooms: "Living rooms, dining rooms, bedrooms, and quiet thresholds",
    railMethodTitle: "Method",
    railMethod: "Begin with light, movement, and touch before naming a style.",
    introTitle: "We treat the home as an editorial surface that unfolds slowly.",
    introBody:
      "Maison Luma works through proportion, light, touch, and pause. A room is not a display of style; it is a place where ordinary gestures are given better weight: a glass of water, a chair, an afternoon shadow.",
    servicesTitle: "From one room to a complete domestic system.",
    servicesBody:
      "We translate aesthetic judgment into plans, material decisions, furniture, light, and on-site detail. Each project keeps a clear rhythm and avoids excess in favor of rooms that still hold up once lived in.",
    serviceOneTitle: "Private Residences",
    serviceOneBody: "Planning, proportion, interior surfaces, lighting, and furniture direction.",
    serviceTwoTitle: "Furniture & Staging",
    serviceTwoBody: "Reframing completed rooms through scale, seating, storage, and visual pause.",
    serviceThreeTitle: "Material Direction",
    serviceThreeBody: "Calibrated palettes for stone, timber, textiles, plaster, and metal details.",
    processOne: "Initial Brief",
    processTwo: "Spatial Direction",
    processThree: "Site Delivery",
    spacesTitle: "Spaces read like a magazine turning its pages softly.",
    projectOne: "Warm Grey Salon",
    projectTwo: "Stone Dining Room",
    projectThree: "Low-Voice Bedroom",
    materialsTitle: "Texture replaces decoration.",
    materialsBody:
      "Linen, travertine, smoked oak, hand-applied plaster, and sanded metal sit inside the same light. We keep natural irregularities visible so the space can breathe instead of becoming a showroom.",
    materialOneTitle: "Palette",
    materialOneBody: "Chalk white, warm grey, charcoal, and muted timber.",
    materialTwoTitle: "Light",
    materialTwoBody: "Soft natural light with no severe edges.",
    materialThreeTitle: "Objects",
    materialThreeBody: "Fewer pieces, more human scale.",
    campaignTitle: "Not fuller. More exact.",
    campaignBody:
      "A refined room does not rush to explain itself. It arranges the background, the path, the seat, and the silence near the window, then steps back.",
    enquiryTitle: "Begin with a clear description of the room.",
    enquiryBody:
      "Suitable for private residences, selected commercial interiors, and rooms that need a quieter sense of order. Include your city, area, current photos, and preferred completion timeline.",
    enquiryLink: "studio@maison-luma.example",
    enquiryMeta: "Hong Kong / Shanghai / Remote by request"
  }
};

if ("scrollRestoration" in window.history && !window.location.hash) {
  window.history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
}

const i18nNodes = document.querySelectorAll("[data-i18n]");
const langButtons = document.querySelectorAll(".lang-button");
const navSectionLinks = document.querySelectorAll("[data-nav-section]");
const siteHeader = document.querySelector(".site-header");

function setLanguage(lang) {
  const dictionary = copy[lang] || copy.zh;

  i18nNodes.forEach((node) => {
    const key = node.dataset.i18n;
    if (dictionary[key]) {
      node.innerHTML = dictionary[key];
    }
  });

  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
  document.body.dataset.lang = lang;
  localStorage.setItem("maison-luma-language", lang);
}

langButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

const savedLanguage = localStorage.getItem("maison-luma-language");
setLanguage(savedLanguage === "en" ? "en" : "zh");

const heroVideo = document.querySelector(".hero-scrub-video");
const heroScrub = document.querySelector("[data-hero-scrub]");
let heroDuration = heroVideo ? Number(heroVideo.dataset.duration || 0) : 0;
let targetHeroTime = 0;
let scrubFrameRequest = 0;

if (heroVideo && heroScrub) {
  const markHeroReady = () => {
    heroVideo.classList.add("is-ready");
    heroVideo.pause();
    heroVideo.currentTime = 0;
    heroVideo.dataset.currentTime = "0";
    updateHeroScrub();
  };

  heroVideo.pause();
  heroVideo.muted = true;
  heroVideo.removeAttribute("loop");
  heroVideo.removeAttribute("autoplay");
  heroVideo.dataset.currentTime = "0";

  if (heroVideo.readyState >= 1 && Number.isFinite(heroVideo.duration)) {
    heroDuration = Math.max(heroVideo.duration - 0.04, heroDuration);
    markHeroReady();
  } else {
    heroVideo.addEventListener(
      "loadedmetadata",
      () => {
        heroDuration = Number.isFinite(heroVideo.duration)
          ? Math.max(heroVideo.duration - 0.04, heroDuration)
          : heroDuration;
        markHeroReady();
      },
      { once: true }
    );
  }

  heroVideo.addEventListener("loadeddata", () => heroVideo.classList.add("is-ready"), { once: true });
}

function updateHeroScrub() {
  if (!heroVideo || !heroScrub || heroDuration <= 0) {
    return;
  }

  const rect = heroScrub.getBoundingClientRect();
  const travel = Math.max(rect.height, window.innerHeight, 1);
  const rawProgress = Math.min(1, Math.max(0, -rect.top / travel));
  targetHeroTime = Math.min(heroDuration, Math.max(0, rawProgress * heroDuration));
  heroScrub.style.setProperty("--hero-progress", rawProgress.toFixed(4));
  heroScrub.style.setProperty("--hero-drift", `${(-rawProgress * 14).toFixed(2)}px`);
  heroScrub.style.setProperty("--hero-copy-opacity", String(Math.max(0.28, 1 - rawProgress * 0.42).toFixed(3)));

  if (!scrubFrameRequest) {
    scrubFrameRequest = requestAnimationFrame(tickHeroScrub);
  }
}

function tickHeroScrub() {
  scrubFrameRequest = 0;

  if (!heroVideo || heroDuration <= 0) {
    return;
  }

  if (Math.abs(heroVideo.currentTime - targetHeroTime) > 0.012) {
    heroVideo.pause();
    heroVideo.currentTime = targetHeroTime;
  }

  heroVideo.dataset.currentTime = targetHeroTime.toFixed(3);
}

function easeOutBack(t) {
  const c1 = 1.18;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function dampedScrollTo(targetY) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const duration = Math.min(1350, Math.max(760, Math.abs(distance) * 0.62));
  const startedAt = performance.now();

  function frame(now) {
    const elapsed = now - startedAt;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeOutBack(progress));

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));

    if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    event.preventDefault();
    dampedScrollTo(target.getBoundingClientRect().top + window.scrollY);
  });
});

window.addEventListener("scroll", updateHeroScrub, { passive: true });
window.addEventListener("resize", updateHeroScrub);
updateHeroScrub();

let lastScrollY = window.scrollY;
let headerFrameRequest = 0;

function updateHeaderVisibility() {
  headerFrameRequest = 0;

  if (!siteHeader) {
    return;
  }

  const currentScrollY = window.scrollY;
  const isCompactViewport = window.matchMedia("(max-width: 900px)").matches;
  const isScrollingDown = currentScrollY > lastScrollY + 4;
  const shouldHide = isCompactViewport && isScrollingDown && currentScrollY > window.innerHeight * 0.88;

  siteHeader.classList.toggle("is-hidden", shouldHide);
  lastScrollY = currentScrollY;
}

function requestHeaderVisibilityUpdate() {
  if (!headerFrameRequest) {
    headerFrameRequest = requestAnimationFrame(updateHeaderVisibility);
  }
}

window.addEventListener("scroll", requestHeaderVisibilityUpdate, { passive: true });
window.addEventListener("resize", updateHeaderVisibility);
updateHeaderVisibility();

const sections = [...document.querySelectorAll("main > section[id]")];

updateActiveNav("atelier");

function updateActiveNav(id) {
  navSectionLinks.forEach((link) => {
    const isCurrent = link.dataset.navSection === id;
    link.classList.toggle("is-current", isCurrent);
    if (isCurrent) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

const revealNodes = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  if (sections.length > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          updateActiveNav(visibleEntry.target.id);
        }
      },
      {
        threshold: [0.2, 0.45, 0.7],
        rootMargin: "-18% 0px -42% 0px"
      }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
} else {
  updateActiveNav("atelier");
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}
