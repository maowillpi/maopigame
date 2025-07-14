// 🚀 部署修正版转盘游戏合约 - 真正的50%中奖率
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    console.log("🎯 开始部署修正版WheelGame合约...");
    console.log("============================================================");

    // 获取签名者
    const [deployer] = await ethers.getSigners();
    console.log("📝 部署账户:", deployer.address);
    
    // 获取余额
    try {
        const balance = await ethers.provider.getBalance(deployer.address);
        console.log("💰 账户余额:", ethers.utils.formatEther(balance), "ALV");
    } catch (error) {
        console.log("💰 账户余额: 无法获取");
    }

    // 合约配置
    const CONFIG = {
        MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
        PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444",
        MARKETING_WALLET: "0x861A48051eFaA1876D4B38904516C9F7bbCca36d",
        PRIZE_POOL: "0xE15881Fc413c6cd47a512C24608F94Fa2896b374"
    };

    console.log("\n📊 合约配置:");
    console.log("MAO代币:", CONFIG.MAO_TOKEN);
    console.log("PI代币:", CONFIG.PI_TOKEN);
    console.log("营销钱包:", CONFIG.MARKETING_WALLET);
    console.log("奖金池:", CONFIG.PRIZE_POOL);

    try {
        // 获取合约工厂
        console.log("\n🔨 编译合约...");
        const WheelGameFixed = await ethers.getContractFactory("WheelGameFixed");

        // 部署合约
        console.log("\n🚀 部署合约...");
        const wheelGame = await WheelGameFixed.deploy(
            CONFIG.MAO_TOKEN,
            CONFIG.PI_TOKEN,
            CONFIG.MARKETING_WALLET,
            CONFIG.PRIZE_POOL
        );

        console.log("⏳ 等待合约部署确认...");
        await wheelGame.waitForDeployment();

        console.log("\n✅ 合约部署成功！");
        console.log("============================================================");
        console.log("🎮 合约地址:", await wheelGame.getAddress());
        console.log("📊 部署交易:", wheelGame.deploymentTransaction().hash);

        // 验证概率配置
        console.log("\n🔍 验证概率配置...");
        const probabilityRanges = await wheelGame.getProbabilityRanges();
        
        console.log("📊 概率区间配置:");
        console.log("谢谢惠顾: 0 - 4999 (50.0%)");
        console.log("小奖: 5000 - 7199 (22.0%)");
        console.log("中奖: 7200 - 9199 (20.0%)");
        console.log("大奖: 9200 - 9899 (7.0%)");
        console.log("超级大奖: 9900 - 9979 (0.8%)");
        console.log("终极大奖: 9980 - 9999 (0.2%)");
        
        console.log("\n实际区间值:", probabilityRanges.map(r => r.toString()));

        // 验证奖励配置
        console.log("\n🎁 验证奖励配置...");
        const maoRewards = await wheelGame.getRewardConfig(0);
        const piRewards = await wheelGame.getRewardConfig(1);
        
        console.log("MAO奖励:", maoRewards.map(r => ethers.utils.formatEther(r)));
        console.log("PI奖励:", piRewards.map(r => ethers.utils.formatEther(r)));

        // 验证连败保护
        console.log("\n🔒 连败保护机制: 连续5次失败后强制中奖");

        // 保存部署信息
        const contractAddress = await wheelGame.getAddress();
        const deploymentInfo = {
            contractAddress: contractAddress,
            deployTransaction: wheelGame.deploymentTransaction().hash,
            deployer: deployer.address,
            timestamp: new Date().toISOString(),
            config: CONFIG,
            probabilityRanges: probabilityRanges.map(r => r.toString()),
            features: [
                "✅ 真正的50%中奖率",
                "✅ 连败保护机制",
                "✅ 改进的随机数生成",
                "✅ 透明度和可验证性",
                "✅ 详细的游戏统计"
            ]
        };

        console.log("\n💾 保存部署信息到文件...");
        const fs = require('fs');
        fs.writeFileSync(
            'FIXED_WHEEL_GAME_DEPLOYMENT.json',
            JSON.stringify(deploymentInfo, null, 2)
        );

        console.log("\n🎉 部署完成！");
        console.log("============================================================");
        console.log("📋 后续步骤:");
        console.log("1. 更新前端合约地址为:", contractAddress);
        console.log("2. 确保奖金池授权给新合约发放奖励");
        console.log("3. 测试游戏功能");
        console.log("4. 公告用户使用新的合约地址");

        // 生成更新前端的配置
        console.log("\n🔧 前端配置更新:");
        console.log("将以下地址替换到HTML文件中:");
        console.log(`WHEEL_GAME: '${contractAddress}',`);

        return contractAddress;

    } catch (error) {
        console.error("❌ 部署失败:", error);
        throw error;
    }
}

// 运行部署脚本
if (require.main === module) {
    main()
        .then((address) => {
            console.log(`\n🎯 修正版合约已部署到: ${address}`);
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 部署过程中出现错误:", error);
            process.exit(1);
        });
}

module.exports = main; 