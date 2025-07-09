#!/bin/bash

echo "🚀 快速推送代码到GitHub"
echo "========================="

# 确保在正确的目录
cd /Users/mac/Desktop/MAOGAME

# 重新初始化Git仓库（如果需要）
git init

# 添加所有文件
git add .

# 创建提交
git commit -m "MAO转盘游戏 - 全球Web3游戏" || echo "没有新变更"

# 设置远程仓库
git remote remove origin 2>/dev/null || echo "清理远程仓库"
git remote add origin https://github.com/alveypro/maogame-public.git

# 设置分支
git branch -M main

# 推送到GitHub
echo "正在推送到GitHub..."
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo "✅ 推送成功！"
    echo "现在可以在Vercel中导入GitHub仓库了！"
else
    echo "❌ 推送失败，可能需要检查网络连接"
fi 