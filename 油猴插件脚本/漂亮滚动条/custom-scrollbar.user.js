// ==UserScript==
// @name         Beautiful Scrollbar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a beautiful custom scrollbar to any webpage
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // 定义滚动条样式
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
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            border: 3px solid transparent;
            background-clip: content-box;
            transition: background 0.3s ease;
        }

        /* 滑块悬停效果 */
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.4);
            border: 3px solid transparent;
            background-clip: content-box;
        }

        /* 滚动条角落 */
        ::-webkit-scrollbar-corner {
            background: transparent;
        }

        /* Firefox 滚动条样式 */
        * {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05);
        }
    `;

    // 添加样式到页面
    GM_addStyle(scrollbarStyles);

    console.log('Beautiful Custom Scrollbar has been applied!');
})(); 