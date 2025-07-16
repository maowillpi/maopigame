// 🎯 简单MAO游戏测试 - 找出真正的失败原因
const { ethers } = require("hardhat");

async function simpleMaoTest() {
    console.log("🎯 简单MAO游戏测试开始...");
    
    const CONTRACTS = {
        MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
        WHEEL_GAME: "0x621DF9e0DE6b4e7EDC5Dc22Cd7c0F883c3F56966",
        PRIZE_POOL: "0xE15881Fc413c6cd47a512C24608F94Fa2896b374"
    };
    
    try {
        const [signer] = await ethers.getSigners();
        console.log(`测试账户: ${signer.address}`);
        
        // 1. 检查MAO合约连接
        console.log("\n1️⃣ 检查MAO合约连接...");
        const maoContract = new ethers.Contract(
            CONTRACTS.MAO_TOKEN,
            [
                "function symbol() view returns (string)",
                "function balanceOf(address) view returns (uint256)",
                "function allowance(address,address) view returns (uint256)",
                "function approve(address,uint256) external returns (bool)"
            ],
            signer
        );
        
        const symbol = await maoContract.symbol();
        console.log(`✅ MAO合约连接成功: ${symbol}`);
        
        // 2. 检查余额
        console.log("\n2️⃣ 检查MAO余额...");
        const balance = await maoContract.balanceOf(signer.address);
        const balanceFormatted = ethers.utils.formatEther(balance);
        console.log(`当前余额: ${balanceFormatted} MAO`);
        
        if (balance.lt(ethers.utils.parseEther("100"))) {
            console.log("❌ 余额不足100个MAO，无法继续测试");
            console.log("💡 这就是问题所在：需要至少100个MAO代币");
            return;
        }
        
        // 3. 检查授权
        console.log("\n3️⃣ 检查授权状态...");
        const allowance = await maoContract.allowance(signer.address, CONTRACTS.WHEEL_GAME);
        const allowanceFormatted = ethers.utils.formatEther(allowance);
        console.log(`当前授权: ${allowanceFormatted} MAO`);
        
        if (allowance.lt(ethers.utils.parseEther("100"))) {
            console.log("❌ 授权不足100个MAO");
            console.log("🔧 尝试授权...");
            
            try {
                const approveTx = await maoContract.approve(CONTRACTS.WHEEL_GAME, ethers.constants.MaxUint256);
                console.log(`授权交易哈希: ${approveTx.hash}`);
                await approveTx.wait();
                console.log("✅ 授权成功");
            } catch (approveError) {
                console.log(`❌ 授权失败: ${approveError.message}`);
                return;
            }
        }
        
        // 4. 检查奖金池状态
        console.log("\n4️⃣ 检查奖金池状态...");
        const prizePoolBalance = await maoContract.balanceOf(CONTRACTS.PRIZE_POOL);
        const prizePoolAllowance = await maoContract.allowance(CONTRACTS.PRIZE_POOL, CONTRACTS.WHEEL_GAME);
        
        console.log(`奖金池余额: ${ethers.utils.formatEther(prizePoolBalance)} MAO`);
        console.log(`奖金池授权: ${ethers.utils.formatEther(prizePoolAllowance)} MAO`);
        
        if (prizePoolBalance.eq(0)) {
            console.log("❌ 奖金池余额为0，无法发放奖励");
        }
        if (prizePoolAllowance.eq(0)) {
            console.log("❌ 奖金池授权为0，无法发放奖励");
            console.log("💡 这可能是导致游戏失败的原因！");
        }
        
        // 5. 检查游戏合约
        console.log("\n5️⃣ 检查游戏合约...");
        const gameContract = new ethers.Contract(
            CONTRACTS.WHEEL_GAME,
            ["function playMAOGame() external"],
            signer
        );
        
        // 6. 尝试Gas估算
        console.log("\n6️⃣ 尝试Gas估算...");
        try {
            const gasEstimate = await gameContract.estimateGas.playMAOGame();
            console.log(`✅ Gas估算成功: ${gasEstimate.toString()}`);
            console.log("🎉 所有检查通过，游戏应该可以正常进行！");
        } catch (gasError) {
            console.log(`❌ Gas估算失败: ${gasError.message}`);
            console.log("💡 这就是游戏失败的真正原因！");
            
            // 详细分析错误
            if (gasError.message.includes("Insufficient prize pool allowance")) {
                console.log("🔍 确诊：奖金池授权不足");
            } else if (gasError.message.includes("Insufficient user balance")) {
                console.log("🔍 确诊：用户余额不足");
            } else if (gasError.message.includes("Insufficient user allowance")) {
                console.log("🔍 确诊：用户授权不足");
            } else if (gasError.message.includes("execution reverted")) {
                console.log("🔍 确诊：合约执行被回滚");
            } else {
                console.log(`🔍 其他错误：${gasError.message}`);
            }
        }
        
        // 7. 尝试实际调用（如果用户同意）
        console.log("\n7️⃣ 注意：要进行实际游戏调用，请手动取消注释下面的代码");
        console.log("// const gameTx = await gameContract.playMAOGame();");
        console.log("// await gameTx.wait();");
        console.log("// console.log('🎉 游戏成功！交易哈希:', gameTx.hash);");
        
    } catch (error) {
        console.error("❌ 测试失败:", error.message);
        console.error("完整错误:", error);
    }
}

simpleMaoTest()
    .then(() => console.log("\n✅ 测试完成"))
    .catch(console.error); 