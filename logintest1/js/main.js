// ========== 光标跟随 ==========
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRingElem');
let mouseX = -100, mouseY = -100;
let ringX = -100, ringY = -100;

if (cursorDot && cursorRing) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();
}

// 为所有可交互元素添加 hover 效果
function addHoverEffect() {
    const interactiveElements = document.querySelectorAll('button, .input-field, .submit-btn, .tab-btn, .checkbox input, .password-toggle, .contact-item, .project-card, .stat-card, .nav-link, .filter-btn, .form-send, .ai-fab, .ai-send, .logout-btn, .btn-ghost');
    interactiveElements.forEach(el => {
        if (!el) return;
        el.addEventListener('mouseenter', () => {
            if (cursorDot) cursorDot.classList.add('hover');
            if (cursorRing) cursorRing.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            if (cursorDot) cursorDot.classList.remove('hover');
            if (cursorRing) cursorRing.classList.remove('hover');
        });
    });
}

// DOM 加载完成后添加效果
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addHoverEffect);
} else {
    addHoverEffect();
}

// ========== 粒子系统（登录页用） ==========
function initParticles() {
    const particleContainer = document.getElementById('particleField');
    if (!particleContainer) return;
    
    for (let i = 0; i < 48; i++) {
        const p = document.createElement('div');
        p.classList.add('particle-dot');
        const size = Math.random() * 3 + 1;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = Math.random() * 15 + 8 + 's';
        p.style.animationDelay = Math.random() * 10 + 's';
        p.style.opacity = Math.random() * 0.5 + 0.2;
        p.style.background = `rgba(0, 122, 255, ${Math.random() * 0.5 + 0.2})`;
        particleContainer.appendChild(p);
    }
}

// 页面加载后初始化粒子
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticles);
} else {
    initParticles();
}

// ========== Toast 提示 ==========
function showToast(message, isSuccess = true) {
    let toast = document.getElementById('toastMsg');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastMsg';
        toast.className = 'toast-message';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ========== 页面跳转（带幕布动画） ==========
function redirectToDashboard(username) {
    if (username) {
        localStorage.setItem('zwx_username', username);
    }
    
    const curtain = document.createElement('div');
    curtain.style.position = 'fixed';
    curtain.style.inset = '0';
    curtain.style.backgroundColor = '#000';
    curtain.style.zIndex = '99999';
    curtain.style.transform = 'scaleY(0)';
    curtain.style.transformOrigin = 'bottom';
    curtain.style.transition = 'transform 0.45s cubic-bezier(0.76, 0, 0.24, 1)';
    document.body.appendChild(curtain);
    
    requestAnimationFrame(() => {
        curtain.style.transform = 'scaleY(1)';
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 450);
    });
}

// ========== Tab 切换（登录/注册） ==========
function initTabSwitch() {
    const tabLogin = document.getElementById('tabLoginBtn');
    const tabRegister = document.getElementById('tabRegisterBtn');
    const loginPane = document.getElementById('loginPane');
    const registerPane = document.getElementById('registerPane');
    
    if (!tabLogin || !tabRegister || !loginPane || !registerPane) return;
    
    function setActiveTab(isLogin) {
        if (isLogin) {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            loginPane.classList.remove('hidden');
            registerPane.classList.add('hidden');
        } else {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            registerPane.classList.remove('hidden');
            loginPane.classList.add('hidden');
        }
        // 清除错误提示
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.remove('show');
            el.textContent = '';
        });
    }
    
    tabLogin.addEventListener('click', () => setActiveTab(true));
    tabRegister.addEventListener('click', () => setActiveTab(false));
}

// ========== 密码显示/隐藏切换 ==========
function initPasswordToggle() {
    const toggleBtns = document.querySelectorAll('.password-toggle');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const inputField = document.getElementById(targetId);
            if (inputField) {
                const type = inputField.getAttribute('type') === 'password' ? 'text' : 'password';
                inputField.setAttribute('type', type);
                this.textContent = type === 'password' ? '👁' : '🙈';
            }
        });
    });
}

// ========== 登录验证 ==========
function initLogin() {
    const submitLogin = document.getElementById('submitLogin');
    if (!submitLogin) return;
    
    submitLogin.addEventListener('click', () => {
        const user = document.getElementById('loginUser')?.value.trim() || '';
        const pass = document.getElementById('loginPass')?.value || '';
        let isValid = true;
        
        const userError = document.getElementById('loginUserError');
        const passError = document.getElementById('loginPassError');
        
        if (userError) {
            userError.classList.remove('show');
            userError.textContent = '';
        }
        if (passError) {
            passError.classList.remove('show');
            passError.textContent = '';
        }
        
        if (!user) {
            if (userError) {
                userError.textContent = '⚠️ 请输入邮箱或用户名';
                userError.classList.add('show');
            }
            isValid = false;
        }
        if (!pass) {
            if (passError) {
                passError.textContent = '⚠️ 密码不能为空';
                passError.classList.add('show');
            }
            isValid = false;
        }
        
        if (isValid) {
            // 记住我功能
            const rememberCheck = document.getElementById('rememberCheck');
            if (rememberCheck && rememberCheck.checked) {
                localStorage.setItem('zwx_remember', 'true');
                localStorage.setItem('zwx_saved_user', user);
            } else {
                localStorage.removeItem('zwx_remember');
                localStorage.removeItem('zwx_saved_user');
            }
            showToast('✓ 登录成功，正在前往仪表板...', true);
            setTimeout(() => redirectToDashboard(user), 600);
        } else {
            showToast('请填写完整信息', false);
        }
    });
    
    // 回车登录
    const loginPass = document.getElementById('loginPass');
    if (loginPass) {
        loginPass.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitLogin.click();
            }
        });
    }
    
    // 自动填充记住的用户名
    const savedUser = localStorage.getItem('zwx_saved_user');
    const loginUser = document.getElementById('loginUser');
    const rememberCheck = document.getElementById('rememberCheck');
    if (savedUser && loginUser && rememberCheck) {
        loginUser.value = savedUser;
        rememberCheck.checked = true;
    }
}

// ========== 注册验证 ==========
function initRegister() {
    const submitRegister = document.getElementById('submitRegister');
    if (!submitRegister) return;
    
    submitRegister.addEventListener('click', () => {
        const username = document.getElementById('regName')?.value.trim() || '';
        const email = document.getElementById('regEmail')?.value.trim() || '';
        const password = document.getElementById('regPass')?.value || '';
        const agree = document.getElementById('agreeTerms')?.checked || false;
        
        const nameError = document.getElementById('regNameError');
        const emailError = document.getElementById('regEmailError');
        const passError = document.getElementById('regPassError');
        
        if (nameError) {
            nameError.classList.remove('show');
            nameError.textContent = '';
        }
        if (emailError) {
            emailError.classList.remove('show');
            emailError.textContent = '';
        }
        if (passError) {
            passError.classList.remove('show');
            passError.textContent = '';
        }
        
        let valid = true;
        
        if (!username) {
            if (nameError) {
                nameError.textContent = '⚠️ 请输入用户名';
                nameError.classList.add('show');
            }
            valid = false;
        } else if (username.length < 2) {
            if (nameError) {
                nameError.textContent = '⚠️ 用户名至少2个字符';
                nameError.classList.add('show');
            }
            valid = false;
        }
        
        if (!email) {
            if (emailError) {
                emailError.textContent = '⚠️ 请输入邮箱';
                emailError.classList.add('show');
            }
            valid = false;
        } else if (!email.includes('@') || !email.includes('.')) {
            if (emailError) {
                emailError.textContent = '⚠️ 请输入有效的邮箱地址';
                emailError.classList.add('show');
            }
            valid = false;
        }
        
        if (!password) {
            if (passError) {
                passError.textContent = '⚠️ 请输入密码';
                passError.classList.add('show');
            }
            valid = false;
        } else if (password.length < 6) {
            if (passError) {
                passError.textContent = '⚠️ 密码至少6个字符';
                passError.classList.add('show');
            }
            valid = false;
        }
        
        if (!agree) {
            showToast('请同意开发者公约', false);
            valid = false;
        }
        
        if (valid) {
            // 保存注册信息
            localStorage.setItem('zwx_username', username);
            localStorage.setItem('zwx_email', email);
            showToast('🎉 注册成功！正在跳转...', true);
            setTimeout(() => redirectToDashboard(username), 700);
        }
    });
    
    // 回车注册
    const regPass = document.getElementById('regPass');
    if (regPass) {
        regPass.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitRegister.click();
            }
        });
    }
}

// ========== 首页玻璃卡片入场动画 ==========
function initCardAnimation() {
    const glassCard = document.querySelector('.glass-card');
    if (glassCard) {
        glassCard.style.opacity = '0';
        glassCard.style.transform = 'translateY(20px)';
        setTimeout(() => {
            glassCard.style.transition = 'opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1), transform 0.5s ease';
            glassCard.style.opacity = '1';
            glassCard.style.transform = 'translateY(0)';
        }, 80);
    }
}

// ========== 初始化所有功能 ==========
function init() {
    initTabSwitch();
    initPasswordToggle();
    initLogin();
    initRegister();
    initCardAnimation();
}

// 等待 DOM 完全加载后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// 导出函数供其他脚本使用（如果有需要）
window.showToast = showToast;
window.redirectToDashboard = redirectToDashboard;