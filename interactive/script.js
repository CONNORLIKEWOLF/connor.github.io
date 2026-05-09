(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hasGSAP = Boolean(window.gsap);
  let hasLenis = Boolean(window.Lenis);
  let hasSplitType = Boolean(window.SplitType);
  let hasScrollTrigger = Boolean(window.ScrollTrigger);

  const resourceCategories = [
    {
      name: "动画与滚动",
      items: [
        { name: "Anime.js", type: "animation", github: "https://github.com/juliangarnier/anime", website: "https://animejs.com/", npm: "animejs", use: "轻量时间线动画、元素漂浮、交互动画" },
        { name: "GSAP", type: "animation", github: "https://github.com/greensock/GSAP", website: "https://gsap.com/", npm: "gsap", use: "高级动画、ScrollTrigger、复杂滚动时间线" },
        { name: "Lenis", type: "smooth-scroll", github: "https://github.com/darkroomengineering/lenis", website: "https://lenis.darkroom.engineering/", npm: "lenis", use: "高级网页常用平滑滚动" },
        { name: "SplitType", type: "text-animation", github: "https://github.com/lukePeavey/SplitType", website: "https://lukepeavey.github.io/SplitType/", npm: "split-type", use: "把文字拆成行、词、字母，方便做标题动效" },
        { name: "Three.js", type: "webgl-3d", github: "https://github.com/mrdoob/three.js", website: "https://threejs.org/", npm: "three", use: "3D、WebGL、粒子、产品视觉" },
        { name: "OGL", type: "webgl", github: "https://github.com/oframe/ogl", website: "https://oframe.github.io/ogl/", npm: "ogl", use: "轻量 WebGL，适合自定义视觉实验" },
        { name: "barba.js", type: "page-transition", github: "https://github.com/barbajs/barba", website: "https://barba.js.org/", npm: "@barba/core", use: "多页面过渡动画" },
        { name: "Swiper", type: "slider", github: "https://github.com/nolimits4web/swiper", website: "https://swiperjs.com/", npm: "swiper", use: "作品集轮播、滑块、移动端滑动" }
      ]
    },
    {
      name: "React / Vue 动效组件与变换灵感",
      items: [
        { name: "React Bits", type: "react-animation-components", github: "https://github.com/DavidHDev/react-bits", website: "https://www.reactbits.dev/", install: "按组件页面复制代码，或使用 shadcn/jsrepo 命令添加单个组件", use: "文字动效、背景特效、鼠标交互、3D 卡片、滚动型高级网页变换参考", notes: "适合 React/Vite/Next 项目直接使用；原生 HTML/CSS/JS 项目可以借鉴它的动效逻辑和视觉节奏后手写实现" },
        { name: "React Bits Pro", type: "react-animation-sections", website: "https://pro.reactbits.dev/", use: "完整 Hero、Showcase、Stats、CTA、Pricing 等高级区块和模板参考", notes: "适合研究高级网页区块的组合方式、页面节奏和动效层次" },
        { name: "Vue Bits", type: "vue-nuxt-animation-components", github: "https://github.com/DavidHDev/vue-bits", website: "https://vue-bits.dev/", install: "按 Vue Bits 组件页面里的 jsrepo 命令添加单个组件", use: "Vue / Nuxt 项目里的文字动效、背景特效、交互组件、3D 卡片和高级网页视觉区块", notes: "Vue Bits 是 React Bits 的官方 Vue port，适合现代 Vue 3 / Nuxt 项目；原生 HTML/CSS/JS 项目只参考动效逻辑和视觉节奏" }
      ]
    },
    { name: "设计风格 Prompt 与视觉方向", items: [{ name: "Design Prompts", type: "design-prompt-style-reference", website: "https://www.designprompts.dev/", use: "写网页前选择视觉风格、版式语言、材质感、提示词和审美方向", notes: "适合在编码前先确定页面气质，再按 React / Vue / Nuxt / 原生栈选择组件和动效库" }] },
    { name: "图片与视频素材", items: [
      { name: "Unsplash", website: "https://unsplash.com/", use: "高质量摄影图片" },
      { name: "Pexels", website: "https://www.pexels.com/", use: "免费图片和视频素材" },
      { name: "Pixabay", website: "https://pixabay.com/", use: "图片、视频、矢量、音乐" },
      { name: "Lummi", website: "https://www.lummi.ai/", use: "AI 风格高质量视觉素材" },
      { name: "Freepik", website: "https://www.freepik.com/", use: "图片、插画、矢量、PSD" }
    ] },
    { name: "图标库", items: [
      { name: "Lucide", github: "https://github.com/lucide-icons/lucide", website: "https://lucide.dev/", npm: "lucide", use: "线性图标，现代界面首选" },
      { name: "Phosphor Icons", github: "https://github.com/phosphor-icons/core", website: "https://phosphoricons.com/", npm: "@phosphor-icons/react", use: "多字重图标，适合高级 UI" },
      { name: "Tabler Icons", github: "https://github.com/tabler/tabler-icons", website: "https://tabler.io/icons", npm: "@tabler/icons", use: "数量多、风格统一的线性图标" },
      { name: "Heroicons", github: "https://github.com/tailwindlabs/heroicons", website: "https://heroicons.com/", npm: "@heroicons/react", use: "Tailwind 生态常用图标" },
      { name: "Iconify", github: "https://github.com/iconify/iconify", website: "https://iconify.design/", npm: "@iconify/react", use: "聚合海量图标集" },
      { name: "React Icons", github: "https://github.com/react-icons/react-icons", website: "https://react-icons.github.io/react-icons/", npm: "react-icons", use: "React 项目里快速调用多个图标库" }
    ] },
    { name: "Emoji 与小表情", items: [
      { name: "Twemoji", github: "https://github.com/jdecked/twemoji", website: "https://twemoji.twitter.com/", npm: "twemoji", use: "Twitter 风格 emoji，适合网页小表情" },
      { name: "Noto Emoji", github: "https://github.com/googlefonts/noto-emoji", website: "https://fonts.google.com/noto/specimen/Noto+Emoji", use: "Google Noto emoji 资源" },
      { name: "OpenMoji", github: "https://github.com/hfg-gmuend/openmoji", website: "https://openmoji.org/", npm: "openmoji", use: "开源 emoji 和贴纸风格素材" },
      { name: "Fluent Emoji", github: "https://github.com/microsoft/fluentui-emoji", website: "https://github.com/microsoft/fluentui-emoji", use: "微软 3D/扁平 emoji 资源" },
      { name: "Emoji Kitchen", website: "https://emoji.supply/kitchen/", use: "趣味 emoji 合成灵感" },
      { name: "Blobmoji", github: "https://github.com/C1710/blobmoji", website: "https://c1710.github.io/blobmoji/", use: "可爱 blob 风格 emoji" }
    ] },
    { name: "3D 与物件素材", items: [
      { name: "Spline", website: "https://spline.design/", use: "在线做 3D 场景和网页嵌入" },
      { name: "Sketchfab", website: "https://sketchfab.com/", use: "3D 模型资源" },
      { name: "Poly Haven", website: "https://polyhaven.com/", use: "HDRI、纹理、3D 模型" },
      { name: "Vectary", website: "https://www.vectary.com/", use: "在线 3D 设计与嵌入" },
      { name: "3D Icons", website: "https://3dicons.co/", use: "免费 3D 图标" },
      { name: "IconScout 3D", website: "https://iconscout.com/3ds", use: "3D 插画、图标、模型" },
      { name: "ShapeFest", website: "https://www.shapefest.com/", use: "3D 几何物件素材" }
    ] },
    { name: "插画、纹理、背景、字体", items: [
      { name: "unDraw", website: "https://undraw.co/illustrations", use: "简洁 SVG 插画" },
      { name: "Storyset", website: "https://storyset.com/", use: "可编辑插画素材" },
      { name: "DrawKit", website: "https://www.drawkit.com/", use: "插画和图形包" },
      { name: "Open Doodles", website: "https://www.opendoodles.com/", use: "手绘风插画" },
      { name: "Blush", website: "https://blush.design/", use: "组合式插画库" },
      { name: "Transparent Textures", website: "https://www.transparenttextures.com/", use: "轻纹理背景" },
      { name: "Hero Patterns", website: "https://heropatterns.com/", use: "SVG 背景图案" },
      { name: "fffuel", website: "https://fffuel.co/", use: "SVG 视觉生成器、噪声、渐变、图案" },
      { name: "Haikei", website: "https://haikei.app/", use: "SVG 背景生成器" },
      { name: "Google Fonts", website: "https://fonts.google.com/", use: "免费网页字体" },
      { name: "Fontshare", website: "https://www.fontshare.com/", use: "高质量免费字体" },
      { name: "Bunny Fonts", website: "https://fonts.bunny.net/", use: "Google Fonts 替代 CDN" },
      { name: "Velvetyne", website: "https://velvetyne.fr/", use: "实验性开源字体" },
      { name: "Collletttivo", website: "https://www.collletttivo.it/", use: "独立开源字体" }
    ] }
  ];

  const termData = {
    "pinned-scroll": {
      label: "Pinned scroll",
      title: "把某一屏暂时钉住，让内容像镜头而不是路过的海报",
      summary: "当一段信息需要被完整理解，或者你要把文字与视觉组合成一个分镜时，pinned scroll 会给用户一个真正停留的时间窗",
      meta: ["让章节建立主次，不会所有内容都以同样速度滑过去", "Hero 叙事段、产品亮点分镜、数据解释、作品集章节", "页面每一屏都 pin，会让滚动失去流动感"]
    },
    "parallax-layers": {
      label: "Parallax layers",
      title: "让前景、中景、背景用不同速度移动，给页面一点空间深度",
      summary: "它适合解释层级关系，例如标题、视觉板、辅助标签各有不同速度，页面会更像一个被拍摄的场景",
      meta: ["建立空间和主次，而不是单纯让东西乱飘", "封面视觉、产品图、浮动注释、背景纹理", "层数过多会显得廉价，2 到 3 层通常足够"]
    },
    "mask-reveal": {
      label: "Mask reveal",
      title: "用裁切而不是淡入，让内容像被镜头切出来",
      summary: "clip-path 或 overflow mask 能让区块出现得更明确，适合做章节切场、图片开合和重要内容进入",
      meta: ["制造切场节奏，比普通 fade in 更有电影感", "章节标题、图像边界、卡片组、命令块", "遮罩时间太长会拖慢阅读，应该快而准"]
    },
    "split-text": {
      label: "Split text",
      title: "把标题拆成字符或词，让重点文字有可控的进入顺序",
      summary: "中文更适合按字或短行处理，英文可以按词处理；它能让大标题有气息，但不能伤害可读性",
      meta: ["让阅读起点更清楚，给标题建立节奏", "Hero 标题、章节标题、重要术语", "正文不适合大面积拆分，会影响阅读"]
    },
    "image-scale": {
      label: "Image scale",
      title: "图像轻微推进或回收，让滚动像镜头焦距变化",
      summary: "图片缩放应该非常克制，重点是暗示镜头在动，而不是让图片跳出来抢文字",
      meta: ["把视觉板和滚动建立关系", "Hero 视觉、案例图、资源地图、素材货架", "大幅缩放会显得像模板特效，少量即可"]
    }
  };

  const scenarios = {
    scrolltelling: {
      type: "高级滚动作品集",
      title: "适合大字排版、章节叙事、镜头式切场和作品集首页",
      summary: "把滚动当成时间线处理，重点做章节停顿、标题进场和画面推进；适合你这次要的电影感官网",
      pills: ["Lenis", "GSAP", "ScrollTrigger", "SplitType", "Three.js", "React Bits", "Phosphor"],
      why: "能稳稳控制长页面的章节节奏，适合叙事而不是只做几个悬浮动画",
      note: "不要把每一屏都做满特效，重点段落再 pin，其余段落让它呼吸",
      command: "npm install gsap lenis split-type three @phosphor-icons/react"
    },
    lightweight: {
      type: "轻量手写控制",
      title: "适合元素漂浮、按钮动效、少量滚动进入和短页面实验",
      summary: "页面不需要复杂分镜时，用 Anime.js 加 Lenis 就能保持灵活，代码也更轻",
      pills: ["Anime.js", "Lenis", "SplitType", "Lucide"],
      why: "手写控制更直接，适合快速做一个干净但有活力的页面",
      note: "别把轻量站做成长篇叙事，否则后期维护会变难",
      command: "npm install animejs lenis split-type lucide"
    },
    webgl: {
      type: "WebGL 视觉实验",
      title: "适合图片变形、粒子、液体、3D 画布和鼠标扰动",
      summary: "当视觉本身就是主角，Three.js 或 OGL 可以承载更强的画面语言，再用 GSAP 控制节奏",
      pills: ["Three.js", "OGL", "GSAP", "Lenis", "Poly Haven", "Sketchfab"],
      why: "能把资源库里的 3D、纹理和视觉实验真正用起来",
      note: "WebGL 要做性能预算，移动端需要降级方案",
      command: "npm install three ogl gsap lenis"
    },
    brand: {
      type: "品牌官网 / 产品官网",
      title: "适合高级但稳定的品牌展示，图片质感比特效数量更重要",
      summary: "品牌页需要稳定、可读、可信；Lenis 和 GSAP 保留手感，Swiper 解决作品或产品展示",
      pills: ["Lenis", "GSAP", "Swiper", "Lucide", "Unsplash", "Pexels", "Lummi", "Fontshare"],
      why: "让页面有高级感，但不会让动效喧宾夺主",
      note: "产品和品牌名必须在首屏清楚出现，不能只藏在导航里",
      command: "npm install lenis gsap swiper lucide"
    },
    youth: {
      type: "年轻轻互动",
      title: "适合小表情、贴纸感、社交传播和更轻的交互氛围",
      summary: "Anime.js 配合 Twemoji、OpenMoji 或 Iconify，适合做更活泼但仍然可控的轻互动页面",
      pills: ["Anime.js", "Twemoji", "OpenMoji", "Fluent Emoji", "Iconify", "Blush"],
      why: "能覆盖资源库里的 Emoji、插画和小表情方向",
      note: "这类风格容易过甜，留白和字体控制仍然重要",
      command: "npm install animejs twemoji openmoji @iconify/react"
    },
    direction: {
      type: "先定风格再写",
      title: "适合还没确定视觉气质，只知道想要高级、特别、像作品集",
      summary: "先用 Design Prompts 找方向，再决定 React Bits、Vue Bits、GSAP、Anime.js 或 Three.js 的取舍",
      pills: ["Design Prompts", "React Bits", "Vue Bits", "GSAP", "Anime.js", "Three.js"],
      why: "先定风格能避免边写边加效果，页面最终会更统一",
      note: "视觉关键词要落到字体、节奏、素材和动画强度上，不能只停留在形容词",
      command: "Design Prompts: https://www.designprompts.dev/"
    }
  };

  const commandBlocks = [
    { title: "动画与滚动", summary: "资源库里最常用的核心动画包", code: "npm install animejs gsap lenis split-type three ogl @barba/core swiper" },
    { title: "React 动效组件", summary: "React Bits 更像组件资料库，按页面复制或用 jsrepo 添加", code: "# 官网：https://www.reactbits.dev/\n# GitHub：https://github.com/DavidHDev/react-bits" },
    { title: "Vue / Nuxt 动效组件", summary: "Vue Bits 是 Vue 3 / Nuxt 方向的高级动效组件参考", code: "# 官网：https://vue-bits.dev/\n# GitHub：https://github.com/DavidHDev/vue-bits" },
    { title: "图标", summary: "不同项目可以在 Lucide、Phosphor、Tabler、Iconify 等之间选择", code: "npm install lucide lucide-react phosphor-icons @phosphor-icons/react @tabler/icons @tabler/icons-react @heroicons/react @iconify/react react-icons" },
    { title: "Emoji / 贴纸", summary: "年轻化、社交感、小表情方向才使用", code: "npm install twemoji openmoji" },
    { title: "典型引入示例", summary: "这就是当前页面采用的基础滚动时间线方式", code: "import Lenis from 'lenis'\nimport gsap from 'gsap'\nimport ScrollTrigger from 'gsap/ScrollTrigger'\nimport SplitType from 'split-type'\n\ngsap.registerPlugin(ScrollTrigger)" }
  ];

  const effectData = {
    lenis: {
      label: "当前样本 / Lenis",
      title: "滚动手感不是装饰，是阅读节奏",
      summary: "Lenis 让滚轮、触控板和章节停顿之间更顺，适合长页面叙事、作品集首页和资源导航",
      source: "动画与滚动",
      usage: "平滑滚动、pinned section、章节进度和镜头推进",
      category: "动画与滚动",
      href: "https://lenis.darkroom.engineering/"
    },
    gsap: {
      label: "当前样本 / GSAP",
      title: "把滚动拆成可控制的镜头",
      summary: "ScrollTrigger 适合把章节、图片和标题放进同一条时间线，页面切场会更像剪辑",
      source: "动画与滚动",
      usage: "pin 住关键段落、clip-path 切场、stagger 进场和进度反馈",
      category: "动画与滚动",
      href: "https://gsap.com/"
    },
    split: {
      label: "当前样本 / SplitType",
      title: "重点文字应该有轻微反应",
      summary: "大字号编辑排版最怕静止无重量，文字拆分后可以按字、按行做进入和 hover 细动",
      source: "动画与滚动",
      usage: "Hero 标题、章节标题、重要术语、方案名称",
      category: "动画与滚动",
      href: "https://lukepeavey.github.io/SplitType/"
    },
    webgl: {
      label: "当前样本 / Three.js 与 OGL",
      title: "3D 不是堆模型，而是建立深度",
      summary: "资源库里的 3D 与纹理可以先转成轻量空间关系，重要画面再考虑真正 WebGL",
      source: "3D 与物件素材",
      usage: "物件层级、视差深度、产品视觉、空间化资源地图",
      category: "3D 与物件素材",
      href: "https://threejs.org/"
    },
    bits: {
      label: "当前样本 / React Bits 与 Vue Bits",
      title: "组件站的价值是交互节奏参考",
      summary: "当前页面是原生 HTML，不直接复制组件；把它们的文字动效、卡片物理感和状态反馈重写成轻量样本",
      source: "React / Vue 动效组件与变换灵感",
      usage: "动效模式参考、按钮反馈、交互组件状态、标题与背景节奏",
      category: "React / Vue 动效组件与变换灵感",
      href: "https://www.reactbits.dev/"
    },
    swiper: {
      label: "当前样本 / Swiper 与素材站",
      title: "素材展示要有节奏，不要把图塞满",
      summary: "图片、视频和作品案例适合横向分组，让用户在同一屏理解多个来源的差异",
      source: "图片与视频素材",
      usage: "作品集轮播、素材货架、案例预览、移动端滑动",
      category: "图片与视频素材",
      href: "https://swiperjs.com/"
    },
    icons: {
      label: "当前样本 / 图标与反馈",
      title: "图标只在动作发生处变得明显",
      summary: "Lucide、Phosphor、Tabler 和 Emoji 资源适合给复制、跳转、筛选等操作提供确认感",
      source: "图标库",
      usage: "按钮状态、复制反馈、筛选选中、跳转提示和轻量表情化反馈",
      category: "图标库",
      href: "https://phosphoricons.com/"
    },
    direction: {
      label: "当前样本 / 风格提示与纹理字体",
      title: "先定气质，再决定动画强度",
      summary: "Design Prompts、字体和纹理资源决定页面的语气，动画只应该强化这个语气",
      source: "设计风格 Prompt 与视觉方向",
      usage: "视觉关键词、字体组合、纹理背景、留白比例和动画克制度",
      category: "设计风格 Prompt 与视觉方向",
      href: "https://www.designprompts.dev/"
    }
  };

  const loadScript = (src) => new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = resolve;
    document.head.appendChild(script);
  });

  const loadMotionLibraries = async () => {
    await Promise.all([
      loadScript("https://unpkg.com/lenis@1.3.13/dist/lenis.min.js"),
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"),
      loadScript("https://unpkg.com/split-type@0.3.4/umd/index.min.js")
    ]);
    if (window.gsap) {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js");
    }
    hasGSAP = Boolean(window.gsap);
    hasLenis = Boolean(window.Lenis);
    hasSplitType = Boolean(window.SplitType);
    hasScrollTrigger = Boolean(window.ScrollTrigger);
  };

  const setReady = () => {
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
  };

  const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (match) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[match]));

  const copyText = async (text, button) => {
    try {
      await navigator.clipboard.writeText(text);
      if (button) {
        const old = button.textContent;
        button.textContent = "已复制";
        setTimeout(() => { button.textContent = old; }, 1200);
      }
    } catch {
      window.prompt("复制这段内容", text);
    }
  };

  const renderTerm = (key) => {
    const data = termData[key] || termData["pinned-scroll"];
    const panel = document.querySelector("#glossary-panel");
    if (!panel) return;
    panel.innerHTML = `
      <span class="glossary-panel__label">${escapeHtml(data.label)}</span>
      <h3 class="glossary-panel__title important-text">${escapeHtml(data.title)}</h3>
      <p class="glossary-panel__summary">${escapeHtml(data.summary)}</p>
      <div class="glossary-meta">
        <dl><dt>实际作用</dt><dd>${escapeHtml(data.meta[0])}</dd></dl>
        <dl><dt>适合场景</dt><dd>${escapeHtml(data.meta[1])}</dd></dl>
        <dl><dt>别这样用</dt><dd>${escapeHtml(data.meta[2])}</dd></dl>
      </div>
      <div class="glossary-visual" aria-hidden="true">
        <span class="glossary-visual__line"></span>
        <span class="glossary-visual__line"></span>
        <span class="glossary-visual__line"></span>
      </div>
    `;
    if (hasGSAP && !prefersReduced) {
      gsap.fromTo(panel.children, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.045, ease: "power3.out" });
      gsap.fromTo(".glossary-visual__line", { scaleX: 0 }, { scaleX: 1, duration: 0.7, stagger: 0.08, ease: "expo.out" });
      bindImportantText(panel);
    }
  };

  const renderScenario = (key) => {
    const data = scenarios[key] || scenarios.scrolltelling;
    const panel = document.querySelector("#playbook-panel");
    if (!panel) return;
    panel.innerHTML = `
      <span class="playbook-panel__type">${escapeHtml(data.type)}</span>
      <h3 class="playbook-panel__title important-text">${escapeHtml(data.title)}</h3>
      <p class="playbook-panel__summary">${escapeHtml(data.summary)}</p>
      <div class="playbook-pills">${data.pills.map((pill) => `<span>${escapeHtml(pill)}</span>`).join("")}</div>
      <div class="playbook-meta">
        <dl><dt>为什么选它</dt><dd>${escapeHtml(data.why)}</dd></dl>
        <dl><dt>注意点</dt><dd>${escapeHtml(data.note)}</dd></dl>
      </div>
      <div class="command-card">
        <div>
          <span class="command-card__label">起手安装 / 起手动作</span>
          <code class="command-card__code">${escapeHtml(data.command)}</code>
        </div>
        <button class="button button--line copy-command" type="button" data-copy="${escapeHtml(data.command)}">复制命令</button>
      </div>
    `;
    if (hasGSAP && !prefersReduced) {
      gsap.fromTo(panel.children, { y: 18, opacity: 0, clipPath: "inset(18% 0 0 0)" }, { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 0.55, stagger: 0.045, ease: "power3.out" });
      bindImportantText(panel);
    }
  };

  const renderEffectDetail = (key) => {
    const data = effectData[key] || effectData.lenis;
    const panel = document.querySelector("#effect-detail");
    if (!panel) return;
    panel.innerHTML = `
      <div>
        <span class="effect-detail__label">${escapeHtml(data.label)}</span>
        <h3 class="effect-detail__title important-text">${escapeHtml(data.title)}</h3>
        <p class="effect-detail__summary">${escapeHtml(data.summary)}</p>
      </div>
      <div class="effect-detail__meta">
        <dl><dt>来自资源</dt><dd>${escapeHtml(data.source)}</dd></dl>
        <dl><dt>页面里怎么用</dt><dd>${escapeHtml(data.usage)}</dd></dl>
        <div class="effect-detail__actions">
          <button class="button button--line magnetic" type="button" data-jump-category="${escapeHtml(data.category)}">查看相关资源</button>
          <a class="button button--dark magnetic" href="${escapeHtml(data.href)}" target="_blank" rel="noreferrer">打开来源</a>
        </div>
      </div>
    `;
    if (hasGSAP && !prefersReduced) {
      gsap.fromTo(panel.children, { y: 18, opacity: 0, clipPath: "inset(20% 0 0 0)" }, { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 0.52, stagger: 0.055, ease: "power3.out" });
      bindImportantText(panel);
    }
  };

  const renderCommands = () => {
    const grid = document.querySelector("#commands-grid");
    if (!grid) return;
    grid.innerHTML = commandBlocks.map((block, index) => `
      <article class="command-block ${index === 0 ? "is-active" : ""}" data-command-index="${index}">
        <span class="command-block__label">INSTALL</span>
        <h3 class="command-block__title important-text">${escapeHtml(block.title)}</h3>
        <p class="command-block__summary">${escapeHtml(block.summary)}</p>
        <div class="command-block__code"><code>${escapeHtml(block.code)}</code></div>
        <div class="command-block__actions">
          <button class="button button--line copy-command" type="button" data-copy="${escapeHtml(block.code)}">复制</button>
        </div>
      </article>
    `).join("");
  };

  const renderLibraryFilters = () => {
    const filters = document.querySelector("#library-filters");
    if (!filters) return;
    filters.innerHTML = resourceCategories.map((category, index) => `
      <button class="library-filter magnetic ${index === 0 ? "is-active" : ""}" type="button" data-category="${escapeHtml(category.name)}" role="tab" aria-selected="${index === 0 ? "true" : "false"}">
        ${escapeHtml(category.name)}
      </button>
    `).join("");
  };

  const renderLibrary = (categoryName = "动画与滚动") => {
    const category = resourceCategories.find((item) => item.name === categoryName) || resourceCategories[0];
    const label = document.querySelector(".library-panel__label");
    const count = document.querySelector(".library-panel__count");
    const items = document.querySelector("#library-items");
    if (!items || !label || !count) return;

    label.textContent = category.name;
    count.textContent = `${category.items.length} 个条目`;
    items.innerHTML = category.items.map((item) => {
      const meta = [item.type, item.npm ? `npm: ${item.npm}` : "", item.install ? "component source" : ""].filter(Boolean);
      const actions = [
        item.website ? `<a class="library-link magnetic" href="${escapeHtml(item.website)}" target="_blank" rel="noreferrer">官网</a>` : "",
        item.github ? `<a class="library-link magnetic" href="${escapeHtml(item.github)}" target="_blank" rel="noreferrer">GitHub</a>` : "",
        item.npm ? `<button class="library-link copy-command" type="button" data-copy="npm install ${escapeHtml(item.npm)}">复制 npm</button>` : ""
      ].filter(Boolean).join("");

      return `
        <section class="library-item">
          <div>
            <h3 class="library-item__title important-text">${escapeHtml(item.name)}</h3>
            <p class="library-item__summary">${escapeHtml(item.use || item.notes || item.install || "资源参考")}</p>
            ${item.notes ? `<p class="library-item__summary">${escapeHtml(item.notes)}</p>` : ""}
            <div class="library-item__meta">${meta.map((entry) => `<span>${escapeHtml(entry)}</span>`).join("")}</div>
          </div>
          <div class="library-item__actions">${actions}</div>
        </section>
      `;
    }).join("");

    if (hasGSAP && !prefersReduced) {
      gsap.fromTo(".library-item", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, stagger: 0.04, ease: "power3.out" });
      bindImportantText(items);
    }
  };

  const activateButtons = (selector, activeButton) => {
    document.querySelectorAll(selector).forEach((button) => {
      const active = button === activeButton;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
  };

  const bindImportantText = (root = document) => {
    if (!hasGSAP || prefersReduced || !window.matchMedia("(pointer: fine)").matches) return;
    root.querySelectorAll(".important-text:not([data-important-bound]), [data-text-drift]:not([data-important-bound])").forEach((el) => {
      el.dataset.importantBound = "true";
      el.addEventListener("mousemove", (event) => {
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        gsap.to(el, {
          x: x * 10,
          y: y * 6,
          rotate: x * 0.45,
          letterSpacing: "0.005em",
          duration: 0.36,
          ease: "power3.out"
        });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { x: 0, y: 0, rotate: 0, letterSpacing: "", duration: 0.5, ease: "elastic.out(1, 0.55)" });
      });
    });
  };

  const bindInteractions = () => {
    document.querySelectorAll(".glossary-chip").forEach((button) => {
      button.addEventListener("click", () => {
        activateButtons(".glossary-chip", button);
        renderTerm(button.dataset.term);
      });
    });

    document.querySelectorAll(".inline-term").forEach((button) => {
      button.addEventListener("click", () => {
        const target = document.querySelector(`[data-term="${button.dataset.term}"].glossary-chip`);
        if (target) {
          activateButtons(".glossary-chip", target);
          renderTerm(button.dataset.term);
          document.querySelector("#glossary")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    document.querySelectorAll(".playbook-tab").forEach((button) => {
      button.addEventListener("click", () => {
        activateButtons(".playbook-tab", button);
        renderScenario(button.dataset.scenario);
      });
    });

    document.querySelectorAll("[data-effect-card]").forEach((card) => {
      const activateEffect = () => {
        document.querySelectorAll("[data-effect-card]").forEach((item) => {
          const active = item === card;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
        });
        renderEffectDetail(card.dataset.effect);
      };
      card.addEventListener("click", activateEffect);
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activateEffect();
        }
      });
    });

    document.addEventListener("click", (event) => {
      const copyButton = event.target.closest(".copy-command");
      if (copyButton) {
        copyText(copyButton.dataset.copy || "", copyButton);
      }
    });

    document.querySelectorAll(".resource-card[data-category]").forEach((card) => {
      const openCategory = () => {
        renderLibrary(card.dataset.category);
        document.querySelectorAll(".library-filter").forEach((button) => {
          const active = button.dataset.category === card.dataset.category;
          button.classList.toggle("is-active", active);
          button.setAttribute("aria-selected", active ? "true" : "false");
        });
        document.querySelector("#library")?.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      card.addEventListener("click", openCategory);
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openCategory();
        }
      });
    });

    document.querySelector("#library-filters")?.addEventListener("click", (event) => {
      const button = event.target.closest(".library-filter");
      if (!button) return;
      activateButtons(".library-filter", button);
      renderLibrary(button.dataset.category);
    });

    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-jump-category]");
      if (!button) return;
      const category = button.dataset.jumpCategory;
      renderLibrary(category);
      document.querySelectorAll(".library-filter").forEach((filter) => {
        const active = filter.dataset.category === category;
        filter.classList.toggle("is-active", active);
        filter.setAttribute("aria-selected", active ? "true" : "false");
      });
      document.querySelector("#library")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  renderCommands();
  renderLibraryFilters();
  renderLibrary();
  bindInteractions();

  document.body.classList.add("is-loading");
  const readyFallback = window.setTimeout(() => {
    const curtain = document.querySelector(".load-curtain");
    if (curtain) curtain.style.display = "none";
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    setReady();
  }, 1600);

  const startMotion = () => {
  if (!prefersReduced && hasGSAP && hasScrollTrigger) {
    window.clearTimeout(readyFallback);
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(".load-curtain span", { yPercent: 90, opacity: 0 });
    gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: setReady })
      .to(".load-curtain span", { yPercent: 0, opacity: 1, duration: 0.75 })
      .to(".load-curtain", { clipPath: "inset(0 0 100% 0)", duration: 1.15, ease: "expo.inOut" }, "+=0.12")
      .from(".site-header", { y: -26, opacity: 0, duration: 0.9 }, "-=0.55");
  } else {
    const curtain = document.querySelector(".load-curtain");
    if (curtain) curtain.style.display = "none";
    setReady();
  }

  if (prefersReduced || !hasGSAP || !hasScrollTrigger) {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  let lenis;
  if (hasLenis) {
    lenis = new Lenis({
      duration: 1.24,
      smoothWheel: true,
      wheelMultiplier: 0.86,
      touchMultiplier: 1.1,
      lerp: 0.085
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  if (hasSplitType) {
    document.querySelectorAll(".split-title").forEach((title) => {
      const split = new SplitType(title, { types: "chars" });
      const targets = split.chars;
      targets.forEach((char) => char.setAttribute("aria-hidden", "true"));
      gsap.set(targets, { yPercent: 112, opacity: 0, rotateX: 26, transformOrigin: "0 70%" });
      gsap.to(targets, {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.05,
        ease: "expo.out",
        stagger: 0.018,
        scrollTrigger: { trigger: title, start: "top 82%", once: true }
      });
    });
  }

  gsap.utils.toArray("[data-reveal]").forEach((el, index) => {
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.88,
      ease: "power3.out",
      delay: index < 4 ? index * 0.05 : 0,
      scrollTrigger: { trigger: el, start: "top 86%", once: true }
    });
  });

  gsap.utils.toArray(".image-scale img").forEach((img) => {
    if (img.closest(".stack-poster")) return;
    gsap.to(img, {
      scale: 1,
      ease: "none",
      scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: 0.8 }
    });
  });

  gsap.utils.toArray("[data-parallax]").forEach((el) => {
    const depth = Number(el.dataset.parallax || 0.12);
    gsap.to(el, {
      yPercent: -100 * depth,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
    });
  });

  let activeChapter = "";
  const updateChapter = (chapter) => {
    const title = document.querySelector(".chapter-indicator__title");
    const bar = document.querySelector(".chapter-indicator__bar span");
    if (!title || !bar) return;
    const nextChapter = chapter || "浏览";
    if (activeChapter === nextChapter) return;
    activeChapter = nextChapter;
    title.textContent = nextChapter;
    gsap.fromTo(title, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28, ease: "power3.out" });
    gsap.fromTo(bar, { scaleX: 0.2 }, { scaleX: Math.random() * 0.35 + 0.45, duration: 0.45, ease: "power3.out" });
  };

  const trackedSections = gsap.utils.toArray(".tracked-section");
  const syncChapterFromViewport = () => {
    const focusY = window.innerHeight * 0.52;
    const current = trackedSections
      .map((section) => ({ section, rect: section.getBoundingClientRect() }))
      .filter(({ rect }) => rect.top <= focusY && rect.bottom >= focusY)
      .sort((a, b) => Math.abs(a.rect.top) - Math.abs(b.rect.top))[0];
    if (current) updateChapter(current.section.dataset.chapter);
  };

  ScrollTrigger.create({
    trigger: document.documentElement,
    start: 0,
    end: "max",
    onUpdate: syncChapterFromViewport,
    onRefresh: syncChapterFromViewport
  });
  window.addEventListener("scroll", syncChapterFromViewport, { passive: true });
  if (lenis) lenis.on("scroll", syncChapterFromViewport);

  if (window.matchMedia("(min-width: 861px)").matches) {
    const intro = gsap.timeline({
      scrollTrigger: { trigger: ".pinned--intro", start: "top top", end: "+=160%", pin: true, scrub: 0.9 }
    });

    intro
      .fromTo(".pinned--intro .pin-copy", { y: 34, opacity: 0.68 }, { y: 0, opacity: 1, duration: 0.24 }, 0)
      .to(".pinned--intro .mask-frame", { clipPath: "inset(0% 0% 0% 0%)", scale: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.1)
      .to(".pinned--intro .mask-frame img", { scale: 1.03, duration: 0.5 }, 0.28)
      .to(".pinned--intro .layer-one", { yPercent: 95, xPercent: -28, rotate: -8, duration: 0.7 }, 0)
      .to(".pinned--intro .layer-two", { yPercent: -70, xPercent: 24, rotate: 10, duration: 0.7 }, 0)
      .to(".pinned--intro .pin-copy", { y: -44, opacity: 0.52, duration: 0.22 }, 0.82)
      .to(".pinned--intro .mask-frame", { clipPath: "inset(12% 5% 12% 5%)", scale: 0.92, opacity: 0.84, duration: 0.22 }, 0.82);
  } else {
    gsap.set(".pinned--intro .pin-copy, .pinned--intro .mask-frame, .pinned--intro .mask-frame img", { clearProps: "transform,opacity,clipPath" });
  }

  gsap.fromTo(".resource-card",
    { y: 80, opacity: 0, clipPath: "inset(34% 0 0 0)" },
    { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".resource-track", start: "top 82%", once: true } }
  );

  gsap.fromTo(".effect-card",
    { y: 72, opacity: 0, clipPath: "inset(28% 0 0 0)" },
    { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 0.82, ease: "expo.out", stagger: 0.075, scrollTrigger: { trigger: ".effect-grid", start: "top 84%", once: true } }
  );

  const stackSteps = gsap.utils.toArray(".stack-step");
  const stackTrack = document.querySelector(".stack-steps");
  const stackWindow = document.querySelector(".stack-steps-window");
  const stackTravel = () => {
    if (!stackTrack || !stackWindow) return 0;
    return Math.max(0, stackTrack.scrollHeight - stackWindow.clientHeight);
  };
  const setActiveStackStep = (progress) => {
    const maxIndex = Math.max(stackSteps.length - 1, 0);
    const normalizedProgress = Math.min(1, Math.max(0, (progress - 0.18) / 0.68));
    const activeIndex = Math.min(maxIndex, Math.round(normalizedProgress * maxIndex));
    stackSteps.forEach((step, index) => step.classList.toggle("is-active", index === activeIndex));
  };

  setActiveStackStep(0);

  if (window.matchMedia("(min-width: 861px)").matches) {
    const stack = gsap.timeline({
      scrollTrigger: {
        trigger: ".pinned--stack",
        start: "top top",
        end: () => `+=${Math.max(1700, stackSteps.length * 430)}`,
        pin: true,
        scrub: 0.85,
        invalidateOnRefresh: true,
        onUpdate: (self) => setActiveStackStep(self.progress),
        onLeave: () => setActiveStackStep(1),
        onLeaveBack: () => setActiveStackStep(0)
      }
    });

    stack
      .fromTo(".pinned--stack .stack-list", { y: 28, opacity: 0.96 }, { y: 0, opacity: 1, duration: 0.16, ease: "power2.out" }, 0)
      .fromTo(".stack-steps-window", { clipPath: "inset(0 0 22% 0)", opacity: 0.78 }, { clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 0.22, ease: "power3.out" }, 0.02)
      .fromTo(".stack-step", { x: -44, opacity: 0, clipPath: "inset(0 100% 0 0)" }, { x: 0, opacity: 1, clipPath: "inset(0 0% 0 0)", stagger: 0.1, duration: 0.42, ease: "power3.out" }, 0.06)
      .to(".stack-steps", { y: () => -stackTravel(), duration: 0.68, ease: "none" }, 0.28)
      .fromTo(".stack-poster", { scale: 0.92, yPercent: 0, opacity: 0.72, clipPath: "inset(14% 18% 14% 18%)" }, { scale: 1, yPercent: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.34, ease: "power2.out" }, 0)
      .to(".stack-poster img", { scale: 1.035, duration: 0.72, ease: "none" }, 0.16)
      .to(".pinned--stack .pin-stage", { clipPath: "inset(0 0 100% 0)", opacity: 0.08, y: -34, duration: 0.12, ease: "power2.inOut" }, 0.9)
      .to(".stack-poster", { clipPath: "inset(5% 7% 5% 7%)", scale: 0.985, duration: 0.12, ease: "power2.inOut" }, 0.88);
  } else {
    stackSteps.forEach((step) => {
      gsap.set(step, { clearProps: "transform,opacity,clipPath" });
    });
  }

  const commandCards = gsap.utils.toArray(".command-block");
  const terminalLines = gsap.utils.toArray(".terminal-line");
  const commandGrid = document.querySelector("#commands-grid");
  const commandWindow = document.querySelector(".commands-window");
  const commandTravel = () => {
    if (!commandGrid || !commandWindow) return 0;
    return Math.max(0, commandGrid.scrollHeight - commandWindow.clientHeight + 18);
  };
  const setActiveCommand = (progress) => {
    const maxIndex = Math.max(commandCards.length - 1, 0);
    const activeIndex = Math.min(maxIndex, Math.round(progress * maxIndex));
    commandCards.forEach((card, index) => card.classList.toggle("is-active", index === activeIndex));
    terminalLines.forEach((line, index) => line.classList.toggle("is-active", index === activeIndex || (activeIndex >= terminalLines.length && index === terminalLines.length - 1)));
  };

  setActiveCommand(0);

  if (window.matchMedia("(min-width: 861px)").matches) {
    const commandsTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".pinned--commands",
        start: "top top",
        end: () => `+=${Math.max(1600, commandCards.length * 420)}`,
        pin: true,
        scrub: 0.85,
        invalidateOnRefresh: true,
        onUpdate: (self) => setActiveCommand(self.progress),
        onLeave: () => setActiveCommand(1),
        onLeaveBack: () => setActiveCommand(0)
      }
    });

    commandsTimeline
      .fromTo(".commands-copy .section-head", { y: 0, opacity: 1 }, { y: 0, opacity: 1, duration: 0.18 }, 0)
      .to("#commands-grid", { y: () => -commandTravel(), ease: "none", duration: 0.82 }, 0.08)
      .to(".terminal-panel__progress span", { scaleX: 1, ease: "none", duration: 0.82 }, 0.08)
      .to(".terminal-panel", { rotate: -0.6, yPercent: -2, scale: 0.985, duration: 0.6 }, 0.2)
      .to(".command-lens", { yPercent: -22, xPercent: -10, rotate: -4, duration: 0.82 }, 0.08)
      .to(".commands-copy .section-head", { y: -28, opacity: 0.62, duration: 0.18 }, 0.84);
  } else {
    terminalLines.forEach((line, index) => line.classList.toggle("is-active", index === 0));
  }

  gsap.to(".floating-note", {
    y: (i) => [-26, 20, -18][i] || -18,
    x: (i) => [18, -22, 12][i] || 10,
    rotate: (i) => [-3, 2, -1][i] || 1,
    duration: 3.4,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    stagger: 0.32
  });

  const cursor = document.querySelector(".cursor-orbit");
  if (cursor && window.matchMedia("(pointer: fine)").matches) {
    const quickX = gsap.quickTo(cursor, "x", { duration: 0.38, ease: "power3.out" });
    const quickY = gsap.quickTo(cursor, "y", { duration: 0.38, ease: "power3.out" });
    window.addEventListener("pointermove", (event) => {
      cursor.classList.add("is-active");
      quickX(event.clientX);
      quickY(event.clientY);
    }, { passive: true });
    window.addEventListener("pointerdown", () => cursor.classList.add("is-pressed"));
    window.addEventListener("pointerup", () => cursor.classList.remove("is-pressed"));
  }

  const bindMagnetic = (root = document) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    root.querySelectorAll(".magnetic:not([data-magnetic-bound])").forEach((el) => {
      el.dataset.magneticBound = "true";
      const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "elastic.out(1, 0.45)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "elastic.out(1, 0.45)" });
      el.addEventListener("mousemove", (event) => {
        const rect = el.getBoundingClientRect();
        xTo((event.clientX - rect.left - rect.width / 2) * 0.22);
        yTo((event.clientY - rect.top - rect.height / 2) * 0.32);
      });
      el.addEventListener("mouseleave", () => {
        xTo(0);
        yTo(0);
      });
    });
  };

  bindImportantText();
  bindMagnetic();

  const observer = new MutationObserver(() => {
    bindImportantText();
    bindMagnetic();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
  window.setTimeout(() => ScrollTrigger.refresh(), 250);
  };

  loadMotionLibraries().then(startMotion);
})();
