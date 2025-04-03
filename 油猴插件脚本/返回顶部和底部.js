// ==UserScript==
// @name         毛玻璃返回顶部和底部
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  简洁高效的智能滚动按钮，不影响页面性能
// @author       ChenHaiJia
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素 - 使用DocumentFragment提高性能
    const fragment = document.createDocumentFragment();
    const btn = document.createElement('button');
    btn.id = 'chj-scroll-ctrl-btn';
    
    // 使用SVG图标替代文本，提供更好的视觉效果
    const svgArrowDown = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline></svg>`;
    const svgArrowUp = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 11 12 6 7 11"></polyline><polyline points="17 18 12 13 7 18"></polyline></svg>`;
    
    btn.innerHTML = svgArrowDown;

    // 基础样式 - 使用cssText一次性设置所有样式，减少重排
    btn.style.cssText = `
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 2147483647;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        outline: none;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        border: none;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        background-color: rgba(255,255,255,0.8);
        color: #555;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        transform: translateY(0);
        margin: 0;
        padding: 0;
        line-height: 1;
        text-align: center;
        font-family: Arial, sans-serif;
        user-select: none;
    `;

    fragment.appendChild(btn);
    document.body.appendChild(fragment);

    // 状态变量
    let isDark = false;
    let lastScrollTime = 0;
    let rafId = null;
    let isScrolling = false;
    let isClickLocked = false;
    let isHovering = false;
    let scrollEndInterval = null;
    let updateScheduled = false;

    // 平滑滚动函数 - 优化性能
    const smoothScroll = (target) => {
        if (isClickLocked) return;
        isClickLocked = true;
        isScrolling = true;
        
        // 添加点击反馈动画
        btn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            btn.style.transform = isHovering ? 'scale(1.1)' : 'scale(1)';
        }, 200);
        
        // 清除之前的滚动检测
        if (scrollEndInterval) {
            clearInterval(scrollEndInterval);
        }
        
        // 使用更可靠的滚动方法，兼容更多网站
        try {
            window.scrollTo({
                top: target,
                behavior: 'smooth'
            });
        } catch (e) {
            // 兼容不支持平滑滚动的浏览器 - 优化动画函数
            const scrollToSmoothly = (position, duration) => {
                const startPosition = window.pageYOffset;
                const distance = position - startPosition;
                const startTime = performance.now();
                
                const step = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    
                    if (elapsed >= duration) {
                        window.scrollTo(0, position);
                        return;
                    }
                    
                    const progress = elapsed / duration;
                    const ease = easeInOutCubic(progress);
                    window.scrollTo(0, startPosition + distance * ease);
                    
                    requestAnimationFrame(step);
                };
                
                const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
                
                requestAnimationFrame(step);
            };
            
            scrollToSmoothly(target, 800); // 减少时间提高响应速度
        }

        // 滚动结束后解锁 - 使用更高效的检测方法
        let lastPos = -1;
        let checkCount = 0;
        const checkScrollEnd = () => {
            const currentPos = window.pageYOffset;
            
            // 检查是否到达目标或滚动停止
            if ((Math.abs(currentPos - target) < 5) || 
                (currentPos === lastPos && checkCount > 2) ||
                (target === 0 && currentPos === 0) ||
                (target > 0 && currentPos >= document.documentElement.scrollHeight - window.innerHeight - 5)) {
                
                isScrolling = false;
                isClickLocked = false;
                scheduleUpdate();
                clearInterval(scrollEndInterval);
                scrollEndInterval = null;
            }
            
            lastPos = currentPos;
            checkCount++;
        };

        scrollEndInterval = setInterval(checkScrollEnd, 150); // 增加间隔减少检查频率
        
        // 设置超时解锁以防万一
        setTimeout(() => {
            if (isClickLocked) {
                isClickLocked = false;
                isScrolling = false;
                if (scrollEndInterval) {
                    clearInterval(scrollEndInterval);
                    scrollEndInterval = null;
                }
            }
        }, 1500); // 减少超时时间
    };

    // 使用requestAnimationFrame调度更新，避免频繁更新
    const scheduleUpdate = () => {
        if (!updateScheduled) {
            updateScheduled = true;
            rafId = requestAnimationFrame(() => {
                update();
                updateScheduled = false;
            });
        }
    };

    // 主更新函数 - 优化计算
    const update = () => {
        if (isScrolling) return;
        
        // 缓存DOM查询结果
        const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const docHeight = Math.max(
            document.body.scrollHeight || 0, 
            document.documentElement.scrollHeight || 0
        );
        const viewHeight = window.innerHeight || document.documentElement.clientHeight || 0;

        // 检查是否可滚动
        const canScroll = docHeight > viewHeight + 500;
        
        // 批量更新样式，减少重排
        if (canScroll) {
            const nearBottom = scrollY > docHeight - viewHeight - 100;
            const opacity = (scrollY < 100 || nearBottom) ? '0.7' : '1';
            
            // 只在状态变化时更新DOM
            if (btn.innerHTML !== (nearBottom ? svgArrowUp : svgArrowDown)) {
                btn.innerHTML = nearBottom ? svgArrowUp : svgArrowDown;
            }
            
            if (btn.style.opacity !== opacity) {
                btn.style.opacity = opacity;
            }
            
            if (btn.style.pointerEvents !== 'auto') {
                btn.style.pointerEvents = 'auto';
            }
            
            // 更新点击处理函数 - 只在状态变化时重新绑定
            btn.onclick = nearBottom
                ? () => smoothScroll(0)
                : () => smoothScroll(docHeight);

            // 添加滚动进度指示 - 减少计算和DOM操作
            if (scrollY > 300 && !nearBottom) {
                const scrollProgress = Math.min(scrollY / (docHeight - viewHeight), 1);
                const hue = Math.floor(120 - scrollProgress * 120); // 从绿色到红色的渐变
                const newShadow = `0 4px 20px rgba(0,0,0,0.15), inset 0 -3px 0 hsl(${hue}, 80%, 60%)`;
                
                if (btn.style.boxShadow !== newShadow) {
                    btn.style.boxShadow = newShadow;
                }
            } else if (btn.style.boxShadow !== '0 4px 20px rgba(0,0,0,0.15)') {
                btn.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
            }
        } else if (btn.style.opacity !== '0') {
            btn.style.opacity = '0';
            btn.style.pointerEvents = 'none';
        }
    };

    // 检查暗色模式 - 减少不必要的样式更新
    const checkDarkMode = () => {
        const wasDark = isDark;
        isDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
        
        // 只在模式变化时更新样式
        if (wasDark !== isDark) {
            btn.style.backgroundColor = isDark ? 'rgba(40,40,40,0.8)' : 'rgba(255,255,255,0.8)';
            btn.style.color = isDark ? '#eee' : '#555';
        }
    };

    // 节流滚动处理 - 使用更高效的节流
    const handleScroll = () => {
        const now = Date.now();
        if (now - lastScrollTime < 150) return; // 增加节流间隔
        lastScrollTime = now;
        scheduleUpdate();
    };

    // 初始化 - 优化事件绑定
    const init = () => {
        checkDarkMode();
        scheduleUpdate();

        // 事件监听 - 使用事件委托减少监听器
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', scheduleUpdate, { passive: true });
        
        // 兼容性处理
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (darkModeMediaQuery.addEventListener) {
            darkModeMediaQuery.addEventListener('change', checkDarkMode);
        } else if (darkModeMediaQuery.addListener) {
            darkModeMediaQuery.addListener(checkDarkMode);
        }

        // 合并鼠标事件处理
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
        
        // 使用事件委托处理点击相关事件
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('mouseup', () => {
            btn.style.transform = isHovering ? 'scale(1.1) translateY(-2px)' : 'scale(1)';
        });
        
        // 确保按钮在页面加载后正确显示
        setTimeout(scheduleUpdate, 300);
    };

    // 启动 - 优化初始化时机
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 0); // 使用setTimeout避免阻塞主线程
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
    
    // 确保在页面完全加载后也执行一次更新
    window.addEventListener('load', scheduleUpdate);
    
    // 处理iframe情况
    if (window.self !== window.top) {
        // 在iframe中时调整样式
        btn.style.transform = 'scale(0.8)';
        btn.style.right = '10px';
        btn.style.bottom = '10px';
        btn.style.opacity = '0.6';
    }
})();