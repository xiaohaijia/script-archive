// ==UserScript==
// @name         有道翻译默认跳转文本翻译
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动跳转到有道翻译的文本翻译界面
// @author       ChenJia
// @match        https://fanyi.youdao.com/
// @icon         https://fanyi.youdao.com/favicon.ico
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前URL是否已经是目标URL
    if (window.location.href.indexOf('/#/TextTranslate') === -1) {
        // 如果不是，则跳转到文本翻译界面
        window.location.href = 'https://fanyi.youdao.com/#/TextTranslate';
    }
})();