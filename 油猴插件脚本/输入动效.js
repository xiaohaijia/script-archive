// ==UserScript==
// @name         输入动效
// @description  轻量级输入特效：仅在输入时显示微妙效果，不影响页面操作
// @namespace    https://greasyfork.org/users/686525-flexiston
// @version      1.1.0
// @author       Flexiston
// @run-at       document-idle
// @icon         https://cdn.jsdelivr.net/gh/Flexiston/CDN/favicon.png
// @include      *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL  https://update.greasyfork.org/scripts/411172/Power%20Mode%20Input%20%E8%BE%93%E5%85%A5%E7%89%B9%E6%95%88.user.js
// @updateURL    https://update.greasyfork.org/scripts/411172/Power%20Mode%20Input%20%E8%BE%93%E5%85%A5%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const CONFIG = {
        colorful: GM_getValue('colorful', true),
        particleCount: GM_getValue('particleCount', 5),  // 减少粒子数量
        particleSize: GM_getValue('particleSize', 2),    // 减小粒子大小
        colorPreset: GM_getValue('colorPreset', 'soft'),
        opacity: 0.8,  // 降低透明度
        lifespan: 0.92 // 缩短粒子存活时间
    };

    // 柔和的颜色预设
    const COLOR_PRESETS = {
        soft: ['#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#B5EAD7'],
        blue: ['#E0F7FA', '#B2EBF2', '#80DEEA', '#4DD0E1', '#26C6DA'],
        pastel: ['#FFD3B6', '#FFAAA5', '#DCEDC1', '#A8E6CF', '#DCE2F0'],
        mono: ['#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575', '#616161']
    };

    // 创建画布
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 999999;
    `;
    document.body.appendChild(canvas);

    // 响应式调整
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 粒子系统
    let particles = [];
    let animationId = null;

    function createParticle(x, y) {
        const color = CONFIG.colorful ?
            COLOR_PRESETS[CONFIG.colorPreset][Math.floor(Math.random() * COLOR_PRESETS[CONFIG.colorPreset].length)] :
            '#45B7D1';

        return {
            x,
            y,
            size: CONFIG.particleSize * (0.8 + Math.random() * 0.4),
            color,
            alpha: CONFIG.opacity,
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: -Math.random() * 3
            }
        };
    }

    function updateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 更新并绘制粒子
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            p.velocity.y += 0.1;
            p.x += p.velocity.x;
            p.y += p.velocity.y;
            p.alpha *= CONFIG.lifespan;

            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            if (p.alpha < 0.1) {
                particles.splice(i, 1);
            }
        }

        // 如果还有粒子，继续动画
        if (particles.length > 0) {
            animationId = requestAnimationFrame(updateParticles);
        } else {
            animationId = null;
        }
    }

    function triggerEffect(element) {
        // 获取光标位置
        const rect = element.getBoundingClientRect();
        const x = rect.left + (element.selectionStart !== undefined ?
            getCaretPosition(element).left : rect.width / 2);
        const y = rect.top + 5; // 稍微向上偏移

        // 创建粒子
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push(createParticle(x, y));
        }

        // 启动动画（如果未运行）
        if (!animationId) {
            animationId = requestAnimationFrame(updateParticles);
        }
    }

    // 获取光标位置（改进版，考虑滚动条）
    function getCaretPosition(element) {
        const style = window.getComputedStyle(element);
        const div = document.createElement('div');
        document.body.appendChild(div);

        div.style.whiteSpace = 'pre-wrap';
        div.style.font = style.font;
        div.style.padding = style.padding;
        div.style.position = 'absolute';
        div.style.visibility = 'hidden';

        div.textContent = element.value.substring(0, element.selectionStart);
        const width = div.offsetWidth;

        // 考虑文本框的滚动条位置
        const scrollLeft = element.scrollLeft;
        const adjustedWidth = width - scrollLeft;

        document.body.removeChild(div);
        return { left: adjustedWidth };
    }

    // 事件监听
    document.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            triggerEffect(e.target);
        }
    });

    // 设置菜单
    GM_registerMenuCommand('🎨 切换颜色模式', () => {
        CONFIG.colorful = !CONFIG.colorful;
        GM_setValue('colorful', CONFIG.colorful);
    });

    GM_registerMenuCommand('🌈 更换颜色主题', () => {
        const presets = Object.keys(COLOR_PRESETS);
        const currentIndex = presets.indexOf(CONFIG.colorPreset);
        CONFIG.colorPreset = presets[(currentIndex + 1) % presets.length];
        GM_setValue('colorPreset', CONFIG.colorPreset);
    });
})();