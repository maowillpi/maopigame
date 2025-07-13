require('dotenv').config();
const { ethers } = require("ethers");

// 合约地址
const WHEEL_GAME = '0xA9E4FD96B29e4f512a0a75E402C156B04D6E6c35';
const MAO_TOKEN = '0x22f49bcb3dad370a9268ba3fca33cb037ca3d022';
const PI_TOKEN = '0xfd4680e25e05b3435c7f698668d1ce80d2a9f444';

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)"
];

async function createProvider() {
  const rpcUrls = [
    'https://elves-core1.alvey.io/',
    'https://elves-core2.alvey.io/',
    'https://elves-core3.alvey.io/'
  ];
  
  for (const rpcUrl of rpcUrls) {
    try {
      console.log(`尝试连接到 ${rpcUrl}`);
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      await provider.getNetwork();
      console.log(`✅ 成功连接到 ${rpcUrl}`);
      return provider;
    } catch (error) {
      console.log(`❌ 连接失败: ${rpcUrl}`);
      continue;
    }
  }
  throw new Error('所有RPC连接失败');
}

async function main() {
  try {
    const provider = await createProvider();
    const prizeWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    const gameABI = [
      "event GamePlayed(address indexed player, uint8 tokenType, uint256 betAmount, uint256 rewardAmount, uint8 rewardLevel, uint256 randomSeed)"
    ];
    
    const game = new ethers.Contract(WHEEL_GAME, gameABI, provider);
    const mao = new ethers.Contract(MAO_TOKEN, ERC20_ABI, prizeWallet);
    const pi = new ethers.Contract(PI_TOKEN, ERC20_ABI, prizeWallet);

    console.log("🎰 自动发奖脚本已启动，监听合约中奖事件...");
    console.log(`📍 监听合约: ${WHEEL_GAME}`);
    console.log(`💰 奖池钱包: ${prizeWallet.address}`);

    game.on("GamePlayed", async (player, tokenType, betAmount, rewardAmount, rewardLevel) => {
      try {
        // 修复：使用BigInt比较而不是.gt()方法
        if (rewardLevel > 0 && rewardAmount > 0n) {
          const tokenName = tokenType === 0 ? "MAO" : "PI";
          const token = tokenType === 0 ? mao : pi;
          const amount = ethers.formatEther(rewardAmount);
          
          console.log(`🎉 检测到中奖事件:`);
          console.log(`   玩家: ${player}`);
          console.log(`   代币: ${tokenName}`);
          console.log(`   奖励: ${amount} ${tokenName}`);
          console.log(`   等级: ${rewardLevel}`);
          
          try {
            console.log(`💰 开始发放奖励...`);
            const tx = await token.transfer(player, rewardAmount);
            console.log(`📤 奖励发放交易: ${tx.hash}`);
            
            const receipt = await tx.wait();
            console.log(`✅ 奖励发放成功! Gas used: ${receipt.gasUsed}`);
          } catch (error) {
            console.error(`❌ 奖励发放失败:`, error);
          }
        } else {
          console.log(`😅 检测到未中奖事件 (玩家: ${player})`);
        }
      } catch (error) {
        console.error(`❌ 处理游戏事件失败:`, error);
      }
    });

    // 保持脚本运行
    process.on('SIGINT', () => {
      console.log('\n🛑 收到中断信号，正在关闭...');
      process.exit(0);
    });

    // 避免进程退出
    setInterval(() => {
      // 每30秒输出一次状态
      console.log(`⏰ ${new Date().toLocaleString()} - 脚本正在运行，监听中奖事件...`);
    }, 30000);

  } catch (error) {
    console.error('❌ 启动失败:', error);
    process.exit(1);
  }
}

main();
