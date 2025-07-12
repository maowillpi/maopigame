#!/bin/bash

echo "🔧 修复游戏冻结问题..."

# 1. 检查自动奖励脚本状态
echo "📍 检查自动奖励脚本状态:"
if ps aux | grep -v grep | grep "node auto-reward.js" > /dev/null; then
    echo "✅ 自动奖励脚本正在运行"
else
    echo "❌ 自动奖励脚本未运行，正在重启..."
    nohup node auto-reward.js > auto-reward.log 2>&1 &
    echo "✅ 自动奖励脚本已重启"
fi

# 2. 检查 HTTP 服务器状态
echo ""
echo "🌐 检查 HTTP 服务器状态:"
if ps aux | grep -v grep | grep "python3.*http.server.*8000" > /dev/null; then
    echo "✅ HTTP 服务器正在运行"
else
    echo "❌ HTTP 服务器未运行，正在重启..."
    python3 -m http.server 8000 --bind 127.0.0.1 &
    echo "✅ HTTP 服务器已重启"
fi

# 3. 提交并推送修复
echo ""
echo "🚀 提交修复到 GitHub:"
git add index.html
git commit -m "🔧 修复游戏冻结问题 - 更新RPC配置使用可用的服务器"
git push origin game-main

echo ""
echo "✅ 修复完成！"
echo ""
echo "🎮 现在您可以："
echo "1. 访问 https://maopi.me 测试游戏"
echo "2. 或访问 http://127.0.0.1:8000 本地测试"
echo "3. 如果还有问题，请刷新页面重试"

# 4. 显示当前状态
echo ""
echo "📊 当前系统状态:"
echo "- 自动奖励脚本: $(ps aux | grep -v grep | grep 'node auto-reward.js' | wc -l) 个进程"
echo "- HTTP 服务器: $(ps aux | grep -v grep | grep 'python3.*http.server' | wc -l) 个进程"
echo "- 最新合约: 0xA9E4FD96B29e4f512a0a75E402C156B04D6E6c35"
echo "- 奖池钱包: 0xE15881Fc413c6cd47a512C24608F94Fa2896b374" 