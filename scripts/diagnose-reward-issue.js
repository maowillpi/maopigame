// 🔍 奖励发放问题诊断脚本
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    console.log("🔍 开始诊断奖励发放问题...");
    console.log("============================================================");

    // 合约配置
    const CONFIG = {
        MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
        PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444",
        NEW_WHEEL_GAME: "0x621DF9e0DE6b4e7EDC5Dc22Cd7c0F883c3F56966", // 新的修正版合约
        PRIZE_POOL: "0xE15881Fc413c6cd47a512C24608F94Fa2896b374"
    };

    console.log("📊 检查配置:");
    console.log("游戏合约:", CONFIG.NEW_WHEEL_GAME);
    console.log("奖金池:", CONFIG.PRIZE_POOL);
    console.log("MAO代币:", CONFIG.MAO_TOKEN);
    console.log("PI代币:", CONFIG.PI_TOKEN);

    try {
        // 获取签名者
        const [signer] = await ethers.getSigners();
        console.log("\n📝 当前签名者:", signer.address);

        // ERC20 ABI
        const ERC20_ABI = [
            "function balanceOf(address account) external view returns (uint256)",
            "function allowance(address owner, address spender) external view returns (uint256)",
            "function symbol() external view returns (string)",
            "function decimals() external view returns (uint8)"
        ];

        // 游戏合约 ABI（关键函数）
        const GAME_ABI = [
            "function getProbabilityRanges() external view returns (uint256[6] memory)",
            "function getRewardConfig(uint8 tokenType) external view returns (uint256[6] memory)",
            "function prizePool() external view returns (address)",
            "function maoToken() external view returns (address)",
            "function piToken() external view returns (address)",
            "function getContractBalance(address token) external view returns (uint256)",
            "function getPrizePoolBalance(address token) external view returns (uint256)"
        ];

        // 连接合约
        console.log("\n🔗 连接合约...");
        const maoToken = new ethers.Contract(CONFIG.MAO_TOKEN, ERC20_ABI, signer);
        const piToken = new ethers.Contract(CONFIG.PI_TOKEN, ERC20_ABI, signer);
        const gameContract = new ethers.Contract(CONFIG.NEW_WHEEL_GAME, GAME_ABI, signer);

        // 1. 检查奖金池余额
        console.log("\n💰 检查奖金池余额...");
        const maoBalance = await maoToken.balanceOf(CONFIG.PRIZE_POOL);
        const piBalance = await piToken.balanceOf(CONFIG.PRIZE_POOL);
        
        console.log("奖金池 MAO 余额:", ethers.formatEther(maoBalance));
        console.log("奖金池 PI 余额:", ethers.formatEther(piBalance));

        // 2. 检查授权额度
        console.log("\n🔓 检查授权额度...");
        const maoAllowance = await maoToken.allowance(CONFIG.PRIZE_POOL, CONFIG.NEW_WHEEL_GAME);
        const piAllowance = await piToken.allowance(CONFIG.PRIZE_POOL, CONFIG.NEW_WHEEL_GAME);
        
        console.log("MAO 授权额度:", ethers.formatEther(maoAllowance));
        console.log("PI 授权额度:", ethers.formatEther(piAllowance));

        // 3. 检查奖励配置
        console.log("\n🎁 检查奖励配置...");
        const maoRewards = await gameContract.getRewardConfig(0);
        const piRewards = await gameContract.getRewardConfig(1);
        
        console.log("MAO 奖励配置:");
        maoRewards.forEach((reward, index) => {
            const labels = ["谢谢惠顾", "小奖", "中奖", "大奖", "超级大奖", "终极大奖"];
            console.log(`  ${labels[index]}: ${ethers.formatEther(reward)} MAO`);
        });

        console.log("PI 奖励配置:");
        piRewards.forEach((reward, index) => {
            const labels = ["谢谢惠顾", "小奖", "中奖", "大奖", "超级大奖", "终极大奖"];
            console.log(`  ${labels[index]}: ${ethers.formatEther(reward)} PI`);
        });

        // 4. 检查概率配置
        console.log("\n🎯 检查概率配置...");
        const probabilityRanges = await gameContract.getProbabilityRanges();
        console.log("概率区间:", probabilityRanges.map(r => r.toString()));

        // 5. 检查合约内部余额
        console.log("\n📦 检查合约内部余额...");
        try {
            const contractMaoBalance = await gameContract.getContractBalance(CONFIG.MAO_TOKEN);
            const contractPiBalance = await gameContract.getContractBalance(CONFIG.PI_TOKEN);
            console.log("合约内 MAO 余额:", ethers.formatEther(contractMaoBalance));
            console.log("合约内 PI 余额:", ethers.formatEther(contractPiBalance));
        } catch (error) {
            console.log("无法获取合约内部余额:", error.message);
        }

        // 6. 奖励发放能力分析
        console.log("\n🔍 奖励发放能力分析...");
        
        // 检查最大奖励是否超过授权额度
        const maxMaoReward = Math.max(...maoRewards.map(r => Number(ethers.formatEther(r))));
        const maxPiReward = Math.max(...piRewards.map(r => Number(ethers.formatEther(r))));
        
        console.log("最大 MAO 奖励:", maxMaoReward);
        console.log("最大 PI 奖励:", maxPiReward);
        console.log("MAO 授权额度:", Number(ethers.formatEther(maoAllowance)));
        console.log("PI 授权额度:", Number(ethers.formatEther(piAllowance)));

        // 7. 问题诊断
        console.log("\n🚨 问题诊断结果:");
        console.log("============================================================");

        let hasIssues = false;

        // 检查奖金池余额是否充足
        if (Number(ethers.formatEther(maoBalance)) < maxMaoReward) {
            console.log("❌ 奖金池 MAO 余额不足以支付最大奖励");
            hasIssues = true;
        } else {
            console.log("✅ 奖金池 MAO 余额充足");
        }

        if (Number(ethers.formatEther(piBalance)) < maxPiReward) {
            console.log("❌ 奖金池 PI 余额不足以支付最大奖励");
            hasIssues = true;
        } else {
            console.log("✅ 奖金池 PI 余额充足");
        }

        // 检查授权额度是否充足
        if (Number(ethers.formatEther(maoAllowance)) < maxMaoReward) {
            console.log("❌ MAO 授权额度不足以支付最大奖励");
            hasIssues = true;
        } else {
            console.log("✅ MAO 授权额度充足");
        }

        if (Number(ethers.formatEther(piAllowance)) < maxPiReward) {
            console.log("❌ PI 授权额度不足以支付最大奖励");
            hasIssues = true;
        } else {
            console.log("✅ PI 授权额度充足");
        }

        // 检查授权额度是否为0
        if (Number(ethers.formatEther(maoAllowance)) === 0) {
            console.log("❌ MAO 授权额度为0 - 这是主要问题！");
            hasIssues = true;
        }

        if (Number(ethers.formatEther(piAllowance)) === 0) {
            console.log("❌ PI 授权额度为0 - 这是主要问题！");
            hasIssues = true;
        }

        // 8. 解决方案建议
        console.log("\n💡 解决方案建议:");
        console.log("============================================================");

        if (hasIssues) {
            console.log("🔧 需要执行以下修复步骤:");
            
            if (Number(ethers.formatEther(maoAllowance)) === 0) {
                console.log("1. 重新授权 MAO 代币:");
                console.log("   npx hardhat run scripts/authorize-prize-pool.js --network alvey");
            }
            
            if (Number(ethers.formatEther(piAllowance)) === 0) {
                console.log("2. 重新授权 PI 代币:");
                console.log("   npx hardhat run scripts/authorize-prize-pool.js --network alvey");
            }
            
            console.log("3. 验证修复结果:");
            console.log("   npx hardhat run scripts/diagnose-reward-issue.js --network alvey");
        } else {
            console.log("✅ 所有检查通过，奖励发放机制正常");
            console.log("如果仍有问题，可能是前端调用或网络问题");
        }

        // 9. 保存诊断结果
        const diagnosticResult = {
            timestamp: new Date().toISOString(),
            prizePoolBalances: {
                mao: ethers.formatEther(maoBalance),
                pi: ethers.formatEther(piBalance)
            },
            allowances: {
                mao: ethers.formatEther(maoAllowance),
                pi: ethers.formatEther(piAllowance)
            },
            maxRewards: {
                mao: maxMaoReward,
                pi: maxPiReward
            },
            hasIssues: hasIssues,
            issues: []
        };

        if (Number(ethers.formatEther(maoAllowance)) === 0) {
            diagnosticResult.issues.push("MAO授权额度为0");
        }
        if (Number(ethers.formatEther(piAllowance)) === 0) {
            diagnosticResult.issues.push("PI授权额度为0");
        }

        console.log("\n💾 保存诊断结果...");
        const fs = require('fs');
        fs.writeFileSync(
            'REWARD_ISSUE_DIAGNOSIS.json',
            JSON.stringify(diagnosticResult, null, 2)
        );

        console.log("\n🎯 诊断完成!");
        return diagnosticResult;

    } catch (error) {
        console.error("❌ 诊断过程中出现错误:", error);
        throw error;
    }
}

// 运行诊断脚本
if (require.main === module) {
    main()
        .then((result) => {
            if (result.hasIssues) {
                console.log("\n🚨 发现问题，请按照建议修复！");
                process.exit(1);
            } else {
                console.log("\n✅ 诊断完成，系统正常！");
                process.exit(0);
            }
        })
        .catch((error) => {
            console.error("💥 诊断失败:", error);
            process.exit(1);
        });
}

module.exports = main; 