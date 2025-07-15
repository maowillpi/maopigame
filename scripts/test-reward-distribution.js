// 🧪 测试奖励发放问题
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    console.log("🧪 开始测试奖励发放问题...");
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
            "function allowance(address owner, address spender) external view returns (uint256)",
            "function approve(address spender, uint256 amount) external returns (bool)",
            "function transfer(address to, uint256 amount) external returns (bool)",
            "function transferFrom(address from, address to, uint256 amount) external returns (bool)"
        ];

        // 游戏合约 ABI
        const GAME_ABI = [
            "function playMAOGame() external",
            "function playPIGame() external",
            "function getPlayerHistory(address player) external view returns (tuple(address player, uint8 tokenType, uint256 betAmount, uint256 rewardAmount, uint8 rewardLevel, uint256 timestamp, uint256 randomSeed, bool wasProtected)[])",
            "function getRewardConfig(uint8 tokenType) external view returns (uint256[6] memory)",
            "function getProbabilityRanges() external view returns (uint256[6] memory)",
            "function getPlayerConsecutiveLosses(address player) external view returns (uint256)"
        ];

        // 连接合约
        const maoToken = new ethers.Contract(CONFIG.MAO_TOKEN, ERC20_ABI, signer);
        const piToken = new ethers.Contract(CONFIG.PI_TOKEN, ERC20_ABI, signer);
        const gameContract = new ethers.Contract(CONFIG.NEW_WHEEL_GAME, GAME_ABI, signer);

        // 检查用户余额
        console.log("\n💰 检查用户余额...");
        const userMaoBalance = await maoToken.balanceOf(signer.address);
        const userPiBalance = await piToken.balanceOf(signer.address);
        console.log("用户 MAO 余额:", ethers.formatEther(userMaoBalance));
        console.log("用户 PI 余额:", ethers.formatEther(userPiBalance));

        // 检查奖金池余额
        console.log("\n🏦 检查奖金池余额...");
        const poolMaoBalance = await maoToken.balanceOf(CONFIG.PRIZE_POOL);
        const poolPiBalance = await piToken.balanceOf(CONFIG.PRIZE_POOL);
        console.log("奖金池 MAO 余额:", ethers.formatEther(poolMaoBalance));
        console.log("奖金池 PI 余额:", ethers.formatEther(poolPiBalance));

        // 检查授权额度
        console.log("\n🔓 检查授权额度...");
        const userMaoAllowance = await maoToken.allowance(signer.address, CONFIG.NEW_WHEEL_GAME);
        const userPiAllowance = await piToken.allowance(signer.address, CONFIG.NEW_WHEEL_GAME);
        const poolMaoAllowance = await maoToken.allowance(CONFIG.PRIZE_POOL, CONFIG.NEW_WHEEL_GAME);
        const poolPiAllowance = await piToken.allowance(CONFIG.PRIZE_POOL, CONFIG.NEW_WHEEL_GAME);
        
        console.log("用户 MAO 授权:", ethers.formatEther(userMaoAllowance));
        console.log("用户 PI 授权:", ethers.formatEther(userPiAllowance));
        console.log("奖金池 MAO 授权:", ethers.formatEther(poolMaoAllowance));
        console.log("奖金池 PI 授权:", ethers.formatEther(poolPiAllowance));

        // 检查连败次数
        console.log("\n🔄 检查连败次数...");
        const consecutiveLosses = await gameContract.getPlayerConsecutiveLosses(signer.address);
        console.log("连败次数:", consecutiveLosses.toString());

        // 检查游戏历史
        console.log("\n📊 检查游戏历史...");
        const playerHistory = await gameContract.getPlayerHistory(signer.address);
        console.log("历史游戏次数:", playerHistory.length);
        
        if (playerHistory.length > 0) {
            const lastGame = playerHistory[playerHistory.length - 1];
            console.log("最后一局:");
            console.log("  奖励等级:", lastGame.rewardLevel);
            console.log("  奖励金额:", ethers.formatEther(lastGame.rewardAmount));
            console.log("  是否保护:", lastGame.wasProtected);
        }

        // 如果用户余额不足，先给用户一些代币进行测试
        if (Number(ethers.formatEther(userMaoBalance)) < 100) {
            console.log("\n⚠️ 用户MAO余额不足，需要充值进行测试");
            console.log("建议从其他账户转入MAO代币");
        }

        if (Number(ethers.formatEther(userPiBalance)) < 1000) {
            console.log("\n⚠️ 用户PI余额不足，需要充值进行测试");
            console.log("建议从其他账户转入PI代币");
        }

        // 检查用户是否需要授权
        if (Number(ethers.formatEther(userMaoAllowance)) < 100) {
            console.log("\n🔓 用户需要授权MAO代币...");
            const approveTx = await maoToken.approve(CONFIG.NEW_WHEEL_GAME, ethers.parseEther("10000"));
            await approveTx.wait();
            console.log("✅ MAO授权完成");
        }

        if (Number(ethers.formatEther(userPiAllowance)) < 1000) {
            console.log("\n🔓 用户需要授权PI代币...");
            const approveTx = await piToken.approve(CONFIG.NEW_WHEEL_GAME, ethers.parseEther("100000"));
            await approveTx.wait();
            console.log("✅ PI授权完成");
        }

        // 测试MAO游戏
        if (Number(ethers.formatEther(userMaoBalance)) >= 100) {
            console.log("\n🎮 测试MAO游戏...");
            try {
                const gameTx = await gameContract.playMAOGame();
                console.log("游戏交易哈希:", gameTx.hash);
                console.log("⏳ 等待交易确认...");
                
                const receipt = await gameTx.wait();
                console.log("✅ MAO游戏成功完成!");
                
                // 检查游戏结果
                const newHistory = await gameContract.getPlayerHistory(signer.address);
                if (newHistory.length > playerHistory.length) {
                    const latestGame = newHistory[newHistory.length - 1];
                    console.log("🎯 游戏结果:");
                    console.log("  奖励等级:", latestGame.rewardLevel);
                    console.log("  奖励金额:", ethers.formatEther(latestGame.rewardAmount), "MAO");
                    console.log("  随机数:", latestGame.randomSeed.toString());
                    console.log("  是否保护:", latestGame.wasProtected);
                    
                    if (latestGame.rewardLevel > 0) {
                        console.log("🎉 恭喜中奖！奖励已发放");
                    } else {
                        console.log("😅 谢谢惠顾，再接再厉");
                    }
                }
                
            } catch (error) {
                console.error("❌ MAO游戏失败:", error.message);
                console.error("错误详情:", error);
                
                // 分析错误原因
                if (error.message.includes("Insufficient prize pool allowance")) {
                    console.log("🔍 问题诊断: 奖金池授权不足");
                    console.log("解决方案: 重新执行奖金池授权");
                } else if (error.message.includes("Reward transfer failed")) {
                    console.log("🔍 问题诊断: 奖励转账失败");
                    console.log("可能原因: 奖金池余额不足或授权问题");
                } else if (error.message.includes("Insufficient MAO balance")) {
                    console.log("🔍 问题诊断: 用户MAO余额不足");
                } else if (error.message.includes("Insufficient MAO allowance")) {
                    console.log("🔍 问题诊断: 用户MAO授权不足");
                }
            }
        }

        // 测试PI游戏
        if (Number(ethers.formatEther(userPiBalance)) >= 1000) {
            console.log("\n🎮 测试PI游戏...");
            try {
                const gameTx = await gameContract.playPIGame();
                console.log("游戏交易哈希:", gameTx.hash);
                console.log("⏳ 等待交易确认...");
                
                const receipt = await gameTx.wait();
                console.log("✅ PI游戏成功完成!");
                
                // 检查游戏结果
                const newHistory = await gameContract.getPlayerHistory(signer.address);
                const latestGame = newHistory[newHistory.length - 1];
                console.log("🎯 游戏结果:");
                console.log("  奖励等级:", latestGame.rewardLevel);
                console.log("  奖励金额:", ethers.formatEther(latestGame.rewardAmount), "PI");
                console.log("  随机数:", latestGame.randomSeed.toString());
                console.log("  是否保护:", latestGame.wasProtected);
                
                if (latestGame.rewardLevel > 0) {
                    console.log("🎉 恭喜中奖！奖励已发放");
                } else {
                    console.log("😅 谢谢惠顾，再接再厉");
                }
                
            } catch (error) {
                console.error("❌ PI游戏失败:", error.message);
                console.error("错误详情:", error);
                
                // 分析错误原因
                if (error.message.includes("Insufficient prize pool allowance")) {
                    console.log("🔍 问题诊断: 奖金池授权不足");
                    console.log("解决方案: 重新执行奖金池授权");
                } else if (error.message.includes("Reward transfer failed")) {
                    console.log("🔍 问题诊断: 奖励转账失败");
                    console.log("可能原因: 奖金池余额不足或授权问题");
                }
            }
        }

        console.log("\n🎯 测试完成！");

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