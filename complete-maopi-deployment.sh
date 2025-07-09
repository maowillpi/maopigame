#!/bin/bash

# 🎰 MAO转盘游戏 v3.2.1 - maopi.me 完整部署脚本
# 自动化完成所有部署操作

clear
echo "🎰 MAO转盘游戏 v3.2.1 - maopi.me 完整部署脚本"
echo "=================================================="
echo ""

# 设置颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 当前时间
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo -e "${BLUE}📅 部署时间: $(date)${NC}"
echo -e "${BLUE}📦 部署版本: v3.2.1-professional-fixed${NC}"
echo ""

# 第1步：验证本地文件
echo -e "${YELLOW}🔍 第1步: 验证本地修复文件...${NC}"

if [ ! -f "maopi-deployment-v3.2.1-final.tar.gz" ]; then
    echo -e "${RED}❌ 错误：部署包不存在！${NC}"
    exit 1
fi

if [ ! -d "temp_deploy" ]; then
    echo -e "${RED}❌ 错误：temp_deploy目录不存在！${NC}"
    exit 1
fi

# 验证关键配置
echo "   检查PI投注配置..."
if grep -q "1,000 PI/次" temp_deploy/*.html; then
    echo -e "${GREEN}   ✅ PI投注配置正确：1,000 PI/次${NC}"
else
    echo -e "${RED}   ❌ PI投注配置错误！${NC}"
    exit 1
fi

# 检查是否有错误配置残留
if grep -q "10,000 PI" temp_deploy/*.html; then
    echo -e "${RED}   ❌ 发现错误配置残留：10,000 PI${NC}"
    exit 1
else
    echo -e "${GREEN}   ✅ 无错误配置残留${NC}"
fi

echo -e "${GREEN}✅ 本地文件验证通过！${NC}"
echo ""

# 第2步：创建备份目录
echo -e "${YELLOW}💾 第2步: 准备部署...${NC}"

# 创建本地备份和部署目录
mkdir -p "deploy_backup_$TIMESTAMP"
mkdir -p "maopi_deploy_ready"

# 解压部署包到准备目录
echo "   解压部署包..."
cd maopi_deploy_ready
tar -xzf ../maopi-deployment-v3.2.1-final.tar.gz
cd ..

if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✅ 部署包解压成功${NC}"
else
    echo -e "${RED}   ❌ 部署包解压失败${NC}"
    exit 1
fi

echo ""

# 第3步：显示部署内容
echo -e "${YELLOW}📋 第3步: 部署内容清单...${NC}"
echo "   部署包大小: $(ls -lh maopi-deployment-v3.2.1-final.tar.gz | awk '{print $5}')"
echo "   部署文件："
ls -la maopi_deploy_ready/ | head -15
if [ $(ls -la maopi_deploy_ready/ | wc -l) -gt 15 ]; then
    echo "   ... 以及更多文件"
fi
echo ""

# 第4步：最终验证
echo -e "${YELLOW}🔬 第4步: 最终验证...${NC}"

# 验证解压后的文件
if grep -q "1,000 PI/次" maopi_deploy_ready/*.html; then
    echo -e "${GREEN}   ✅ 解压文件PI配置正确${NC}"
else
    echo -e "${RED}   ❌ 解压文件PI配置错误${NC}"
    exit 1
fi

if grep -q "10,000 PI" maopi_deploy_ready/*.html; then
    echo -e "${RED}   ❌ 解压文件中发现错误配置${NC}"
    exit 1
else
    echo -e "${GREEN}   ✅ 解压文件无错误配置${NC}"
fi

echo ""

# 第5步：提供部署指导
echo -e "${BLUE}🚀 第5步: 部署到 maopi.me 服务器${NC}"
echo ""
echo -e "${YELLOW}方式一：SCP/SFTP 上传（推荐）${NC}"
echo "1. 使用以下命令上传文件："
echo -e "${BLUE}   scp -r maopi_deploy_ready/* user@maopi.me:/path/to/website/${NC}"
echo ""
echo "2. 或者使用FTP客户端（如FileZilla）："
echo "   - 连接到 maopi.me"
echo "   - 上传 maopi_deploy_ready/ 中的所有文件"
echo "   - 确保覆盖原有的 index.html 和 game.html"
echo ""

echo -e "${YELLOW}方式二：压缩包上传${NC}"
echo "1. 上传压缩包："
echo -e "${BLUE}   scp maopi-deployment-v3.2.1-final.tar.gz user@maopi.me:/tmp/${NC}"
echo ""
echo "2. 在服务器上解压："
echo -e "${BLUE}   ssh user@maopi.me${NC}"
echo -e "${BLUE}   cd /path/to/website/${NC}"
echo -e "${BLUE}   tar -xzf /tmp/maopi-deployment-v3.2.1-final.tar.gz${NC}"
echo ""

# 第6步：服务器操作指导
echo -e "${YELLOW}🔧 第6步: 服务器端操作${NC}"
echo ""
echo "上传完成后，在服务器上执行："
echo ""
echo "1. 设置文件权限："
echo -e "${BLUE}   chmod 644 *.html${NC}"
echo -e "${BLUE}   chmod 755 _next/ components/ mobile/ pages/${NC}"
echo -e "${BLUE}   chmod -R 644 _next/* components/* mobile/* pages/*${NC}"
echo ""
echo "2. 重启Web服务器："
echo -e "${BLUE}   sudo systemctl restart nginx${NC}"
echo "   或"
echo -e "${BLUE}   sudo systemctl restart apache2${NC}"
echo ""
echo "3. 清除服务器缓存："
echo -e "${BLUE}   sudo rm -rf /var/cache/nginx/*${NC}"
echo ""

# 第7步：验证测试
echo -e "${YELLOW}🔍 第7步: 部署验证${NC}"
echo ""
echo "部署完成后，请验证以下内容："
echo ""
echo "✅ 访问 http://maopi.me 检查："
echo "   - 显示 '1,000 PI/次'（不是 10,000）"
echo "   - 无 '85%' 等概率显示"
echo "   - MAO 显示 '100 MAO/次'"
echo ""
echo "✅ 访问 http://maopi.me/game.html 检查："
echo "   - 显示 '1,000 PI/次'"
echo "   - 转盘功能正常"
echo "   - 无概率百分比显示"
echo ""
echo "✅ 移动端测试："
echo "   - 手机访问响应正常"
echo "   - 代币选择功能正常"
echo ""

# 第8步：验证命令
echo -e "${YELLOW}🔧 第8步: 验证命令${NC}"
echo ""
echo "使用以下命令验证更新："
echo ""
echo "测试主页PI配置："
echo -e "${BLUE}curl -s \"http://maopi.me\" | grep \"PI/次\"${NC}"
echo ""
echo "测试游戏页PI配置："
echo -e "${BLUE}curl -s \"http://maopi.me/game.html\" | grep \"PI/次\"${NC}"
echo ""
echo "检查概率显示（应该无结果）："
echo -e "${BLUE}curl -s \"http://maopi.me\" | grep \"85%\"${NC}"
echo ""

# 第9步：清理临时文件
echo -e "${YELLOW}🧹 第9步: 清理临时文件...${NC}"
echo ""
echo "保留的文件："
echo "   - maopi-deployment-v3.2.1-final.tar.gz（部署包）"
echo "   - deploy_backup_$TIMESTAMP/（备份目录）"
echo "   - temp_deploy/（源文件目录）"
echo ""
echo "清理临时文件："
rm -rf maopi_deploy_ready
echo -e "${GREEN}   ✅ 临时文件清理完成${NC}"
echo ""

# 完成总结
echo -e "${GREEN}🎉 MAO转盘游戏 v3.2.1 部署准备完成！${NC}"
echo ""
echo -e "${BLUE}📋 部署总结：${NC}"
echo "   ✅ 本地文件验证通过"
echo "   ✅ 部署包准备就绪"
echo "   ✅ 配置完全正确（1,000 PI/次）"
echo "   ✅ 无错误配置残留"
echo "   ✅ 部署指导已提供"
echo ""
echo -e "${YELLOW}📞 下一步操作：${NC}"
echo "1. 按照上述指导上传文件到 maopi.me"
echo "2. 在服务器上设置权限和重启服务"
echo "3. 使用验证命令确认更新成功"
echo "4. 清除CDN缓存（如果使用）"
echo ""
echo -e "${GREEN}🚀 用户将看到完全正确的游戏界面！${NC}"
echo ""
echo "部署完成后，maopi.me 将显示："
echo "   ✅ PI投注：1,000 PI/次"
echo "   ✅ MAO投注：100 MAO/次"
echo "   ✅ 专业转盘界面（无概率显示）"
echo "   ✅ 版本：v3.2.1"
echo ""
echo -e "${BLUE}🎰 MAO转盘游戏帝国升级完成！${NC}" 