// ========== 仪表板专用脚本 ==========

// 获取并显示用户名
const storedName = localStorage.getItem('zwx_username');
const welcomeNameSpan = document.getElementById('welcomeName');
const displayUserNameSpan = document.getElementById('displayUserName');

if (storedName) {
    if (welcomeNameSpan) welcomeNameSpan.textContent = storedName;
    if (displayUserNameSpan) displayUserNameSpan.textContent = storedName;
} else {
    // 如果没有存储用户名，使用默认值
    const defaultName = 'AI 探索者';
    if (welcomeNameSpan) welcomeNameSpan.textContent = defaultName;
    if (displayUserNameSpan) displayUserNameSpan.textContent = defaultName;
}

// ========== 数字动画效果 ==========
function animateNumber(element, target) {
    if (!element) return;
    let current = 0;
    const duration = 800; // 动画总时长 ms
    const stepTime = 20;   // 每步间隔 ms
    const steps = duration / stepTime;
    const increment = target / steps;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// 设置统计数据（模拟个性化数据，与实际学习进度呼应）
const daysEl = document.getElementById('statDays');
const projectsEl = document.getElementById('statProjects');
const hoursEl = document.getElementById('statHours');

// 模拟真实的学习数据
const learningDays = 28;      // 学习天数
const aiProjects = 12;        // AI辅助项目数
const codingHours = 186;      // 累计编码小时

if (daysEl) animateNumber(daysEl, learningDays);
if (projectsEl) animateNumber(projectsEl, aiProjects);
if (hoursEl) animateNumber(hoursEl, codingHours);

// ========== 退出登录功能 ==========
const logoutBtn = document.getElementById('logoutBtn');

function logoutWithTransition() {
    // 清除本地存储的用户信息
    localStorage.removeItem('zwx_username');
    localStorage.removeItem('zwx_remember');
    
    // 创建幕布动画效果
    const curtain = document.createElement('div');
    curtain.style.position = 'fixed';
    curtain.style.inset = '0';
    curtain.style.backgroundColor = '#000';
    curtain.style.zIndex = '99999';
    curtain.style.transform = 'scaleY(0)';
    curtain.style.transformOrigin = 'bottom';
    curtain.style.transition = 'transform 0.45s cubic-bezier(0.76,0,0.24,1)';
    document.body.appendChild(curtain);
    
    requestAnimationFrame(() => {
        curtain.style.transform = 'scaleY(1)';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 450);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutWithTransition);
}

// ========== 功能按钮的轻提示 ==========
function showFloatingMessage(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '2rem';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(0,0,0,0.85)';
    toast.style.backdropFilter = 'blur(12px)';
    toast.style.padding = '0.6rem 1.4rem';
    toast.style.borderRadius = '40px';
    toast.style.fontSize = '0.8rem';
    toast.style.border = '0.5px solid var(--accent, #007aff)';
    toast.style.color = 'white';
    toast.style.zIndex = '1000';
    toast.style.fontFamily = "'JetBrains Mono', monospace";
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.2s';
    document.body.appendChild(toast);
    
    setTimeout(() => toast.style.opacity = '1', 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// 绑定功能按钮
const startChallengeBtn = document.getElementById('startChallenge');
const viewNotesBtn = document.getElementById('viewNotes');
const projectStudioBtn = document.getElementById('projectStudio');

if (startChallengeBtn) {
    startChallengeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showFloatingMessage('🎯 今日挑战：完成一个响应式组件！');
    });
}

if (viewNotesBtn) {
    viewNotesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showFloatingMessage('📓 AI 学习笔记功能即将上线，敬请期待~');
    });
}

if (projectStudioBtn) {
    projectStudioBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showFloatingMessage('🚀 项目工坊：下一个 AI 辅助工具正在构思中');
    });
}

// ========== 键盘回车快捷登录提示（仪表板友好）==========
document.addEventListener('keydown', (e) => {
    // 这个功能在仪表板只是占位，不需要额外操作
    // 但保留空函数以便后续扩展
});

// ========== 光标悬停效果增强 ==========
const hoverElements = document.querySelectorAll('.feature-card, .stat-card, .logout-btn, .btn-ghost');
const cursorDotDash = document.getElementById('cursorDot');
const cursorRingDash = document.getElementById('cursorRingElem');

hoverElements.forEach(el => {
    if (!el) return;
    el.addEventListener('mouseenter', () => {
        if (cursorDotDash) cursorDotDash.classList.add('hover');
        if (cursorRingDash) cursorRingDash.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        if (cursorDotDash) cursorDotDash.classList.remove('hover');
        if (cursorRingDash) cursorRingDash.classList.remove('hover');
    });
});

// ========== 控制台输出欢迎信息（开发者友好）==========
console.log('%c✨ 欢迎来到 ZWX AI 编程空间', 'color: #007aff; font-size: 14px; font-family: monospace;');
console.log('%c学习天数: ' + learningDays + ' 天 | AI项目: ' + aiProjects + ' 个 | 编码时长: ' + codingHours + ' 小时', 'color: #8a8a8f; font-size: 12px;');