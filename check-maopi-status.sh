#!/bin/bash

echo "🔍 检查 maopi.me 更新状态"
echo "========================="
echo ""

echo "📅 检查时间: $(date)"
echo ""

echo "🏠 主页 PI 配置:"
MAIN_PI=$(curl -s "http://maopi.me" | grep "PI/次" | sed 's/<[^>]*>//g' | xargs)
echo "   $MAIN_PI"

echo ""
echo "🎮 游戏页 PI 配置:"
GAME_PI=$(curl -s "http://maopi.me/game.html" | grep "PI/次" | sed 's/<[^>]*>//g' | xargs)
echo "   $GAME_PI"

echo ""
echo "🔍 概率显示检查:"
PROB_CHECK=$(curl -s "http://maopi.me" | grep "85%" | wc -l)
if [ "$PROB_CHECK" -eq 0 ]; then
    echo "   ✅ 无概率显示（正确）"
else
    echo "   ❌ 仍显示概率百分比"
fi

echo ""
echo "📊 更新状态总结:"
if [[ "$MAIN_PI" == *"1,000 PI/次"* ]]; then
    echo "   ✅ 主页已更新"
else
    echo "   🔄 主页待更新"
fi

if [[ "$GAME_PI" == *"1,000 PI/次"* ]]; then
    echo "   ✅ 游戏页已更新"
else
    echo "   🔄 游戏页待更新"
fi

echo ""
echo "💡 如果显示'待更新'，请等待5-10分钟后重新运行此脚本"
echo "   GitHub Pages 部署需要一些时间完成" 