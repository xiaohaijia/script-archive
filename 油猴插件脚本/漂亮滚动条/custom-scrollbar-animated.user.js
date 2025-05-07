// ==UserScript==
// @name         Beautiful Animated Scrollbar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a beautiful custom scrollbar with animations to any webpage
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // 定义滚动条样式和动画
    const scrollbarStyles = `
        /* 整体滚动条样式 */
        ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }

        /* 滚动条轨道 */
        ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 10px;
        }

        /* 滚动条滑块 */
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, #6e8efb, #a777e3);
            border-radius: 10px;
            border: 3px solid transparent;
            background-clip: content-box;
            transition: all 0.3s ease;
            background-size: 200% 200%;
            animation: gradientAnimation 3s ease infinite;
        }

        /* 滑块悬停效果 */
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(45deg, #a777e3, #6e8efb);
            border: 3px solid transparent;
            background-clip: content-box;
            background-size: 200% 200%;
            animation: gradientAnimation 1s ease infinite;
        }

        /* 滚动条角落 */
        ::-webkit-scrollbar-corner {
            background: transparent;
        }

        /* Firefox 滚动条样式 */
        * {
            scrollbar-width: thin;
            scrollbar-color: #6e8efb rgba(0, 0, 0, 0.05);
        }

        /* 渐变动画 */
        @keyframes gradientAnimation {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }

        /* 添加投影效果 */
        ::-webkit-scrollbar-thumb {
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
        }

        /* 自定义滚动动画 - 页面滚动时的平滑效果 */
        html {
            scroll-behavior: smooth;
        }

        /* 滚动动画 - 当页面向下滚动时 */
        @keyframes pulseAnimation {
            0% {
                opacity: 0.7;
            }
            50% {
                opacity: 1;
            }
            100% {
                opacity: 0.7;
            }
        }

        /* 当用户滚动时激活动画 */
        html.scrolling ::-webkit-scrollbar-thumb {
            animation: pulseAnimation 1s infinite, gradientAnimation 3s ease infinite;
        }
    `;

    // 添加样式到页面
    GM_addStyle(scrollbarStyles);

    // 检测滚动事件并添加动画类
    let scrollTimer;
    window.addEventListener('scroll', function() {
        document.documentElement.classList.add('scrolling');
        
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            document.documentElement.classList.remove('scrolling');
        }, 500);
    });

    console.log('Beautiful Animated Custom Scrollbar has been applied!');
})(); 