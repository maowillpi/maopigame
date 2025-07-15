const { ethers } = require("hardhat");

async function main() {
    console.log("🔗 测试真实区块链游戏...");

    // 合约地址
    const addresses = {
        MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
        PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444",
        WHEEL_GAME: "0x621DF9e0DE6b4e7EDC5Dc22Cd7c0F883c3F56966",
        PRIZE_POOL: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022", // 使用MAO作为奖金池
    };

    // 获取签名者
    const [owner] = await ethers.getSigners();
    console.log("📝 测试账户:", owner.address);

    // 连接合约
    const maoToken = await ethers.getContractAt([
        "function balanceOf(address owner) external view returns (uint256)",
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function allowance(address owner, address spender) external view returns (uint256)",
        "function transfer(address to, uint256 amount) external returns (bool)"
    ], addresses.MAO_TOKEN);

    const piToken = await ethers.getContractAt([
        "function balanceOf(address owner) external view returns (uint256)",
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function allowance(address owner, address spender) external view returns (uint256)",
        "function transfer(address to, uint256 amount) external returns (bool)"
    ], addresses.PI_TOKEN);

    const wheelGame = await ethers.getContractAt([
        "function playMAOGame() external",
        "function playPIGame() external",
        "function getPlayerHistory(address player) external view returns (tuple(address player, uint8 tokenType, uint256 betAmount, uint256 rewardAmount, uint8 rewardLevel, uint256 timestamp, uint256 randomSeed, bool wasProtected)[])",
        "function getGameStats(uint8 tokenType) external view returns (tuple(uint256 totalGames, uint256 totalWins, uint256 totalBets, uint256 totalRewards, uint256 protectedGames))",
        "function getPlayerConsecutiveLosses(address player) external view returns (uint256)",
        "function getProbabilityRanges() external view returns (uint256[6])",
        "function getRewardConfig(uint8 tokenType) external view returns (uint256[6])",
        "function prizePool() external view returns (address)",
        "function marketingWallet() external view returns (address)",
        "event GamePlayed(address indexed player, uint8 tokenType, uint256 betAmount, uint256 rewardAmount, uint8 rewardLevel, uint256 randomSeed, bool wasProtected)"
    ], addresses.WHEEL_GAME);

    console.log("\n🔍 检查合约状态...");

    // 检查代币余额
    const maoBalance = await maoToken.balanceOf(owner.address);
    const piBalance = await piToken.balanceOf(owner.address);
    console.log("💰 MAO余额:", ethers.utils.formatEther(maoBalance));
    console.log("💰 PI余额:", ethers.utils.formatEther(piBalance));

    // 检查游戏合约配置
    try {
        const prizePool = await wheelGame.prizePool();
        const marketingWallet = await wheelGame.marketingWallet();
        console.log("🏆 奖金池地址:", prizePool);
        console.log("📈 营销钱包:", marketingWallet);

        // 检查概率配置
        const probabilities = await wheelGame.getProbabilityRanges();
        console.log("🎯 中奖概率配置:", probabilities.map(p => `${p.toNumber()/100}%`));

        // 检查奖励配置
        const maoRewards = await wheelGame.getRewardConfig(0);
        const piRewards = await wheelGame.getRewardConfig(1);
        console.log("🐱 MAO奖励配置:", maoRewards.map(r => ethers.utils.formatEther(r)));
        console.log("🥧 PI奖励配置:", piRewards.map(r => ethers.utils.formatEther(r)));

    } catch (error) {
        console.log("⚠️ 获取合约配置失败:", error.message);
    }

    // 检查玩家游戏历史
    try {
        const playerHistory = await wheelGame.getPlayerHistory(owner.address);
        console.log(`📊 玩家游戏历史: ${playerHistory.length} 局游戏`);
        
        if (playerHistory.length > 0) {
            const lastGame = playerHistory[playerHistory.length - 1];
            console.log("🎮 最后一局:", {
                tokenType: lastGame.tokenType === 0 ? 'MAO' : 'PI',
                betAmount: ethers.utils.formatEther(lastGame.betAmount),
                rewardAmount: ethers.utils.formatEther(lastGame.rewardAmount),
                rewardLevel: lastGame.rewardLevel.toString(),
                timestamp: new Date(lastGame.timestamp * 1000).toLocaleString()
            });
        }

        // 获取统计数据
        const maoStats = await wheelGame.getGameStats(0);
        const piStats = await wheelGame.getGameStats(1);
        console.log("📈 MAO统计:", {
            totalGames: maoStats.totalGames.toString(),
            totalWins: maoStats.totalWins.toString(),
            winRate: maoStats.totalGames.gt(0) ? `${maoStats.totalWins.mul(100).div(maoStats.totalGames)}%` : '0%'
        });
        console.log("📈 PI统计:", {
            totalGames: piStats.totalGames.toString(),
            totalWins: piStats.totalWins.toString(),
            winRate: piStats.totalGames.gt(0) ? `${piStats.totalWins.mul(100).div(piStats.totalGames)}%` : '0%'
        });

    } catch (error) {
        console.log("⚠️ 获取游戏统计失败:", error.message);
    }

    // 检查授权状态
    console.log("\n🔐 检查授权状态...");
    const maoAllowance = await maoToken.allowance(owner.address, addresses.WHEEL_GAME);
    const piAllowance = await piToken.allowance(owner.address, addresses.WHEEL_GAME);
    console.log("🐱 MAO授权额度:", ethers.utils.formatEther(maoAllowance));
    console.log("🥧 PI授权额度:", ethers.utils.formatEther(piAllowance));

    // 检查奖金池余额和授权
    console.log("\n🏆 检查奖金池状态...");
    try {
        const prizePoolAddress = await wheelGame.prizePool();
        const prizePoolMaoBalance = await maoToken.balanceOf(prizePoolAddress);
        const prizePoolPiBalance = await piToken.balanceOf(prizePoolAddress);
        console.log("🏆 奖金池MAO余额:", ethers.utils.formatEther(prizePoolMaoBalance));
        console.log("🏆 奖金池PI余额:", ethers.utils.formatEther(prizePoolPiBalance));

        // 检查奖金池是否授权给游戏合约
        const prizePoolMaoAllowance = await maoToken.allowance(prizePoolAddress, addresses.WHEEL_GAME);
        const prizePoolPiAllowance = await piToken.allowance(prizePoolAddress, addresses.WHEEL_GAME);
        console.log("🏆 奖金池MAO授权:", ethers.utils.formatEther(prizePoolMaoAllowance));
        console.log("🏆 奖金池PI授权:", ethers.utils.formatEther(prizePoolPiAllowance));

    } catch (error) {
        console.log("⚠️ 检查奖金池失败:", error.message);
    }

    console.log("\n✅ 真实区块链游戏状态检查完成！");
    console.log("🎮 游戏已准备就绪，可以开始真实的代币投入游戏！");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ 测试失败:", error);
        process.exit(1);
    }); 