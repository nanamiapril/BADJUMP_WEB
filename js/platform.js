class Platform {
    constructor(x, y, width, height, color = '#00ff00') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 0;
        this.isMoving = false;
        this.originalX = x;
        this.moveRange = 100;
    }

    update() {
        if (this.isMoving) {
            this.x += this.speed;
            
            // 左右移动边界检查
            if (Math.abs(this.x - this.originalX) > this.moveRange) {
                this.speed *= -1;
            }
        }
    }

    draw(ctx) {
        // 绘制平台（像素风格）
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 添加像素细节
        ctx.fillStyle = '#00cc00';
        for (let i = 0; i < this.width; i += 10) {
            ctx.fillRect(this.x + i, this.y, 2, 2);
        }
    }
}

class PlatformManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.platforms = [];
        this.scrollSpeed = 3;
        this.score = 0;
        this.lastPlatformY = canvas.height - 50;
        this.platformWidth = 80;
        this.platformHeight = 10;
        
        this.createInitialPlatforms();
    }

    createInitialPlatforms() {
        // 创建起始平台
        this.platforms.push(new Platform(
            this.canvas.width / 2 - 40,
            this.canvas.height - 50,
            100,
            this.platformHeight
        ));
        
        // 创建一些初始平台
        for (let i = 0; i < 5; i++) {
            this.createRandomPlatform();
        }
    }

    createRandomPlatform() {
        const x = Math.random() * (this.canvas.width - this.platformWidth - 40) + 20;
        const y = this.lastPlatformY - Math.random() * 80 - 60;
        
        const platform = new Platform(x, y, this.platformWidth, this.platformHeight);
        
        // 随机设置一些平台为移动平台
        if (Math.random() < 0.2) {
            platform.isMoving = true;
            platform.speed = (Math.random() - 0.5) * 4;
            platform.color = '#ffff00';
        }
        
        // 随机设置一些平台为消失平台
        if (Math.random() < 0.1) {
            platform.color = '#ff6b6b';
            platform.isDisappearing = true;
        }
        
        this.platforms.push(platform);
        this.lastPlatformY = y;
    }

    update() {
        // 平台向上滚动
        this.platforms.forEach(platform => {
            platform.y += this.scrollSpeed;
            platform.update();
        });
        
        // 移除离开屏幕的平台
        this.platforms = this.platforms.filter(platform => 
            platform.y < this.canvas.height + 100
        );
        
        // 创建新平台
        while (this.platforms.length < 8) {
            this.createRandomPlatform();
        }
        
        // 更新分数（基于滚动距离）
        this.score += this.scrollSpeed * 0.1;
    }

    draw(ctx) {
        this.platforms.forEach(platform => platform.draw(ctx));
    }

    reset() {
        this.platforms = [];
        this.score = 0;
        this.lastPlatformY = this.canvas.height - 50;
        this.createInitialPlatforms();
    }

    getScore() {
        return Math.floor(this.score);
    }
}

// 全局平台管理器实例
window.PlatformManager = PlatformManager;