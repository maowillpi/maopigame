# 🚀 WheelGameV2 智能合约部署指南

## 📋 部署前准备

### 1. 🔐 配置私钥
```bash
# 复制环境变量模板
cp env-template.txt .env

# 编辑 .env 文件，填入你的私钥
nano .env
```

在 `.env` 文件中填入：
```env
# 你的钱包私钥（64位，不要0x前缀）
PRIVATE_KEY=你的私钥在这里

# AlveyChain 网络配置
ALVEY_RPC_URL_1=https://elves-core1.alvey.io/
ALVEY_RPC_URL_2=https://elves-core2.alvey.io/
ALVEY_RPC_URL_3=https://elves-core3.alvey.io/
CHAIN_ID=3797
```

### 2. 💰 确保钱包余额充足
- 需要一定数量的 ALV 用于支付 gas 费用
- 建议余额：至少 1 ALV

## 🚀 开始部署

### 步骤 1：编译合约
```bash
npx hardhat compile
```

### 步骤 2：部署到 AlveyChain
```bash
npx hardhat run scripts/deploy-wheelgame-v2.js --network alvey
```

## 📊 WheelGameV2 特性

### 🔧 可动态配置参数
- **投注金额**：可调整 MAO 和 PI 的投注金额
- **奖励金额**：可更新各等级的奖励
- **概率分布**：可修改中奖概率
- **资金分配**：可调整奖金池、销毁、营销的比例

### 🎰 初始配置
```
MAO 投注：100 MAO
PI 投注：1,000 PI （更合理的金额）

奖励等级：
- 谢谢惠顾：0（58%）
- 小奖：105 MAO / 1,050 PI（22%，有盈利感）
- 中奖：150 MAO / 1,500 PI（12%）
- 大奖：250 MAO / 2,500 PI（6%）
- 超级大奖：400 MAO / 4,000 PI（1.5%）
- 终极大奖：700 MAO / 7,000 PI（0.5%）

资金分配：
- 奖金池：70%
- 销毁：10%
- 营销：20%
```

## 🔄 部署完成后操作

### 1. 更新前端合约地址
将部署输出中的合约地址更新到 `index.html`：
```javascript
const CONTRACTS = {
    WHEEL_GAME: "新的合约地址",  // 更新这里
    MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
    PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444"
};
```

### 2. 设置奖金池
```bash
# 如果需要，可以设置专门的奖金池地址
# 通过合约管理功能进行设置
```

### 3. 充值奖金池
向奖金池地址转入足够的 MAO 和 PI 代币用于发放奖励。

### 4. 授权奖金池
奖金池需要授权合约转账代币：
```javascript
// MAO 代币授权
await maoContract.approve(wheelGameV2Address, ethers.constants.MaxUint256);

// PI 代币授权  
await piContract.approve(wheelGameV2Address, ethers.constants.MaxUint256);
```

## 🔧 管理功能

### 更新投注金额
```javascript
// 将 PI 投注改为 500 PI
await wheelGameV2.updateBetAmounts(
    ethers.utils.parseEther("100"),   // MAO 投注
    ethers.utils.parseEther("500")    // PI 投注
);
```

### 更新奖励配置
```javascript
// 更新 MAO 奖励
await wheelGameV2.updateMaoRewards([
    0,                               // 谢谢惠顾
    ethers.utils.parseEther("110"),  // 小奖
    ethers.utils.parseEther("160"),  // 中奖
    ethers.utils.parseEther("260"),  // 大奖
    ethers.utils.parseEther("450"),  // 超级大奖
    ethers.utils.parseEther("800")   // 终极大奖
]);
```

### 更新概率分布
```javascript
// 调整概率（总和必须为10000）
await wheelGameV2.updateProbabilities([
    6000,  // 谢谢惠顾 60%
    8000,  // 小奖 20%
    9000,  // 中奖 10%
    9500,  // 大奖 5%
    9800,  // 超级大奖 3%
    10000  // 终极大奖 2%
]);
```

### 更新资金分配
```javascript
// 调整资金分配比例
await wheelGameV2.updateFundingRatios(
    75,  // 奖金池 75%
    5,   // 销毁 5%
    20   // 营销 20%
);
```

## ⚠️ 安全提醒

1. **私钥安全**：确保 `.env` 文件不要提交到 git
2. **权限控制**：只有合约 owner 可以调用管理函数
3. **资金安全**：部署前仔细检查所有地址
4. **测试充分**：在主网部署前先在测试网测试

## 🆚 对比原合约的优势

| 特性 | 原合约 | WheelGameV2 |
|------|--------|-------------|
| 投注金额 | 固定（100 MAO / 10,000 PI） | 可调整 |
| 奖励金额 | 固定 | 可调整 |
| 概率分布 | 固定 | 可调整 |
| 资金分配 | 固定 | 可调整 |
| 用户体验 | 85%失败率，PI奖励感差 | 58%失败率，小奖有盈利感 |
| 管理灵活性 | 无法修改 | 完全可控 |

部署完成后，你就拥有了一个完全可控的转盘游戏系统！🎉 