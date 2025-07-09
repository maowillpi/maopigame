#!/bin/bash

echo "🚀 猫币转盘游戏 - 安全推送"
echo "=========================="
echo ""

echo "🗑️  删除可能导致问题的文件..."
rm -rf .github

echo "👤 配置Git用户..."
git config --global user.name "maowillpi"
git config --global user.email "20021815@qq.com"

echo "➕ 添加游戏文件..."
git add -A

echo "💾 提交更改..."
git commit -m "猫币转盘游戏 - 安全上传版本

🎮 AlveyChain区块链转盘游戏
- 智能合约已部署
- 支持MAO和PI代币
- 6种奖励等级
- 响应式前端设计"

echo ""
echo "🌐 开始推送到GitHub..."
echo "ℹ️  如果提示输入用户名和密码:"
echo "   用户名: maowillpi"
echo "   密码: 请粘贴您的GitHub token"
echo ""

git push origin main

echo ""
echo "🎉 推送完成！请检查GitHub仓库并设置Pages" 