#!/bin/bash

echo "🔍 检查 GitHub Pages DNS 状态..."

# 检查 CNAME 文件
echo "📄 检查 CNAME 文件:"
if [ -f "CNAME" ]; then
    echo "✅ CNAME 文件存在: $(cat CNAME)"
else
    echo "❌ CNAME 文件不存在，正在创建..."
    echo "maopi.me" > CNAME
    git add CNAME
    git commit -m "📄 添加 CNAME 文件"
    git push origin game-main
fi

# 检查 DNS 解析
echo ""
echo "🌐 检查 DNS 解析:"
nslookup maopi.me | grep -E "(canonical name|Address)"

# 检查网站访问
echo ""
echo "🌍 检查网站访问:"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://maopi.me)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ 网站可以正常访问 (HTTP $HTTP_CODE)"
else
    echo "❌ 网站访问异常 (HTTP $HTTP_CODE)"
fi

# 检查 GitHub Pages 设置
echo ""
echo "⚙️  GitHub Pages 设置建议:"
echo "1. 确保在 GitHub 仓库设置中启用了 GitHub Pages"
echo "2. 确保选择了 'game-main' 分支作为发布源"
echo "3. 确保自定义域名设置为 'maopi.me'"
echo "4. 确保启用了 'Enforce HTTPS'"

# 解决 DNS Check in Progress 问题
echo ""
echo "🔧 解决 'DNS Check in Progress' 问题:"
echo "1. 删除自定义域名设置"
echo "2. 等待几分钟"
echo "3. 重新添加自定义域名"

# 创建临时解决方案
echo ""
echo "🚀 临时解决方案:"
echo "如果 DNS 检查仍在进行中，您可以："
echo "- 直接访问: https://maowillpi.github.io"
echo "- 或等待 DNS 传播完成 (通常需要 24-48 小时)"

echo ""
echo "✅ 检查完成！" 