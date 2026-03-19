#!/usr/bin/env node

/**
 * TalkTrash 游戏一键部署脚本
 * 自动部署到 GitHub Pages
 */

const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 创建命令行交互
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 颜色输出
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m'
};

// 项目信息
const projectInfo = {
    name: 'TalkTrash',
    description: 'AI语音吐槽跳跃游戏',
    version: '1.0.0'
};

// 显示欢迎信息
function showWelcome() {
    console.log(`\n${colors.magenta}🚀 ${colors.bright}TalkTrash 一键部署工具${colors.reset}`);
    console.log(`${colors.blue}====================================${colors.reset}\n`);
    console.log(`${colors.yellow}项目:${colors.reset} ${projectInfo.name}`);
    console.log(`${colors.yellow}版本:${colors.reset} ${projectInfo.version}`);
    console.log(`${colors.yellow}描述:${colors.reset} ${projectInfo.description}\n`);
}

// 检查Git是否安装
function checkGit() {
    try {
        execSync('git --version', { stdio: 'ignore' });
        return true;
    } catch (error) {
        console.log(`${colors.red}❌ Git 未安装，请先安装 Git${colors.reset}`);
        console.log(`${colors.yellow}📥 下载地址: https://git-scm.com/downloads${colors.reset}`);
        return false;
    }
}

// 检查GitHub账号配置
function checkGitHubConfig() {
    try {
        const username = execSync('git config --global user.name').toString().trim();
        const email = execSync('git config --global user.email').toString().trim();
        
        if (username && email) {
            console.log(`${colors.green}✅ GitHub 账号已配置${colors.reset}`);
            console.log(`${colors.yellow}👤 用户名:${colors.reset} ${username}`);
            console.log(`${colors.yellow}📧 邮箱:${colors.reset} ${email}`);
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

// 配置GitHub账号
function setupGitHubConfig() {
    return new Promise((resolve) => {
        console.log(`${colors.yellow}📝 请配置您的 GitHub 账号信息:${colors.reset}`);
        
        rl.question('GitHub 用户名: ', (username) => {
            rl.question('GitHub 邮箱: ', (email) => {
                if (username && email) {
                    try {
                        execSync(`git config --global user.name "${username}"`);
                        execSync(`git config --global user.email "${email}"`);
                        console.log(`${colors.green}✅ GitHub 账号配置成功${colors.reset}`);
                        resolve(true);
                    } catch (error) {
                        console.log(`${colors.red}❌ GitHub 账号配置失败${colors.reset}`);
                        resolve(false);
                    }
                } else {
                    console.log(`${colors.red}❌ 用户名和邮箱不能为空${colors.reset}`);
                    resolve(false);
                }
            });
        });
    });
}

// 创建GitHub仓库
function createGitHubRepo(repoName) {
    return new Promise((resolve) => {
        console.log(`${colors.yellow}🔄 正在创建 GitHub 仓库...${colors.reset}`);
        
        // 这里简化处理，实际应该使用GitHub API
        console.log(`${colors.green}✅ 请手动在GitHub创建仓库: ${repoName}${colors.reset}`);
        console.log(`${colors.blue}📌 访问: https://github.com/new${colors.reset}`);
        console.log(`${colors.yellow}💡 注意: 不要初始化README文件${colors.reset}`);
        
        rl.question('仓库创建完成后按 Enter 继续...', () => {
            resolve(true);
        });
    });
}

// 初始化Git仓库
function initGitRepo() {
    try {
        console.log(`${colors.yellow}🔄 初始化 Git 仓库...${colors.reset}`);
        
        // 检查是否已有.git目录
        if (fs.existsSync('.git')) {
            console.log(`${colors.yellow}⚠️ Git 仓库已存在，跳过初始化${colors.reset}`);
            return true;
        }
        
        execSync('git init');
        execSync('git add .');
        execSync('git commit -m "Initial commit: TalkTrash game"');
        
        console.log(`${colors.green}✅ Git 仓库初始化成功${colors.reset}`);
        return true;
    } catch (error) {
        console.log(`${colors.red}❌ Git 仓库初始化失败: ${error.message}${colors.reset}`);
        return false;
    }
}

// 添加远程仓库
function addRemoteRepo(repoUrl) {
    try {
        console.log(`${colors.yellow}🔄 添加远程仓库...${colors.reset}`);
        
        // 检查是否已有远程仓库
        try {
            const remote = execSync('git remote get-url origin').toString().trim();
            if (remote) {
                console.log(`${colors.yellow}⚠️ 远程仓库已存在: ${remote}${colors.reset}`);
                return true;
            }
        } catch (e) {
            // 没有远程仓库，继续
        }
        
        execSync(`git remote add origin ${repoUrl}`);
        console.log(`${colors.green}✅ 远程仓库添加成功${colors.reset}`);
        return true;
    } catch (error) {
        console.log(`${colors.red}❌ 远程仓库添加失败: ${error.message}${colors.reset}`);
        return false;
    }
}

// 推送到GitHub
function pushToGitHub() {
    try {
        console.log(`${colors.yellow}🔄 推送到 GitHub...${colors.reset}`);
        
        // 确保有main分支
        try {
            execSync('git branch -M main');
        } catch (e) {
            // 分支可能已经存在
        }
        
        execSync('git push -u origin main');
        console.log(`${colors.green}✅ 推送成功！${colors.reset}`);
        return true;
    } catch (error) {
        console.log(`${colors.red}❌ 推送失败: ${error.message}${colors.reset}`);
        console.log(`${colors.yellow}💡 提示: 请检查网络连接和仓库权限${colors.reset}`);
        return false;
    }
}

// 启用GitHub Pages
function enableGitHubPages() {
    console.log(`${colors.yellow}🔄 配置 GitHub Pages...${colors.reset}`);
    console.log(`${colors.green}✅ 请手动启用 GitHub Pages:${colors.reset}`);
    console.log(`${colors.blue}1. 访问您的GitHub仓库${colors.reset}`);
    console.log(`${colors.blue}2. 进入 Settings → Pages${colors.reset}`);
    console.log(`${colors.blue}3. Source 选择 main 分支，目录选择 / (root)${colors.reset}`);
    console.log(`${colors.blue}4. 点击 Save${colors.reset}`);
    console.log(`${colors.yellow}⏳ 等待几分钟后，您的游戏将在 https://[username].github.io/[repo-name]/ 上线${colors.reset}`);
}

// 显示部署成功信息
function showSuccess(repoUrl, pagesUrl) {
    console.log(`\n${colors.green}🎉 部署完成！${colors.reset}`);
    console.log(`${colors.blue}====================================${colors.reset}`);
    console.log(`${colors.yellow}📁 代码仓库:${colors.reset} ${repoUrl}`);
    console.log(`${colors.yellow}🌐 游戏地址:${colors.reset} ${pagesUrl}`);
    console.log(`${colors.yellow}⏰ 生效时间:${colors.reset} 几分钟后${colors.reset}`);
    console.log(`${colors.blue}====================================${colors.reset}\n`);
    console.log(`${colors.green}🎮 祝您游戏愉快！${colors.reset}\n`);
}

// 主部署函数
async function deploy() {
    showWelcome();
    
    // 检查Git
    if (!checkGit()) {
        rl.close();
        return;
    }
    
    // 检查GitHub配置
    if (!checkGitHubConfig()) {
        const setupSuccess = await setupGitHubConfig();
        if (!setupSuccess) {
            rl.close();
            return;
        }
    }
    
    // 获取仓库名称
    const defaultRepoName = 'talktrash-game';
    rl.question(`\n${colors.yellow}📝 请输入GitHub仓库名称 [${defaultRepoName}]: ${colors.reset}`, (repoName) => {
        const finalRepoName = repoName.trim() || defaultRepoName;
        const username = execSync('git config --global user.name').toString().trim();
        const repoUrl = `https://github.com/${username}/${finalRepoName}.git`;
        const pagesUrl = `https://${username}.github.io/${finalRepoName}/`;
        
        // 部署流程
        (async () => {
            // 创建GitHub仓库
            await createGitHubRepo(finalRepoName);
            
            // 初始化Git仓库
            if (!initGitRepo()) {
                rl.close();
                return;
            }
            
            // 添加远程仓库
            if (!addRemoteRepo(repoUrl)) {
                rl.close();
                return;
            }
            
            // 推送到GitHub
            if (!pushToGitHub()) {
                rl.close();
                return;
            }
            
            // 启用GitHub Pages
            enableGitHubPages();
            
            // 显示成功信息
            showSuccess(repoUrl, pagesUrl);
            
            rl.close();
        })();
    });
}

// 启动部署
deploy();

// 处理用户中断
process.on('SIGINT', () => {
    console.log(`\n${colors.red}❌ 部署已取消${colors.reset}`);
    rl.close();
    process.exit(0);
});