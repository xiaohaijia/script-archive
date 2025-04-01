// ==UserScript==
// @name         鼠标跟随特效
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  为鼠标添加丝滑跟随特效
// @author       Trae AI
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建Canvas元素
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 设置Canvas样式
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    // 调整Canvas大小以匹配窗口
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // 初始调整和监听窗口大小变化
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 粒子类
    class Particle {
        constructor(x, y, hue) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.hue = hue || Math.random() * 360;
            this.alpha = 1;
            this.decay = 0.015 + Math.random() * 0.01; // 随机衰减速度
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= this.decay;

            // 轻微减速效果
            this.speedX *= 0.99;
            this.speedY *= 0.99;
        }

        draw() {
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();

            // 创建径向渐变
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 2
            );

            gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${this.alpha})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);

            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 鼠标轨迹点
    class TrailPoint {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.age = 0;
            this.maxAge = 15; // 轨迹点存活时间
        }

        update() {
            this.age++;
            return this.age < this.maxAge;
        }
    }

    // 存储所有粒子和轨迹点
    const particles = [];
    const trail = [];

    // 鼠标位置
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let isMoving = false;
    let moveTimeout;
    let hue = 0;

    // 鼠标移动事件处理
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        // 检测鼠标是否在移动
        isMoving = true;
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            isMoving = false;
        }, 100);

        // 添加轨迹点
        trail.push(new TrailPoint(mouseX, mouseY));

        // 限制轨迹点数量
        if (trail.length > 30) {
            trail.shift();
        }

        // 根据鼠标移动速度计算粒子数量
        const dx = mouseX - lastMouseX;
        const dy = mouseY - lastMouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 只有当鼠标移动足够距离时才创建粒子
        if (distance > 5) {
            const particleCount = Math.min(Math.floor(distance / 10) + 1, 3);

            // 在鼠标当前位置和上一个位置之间创建粒子
            for (let i = 0; i < particleCount; i++) {
                const ratio = i / particleCount;
                const x = lastMouseX + dx * ratio;
                const y = lastMouseY + dy * ratio;

                // 使用渐变色
                hue = (hue + 1) % 360;
                particles.push(new Particle(x, y, hue));
            }
        }

        lastMouseX = mouseX;
        lastMouseY = mouseY;
    });

    // 动画循环
    function animate() {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制轨迹线
        if (trail.length > 1) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // 更新并过滤轨迹点
            const activeTrail = trail.filter(point => point.update());

            if (activeTrail.length > 1) {
                ctx.moveTo(activeTrail[0].x, activeTrail[0].y);

                for (let i = 1; i < activeTrail.length; i++) {
                    const point = activeTrail[i];
                    const prevPoint = activeTrail[i - 1];

                    // 使用贝塞尔曲线使轨迹更平滑
                    const xc = (prevPoint.x + point.x) / 2;
                    const yc = (prevPoint.y + point.y) / 2;

                    // 第一个点使用线段
                    if (i === 1) {
                        ctx.lineTo(xc, yc);
                    } else {
                        ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, xc, yc);
                    }

                    // 计算透明度
                    const alpha = 1 - point.age / point.maxAge;
                    const trailHue = (hue + i * 5) % 360;

                    ctx.strokeStyle = `hsla(${trailHue}, 100%, 60%, ${alpha * 0.3})`;
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(xc, yc);
                }
            }
        }

        // 更新并绘制所有粒子
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // 如果粒子透明度小于0，移除它
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }

        // 限制粒子总数，防止性能问题
        if (particles.length > 100) {
            particles.splice(0, particles.length - 100);
        }

        requestAnimationFrame(animate);
    }

    animate();
})();