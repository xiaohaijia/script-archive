// ==UserScript==
// @name         毛玻璃返回顶部和底部
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  简洁高效的智能滚动按钮，不影响页面性能
// @author       ChenHaiJia
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素
    const btn = document.createElement('button');
    btn.id = 'chj-scroll-ctrl-btn';
    
    // 使用SVG图标替代文本，提供更好的视觉效果
    const svgArrowDown = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline></svg>`;
    const svgArrowUp = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 11 12 6 7 11"></polyline><polyline points="17 18 12 13 7 18"></polyline></svg>`;
    
    btn.innerHTML = svgArrowDown;

    // 基础样式 - 更现代化的设计
    Object.assign(btn.style, {
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        zIndex: '2147483647',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '18px',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: '0',
        pointerEvents: 'none',
        border: 'none',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255,255,255,0.8)',
        color: '#555',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        transform: 'translateY(0)',
        margin: '0',
        padding: '0',
        lineHeight: '1',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        userSelect: 'none'
    });

    document.body.appendChild(btn);

    // 状态变量
    let isDark = false;
    let lastScrollTime = 0;
    let rafId = null;
    let isScrolling = false;
    let isClickLocked = false;
    let isHovering = false;

    // 平滑滚动函数
    const smoothScroll = (target) => {
        if (isClickLocked) return;
        isClickLocked = true;
        isScrolling = true;
        
        // 添加点击反馈动画
        btn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            btn.style.transform = isHovering ? 'scale(1.1)' : 'scale(1)';
        }, 200);
        
        // 使用更可靠的滚动方法，兼容更多网站
        try {
            window.scrollTo({
                top: target,
                behavior: 'smooth'
            });
        } catch (e) {
            // 兼容不支持平滑滚动的浏览器
            const scrollToSmoothly = (position, duration) => {
                const startPosition = window.pageYOffset;
                const distance = position - startPosition;
                let startTime = null;
                
                const animation = currentTime => {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                };
                
                const easeInOutQuad = (t, b, c, d) => {
                    t /= d/2;
                    if (t < 1) return c/2*t*t + b;
                    t--;
                    return -c/2 * (t*(t-2) - 1) + b;
                };
                
                requestAnimationFrame(animation);
            };
            
            scrollToSmoothly(target, 1000);
        }

        // 滚动结束后解锁 - 使用更可靠的检测方法
        let lastPos = -1;
        let checkCount = 0;
        const checkScrollEnd = () => {
            const currentPos = window.pageYOffset;
            
            // 检查是否到达目标或滚动停止
            if ((Math.abs(currentPos - target) < 5) || 
                (currentPos === lastPos && checkCount > 3) ||
                (target === 0 && currentPos === 0) ||
                (target > 0 && currentPos >= document.documentElement.scrollHeight - window.innerHeight - 5)) {
                
                isScrolling = false;
                isClickLocked = false;
                update();
                clearInterval(scrollEndInterval);
            }
            
            lastPos = currentPos;
            checkCount++;
        };

        const scrollEndInterval = setInterval(checkScrollEnd, 100);
        
        // 设置超时解锁以防万一
        setTimeout(() => {
            isClickLocked = false;
            isScrolling = false;
            clearInterval(scrollEndInterval);
        }, 2000);
    };

    // 主更新函数
    const update = () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            if (isScrolling) return;
            
            // 使用更可靠的方法获取滚动位置和文档高度
            const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            const docHeight = Math.max(
                document.body.scrollHeight || 0, 
                document.documentElement.scrollHeight || 0,
                document.body.offsetHeight || 0, 
                document.documentElement.offsetHeight || 0
            );
            const viewHeight = window.innerHeight || document.documentElement.clientHeight || 0;

            // 检查是否可滚动
            const canScroll = docHeight > viewHeight + 500;
            btn.style.opacity = canScroll ? '1' : '0';
            btn.style.pointerEvents = canScroll ? 'auto' : 'none';

            if (canScroll) {
                // 更新按钮状态
                const nearBottom = scrollY > docHeight - viewHeight - 100;
                btn.innerHTML = nearBottom ? svgArrowUp : svgArrowDown;
                
                // 更新点击处理函数
                btn.onclick = nearBottom
                    ? () => smoothScroll(0)
                    : () => smoothScroll(docHeight);

                // 根据位置调整透明度和位置
                btn.style.opacity = (scrollY < 100 || nearBottom) ? '0.7' : '1';
                
                // 添加滚动进度指示
                const scrollProgress = Math.min(scrollY / (docHeight - viewHeight), 1);
                const hue = Math.floor(120 - scrollProgress * 120); // 从绿色到红色的渐变
                if (!nearBottom && scrollY > 300) {
                    btn.style.boxShadow = `0 4px 20px rgba(0,0,0,0.15), inset 0 -3px 0 hsl(${hue}, 80%, 60%)`;
                } else {
                    btn.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                }
            }
        });
    };

    // 检查暗色模式
    const checkDarkMode = () => {
        isDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
        if (isDark) {
            btn.style.backgroundColor = 'rgba(40,40,40,0.8)';
            btn.style.color = '#eee';
        } else {
            btn.style.backgroundColor = 'rgba(255,255,255,0.8)';
            btn.style.color = '#555';
        }
    };

    // 节流滚动处理
    const handleScroll = () => {
        const now = Date.now();
        if (now - lastScrollTime < 100) return;
        lastScrollTime = now;
        update();
    };

    // 初始化
    const init = () => {
        checkDarkMode();
        update();

        // 事件监听
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', update, { passive: true });
        
        // 兼容性处理
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (darkModeMediaQuery.addEventListener) {
            darkModeMediaQuery.addEventListener('change', checkDarkMode);
        } else if (darkModeMediaQuery.addListener) {
            darkModeMediaQuery.addListener(checkDarkMode);
        }

        // 增强悬停效果
        btn.addEventListener('mouseover', () => {
            isHovering = true;
            btn.style.transform = 'scale(1.1) translateY(-2px)';
            btn.style.boxShadow = '0 6px 25px rgba(0,0,0,0.2)';
        });

        btn.addEventListener('mouseout', () => {
            isHovering = false;
            btn.style.transform = 'scale(1) translateY(0)';
            btn.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        });
        
        // 添加点击效果
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('mouseup', () => {
            btn.style.transform = isHovering ? 'scale(1.1) translateY(-2px)' : 'scale(1)';
        });
    };

    // 启动
    if (document.readyState !== 'loading') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
    
    // 确保在页面完全加载后也执行一次更新
    window.addEventListener('load', update);
    
    // 处理iframe情况
    if (window.self !== window.top) {
        // 在iframe中时调整样式
        btn.style.transform = 'scale(0.8)';
        btn.style.right = '10px';
        btn.style.bottom = '10px';
        btn.style.opacity = '0.6';
    }
})();