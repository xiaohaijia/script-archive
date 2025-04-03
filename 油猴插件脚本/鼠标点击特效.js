// ==UserScript==
// @name          鼠标点击动画
// @namespace     http://tampermonkey.net/
// @version       1.0
// @description   带渐变色彩与粒子效果的点击动画
// @icon          https://i.miji.bid/2025/03/15/560664f99070e139e28703cf92975c73.jpeg
// @author        ChenHaiJia
// @match         *://*/*
// @grant         GM_addStyle
// @license       MIT
// ==/UserScript==

(function() {
    'use strict';

    // 高级动画CSS
    GM_addStyle(`
        .cursor-ripple {
            position: fixed;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            animation: ripple 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: center;
            background: radial-gradient(circle,
                rgba(84, 206, 255, 0.8) 20%,
                rgba(120, 94, 240, 0.6) 80%);
            box-shadow: 0 0 15px rgba(98, 156, 255, 0.3);
        }

        .cursor-ripple::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px solid rgba(255,255,255,0.4);
            border-radius: 50%;
            animation: pulse 0.6s ease-out;
        }

        .cursor-right-click {
            position: fixed;
            width: 24px;
            height: 24px;
            pointer-events: none;
            z-index: 99999;
            animation:
                scaleOut 0.8s ease-out,
                rotate 1s linear;
            border: 3px dashed rgba(255, 84, 170, 0.8);
            border-radius: 15%;
            background: rgba(255, 134, 206, 0.2);
        }

        .particles {
            position: fixed;
            pointer-events: none;
            animation: particles 0.8s ease-out;
        }

        @keyframes ripple {
            0% { transform: scale(0); opacity: 0.8; }
            100% { transform: scale(3); opacity: 0; }
        }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.8); opacity: 0; }
        }

        @keyframes scaleOut {
            0% { transform: scale(0.5); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1.5); opacity: 0; }
        }

        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes particles {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-40px); opacity: 0; }
        }
    `);

    // 创建粒子效果
    function createParticles(x, y) {
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'particles';
            particle.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                width: 5px;
                height: 5px;
                background: ${i%2 ? 'rgba(255,110,199,0.7)' : 'rgba(100,220,255,0.7)'};
                border-radius: 50%;
                position: fixed;
            `;
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        }
    }

    // 左键点击（带粒子效果）
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.classList.add('cursor-ripple');
        Object.assign(ripple.style, {
            left: e.clientX - 12 + 'px',
            top: e.clientY - 12 + 'px'
        });
        document.body.appendChild(ripple);
        createParticles(e.clientX, e.clientY);
        setTimeout(() => ripple.remove(), 800);
    });

    // 右键点击（带旋转动画）
    document.addEventListener('contextmenu', (e) => {
        const rightClick = document.createElement('div');
        rightClick.classList.add('cursor-right-click');
        Object.assign(rightClick.style, {
            left: e.clientX - 12 + 'px',
            top: e.clientY - 12 + 'px',
            transform: 'scale(0.5)'
        });
        document.body.appendChild(rightClick);
        setTimeout(() => rightClick.remove(), 800);
    });
})();