/* ============================================================
   main.js — 赵纬信个人网站 · 统一脚本
   模块：
   1. 主题管理（深夜/白天，localStorage 持久化）
   2. 自定义光标
   3. 粒子画布背景
   4. 导航栏滚动效果
   5. 当前页面导航高亮
   6. 滚动显示（Intersection Observer）
   7. 技能条动画
   8. 交互终端（仅 index.html）
   9. 作品筛选（仅 works.html）
  10. 联系表单提示（仅 contact.html）
   ============================================================ */

/* ── 1. 主题管理 ────────────────────────────────────────── */

const ThemeManager = (() => {
  const KEY = 'zwx-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  function get() {
    return localStorage.getItem(KEY) || DARK;
  }

  function set(theme) {
    localStorage.setItem(KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleBtn(theme);
    // 更新粒子颜色
    if (window.ParticleCanvas) window.ParticleCanvas.updateTheme(theme);
  }

  function toggle() {
    set(get() === DARK ? LIGHT : DARK);
  }

  function updateToggleBtn(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const icon = btn.querySelector('.toggle-icon');
    const label = btn.querySelector('.toggle-label');
    if (theme === DARK) {
      icon.textContent = '☀';
      label.textContent = '白天';
    } else {
      icon.textContent = '🌙';
      label.textContent = '深夜';
    }
  }

  function init() {
    const current = get();
    document.documentElement.setAttribute('data-theme', current);
    updateToggleBtn(current);

    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', toggle);
  }

  return { init, get, set, toggle };
})();

/* ── 2. 自定义光标 ──────────────────────────────────────── */

const Cursor = (() => {
  let mx = 0, my = 0, rx = 0, ry = 0;
  let cursor, ring;

  function init() {
    cursor = document.getElementById('cursor');
    ring = document.getElementById('cursor-ring');
    if (!cursor || !ring) return;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      ring.style.opacity = '0.45';
    });

    // 悬停可点击元素时放大
    document.querySelectorAll('a, button, input, textarea, .skill-card, .project-card, .work-card, .filter-btn, .contact-link').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform += ' scale(2)';
        ring.style.opacity = '0.15';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.opacity = '0.45';
      });
    });

    animateRing();
  }

  function animateRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(animateRing);
  }

  return { init };
})();

/* ── 3. 粒子画布背景 ────────────────────────────────────── */

const ParticleCanvas = (() => {
  let canvas, ctx, W, H, particles = [], theme = 'dark';
  const COUNT = 110;

  const COLORS = {
    dark:  ['#7fff6e', '#6ee7ff', '#ffffff'],
    light: ['#1a9e0a', '#0077aa', '#333344'],
  };

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : (Math.random() > 0.5 ? -5 : H + 5);
      this.size = Math.random() * 1.4 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.28;
      this.speedY = (Math.random() - 0.5) * 0.28;
      this.opacity = Math.random() * 0.35 + 0.05;
      const palette = COLORS[theme] || COLORS.dark;
      this.color = palette[Math.floor(Math.random() * palette.length)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) {
        this.reset(false);
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function connectParticles() {
    const lineColor = theme === 'dark' ? '#7fff6e' : '#1a9e0a';
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 85) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 85) * 0.055;
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(loop);
  }

  function init() {
    canvas = document.getElementById('canvas-bg');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    theme = ThemeManager.get();
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());
    loop();
  }

  function updateTheme(newTheme) {
    theme = newTheme;
    particles.forEach(p => {
      const palette = COLORS[theme] || COLORS.dark;
      p.color = palette[Math.floor(Math.random() * palette.length)];
    });
  }

  return { init, updateTheme };
})();

// 挂到 window 供 ThemeManager 调用
window.ParticleCanvas = ParticleCanvas;

/* ── 4. 导航栏滚动效果 ──────────────────────────────────── */

function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* ── 5. 当前页面导航高亮 ────────────────────────────────── */

function initActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ── 6. 滚动显示 ────────────────────────────────────────── */

function initReveal() {
  const items = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // 技能条
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) {
          const level = entry.target.dataset.level || 0;
          setTimeout(() => { fill.style.width = level + '%'; }, 100);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // 交错延迟
  items.forEach((el, i) => {
    el.style.transitionDelay = (i % 5) * 0.08 + 's';
    observer.observe(el);
  });
}

/* ── 7. 技能条（备用，由 reveal 触发） ─────────────────── */
// 已整合进 initReveal，此处留空以备独立调用
function initSkillBars() {}

/* ── 8. 交互终端（index.html） ──────────────────────────── */

function initTerminal() {
  const input = document.getElementById('terminal-input');
  const body  = document.getElementById('terminal-body');
  if (!input || !body) return;

  const COMMANDS = {
    about: [
      '> 赵纬信，专科毕业，自学前端开发者。',
      '> 相信 AI 可以降低编程门槛，让更多人用代码表达创意。',
      '> 正在寻找实习机会，欢迎联系！',
    ],
    skills: [
      '> HTML5   ████████░░  75%',
      '> CSS3    ███████░░░  65%',
      '> JS      ██████░░░░  55%',
      '> AI辅助  █████████░  85%',
      '> Git     ███████░░░  60%',
    ],
    projects: [
      '> ✨ 个人动态网站（你正在浏览）',
      '> 🔧 AI对话笔记工具',
      '> 📖 前端学习路线图',
      '> → 访问 works.html 查看详情',
    ],
    contact: [
      '> 📧 访问 contact.html 发送消息',
      '> 🐙 github.com/connorlikewolf',
    ],
    help: [
      '> 可用命令: about · skills · projects · contact · clear · help',
    ],
  };

  function addLine(text, cls = 't-out') {
    const line = document.createElement('div');
    line.className = 'terminal-line ' + cls;
    line.textContent = text;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const cmd = input.value.trim().toLowerCase();
    input.value = '';
    if (!cmd) return;

    addLine('zwx@portfolio ~ ' + cmd, 't-cmd');

    if (cmd === 'clear') {
      body.innerHTML = '';
      addLine('终端已清空。输入 help 查看可用命令。');
      return;
    }

    const output = COMMANDS[cmd];
    if (output) {
      output.forEach((line, i) => {
        setTimeout(() => addLine(line), i * 75);
      });
    } else {
      addLine(`命令未找到: "${cmd}"。输入 help 查看可用命令。`);
    }
  });

  // 点击终端区域聚焦输入
  document.querySelector('.terminal')?.addEventListener('click', () => input.focus());
}

/* ── 9. 作品筛选（works.html） ──────────────────────────── */

function initWorksFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.work-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.opacity    = match ? '1' : '0.2';
        card.style.transform  = match ? ''  : 'scale(0.97)';
        card.style.pointerEvents = match ? '' : 'none';
      });
    });
  });
}

/* ── 10. 联系表单提示（contact.html） ───────────────────── */

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const note = form.querySelector('.form-note');
    btn.textContent = '已发送 ✓';
    btn.style.background = 'var(--accent2)';
    note.textContent = '感谢你的消息，我会尽快回复！';
    setTimeout(() => {
      btn.textContent = '发送消息';
      btn.style.background = '';
      note.textContent = '我通常在 24 小时内回复';
      form.reset();
    }, 3000);
  });
}

/* ── 初始化入口 ─────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Cursor.init();
  ParticleCanvas.init();
  initNavbar();
  initActiveNav();
  initReveal();
  initTerminal();
  initWorksFilter();
  initContactForm();
});
