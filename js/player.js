class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // 玩家属性
        this.x = 50;
        this.y = 510;
        this.width = 40;
        this.height = 40;
        this.speed = 5;
        this.jumpForce = 14;
        this.gravity = 0.45;
        this.velocityY = 0;
        this.velocityX = 0;
        this.isJumping = false;
        this.isOnGround = true;
        this.facingRight = true;
        
        // 动画状态
        this.animationFrame = 0;
        this.animationSpeed = 0.1;
        
        // 粒子效果
        this.particles = [];
        
        // 加载新的像素猫头像
        this.catImage = new Image();
        this.catImage.src = 'https://p11-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/770b7d0809c54426a54e218fc26fe8fe~tplv-a9rns2rl98-image.image?lk3s=8e244e95&rcl=2026031820563370FD3E07BB539DC7679D&rrcfp=f06b921b&x-expires=1776430614&x-signature=RkgAu0MV7I7DvTbWpHM7G7rpMr8%3D';
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        const eventManager = window.eventManager;
        
        eventManager.on('moveLeft', () => {
            this.moveLeft();
        });
        
        eventManager.on('moveRight', () => {
            this.moveRight();
        });
        
        eventManager.on('jump', () => {
            this.jump();
        });
    }

    moveLeft() {
        this.velocityX = -this.speed;
        this.facingRight = false;
    }

    moveRight() {
        this.velocityX = this.speed;
        this.facingRight = true;
    }

    jump() {
        if (!this.isJumping && this.isOnGround) {
            this.velocityY = -this.jumpForce;
            this.isJumping = true;
            this.isOnGround = false;
            window.aiCommentary.onEvent('jump');
            
            // 创建跳跃粒子效果
            this.createJumpParticles();
        }
    }

    createJumpParticles() {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * -2 - 2,
                life: 30,
                maxLife: 30
            });
        }
    }

    createFallParticles() {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 40,
                maxLife: 40
            });
        }
    }

    update(platforms) {
        // 更新动画
        this.animationFrame += this.animationSpeed;
        
        // 应用重力
        this.velocityY += this.gravity;
        
        // 更新位置
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // 摩擦力
        this.velocityX *= 0.8;
        
        // 边界检查
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.canvas.width) {
            this.x = this.canvas.width - this.width;
        }
        
        // 平台碰撞检测
        this.isOnGround = false;
        platforms.forEach(platform => {
            if (this.checkCollision(platform)) {
                if (this.velocityY > 0) {
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.isJumping = false;
                    this.isOnGround = true;
                } else if (this.velocityY < 0) {
                    this.y = platform.y + platform.height;
                    this.velocityY = 0;
                }
            }
        });
        
        // 检查是否掉落
        if (this.y > this.canvas.height) {
            window.aiCommentary.onEvent('fall');
            this.createFallParticles();
            window.eventManager.emit('playerFall');
        }
        
        // 更新粒子
        this.updateParticles();
    }

    checkCollision(platform) {
        return this.x < platform.x + platform.width &&
               this.x + this.width > platform.x &&
               this.y < platform.y + platform.height &&
               this.y + this.height > platform.y;
    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2;
            particle.life--;
            return particle.life > 0;
        });
    }

    draw() {
        // 绘制粒子
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            this.ctx.fillRect(particle.x, particle.y, 3, 3);
        });
        
        // 保存当前绘图状态
        this.ctx.save();
        
        // 设置像素化渲染
        this.ctx.imageSmoothingEnabled = false;
        
        // 根据朝向翻转图像
        if (!this.facingRight) {
            this.ctx.translate(this.x + this.width, this.y);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(this.catImage, 0, 0, this.width, this.height);
        } else {
            this.ctx.drawImage(this.catImage, this.x, this.y, this.width, this.height);
        }
        
        // 恢复绘图状态
        this.ctx.restore();
        
        // 跳跃动画效果
        if (this.isJumping) {
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
            this.ctx.fillRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        }
    }

    reset() {
        this.x = 50;
        this.y = 510;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.isOnGround = true;
        this.particles = [];
    }
}

// 全局玩家实例
window.Player = Player;