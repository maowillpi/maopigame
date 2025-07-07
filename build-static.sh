#!/bin/bash

echo "🔧 开始构建静态游戏文件..."

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 构建静态文件
echo "🏗️ 构建Next.js静态文件..."
npx next build

# 检查是否构建成功
if [ ! -d "out" ]; then
    echo "❌ 构建失败，没有生成out目录"
    exit 1
fi

echo "✅ 构建成功！静态文件在out目录中"

# 将out目录内容复制到根目录
echo "📁 复制静态文件到根目录..."
cp -r out/* .

# 确保有index.html文件
if [ -f "index.html" ]; then
    echo "✅ index.html文件存在"
else
    echo "❌ 缺少index.html文件"
    exit 1
fi

# 提交到GitHub
echo "📤 推送静态文件到GitHub..."
git add .
git status
git commit -m "🎮 构建静态游戏文件 - GitHub Pages部署"
git push origin clean-main

echo "🎉 完成！游戏应该在几分钟内在GitHub Pages上线："
echo "🌐 https://maowillpi.github.io/maopigame/" 