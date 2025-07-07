#!/bin/bash

echo "🎰 AlveyChain 转盘游戏 - 设置脚本"
echo "================================"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "📦 安装依赖..."
npm install

echo "🔧 编译智能合约..."
npm run compile

echo "✅ 设置完成！"
echo ""
echo "📝 下一步操作："
echo "1. 编辑 hardhat.config.js 添加您的私钥"
echo "2. 运行 'npm run deploy' 部署合约"
echo "3. 更新 pages/index.js 中的合约地址"
echo "4. 运行 'npm run dev' 启动应用"
echo ""
echo "💡 重要提醒：原始奖励机制已调整以确保奖金池盈利！"
echo "详情请查看 README.md 文件" 