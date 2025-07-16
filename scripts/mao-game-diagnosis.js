const hre = require("hardhat");

// 🔍 MAO游戏代币扣除失败专项诊断
async function diagnoseMaoGameFailure() {
    console.log("🔍 MAO游戏代币扣除失败专项诊断");
    console.log("=".repeat(80));
    
    const CONTRACTS = {
        MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
        PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444", 
        WHEEL_GAME: "0x621DF9e0DE6b4e7EDC5Dc22Cd7c0F883c3F56966",
        PRIZE_POOL: "0xE15881Fc413c6cd47a512C24608F94Fa2896b374"
    };

    try {
        const [signer] = await hre.ethers.getSigners();
        console.log(`🎯 测试账户: ${signer.address}`);
        
        // 🔍 第1步：MAO代币合约深度检查
        console.log("\n🔍 第1步：MAO代币合约深度检查");
        console.log("-".repeat(50));
        
        const maoContract = new hre.ethers.Contract(
            CONTRACTS.MAO_TOKEN,
            [
                "function symbol() view returns (string)",
                "function decimals() view returns (uint8)",
                "function balanceOf(address) view returns (uint256)",
                "function allowance(address,address) view returns (uint256)",
                "function approve(address,uint256) external returns (bool)",
                "function transfer(address,uint256) external returns (bool)"
            ],
            signer
        );
        
        console.log("📝 MAO代币基础信息:");
        const maoSymbol = await maoContract.symbol();
        const maoDecimals = await maoContract.decimals();
        console.log(`  ✅ 符号: ${maoSymbol}`);
        console.log(`  ✅ 精度: ${maoDecimals}`);
        
        console.log("\n📝 用户MAO余额和授权:");
        const userMaoBalance = await maoContract.balanceOf(signer.address);
        const userMaoAllowance = await maoContract.allowance(signer.address, CONTRACTS.WHEEL_GAME);
        
        console.log(`  💰 用户MAO余额: ${hre.ethers.utils.formatEther(userMaoBalance)} MAO`);
        console.log(`  🔐 游戏合约授权: ${hre.ethers.utils.formatEther(userMaoAllowance)} MAO`);
        
        const requiredAmount = hre.ethers.utils.parseEther("100");
        
        if (userMaoBalance.lt(requiredAmount)) {
            console.log(`  🚨 问题发现: 用户MAO余额不足100个!`);
            console.log(`  💡 解决方案: 请先获取足够的MAO代币`);
            return;
        }
        
        if (userMaoAllowance.lt(requiredAmount)) {
            console.log(`  🚨 问题发现: 游戏合约授权不足100个MAO!`);
            console.log(`  💡 这是导致代币无法扣除的主要原因!`);
            
            console.log("\n🔧 尝试自动授权修复:");
            try {
                const approveTx = await maoContract.approve(CONTRACTS.WHEEL_GAME, hre.ethers.constants.MaxUint256, {
                    gasLimit: 100000,
                    gasPrice: hre.ethers.utils.parseUnits('25', 'gwei')
                });
                console.log(`  ✅ 授权交易已提交: ${approveTx.hash}`);
                await approveTx.wait();
                console.log(`  ✅ 授权成功完成!`);
                
                // 重新检查授权
                const newAllowance = await maoContract.allowance(signer.address, CONTRACTS.WHEEL_GAME);
                console.log(`  ✅ 新授权额度: ${hre.ethers.utils.formatEther(newAllowance)} MAO`);
                
            } catch (approveError) {
                console.log(`  ❌ 授权失败: ${approveError.message}`);
            }
        } else {
            console.log(`  ✅ 授权充足，可以进行游戏`);
        }
        
        // 🔍 第2步：游戏合约深度检查
        console.log("\n🔍 第2步：游戏合约深度检查");
        console.log("-".repeat(50));
        
        const gameContract = new hre.ethers.Contract(
            CONTRACTS.WHEEL_GAME,
            [
                "function playMAOGame() external",
                "function getPlayerHistory(address) view returns (tuple(address,uint8,uint256,uint256,uint8,uint256,uint256,bool)[])",
                "function getConsecutiveLosses(address) view returns (uint256)"
            ],
            signer
        );
        
        // 检查合约代码
        const gameCode = await hre.ethers.provider.getCode(CONTRACTS.WHEEL_GAME);
        if (gameCode === "0x") {
            console.log(`🚨 游戏合约不存在!`);
            return;
        }
        console.log(`✅ 游戏合约存在，代码大小: ${gameCode.length / 2 - 1} 字节`);
        
        // 检查历史记录
        console.log("\n📚 用户游戏历史:");
        try {
            const history = await gameContract.getPlayerHistory(signer.address);
            console.log(`  📊 历史记录数量: ${history.length}`);
            
            if (history.length > 0) {
                const lastGame = history[history.length - 1];
                const gameTime = new Date(lastGame.timestamp.toNumber() * 1000);
                console.log(`  📅 最后游戏时间: ${gameTime.toLocaleString()}`);
                console.log(`  🎮 最后游戏类型: ${lastGame.tokenType === 1 ? 'MAO' : 'PI'}`);
                console.log(`  💰 最后游戏投注: ${hre.ethers.utils.formatEther(lastGame.betAmount)}`);
                console.log(`  🎁 最后游戏奖励: ${hre.ethers.utils.formatEther(lastGame.rewardAmount)}`);
            } else {
                console.log(`  📝 暂无游戏历史记录`);
            }
            
            const consecutiveLosses = await gameContract.getConsecutiveLosses(signer.address);
            console.log(`  📊 连败次数: ${consecutiveLosses.toString()}`);
            
        } catch (historyError) {
            console.log(`  ❌ 历史记录查询失败: ${historyError.message}`);
        }
        
        // 🔍 第3步：Gas估算关键测试
        console.log("\n🔍 第3步：Gas估算关键测试 (这是失败的关键点)");
        console.log("-".repeat(50));
        
        try {
            console.log("🎯 尝试MAO游戏Gas估算...");
            const gasEstimate = await gameContract.estimateGas.playMAOGame();
            console.log(`  ✅ Gas估算成功: ${gasEstimate.toString()}`);
            
            const gasPrice = await hre.ethers.provider.getGasPrice();
            const gasCost = gasEstimate.mul(gasPrice);
            console.log(`  💰 预估Gas费用: ${hre.ethers.utils.formatEther(gasCost)} ALV`);
            
            // 检查用户ALV余额
            const alvBalance = await signer.getBalance();
            console.log(`  💳 用户ALV余额: ${hre.ethers.utils.formatEther(alvBalance)} ALV`);
            
            if (alvBalance.lt(gasCost)) {
                console.log(`  🚨 问题发现: ALV余额不足支付Gas费用!`);
                console.log(`  💡 解决方案: 请充值至少 ${hre.ethers.utils.formatEther(gasCost)} ALV`);
            } else {
                console.log(`  ✅ ALV余额充足，可以支付Gas费用`);
            }
            
        } catch (gasError) {
            console.log(`  🚨 Gas估算失败: ${gasError.message}`);
            console.log(`  💡 这就是游戏失败的根本原因!`);
            
            // 详细分析Gas估算失败的原因
            if (gasError.message.includes("insufficient funds")) {
                console.log(`  🔍 诊断: ALV余额不足支付Gas费用`);
            } else if (gasError.message.includes("allowance")) {
                console.log(`  🔍 诊断: MAO代币授权不足`);
            } else if (gasError.message.includes("balance")) {
                console.log(`  🔍 诊断: MAO代币余额不足`);
            } else if (gasError.message.includes("prize pool")) {
                console.log(`  🔍 诊断: 奖金池相关问题`);
            } else if (gasError.message.includes("execution reverted")) {
                console.log(`  🔍 诊断: 智能合约执行被回滚`);
                
                // 尝试静态调用获取详细错误
                try {
                    await gameContract.callStatic.playMAOGame();
                } catch (staticError) {
                    console.log(`  🔍 详细错误信息: ${staticError.message}`);
                    
                    if (staticError.message.includes("Insufficient prize pool allowance")) {
                        console.log(`  🚨 确诊: 奖金池授权不足! 这是关键问题!`);
                    } else if (staticError.message.includes("Insufficient user balance")) {
                        console.log(`  🚨 确诊: 用户MAO余额不足!`);
                    } else if (staticError.message.includes("Insufficient user allowance")) {
                        console.log(`  🚨 确诊: 用户MAO授权不足!`);
                    }
                }
            }
        }
        
        // 🔍 第4步：奖金池深度检查
        console.log("\n🔍 第4步：奖金池深度检查");
        console.log("-".repeat(50));
        
        console.log("📝 奖金池MAO余额和授权:");
        const prizePoolMaoBalance = await maoContract.balanceOf(CONTRACTS.PRIZE_POOL);
        const prizePoolMaoAllowance = await maoContract.allowance(CONTRACTS.PRIZE_POOL, CONTRACTS.WHEEL_GAME);
        
        console.log(`  💰 奖金池MAO余额: ${hre.ethers.utils.formatEther(prizePoolMaoBalance)} MAO`);
        console.log(`  🔐 奖金池→游戏合约授权: ${hre.ethers.utils.formatEther(prizePoolMaoAllowance)} MAO`);
        
        if (prizePoolMaoBalance.eq(0)) {
            console.log(`  🚨 关键问题: 奖金池MAO余额为0! 无法发放奖励!`);
        }
        
        if (prizePoolMaoAllowance.eq(0)) {
            console.log(`  🚨 关键问题: 奖金池MAO授权为0! 这会导致游戏失败!`);
            console.log(`  💡 这可能是导致代币无法扣除的根本原因!`);
        }
        
        // 🔍 第5步：完整游戏流程测试
        console.log("\n🔍 第5步：完整游戏流程测试");
        console.log("-".repeat(50));
        
        console.log("🎮 测试完整MAO游戏流程:");
        
        // 检查所有前置条件
        const checks = [
            { name: "用户MAO余额 >= 100", passed: userMaoBalance.gte(requiredAmount) },
            { name: "用户MAO授权 >= 100", passed: userMaoAllowance.gte(requiredAmount) },
            { name: "奖金池MAO余额 > 0", passed: prizePoolMaoBalance.gt(0) },
            { name: "奖金池MAO授权 > 0", passed: prizePoolMaoAllowance.gt(0) }
        ];
        
        console.log("\n📋 前置条件检查:");
        let allChecksPassed = true;
        checks.forEach((check, i) => {
            const status = check.passed ? '✅' : '❌';
            console.log(`  ${i + 1}. ${status} ${check.name}`);
            if (!check.passed) allChecksPassed = false;
        });
        
        if (!allChecksPassed) {
            console.log(`\n🚨 发现问题: 有前置条件未满足，这是游戏失败的原因!`);
        } else {
            console.log(`\n✅ 所有前置条件都满足，游戏应该可以正常进行`);
        }
        
        // 🎯 总结诊断结果
        console.log("\n🎯 诊断结果总结");
        console.log("=".repeat(80));
        
        console.log(`\n📊 问题排查结果:`);
        if (userMaoBalance.lt(requiredAmount)) {
            console.log(`  🚨 问题1: 用户MAO余额不足 (${hre.ethers.utils.formatEther(userMaoBalance)} < 100)`);
        }
        if (userMaoAllowance.lt(requiredAmount)) {
            console.log(`  🚨 问题2: 用户MAO授权不足 (${hre.ethers.utils.formatEther(userMaoAllowance)} < 100)`);
        }
        if (prizePoolMaoBalance.eq(0)) {
            console.log(`  🚨 问题3: 奖金池MAO余额为0`);
        }
        if (prizePoolMaoAllowance.eq(0)) {
            console.log(`  🚨 问题4: 奖金池MAO授权为0`);
        }
        
        console.log(`\n💡 修复建议:`);
        console.log(`  1. 确保用户MAO余额 >= 100个`);
        console.log(`  2. 确保用户授权游戏合约可以使用MAO代币`);
        console.log(`  3. 确保奖金池有足够的MAO代币`);
        console.log(`  4. 确保奖金池授权游戏合约可以转移MAO代币`);
        console.log(`  5. 确保用户有足够的ALV支付Gas费用`);
        
    } catch (error) {
        console.error("🚨 诊断过程中出现错误:", error);
    }
}

async function main() {
    try {
        await diagnoseMaoGameFailure();
        console.log("\n🎉 MAO游戏诊断完成!");
    } catch (error) {
        console.error("\n💥 诊断失败:", error);
    }
}

if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { diagnoseMaoGameFailure }; 