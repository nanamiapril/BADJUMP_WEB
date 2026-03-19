class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = false;
        this.lastTime = 0;
        this.score = 0;
        this.highScore = localStorage.getItem('roastMyGameHighScore') || 0;
        
        this.setupCanvas();
        this.init();
        this.setupEventListeners();
        this.gameLoop();
    }

    setupCanvas() {
        // 设置画布尺寸
        this.canvas.width = 400;
        this.canvas.height = 600;
        
        // 设置像素化渲染
        this.ctx.imageSmoothingEnabled = false;
    }

    init() {
        this.player = new Player(this.canvas);
        this.platformManager = new PlatformManager(this.canvas);
        this.uiManager = window.uiManager;
        this.aiCommentary = window.aiCommentary;
        this.eventManager = window.eventManager;
        
        // 显示开始屏幕
        this.uiManager.showStartScreen();
    }

    setupEventListeners() {
        this.eventManager.on('startGame', () => {
            this.start();
        });
        
        this.eventManager.on('restartGame', () => {
            this.restart();
        });
        
        this.eventManager.on('shareGame', () => {
            this.uiManager.shareGame(this.score);
        });
        
        this.eventManager.on('playerFall', () => {
            this.gameOver();
        });
    }

    start() {
        this.isRunning = true;
        this.uiManager.hideStartScreen();
        this.aiCommentary.onEvent('gameStart');
        this.lastScoreUpdate = 0;
    }

    restart() {
        this.player.reset();
        this.platformManager.reset();
        this.score = 0;
        this.uiManager.updateScore(0);
        this.uiManager.hideGameOverScreen();
        this.start();
    }

    gameOver() {
        this.isRunning = false;
        
        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('roastMyGameHighScore', this.highScore);
        }
        
        this.aiCommentary.onEvent('gameOver', { score: this.score });
        this.eventManager.emit('gameOver', { score: this.score });
    }

    update(deltaTime) {
        if (!this.isRunning) return;
        
        // 更新事件管理器
        this.eventManager.update();
        
        // 更新玩家
        this.player.update(this.platformManager.platforms);
        
        // AI检测特殊情况
        this.aiCommentary.detectNearMiss(this.player, this.platformManager.platforms);
        this.aiCommentary.detectQuickSave(this.player, this.platformManager.platforms);
        
        // 更新平台
        this.platformManager.update();
        
        // 更新分数
        const newScore = this.platformManager.getScore();
        if (newScore !== this.score) {
            this.score = newScore;
            this.uiManager.updateScore(this.score);
            
            // 每10分触发一次评论
            if (this.score > 0 && this.score % 10 === 0 && this.score !== this.lastScoreUpdate) {
                this.aiCommentary.onEvent('score', { score: this.score });
                this.lastScoreUpdate = this.score;
            }
        }
    }

    draw() {
        // 如果游戏未运行，不进行任何绘制
        if (!this.isRunning) {
            return;
        }
        
        // 清空画布
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景网格
        this.drawBackground();
        
        // 绘制平台
        this.platformManager.draw(this.ctx);
        
        // 绘制玩家
        this.player.draw();
        
        // 绘制UI元素
        this.drawUI();
    }

    drawBackground() {
        // 绘制像素网格
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
        this.ctx.lineWidth = 1;
        
        // 垂直线
        for (let x = 0; x < this.canvas.width; x += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // 水平线
        for (let y = 0; y < this.canvas.height; y += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawUI() {
        // 绘制最高分
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '12px Courier New';
        this.ctx.fillText(`High Score: ${this.highScore}`, 10, 30);
    }

    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// 当页面加载完成时启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});