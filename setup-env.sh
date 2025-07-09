#!/bin/bash

echo "🔐 环境变量配置脚本"
echo "===================="

# 检查 .env 文件是否已存在
if [ -f ".env" ]; then
    echo "⚠️ .env 文件已存在"
    read -p "是否要重新创建？(y/N): " choice
    if [[ $choice != [Yy] ]]; then
        echo "取消操作"
        exit 0
    fi
fi

# 复制模板文件
echo "📋 创建 .env 文件..."
cp env-template.txt .env

echo "✅ .env 文件已创建"
echo ""
echo "📝 下一步操作："
echo "1. 打开 .env 文件"
echo "2. 将 'PRIVATE_KEY=请在此处输入您的64位私钥（不要0x前缀）'"
echo "3. 改为 'PRIVATE_KEY=您的实际私钥'"
echo ""
echo "⚠️ 重要提醒："
echo "- 私钥不要包含 0x 前缀"
echo "- 私钥应该是64位16进制字符"
echo "- 不要分享或截图 .env 文件"
echo ""
echo "🎯 配置完成后运行："
echo "npm run compile  # 验证配置"
echo "npm run deploy   # 部署合约"
echo ""
echo "💡 如需帮助，请查看 '私钥配置说明.md' 文件" 