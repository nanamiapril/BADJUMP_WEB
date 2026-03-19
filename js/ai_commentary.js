class AICommentary {
    constructor() {
        this.subtitleElement = document.getElementById('ai-subtitle');
        this.avatarElement = document.getElementById('ai-avatar');
        this.currentComment = '';
        this.isSpeaking = false;
        
        // 语音合成设置
        this.speechSynthesis = window.speechSynthesis;
        this.voice = null;
        this.initVoice();
        
        // 状态跟踪
        this.lastJumpTime = Date.now();
        this.consecutiveFails = 0;
        this.gameStartTime = Date.now();
        this.lastNearMissTime = 0;
        this.lastLongPlayComment = 0;        
        // 各种游戏场景的评论
        this.comments = {
            start: [
                "Oh great, another hero thinks they can conquer this game. Spoiler: you can't.",
                "Let's see how long you last... probably not long enough to finish reading this sentence.",
                "Ready to embarrass yourself? Good, I brought popcorn.",
                "Remember, quitting is always an option. I recommend it.",
                "I'll be here to judge your every move... and laugh at most of them.",
                "Another day, another human thinking they can beat pixels. Adorable.",
                "Your suffering is my entertainment. Let the show begin!",
                "I've seen goldfish with better hand-eye coordination than you're about to demonstrate."
            ],
            jump: [
                "Wow, such height! Such grace! Not.",
                "That jump was so bad, even I'm embarrassed for you.",
                "Are you trying to fly or just flail around like a confused pigeon?",
                "I've seen sloths jump better than that. And they're literally designed to be slow.",
                "Nice try, but gravity still works. Maybe you should too?",
                "That jump was so weak, my grandma could jump higher... and she's been dead for 3 years.",
                "If jumping was a sport, you'd be the one handing out the participation trophies.",
                "I'm pretty sure a potato could jump more accurately than that.",
                "Pro tip: Try pressing the jump button slightly less pathetically next time.",
                "Is that the best you can do? My cat jumps better when she's asleep."
            ],
            fall: [
                "And down you go! Surprise, surprise.",
                "That fall was almost as pathetic as your hopes and dreams.",
                "Gravity: 1, You: 0. The scoreboard doesn't lie.",
                "Maybe try not falling next time? Just a thought.",
                "I could watch you fall all day... and I will. It's like a train wreck I can't look away from.",
                "Down goes Frazier! Except Frazier was actually good at something.",
                "That fall was so predictable, I had a haiku about it ready 10 seconds ago.",
                "You know what they say: if at first you don't succeed... quit, because clearly you're bad at this.",
                "I've seen more graceful exits in a demolition derby.",
                "Wow, that was... underwhelming. Even for you."
            ],
            score: {
                low: [
                    "A whole point! Call the president! Wait, no, he's busy with important things.",
                    "Wow, you're practically a professional... at being mediocre.",
                    "I'm impressed... no, wait, no I'm not. My mistake.",
                    "At this rate, you'll be a millionaire by 2150... in Monopoly money.",
                    "Big score! *yawn* Wake me when you hit double digits.",
                    "One whole point! I think that qualifies you for... absolutely nothing.",
                    "Congratulations! You've achieved the minimum possible achievement.",
                    "I've seen snails accumulate points faster than you.",
                    "That's not a score, that's a participation award.",
                    "Wow, one point! You must be so proud. Your mom would be... if she cared."
                ],
                medium: [
                    "Oh look, you can actually play the game! Color me shocked... not really.",
                    "Color me surprised, you're not completely terrible. Just mostly terrible.",
                    "Who taught you? A very patient teacher I hope... because you're a slow learner.",
                    "Maybe there's hope for you yet... maybe. Probably not, but maybe.",
                    "Keep going, you might reach double digits! Then we can celebrate with a juice box.",
                    "Hey, double digits! You're like a math prodigy... at the most basic level.",
                    "Look at you, Mr. Fancy Pants with your double-digit score.",
                    "Wow, 10 points! That's almost enough to buy a gumball... if you find a really cheap machine.",
                    "You know, for a human, that's actually... kind of sad. But whatever.",
                    "10 points! I guess even a broken clock is right twice a day."
                ],
                high: [
                    "Okay, I'll admit that was... decent. Don't let it go to your head though.",
                    "Someone's been practicing! Or cheating. Probably cheating.",
                    "Are you sure you're not a robot? Because humans aren't this good... usually.",
                    "I'm starting to think you might not be completely useless. Just mostly useless.",
                    "Wow, maybe you should quit your day job... but don't, you need the money for more practice.",
                    "Impressive! For a human. I still think my toaster could do better though.",
                    "Wow, someone actually learned something! Call the science journals!",
                    "High score? More like... slightly less terrible score. But I'll give you this one.",
                    "Okay, you win this round. But don't expect me to be nice about it next time.",
                    "Someone's been hitting the practice button! Or the cheat button. Either way, good job... I guess."
                ]
            },
            gameOver: [
                "Game over! What a shocker. I totally didn't see that coming... said no one ever.",
                "Well, that was... underwhelming. Even for you.",
                "I knew you'd fail, but not this spectacularly. You really outdid yourself this time.",
                "Better luck next time! And the time after that. And the time after that. You'll need it.",
                "Don't worry, even babies fall down a lot before they learn to walk... but they learn faster than you.",
                "Game over! The only thing more predictable than your failure was my disappointment in you.",
                "Well, that was brief. Like your attention span.",
                "Another day, another failure. At least you're consistent.",
                "I've seen more determination in a goldfish trying to swim in a circle.",
                "Wow, that was... pathetic. Even by your standards.",
                "Game over! Time to go back to your regular life of mediocrity.",
                "Well, at least you tried... poorly, but you tried."
            ],
            // 新增场景：长时间没有跳跃
            noJump: [
                "Waiting for something? A miracle? Because it's not coming.",
                "Cat got your tongue... or your jump button?",
                "You know you can jump, right? Just making sure.",
                "Is this a staring contest? Because I'll win. I don't blink.",
                "Hello? Anyone home? Or did you forget how to play?",
                "Wow, standing still is really your specialty, huh?",
                "I've seen statues with more movement than you right now.",
                "If you wanted to be a tree, you should have played a different game."
            ],
            // 新增场景：连续跳跃失败
            consecutiveFail: [
                "Three in a row! You're on a losing streak!",
                "Wow, you're really consistent... consistently bad.",
                "Maybe take a break? You clearly need it.",
                "This is getting sad. Even for me to watch.",
                "I'm starting to think you enjoy failing. That's... concerning.",
                "Five fails in a row! That's a new record... for failure.",
                "Is this some kind of performance art? Because it's terrible art."
            ],
            // 新增场景：接近平台但错过
            nearMiss: [
                "So close! But not close enough. Just like your dreams.",
                "Almost there! But 'almost' doesn't count... except in horseshoes and hand grenades.",
                "Wow, you almost made it! I was almost impressed.",
                "So close I could taste it! Too bad you couldn't reach it.",
                "That was almost good! But 'almost' is just another word for 'not quite'.",
                "Missed it by that much! *holds up thumb and forefinger barely apart*"
            ],
            // 新增场景：长时间游戏
            longPlay: [
                "Wow, you're still here? I'm impressed... but not by your skills.",
                "Someone's got stamina! Too bad it's not matched by talent.",
                "How much longer are you going to tortu... I mean, play this?",
                "I've seen marriages last less than this game session.",
                "Are you trying to break a record? For longest mediocre gameplay?",
                "You know there's a real world outside this game, right? Just checking."
            ],
            // 新增场景：快速反应成功
            quickSave: [
                "Oh! That was actually... not terrible. Don't get used to it.",
                "Nice reflexes! For a human. My toaster is still faster.",
                "Wow, you actually reacted in time! I'm... slightly less disappointed.",
                "That was almost impressive! Key word: almost.",
                "Quick save! Too bad your overall performance is still terrible."
            ]
        };
    }

    // 初始化语音
    initVoice() {
        // 等待语音合成API加载完成
        const checkVoice = () => {
            const voices = this.speechSynthesis.getVoices();
            if (voices.length > 0) {
                // 选择一个合适的语音（优先选择英语语音）
                this.voice = voices.find(v => v.lang.includes('en')) || voices[0];
            } else {
                setTimeout(checkVoice, 100);
            }
        };
        
        // 监听语音加载事件
        window.speechSynthesis.onvoiceschanged = checkVoice;
        checkVoice(); // 立即检查一次
    }

    // 播放语音
    playVoice(text) {
        // 停止之前的语音
        this.speechSynthesis.cancel();
        
        if (!this.voice) {
            console.log('语音未加载完成，无法播放');
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;
        utterance.lang = 'en-US';
        utterance.rate = 1.1; // 语速稍快，显得更刻薄
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        this.speechSynthesis.speak(utterance);
    }

    // 显示评论
    speak(comment, duration = 3000) {
        if (this.isSpeaking) return;
        
        this.isSpeaking = true;
        this.currentComment = comment;
        
        // 播放语音
        this.playVoice(comment);
        
        // 打字机效果
        this.typeWriter(comment, 0, 50);
        
        // 动画效果
        this.avatarElement.style.animation = 'none';
        setTimeout(() => {
            this.avatarElement.style.animation = 'pulse 0.5s ease-in-out';
        }, 10);
        
        // 自动清除
        setTimeout(() => {
            this.clear();
        }, duration);
    }

    // 打字机效果
    typeWriter(text, index, speed) {
        if (index < text.length) {
            this.subtitleElement.textContent = text.substring(0, index + 1);
            setTimeout(() => {
                this.typeWriter(text, index + 1, speed);
            }, speed);
        } else {
            setTimeout(() => {
                this.isSpeaking = false;
            }, 500);
        }
    }

    // 清除评论
    clear() {
        this.subtitleElement.style.opacity = '0';
        setTimeout(() => {
            this.subtitleElement.textContent = '';
            this.subtitleElement.style.opacity = '1';
        }, 300);
    }

    // 获取随机评论
    getRandomComment(type, score = 0) {
        let comments;
        
        if (type === 'score') {
            if (score < 10) {
                comments = this.comments.score.low;
            } else if (score < 30) {
                comments = this.comments.score.medium;
            } else {
                comments = this.comments.score.high;
            }
        } else {
            comments = this.comments[type];
        }
        
        return comments[Math.floor(Math.random() * comments.length)];
    }

    // 触发特定事件的评论
    onEvent(event, data = {}) {
        switch (event) {
            case 'gameStart':
                this.gameStartTime = Date.now();
                this.lastJumpTime = Date.now();
                this.consecutiveFails = 0;
                this.speak(this.getRandomComment('start'), 4000);
                break;
                
            case 'jump':
                this.lastJumpTime = Date.now();
                this.consecutiveFails = 0;
                if (Math.random() < 0.4) { // 增加到40%概率
                    this.speak(this.getRandomComment('jump'));
                }
                break;
                
            case 'fall':
                this.consecutiveFails++;
                if (this.consecutiveFails >= 3) {
                    this.speak(this.getRandomComment('consecutiveFail'));
                } else {
                    this.speak(this.getRandomComment('fall'));
                }
                break;
                
            case 'score':
                if (Math.random() < 0.6) { // 增加到60%概率
                    this.speak(this.getRandomComment('score', data.score));
                }
                break;
                
            case 'gameOver':
                // 不显示实时吐槽，只在游戏结束界面显示
                this.clear();
                // 设置最终评论（不包含分数）
                document.getElementById('ai-final-comment').textContent = 
                    this.getRandomComment('gameOver');
                break;
                
            case 'nearMiss':
                const now = Date.now();
                if (now - this.lastNearMissTime > 2000) { // 2秒内不重复触发
                    this.lastNearMissTime = now;
                    this.speak(this.getRandomComment('nearMiss'));
                }
                break;
                
            case 'quickSave':
                this.speak(this.getRandomComment('quickSave'));
                break;
        }
        
        // 检查长时间没有跳跃
        this.checkNoJump();
        
        // 检查长时间游戏
        this.checkLongPlay();
    }
    
    // 检查长时间没有跳跃
    checkNoJump() {
        const now = Date.now();
        if (now - this.lastJumpTime > 8000 && !this.isSpeaking) { // 8秒没跳且AI没在说话
            this.speak(this.getRandomComment('noJump'));
            this.lastJumpTime = now + 3000; // 避免立即再次触发
        }
    }
    
    // 检查长时间游戏
    checkLongPlay() {
        const now = Date.now();
        const gameTime = now - this.gameStartTime;
        if (gameTime > 60000 && now - this.lastLongPlayComment > 30000) { // 1分钟游戏时间，每30秒提醒一次
            this.lastLongPlayComment = now;
            this.speak(this.getRandomComment('longPlay'));
        }
    }
    
    // 检测接近平台但错过的情况
    detectNearMiss(player, platforms) {
        const now = Date.now();
        if (now - this.lastNearMissTime < 1000) return; // 1秒内不重复检测
        
        const playerBottom = player.y + player.height;
        const playerCenter = player.x + player.width / 2;
        
        for (let platform of platforms) {
            // 检查是否在平台上方很近的位置错过
            if (playerBottom < platform.y + 20 && 
                playerBottom > platform.y - 10 &&
                playerCenter > platform.x - 20 &&
                playerCenter < platform.x + platform.width + 20) {
                this.onEvent('nearMiss');
                break;
            }
        }
    }
    
    // 检测快速反应成功的情况
    detectQuickSave(player, platforms) {
        // 这里可以添加检测逻辑，比如检测玩家是否在即将掉落时成功跳到平台
        // 简化版本：随机触发
        if (Math.random() < 0.1 && player.isOnGround) {
            this.onEvent('quickSave');
        }
    }
}

// 全局AI评论实例
window.aiCommentary = new AICommentary();