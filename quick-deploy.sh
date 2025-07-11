#!/bin/bash

echo "🚀 快速部署 WheelGameV2"
echo "====================="

# 检查余额
echo "🔍 检查余额..."
BALANCE_OUTPUT=$(npx hardhat run check-balance.js --network alvey2 2>/dev/null)

if echo "$BALANCE_OUTPUT" | grep -q "余额充足"; then
    echo "✅ 余额充足，开始部署..."
    npx hardhat run scripts/deploy-wheelgame-v2.js --network alvey2
    
    if [ $? -eq 0 ]; then
        echo "🎉 部署成功！"
        echo "📋 记得更新前端合约地址"
    else
        echo "❌ 部署失败"
    fi
else
    echo "⚠️ 余额不足，无法部署"
    echo "$BALANCE_OUTPUT"
fi 