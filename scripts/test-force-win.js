// 🎯 强制中奖测试 - 通过连败保护机制
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    console.log("🎯 开始强制中奖测试...");
    console.log("============================================================");

    // 合约配置
    const CONFIG = {
        MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
        PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444",
        NEW_WHEEL_GAME: "0x621DF9e0DE6b4e7EDC5Dc22Cd7c0F883c3F56966",
        PRIZE_POOL: "0xE15881Fc413c6cd47a512C24608F94Fa2896b374"
    };

    try {
        // 获取签名者
        const [signer] = await ethers.getSigners();
        console.log("📝 测试账户:", signer.address);

        // ERC20 ABI
        const ERC20_ABI = [
            "function balanceOf(address account) external view returns (uint256)",
            "function allowance(address owner, address spender) external view returns (uint256)"
        ];

        // 游戏合约 ABI
        const GAME_ABI = [
            "function playMAOGame() external",
            "function playPIGame() external",
            "function getPlayerHistory(address player) external view returns (tuple(address player, uint8 tokenType, uint256 betAmount, uint256 rewardAmount, uint8 rewardLevel, uint256 timestamp, uint256 randomSeed, bool wasProtected)[])",
            "function getPlayerConsecutiveLosses(address player) external view returns (uint256)",
            "function getProbabilityRanges() external view returns (uint256[6] memory)"
        ];

        // 连接合约
        const maoToken = new ethers.Contract(CONFIG.MAO_TOKEN, ERC20_ABI, signer);
        const piToken = new ethers.Contract(CONFIG.PI_TOKEN, ERC20_ABI, signer);
        const gameContract = new ethers.Contract(CONFIG.NEW_WHEEL_GAME, GAME_ABI, signer);

        // 检查概率配置
        console.log("\n🎯 检查概率配置...");
        const probabilityRanges = await gameContract.getProbabilityRanges();
        console.log("概率区间:", probabilityRanges.map(r => r.toString()));
        
        // 计算实际概率
        const probabilities = [];
        for (let i = 0; i < probabilityRanges.length; i++) {
            if (i === 0) {
                probabilities.push(Number(probabilityRanges[i]) / 100);
            } else {
                probabilities.push((Number(probabilityRanges[i]) - Number(probabilityRanges[i-1])) / 100);
            }
        }
        
        console.log("实际概率分布:");
        const labels = ["谢谢惠顾", "小奖", "中奖", "大奖", "超级大奖", "终极大奖"];
        probabilities.forEach((prob, index) => {
            console.log(`  ${labels[index]}: ${prob}%`);
        });

        // 检查初始连败次数
        let consecutiveLosses = await gameContract.getPlayerConsecutiveLosses(signer.address);
        console.log("\n🔄 初始连败次数:", consecutiveLosses.toString());

        // 检查余额
        const initialMaoBalance = await maoToken.balanceOf(signer.address);
        const initialPiBalance = await piToken.balanceOf(signer.address);
        console.log("\n💰 初始余额:");
        console.log("MAO:", ethers.formatEther(initialMaoBalance));
        console.log("PI:", ethers.formatEther(initialPiBalance));

        // 连续玩游戏直到触发连败保护（最多6次）
        console.log("\n🎮 开始连续游戏测试...");
        console.log("目标：触发连败保护机制（5次连败后强制中奖）");
        
        let gameCount = 0;
        let hasWon = false;
        const maxGames = 8; // 最多玩8局

        while (gameCount < maxGames && !hasWon) {
            gameCount++;
            consecutiveLosses = await gameContract.getPlayerConsecutiveLosses(signer.address);
            
            console.log(`\n🎲 第${gameCount}局游戏 (连败次数: ${consecutiveLosses})`);
            
            try {
                // 玩MAO游戏
                const gameTx = await gameContract.playMAOGame();
                console.log("交易哈希:", gameTx.hash);
                
                const receipt = await gameTx.wait();
                console.log("✅ 游戏完成");
                
                // 检查游戏结果
                const playerHistory = await gameContract.getPlayerHistory(signer.address);
                const latestGame = playerHistory[playerHistory.length - 1];
                
                console.log("🎯 游戏结果:");
                console.log("  奖励等级:", latestGame.rewardLevel.toString());
                console.log("  奖励金额:", ethers.formatEther(latestGame.rewardAmount), "MAO");
                console.log("  随机数:", latestGame.randomSeed.toString());
                console.log("  是否保护:", latestGame.wasProtected);
                
                if (latestGame.rewardLevel > 0) {
                    console.log("🎉 中奖了！");
                    hasWon = true;
                    
                    if (latestGame.wasProtected) {
                        console.log("🔒 连败保护机制触发！");
                    }
                } else {
                    console.log("😅 谢谢惠顾");
                }
                
            } catch (error) {
                console.error(`❌ 第${gameCount}局游戏失败:`, error.message);
                
                // 详细分析错误
                if (error.message.includes("Insufficient prize pool allowance")) {
                    console.log("🔍 问题确认: 奖金池授权不足！");
                    console.log("这就是中奖时出现问题的原因！");
                    
                    // 检查当前授权状态
                    const currentAllowance = await maoToken.allowance(CONFIG.PRIZE_POOL, CONFIG.NEW_WHEEL_GAME);
                    console.log("当前奖金池MAO授权:", ethers.formatEther(currentAllowance));
                    
                    console.log("💡 解决方案: 重新执行奖金池授权");
                    console.log("   npx hardhat run scripts/authorize-prize-pool.js --network alvey");
                    
                    break;
                } else if (error.message.includes("Reward transfer failed")) {
                    console.log("🔍 问题确认: 奖励转账失败！");
                    console.log("可能原因: 奖金池余额不足或合约权限问题");
                    
                    // 检查奖金池余额
                    const poolBalance = await maoToken.balanceOf(CONFIG.PRIZE_POOL);
                    console.log("奖金池MAO余额:", ethers.formatEther(poolBalance));
                    
                    break;
                } else {
                    console.log("🔍 其他错误:", error.message);
                }
            }
            
            // 短暂延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // 检查最终余额
        const finalMaoBalance = await maoToken.balanceOf(signer.address);
        const finalPiBalance = await piToken.balanceOf(signer.address);
        
        console.log("\n💰 最终余额:");
        console.log("MAO:", ethers.formatEther(finalMaoBalance));
        console.log("PI:", ethers.formatEther(finalPiBalance));
        
        console.log("\n📊 余额变化:");
        console.log("MAO变化:", ethers.formatEther(finalMaoBalance - initialMaoBalance));
        console.log("PI变化:", ethers.formatEther(finalPiBalance - initialPiBalance));

        // 检查最终连败次数
        const finalConsecutiveLosses = await gameContract.getPlayerConsecutiveLosses(signer.address);
        console.log("\n🔄 最终连败次数:", finalConsecutiveLosses.toString());

        // 总结
        console.log("\n📋 测试总结:");
        console.log("总游戏次数:", gameCount);
        console.log("是否中奖:", hasWon ? "是" : "否");
        console.log("连败保护:", finalConsecutiveLosses.toString() === "0" && hasWon ? "已触发" : "未触发");

        if (!hasWon && gameCount >= maxGames) {
            console.log("⚠️ 注意: 连续" + gameCount + "局都没中奖，这在50%中奖率下是不正常的");
            console.log("可能的问题:");
            console.log("1. 随机数生成有偏差");
            console.log("2. 概率配置有问题");
            console.log("3. 网络或合约状态问题");
        }

        console.log("\n🎯 强制中奖测试完成！");

    } catch (error) {
        console.error("❌ 测试过程中出现错误:", error);
        throw error;
    }
}

// 运行测试脚本
if (require.main === module) {
    main()
        .then(() => {
            console.log("\n✅ 测试完成！");
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 测试失败:", error);
            process.exit(1);
        });
}

module.exports = main; 