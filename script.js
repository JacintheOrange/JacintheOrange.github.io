// 统一的观察器选项
const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.2
};

// 数字动画函数
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateNumber = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.round(current);
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target;
            }
        };
        
        updateNumber();
    });
}

// 创建一个统一的观察器
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // 为数字动画的部分
            if (entry.target.classList.contains('stats')) {
                animateNumbers();
            }
            // 为所有部分添加可见性类
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

// 观察所有需要动画的区域
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.intro, .stats, .features, .service, .audience, .contact');
    sections.forEach(section => sectionObserver.observe(section));
});

// 滚动显示动画
function handleScrollAnimation() {
    const elements = document.querySelectorAll('.service-item, .audience-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

// 页面加载完成后初始化动画
document.addEventListener('DOMContentLoaded', () => {
    handleScrollAnimation();
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 添加表单提交处理
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 获取表单数据
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    // 这里可以添加表单提交逻辑
    console.log('Form submitted:', formData);
    
    // 显示提交成功消息
    alert('消息已发送！我们会尽快回复您。');
    
    // 重置表单
    this.reset();
});