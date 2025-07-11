const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 部署 WheelGameV2 (可升级版本)...");
    
    // 合约地址
    const MAO_TOKEN = "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022";
    const PI_TOKEN = "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444";
    
    // 获取部署者账户
    const [deployer] = await ethers.getSigners();
    console.log("部署者地址:", deployer.address);
    
    // 暂时使用部署者地址作为营销钱包和奖金池，部署后可以通过管理函数更改
    const MARKETING_WALLET = deployer.address; // 临时使用部署者地址
    const PRIZE_POOL = deployer.address;       // 临时使用部署者地址
    
    console.log("营销钱包 (临时):", MARKETING_WALLET);
    console.log("奖金池 (临时):", PRIZE_POOL);
    
    // 获取合约工厂
    const WheelGameV2 = await ethers.getContractFactory("WheelGameV2");
    
    // 部署合约
    console.log("正在部署 WheelGameV2...");
    const wheelGameV2 = await WheelGameV2.deploy(
        MAO_TOKEN,
        PI_TOKEN,
        MARKETING_WALLET,
        PRIZE_POOL
    );
    
    // 等待部署完成
    await wheelGameV2.waitForDeployment();
    const contractAddress = await wheelGameV2.getAddress();
    
    console.log("\n✅ WheelGameV2 部署完成！");
    console.log("🔗 合约地址:", contractAddress);
    console.log("📊 MAO代币:", MAO_TOKEN);
    console.log("📊 PI代币:", PI_TOKEN);
    console.log("💰 营销钱包:", MARKETING_WALLET);
    console.log("🎁 奖金池:", PRIZE_POOL);
    
    // 显示当前配置
    const maoBetAmount = await wheelGameV2.maoBetAmount();
    const piBetAmount = await wheelGameV2.piBetAmount();
    
    console.log("\n📊 当前游戏配置:");
    console.log("MAO投注金额:", ethers.formatEther(maoBetAmount), "MAO");
    console.log("PI投注金额:", ethers.formatEther(piBetAmount), "PI");
    
    console.log("\n🎰 MAO奖励配置:");
    for (let i = 0; i < 6; i++) {
        const reward = await wheelGameV2.maoRewards(i);
        console.log(`等级${i}: ${ethers.formatEther(reward)} MAO`);
    }
    
    console.log("\n🎰 PI奖励配置:");
    for (let i = 0; i < 6; i++) {
        const reward = await wheelGameV2.piRewards(i);
        console.log(`等级${i}: ${ethers.formatEther(reward)} PI`);
    }
    
    console.log("\n🎯 概率配置:");
    for (let i = 0; i < 6; i++) {
        const prob = await wheelGameV2.probabilityRanges(i);
        const percentage = i === 0 ? Number(prob) / 100 : 
                          (Number(prob) - Number(await wheelGameV2.probabilityRanges(i-1))) / 100;
        console.log(`等级${i}: ${percentage}%`);
    }
    
    console.log("\n💰 资金分配:");
    const prizePoolPercent = await wheelGameV2.prizePoolPercent();
    const burnPercent = await wheelGameV2.burnPercent();
    const marketingPercent = await wheelGameV2.marketingPercent();
    console.log(`奖金池: ${prizePoolPercent}%`);
    console.log(`销毁: ${burnPercent}%`);
    console.log(`营销: ${marketingPercent}%`);
    
    console.log("\n🔧 管理功能说明:");
    console.log("- updateMaoRewards(): 更新MAO奖励");
    console.log("- updatePiRewards(): 更新PI奖励");
    console.log("- updateProbabilities(): 更新概率分配");
    console.log("- updateBetAmounts(): 更新投注金额");
    console.log("- updateFundingRatios(): 更新资金分配比例");
    
    console.log("\n⚠️ 部署完成后的必要步骤:");
    console.log("1. 🔄 更新前端合约地址到:", contractAddress);
    console.log("2. 💰 设置正确的营销钱包地址（如需要）");
    console.log("3. 🎁 设置正确的奖金池地址（如需要）");
    console.log("4. 💎 向奖金池充值代币用于发放奖励");
    console.log("5. 🔓 奖金池需要授权合约转账代币");
    
    console.log("\n🚀 前端更新命令:");
    console.log(`请将以下地址更新到 index.html:`);
    console.log(`WHEEL_GAME: "${contractAddress}"`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("部署失败:", error);
        process.exit(1);
    }); 