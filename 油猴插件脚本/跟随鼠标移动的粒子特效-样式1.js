// ==UserScript==
// @name         鼠标跟随特效
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为鼠标添加跟随特效
// @author       Trae AI
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // 创建粒子容器
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    
    // 粒子类
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 5 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            this.alpha = 1;
            this.element = document.createElement('div');
            this.element.style.position = 'absolute';
            this.element.style.width = `${this.size}px`;
            this.element.style.height = `${this.size}px`;
            this.element.style.backgroundColor = this.color;
            this.element.style.borderRadius = '50%';
            this.element.style.boxShadow = `0 0 ${this.size * 2}px ${this.color}`;
            this.element.style.opacity = this.alpha;
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
            container.appendChild(this.element);
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= 0.02;
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
            this.element.style.opacity = this.alpha;
        }
        
        remove() {
            container.removeChild(this.element);
        }
    }
    
    // 存储所有粒子
    const particles = [];
    
    // 鼠标移动事件处理
    document.addEventListener('mousemove', (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        
        // 创建新粒子
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(mouseX, mouseY));
        }
    });
    
    // 动画循环
    function animate() {
        // 更新所有粒子
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            
            // 如果粒子透明度小于0，移除它
            if (particles[i].alpha <= 0) {
                particles[i].remove();
                particles.splice(i, 1);
                i--;
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
})();