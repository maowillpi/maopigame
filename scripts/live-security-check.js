// 🚨 实时安全检查 - 直接连接AlveyChain主网
const { ethers } = require("ethers");

async function liveSecurityCheck() {
    console.log("🚨 实时安全检查 - AlveyChain主网");
    console.log("==================================");
    
    const CONTRACTS = {
        MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
        PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444",
        WHEEL_GAME: "0x621DF9e0DE6b4e7EDC5Dc22Cd7c0F883c3F56966",
        MARKETING_WALLET: "0x861A48051eFaA1876D4B38904516C9F7bbCca36d",
        PRIZE_POOL: "0xE15881Fc413c6cd47a512C24608F94Fa2896b374", // 被盗的钱包
        BURN_ADDRESS: "0x000000000000000000000000000000000000dEaD"
    };

    // 直接连接AlveyChain主网
    const RPC_URLS = [
        'https://elves-core1.alvey.io/',
        'https://elves-core2.alvey.io/',
        'https://elves-core3.alvey.io/'
    ];

    let provider = null;
    let workingRpc = null;
    
    // 寻找可用的RPC节点
    for (const rpcUrl of RPC_URLS) {
        try {
            const testProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
            await testProvider.getNetwork();
            provider = testProvider;
            workingRpc = rpcUrl;
            console.log(`✅ 连接成功: ${rpcUrl}`);
            break;
        } catch (error) {
            console.log(`❌ 连接失败: ${rpcUrl}`);
        }
    }

    if (!provider) {
        console.log("🚨 无法连接到AlveyChain主网！");
        return;
    }

    try {
        const network = await provider.getNetwork();
        console.log(`🌐 网络确认: ChainID ${network.chainId} (期望: 3797)`);
        
        if (network.chainId !== 3797) {
            console.log("❌ 网络ID错误！");
            return;
        }

        // 1. 检查奖金池当前状态
        console.log("\n💰 奖金池状态检查:");
        console.log("===================");
        
        const tokenABI = [
            "function balanceOf(address) view returns (uint256)",
            "function allowance(address,address) view returns (uint256)",
            "function symbol() view returns (string)",
            "function decimals() view returns (uint8)"
        ];
        
        try {
            const maoContract = new ethers.Contract(CONTRACTS.MAO_TOKEN, tokenABI, provider);
            const piContract = new ethers.Contract(CONTRACTS.PI_TOKEN, tokenABI, provider);
            
            // 检查奖金池余额
            const prizePoolMAO = await maoContract.balanceOf(CONTRACTS.PRIZE_POOL);
            const prizePoolPI = await piContract.balanceOf(CONTRACTS.PRIZE_POOL);
            const prizePoolALV = await provider.getBalance(CONTRACTS.PRIZE_POOL);
            
            console.log(`🏆 奖金池MAO余额: ${ethers.utils.formatEther(prizePoolMAO)} MAO`);
            console.log(`🏆 奖金池PI余额: ${ethers.utils.formatEther(prizePoolPI)} PI`);
            console.log(`🏆 奖金池ALV余额: ${ethers.utils.formatEther(prizePoolALV)} ALV`);
            
            // 检查奖金池对游戏合约的授权
            const maoAllowance = await maoContract.allowance(CONTRACTS.PRIZE_POOL, CONTRACTS.WHEEL_GAME);
            const piAllowance = await piContract.allowance(CONTRACTS.PRIZE_POOL, CONTRACTS.WHEEL_GAME);
            
            console.log(`🔐 奖金池MAO授权给游戏: ${ethers.utils.formatEther(maoAllowance)} MAO`);
            console.log(`🔐 奖金池PI授权给游戏: ${ethers.utils.formatEther(piAllowance)} PI`);
            
            // 安全风险评估
            console.log("\n🛡️ 安全风险评估:");
            console.log("==================");
            
            let riskLevel = "LOW";
            const maoBalance = parseFloat(ethers.utils.formatEther(prizePoolMAO));
            const piBalance = parseFloat(ethers.utils.formatEther(prizePoolPI));
            const maoAuth = parseFloat(ethers.utils.formatEther(maoAllowance));
            const piAuth = parseFloat(ethers.utils.formatEther(piAllowance));
            
            if (maoBalance === 0 && piBalance === 0) {
                console.log("🚨 极高风险: 奖金池已被完全清空！");
                riskLevel = "CRITICAL";
            } else if (maoBalance < 1000 || piBalance < 10000) {
                console.log("⚠️ 高风险: 奖金池余额严重不足");
                riskLevel = "HIGH";
            } else {
                console.log("✅ 中风险: 奖金池仍有余额");
                riskLevel = "MEDIUM";
            }
            
            if (maoAuth > 0 || piAuth > 0) {
                console.log("🚨 严重警告: 奖金池仍对游戏合约有授权！");
                console.log("   黑客可能通过游戏合约继续盗取资金！");
                riskLevel = "CRITICAL";
            } else {
                console.log("✅ 授权安全: 奖金池对游戏合约无授权");
            }
            
            console.log(`\n🎯 总体风险等级: ${riskLevel}`);
            
        } catch (error) {
            console.log(`❌ 奖金池检查失败: ${error.message}`);
        }
        
        // 2. 检查游戏合约状态
        console.log("\n🎮 游戏合约安全检查:");
        console.log("======================");
        
        try {
            const gameCode = await provider.getCode(CONTRACTS.WHEEL_GAME);
            console.log(`🔍 游戏合约存在: ${gameCode.length > 2 ? '是' : '否'} (${gameCode.length} bytes)`);
            
            if (gameCode.length > 2) {
                console.log("⚠️ 游戏合约仍然存在并可能正在运行");
                console.log("   如果奖金池被盗，建议立即停止游戏服务");
            }
            
        } catch (error) {
            console.log(`❌ 游戏合约检查失败: ${error.message}`);
        }
        
        // 3. 检查其他关键地址
        console.log("\n💼 其他关键地址检查:");
        console.log("======================");
        
        const addresses = [
            { name: "营销钱包", address: CONTRACTS.MARKETING_WALLET },
            { name: "销毁地址", address: CONTRACTS.BURN_ADDRESS }
        ];
        
        const maoContract = new ethers.Contract(CONTRACTS.MAO_TOKEN, tokenABI, provider);
        
        for (const addr of addresses) {
            try {
                const balance = await maoContract.balanceOf(addr.address);
                const alvBalance = await provider.getBalance(addr.address);
                console.log(`${addr.name}:`);
                console.log(`  MAO: ${ethers.utils.formatEther(balance)} MAO`);
                console.log(`  ALV: ${ethers.utils.formatEther(alvBalance)} ALV`);
            } catch (error) {
                console.log(`❌ ${addr.name}检查失败`);
            }
        }
        
        // 4. 立即行动建议
        console.log("\n🚨 立即行动建议:");
        console.log("==================");
        console.log("1. 🛑 立即暂停maopi.me网站");
        console.log("2. 📢 发布紧急安全公告");
        console.log("3. 💰 如果奖金池还有余额，立即转移到安全地址");
        console.log("4. 🔒 撤销所有不必要的代币授权");
        console.log("5. 🎮 暂停或升级游戏合约");
        console.log("6. 🔐 生成新的安全奖金池地址");
        
        console.log("\n⚠️ 游戏安全状态:");
        console.log("==================");
        console.log("❌ 游戏当前 NOT SAFE");
        console.log("❌ 不建议用户继续游戏");
        console.log("❌ 需要完全修复后才能重新开放");
        
    } catch (error) {
        console.error("❌ 实时检查失败:", error.message);
    }
}

liveSecurityCheck()
    .then(() => console.log("\n🚨 实时安全检查完成！"))
    .catch(console.error); 