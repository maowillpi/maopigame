#!/bin/bash

echo "=== 猫币转盘游戏 - GitHub 推送修复 ==="
echo ""

# 配置Git用户
git config --global user.name "maowillpi"
git config --global user.email "20021815@qq.com"

echo "✅ Git用户已配置："
echo "   用户名: maowillpi"
echo "   邮箱: 20021815@qq.com"
echo ""

echo "🚀 开始推送到GitHub..."
git push origin main

echo ""
echo "🔗 如果推送成功，请访问以下步骤启用GitHub Pages："
echo "1. 打开: https://github.com/maowillpi/maopigame/settings/pages"
echo "2. 在Source下选择: Deploy from a branch"
echo "3. 选择Branch: main"
echo "4. 点击Save"
echo ""
echo "🎮 您的游戏将在: https://maowillpi.github.io/maopigame/" 