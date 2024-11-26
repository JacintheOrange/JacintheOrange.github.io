document.addEventListener('DOMContentLoaded', function () {
    console.log('页面加载完成');
    
    // 检查 RoughNotation 是否存在
    if (typeof RoughNotation === 'undefined') {
        console.error('RoughNotation 未加载');
        return;
    }
    console.log('RoughNotation 已加载');

    // Hero 动画初始化
    initHeroAnimation();

    // 地图初始化
    initMap();

    console.log('初始化所有动画');
    initHeroAnimation();
    initAboutAnimation();
    initStatAnimation();
    init3DParallax();
    initHeaderScroll();
    initBackgroundAnimation();
});

function initHeroAnimation() {
    console.log('开始初始化 Hero 动画');
    const highlightWord = document.querySelector('.highlight-word');
    let annotation = null;
    
    if (highlightWord) {
        console.log('找到 highlight-word 元素:', highlightWord);
        try {
            // 创建注释对象
            annotation = RoughNotation.annotate(highlightWord, {
                type: 'underline',
                color: 'var(--accent-1)',
                animationDuration: 1500,
                strokeWidth: 2,
                padding: 2
            });
            
            // 创建 Intersection Observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // 重置并显示动画
                        annotation.hide();
                        setTimeout(() => {
                            annotation.show();
                            console.log('显示下划线动画');
                        }, 500);
                    }
                });
            }, {
                threshold: 0.5, // 当50%的元素可见时触发
                rootMargin: '0px' // 可以根据需要调整触发时机
            });
            
            // 观察 hero 区域
            const heroSection = document.querySelector('#hero');
            if (heroSection) {
                observer.observe(heroSection);
            }
            
        } catch (error) {
            console.error('创建注释时出错:', error);
        }
    } else {
        console.error('未找到 highlight-word 元素');
    }
}

function initAboutAnimation() {
    console.log('初始化 About 区域动画');
    const aboutTitle = document.querySelector('.about h2');
    const aboutContent = document.querySelectorAll('.about-content p');
    
    // 创建 Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 当元素进入视图时
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                console.log('加动画类');
            } else {
                // 当元素离开视图时，移除动画类，这样下次进入时可以重新触发动画
                entry.target.classList.remove('animate');
                console.log('移除动画类，准备下次动画');
            }
        });
    }, {
        threshold: 0.2, // 当20%的元素可见时触发
        rootMargin: '-50px' // 添加一些偏移，使动画触发时机更合适
    });

    // 观察标题
    if (aboutTitle) {
        observer.observe(aboutTitle);
    }

    // 观察所有段落
    aboutContent.forEach(p => observer.observe(p));
}

function initStatAnimation() {
    console.log('初始化统计数字动画');
    const statNumbers = document.querySelectorAll('.stat-item h3');
    
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = currentValue + '+';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // 使用 Intersection Observer 监测元素是否进入视图
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const endValue = parseInt(element.getAttribute('data-value'));
                animateValue(element, 0, endValue, 2000); // 2000ms = 2秒动画
                observer.unobserve(element); // 确保动画只执行一次
            }
        });
    }, {
        threshold: 0.5 // 当元素50%可见时触发
    });

    // 观察所有数字元素
    statNumbers.forEach(number => observer.observe(number));
}

function init3DParallax() {
    const hero = document.querySelector('.hero');
    const background = document.querySelector('.hero-background');
    const content = document.querySelector('.hero-content');
    let isScrolling = false;
    let mouseMoving = false;

    // 滚动视差效果
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxRate = scrolled * 0.5;
                
                background.style.transform = `translateZ(-10px) scale(2) translateY(${parallaxRate * 0.5}px)`;
                content.style.transform = `translateZ(0) translateY(${50 + parallaxRate * 0.2}px)`;
                
                isScrolling = false;
            });
        }
        isScrolling = true;
    });

    // 鼠标移动效果
    hero.addEventListener('mousemove', (e) => {
        if (!mouseMoving) {
            requestAnimationFrame(() => {
                const { clientX, clientY } = e;
                const xRate = (clientX - window.innerWidth / 2) * 0.005;
                const yRate = (clientY - window.innerHeight / 2) * 0.005;

                background.style.transform = `translateZ(-10px) scale(2) translate(${xRate * 2}px, ${yRate * 2}px)`;
                content.style.transform = `translateZ(0) translate(${xRate}px, ${50 + yRate}px)`;

                mouseMoving = false;
            });
        }
        mouseMoving = true;
    });

    // 鼠标离开时重置位置
    hero.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
            background.style.transform = 'translateZ(-10px) scale(2)';
            content.style.transform = 'translateZ(0) translateY(50px)';
        });
    });
}

// 添加导航栏滚动效果
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        // 只添加缩小效果
        if (window.pageYOffset > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}

function initBackgroundAnimation() {
    const container = document.createElement('div');
    container.className = 'animated-background';
    document.body.appendChild(container);

    // 修改颜色配置，右上角改为深蓝色
    const colors = [
        `rgba(46, 49, 146, 0.18)`,      // 主蓝色
        `rgba(39, 40, 99, 0.18)`,       // 深蓝色 - 右上角圆形
        `rgba(30, 117, 188, 0.18)`      // 浅蓝色
    ];

    // 位置配置保持不变
    const positions = [
        { left: '-15%', top: '40%' },       // 左边圆形
        { left: '75%', top: '-15%' },       // 右上角圆形
        { left: '85%', top: '85%' }         // 右下角方形
    ];

    // 创建形状
    for (let i = 0; i < 3; i++) {
        createShape(i);
    }

    function createShape(index) {
        const shape = document.createElement('div');
        const isCircle = index < 2;
        
        shape.className = `bg-shape ${isCircle ? 'circle' : 'square'}`;
        shape.style.width = '450px';
        shape.style.height = '450px';
        shape.style.background = colors[index];
        shape.style.left = positions[index].left;
        shape.style.top = positions[index].top;
        
        const duration = 60 + index * 5;
        shape.style.animationDuration = `${duration}s`;
        
        container.appendChild(shape);
    }
}

// 确保在其他初始化之前调用背景动画
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化背景动画');
    initBackgroundAnimation();
    // ... 其他初始化代码 ...
});

function initMap() {
    console.log('开始初始化地图...');
    
    // 确保 ECharts 已加载
    if (typeof echarts === 'undefined') {
        console.error('ECharts 未加载');
        return;
    }

    // 获取容器
    var chartDom = document.getElementById('china-map');
    if (!chartDom) {
        console.error('未找到地图容器');
        return;
    }

    // 初始化 ECharts 实例
    var myChart = echarts.init(chartDom);

    // 定义省份名称映射（使用拼音）
    const nameMap = {
        '广东': 'Guangdong',
        '江苏': 'Jiangsu',
        '山东': 'Shandong',
        '浙江': 'Zhejiang',
        '河南': 'Henan',
        '四川': 'Sichuan',
        '湖北': 'Hubei',
        '福建': 'Fujian',
        '湖南': 'Hunan',
        '上海': 'Shanghai',
        '安徽': 'Anhui',
        '北京': 'Beijing',
        '江西': 'Jiangxi',
        '重庆': 'Chongqing',
        '陕西': 'Shaanxi',
        '广西': 'Guangxi',
        '内蒙古': 'Neimenggu',
        '河北': 'Hebei',
        '云南': 'Yunnan',
        '山西': 'Shanxi',
        '贵州': 'Guizhou',
        '黑龙江': 'Heilongjiang',
        '吉林': 'Jilin',
        '天津': 'Tianjin',
        '新疆': 'Xinjiang',
        '甘肃': 'Gansu',
        '海南': 'Hainan',
        '宁夏': 'Ningxia',
        '青海': 'Qinghai',
        '西藏': 'Xizang',
        '香港': 'Xianggang',
        '澳门': 'Aomen',
        '台湾': 'Taiwan',
        '辽宁': 'Liaoning'
    };

    // 数据数组
    var data = [
        {name: '广东', value: 300},
        {name: '江苏', value: 290},
        {name: '山东', value: 270},
        {name: '浙江', value: 250},
        {name: '河南', value: 230},
        {name: '四川', value: 220},
        {name: '湖北', value: 210},
        {name: '福建', value: 200},
        {name: '湖南', value: 190},
        {name: '上海', value: 180},
        {name: '安徽', value: 170},
        {name: '北京', value: 160},
        {name: '江西', value: 150},
        {name: '重庆', value: 140},
        {name: '陕西', value: 130},
        {name: '广西', value: 120},
        {name: '内蒙古', value: 110},
        {name: '河北', value: 100},
        {name: '云南', value: 90},
        {name: '山西', value: 80},
        {name: '贵州', value: 70},
        {name: '黑龙江', value: 60},
        {name: '吉林', value: 50},
        {name: '天津', value: 45},
        {name: '新疆', value: 40},
        {name: '甘肃', value: 35},
        {name: '海南', value: 30},
        {name: '宁夏', value: 25},
        {name: '青海', value: 20},
        {name: '西藏', value: 15}
    ];

    var option = {
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                // 只有当数据存在且值不为0时才显示提示框
                if (params.data && params.data.value > 0) {
                    return params.data.value;
                }
                // 返回false则不显示提示框
                return false;
            }
        },
        visualMap: {
            left: 'right',
            top: 'bottom',
            text: ['High', 'Low'],
            textStyle: {
                color: '#333'
            },
            min: 0,
            max: 300,
            inRange: {
                color: ['#e0f3f8', '#F26421']
            },
            calculable: true,
            dimension: 0
        },
        series: [{
            name: 'GDP Index',
            type: 'map',
            mapType: 'china',
            roam: false,
            zoom: 1.2,
            center: [105, 35],
            label: {
                show: true,
                color: '#333',
                fontSize: 10,
                formatter: function(params) {
                    return nameMap[params.name] || params.name;
                }
            },
            emphasis: {
                label: {
                    show: true,
                    color: '#fff'
                },
                itemStyle: {
                    areaColor: '#F26421'
                }
            },
            itemStyle: {
                borderColor: '#fff',
                borderWidth: 1
            },
            data: data
        }]
    };

    // 使用配置项
    try {
        myChart.setOption(option);
        console.log('地图配置已应用');
    } catch (error) {
        console.error('设置地图配置时出错:', error);
    }

    // 监听窗口大小变化
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// 确保在其他动画初始化之后再初始化地图
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化地图，避免与其他动画冲突
    setTimeout(initMap, 1000);
});