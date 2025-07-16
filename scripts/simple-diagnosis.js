// 🎯 简单诊断 - 解决问题的核心
const { ethers } = require("hardhat");

async function simpleDiagnosis() {
    console.log("🎯 简单诊断开始 - 找出核心问题\n");
    
    const ISSUE = {
        ENV_GAME_CONTRACT: "0xc27e29BCe41db77815435a9415329424849Daeb6",
        HTML_GAME_CONTRACT: "0x621DF9e0DE6b4e7EDC5Dc22Cd7c0F883c3F56966",
        MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022"
    };

    try {
        const [signer] = await ethers.getSigners();
        const provider = signer.provider;
        
        console.log(`🔍 测试账户: ${signer.address}`);
        console.log(`🌐 网络ID: ${(await provider.getNetwork()).chainId}`);
        
        console.log("\n❗ 关键问题：游戏合约地址不一致");
        console.log("=======================================");
        console.log(`📁 .env文件中: ${ISSUE.ENV_GAME_CONTRACT}`);
        console.log(`🌐 index.html中: ${ISSUE.HTML_GAME_CONTRACT}`);
        
        // 检查合约是否存在
        console.log("\n🔍 合约存在性检查:");
        const envCode = await provider.getCode(ISSUE.ENV_GAME_CONTRACT);
        const htmlCode = await provider.getCode(ISSUE.HTML_GAME_CONTRACT);
        
        console.log(`📁 .env合约存在: ${envCode.length > 2 ? '✅ 是' : '❌ 否'} (${envCode.length} bytes)`);
        console.log(`🌐 html合约存在: ${htmlCode.length > 2 ? '✅ 是' : '❌ 否'} (${htmlCode.length} bytes)`);
        
        // 检查哪个合约更新
        console.log("\n🔍 合约代码对比:");
        if (envCode.length > htmlCode.length) {
            console.log("📁 .env合约代码更大，可能是更新版本");
        } else if (htmlCode.length > envCode.length) {
            console.log("🌐 html合约代码更大，可能是更新版本");
        } else {
            console.log("⚖️ 两个合约代码大小相同");
        }
        
        // 检查测试账户的MAO余额（使用更兼容的方式）
        console.log("\n💰 余额检查:");
        try {
            const maoABI = ["function balanceOf(address) view returns (uint256)"];
            const maoContract = new ethers.Contract(ISSUE.MAO_TOKEN, maoABI, provider);
            const balance = await maoContract.balanceOf(signer.address);
            
            const balanceFormatted = balance.div(ethers.BigNumber.from("1000000000000000000"));
            console.log(`💰 测试账户MAO余额: ${balanceFormatted.toString()} MAO`);
            
            if (balanceFormatted.lt(100)) {
                console.log("❌ 余额不足100个MAO，无法测试游戏");
            } else {
                console.log("✅ 余额充足，可以测试游戏");
            }
        } catch (balanceError) {
            console.log(`❌ 余额检查失败: ${balanceError.message}`);
        }
        
        console.log("\n🎯 问题总结:");
        console.log("=============");
        console.log("1. 🚨 游戏合约地址不一致是核心问题！");
        console.log("2. 需要确定使用哪个合约地址");
        console.log("3. 需要统一所有配置文件");
        
        console.log("\n💡 建议解决方案:");
        console.log("=================");
        if (htmlCode.length > envCode.length) {
            console.log("✅ 推荐使用 index.html 中的合约地址（代码更大）");
            console.log(`📝 更新 .env 文件: WHEEL_GAME_ADDRESS=${ISSUE.HTML_GAME_CONTRACT}`);
        } else {
            console.log("✅ 推荐使用 .env 文件中的合约地址（代码更大）");
            console.log(`📝 更新 index.html 文件合约地址为: ${ISSUE.ENV_GAME_CONTRACT}`);
        }
        
    } catch (error) {
        console.error("❌ 诊断出错:", error.message);
    }
}

simpleDiagnosis()
    .then(() => console.log("\n🎯 简单诊断完成！"))
    .catch(console.error); 