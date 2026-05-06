const anime = window.anime;
const { animate, createTimeline, stagger } = anime;
const Lenis = window.Lenis;

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
const params = new URLSearchParams(window.location.search);

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      return null;
    }
  }
};

const normalizeLanguage = (language) => ["en", "zh"].includes(language) ? language : null;
const normalizeTheme = (theme) => ["light", "dark"].includes(theme) ? theme : null;
const CONTACT_EMAIL = "connor0529@outlook.com";
const CONTACT_PHONE = "15754077657";

const state = {
  activeSequenceIndex: -1,
  introPlayed: false,
  language: normalizeLanguage(params.get("lang")) || normalizeLanguage(storage.get("nova-language")) || "en",
  theme: normalizeTheme(params.get("theme")) || normalizeTheme(storage.get("nova-theme")) || "light",
  countersStarted: false,
  reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  floatingNodes: [],
  lenis: null
};

const sequenceObjectStates = [
  {
    bag: { x: "-2vw", y: "2vh", rotate: "-14deg", scale: 1.16, opacity: 1, z: 4, blur: 0, shadow: 1.05 },
    tube: { x: "1vw", y: "13vh", rotate: "-2deg", scale: 0.82, opacity: 0.44, z: 2, blur: 0.7, shadow: 0.72 },
    box: { x: "-1vw", y: "5vh", rotate: "8deg", scale: 0.76, opacity: 0.36, z: 1, blur: 1, shadow: 0.64 },
    card: { x: "-7vw", y: "5vh", rotate: "-6deg", scale: 0.86, opacity: 0.5, z: 3, blur: 0.4, shadow: 0.78 }
  },
  {
    bag: { x: "-7vw", y: "8vh", rotate: "-11deg", scale: 0.86, opacity: 0.4, z: 2, blur: 1.1, shadow: 0.7 },
    tube: { x: "-1vw", y: "7vh", rotate: "2deg", scale: 1.18, opacity: 1, z: 4, blur: 0, shadow: 1.04 },
    box: { x: "-2vw", y: "2vh", rotate: "7deg", scale: 0.82, opacity: 0.43, z: 1, blur: 0.8, shadow: 0.7 },
    card: { x: "-7vw", y: "4vh", rotate: "-2deg", scale: 0.88, opacity: 0.48, z: 3, blur: 0.5, shadow: 0.76 }
  },
  {
    bag: { x: "-9vw", y: "11vh", rotate: "-9deg", scale: 0.78, opacity: 0.32, z: 1, blur: 1.3, shadow: 0.62 },
    tube: { x: "-5vw", y: "13vh", rotate: "9deg", scale: 0.82, opacity: 0.36, z: 2, blur: 1, shadow: 0.66 },
    box: { x: "-4vw", y: "5vh", rotate: "-8deg", scale: 1.12, opacity: 1, z: 4, blur: 0, shadow: 1.02 },
    card: { x: "-8vw", y: "4vh", rotate: "5deg", scale: 0.92, opacity: 0.5, z: 3, blur: 0.4, shadow: 0.78 }
  },
  {
    bag: { x: "-11vw", y: "12vh", rotate: "-10deg", scale: 0.76, opacity: 0.28, z: 1, blur: 1.4, shadow: 0.6 },
    tube: { x: "-6vw", y: "14vh", rotate: "8deg", scale: 0.78, opacity: 0.3, z: 2, blur: 1.2, shadow: 0.62 },
    box: { x: "-6vw", y: "5vh", rotate: "-10deg", scale: 0.72, opacity: 0.32, z: 1, blur: 1.1, shadow: 0.62 },
    card: { x: "-3vw", y: "-2vh", rotate: "-4deg", scale: 1.14, opacity: 1, z: 4, blur: 0, shadow: 1.04 }
  }
];

document.documentElement.dataset.lang = state.language;
document.documentElement.dataset.theme = state.theme;

const copy = {
  en: {
    "nav.services": "Services",
    "nav.process": "Process",
    "nav.work": "Work",
    "nav.brief": "Brief",
    "nav.contact": "Contact",
    "nav.cta": "Start a brief",
    "brand.name": "NOVA Atelier",
    "brand.sub": "Digital brand systems",
    "hero.eyebrow": "NOVA Atelier / strategy, identity, motion, launch",
    "hero.title1": "Motion that sharpens",
    "hero.title2": "how a brand is felt",
    "hero.intro": "A focused web studio for brands that need identity, product storytelling, and motion to work as one system. From first impression to inquiry, every section is shaped to feel deliberate, useful, and memorable.",
    "hero.primary": "View selected work",
    "hero.secondary": "Book a discovery call",
    "hero.metric1": "page systems planned for launch, product, and service brands",
    "hero.metric2": "core sections structured for clarity, conversion, and trust",
    "hero.metric3": "weeks for a focused concept-to-launch build",
    "hero.stageLabel1": "Selected materials",
    "hero.stageLabel2": "identity objects / pack studies / launch assets",
    "marquee.1": "brand strategy",
    "marquee.2": "motion identity",
    "marquee.3": "digital commerce",
    "marquee.4": "editorial systems",
    "marquee.5": "art direction",
    "marquee.6": "product storytelling",
    "marquee.7": "launch campaigns",
    "process.eyebrow": "Approach",
    "process.title": "One system, staged to reveal itself with precision.",
    "process.intro": "Strong brand websites are not just arranged well. They pace attention, frame product value, and modulate energy as the story deepens. Our process lets the visual world evolve while the message grows more exact.",
    "step1.title": "Establish an aesthetic logic.",
    "step1.body": "We define the visual tension, scale behavior, type rhythm, and object language that give the brand a point of view before any interface starts speaking.",
    "step1.word": "Aesthetics",
    "step1.caption": "Visual language that feels immediate, legible, and hard to confuse with anyone else.",
    "step2.title": "Turn taste into a repeatable system.",
    "step2.body": "The motion grammar, layout constraints, icon behavior, and product framing become a reusable structure instead of a one-off landing page performance.",
    "step2.word": "Systems",
    "step2.caption": "Rules that let motion, components, and campaigns remain coherent across releases.",
    "step3.title": "Let motion direct attention.",
    "step3.body": "Scroll is treated as choreography. Product assets glide, scale, and rotate to carry meaning while the typography tightens around each claim.",
    "step3.word": "Motion",
    "step3.caption": "Movement that clarifies hierarchy, mood, and product importance without theatrical excess.",
    "step4.title": "Finish with commercial clarity.",
    "step4.body": "By the final sections, the site should feel sharper than the opening impression: more specific, more persuasive, and easier to act on.",
    "step4.word": "Clarity",
    "step4.caption": "A final presentation layer that converts attention into inquiries, trust, and purchase intent.",
    "sequence.tag": "Live composition",
    "services.eyebrow": "Services",
    "services.title": "A complete digital presence, built from strategy to motion detail.",
    "services.intro": "The work combines the parts that make a premium site feel real: positioning, visual identity, product or service pages, interaction states, launch assets, and a contact flow that can actually turn attention into conversation.",
    "service1.tag": "Strategy",
    "service1.title": "Positioning and page strategy",
    "service1.body": "Define the offer, audience, proof points, page hierarchy, and calls to action before the visual layer starts making promises.",
    "service2.tag": "Identity",
    "service2.title": "Identity system and art direction",
    "service2.body": "Build a practical visual language for typography, spacing, colors, object treatments, icons, cards, and reusable layout rules.",
    "service3.tag": "Digital",
    "service3.title": "Responsive website and interaction design",
    "service3.body": "Design desktop and mobile views with smooth scroll behavior, animated reveals, filterable work, forms, theme switching, and language states.",
    "service4.tag": "Launch",
    "service4.title": "Launch polish and conversion flow",
    "service4.body": "Prepare the inquiry path, email handoff, launch copy, selected work blocks, and final animation tuning so the site feels finished rather than decorative.",
    "work.eyebrow": "Selected work",
    "work.title": "Selected directions for brands that need a sharper digital surface.",
    "work.intro": "These sample cases show how the same system can adapt across commerce, wellness, editorial, and service-led brands while keeping the experience polished and easy to scan.",
    "filter.all": "All",
    "filter.beauty": "Beauty",
    "filter.wellness": "Wellness",
    "filter.culture": "Culture",
    "filter.commerce": "Commerce",
    "project1.meta": "Beauty / launch commerce",
    "project1.body": "A beauty launch direction with packaging-inspired objects, product detail motion, ingredient storytelling, and a homepage built around a clear nightly ritual.",
    "project2.meta": "Wellness / premium essentials",
    "project2.body": "A wellness system with calmer spacing, subscription-ready messaging, soft motion, and trust-building content blocks for a daily routine brand.",
    "project3.meta": "Culture / editorial platform",
    "project3.body": "An editorial platform direction with a strong archive structure, issue-based browsing, live event modules, and a visual rhythm suited to long-form culture content.",
    "project4.meta": "Commerce / seasonal release",
    "project4.body": "A commerce release concept with collection cards, gifting moments, campaign timing, and animated states that make product discovery feel more intentional.",
    "project5.meta": "Wellness / ritual pantry",
    "project5.body": "A pantry-to-checkout story with calmer replenishment cues, ingredient indexing, and product grouping designed around daily rituals instead of generic categories.",
    "project6.meta": "Culture / membership commerce",
    "project6.body": "A membership-led reading platform that blends editorial issues, subscriber releases, and event drops into one paced browsing system.",
    "project7.meta": "Commerce / premium essentials",
    "project7.body": "A premium essentials storefront with layered product bundles, launch pacing, and a softer conversion path that keeps utility feeling elevated.",
    "project8.meta": "Beauty / sensorial care",
    "project8.body": "A sensorial skincare direction with slower reveals, ingredient-led storytelling, and product moments tuned to feel quieter but more deliberate.",
    "brief.eyebrow": "Project brief",
    "brief.title": "Shape the scope and get a cleaner project direction.",
    "brief.intro": "The live estimator turns a few choices into a practical starting point: delivery rhythm, likely investment range, and the parts of the system that deserve the most attention.",
    "form.stage": "Brand stage",
    "form.stage.launch": "New launch",
    "form.stage.refresh": "Rebrand or refresh",
    "form.stage.scale": "Scaling an existing system",
    "form.surface": "Primary surface",
    "form.surface.site": "Editorial website",
    "form.surface.commerce": "Commerce launch page",
    "form.surface.campaign": "Campaign microsite",
    "form.timeline": "Desired timeline",
    "form.timeline.steady": "8 to 12 weeks",
    "form.timeline.fast": "4 to 6 weeks",
    "form.timeline.expanded": "12 to 16 weeks",
    "form.include": "Include",
    "form.extra.motion": "Motion system",
    "form.extra.packaging": "Packaging studies",
    "form.extra.content": "Content direction",
    "form.extra.campaign": "Launch campaign assets",
    "summary.tag": "Suggested fit",
    "summary.engagement": "Estimated engagement",
    "summary.cadence": "Recommended cadence",
    "summary.copyButton": "Copy project brief",
    "summary.emailButton": "Email this brief",
    "summary.copied": "Brief copied",
    "summary.unavailable": "Copy unavailable",
    "summary.core": "Core website build",
    "summary.signature": "Signature launch system",
    "summary.system": "Extended brand system",
    "summary.cadence.weekly": "Weekly design review",
    "summary.cadence.sprint": "Weekly design + strategy sprint",
    "summary.cadence.fast": "Compressed sprint with twice-weekly checkpoints",
    "summary.cadence.phased": "Phased release with strategy, design, and launch staging",
    "summary.copy.default": "A focused site release with a more disciplined visual system and enough motion to make the brand feel intentional from the first scroll.",
    "summary.copy.commerce": "Built for a conversion-driven launch with stronger product framing, clearer hierarchy, and motion states that sharpen commercial intent.",
    "summary.copy.campaign": "A paced narrative release centered on a moment, a message, or a campaign window that needs more distinction and momentum.",
    "summary.copy.scale": "Best for brands growing into a broader ecosystem and needing a system that can sustain repeated launches, not just a single release.",
    "summary.line.story": "Story framework and launch hierarchy",
    "summary.line.motion": "Motion-led homepage and detail surfaces",
    "summary.line.packaging": "Packaging and object studies to expand the product world",
    "summary.line.content": "Content direction and message hierarchy for launch clarity",
    "summary.line.campaign": "Launch campaign assets and release support",
    "summary.line.refine": "Visual refinements that keep the system coherent across every key touchpoint",
    "contact.eyebrow": "Contact",
    "contact.title": "Ready to turn the idea into a real website?",
    "contact.intro": "Send the project direction, current stage, and the result you want the site to create. The first reply can focus on structure, timeline, and what should be designed first.",
    "contact.name": "Name",
    "contact.name.placeholder": "Your name",
    "contact.email": "Email",
    "contact.email.placeholder": "you@brand.com",
    "contact.brand": "Brand",
    "contact.brand.placeholder": "Brand or company",
    "contact.budget": "Budget range",
    "contact.challenge": "What needs to change?",
    "contact.challenge.placeholder": "Tell us what the brand needs to feel, fix, or launch.",
    "contact.submit": "Prepare inquiry email",
    "contact.feedback": "Your email app should open with the inquiry drafted to Connor.",
    "contact.location": "Remote collaboration / China",
    "footer.line": "Digital brand systems, motion pages, and launch-ready web experiences.",
    "footer.top": "Back to top"
  },
  zh: {
    "nav.services": "服务",
    "nav.process": "流程",
    "nav.work": "作品",
    "nav.brief": "简报",
    "nav.contact": "联系",
    "nav.cta": "开始写简报",
    "brand.name": "NOVA工作室",
    "brand.sub": "数字品牌系统",
    "hero.eyebrow": "NOVA工作室 / 策略、身份、运动、发布",
    "hero.title1": "动作变得更锋利",
    "hero.title2": "品牌被真正感受",
    "hero.intro": "一个专注高级网页的数字品牌工作室，把身份设计、产品叙事和运动细节整合成同一套系统。从第一眼到咨询转化，每个区块都要有目的、有质感、也真的好用。",
    "hero.primary": "查看精选作品",
    "hero.secondary": "预约探索沟通",
    "hero.metric1": "适用于发布、产品和服务品牌的页面系统",
    "hero.metric2": "围绕清晰度、转化和信任设计的核心区块",
    "hero.metric3": "从概念到上线的聚焦建设周期",
    "hero.stageLabel1": "精选材料",
    "hero.stageLabel2": "身份物件 / 包装研究 / 发布资产",
    "marquee.1": "品牌战略",
    "marquee.2": "运动恒定",
    "marquee.3": "数字商务",
    "marquee.4": "编辑系统",
    "marquee.5": "美术指导",
    "marquee.6": "产品叙事",
    "marquee.7": "启动活动",
    "process.eyebrow": "方法",
    "process.title": "一个系统，按节奏精准展开。",
    "process.intro": "高级品牌网站不只是摆放得好看。它需要控制注意力、框住产品价值，并在故事深入时调节能量。我们的流程让视觉世界持续演化，同时让表达越来越准确。",
    "step1.title": "建立审美逻辑。",
    "step1.body": "先定义视觉张力、比例关系、字体节奏和物件语言，让品牌在界面开口前就拥有清晰态度。",
    "step1.word": "审美",
    "step1.caption": "一种即时、清晰，并且很难与别人混淆的视觉语言。",
    "step2.title": "把品味变成可复用系统。",
    "step2.body": "运动语法、布局约束、图标行为和产品呈现会变成可反复使用的结构，而不是一次性的落地页表演。",
    "step2.word": "系统",
    "step2.caption": "让运动、组件和活动在多次发布中仍然保持一致的规则。",
    "step3.title": "让运动引导注意力。",
    "step3.body": "滚动被当作编舞。产品资产漂移、缩放、旋转，承载意义，同时排版围绕每个主张收紧。",
    "step3.word": "运动",
    "step3.caption": "用不过度戏剧化的移动去澄清层级、情绪和产品重要性。",
    "step4.title": "以商业清晰度收束。",
    "step4.body": "到最后几个区块，网站应该比开场更锋利：更具体、更有说服力，也更容易让人行动。",
    "step4.word": "清晰",
    "step4.caption": "最终的呈现层，把注意力转化为咨询、信任和购买意图。",
    "sequence.tag": "实时构图",
    "services.eyebrow": "服务",
    "services.title": "从策略到运动细节，搭建完整的数字存在感。",
    "services.intro": "一个高级网站不是把东西摆满，而是把定位、视觉身份、产品或服务页面、交互状态、发布资产和咨询路径组合成能工作的系统。",
    "service1.tag": "策略",
    "service1.title": "定位与页面策略",
    "service1.body": "先明确项目卖点、目标受众、证明内容、页面层级和行动路径，再进入视觉和动画设计。",
    "service2.tag": "身份",
    "service2.title": "身份系统与视觉方向",
    "service2.body": "建立能落地的视觉语言：字体、间距、色彩、物件处理、图标、卡片和可复用布局规则。",
    "service3.tag": "数字",
    "service3.title": "响应式网页与交互设计",
    "service3.body": "设计桌面和移动端视图，并完成顺滑滚动、入场动画、作品筛选、表单、黑白主题和中英文状态。",
    "service4.tag": "发布",
    "service4.title": "上线打磨与转化路径",
    "service4.body": "完善咨询路径、邮件交接、上线文案、精选作品区和最终动画细节，让页面看起来不是演示稿，而是成品。",
    "work.eyebrow": "精选作品",
    "work.title": "为不同品牌方向准备的精选数字界面。",
    "work.intro": "这些案例方向展示同一套系统如何适配电商、健康、编辑内容和服务型品牌，同时保持高级感、可读性和转化效率。",
    "filter.all": "全部",
    "filter.beauty": "美妆",
    "filter.wellness": "健康",
    "filter.culture": "文化",
    "filter.commerce": "商业",
    "project1.meta": "美妆 / 发布电商",
    "project1.body": "美妆发布方向：包装式物件、产品详情动效、成分叙事和围绕夜间护理仪式展开的首页结构。",
    "project2.meta": "健康 / 高级日用品",
    "project2.body": "健康品牌系统：更舒展的间距、订阅转化信息、柔和运动和建立信任的日常护理内容区。",
    "project3.meta": "文化 / 编辑平台",
    "project3.body": "编辑平台方向：清晰档案结构、专题浏览、现场活动模块，以及适合长内容文化媒体的视觉节奏。",
    "project4.meta": "商业 / 季节发布",
    "project4.body": "商业发布概念：系列卡片、礼赠场景、活动节奏和让产品发现更有目的感的动画状态。",
    "project5.meta": "健康 / 仪式感货架",
    "project5.body": "从内容到下单的健康货架叙事，用更克制的补货提示、成分索引和按日常仪式组织的产品分组，替代普通分类页。",
    "project6.meta": "文化 / 会员制商业",
    "project6.body": "把专题阅读、会员发布和活动掉落揉进同一条浏览路径里，让文化内容和商业转化保持同一个节奏。",
    "project7.meta": "商业 / 高级日常用品",
    "project7.body": "一个更高级的日常用品店铺方向，用分层套组、发布节奏和更柔和的转化路径，让实用型商品也有被感受的空间。",
    "project8.meta": "美妆 / 感官护理",
    "project8.body": "更慢、更安静的护肤方向：围绕成分叙事、感官节奏和局部产品瞬间来组织页面，让细节更像真正的品牌体验。",
    "brief.eyebrow": "项目简报",
    "brief.title": "梳理项目范围，得到更清楚的建设方向。",
    "brief.intro": "这个实时估算器会把几个选择转成实际起点：交付节奏、预估投入，以及最值得优先设计的系统部分。",
    "form.stage": "品牌阶段",
    "form.stage.launch": "全新发布",
    "form.stage.refresh": "重塑或刷新",
    "form.stage.scale": "扩展现有系统",
    "form.surface": "主要界面",
    "form.surface.site": "编辑型网站",
    "form.surface.commerce": "电商发布页",
    "form.surface.campaign": "活动微网站",
    "form.timeline": "期望周期",
    "form.timeline.steady": "8 到 12 周",
    "form.timeline.fast": "4 到 6 周",
    "form.timeline.expanded": "12 到 16 周",
    "form.include": "包含",
    "form.extra.motion": "运动系统",
    "form.extra.packaging": "包装研究",
    "form.extra.content": "内容方向",
    "form.extra.campaign": "发布活动资产",
    "summary.tag": "推荐合作",
    "summary.engagement": "预估投入",
    "summary.cadence": "推荐节奏",
    "summary.copyButton": "复制项目简报",
    "summary.emailButton": "发送这份简报",
    "summary.copied": "简报已复制",
    "summary.unavailable": "暂时无法复制",
    "summary.core": "核心网站建设",
    "summary.signature": "标志性发布系统",
    "summary.system": "扩展品牌系统",
    "summary.cadence.weekly": "每周设计评审",
    "summary.cadence.sprint": "每周设计与策略冲刺",
    "summary.cadence.fast": "压缩冲刺，每周两次检查",
    "summary.cadence.phased": "分阶段发布：策略、设计与上线编排",
    "summary.copy.default": "适合一次聚焦的网站发布，用更克制的视觉系统和足够的运动感，让品牌从第一屏开始就显得有意图。",
    "summary.copy.commerce": "适合以转化为目标的发布，强化产品呈现、信息层级和能推动商业行动的运动状态。",
    "summary.copy.campaign": "适合围绕某个时刻、信息或活动窗口推进的叙事发布，需要更强的辨识度和势能。",
    "summary.copy.scale": "适合正在扩展为更大生态的品牌，需要能支撑反复发布的系统，而不只是单次页面。",
    "summary.line.story": "故事框架和发布层级",
    "summary.line.motion": "以运动驱动的首页和详情界面",
    "summary.line.packaging": "包装与物件研究，扩展产品世界",
    "summary.line.content": "内容方向和信息层级，提升发布清晰度",
    "summary.line.campaign": "发布活动资产和上线支持",
    "summary.line.refine": "让系统在关键触点保持一致的视觉精修",
    "contact.eyebrow": "联系",
    "contact.title": "准备把想法变成真正的网站了吗？",
    "contact.intro": "把项目方向、当前阶段和你希望网站带来的结果发来。第一次沟通可以先确认结构、周期和最应该优先设计的部分。",
    "contact.name": "姓名",
    "contact.name.placeholder": "你的名字",
    "contact.email": "邮箱",
    "contact.email.placeholder": "you@brand.com",
    "contact.brand": "品牌",
    "contact.brand.placeholder": "品牌或公司",
    "contact.budget": "预算范围",
    "contact.challenge": "什么需要改变？",
    "contact.challenge.placeholder": "告诉我们这个品牌需要被如何感受、修正或发布。",
    "contact.submit": "生成咨询邮件",
    "contact.feedback": "你的邮件应用应该会打开，并带好发给 Connor 的咨询内容。",
    "contact.location": "远程协作 / 中国",
    "footer.line": "数字品牌系统、运动页面和可上线的高级网页体验。",
    "footer.top": "回到顶部"
  }
};

function ensureHeroLineContent() {
  qsa(".hero-line").forEach((line) => {
    const value = copy[state.language][line.dataset.i18n] || line.textContent.trim();
    const inner = qs(".line-inner", line);

    if (inner) {
      inner.textContent = value;
      return;
    }

    line.textContent = "";
    const span = document.createElement("span");
    span.className = "line-inner";
    span.textContent = value;
    line.appendChild(span);
  });
}

function animateIntro({ replayLines = false } = {}) {
  const revealItems = qsa(".hero .reveal-item");
  ensureHeroLineContent();

  if (state.reduceMotion) {
    document.body.classList.add("intro-booted");
    qsa(".hero-line .line-inner").forEach((line) => {
      line.style.transform = "translateY(0)";
      line.style.opacity = "1";
    });
    revealItems.forEach((item) => {
      item.style.transform = "translateY(0)";
      item.style.opacity = "1";
    });
    return;
  }

  if (replayLines) {
    animate(".hero-line .line-inner", {
      translateY: ["108%", "0%"],
      opacity: [0, 1],
      duration: 760,
      ease: "outExpo",
      delay: stagger(90)
    });
    return;
  }

  document.body.classList.add("intro-booted");

  createTimeline({
    ease: "outExpo"
  })
  .add(".site-header", {
    translateY: [-18, 0],
    opacity: [0, 1],
    duration: 900,
    ease: "outExpo"
  })
  .add(".hero-line .line-inner", {
    translateY: ["118%", "0%"],
    opacity: [0, 1],
    duration: 1100,
    ease: "outExpo",
    delay: stagger(120)
  }, "-=500")
  .add(revealItems, {
    translateY: [24, 0],
    opacity: [0, 1],
    duration: 760,
    ease: "outExpo",
    delay: stagger(110)
  }, "-=720");

  state.introPlayed = true;
}

function rebuildHeroLines() {
  ensureHeroLineContent();
}

function animateElement(node, options) {
  if (state.reduceMotion) {
    return null;
  }

  return animate(node, options);
}

function animateFloatingObjects() {
  const frame = qs(".stage-frame");
  const items = qsa("[data-float]");

  state.floatingNodes = items.map((node, index) => ({
    node,
    amplitudeY: Number(node.dataset.floatY || 16),
    amplitudeRotate: Number(node.dataset.rotate || 4),
    depth: Number(node.dataset.depth || (index + 1)),
    pointerX: 0,
    pointerY: 0,
    targetPointerX: 0,
    targetPointerY: 0,
    pointerEase: 0.12 + index * 0.012,
    speed: 6200 + index * 380,
    phase: index * 0.92
  }));

  items.forEach((node, index) => {
    node.style.setProperty("--float-base-y", "0px");
    node.style.setProperty("--float-drift-y", "0px");
    node.style.setProperty("--float-drift-rotate", "0deg");
    node.style.setProperty("--float-pointer-x", "0px");
    node.style.setProperty("--float-pointer-y", "0px");
    node.style.setProperty("--float-intro-scale", "1");

    animateElement(node, {
      "--float-intro-scale": [0.92, 1],
      opacity: [0, 1],
      duration: 900,
      delay: 420 + index * 95,
      ease: "outExpo"
    });
  });

  if (!frame || state.reduceMotion) {
    return;
  }

  const updatePointerTarget = (event) => {
    const rect = frame.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }

    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    state.floatingNodes.forEach((item) => {
      item.targetPointerX = x * item.depth * 4;
      item.targetPointerY = y * item.depth * 3;
    });
  };

  frame.addEventListener("pointerenter", updatePointerTarget);
  frame.addEventListener("pointermove", updatePointerTarget);

  frame.addEventListener("pointerleave", () => {
    state.floatingNodes.forEach((item) => {
      item.targetPointerX = 0;
      item.targetPointerY = 0;
    });
  });
}

function setupRevealObserver() {
  const targets = qsa(".reveal-block");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.revealed) {
        return;
      }

      entry.target.dataset.revealed = "true";
      animate(entry.target, {
        translateY: [28, 0],
        opacity: [0, 1],
        duration: 860,
        ease: "outExpo"
      });
    });
  }, { threshold: 0.16 });

  targets.forEach((target) => observer.observe(target));
}

function setupCounters() {
  const stats = qsa("[data-count]");
  if (!stats.length) {
    return;
  }

  const run = () => {
    if (state.countersStarted) {
      return;
    }

    state.countersStarted = true;
    stats.forEach((stat) => {
      stat.textContent = stat.dataset.count;
    });

    if (state.reduceMotion) {
      return;
    }

    animate(qsa(".hero-metrics li"), {
      translateY: [10, 0],
      opacity: [0.86, 1],
      duration: 520,
      delay: stagger(80),
      ease: "outExpo"
    });
  };

  if (!("IntersectionObserver" in window)) {
    run();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      run();
      observer.disconnect();
    }
  }, {
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.04
  });

  stats.forEach((stat) => observer.observe(stat));
  window.setTimeout(run, 720);
}

function applyLanguage(language, animateChange = false) {
  state.language = language;
  storage.set("nova-language", language);
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.documentElement.dataset.lang = language;
  document.body.classList.toggle("lang-zh", language === "zh");

  const update = () => {
    qsa("[data-i18n]").forEach((node) => {
      const value = copy[language][node.dataset.i18n];
      if (value) {
        const inner = node.classList.contains("hero-line") ? qs(".line-inner", node) : null;
        if (inner) {
          inner.textContent = value;
        } else {
          node.textContent = value;
        }
      }
    });

    qsa("[data-i18n-placeholder]").forEach((node) => {
      const value = copy[language][node.dataset.i18nPlaceholder];
      if (value) {
        node.setAttribute("placeholder", value);
      }
    });

    qsa(".sequence-step").forEach((step) => {
      const wordKey = step.dataset.wordKey;
      const captionKey = step.dataset.captionKey;
      if (wordKey && copy[language][wordKey]) {
        step.dataset.word = copy[language][wordKey];
      }
      if (captionKey && copy[language][captionKey]) {
        step.dataset.caption = copy[language][captionKey];
      }
    });

    qsa(".sequence-number").forEach((button, index) => {
      const step = qsa(".sequence-step")[index];
      const wordNode = qs(".sequence-number-word", button);
      if (step && wordNode) {
        wordNode.textContent = step.dataset.word;
      }
    });

    qs(".brand-text strong").textContent = copy[language]["brand.name"];
    qs(".brand-text span").textContent = copy[language]["brand.sub"];
    const languageToggle = qs("[data-lang-toggle]");
    languageToggle.textContent = language === "zh" ? "EN" : "中文";
    languageToggle.setAttribute("aria-label", language === "zh" ? "Switch to English" : "切换到中文");
    rebuildHeroLines();
    if (state.introPlayed) {
      animateIntro({ replayLines: true });
    }
    state.activeSequenceIndex = -1;
    updateSequenceScene();
    document.dispatchEvent(new CustomEvent("nova:languagechange"));
  };

  if (!animateChange || state.reduceMotion) {
    update();
    return;
  }

  const targets = [".hero-copy", ".site-nav", ".site-controls", ".marquee-track", ".builder-layout", ".contact-layout"].join(",");
  animate(targets, {
    opacity: [1, 0],
    translateY: [0, 8],
    duration: 140,
    ease: "outQuad",
    onComplete: () => {
      update();
      animate(targets, {
        opacity: [0, 1],
        translateY: [-8, 0],
        duration: 340,
        ease: "outExpo"
      });
    }
  });
}

function applyTheme(theme, animateChange = false) {
  state.theme = theme;
  storage.set("nova-theme", theme);
  document.documentElement.dataset.theme = theme;
  document.body.classList.toggle("theme-dark", theme === "dark");
  const toggle = qs("[data-theme-toggle]");
  toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");

  if (!animateChange || state.reduceMotion) {
    return;
  }

  toggle.classList.add("is-switching");
  window.setTimeout(() => toggle.classList.remove("is-switching"), 420);

  const overlay = document.createElement("span");
  overlay.className = "theme-flash";
  document.body.appendChild(overlay);

  animate(overlay, {
    opacity: [0.34, 0],
    scale: [0.88, 1.12],
    duration: 520,
    ease: "outExpo",
    onComplete: () => overlay.remove()
  });

  animate(".stage-frame, .sequence-sticky, .service-card, .project-card, .builder-form, .builder-summary, .contact-form", {
    translateY: [4, 0],
    duration: 460,
    delay: stagger(18),
    ease: "outExpo"
  });
}

function setupDisplayControls() {
  applyLanguage(state.language);
  applyTheme(state.theme);

  qs("[data-lang-toggle]").addEventListener("click", () => {
    const toggle = qs("[data-lang-toggle]");
    toggle.classList.add("is-switching");
    window.setTimeout(() => toggle.classList.remove("is-switching"), 420);
    applyLanguage(state.language === "en" ? "zh" : "en", true);
  });

  qs("[data-theme-toggle]").addEventListener("click", () => {
    applyTheme(state.theme === "light" ? "dark" : "light", true);
  });
}

function updateHeaderState() {
  const header = qs(".site-header");
  header.classList.toggle("is-scrolled", window.scrollY > 30);
}

function getSequenceObjects() {
  return {
    bag: qs(".seq-bag"),
    tube: qs(".seq-tube"),
    box: qs(".seq-box"),
    card: qs(".seq-card")
  };
}

function setObjectTransform(node, values) {
  if (!node || !values) {
    return;
  }

  node.style.transform = `translate3d(${values.x}, ${values.y}, 0) rotate(${values.rotate}) scale(${values.scale})`;
  node.style.opacity = values.opacity;
  node.style.zIndex = values.z;
  node.style.setProperty("--seq-blur", `${values.blur || 0}px`);
  node.style.setProperty("--seq-shadow", values.shadow || 0.8);
}

function animateSequenceObjects(index) {
  const stateSet = sequenceObjectStates[index] || sequenceObjectStates[0];
  const objects = getSequenceObjects();
  const order = ["bag", "tube", "box", "card"];
  const primary = order[index] || "bag";
  const leadIndex = order.indexOf(primary);

  Object.entries(objects).forEach(([key, node]) => {
    const values = stateSet[key];
    if (!node || !values) {
      return;
    }

    node.classList.toggle("is-primary", key === primary);
    node.style.zIndex = values.z;
    node.style.setProperty("--seq-blur", `${values.blur || 0}px`);
    node.style.setProperty("--seq-shadow", values.shadow || 0.8);

    if (state.reduceMotion) {
      setObjectTransform(node, values);
      return;
    }

    animate(node, {
      translateX: values.x,
      translateY: values.y,
      rotate: values.rotate,
      scale: values.scale,
      opacity: values.opacity,
      duration: key === primary ? 960 : 720,
      delay: key === primary ? 70 : Math.abs(order.indexOf(key) - leadIndex) * 42,
      ease: key === primary ? "outElastic(1, .72)" : "outCubic"
    });
  });
}

function syncSequenceNumbers(steps) {
  qsa(".sequence-number").forEach((button, index) => {
    const step = steps[index];
    const wordNode = qs(".sequence-number-word", button);
    if (step && wordNode) {
      wordNode.textContent = step.dataset.word;
    }
  });
}

function setActiveSequence(index) {
  if (index === state.activeSequenceIndex) {
    return;
  }

  state.activeSequenceIndex = index;
  const steps = qsa(".sequence-step");
  const current = steps[index];
  const word = qs(".sequence-word");
  const caption = qs(".sequence-caption");
  const sticky = qs(".sequence-sticky");

  steps.forEach((step, stepIndex) => {
    step.classList.toggle("is-active", stepIndex === index);
  });

  qsa(".sequence-number").forEach((button, stepIndex) => {
    const isActive = stepIndex === index;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (sticky) {
    sticky.dataset.step = String(index + 1);
  }

  if (!current) {
    return;
  }

  syncSequenceNumbers(steps);
  caption.textContent = current.dataset.caption;
  animateSequenceObjects(index);
  animate(word, {
    opacity: [0.08, 1],
    translateY: [18, 0],
    duration: 680,
    ease: "outExpo",
    onBegin: () => {
      word.textContent = current.dataset.word;
    }
  });
}

function updateSequenceScene() {
  const section = qs(".sequence");
  if (!section) {
    return;
  }

  const steps = qsa(".sequence-step");
  const progressFill = qs(".sequence-progress-fill");
  if (!steps.length) {
    return;
  }

  const sectionTop = section.offsetTop;
  const total = Math.max(section.offsetHeight - window.innerHeight, 1);
  const progress = Math.min(Math.max((window.scrollY - sectionTop) / total, 0), 1);
  let closestIndex = 0;
  const activationLine = window.innerHeight * 0.5;

  steps.forEach((step, index) => {
    const rect = step.getBoundingClientRect();
    if (rect.top <= activationLine) {
      closestIndex = index;
    }
  });

  const stageCount = steps.length;
  const stageProgress = stageCount > 1 ? closestIndex / (stageCount - 1) : 1;

  document.documentElement.style.setProperty("--sequence-progress", progress.toFixed(4));
  document.documentElement.style.setProperty("--sequence-stage-progress", stageProgress.toFixed(4));
  if (progressFill) {
    progressFill.style.width = `${stageProgress * 100}%`;
  }

  setActiveSequence(closestIndex);
}

function setupNav() {
  const header = qs(".site-header");
  const nav = qs(".site-nav");
  const links = qsa(".site-nav a");
  const toggle = qs(".menu-toggle");
  const sections = qsa("main section[id]");
  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  qsa('a[href="#top"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      closeMenu();

      if (state.lenis && !state.reduceMotion) {
        state.lenis.scrollTo(0, { duration: 1.05 });
        return;
      }

      window.scrollTo({
        top: 0,
        behavior: state.reduceMotion ? "auto" : "smooth"
      });
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      links.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("is-active", isActive);
      });
    });
  }, {
    threshold: 0.45
  });

  sections.forEach((section) => observer.observe(section));

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

function setupSequenceControls() {
  const steps = qsa(".sequence-step");

  qsa(".sequence-number").forEach((button) => {
    button.addEventListener("click", () => {
      pulseControl(button, { scale: 0.965, duration: 340 });
      const index = Number(button.dataset.sequenceJump);
      const target = steps[index];
      if (!target) {
        return;
      }

      if (state.lenis && !state.reduceMotion) {
        state.lenis.scrollTo(target, {
          offset: -window.innerHeight * 0.28,
          duration: 1.1
        });
        return;
      }

      const targetY = target.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.28;
      window.scrollTo({
        top: targetY,
        behavior: state.reduceMotion ? "auto" : "smooth"
      });
    });
  });

  syncSequenceNumbers(steps);
}

function setupWorkFilters() {
  const buttons = qsa(".filter-button");
  const cards = qsa(".project-card");
  let activeFilter = "all";
  let filterVersion = 0;

  const clearCardMotion = (card) => {
    card.style.opacity = "";
    card.style.transform = "";
    delete card.dataset.filterVersion;
  };

  const applyFilter = (filter, options = {}) => {
    const { immediate = false } = options;
    if (!immediate && filter === activeFilter) {
      return;
    }

    activeFilter = filter;
    filterVersion += 1;
    const version = filterVersion;
    const visibleCards = [];

    buttons.forEach((node) => {
      const isActive = node.dataset.filter === filter;
      node.classList.toggle("is-active", isActive);
      node.setAttribute("aria-pressed", String(isActive));
    });

    cards.forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      const show = filter === "all" || tags.includes(filter);

      if (show) {
        card.classList.remove("is-hidden");
        card.setAttribute("aria-hidden", "false");
        card.hidden = false;
        card.inert = false;
        card.dataset.filterVersion = String(version);
        visibleCards.push(card);

        if (state.reduceMotion || immediate) {
          clearCardMotion(card);
        } else {
          card.style.opacity = "0.42";
          card.style.transform = "translate3d(0, 12px, 0) scale(0.992)";
        }
        return;
      }

      card.classList.add("is-hidden");
      card.setAttribute("aria-hidden", "true");
      card.inert = true;
      card.hidden = true;
      clearCardMotion(card);
    });

    if (state.reduceMotion || immediate || !visibleCards.length) {
      return;
    }

    animate(visibleCards, {
      opacity: [0.42, 1],
      translateY: [12, 0],
      scale: [0.992, 1],
      duration: 320,
      delay: stagger(22),
      ease: "outExpo",
      onComplete: () => {
        visibleCards.forEach((card) => {
          const stillCurrent = card.dataset.filterVersion === String(version);
          if (stillCurrent && !card.classList.contains("is-hidden")) {
            clearCardMotion(card);
          }
        });
      }
    });
  };

  buttons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
    button.addEventListener("click", () => {
      pulseControl(button, { scale: 0.96, duration: 300 });
      applyFilter(button.dataset.filter);
    });
  });

  applyFilter(activeFilter, { immediate: true });
}

function getBriefSummary(formData) {
  const extras = formData.getAll("extras");
  const surface = formData.get("surface");
  const stage = formData.get("brandStage");
  const timeline = formData.get("timeline");
  const t = copy[state.language];

  let baseMin = 28;
  let baseMax = 42;
  let tier = t["summary.core"];
  let cadence = t["summary.cadence.weekly"];
  let summaryCopy = t["summary.copy.default"];

  if (surface === "commerce") {
    baseMin += 8;
    baseMax += 10;
    tier = t["summary.signature"];
    summaryCopy = t["summary.copy.commerce"];
  }

  if (surface === "campaign") {
    baseMin += 4;
    baseMax += 8;
    summaryCopy = t["summary.copy.campaign"];
  }

  if (stage === "launch") {
    baseMin += 6;
    baseMax += 8;
    tier = t["summary.signature"];
  }

  if (stage === "scale") {
    baseMin += 10;
    baseMax += 16;
    tier = t["summary.system"];
    cadence = t["summary.cadence.sprint"];
    summaryCopy = t["summary.copy.scale"];
  }

  if (timeline === "fast") {
    baseMin += 4;
    baseMax += 6;
    cadence = t["summary.cadence.fast"];
  }

  if (timeline === "expanded") {
    baseMax += 10;
    cadence = t["summary.cadence.phased"];
  }

  const extraMap = {
    motion: { min: 4, max: 6, line: t["summary.line.motion"] },
    packaging: { min: 5, max: 9, line: t["summary.line.packaging"] },
    content: { min: 3, max: 5, line: t["summary.line.content"] },
    campaign: { min: 6, max: 10, line: t["summary.line.campaign"] }
  };

  const summaryList = [
    t["summary.line.story"]
  ];

  extras.forEach((item) => {
    const extra = extraMap[item];
    if (!extra) {
      return;
    }
    baseMin += extra.min;
    baseMax += extra.max;
    summaryList.push(extra.line);
  });

  if (summaryList.length < 3) {
    summaryList.push(t["summary.line.refine"]);
  }

  return {
    tier,
    range: `¥${baseMin}k - ¥${baseMax}k`,
    cadence,
    copy: summaryCopy,
    lines: summaryList.slice(0, 4)
  };
}

function setupBriefBuilder() {
  const form = qs("#brief-form");
  const summary = qs(".builder-summary");
  const tierNode = qs("#summary-tier");
  const rangeNode = qs("#summary-range");
  const cadenceNode = qs("#summary-cadence");
  const copyNode = qs("#summary-copy");
  const listNode = qs("#summary-list");
  const copyButton = qs("#copy-brief");
  const emailButton = qs("#email-brief");

  const render = (animated = false) => {
    const summary = getBriefSummary(new FormData(form));
    tierNode.textContent = summary.tier;
    rangeNode.textContent = summary.range;
    cadenceNode.textContent = summary.cadence;
    copyNode.textContent = summary.copy;
    listNode.innerHTML = summary.lines.map((line) => `<li>${line}</li>`).join("");

    const briefText = [
      `Project fit: ${summary.tier}`,
      `Estimated engagement: ${summary.range}`,
      `Recommended cadence: ${summary.cadence}`,
      "",
      summary.copy,
      "",
      ...summary.lines.map((line) => `- ${line}`)
    ].join("\n");

    emailButton.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Project brief from NOVA Atelier website")}&body=${encodeURIComponent(briefText)}`;
    copyButton.dataset.brief = briefText;

    if (animated && !state.reduceMotion) {
      animate(".builder-summary > *", {
        translateY: [10, 0],
        opacity: [0.52, 1],
        duration: 420,
        delay: stagger(28),
        ease: "outExpo"
      });
    }
  };

  form.addEventListener("change", () => {
    summary.classList.add("is-updating");
    window.setTimeout(() => summary.classList.remove("is-updating"), 260);
    render(true);
  });
  document.addEventListener("nova:languagechange", () => render(false));
  render();

  copyButton.addEventListener("click", async () => {
    const text = copyButton.dataset.brief || "";
    try {
      await navigator.clipboard.writeText(text);
      copyButton.textContent = copy[state.language]["summary.copied"];
      window.setTimeout(() => {
        copyButton.textContent = copy[state.language]["summary.copyButton"];
      }, 1800);
    } catch (error) {
      copyButton.textContent = copy[state.language]["summary.unavailable"];
      window.setTimeout(() => {
        copyButton.textContent = copy[state.language]["summary.copyButton"];
      }, 1800);
    }
  });
}

function pulseControl(target, options = {}) {
  if (!target || state.reduceMotion) {
    return;
  }

  const {
    scale = 0.97,
    duration = 280
  } = options;

  animate(target, {
    scale: [1, scale, 1],
    duration,
    ease: "outExpo",
    onComplete: () => {
      target.style.transform = "";
    }
  });
}

function setupProjectCards() {
  const cards = qsa(".project-card");

  cards.forEach((card, index) => {
    card.tabIndex = 0;

    const playPress = () => {
      card.classList.remove("is-pressed");
      void card.offsetWidth;
      card.classList.add("is-pressed");

      if (!state.reduceMotion) {
        animate(card, {
          scale: [1, 0.985, 1],
          translateY: [0, -2, 0],
          duration: 420,
          ease: "outExpo",
          onComplete: () => {
            card.style.transform = "";
          }
        });

        const image = qs(".project-visual img", card);

        animate(image, {
          scale: [1, 1.045, 1],
          rotate: [0, index % 2 === 0 ? -3 : 3, 0],
          translateY: [0, -10, 0],
          duration: 620,
          ease: "outExpo",
          onComplete: () => {
            image.style.transform = "";
          }
        });
      }

      window.setTimeout(() => card.classList.remove("is-pressed"), 440);
    };

    card.addEventListener("click", playPress);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        playPress();
      }
    });
  });
}

function setupFormMicroInteractions() {
  qsa(".check").forEach((check) => {
    const input = qs("input", check);
    if (!input) {
      return;
    }

    const sync = () => {
      check.classList.toggle("is-checked", input.checked);
    };

    sync();
    input.addEventListener("change", () => {
      sync();
      check.classList.add("is-toggling");
      window.setTimeout(() => check.classList.remove("is-toggling"), 260);
    });
  });

  qsa(".field input, .field textarea, .field select").forEach((field) => {
    field.addEventListener("change", () => {
      const wrap = field.closest(".field") || field;
      wrap.classList.remove("is-touched");
      void wrap.offsetWidth;
      wrap.classList.add("is-touched");
      window.setTimeout(() => wrap.classList.remove("is-touched"), 360);
    });
  });
}

function setupGlobalButtonMotion() {
  const selectors = ".button, .header-cta, .menu-toggle, .site-nav a, .contact-points a";

  qsa(selectors).forEach((node) => {
    const isLink = node.tagName === "A";
    const trigger = () => pulseControl(node, { scale: isLink ? 0.985 : 0.96, duration: 300 });

    node.addEventListener("pointerdown", trigger);
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        trigger();
      }
    });
  });
}

function setupContactForm() {
  const form = qs("#contact-form");
  const feedback = qs("#contact-feedback");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = data.get("name") || "A potential client";
    const email = data.get("email") || "";
    const brand = data.get("brand") || "Unnamed brand";
    const budget = data.get("budget") || "Not specified";
    const challenge = data.get("challenge") || "No challenge summary provided yet.";

    const subject = `${brand} inquiry for NOVA Atelier`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Brand: ${brand}`,
      `Budget: ${budget}`,
      `Reply to Connor: ${CONTACT_EMAIL} / ${CONTACT_PHONE}`,
      "",
      "Project notes:",
      challenge
    ].join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    feedback.textContent = copy[state.language]["contact.feedback"];
  });
}

function syncMotionPreference() {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const update = () => {
    state.reduceMotion = media.matches;
  };

  update();
  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", update);
    return;
  }

  if (typeof media.addListener === "function") {
    media.addListener(update);
  }
}

function loop() {
  if (!state.reduceMotion && state.floatingNodes.length) {
    const now = performance.now();
    state.floatingNodes.forEach((item) => {
      const progress = now / item.speed + item.phase;
      const driftY = Math.sin(progress) * item.amplitudeY;
      const driftRotate = Math.cos(progress * 0.92) * item.amplitudeRotate;
      item.pointerX += (item.targetPointerX - item.pointerX) * item.pointerEase;
      item.pointerY += (item.targetPointerY - item.pointerY) * item.pointerEase;
      if (Math.abs(item.targetPointerX - item.pointerX) < 0.01) {
        item.pointerX = item.targetPointerX;
      }
      if (Math.abs(item.targetPointerY - item.pointerY) < 0.01) {
        item.pointerY = item.targetPointerY;
      }
      item.node.style.setProperty("--float-drift-y", `${driftY.toFixed(2)}px`);
      item.node.style.setProperty("--float-drift-rotate", `${driftRotate.toFixed(2)}deg`);
      item.node.style.setProperty("--float-pointer-x", `${item.pointerX.toFixed(2)}px`);
      item.node.style.setProperty("--float-pointer-y", `${item.pointerY.toFixed(2)}px`);
    });
  }

  updateSequenceScene();
  requestAnimationFrame(loop);
}

function setupLenis() {
  if (!Lenis) {
    return;
  }

  const lenis = new Lenis({
    duration: 1.15,
    lerp: 0.08,
    smoothWheel: true,
    smoothTouch: false
  });
  state.lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

document.addEventListener("DOMContentLoaded", () => {
  syncMotionPreference();
  setupDisplayControls();
  setupLenis();
  animateIntro();
  animateFloatingObjects();
  setupRevealObserver();
  setupCounters();
  setupNav();
  setupSequenceControls();
  setupWorkFilters();
  setupProjectCards();
  setupFormMicroInteractions();
  setupGlobalButtonMotion();
  setupBriefBuilder();
  setupContactForm();
  updateSequenceScene();
  requestAnimationFrame(loop);
});
