// ==UserScript==
// @name         鼠标点击特效|Five
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  点击网页触发爆炸、花瓣飘散、星星闪烁、泡泡上升、流星划过等特效
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 爆炸特效
    function explosionEffect(x, y) {
        try {
            const particles = 20;
            const colors = ['#FF6B6B', '#F0932B', '#F6E58D', '#686DE0', '#30336B'];
            const fragment = document.createDocumentFragment();

            for (let i = 0; i < particles; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 3px;
                    height: 3px;
                    border-radius: 50%;
                    background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                `;
                fragment.appendChild(particle);

                const angle = Math.random() * 2 * Math.PI;
                const speed = Math.random() * 8 + 4;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;

                const animation = particle.animate([
                    { transform: 'translate(0, 0)', opacity: 1 },
                    { transform: `translate(${vx * 8}px, ${vy * 8}px)`, opacity: 0 }
                ], {
                    duration: 400,
                    easing: 'ease-out',
                    fill: 'forwards'
                });

                animation.onfinish = () => {
                    particle.remove();
                };
            }
            document.body.appendChild(fragment);
        } catch (error) {
            console.error('爆炸特效出错:', error);
        }
    }

    // 花瓣飘散特效
    function petalEffect(x, y) {
        try {
            const petals = 15;
            const petalColors = ['#FF8C94', '#FFB6B9', '#FFD6E0', '#FFEBEB', '#FFF0F5'];
            const fragment = document.createDocumentFragment();

            for (let i = 0; i < petals; i++) {
                const petal = document.createElement('div');
                petal.style.cssText = `
                    position: fixed;
                    width: 8px;
                    height: 12px;
                    background: radial-gradient(${petalColors[Math.floor(Math.random() * petalColors.length)]}, transparent);
                    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                    transform: rotate(${Math.random() * 360}deg);
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                `;
                fragment.appendChild(petal);

                const angle = Math.random() * 2 * Math.PI;
                const speed = Math.random() * 4 + 1;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;

                const rotation = Math.random() * 360;

                const animation = petal.animate([
                    { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
                    { transform: `translate(${vx * 15}px, ${vy * 15}px) rotate(${rotation}deg)`, opacity: 0 }
                ], {
                    duration: 1800,
                    easing: 'ease-out',
                    fill: 'forwards'
                });

                animation.onfinish = () => {
                    petal.remove();
                };
            }
            document.body.appendChild(fragment);
        } catch (error) {
            console.error('花瓣飘散特效出错:', error);
        }
    }

    // 星星闪烁特效
    function starEffect(x, y) {
        try {
            const stars = 10;
            const starColors = ['#F9CA24', '#F0932B', '#E056FD', '#686DE0', '#30336B'];
            const fragment = document.createDocumentFragment();

            for (let i = 0; i < stars; i++) {
                const star = document.createElement('div');
                star.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
                    background-color: ${starColors[Math.floor(Math.random() * starColors.length)]};
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                `;
                fragment.appendChild(star);

                const angle = Math.random() * 2 * Math.PI;
                const speed = Math.random() * 6 + 2;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;

                const animation = star.animate([
                    { transform: 'translate(0, 0)', opacity: 1 },
                    { transform: `translate(${vx * 6}px, ${vy * 6}px)`, opacity: 0 },
                    { transform: `translate(${vx * 8}px, ${vy * 8}px)`, opacity: 1 },
                    { transform: `translate(${vx * 10}px, ${vy * 10}px)`, opacity: 0 }
                ], {
                    duration: 1200,
                    easing: 'ease-in-out',
                    fill: 'forwards'
                });

                animation.onfinish = () => {
                    star.remove();
                };
            }
            document.body.appendChild(fragment);
        } catch (error) {
            console.error('星星闪烁特效出错:', error);
        }
    }

    // 泡泡上升特效
    function bubbleEffect(x, y) {
        try {
            const bubbles = 10;
            const bubbleColors = ['#87CEFA', '#ADD8E6', '#B0E0E6', '#AFEEEE', '#E0FFFF'];
            const fragment = document.createDocumentFragment();

            for (let i = 0; i < bubbles; i++) {
                const bubble = document.createElement('div');
                const size = Math.random() * 10 + 5;
                bubble.style.cssText = `
                    position: fixed;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    border: 1px solid ${bubbleColors[Math.floor(Math.random() * bubbleColors.length)]};
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                `;
                fragment.appendChild(bubble);

                const vx = (Math.random() - 0.5) * 2;
                const vy = -(Math.random() * 3 + 2);

                const animation = bubble.animate([
                    { transform: 'translate(0, 0)', opacity: 1 },
                    { transform: `translate(${vx * 20}px, ${vy * 20}px)`, opacity: 0 }
                ], {
                    duration: 2000,
                    easing: 'ease-out',
                    fill: 'forwards'
                });

                animation.onfinish = () => {
                    bubble.remove();
                };
            }
            document.body.appendChild(fragment);
        } catch (error) {
            console.error('泡泡上升特效出错:', error);
        }
    }

    // 流星划过特效
    function meteorEffect(x, y) {
        try {
            const meteor = document.createElement('div');
            meteor.style.cssText = `
                position: fixed;
                width: 30px;
                height: 2px;
                background: linear-gradient(to right, white, transparent);
                transform: rotate(${Math.random() * 360}deg);
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            document.body.appendChild(meteor);

            const vx = (Math.random() - 0.5) * 10;
            const vy = (Math.random() - 0.5) * 10;

            const animation = meteor.animate([
                { transform: 'translate(0, 0)', opacity: 1 },
                { transform: `translate(${vx * 50}px, ${vy * 50}px)`, opacity: 0 }
            ], {
                duration: 800,
                easing: 'ease-out',
                fill: 'forwards'
            });

            animation.onfinish = () => {
                meteor.remove();
            };
        } catch (error) {
            console.error('流星划过特效出错:', error);
        }
    }

    // 随机选择特效
    function randomEffect(x, y) {
        try {
            const effects = [explosionEffect, petalEffect, starEffect, bubbleEffect, meteorEffect];
            const randomIndex = Math.floor(Math.random() * effects.length);
            effects[randomIndex](x, y);
        } catch (error) {
            console.error('随机特效选择出错:', error);
        }
    }

    // 监听点击事件
    document.addEventListener('click', (event) => {
        try {
            const x = event.clientX;
            const y = event.clientY;
            randomEffect(x, y);
        } catch (error) {
            console.error('点击事件处理出错:', error);
        }
    });
})();