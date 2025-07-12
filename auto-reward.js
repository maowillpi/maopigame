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

const WHEEL_GAME = "0xA9E4FD96B29e4f512a0a75E402C156B04D6E6c35";
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
      console.log();
    } catch (e) {
      console.error("发奖失败", e);
    }
  }
});
