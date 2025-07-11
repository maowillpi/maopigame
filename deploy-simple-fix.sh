#!/bin/bash

echo "🚀 部署修复后的MAO转盘游戏到GitHub..."

# 1. 备份当前index.html
echo "📦 备份当前版本..."
if [ -f "index.html" ]; then
    cp index.html "index_backup_$(date +%s).html"
    echo "✅ 已备份为 index_backup_$(date +%s).html"
fi

# 2. 使用修复后的simple-game.html作为新的index.html
echo "🔄 更新主游戏文件..."
cp simple-game.html index.html
echo "✅ 已将修复版本设为主文件"

# 3. 添加到Git
echo "📝 添加文件到Git..."
git add .
git status

# 4. 提交更改
echo "💾 提交更改..."
COMMIT_MSG="🔧 修复游戏连接和授权问题

- 修复连接钱包时卡在'连接中'的问题
- 改进错误处理和用户提示
- 优化授权状态管理和同步
- 简化界面，专注转盘游戏核心功能
- 添加自动连接已授权钱包功能
- 改善游戏流程和用户体验

测试地址: http://127.0.0.1:8007/simple-game.html"

git commit -m "$COMMIT_MSG"

# 5. 推送到GitHub
echo "🌐 推送到GitHub..."
git push origin main

# 6. 显示部署信息
echo ""
echo "🎉 部署完成！"
echo ""
echo "📍 访问地址:"
echo "  🌐 GitHub Pages: https://maosib.github.io/MAOGAME/"
echo "  🔗 自定义域名: https://maopi.me/"
echo ""
echo "🧪 本地测试:"
echo "  📱 简化版本: http://127.0.0.1:8007/simple-game.html"
echo ""
echo "✨ 修复内容:"
echo "  ✅ 解决连接钱包卡住问题"
echo "  ✅ 改进授权状态管理"
echo "  ✅ 简化界面，专注游戏"
echo "  ✅ 增强错误处理"
echo "  ✅ 自动连接功能"
echo "" 