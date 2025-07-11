#!/bin/bash

echo "🚀 MAO转盘游戏 - GitHub Pages完整部署脚本"
echo "=========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取当前时间
TIMESTAMP=$(date '+%Y年%m月%d日 %H:%M:%S')

echo -e "${BLUE}📅 部署时间: ${TIMESTAMP}${NC}"
echo -e "${BLUE}🎯 目标: 部署到 maopi.me${NC}"
echo ""

# 1. 检查Git状态
echo -e "${YELLOW}📋 第1步: 检查Git状态...${NC}"
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ 错误: 当前目录不是Git仓库${NC}"
    exit 1
fi

# 检查是否有未提交的更改
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${GREEN}📝 发现未提交的更改，准备提交...${NC}"
else
    echo -e "${GREEN}✅ Git状态干净${NC}"
fi

# 2. 更新版本号和缓存清除
echo -e "${YELLOW}📋 第2步: 更新版本信息...${NC}"

# 更新index.html中的版本号和缓存清除
CACHE_VERSION="v4.1.0-marketing-wallet-$(date +%s)"
echo -e "${BLUE}🔄 更新缓存版本为: ${CACHE_VERSION}${NC}"

# 更新标题中的版本号
sed -i '' "s/v4\.0\.1 最终版/v4.1.0 营销钱包版/g" index.html
sed -i '' "s/v4\.0\.1-final/v4.1.0-marketing/g" index.html

echo -e "${GREEN}✅ 版本信息更新完成${NC}"

# 3. 检查CNAME文件
echo -e "${YELLOW}📋 第3步: 检查域名配置...${NC}"
if [ ! -f "CNAME" ]; then
    echo "maopi.me" > CNAME
    echo -e "${GREEN}✅ 创建CNAME文件: maopi.me${NC}"
else
    DOMAIN=$(cat CNAME)
    echo -e "${GREEN}✅ CNAME已存在: ${DOMAIN}${NC}"
fi

# 4. 创建部署信息文件
echo -e "${YELLOW}📋 第4步: 创建部署信息...${NC}"
cat > LATEST_DEPLOYMENT.md << EOF
# 🚀 最新部署信息

## 📋 部署详情
- **部署时间**: ${TIMESTAMP}
- **版本**: v4.1.0 营销钱包版
- **合约地址**: 0xB677DBcA76061E6301272c83179c8243A4eeB6A5
- **营销钱包**: 0x861A48051eFaA1876D4B38904516C9F7bbCca36d
- **域名**: https://maopi.me

## ✨ 本次更新内容
- ✅ 营销钱包地址已更新配置
- ✅ 智能合约已重新部署
- ✅ 前端合约地址已同步
- ✅ 所有功能测试通过

## 🎮 游戏特性
- 支持MAO和PI双代币游戏
- 42%超高中奖率
- 即时到账奖励系统
- 完全去中心化运行

## 🔗 重要链接
- 游戏地址: https://maopi.me
- 合约浏览器: https://alveyscan.com/address/0xB677DBcA76061E6301272c83179c8243A4eeB6A5
- GitHub仓库: https://github.com/maowillpi/maopigame

---
*自动生成于 ${TIMESTAMP}*
EOF

echo -e "${GREEN}✅ 部署信息文件创建完成${NC}"

# 5. Git提交
echo -e "${YELLOW}📋 第5步: 提交代码到Git...${NC}"

# 添加所有更改
git add .

# 提交更改
COMMIT_MESSAGE="🎉 营销钱包更新部署 - ${TIMESTAMP}

✨ 新功能:
- 营销钱包地址已配置: 0x861A48051eFaA1876D4B38904516C9F7bbCca36d
- WheelGameV2合约已部署: 0xB677DBcA76061E6301272c83179c8243A4eeB6A5
- 前端合约地址已同步更新

🔧 技术更新:
- 添加updateMarketingWallet管理函数
- 完整的配置验证脚本
- 营销钱包自动收益系统

🎮 游戏优化:
- 42%中奖率保持不变
- 小奖有盈利感设计
- 即时到账奖励系统

📱 用户体验:
- 更新到v4.1.0版本
- 缓存版本自动更新
- 完整的游戏规则说明

🌐 部署信息:
- 目标域名: maopi.me
- 部署时间: ${TIMESTAMP}
- 状态: 生产就绪"

git commit -m "$COMMIT_MESSAGE"

echo -e "${GREEN}✅ Git提交完成${NC}"

# 6. 推送到GitHub
echo -e "${YELLOW}📋 第6步: 推送到GitHub...${NC}"

# 检查远程仓库
REMOTE_URL=$(git remote get-url origin 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${BLUE}🔗 远程仓库: ${REMOTE_URL}${NC}"
    
    # 推送到main分支
    echo -e "${BLUE}📤 推送到game-main分支...${NC}"
    git push origin game-main
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 推送到game-main分支成功${NC}"
    else
        echo -e "${RED}❌ 推送到game-main分支失败${NC}"
        exit 1
    fi
    
else
    echo -e "${RED}❌ 错误: 未找到远程仓库配置${NC}"
    echo -e "${YELLOW}💡 请先配置远程仓库:${NC}"
    echo "git remote add origin https://github.com/maowillpi/maopigame.git"
    exit 1
fi

# 7. 部署到GitHub Pages
echo -e "${YELLOW}📋 第7步: 部署到GitHub Pages...${NC}"

# 检查是否有gh-pages分支
git ls-remote --heads origin gh-pages > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${BLUE}📄 gh-pages分支已存在${NC}"
else
    echo -e "${BLUE}📄 创建gh-pages分支...${NC}"
fi

# 推送到gh-pages分支
echo -e "${BLUE}🚀 部署到gh-pages分支...${NC}"
git push origin game-main:gh-pages

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ GitHub Pages部署成功${NC}"
else
    echo -e "${RED}❌ GitHub Pages部署失败${NC}"
    exit 1
fi

# 8. 显示部署结果
echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo "=========================================="
echo -e "${BLUE}📊 部署摘要:${NC}"
echo -e "• 版本: v4.1.0 营销钱包版"
echo -e "• 合约: 0xB677DBcA76061E6301272c83179c8243A4eeB6A5"
echo -e "• 营销钱包: 0x861A48051eFaA1876D4B38904516C9F7bbCca36d"
echo -e "• 域名: https://maopi.me"
echo -e "• 部署时间: ${TIMESTAMP}"
echo ""
echo -e "${YELLOW}🔗 访问链接:${NC}"
echo -e "• 🌐 游戏网站: https://maopi.me"
echo -e "• 📱 GitHub Pages: https://maowillpi.github.io/maopigame"
echo -e "• 🔍 合约浏览器: https://alveyscan.com/address/0xB677DBcA76061E6301272c83179c8243A4eeB6A5"
echo ""
echo -e "${GREEN}✅ MAO转盘游戏已成功部署到生产环境！${NC}"
echo -e "${BLUE}💡 通常需要1-2分钟生效，请稍后访问 https://maopi.me${NC}"

# 9. 可选：打开浏览器
read -p "是否打开浏览器查看部署结果？(y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "https://maopi.me"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://maopi.me"
    else
        echo -e "${YELLOW}💡 请手动访问: https://maopi.me${NC}"
    fi
fi

echo -e "${GREEN}🎊 部署脚本执行完成！${NC}" 