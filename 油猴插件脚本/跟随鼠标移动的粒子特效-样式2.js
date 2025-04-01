// ==UserScript==
// @name         鼠标跟随特效
// @namespace    http://tampermonkey.net/
// @version      0.2
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
    
    // 鼠标位置跟踪
    let mouseX = 0;
    let mouseY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    
    // 粒子类
    class Particle {
        constructor(x, y, type = 'circle') {
            this.x = x;
            this.y = y;
            this.type = type;
            this.size = Math.random() * 8 + 2;
            this.speedX = (Math.random() - 0.5) * 3;
            this.speedY = (Math.random() - 0.5) * 3;
            this.gravity = Math.random() * 0.1;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 5;
            
            // 使用更丰富的颜色范围
            const hue = Math.random() * 60 + 180; // 蓝紫色系
            this.color = `hsl(${hue}, 100%, 70%)`;
            this.alpha = 1;
            
            this.element = document.createElement('div');
            this.element.style.position = 'absolute';
            this.element.style.width = `${this.size}px`;
            this.element.style.height = `${this.size}px`;
            
            if (this.type === 'circle') {
                this.element.style.backgroundColor = this.color;
                this.element.style.borderRadius = '50%';
            } else if (this.type === 'star') {
                this.element.style.backgroundColor = 'transparent';
                this.element.style.boxShadow = 'none';
                this.element.style.width = '0';
                this.element.style.height = '0';
                this.element.style.borderLeft = `${this.size}px solid transparent`;
                this.element.style.borderRight = `${this.size}px solid transparent`;
                this.element.style.borderBottom = `${this.size * 2}px solid ${this.color}`;
            } else if (this.type === 'square') {
                this.element.style.backgroundColor = this.color;
                this.element.style.borderRadius = '2px';
            }
            
            this.element.style.boxShadow = `0 0 ${this.size * 2}px ${this.color}`;
            this.element.style.opacity = this.alpha;
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
            this.element.style.transform = `rotate(${this.rotation}deg) scale(1)`;
            this.element.style.transition = 'transform 0.2s ease-out';
            container.appendChild(this.element);
        }
        
        update() {
            this.speedY += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            this.alpha -= 0.015;
            
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
            this.element.style.opacity = this.alpha;
            this.element.style.transform = `rotate(${this.rotation}deg) scale(${this.alpha})`;
            
            // 添加脉动效果
            const pulseScale = 1 + Math.sin(Date.now() * 0.01) * 0.1;
            this.element.style.transform = `rotate(${this.rotation}deg) scale(${this.alpha * pulseScale})`;
        }
        
        remove() {
            container.removeChild(this.element);
        }
    }
    
    // 尾迹点类
    class TrailDot {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.color = `hsl(${Math.random() * 60 + 180}, 100%, 70%)`;
            this.alpha = 0.7;
            this.element = document.createElement('div');
            this.element.style.position = 'absolute';
            this.element.style.width = `${this.size}px`;
            this.element.style.height = `${this.size}px`;
            this.element.style.backgroundColor = this.color;
            this.element.style.borderRadius = '50%';
            this.element.style.boxShadow = `0 0 ${this.size}px ${this.color}`;
            this.element.style.opacity = this.alpha;
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
            container.appendChild(this.element);
        }
        
        update() {
            this.alpha -= 0.03;
            this.element.style.opacity = this.alpha;
        }
        
        remove() {
            container.removeChild(this.element);
        }
    }
    
    // 存储所有粒子和尾迹点
    const particles = [];
    const trailDots = [];
    
    // 鼠标移动事件处理
    document.addEventListener('mousemove', (event) => {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = event.clientX;
        mouseY = event.clientY;
        
        // 计算鼠标移动速度
        const speed = Math.sqrt(Math.pow(mouseX - prevMouseX, 2) + Math.pow(mouseY - prevMouseY, 2));
        
        // 根据鼠标速度创建不同数量的粒子
        const particleCount = Math.min(Math.floor(speed / 2) + 1, 5);
        
        // 创建新粒子
        for (let i = 0; i < particleCount; i++) {
            // 随机选择粒子类型
            const types = ['circle', 'star', 'square'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            // 在鼠标周围随机位置创建粒子
            const offsetX = (Math.random() - 0.5) * 10;
            const offsetY = (Math.random() - 0.5) * 10;
            particles.push(new Particle(mouseX + offsetX, mouseY + offsetY, type));
        }
        
        // 创建尾迹点
        if (Math.random() > 0.5) {
            trailDots.push(new TrailDot(mouseX, mouseY));
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
        
        // 更新所有尾迹点
        for (let i = 0; i < trailDots.length; i++) {
            trailDots[i].update();
            
            // 如果尾迹点透明度小于0，移除它
            if (trailDots[i].alpha <= 0) {
                trailDots[i].remove();
                trailDots.splice(i, 1);
                i--;
            }
        }
        
        // 限制粒子数量，防止性能问题
        if (particles.length > 100) {
            const toRemove = particles.splice(0, particles.length - 100);
            toRemove.forEach(p => p.remove());
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
})();