// 🚨 紧急安全检查 - 奖金池被盗风险评估
const { ethers } = require("hardhat");

async function emergencySecurityCheck() {
    console.log("🚨 紧急安全检查 - 奖金池被盗风险评估");
    console.log("=============================================");
    
    const CONTRACTS = {
        MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
        PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444",
        WHEEL_GAME: "0x621DF9e0DE6b4e7EDC5Dc22Cd7c0F883c3F56966",
        MARKETING_WALLET: "0x861A48051eFaA1876D4B38904516C9F7bbCca36d",
        PRIZE_POOL: "0xE15881Fc413c6cd47a512C24608F94Fa2896b374", // 被盗的钱包
        BURN_ADDRESS: "0x000000000000000000000000000000000000dEaD"
    };

    try {
        const [signer] = await ethers.getSigners();
        const provider = signer.provider;
        
        console.log("🔍 系统状态检查:");
        console.log("=================");
        console.log(`测试账户: ${signer.address}`);
        console.log(`网络ID: ${(await provider.getNetwork()).chainId}`);
        
        // 1. 检查奖金池当前状态
        console.log("\n💰 奖金池状态检查:");
        console.log("===================");
        
        const tokenABI = [
            "function balanceOf(address) view returns (uint256)",
            "function allowance(address,address) view returns (uint256)",
            "function symbol() view returns (string)"
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
            
            console.log(`🔐 奖金池MAO授权: ${ethers.utils.formatEther(maoAllowance)} MAO`);
            console.log(`🔐 奖金池PI授权: ${ethers.utils.formatEther(piAllowance)} PI`);
            
            // 安全评估
            console.log("\n🛡️ 安全风险评估:");
            console.log("==================");
            
            if (prizePoolMAO.eq(0) && prizePoolPI.eq(0)) {
                console.log("🚨 高风险: 奖金池已被完全清空！");
            } else if (prizePoolMAO.lt(ethers.utils.parseEther("1000")) || prizePoolPI.lt(ethers.utils.parseEther("10000"))) {
                console.log("⚠️ 中风险: 奖金池余额严重不足");
            } else {
                console.log("✅ 低风险: 奖金池仍有余额");
            }
            
            if (maoAllowance.gt(0) || piAllowance.gt(0)) {
                console.log("🚨 严重风险: 奖金池仍对游戏合约有授权！黑客可能继续盗取！");
            } else {
                console.log("✅ 授权已清除: 奖金池对游戏合约无授权");
            }
            
        } catch (error) {
            console.log(`❌ 奖金池检查失败: ${error.message}`);
        }
        
        // 2. 检查游戏合约控制权
        console.log("\n🎮 游戏合约安全检查:");
        console.log("======================");
        
        try {
            const gameCode = await provider.getCode(CONTRACTS.WHEEL_GAME);
            console.log(`🔍 游戏合约存在: ${gameCode.length > 2 ? '是' : '否'} (${gameCode.length} bytes)`);
            
            // 检查合约是否有owner功能 (需要知道具体的ABI)
            const gameABI = [
                "function owner() view returns (address)",
                "function pause() external",
                "function unpause() external"
            ];
            
            try {
                const gameContract = new ethers.Contract(CONTRACTS.WHEEL_GAME, gameABI, provider);
                const owner = await gameContract.owner();
                console.log(`🔑 游戏合约所有者: ${owner}`);
                
                if (owner.toLowerCase() === CONTRACTS.PRIZE_POOL.toLowerCase()) {
                    console.log("🚨 极高风险: 游戏合约被奖金池钱包控制！黑客可能控制整个游戏！");
                } else {
                    console.log("✅ 相对安全: 游戏合约不被奖金池钱包控制");
                }
            } catch (ownerError) {
                console.log("⚠️ 无法确定游戏合约所有者 (可能没有owner功能)");
            }
            
        } catch (error) {
            console.log(`❌ 游戏合约检查失败: ${error.message}`);
        }
        
        // 3. 检查其他关键钱包
        console.log("\n💼 其他钱包安全检查:");
        console.log("=====================");
        
        const wallets = [
            { name: "营销钱包", address: CONTRACTS.MARKETING_WALLET },
            { name: "销毁地址", address: CONTRACTS.BURN_ADDRESS }
        ];
        
        for (const wallet of wallets) {
            try {
                const maoContract = new ethers.Contract(CONTRACTS.MAO_TOKEN, tokenABI, provider);
                const balance = await maoContract.balanceOf(wallet.address);
                console.log(`${wallet.name}: ${ethers.utils.formatEther(balance)} MAO (${wallet.address.slice(0,10)}...)`);
            } catch (error) {
                console.log(`❌ ${wallet.name}检查失败`);
            }
        }
        
        // 4. 紧急建议
        console.log("\n🚨 紧急处理建议:");
        console.log("==================");
        console.log("1. 立即暂停游戏网站 (如果可能)");
        console.log("2. 撤销奖金池对游戏合约的所有授权");
        console.log("3. 如果您控制游戏合约，立即暂停合约");
        console.log("4. 转移剩余资金到安全地址");
        console.log("5. 部署新的奖金池地址");
        console.log("6. 更新游戏合约配置");
        
        console.log("\n⚠️ 用户安全提醒:");
        console.log("==================");
        console.log("1. 立即通知所有用户停止游戏");
        console.log("2. 发布安全公告");
        console.log("3. 在修复前不要进行任何游戏");
        console.log("4. 考虑补偿受影响用户");
        
        console.log("\n🔧 技术修复步骤:");
        console.log("==================");
        console.log("1. 生成新的安全奖金池地址");
        console.log("2. 更新.env文件中的PRIZE_POOL地址");
        console.log("3. 更新index.html中的奖金池地址");
        console.log("4. 重新部署游戏合约 (如果必要)");
        console.log("5. 进行全面安全测试");
        
    } catch (error) {
        console.error("❌ 紧急检查失败:", error.message);
    }
}

emergencySecurityCheck()
    .then(() => console.log("\n🚨 紧急安全检查完成！请立即采取建议的安全措施！"))
    .catch(console.error); 