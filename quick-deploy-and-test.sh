#!/bin/bash

# 🚀 MAO转盘游戏 - 快速部署和验证脚本
# 创建时间: 2024-07-11
# 版本: v3.0.1 专业版

echo "🎰 MAO转盘游戏 - 快速部署和验证脚本"
echo "=================================================="

# 检查当前目录
echo "📁 当前目录: $(pwd)"
echo "📋 检查关键文件..."

# 检查关键文件是否存在
files=("index.html" "game.html" "CNAME" "README.md")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        size=$(ls -lh "$file" | awk '{print $5}')
        echo "✅ $file ($size)"
    else
        echo "❌ $file - 文件缺失"
    fi
done

echo ""
echo "🔍 验证配置..."

# 检查合约地址配置
echo "🔗 智能合约地址验证:"
if grep -q "0xc27e29BCe41db77815435a9415329424849Daeb6" index.html; then
    echo "✅ WHEEL_GAME 合约地址正确"
else
    echo "❌ WHEEL_GAME 合约地址错误"
fi

if grep -q "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022" index.html; then
    echo "✅ MAO_TOKEN 合约地址正确"
else
    echo "❌ MAO_TOKEN 合约地址错误"
fi

if grep -q "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444" index.html; then
    echo "✅ PI_TOKEN 合约地址正确"
else
    echo "❌ PI_TOKEN 合约地址错误"
fi

# 检查域名配置
echo ""
echo "🌐 域名配置验证:"
if [ -f "CNAME" ] && grep -q "maopi.me" CNAME; then
    echo "✅ 域名配置正确: maopi.me"
else
    echo "❌ 域名配置错误"
fi

# 检查奖励机制
echo ""
echo "💰 奖励机制验证:"
if grep -q "mao: 105" index.html && grep -q "probability: '22%'" index.html; then
    echo "✅ 新奖励机制已配置 (42%中奖率)"
else
    echo "❌ 奖励机制配置错误"
fi

# 检查转盘界面升级
echo ""
echo "🎨 转盘界面验证:"
if grep -q "super-wheel" index.html && grep -q "粒子效果" index.html; then
    echo "✅ 超级转盘界面已升级"
else
    echo "❌ 转盘界面升级不完整"
fi

# Git状态检查
echo ""
echo "📦 Git状态检查:"
if git status --porcelain | grep -q .; then
    echo "⚠️  有未提交的更改"
    git status --short
else
    echo "✅ 工作目录干净"
fi

# 提交和推送更新
echo ""
read -p "🚀 是否提交并推送到GitHub? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 提交更新..."
    git add .
    git commit -m "🎰 v3.0.1专业版 - 超级转盘界面和优化奖励机制"
    git push origin main
    echo "✅ 推送完成"
    
    echo ""
    echo "⏳ 等待GitHub Pages部署... (约1-2分钟)"
    echo "🌐 部署完成后访问: https://maopi.me"
    echo "🧪 验证页面: https://maopi.me/test-verification.html"
else
    echo "❌ 取消推送"
fi

echo ""
echo "🎯 测试清单:"
echo "1. 🌐 访问 https://maopi.me"
echo "2. 📱 在TP钱包中测试移动端"
echo "3. 🔗 测试钱包连接功能"
echo "4. 💰 验证余额显示"
echo "5. 🎮 进行实际游戏测试"
echo "6. ✨ 观察转盘动画和粒子特效"

echo ""
echo "📊 系统配置总结:"
echo "• 投注: MAO 100 / PI 1000"
echo "• 中奖率: 42% (比之前提高10%)"
echo "• 小奖有盈利: 105 MAO / 1050 PI"
echo "• 最高奖励: 700 MAO / 7000 PI (7倍)"
echo "• 奖金池盈利率: 6.3%"
echo "• 转盘界面: 超级专业版"

echo ""
echo "🎉 MAO转盘游戏系统验证完成!"
echo "==================================================" 