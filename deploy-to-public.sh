#!/bin/bash

echo "🚀 MAO转盘游戏 - 一键公网部署脚本"
echo "=================================="

# 检查Git是否安装
if ! command -v git &> /dev/null; then
    echo "❌ Git未安装，请先安装Git"
    exit 1
fi

# 检查是否已经是Git仓库
if [ ! -d ".git" ]; then
    echo "📦 初始化Git仓库..."
    git init
    git add .
    git commit -m "Initial commit: MAO转盘游戏"
    echo "✅ Git仓库初始化完成"
else
    echo "📦 更新Git仓库..."
    git add .
    git commit -m "Update: 配置公网部署"
    echo "✅ Git仓库更新完成"
fi

echo ""
echo "🎯 部署选项："
echo "1. GitHub Pages (免费)"
echo "2. 手动配置Vercel"
echo "3. 手动配置Netlify"
echo ""

read -p "请选择部署方式 (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📋 GitHub Pages 部署步骤："
        echo "1. 访问 https://github.com 并登录"
        echo "2. 创建新仓库 (推荐名称: maogame-public)"
        echo "3. 设置仓库为 Public"
        echo "4. 复制仓库地址"
        echo ""
        read -p "请输入GitHub仓库地址 (例: https://github.com/username/maogame-public.git): " repo_url
        
        if [ -n "$repo_url" ]; then
            echo "🔗 连接到远程仓库..."
            git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"
            git branch -M main
            git push -u origin main
            
            echo ""
            echo "✅ 代码已推送到GitHub！"
            echo ""
            echo "📋 最后步骤："
            echo "1. 进入GitHub仓库设置 (Settings)"
            echo "2. 找到 'Pages' 选项"
            echo "3. Source 选择: 'Deploy from a branch'"
            echo "4. Branch 选择: 'gh-pages'"
            echo "5. 点击保存"
            echo ""
            echo "🌍 预计几分钟后您的游戏将在以下地址可用："
            echo "https://$(echo $repo_url | sed 's|https://github.com/||' | sed 's|\.git||' | sed 's|/|.github.io/|').github.io/"
        fi
        ;;
    2)
        echo ""
        echo "📋 Vercel 部署步骤："
        echo "1. 访问 https://vercel.com"
        echo "2. 使用GitHub账户登录"
        echo "3. 点击 'New Project'"
        echo "4. 导入您的GitHub仓库"
        echo "5. Framework Preset: Next.js"
        echo "6. 点击 Deploy"
        echo ""
        echo "🌍 部署完成后您将获得类似地址："
        echo "https://your-project.vercel.app"
        ;;
    3)
        echo ""
        echo "📋 Netlify 部署步骤："
        echo "1. 访问 https://netlify.com"
        echo "2. 使用GitHub账户登录"
        echo "3. 点击 'New site from Git'"
        echo "4. 选择您的GitHub仓库"
        echo "5. Build command: npm run export"
        echo "6. Publish directory: out"
        echo "7. 点击 Deploy"
        echo ""
        echo "🌍 部署完成后您将获得类似地址："
        echo "https://random-name.netlify.app"
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "🎉 恭喜！您的转盘游戏即将在全世界可用！"
echo ""
echo "🎮 特性："
echo "✅ 全球任何地方都能访问"
echo "✅ 手机钱包直接扫码游戏"
echo "✅ 只要有MAO/PI代币就能玩"
echo "✅ 完全去中心化，无需下载应用"
echo ""
echo "🔗 分享您的游戏："
echo "- 直接分享网址链接"
echo "- 生成二维码让人扫描"
echo "- 在社交媒体推广"
echo ""
echo "🛡️ 安全提醒："
echo "- 游戏是纯前端，直接连接区块链"
echo "- 您的私钥从不上传到任何服务器"
echo "- 所有交易都在区块链上透明可查" 