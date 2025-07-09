#!/bin/bash

echo "🚀 MAO转盘游戏 - 自动部署到GitHub Pages"
echo "========================================"
echo "仓库地址: git@github.com:alveypro/maogame-public.git"
echo ""

# 设置Git配置（如果需要）
echo "📋 检查Git配置..."
git config --global user.name "alveypro" 2>/dev/null || echo "Git用户名已设置"
git config --global user.email "your-email@example.com" 2>/dev/null || echo "Git邮箱已设置"

# 检查是否已经是Git仓库
if [ ! -d ".git" ]; then
    echo "📦 初始化Git仓库..."
    git init
    echo "✅ Git仓库初始化完成"
else
    echo "📦 Git仓库已存在"
fi

# 添加所有文件
echo "📁 添加所有文件到Git..."
git add .
echo "✅ 文件添加完成"

# 创建提交
echo "💾 创建提交..."
git commit -m "MAO转盘游戏 - 配置公网部署" || echo "没有新的变更需要提交"

# 检查远程仓库
echo "🔗 配置远程仓库..."
git remote remove origin 2>/dev/null || echo "清理旧的远程配置"
git remote add origin git@github.com:alveypro/maogame-public.git
echo "✅ 远程仓库配置完成"

# 设置主分支
echo "🌿 设置主分支为main..."
git branch -M main
echo "✅ 主分支设置完成"

# 推送到GitHub
echo "⬆️ 推送代码到GitHub..."
echo "如果提示输入密码或需要SSH密钥认证，请按提示操作..."
git push -u origin main

# 检查推送结果
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 代码推送成功！"
    echo ""
    echo "📋 下一步操作："
    echo "1. 访问: https://github.com/alveypro/maogame-public"
    echo "2. 点击 'Settings' 选项卡"
    echo "3. 在左侧菜单找到 'Pages'"
    echo "4. Source 选择: 'Deploy from a branch'"
    echo "5. Branch 选择: 'gh-pages'"
    echo "6. 点击 'Save'"
    echo ""
    echo "🌍 几分钟后您的游戏将在以下地址可用："
    echo "https://alveypro.github.io/maogame-public/"
    echo ""
    echo "🎮 特性："
    echo "✅ 全球任何地方都能访问"
    echo "✅ 手机钱包直接扫码游戏"
    echo "✅ 只要有MAO/PI代币就能玩"
    echo "✅ 完全去中心化运行"
else
    echo ""
    echo "❌ 推送失败！可能的原因："
    echo "1. SSH密钥未配置"
    echo "2. 网络连接问题"
    echo "3. GitHub仓库权限问题"
    echo ""
    echo "🔧 解决方案："
    echo "1. 检查SSH密钥: ssh -T git@github.com"
    echo "2. 或使用HTTPS: git remote set-url origin https://github.com/alveypro/maogame-public.git"
    echo "3. 然后重新运行: git push -u origin main"
fi

echo ""
echo "🛡️ 安全提醒："
echo "- 您的私钥从不上传到GitHub"
echo "- 游戏是纯前端，直接连接区块链"
echo "- 所有交易都在AlveyChain上透明可查" 