#!/bin/bash

echo "🔒 新钱包设置向导"
echo "=================="

# 检查是否存在.env文件
if [ -f ".env" ]; then
    echo "⚠️  发现现有的.env文件！"
    echo "为了安全，请手动检查并确认是否包含新的私钥"
else
    echo "📝 创建新的.env配置文件..."
    cp .env.template .env
    echo "✅ 已创建.env文件，请编辑并填入你的新私钥"
fi

echo ""
echo "🎯 后续步骤："
echo "1. 编辑 .env 文件，替换 'your_new_private_key_here' 为你的新私钥"
echo "2. 确保新私钥安全可靠，从未泄露"
echo "3. 如果旧钱包有资产，立即转移到新钱包"
echo "4. 使用新钱包重新部署合约: ./deploy-wheelgame-v2.sh"

echo ""
echo "⚠️  重要提醒："
echo "- 永远不要提交包含真实私钥的.env文件到Git"
echo "- 定期更换私钥"
echo "- 大额操作建议使用硬件钱包"

echo ""
echo "🔗 有用的链接："
echo "- 查看钱包安全指南: cat WALLET_SECURITY_GUIDE.md"
echo "- AlveyChain浏览器: https://alveyscan.com/"

echo ""
echo "✅ 新钱包设置向导完成！" 