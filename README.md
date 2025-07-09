# 🎰 MAO转盘游戏 - 全球Web3游戏

> 基于AlveyChain的去中心化转盘游戏，支持MAO和PI代币，全球任何地方都能玩！

## 🌟 特性

- 🎮 **双代币支持**: MAO 和 PI 代币游戏
- 🌍 **全球访问**: 部署在公网，任何地方都能玩
- 📱 **双模式游戏**: 网页游戏 + 手机钱包扫码
- 🎁 **6级奖励系统**: 最高奖励 3000 MAO / 300000 PI
- 🔥 **代币通缩**: 每次游戏10%代币自动销毁
- 🛡️ **完全去中心化**: 无中心化服务器，直连区块链

## 🚀 快速开始

### 🎮 玩游戏
1. 访问游戏网址（部署后获得）
2. 连接MetaMask钱包
3. 确保在AlveyChain网络 (Chain ID: 3797)
4. 持有MAO或PI代币
5. 授权代币并开始游戏！

### 💰 游戏成本
- **MAO游戏**: 每次 100 MAO
- **PI游戏**: 每次 10,000 PI

## 🏆 奖励系统

| 奖励等级 | 概率 | MAO奖励 | PI奖励 |
|---------|------|---------|--------|
| 🎁 谢谢惠顾 | 85% | 0 | 0 |
| 🥉 小奖 | 8% | 150 | 15,000 |
| 🥈 中奖 | 4% | 400 | 40,000 |
| 🥇 大奖 | 2% | 800 | 80,000 |
| ⭐ 超级大奖 | 0.8% | 1,500 | 150,000 |
| 🎊 终极大奖 | 0.2% | 3,000 | 300,000 |

## 🌐 部署到公网

### 方法一：一键部署脚本
```bash
./deploy-to-public.sh
```

### 方法二：手动部署到GitHub Pages
1. 创建GitHub仓库
2. 推送代码：
   ```bash
   git init
   git add .
   git commit -m "MAO转盘游戏"
   git remote add origin https://github.com/yourusername/maogame-public.git
   git push -u origin main
   ```
3. 在GitHub仓库设置中启用Pages
4. 选择 gh-pages 分支
5. 游戏将在 `https://yourusername.github.io/maogame-public` 可用

### 方法三：Vercel部署
1. 访问 [vercel.com](https://vercel.com)
2. 连接GitHub仓库
3. 选择Next.js框架
4. 点击部署

## 🔧 技术栈

- **前端**: Next.js, React, TailwindCSS
- **区块链**: Ethers.js, AlveyChain
- **智能合约**: Solidity, OpenZeppelin
- **部署**: Vercel, GitHub Pages, Netlify

## 📄 合约信息

- **游戏合约**: `0xc27e29BCe41db77815435a9415329424849Daeb6`
- **MAO代币**: `0x22f49bcb3dad370a9268ba3fca33cb037ca3d022`
- **PI代币**: `0xfd4680e25e05b3435c7f698668d1ce80d2a9f444`
- **网络**: AlveyChain (Chain ID: 3797)

## 💰 资金分配

每次游戏投注的分配：
- **70%** → 奖金池（用于发放奖励）
- **20%** → 营销钱包
- **10%** → 销毁地址（代币通缩）

## 🛡️ 安全特性

- ✅ **重入攻击保护**
- ✅ **权限控制系统**
- ✅ **随机数链上验证**
- ✅ **自动代币销毁**
- ✅ **无私钥上传风险**

## 📱 支持的钱包

- MetaMask
- WalletConnect
- 任何支持AlveyChain的移动钱包

## 🎯 游戏模式

### 🖥️ 网页模式
- 直接在浏览器中游戏
- 实时转盘动画
- 完整游戏历史

### 📱 扫码模式
- 用手机钱包扫描二维码
- 移动端友好
- 快速游戏体验

## 🌍 全球访问

部署后，您的游戏将有一个公网地址，例如：
- `https://yourusername.github.io/maogame-public`
- `https://maogame.vercel.app`
- `https://maogame.netlify.app`

任何人只要：
- ✅ 有网络连接
- ✅ 有支持AlveyChain的钱包
- ✅ 持有MAO或PI代币

就能在世界任何地方玩您的游戏！

## 📞 支持

如果遇到问题：
1. 检查钱包是否连接到AlveyChain网络
2. 确保有足够的MAO/PI代币余额
3. 验证代币已授权给游戏合约
4. 查看浏览器控制台错误信息

## 📄 许可证

MIT License - 自由使用和修改

---

🎉 **享受您的全球Web3转盘游戏！** 