#!/bin/bash

# 🚀 MAO转盘游戏 - 专业版界面部署脚本 v5.0

echo "🎰 =========================================="
echo "🚀 MAO转盘游戏专业版界面部署开始"
echo "📅 时间: $(date)"
echo "🎰 =========================================="

# 设置颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查是否存在专业版文件
if [ ! -f "game-professional.html" ]; then
    echo -e "${RED}❌ 错误: game-professional.html 文件不存在${NC}"
    exit 1
fi

echo -e "${BLUE}📋 检查文件状态...${NC}"
echo "✅ game-professional.html 存在 ($(wc -c < game-professional.html) 字节)"

# 备份当前的 game.html
if [ -f "game.html" ]; then
    echo -e "${YELLOW}📦 备份当前 game.html...${NC}"
    cp game.html "game.html.backup.$(date +%Y%m%d_%H%M%S)"
    echo "✅ 备份完成"
fi

# 替换 game.html 为专业版
echo -e "${BLUE}🔄 部署专业版界面...${NC}"
cp game-professional.html game.html
echo "✅ game.html 已更新为专业版"

# 更新 index.html 链接到新版本
echo -e "${BLUE}🔗 更新首页链接...${NC}"
if [ -f "index.html" ]; then
    # 添加专业版游戏入口
    sed -i.bak 's|href="game.html"|href="game.html" title="专业版游戏界面 v5.0"|g' index.html
    echo "✅ 首页链接已更新"
fi

# 创建版本信息文件
echo -e "${BLUE}📝 创建版本信息...${NC}"
cat > CURRENT_VERSION.json << EOF
{
  "version": "v5.0-professional",
  "deployTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "features": [
    "钱包独立交易记录",
    "现代化玻璃拟态设计",
    "三栏专业布局",
    "实时活动日志",
    "智能通知系统",
    "响应式移动端优化"
  ],
  "fixes": [
    "修复交易记录钱包关联错误",
    "修复界面不够专业问题",
    "优化用户体验",
    "增强功能完整性"
  ],
  "files": {
    "main": "game.html",
    "source": "game-professional.html",
    "report": "PROFESSIONAL_UI_OPTIMIZATION_REPORT.md"
  }
}
EOF
echo "✅ 版本信息已创建"

# Git 提交
echo -e "${BLUE}📚 提交到 Git...${NC}"
git add .
git commit -m "🎨 部署专业版界面 v5.0

✨ 新功能:
- 钱包独立交易记录系统
- 现代化玻璃拟态设计
- 三栏专业布局
- 实时活动日志
- 智能通知系统
- 响应式移动端优化

🐛 修复:
- 交易记录钱包关联错误
- 界面专业度不足
- 用户体验问题

📊 技术亮点:
- Tailwind CSS v3
- Inter 现代字体
- localStorage v2 数据结构
- 模块化代码组织

🎯 用户价值:
- 隐私保护 (每个钱包独立记录)
- 操作简便 (直观用户界面)
- 信息透明 (完整游戏记录)
- 体验流畅 (专业级交互设计)"

if [ $? -eq 0 ]; then
    echo "✅ Git 提交成功"
else
    echo -e "${YELLOW}⚠️ Git 提交失败或无新变更${NC}"
fi

# 推送到远程仓库
echo -e "${BLUE}🌐 推送到远程仓库...${NC}"
git push origin HEAD

if [ $? -eq 0 ]; then
    echo "✅ 推送成功"
else
    echo -e "${YELLOW}⚠️ 推送失败，请检查网络连接${NC}"
fi

# 验证部署
echo -e "${BLUE}🔍 验证部署状态...${NC}"
if [ -f "game.html" ]; then
    GAME_SIZE=$(wc -c < game.html)
    echo "✅ game.html 大小: $GAME_SIZE 字节"
    
    # 检查关键特征
    if grep -q "专业版 v5.0" game.html; then
        echo "✅ 专业版标识存在"
    fi
    
    if grep -q "glass-effect" game.html; then
        echo "✅ 玻璃拟态效果存在"
    fi
    
    if grep -q "gameHistory\[currentAccount\]" game.html; then
        echo "✅ 钱包独立记录功能存在"
    fi
    
    if grep -q "grid lg:grid-cols-3" game.html; then
        echo "✅ 三栏布局存在"
    fi
else
    echo -e "${RED}❌ game.html 文件不存在${NC}"
    exit 1
fi

# 清理临时文件
echo -e "${BLUE}🧹 清理临时文件...${NC}"
if [ -f "index.html.bak" ]; then
    rm index.html.bak
    echo "✅ 清理完成"
fi

# 显示访问信息
echo ""
echo -e "${GREEN}🎉 =========================================="
echo "🚀 专业版界面部署完成！"
echo "🎰 =========================================="
echo ""
echo "📱 访问地址:"
echo "   主域名: http://maopi.me/game.html"
echo "   备用域名: https://maowillpi.github.io/maopigame/game.html"
echo ""
echo "🆕 新功能亮点:"
echo "   ✨ 钱包独立交易记录"
echo "   🎨 现代化玻璃拟态设计"
echo "   📱 响应式三栏布局"
echo "   🔔 智能通知系统"
echo "   📊 实时活动日志"
echo ""
echo "🎯 技术升级:"
echo "   🔧 localStorage v2 数据结构"
echo "   🎨 Tailwind CSS v3"
echo "   📝 Inter 现代字体"
echo "   📱 移动端优化"
echo ""
echo "💡 使用提示:"
echo "   1. 连接 MetaMask 钱包"
echo "   2. 切换到 AlveyChain 网络"
echo "   3. 选择代币类型 (MAO/PI)"
echo "   4. 开始享受专业游戏体验"
echo ""
echo -e "📋 详细报告: PROFESSIONAL_UI_OPTIMIZATION_REPORT.md"
echo -e "${GREEN}🎰 =========================================="
echo -e "✅ 部署成功完成！${NC}"
echo "" 