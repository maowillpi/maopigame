#!/bin/bash

echo "🔧 快速修复GitHub Pages显示问题..."

# 检查Git状态
echo "📋 当前Git状态："
git status

# 添加index.html文件
echo "📁 添加index.html文件..."
git add index.html

# 提交更改
echo "💾 提交更改..."
git commit -m "🎰 添加游戏启动页面 - 修复GitHub Pages显示"

# 推送到GitHub
echo "📤 推送到GitHub..."
git push origin clean-main

echo ""
echo "✅ 完成！现在访问以下地址应该能看到游戏加载页面："
echo "🌐 https://maowillpi.github.io/maopigame/"
echo ""
echo "⏳ GitHub Pages需要1-2分钟来更新，请稍等片刻再刷新页面"
echo ""
echo "🔄 接下来我们将构建完整的游戏文件..." 