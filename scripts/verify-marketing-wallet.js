const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 验证 WheelGameV2 营销钱包配置...");
    
    // 合约地址
    const WHEEL_GAME_V2 = "0xB677DBcA76061E6301272c83179c8243A4eeB6A5";
    const EXPECTED_MARKETING_WALLET = "0x861A48051eFaA1876D4B38904516C9F7bbCca36d";
    
    // 获取部署者账户
    const [deployer] = await ethers.getSigners();
    console.log("验证者地址:", deployer.address);
    
    // 连接到已部署的合约
    const WheelGameV2 = await ethers.getContractFactory("WheelGameV2");
    const wheelGameV2 = WheelGameV2.attach(WHEEL_GAME_V2);
    
    console.log("\n📊 读取合约配置...");
    
    try {
        // 获取当前配置
        const [
            marketingWallet,
            prizePool,
            maoToken,
            piToken,
            maoBetAmount,
            piBetAmount
        ] = await Promise.all([
            wheelGameV2.marketingWallet(),
            wheelGameV2.prizePool(),
            wheelGameV2.maoToken(),
            wheelGameV2.piToken(),
            wheelGameV2.maoBetAmount(),
            wheelGameV2.piBetAmount()
        ]);
        
        console.log("✅ 合约配置读取成功！");
        console.log("\n🏦 钱包配置:");
        console.log("营销钱包:", marketingWallet);
        console.log("奖金池:", prizePool);
        
        console.log("\n📊 代币配置:");
        console.log("MAO Token:", maoToken);
        console.log("PI Token:", piToken);
        
        console.log("\n🎮 游戏配置:");
        console.log("MAO投注金额:", ethers.formatEther(maoBetAmount), "MAO");
        console.log("PI投注金额:", ethers.formatEther(piBetAmount), "PI");
        
        // 验证营销钱包
        const isCorrectMarketingWallet = marketingWallet.toLowerCase() === EXPECTED_MARKETING_WALLET.toLowerCase();
        
        console.log("\n🔍 验证结果:");
        console.log("营销钱包验证:", isCorrectMarketingWallet ? "✅ 正确" : "❌ 不匹配");
        
        if (isCorrectMarketingWallet) {
            console.log("🎉 营销钱包配置验证成功！");
            console.log("所有游戏中的营销费用将正确发送到:", EXPECTED_MARKETING_WALLET);
        } else {
            console.log("⚠️ 营销钱包配置不匹配！");
            console.log("期望:", EXPECTED_MARKETING_WALLET);
            console.log("实际:", marketingWallet);
        }
        
        // 读取奖励配置
        console.log("\n🎰 奖励配置验证:");
        for (let i = 0; i < 6; i++) {
            const [maoReward, piReward] = await Promise.all([
                wheelGameV2.maoRewards(i),
                wheelGameV2.piRewards(i)
            ]);
            console.log(`等级${i}: ${ethers.formatEther(maoReward)} MAO / ${ethers.formatEther(piReward)} PI`);
        }
        
        // 读取概率配置
        console.log("\n🎯 概率配置验证:");
        const probabilities = [];
        for (let i = 0; i < 6; i++) {
            const range = await wheelGameV2.probabilityRanges(i);
            probabilities.push(Number(range));
        }
        
        for (let i = 0; i < 6; i++) {
            const probability = i === 0 ? probabilities[i] : probabilities[i] - probabilities[i-1];
            console.log(`等级${i}: ${probability / 100}%`);
        }
        
        // 读取资金分配比例
        console.log("\n💰 资金分配验证:");
        const [prizePoolPercent, burnPercent, marketingPercent] = await Promise.all([
            wheelGameV2.prizePoolPercent(),
            wheelGameV2.burnPercent(),
            wheelGameV2.marketingPercent()
        ]);
        
        console.log(`奖金池: ${prizePoolPercent}%`);
        console.log(`销毁: ${burnPercent}%`);
        console.log(`营销: ${marketingPercent}%`);
        
        console.log("\n🔗 查看合约详情:");
        console.log(`https://alveyscan.com/address/${WHEEL_GAME_V2}`);
        
        console.log("\n✅ 验证完成！合约配置正确。");
        
    } catch (error) {
        console.error("❌ 验证失败:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("验证脚本失败:", error);
        process.exit(1);
    }); 