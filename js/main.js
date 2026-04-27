/**
 * 苏州无锡机械口译网站 - 主JavaScript文件
 * 功能：导航栏交互、平滑滚动、移动端菜单等
 */

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    
    // === 移动端菜单切换 ===
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // 切换菜单图标
            if (navLinks.classList.contains('active')) {
                mobileMenu.textContent = '✕';
            } else {
                mobileMenu.textContent = '☰';
            }
        });
        
        // 点击导航链接后关闭菜单
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenu.textContent = '☰';
            });
        });
    }
    
    // === 导航栏滚动效果 ===
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // 添加滚动类名，改变导航栏样式
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // === 平滑滚动 ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // === 当前导航高亮 ===
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');
    
    function highlightNavigation() {
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === '#' + sectionId) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // === 滚动动画（淡入效果）===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animateElements = document.querySelectorAll('.service-card, .case-card, .pricing-card, .region-item, .feature-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // === FAQ折叠效果（可选）===
    const faqItems = document.querySelectorAll('.faq-item h4');
    faqItems.forEach(question => {
        question.style.cursor = 'pointer';
        
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            
            if (answer.style.display === 'none' || !answer.style.display) {
                answer.style.display = 'block';
            } else {
                answer.style.display = 'none';
            }
        });
    });
    
    // === 图片懒加载（如果有大量图片）===
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // === 表单验证（如果后续添加表单）===
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '';
            }
        });
        
        return isValid;
    }
    
    // === 性能优化：节流函数 ===
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // === 控制台欢迎信息 ===
    console.log('%c苏州无锡机械工厂陪同口译服务', 'color: #1e3c72; font-size: 20px; font-weight: bold;');
    console.log('%c专业机械行业翻译 | 常驻苏锡两地 | 无中介直接服务', 'color: #2a5298; font-size: 14px;');
    
});

// === 页面加载完成后的额外操作 ===
window.addEventListener('load', function() {
    // 移除加载动画（如果有）
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
});

// === 错误处理 ===
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.message);
});

// === 防止右键保存图片（可选，保护二维码）===
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG' && e.target.id === 'wechatQrcode') {
        e.preventDefault();
        alert('请截图保存二维码');
    }
});
