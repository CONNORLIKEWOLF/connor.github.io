// ========================================
// 纯黑背景 · 个人作品集交互
// 滚动触发动画 + 导航高亮
// ========================================

(function() {
    document.addEventListener('DOMContentLoaded', function() {
        
        // 1. 滚动时触发卡片和统计数字的动画
        const scrollElements = document.querySelectorAll('.project-card, .stat-item');
        
        function checkScroll() {
            scrollElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                if (rect.top < windowHeight - 80) {
                    el.classList.add('visible');
                }
            });
        }
        
        // 初始检查（如果元素已经在可视区）
        checkScroll();
        
        // 监听滚动
        window.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        
        // 2. 导航栏高亮当前页面
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            }
        });
        
        console.log('网站已启动 | 赵纬信 · AI编程探索者');
    });
})();
