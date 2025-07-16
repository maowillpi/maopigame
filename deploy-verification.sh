#!/bin/bash

echo "🚀 MAO游戏部署验证脚本"
echo "========================="

echo "📋 检查本地最新提交:"
git log --oneline -1

echo ""
echo "🌐 检查GitHub远程状态:"
git ls-remote origin game-main | cut -c1-7

echo ""
echo "🔗 检查网站连接状态:"
curl -s -o /dev/null -w "状态码: %{http_code}\n最后修改: %{header_last_modified}\n响应时间: %{time_total}s\n" https://maopi.me

echo ""
echo "📝 检查网站内容是否包含最新版本:"
if curl -s https://maopi.me | grep -q "v8.8"; then
    echo "✅ 网站已包含最新版本 v8.8"
else
    echo "⚠️ 网站可能还在缓存旧版本，请等待2-5分钟"
fi

echo ""
echo "🎯 检查关键修复是否生效:"
if curl -s https://maopi.me | grep -q "0x621DF9e0DE6b4e7EDC5Dc22Cd7c0F883c3F56966"; then
    echo "✅ 统一的游戏合约地址已部署"
else
    echo "❌ 游戏合约地址可能还未更新"
fi

echo ""
echo "📊 部署完成检查清单:"
echo "□ GitHub推送成功"
echo "□ 网站可访问"
echo "□ 最新版本已生效"
echo "□ 游戏合约地址已统一"

echo ""
echo "💡 如果网站还显示旧版本，请等待GitHub Pages缓存更新(通常2-10分钟)"
echo "🌐 网站地址: https://maopi.me" 