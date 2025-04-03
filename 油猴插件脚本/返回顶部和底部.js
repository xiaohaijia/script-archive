// ==UserScript==
// @name         毛玻璃返回顶部和底部
// @namespace    http://tampermonkey.net/
// @version      1.1
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
    btn.id = 'scroll-ctrl-btn';
    btn.innerHTML = '↓';

    // 基础样式
    Object.assign(btn.style, {
        position: 'fixed',
        right: '15px',
        bottom: '15px',
        zIndex: '2147483647',
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '18px',
        transition: 'opacity 0.3s, transform 0.2s',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: '0',
        pointerEvents: 'none',
        border: '1px solid rgba(0,0,0,0.1)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255,255,255,0.7)',
        color: '#555',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    });

    document.body.appendChild(btn);

    // 状态变量
    let isDark = false;
    let lastScrollTime = 0;
    let rafId = null;

    // 主更新函数
    const update = () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            const viewHeight = window.innerHeight;

            // 检查是否可滚动
            const canScroll = docHeight > viewHeight +500;
            btn.style.opacity = canScroll ? '1' : '0';
            btn.style.pointerEvents = canScroll ? 'auto' : 'none';

            if (canScroll) {
                // 更新按钮状态
                const nearBottom = scrollY > docHeight - viewHeight - 100;
                btn.innerHTML = nearBottom ? '↑' : '↓';
                btn.onclick = nearBottom
                    ? () => window.scrollTo({ top: 0, behavior: 'smooth' })
                    : () => window.scrollTo({ top: docHeight, behavior: 'smooth' });

                btn.style.opacity = (scrollY < 100 || nearBottom) ? '0.7' : '1';
            }
        });
    };

    // 检查暗色模式
    const checkDarkMode = () => {
        isDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
        btn.style.backgroundColor = isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)';
        btn.style.color = isDark ? '#eee' : '#555';
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
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', update);
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkDarkMode);

        // 悬停效果
        btn.addEventListener('mouseover', () => {
            btn.style.transform = 'scale(1.1)';
            btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
        });

        btn.addEventListener('mouseout', () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        });
    };

    // 启动
    if (document.readyState !== 'loading') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();