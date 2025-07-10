#!/bin/bash

echo "🚀 MAO转盘游戏 - maopi.me 专用部署脚本"
echo "=================================="

# 检查Git是否安装
if ! command -v git &> /dev/null; then
    echo "❌ Git未安装，请先安装Git"
    exit 1
fi

# 设置正确的远程仓库
REPO_URL="https://github.com/maowillpi/maopigame.git"

# 检查是否已经是Git仓库
if [ ! -d ".git" ]; then
    echo "📦 初始化Git仓库..."
    git init
    git add .
    git commit -m "Initial commit: MAO转盘游戏"
    git remote add origin $REPO_URL
    echo "✅ Git仓库初始化完成"
else
    echo "📦 更新Git仓库..."
    # 确保远程仓库配置正确
    git remote set-url origin $REPO_URL 2>/dev/null || git remote add origin $REPO_URL
    git add .
    git commit -m "Update: maopi.me 配置更新"
    echo "✅ Git仓库更新完成"
fi

echo ""
echo "🔄 正在同步到 maopi.me..."
git push -u origin main

echo ""
echo "🌍 部署信息："
echo "✅ 代码仓库：maowillpi/maopigame"
echo "✅ 部署域名：maopi.me"
echo "✅ 版本控制：$(cat VERSION)"
echo "✅ 更新时间：$(cat LAST_UPDATE)"

echo ""
echo "🎉 部署完成！"
echo "访问 https://maopi.me 查看最新版本"
echo ""
echo "🛡️ 安全提醒："
echo "- 游戏是纯前端，直接连接区块链"
echo "- 您的私钥从不上传到任何服务器"
echo "- 所有交易都在区块链上透明可查" 