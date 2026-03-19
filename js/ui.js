class UIManager {
    constructor() {
        this.scoreDisplay = document.getElementById('score-display');
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.finalScoreElement = document.getElementById('final-score');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        const eventManager = window.eventManager;
        
        eventManager.on('gameStart', () => {
            this.hideStartScreen();
        });
        
        eventManager.on('gameOver', (data) => {
            this.showGameOverScreen(data.score);
        });
        
        eventManager.on('scoreUpdate', (data) => {
            this.updateScore(data.score);
        });
        
        // 添加分享按钮事件监听
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                const score = this.finalScoreElement.textContent;
                this.shareGame(parseInt(score));
            });
        }
    }

    showStartScreen() {
        this.startScreen.style.display = 'block';
        this.gameOverScreen.style.display = 'none';
    }

    hideStartScreen() {
        this.startScreen.style.display = 'none';
    }

    showGameOverScreen(score) {
        this.gameOverScreen.style.display = 'block';
        this.finalScoreElement.textContent = score;
    }

    hideGameOverScreen() {
        this.gameOverScreen.style.display = 'none';
    }

    updateScore(score) {
        this.scoreDisplay.textContent = `Score: ${score}`;
        
        // 添加分数更新动画
        this.scoreDisplay.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.scoreDisplay.style.transform = 'scale(1)';
        }, 100);
    }

    // 分享功能
    shareGame(score) {
        const text = `I scored ${score} in BADJUMP! Can you do better? 🎮`;
        
        if (navigator.share) {
            navigator.share({
                title: 'BADJUMP',
                text: text,
                url: window.location.href
            });
        } else {
            // 复制到剪贴板
            navigator.clipboard.writeText(text).then(() => {
                alert('Score copied to clipboard! Share it with your friends!');
            });
        }
    }
}

// 全局UI管理器实例
window.uiManager = new UIManager();