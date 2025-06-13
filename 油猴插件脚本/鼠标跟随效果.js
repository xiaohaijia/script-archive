// ==UserScript==
// @name         鼠标跟随效果
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为网页添加漂亮的鼠标跟随效果，悬停在交互元素上时会变色放大
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建鼠标跟随元素
    const createMouseFollower = () => {
        // 检查是否已存在鼠标跟随元素
        if (document.querySelector('.mouse-follower')) {
            return;
        }

        const follower = document.createElement('div');
        follower.className = 'mouse-follower';
        document.body.appendChild(follower);

        // 添加样式
        const followerStyle = document.createElement('style');
        followerStyle.textContent = `
            .mouse-follower {
                position: fixed;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0) 70%);
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                transition: width 0.3s ease, height 0.3s ease, background 0.3s ease;
                mix-blend-mode: screen;
            }
        `;
        document.head.appendChild(followerStyle);

        // 鼠标移动事件
        document.addEventListener('mousemove', (e) => {
            follower.style.left = `${e.clientX}px`;
            follower.style.top = `${e.clientY}px`;
        });

        // 鼠标悬停在可点击元素上时的效果
        const addInteractiveEffects = () => {
            const interactiveElements = document.querySelectorAll('a, button, .post-card, .update-item, [onclick], [role="button"]');
            interactiveElements.forEach(element => {
                element.addEventListener('mouseenter', () => {
                    follower.style.width = '60px';
                    follower.style.height = '60px';
                    follower.style.background = 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0) 70%)';
                });

                element.addEventListener('mouseleave', () => {
                    follower.style.width = '40px';
                    follower.style.height = '40px';
                    follower.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0) 70%)';
                });
            });
        };

        // 初始添加交互效果
        addInteractiveEffects();

        // 监听DOM变化，动态添加新元素的交互效果
        const observer = new MutationObserver(addInteractiveEffects);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // 页面加载完成后执行
    window.addEventListener('load', createMouseFollower);
    // 同时也立即执行，以防load事件已触发
    createMouseFollower();
})();