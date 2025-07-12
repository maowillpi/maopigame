require('dotenv').config();
const { ethers } = require("ethers");

// 多个 RPC URL 用于容错
const RPC_URLS = [
  process.env.ALVEY_RPC_URL_1 || "https://elves-core1.alvey.io/",
  process.env.ALVEY_RPC_URL_2 || "https://elves-core2.alvey.io/",
  process.env.ALVEY_RPC_URL_3 || "https://elves-core3.alvey.io/"
];

// 尝试连接到可用的 RPC
async function createProvider() {
  for (const url of RPC_URLS) {
    try {
      console.log(`尝试连接到 ${url}`);
      const provider = new ethers.JsonRpcProvider(url);
      await provider.getNetwork(); // 测试连接
      console.log(`✅ 成功连接到 ${url}`);
      return provider;
    } catch (error) {
      console.log(`❌ 连接失败: ${url} - ${error.message}`);
    }
  }
  throw new Error("所有 RPC URL 都无法连接");
}

async function main() {
  try {
    const provider = await createProvider();
    const prizeWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const WHEEL_GAME_ABI = [
      "event GamePlayed(address indexed player, uint8 tokenType, uint256 betAmount, uint256 rewardAmount, uint8 rewardLevel, uint256 randomSeed)"
    ];
    const ERC20_ABI = [
      "function transfer(address to, uint256 amount) returns (bool)"
    ];

    const WHEEL_GAME = "0xA9E4FD96B29e4f512a0a75E402C156B04D6E6c35";
    const MAO_TOKEN = "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022";
    const PI_TOKEN = "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444";

    const game = new ethers.Contract(WHEEL_GAME, WHEEL_GAME_ABI, provider);
    const mao = new ethers.Contract(MAO_TOKEN, ERC20_ABI, prizeWallet);
    const pi = new ethers.Contract(PI_TOKEN, ERC20_ABI, prizeWallet);

    console.log("🎰 自动发奖脚本已启动，监听合约中奖事件...");
    console.log(`📍 监听合约: ${WHEEL_GAME}`);
    console.log(`💰 奖池钱包: ${prizeWallet.address}`);

    game.on("GamePlayed", async (player, tokenType, betAmount, rewardAmount, rewardLevel) => {
      if (rewardLevel > 0 && rewardAmount.gt(0)) {
        const tokenName = tokenType === 0 ? "MAO" : "PI";
        const token = tokenType === 0 ? mao : pi;
        const amount = ethers.formatEther(rewardAmount);
        
        console.log(`🎉 检测到中奖事件:`);
        console.log(`   玩家: ${player}`);
        console.log(`   代币: ${tokenName}`);
        console.log(`   奖励: ${amount} ${tokenName}`);
        console.log(`   等级: ${rewardLevel}`);
        
        try {
          const tx = await token.transfer(player, rewardAmount);
          console.log(`⏳ 发奖交易已提交: ${tx.hash}`);
          await tx.wait();
          console.log(`✅ 发奖成功！`);
        } catch (e) {
          console.error(`❌ 发奖失败:`, e.message);
        }
      }
    });

    // 保持脚本运行
    process.on('SIGINT', () => {
      console.log('\n🛑 自动发奖脚本已停止');
      process.exit(0);
    });

  } catch (error) {
    console.error("❌ 启动失败:", error.message);
    process.exit(1);
  }
}

main();
