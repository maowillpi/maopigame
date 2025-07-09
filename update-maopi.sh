#!/bin/bash

# MAO转盘游戏 v3.2.1 一键更新脚本
# 用于更新 maopi.me 到最新修复版本

echo "🎰 MAO转盘游戏 v3.2.1 修复版更新脚本"
echo "==============================================="

# 检查当前版本
echo "📋 检查当前配置..."

# 验证关键文件是否存在
if [ ! -f "index.html" ] || [ ! -f "game.html" ]; then
    echo "❌ 错误：关键文件不存在！"
    exit 1
fi

# 验证配置是否正确
echo "🔍 验证配置..."

# 检查是否还有错误配置（排除测试文件）
if grep -q "85%" index.html game.html || grep -q "10,000 PI/次" index.html game.html; then
    echo "❌ 发现错误配置，请先运行修复！"
    exit 1
fi

# 检查正确配置（排除测试文件）
if ! grep -q "1,000 PI/次" index.html game.html; then
    echo "❌ 未找到正确的PI配置！"
    exit 1
fi

echo "✅ 配置验证通过！"

# 重新构建项目
echo "🔨 重新构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败！"
    exit 1
fi

echo "✅ 构建成功！"

# 创建部署包
echo "📦 创建部署包..."

# 创建临时目录
mkdir -p temp_deploy

# 复制关键文件
cp index.html temp_deploy/
cp game.html temp_deploy/
cp -r out/* temp_deploy/ 2>/dev/null || echo "注意：out目录为空或不存在"

# 复制其他静态资源
cp -r components temp_deploy/ 2>/dev/null || echo "跳过components目录"
cp -r pages temp_deploy/ 2>/dev/null || echo "跳过pages目录"

# 创建版本信息文件
echo "v3.2.1-professional-fixed" > temp_deploy/VERSION
echo "$(date)" > temp_deploy/LAST_UPDATE

echo "📋 部署包内容："
ls -la temp_deploy/

echo ""
echo "🚀 部署指南"
echo "==============================================="
echo "1. 上传 temp_deploy/ 目录中的所有文件到 maopi.me 服务器"
echo "2. 确保 index.html 和 game.html 替换了原文件"
echo "3. 清除服务器CDN缓存"
echo "4. 重启Web服务器（如需要）"
echo ""
echo "📱 用户端清除缓存指南："
echo "- 手机：强制刷新页面或清除浏览器缓存"
echo "- 电脑：Ctrl+F5 或 Cmd+R 强制刷新"
echo ""
echo "🔍 验证更新："
echo "- PI投注应显示：1,000 PI/次（不是10,000）"
echo "- 界面不应显示任何百分比概率"
echo "- 谢谢惠顾概率应为60%（代码内部，不显示）"
echo ""
echo "✅ 更新包已准备完成！"
echo "📁 部署文件位置：./temp_deploy/"

# 显示关键配置摘要
echo ""
echo "📊 关键配置摘要："
echo "- MAO投注：100 MAO/次"
echo "- PI投注：1,000 PI/次"
echo "- 谢谢惠顾概率：60%"
echo "- 总中奖率：40%"
echo "- 版本：v3.2.1-professional-fixed" 