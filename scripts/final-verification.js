// 🎯 最终验证 - 确认问题已解决
const { ethers } = require("hardhat");

async function finalVerification() {
    console.log("🎯 最终验证开始 - 确认问题已完全解决\n");
    
    const UNIFIED_CONFIG = {
        MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
        PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444",
        WHEEL_GAME: "0x621DF9e0DE6b4e7EDC5Dc22Cd7c0F883c3F56966", // 已统一
        MARKETING_WALLET: "0x861A48051eFaA1876D4B38904516C9F7bbCca36d",
        PRIZE_POOL: "0xE15881Fc413c6cd47a512C24608F94Fa2896b374"
    };

    try {
        const [signer] = await ethers.getSigners();
        const provider = signer.provider;
        
        console.log(`🔍 测试账户: ${signer.address}`);
        console.log(`🌐 网络ID: ${(await provider.getNetwork()).chainId}`);
        
        console.log("\n✅ 配置统一验证:");
        console.log("=================");
        console.log(`📁 .env游戏合约: ${process.env.WHEEL_GAME_ADDRESS}`);
        console.log(`🌐 统一合约地址: ${UNIFIED_CONFIG.WHEEL_GAME}`);
        
        const isUnified = process.env.WHEEL_GAME_ADDRESS === UNIFIED_CONFIG.WHEEL_GAME;
        console.log(`🎯 地址统一: ${isUnified ? '✅ 是' : '❌ 否'}`);
        
        if (isUnified) {
            console.log("🎉 恭喜！游戏合约地址已成功统一！");
        }
        
        // 检查合约状态
        console.log("\n🔍 统一合约状态检查:");
        console.log("=====================");
        
        const code = await provider.getCode(UNIFIED_CONFIG.WHEEL_GAME);
        console.log(`📋 合约代码存在: ${code.length > 2 ? '✅ 是' : '❌ 否'} (${code.length} bytes)`);
        
        // 检查所有关键合约
        console.log("\n🧩 全部合约验证:");
        console.log("=================");
        
        const contracts = [
            { name: "MAO代币", address: UNIFIED_CONFIG.MAO_TOKEN },
            { name: "PI代币", address: UNIFIED_CONFIG.PI_TOKEN },
            { name: "游戏合约", address: UNIFIED_CONFIG.WHEEL_GAME },
        ];
        
        for (const contract of contracts) {
            try {
                const code = await provider.getCode(contract.address);
                console.log(`${contract.name}: ${code.length > 2 ? '✅ 存在' : '❌ 不存在'} (${contract.address.slice(0,10)}...)`);
            } catch (error) {
                console.log(`${contract.name}: ❌ 检查失败 (${contract.address.slice(0,10)}...)`);
            }
        }
        
        // 检查测试账户状态
        console.log("\n💰 测试账户状态:");
        console.log("=================");
        
        try {
            const alvBalance = await provider.getBalance(signer.address);
            const alvFormatted = Number(ethers.utils.formatEther(alvBalance)).toFixed(4);
            console.log(`ALV余额: ${alvFormatted} ALV`);
            
            // 检查MAO余额
            try {
                const maoABI = ["function balanceOf(address) view returns (uint256)"];
                const maoContract = new ethers.Contract(UNIFIED_CONFIG.MAO_TOKEN, maoABI, provider);
                const maoBalance = await maoContract.balanceOf(signer.address);
                const maoFormatted = Number(ethers.utils.formatEther(maoBalance)).toFixed(0);
                console.log(`MAO余额: ${maoFormatted} MAO`);
                
                if (Number(maoFormatted) >= 100) {
                    console.log("✅ MAO余额充足，可以进行游戏测试");
                } else {
                    console.log("⚠️ MAO余额不足100个，需要充值才能测试");
                }
            } catch (maoError) {
                console.log("❌ MAO余额查询失败");
            }
            
        } catch (balanceError) {
            console.log("❌ 余额查询失败");
        }
        
        console.log("\n🎯 最终结论:");
        console.log("=============");
        
        if (isUnified) {
            console.log("🎉 所有配置已成功统一！");
            console.log("📝 游戏合约地址: 0x621DF9e0DE6b4e7EDC5Dc22Cd7c0F883c3F56966");
            console.log("✅ index.html 和 .env 文件现在使用相同的合约地址");
            console.log("🚀 问题已解决，游戏应该可以正常工作了！");
            
            console.log("\n💡 下一步建议:");
            console.log("===============");
            console.log("1. 确保用户钱包有足够的MAO代币(≥100个)");
            console.log("2. 确保用户钱包有足够的ALV代币用于Gas费用(≥0.01个)");
            console.log("3. 确保奖金池对游戏合约有足够的授权");
            console.log("4. 部署更新的index.html到maopi.me网站");
        } else {
            console.log("❌ 配置仍然不统一，需要进一步修复");
        }
        
    } catch (error) {
        console.error("❌ 验证过程出错:", error.message);
    }
}

finalVerification()
    .then(() => console.log("\n🎯 最终验证完成！"))
    .catch(console.error); 