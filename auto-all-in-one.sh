#!/bin/bash

# 一键自动化脚本：编译、部署合约并启动自动发奖脚本
# 需先配置好 .env 文件（PRIVATE_KEY、ALVEY_RPC_URL_1等）

set -e

# 1. 编译合约
npx hardhat compile

# 2. 部署合约（假设deploy-wheelgame-v2.js为部署脚本，输出合约地址）
DEPLOY_OUTPUT=$(npx hardhat run scripts/deploy-wheelgame-v2.js --network alvey)
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -Eo '0x[a-fA-F0-9]{40}' | tail -1)

if [ -z "$CONTRACT_ADDRESS" ]; then
  echo "❌ 部署失败，未获取到合约地址。"
  exit 1
fi

echo "✅ 合约已部署，地址: $CONTRACT_ADDRESS"

# 3. 生成自动发奖脚本 auto-reward.js
cat > auto-reward.js <<EOF
require('dotenv').config();
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(process.env.ALVEY_RPC_URL_1);
const prizeWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const WHEEL_GAME_ABI = [
  "event GamePlayed(address indexed player, uint8 tokenType, uint256 betAmount, uint256 rewardAmount, uint8 rewardLevel, uint256 randomSeed)"
];
const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)"
];

const WHEEL_GAME = "$CONTRACT_ADDRESS";
const MAO_TOKEN = "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022";
const PI_TOKEN = "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444";

const game = new ethers.Contract(WHEEL_GAME, WHEEL_GAME_ABI, provider);
const mao = new ethers.Contract(MAO_TOKEN, ERC20_ABI, prizeWallet);
const pi = new ethers.Contract(PI_TOKEN, ERC20_ABI, prizeWallet);

console.log("自动发奖脚本已启动，监听合约中奖事件...");

game.on("GamePlayed", async (player, tokenType, betAmount, rewardAmount, rewardLevel) => {
  if (rewardLevel > 0 && rewardAmount.gt(0)) {
    const token = tokenType === 0 ? mao : pi;
    try {
      const tx = await token.transfer(player, rewardAmount);
      await tx.wait();
      console.log(`已自动发奖 ${ethers.formatEther(rewardAmount)} ${tokenType === 0 ? "MAO" : "PI"} 给 ${player}`);
    } catch (e) {
      console.error("发奖失败", e);
    }
  }
});
EOF

# 4. 启动自动发奖脚本（后台运行，日志输出到 auto-reward.log）
nohup node auto-reward.js > auto-reward.log 2>&1 &
REWARD_PID=$!
echo "🎉 自动发奖脚本已启动，进程号: $REWARD_PID，日志: auto-reward.log"

echo "全部自动化流程已完成！"
echo "如需停止自动发奖脚本，可运行: kill $REWARD_PID" 