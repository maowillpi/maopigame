#!/bin/bash

echo "🚀 开始优化清理项目..."
echo "============================================="

# 保留的核心文件列表
KEEP_FILES=(
    "wheel-game-ultimate.html"
    "package.json"
    "hardhat.config.js"
    ".env"
    ".gitignore"
    "README.md"
    "CNAME"
    ".nojekyll"
)

# 保留的核心目录
KEEP_DIRS=(
    ".git"
    "node_modules"
    "contracts"
    "scripts"
)

echo "📋 保留的核心文件:"
for file in "${KEEP_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (不存在)"
    fi
done

echo ""
echo "📁 保留的核心目录:"
for dir in "${KEEP_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "  ✅ $dir"
    else
        echo "  ❌ $dir (不存在)"
    fi
done

echo ""
echo "🗑️ 删除冗余文件..."

# 删除所有 HTML 文件，除了 wheel-game-ultimate.html
for file in *.html; do
    if [ "$file" != "wheel-game-ultimate.html" ]; then
        echo "  删除: $file"
        rm -f "$file"
    fi
done

# 删除所有 markdown 报告文件
for file in *.md; do
    if [ "$file" != "README.md" ]; then
        echo "  删除: $file"
        rm -f "$file"
    fi
done

# 删除所有 JavaScript 脚本文件（保留 package.json 和配置文件）
for file in *.js; do
    if [ "$file" != "hardhat.config.js" ] && [ "$file" != "next.config.js" ] && [ "$file" != "tailwind.config.js" ] && [ "$file" != "postcss.config.js" ]; then
        echo "  删除: $file"
        rm -f "$file"
    fi
done

# 删除所有 JSON 文件，除了 package.json
for file in *.json; do
    if [ "$file" != "package.json" ]; then
        echo "  删除: $file"
        rm -f "$file"
    fi
done

# 删除所有 log 文件
rm -f *.log

# 删除所有 shell 脚本，除了当前脚本
for file in *.sh; do
    if [ "$file" != "cleanup-project.sh" ]; then
        echo "  删除: $file"
        rm -f "$file"
    fi
done

# 删除所有备份文件
rm -f *.backup*
rm -f *.bak

# 删除临时目录
echo "  删除目录: deploy_backup_*"
rm -rf deploy_backup_*

echo "  删除目录: backup_*"
rm -rf backup_*

echo "  删除目录: _next"
rm -rf _next

echo "  删除目录: out"
rm -rf out

echo "  删除目录: pages"
rm -rf pages

echo "  删除目录: styles"
rm -rf styles

echo "  删除目录: components"
rm -rf components

echo "  删除目录: mobile"
rm -rf mobile

echo "  删除目录: 404"
rm -rf 404

echo "  删除目录: cache"
rm -rf cache

echo "  删除目录: artifacts"
rm -rf artifacts

echo ""
echo "🔧 优化项目结构..."

# 创建简化的 README
cat > README.md << 'EOF'
# 🎰 MAO Ultimate Wheel Game v6.0

## 极致优化版区块链转盘游戏

### ✨ 特性
- 🎯 50% 真实中奖率
- 🔒 智能合约保障
- 💎 现代化玻璃拟态设计
- 📱 完美移动端体验
- ⚡ 极致性能优化

### 🚀 快速开始
1. 连接 MetaMask 钱包
2. 选择代币 (MAO/PI)
3. 点击开始游戏
4. 享受游戏乐趣

### 🎮 游戏文件
- `wheel-game-ultimate.html` - 主游戏页面

### 🔗 合约地址
- 游戏合约: `0xB677DBcA76061E6301272c83179c8243A4eeB6A5`
- MAO 代币: `0x22f49bcb3dad370a9268ba3fca33cb037ca3d022`
- PI 代币: `0xfd4680e25e05b3435c7f698668d1ce80d2a9f444`

### 🌐 网络
- AlveyChain Mainnet (Chain ID: 3797)

---
**Created with ❤️ for the best gaming experience**
EOF

echo "✅ 项目清理完成！"
echo ""
echo "📊 项目现状:"
echo "  🎮 游戏文件: wheel-game-ultimate.html"
echo "  📝 说明文档: README.md"
echo "  ⚙️ 配置文件: hardhat.config.js, package.json"
echo "  🔐 环境变量: .env"
echo "  📁 核心目录: contracts/, scripts/"
echo ""
echo "�� 项目已优化为最简洁、最高效的状态！" 