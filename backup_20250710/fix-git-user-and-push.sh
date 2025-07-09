#!/bin/bash

echo "🔄 正在切换Git用户到 maowillpi..."

# 配置Git用户信息
git config --global user.name "maowillpi"
git config --global user.email "20021815@qq.com"

echo "✅ Git用户配置完成："
echo "用户名: $(git config --global user.name)"
echo "邮箱: $(git config --global user.email)"

echo ""
echo "🔍 检查当前仓库状态..."
git status

echo ""
echo "📡 检查远程仓库配置..."
git remote -v

echo ""
echo "🚀 开始推送到GitHub..."
echo "目标仓库: https://github.com/maowillpi/maopigame.git"

# 推送到GitHub
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 推送成功！"
    echo "🌐 您的游戏将在几分钟后可以通过以下地址访问："
    echo "https://maowillpi.github.io/maopigame/"
    echo ""
    echo "📋 接下来的步骤："
    echo "1. 登录 GitHub.com"
    echo "2. 进入仓库: https://github.com/maowillpi/maopigame"
    echo "3. 点击 Settings -> Pages"
    echo "4. 设置 Source 为 'Deploy from a branch'"
    echo "5. 选择 Branch: main"
    echo "6. 保存设置"
else
    echo ""
    echo "❌ 推送失败！可能需要身份验证。"
    echo "🔐 如果提示输入密码，现在GitHub需要使用Personal Access Token:"
    echo "1. 访问: https://github.com/settings/tokens"
    echo "2. 点击 'Generate new token (classic)'"
    echo "3. 选择权限: repo (完整仓库权限)"
    echo "4. 复制生成的token"
    echo "5. 当提示输入密码时，粘贴token而不是密码"
    echo ""
    echo "🔄 或者，您可以使用以下命令再次尝试："
    echo "git push https://maowillpi:YOUR_TOKEN@github.com/maowillpi/maopigame.git main"
fi 