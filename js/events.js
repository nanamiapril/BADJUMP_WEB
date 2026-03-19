class EventManager {
    constructor() {
        this.events = {};
        this.keys = {};
        this.setupEventListeners();
    }

    // 添加事件监听器
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    // 触发事件
    emit(event, data = {}) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }

    // 设置事件监听器
    setupEventListeners() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) {
                this.keys[e.code] = true;
                this.emit('keydown', { key: e.code });
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            this.emit('keyup', { key: e.code });
        });

        // 触摸事件
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // 简单的手势识别
            if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -50) {
                this.emit('jump');
            }
        });

        // 按钮事件
        document.getElementById('start-btn').addEventListener('click', () => {
            this.emit('startGame');
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.emit('restartGame');
        });

        document.getElementById('share-btn').addEventListener('click', () => {
            this.emit('shareGame');
        });

        // 移动控制按钮
        document.getElementById('left-btn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys['ArrowLeft'] = true;
        });

        document.getElementById('left-btn').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['ArrowLeft'] = false;
        });

        document.getElementById('right-btn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys['ArrowRight'] = true;
        });

        document.getElementById('right-btn').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['ArrowRight'] = false;
        });

        document.getElementById('jump-btn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.emit('jump');
        });

        // 鼠标点击跳跃（用于桌面）
        document.addEventListener('click', (e) => {
            const gameContainer = document.getElementById('game-container');
            if (gameContainer.contains(e.target)) {
                this.emit('jump');
            }
        });
    }

    // 检查键是否被按下
    isKeyPressed(key) {
        return this.keys[key] || false;
    }

    // 更新（用于持续按键检测）
    update() {
        // 检测持续按键
        if (this.isKeyPressed('ArrowLeft')) {
            this.emit('moveLeft');
        }
        if (this.isKeyPressed('ArrowRight')) {
            this.emit('moveRight');
        }
        if (this.isKeyPressed('Space') || this.isKeyPressed('ArrowUp')) {
            this.emit('jump');
        }
    }
}

// 全局事件管理器实例
window.eventManager = new EventManager();
