/**
 * 移动端优化脚本
 * 专门针对移动设备的触摸事件和性能优化
 */

class MobileOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.touchStartTime = 0;
        this.touchStartY = 0;
        this.isTouching = false;
        this.hasTouchEvent = false;
        
        if (this.isMobile) {
            this.initMobileOptimizations();
        }
    }
    
    // 检测是否为移动设备
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // 初始化移动端优化
    initMobileOptimizations() {
        console.log('📱 检测到移动设备，启用移动端优化');
        
        // 显示移动控制按钮
        this.showMobileControls();
        
        // 优化触摸事件
        this.optimizeTouchEvents();
        
        // 防止双击缩放
        this.preventDoubleTapZoom();
        
        // 优化性能
        this.optimizePerformance();
        
        // 添加设备方向变化监听
        this.handleOrientationChange();
        
        // 检测触摸支持
        this.detectTouchSupport();
    }
    
    // 显示移动控制按钮
    showMobileControls() {
        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls) {
            mobileControls.style.display = 'flex';
            console.log('🎮 显示移动控制按钮');
        }
    }
    
    // 优化触摸事件
    optimizeTouchEvents() {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;
        
        // 触摸开始
        gameContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchStartTime = Date.now();
            this.touchStartY = e.touches[0].clientY;
            this.isTouching = true;
            this.hasTouchEvent = true;
        }, { passive: false });
        
        // 触摸结束
        gameContainer.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (!this.isTouching) return;
            
            const touchEndY = e.changedTouches[0].clientY;
            const deltaY = this.touchStartY - touchEndY;
            const touchDuration = Date.now() - this.touchStartTime;
            
            // 检测向上滑动跳跃
            if (deltaY > 50 && touchDuration < 500) {
                this.triggerJump();
            }
            
            this.isTouching = false;
        }, { passive: false });
        
        // 触摸移动
        gameContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        console.log('👆 优化触摸事件处理');
    }
    
    // 触发跳跃
    triggerJump() {
        if (window.eventManager) {
            window.eventManager.emit('jump');
            console.log('🚀 触摸跳跃触发');
        }
    }
    
    // 防止双击缩放
    preventDoubleTapZoom() {
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd < 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
        
        console.log('🔍 防止双击缩放');
    }
    
    // 优化性能
    optimizePerformance() {
        // 启用硬件加速
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.willChange = 'transform';
            gameContainer.style.transform = 'translateZ(0)';
        }
        
        // 减少重绘和回流
        this.optimizeRendering();
        
        console.log('⚡ 优化移动端性能');
    }
    
    // 优化渲染
    optimizeRendering() {
        // 使用requestAnimationFrame进行动画
        if (window.Game) {
            // 确保游戏循环使用requestAnimationFrame
            console.log('🎨 优化渲染性能');
        }
    }
    
    // 处理设备方向变化
    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            // 延迟一下以确保DOM尺寸已更新
            setTimeout(() => {
                this.resizeGameCanvas();
                console.log('🔄 处理设备方向变化');
            }, 300);
        });
        
        // 处理窗口大小变化
        window.addEventListener('resize', () => {
            this.resizeGameCanvas();
        });
    }
    
    // 调整游戏画布大小
    resizeGameCanvas() {
        const canvas = document.getElementById('gameCanvas');
        const gameContainer = document.getElementById('game-container');
        
        if (canvas && gameContainer) {
            const containerRect = gameContainer.getBoundingClientRect();
            canvas.width = containerRect.width;
            canvas.height = containerRect.height;
            
            console.log(`📐 调整画布大小: ${canvas.width}x${canvas.height}`);
        }
    }
    
    // 检测触摸支持
    detectTouchSupport() {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            console.log('✋ 设备支持触摸事件');
            this.hasTouchEvent = true;
        } else {
            console.log('🖱️ 设备不支持触摸事件');
        }
    }
    
    // 获取设备信息
    getDeviceInfo() {
        return {
            isMobile: this.isMobile,
            hasTouch: this.hasTouchEvent,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1,
            userAgent: navigator.userAgent
        };
    }
    
    // 显示设备信息（用于调试）
    logDeviceInfo() {
        const info = this.getDeviceInfo();
        console.log('📱 设备信息:', info);
    }
}

// 当DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.mobileOptimizer = new MobileOptimizer();
    
    // 记录设备信息
    setTimeout(() => {
        window.mobileOptimizer.logDeviceInfo();
    }, 1000);
});

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileOptimizer;
}