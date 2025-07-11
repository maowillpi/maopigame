#!/bin/bash

echo "🚀 WheelGameV2 一键部署脚本"
echo "=========================="

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "❌ 错误：未找到 .env 文件"
    echo "📋 请先配置环境变量："
    echo "1. cp env-template.txt .env"
    echo "2. 编辑 .env 文件，填入你的私钥"
    exit 1
fi

# 检查私钥是否配置
if grep -q "请在此处输入您的64位私钥" .env; then
    echo "❌ 错误：请先在 .env 文件中配置你的私钥"
    echo "📝 编辑 .env 文件，将 PRIVATE_KEY 设置为你的钱包私钥（64位，不要0x前缀）"
    exit 1
fi

echo "✅ 环境配置检查通过"

# 安装依赖
echo "📦 检查并安装依赖..."
if [ ! -d "node_modules" ]; then
    npm install
fi

# 编译合约
echo "🔨 编译智能合约..."
npx hardhat compile

if [ $? -ne 0 ]; then
    echo "❌ 合约编译失败"
    exit 1
fi

echo "✅ 合约编译成功"

# 部署合约
echo "🚀 开始部署 WheelGameV2 到 AlveyChain..."
echo "⏳ 这可能需要几分钟时间..."

npx hardhat run scripts/deploy-wheelgame-v2.js --network alvey

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 部署完成！"
    echo ""
    echo "📋 接下来的步骤："
    echo "1. 📝 将输出的合约地址更新到 index.html"
    echo "2. 💰 向奖金池充值 MAO 和 PI 代币"
    echo "3. 🔓 让奖金池授权合约转账代币"
    echo "4. 🌐 测试前端游戏功能"
    echo ""
    echo "🔧 管理功能："
    echo "- 可随时调整投注金额、奖励、概率"
    echo "- 通过合约的管理函数进行配置"
    echo ""
    echo "📖 详细说明请查看: WheelGameV2-部署指南.md"
else
    echo "❌ 部署失败"
    echo "🔍 请检查："
    echo "- 钱包是否有足够的 ALV 支付 gas"
    echo "- 网络连接是否正常"
    echo "- 私钥是否正确"
    exit 1
fi 