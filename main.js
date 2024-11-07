// 导航栏滚动效果
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 图片懒加载
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 添加数字增长动画
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-item h3');
    
    stats.forEach(stat => {
        const target = parseInt(stat.innerText);
        let current = 0;
        const increment = target / 50; // 将动画分成50步
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.innerText = target + '+';
                clearInterval(timer);
            } else {
                stat.innerText = Math.floor(current) + '+';
            }
        }, 40);
    });
}

// 使用Intersection Observer检测元素是否可见
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('team-stats')) {
                animateNumbers();
            }
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

// 观察需要动画的元素
document.querySelectorAll('.team-stats, .feature-item, .service-item').forEach(el => {
    observer.observe(el);
});

// 移动端菜单控制
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    nav.classList.toggle('active');
});

// 点击导航链接时关闭菜单
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        nav.classList.remove('active');
    });
});

// 点击外部区域关闭菜单
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenuBtn.classList.remove('active');
        nav.classList.remove('active');
    }
});

// 添加页面滚动动画
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('visible');
        }
    });
};

// 添加滚动监听
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// 优化页面加载性能
document.addEventListener('DOMContentLoaded', () => {
    // 延迟加载字体
    const font = new FontFace('Roboto', 'url(https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2)');
    font.load().then(() => {
        document.fonts.add(font);
    });

    // 预加载关键图片
    const preloadImages = [
        'images/hero-bg.jpg',
        'images/logo.png'
    ];

    preloadImages.forEach(image => {
        const img = new Image();
        img.src = image;
    });

    // 修改下划线动画配置
    const annotation = RoughNotation.annotate(
        document.querySelector('.highlight-word'), 
        { 
            type: 'underline',
            color: '#F26421',
            strokeWidth: 5,
            padding: [2, 5, 8],
            multiline: true,
            animationDuration: 800,
            iterations: 3,
            rtl: false,
            brackets: ['left', 'right'],
            strokeLineDash: [12, 12],
            seed: 50,
            animate: true,
            offset: [[0, 3], [0, 8], [0, 13]],
            animationDelay: [0, 400, 800]
        }
    );
    
    // 延迟一下再显示动画
    setTimeout(() => {
        annotation.show();
    }, 1000);
});

// 添加平滑滚动效果
const scrollToElement = (element, duration = 1000) => {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = currentTime => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    };

    const easeInOutCubic = t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

    requestAnimationFrame(animation);
};

// 更新现有的平滑滚动代码
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            scrollToElement(target);
        }
    });
});

// 添加滚动渐入效果
const faders = document.querySelectorAll('.fade-in-section');

const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        appearOnScroll.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

// 添加视差滚动效果
const parallaxElements = document.querySelectorAll('.parallax-element');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// 为特定元素添加视差效果
document.addEventListener('DOMContentLoaded', () => {
    // Hero section视差
    const heroContent = document.querySelector('.hero-content');
    heroContent.classList.add('parallax-element');
    heroContent.dataset.speed = '0.3';
    
    // Stats section视差
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        item.classList.add('parallax-element');
        item.dataset.speed = `${0.1 * (index + 1)}`;
    });
    
    // Features section视差
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.classList.add('parallax-element');
        item.dataset.speed = '0.15';
    });
});

// 修改视差滚动效果处理函数
function handleParallax() {
    const parallaxSections = document.querySelectorAll('.parallax-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxSections.forEach(section => {
            // 获取section的位置信息
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + window.pageYOffset;
            const sectionBottom = sectionTop + rect.height;
            
            // 只在section可见时应用视差效果
            if (scrolled >= sectionTop - window.innerHeight && scrolled <= sectionBottom) {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                section.style.backgroundPosition = `50% ${yPos}px`;
                
                // 内容的视差效果
                const content = section.querySelector('.hero-content');
                if (content) {
                    // 只对hero section的内容应用视差效果
                    content.style.transform = `translateY(${scrolled * 0.2}px)`;
                }
            }
        });
    });
}

// 移除之前对team-stats的视差效果
document.addEventListener('DOMContentLoaded', () => {
    // 移除对统计数据的视差效果
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.classList.remove('parallax-element');
    });
    
    handleParallax();
});