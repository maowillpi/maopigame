#!/bin/bash

clear
echo "🎮 MAO转盘游戏 - 全自动发布脚本"
echo "=================================="
echo "目标仓库: https://github.com/maowillpi/maopigame.git"
echo ""

# 设置颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 确保在正确的目录
cd /Users/mac/Desktop/MAOGAME

echo -e "${BLUE}📂 当前目录: $(pwd)${NC}"
echo ""

# 第1步：清理和初始化
echo -e "${YELLOW}🔧 第1步: 初始化Git仓库...${NC}"
rm -rf .git 2>/dev/null
git init
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Git仓库初始化成功${NC}"
else
    echo -e "${RED}❌ Git仓库初始化失败${NC}"
    exit 1
fi
echo ""

# 第2步：添加文件
echo -e "${YELLOW}📁 第2步: 添加所有游戏文件...${NC}"
git add .
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 文件添加成功${NC}"
else
    echo -e "${RED}❌ 文件添加失败${NC}"
    exit 1
fi
echo ""

# 第3步：创建提交
echo -e "${YELLOW}💾 第3步: 创建提交...${NC}"
git commit -m "🎰 MAO转盘游戏 - 全球Web3游戏发布

🎮 特性:
- 支持MAO和PI双代币游戏
- 6级奖励系统，最高3000 MAO / 300000 PI
- 完全去中心化，直连AlveyChain
- 代币通缩机制，每次游戏10%销毁
- 双模式：网页游戏 + 手机钱包扫码
- 全球访问，任何地方都能玩

🏆 合约信息:
- 游戏合约: 0xc27e29BCe41db77815435a9415329424849Daeb6
- MAO代币: 0x22f49bcb3dad370a9268ba3fca33cb037ca3d022
- PI代币: 0xfd4680e25e05b3435c7f698668d1ce80d2a9f444
- 网络: AlveyChain (Chain ID: 3797)

🌍 访问地址: https://maowillpi.github.io/maopigame/"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 提交创建成功${NC}"
else
    echo -e "${RED}❌ 提交创建失败${NC}"
    exit 1
fi
echo ""

# 第4步：设置远程仓库
echo -e "${YELLOW}🔗 第4步: 连接到GitHub仓库...${NC}"
git remote remove origin 2>/dev/null
git remote add origin https://github.com/maowillpi/maopigame.git
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 远程仓库连接成功${NC}"
else
    echo -e "${RED}❌ 远程仓库连接失败${NC}"
    exit 1
fi
echo ""

# 第5步：设置分支
echo -e "${YELLOW}🌿 第5步: 设置主分支...${NC}"
git branch -M main
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 主分支设置成功${NC}"
else
    echo -e "${RED}❌ 主分支设置失败${NC}"
    exit 1
fi
echo ""

# 第6步：推送到GitHub
echo -e "${YELLOW}🚀 第6步: 推送到GitHub...${NC}"
echo -e "${BLUE}正在推送代码到 maowillpi/maopigame...${NC}"
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 恭喜！游戏代码推送成功！${NC}"
    echo ""
    echo -e "${BLUE}📋 下一步操作指南:${NC}"
    echo "1. 访问: https://github.com/maowillpi/maopigame"
    echo "2. 点击 'Settings' 选项卡"
    echo "3. 在左侧菜单找到 'Pages'"
    echo "4. Source 选择: 'Deploy from a branch'"
    echo "5. Branch 选择: 'gh-pages' (如果没有就选择 'main')"
    echo "6. 点击 'Save'"
    echo ""
    echo -e "${GREEN}🌍 几分钟后您的游戏将在以下地址全球可用:${NC}"
    echo -e "${YELLOW}https://maowillpi.github.io/maopigame/${NC}"
    echo ""
    echo -e "${BLUE}🎮 游戏特性:${NC}"
    echo "✅ 全球任何地方都能访问"
    echo "✅ 手机钱包直接扫码游戏"
    echo "✅ 只要有MAO/PI代币就能玩"
    echo "✅ 完全去中心化运行"
    echo "✅ 每次游戏代币自动通缩"
    echo ""
    echo -e "${GREEN}🎯 您的转盘游戏帝国已成功启动！${NC}"
else
    echo ""
    echo -e "${RED}❌ 推送失败！可能的原因:${NC}"
    echo "1. 网络连接问题"
    echo "2. GitHub身份验证问题"
    echo "3. 仓库权限问题"
    echo ""
    echo -e "${YELLOW}🔧 解决方案:${NC}"
    echo "1. 检查网络连接: ping github.com"
    echo "2. 确保您已登录GitHub账户: maowillpi"
    echo "3. 可能需要输入GitHub用户名和密码"
    echo ""
    echo -e "${BLUE}💡 提示: 如果提示输入密码，请使用Personal Access Token而不是密码${NC}"
fi

echo ""
echo -e "${BLUE}🛡️ 安全提醒:${NC}"
echo "- 您的私钥从不上传到GitHub"
echo "- 游戏是纯前端，直接连接区块链"
echo "- 所有交易都在AlveyChain上透明可查" 