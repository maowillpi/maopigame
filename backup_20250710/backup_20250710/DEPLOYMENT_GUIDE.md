# 部署指南

## 重要提醒

**您的原始奖励机制会导致严重亏损！**

### 原始设置问题：
- MAO投注100个，最高奖励10000个 (100倍)
- PI投注10000个，最高奖励1000000个 (100倍)  
- 每次投注奖金池只收到50%，无法支撑如此高的奖励

### 已调整的合理机制：
- 奖金池分配增加到70%
- 奖励上限大幅降低到2倍投注额
- 确保奖金池长期盈利

## 快速部署步骤

### 1. 环境准备
```bash
# 安装依赖
npm install

# 初始化Hardhat项目
npx hardhat init
```

### 2. 配置私钥
编辑 `hardhat.config.js`:
```javascript
networks: {
  alvey: {
    url: "https://elves-core1.alvey.io/",
    chainId: 3797,
    accounts: ["您的私钥"] // 替换为实际私钥
  }
}
```

### 3. 部署合约
```bash
# 编译合约
npm run compile

# 部署到AlveyChain
npm run deploy
```

### 4. 更新前端配置
部署成功后，复制合约地址到 `pages/index.js`:
```javascript
const CONTRACT_ADDRESS = "0x..."; // 替换为实际合约地址
```

### 5. 启动应用
```bash
npm run dev
```

## 网络添加到MetaMask

```javascript
{
  "chainId": "0xED5",
  "chainName": "AlveyChain",
  "nativeCurrency": {
    "name": "ALV",
    "symbol": "ALV",
    "decimals": 18
  },
  "rpcUrls": ["https://elves-core1.alvey.io/"],
  "blockExplorerUrls": ["https://alveyscan.com/"]
}
```

## 奖金池初始化

部署合约后，需要：
1. 向奖金池地址转入初始代币
2. 授权合约从奖金池转账
3. 测试小额投注确认工作正常

## 安全检查清单

- [ ] 私钥安全保存
- [ ] 奖金池有足够余额
- [ ] 营销钱包地址正确
- [ ] 合约在正确网络部署
- [ ] 前端合约地址已更新
- [ ] 代币合约地址正确

## 监控建议

1. 定期检查奖金池余额
2. 监控游戏统计数据
3. 关注合约交互日志
4. 设置余额预警

## 故障排除

### 合约部署失败
- 检查私钥是否正确
- 确认网络配置
- 验证账户有足够ALV支付gas

### 前端连接失败
- 检查合约地址是否正确
- 确认网络ID匹配
- 验证MetaMask在正确网络

### 游戏交易失败
- 检查代币余额
- 确认授权额度
- 验证奖金池余额

## 技术支持

如遇问题，请检查：
1. 浏览器控制台错误
2. 合约交易日志
3. 网络连接状态
4. 代币余额和授权 