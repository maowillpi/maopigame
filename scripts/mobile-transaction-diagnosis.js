const hre = require("hardhat");

async function main() {
    console.log("📱 移动端交易诊断开始...");
    console.log("============================================================");
    
    // 合约地址配置
    const CONTRACTS = {
        WHEEL_GAME: "0x621DF9e0DE6b4e7EDC5Dc22Cd7c0F883c3F56966",
        MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
        PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444"
    };
    
    const provider = hre.ethers.provider;
    const [signer] = await hre.ethers.getSigners();
    
    console.log("📝 测试账户:", signer.address);
    console.log("🔗 合约地址:", CONTRACTS.WHEEL_GAME);
    
    // 1. 检查网络连接
    console.log("\n🌐 网络检查...");
    try {
        const network = await provider.getNetwork();
        console.log("✅ 网络 ID:", network.chainId);
        console.log("✅ 网络名称:", network.name);
        
        const blockNumber = await provider.getBlockNumber();
        console.log("✅ 当前区块:", blockNumber);
    } catch (error) {
        console.log("❌ 网络连接失败:", error.message);
        return;
    }
    
    // 2. 检查账户状态
    console.log("\n💰 账户状态检查...");
    try {
        const alvBalance = await provider.getBalance(signer.address);
        console.log("ALV余额:", hre.ethers.utils.formatEther(alvBalance));
        
        if (alvBalance.lt(hre.ethers.utils.parseEther("0.01"))) {
            console.log("⚠️ 警告: ALV余额可能不足以支付Gas费用");
        }
        
        // 检查代币余额
        const maoContract = new hre.ethers.Contract(
            CONTRACTS.MAO_TOKEN,
            ["function balanceOf(address) view returns (uint256)"],
            signer
        );
        
        const piContract = new hre.ethers.Contract(
            CONTRACTS.PI_TOKEN,
            ["function balanceOf(address) view returns (uint256)"],
            signer
        );
        
        const maoBalance = await maoContract.balanceOf(signer.address);
        const piBalance = await piContract.balanceOf(signer.address);
        
        console.log("MAO余额:", hre.ethers.utils.formatEther(maoBalance));
        console.log("PI余额:", hre.ethers.utils.formatEther(piBalance));
        
        if (maoBalance.lt(hre.ethers.utils.parseEther("100"))) {
            console.log("⚠️ 警告: MAO余额不足100进行游戏");
        }
        
        if (piBalance.lt(hre.ethers.utils.parseEther("1000"))) {
            console.log("⚠️ 警告: PI余额不足1000进行游戏");
        }
        
    } catch (error) {
        console.log("❌ 账户检查失败:", error.message);
    }
    
    // 3. 检查合约状态
    console.log("\n🎮 合约状态检查...");
    try {
        const gameContract = new hre.ethers.Contract(
            CONTRACTS.WHEEL_GAME,
            [
                "function playMAOGame() external",
                "function playPIGame() external",
                "function getConsecutiveLosses(address player) external view returns (uint256)"
            ],
            signer
        );
        
        const consecutiveLosses = await gameContract.getConsecutiveLosses(signer.address);
        console.log("✅ 连败次数:", consecutiveLosses.toString());
        
        // 检查合约代码是否存在
        const code = await provider.getCode(CONTRACTS.WHEEL_GAME);
        if (code === "0x") {
            console.log("❌ 错误: 合约地址无代码");
            return;
        } else {
            console.log("✅ 合约代码存在");
        }
        
    } catch (error) {
        console.log("❌ 合约检查失败:", error.message);
        console.log("🔍 这表明合约调用有问题，可能是:");
        console.log("  - 合约ABI不匹配");
        console.log("  - 合约函数不存在");
        console.log("  - 合约内部错误");
    }
    
    // 4. 检查授权状态
    console.log("\n🔓 授权状态检查...");
    try {
        const maoContract = new hre.ethers.Contract(
            CONTRACTS.MAO_TOKEN,
            ["function allowance(address,address) view returns (uint256)"],
            signer
        );
        
        const piContract = new hre.ethers.Contract(
            CONTRACTS.PI_TOKEN,
            ["function allowance(address,address) view returns (uint256)"],
            signer
        );
        
        const maoAllowance = await maoContract.allowance(signer.address, CONTRACTS.WHEEL_GAME);
        const piAllowance = await piContract.allowance(signer.address, CONTRACTS.WHEEL_GAME);
        
        console.log("MAO授权额度:", hre.ethers.utils.formatEther(maoAllowance));
        console.log("PI授权额度:", hre.ethers.utils.formatEther(piAllowance));
        
        if (maoAllowance.lt(hre.ethers.utils.parseEther("100"))) {
            console.log("⚠️ 需要MAO授权");
        }
        
        if (piAllowance.lt(hre.ethers.utils.parseEther("1000"))) {
            console.log("⚠️ 需要PI授权");
        }
        
    } catch (error) {
        console.log("❌ 授权检查失败:", error.message);
    }
    
    // 5. 测试游戏交易（仅估算Gas，不实际执行）
    console.log("\n🎲 测试游戏交易(仅估算)...");
    try {
        const gameContract = new hre.ethers.Contract(
            CONTRACTS.WHEEL_GAME,
            ["function playMAOGame() external"],
            signer
        );
        
        const gasEstimate = await gameContract.estimateGas.playMAOGame();
        console.log("✅ MAO游戏Gas估算:", gasEstimate.toString());
        
        // 计算预估费用
        const gasPrice = await provider.getGasPrice();
        const estimatedCost = gasEstimate.mul(gasPrice);
        console.log("💰 预估交易费用:", hre.ethers.utils.formatEther(estimatedCost), "ALV");
        
    } catch (error) {
        console.log("❌ 游戏交易估算失败:", error.message);
        console.log("🔍 这可能是导致前端交易失败的原因");
        
        // 详细错误分析
        if (error.message.includes("execution reverted")) {
            console.log("💡 分析: 合约执行被回滚");
            console.log("可能原因:");
            console.log("  - 奖金池授权不足");
            console.log("  - 奖金池余额不足");
            console.log("  - 代币授权不足");
            console.log("  - 合约内部逻辑错误");
        } else if (error.message.includes("insufficient funds")) {
            console.log("💡 分析: 账户资金不足");
        } else if (error.message.includes("gas")) {
            console.log("💡 分析: Gas相关问题");
        }
    }
    
    // 6. 检查最近交易历史
    console.log("\n📋 检查最近交易历史...");
    try {
        const latestBlock = await provider.getBlockNumber();
        const fromBlock = Math.max(0, latestBlock - 1000); // 最近1000个区块
        
        const filter = {
            address: CONTRACTS.WHEEL_GAME,
            fromBlock: fromBlock,
            toBlock: latestBlock
        };
        
        const logs = await provider.getLogs(filter);
        console.log(`✅ 最近${logs.length}条合约交互记录`);
        
        if (logs.length > 0) {
            console.log("📊 最近活动:");
            const recentLogs = logs.slice(-5); // 最近5条
            for (const log of recentLogs) {
                console.log(`  区块 ${log.blockNumber}: 交易 ${log.transactionHash.slice(0, 10)}...`);
            }
        }
        
    } catch (error) {
        console.log("⚠️ 无法获取交易历史:", error.message);
    }
    
    console.log("\n============================================================");
    console.log("📱 移动端诊断完成！");
    console.log("💡 主要发现:");
    console.log("   - 合约检查失败可能表明合约配置有问题");
    console.log("   - 建议检查合约ABI是否与部署的合约匹配");
    console.log("   - 可能需要重新部署或使用正确的合约地址");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("诊断脚本执行失败:", error);
        process.exit(1);
    }); 