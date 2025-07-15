const hre = require("hardhat");

// 🎯 智能网络诊断 - 逐步深入发现问题
async function smartNetworkDiagnosis() {
    console.log("🎯 启动智能网络诊断系统...");
    console.log("=".repeat(80));
    
    const CONTRACTS = {
        MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
        PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444", 
        WHEEL_GAME: "0x621DF9e0DE6b4e7EDC5Dc22Cd7c0F883c3F56966"
    };

    const RPC_NODES = [
        { name: "core2", url: "https://elves-core2.alvey.io/" },
        { name: "core3", url: "https://elves-core3.alvey.io/" },
        { name: "core1", url: "https://elves-core1.alvey.io/" }
    ];

    try {
        // 🔍 第1步：基础网络连通性测试
        console.log("\n🔍 第1步：基础网络连通性测试");
        console.log("-".repeat(50));
        
        let workingProvider = null;
        let bestRpc = null;
        
        for (const rpc of RPC_NODES) {
            console.log(`\n测试 ${rpc.name}: ${rpc.url}`);
            try {
                // 创建简单的fetch测试，设置短超时
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                
                const startTime = Date.now();
                const response = await fetch(rpc.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'eth_blockNumber',
                        params: [],
                        id: 1
                    }),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                const responseTime = Date.now() - startTime;
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.result) {
                        const blockNumber = parseInt(data.result, 16);
                        console.log(`  ✅ 连接成功! 响应时间: ${responseTime}ms, 区块: ${blockNumber}`);
                        
                        if (!bestRpc || responseTime < bestRpc.responseTime) {
                            bestRpc = { ...rpc, responseTime, blockNumber };
                        }
                    }
                } else {
                    console.log(`  ❌ HTTP错误: ${response.status}`);
                }
                
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log(`  ❌ 连接超时 (>5秒)`);
                } else {
                    console.log(`  ❌ 连接失败: ${error.message}`);
                }
            }
        }
        
        if (!bestRpc) {
            console.log("🚨 所有RPC节点都无法连接！这是网络问题的根源！");
            console.log("💡 可能的解决方案:");
            console.log("   1. 检查网络连接");
            console.log("   2. 检查防火墙设置");
            console.log("   3. 尝试使用VPN");
            console.log("   4. 联系网络提供商");
            return;
        }
        
        console.log(`\n🏆 最佳RPC节点: ${bestRpc.name} (${bestRpc.responseTime}ms)`);
        
        // 🔍 第2步：使用最佳节点创建provider
        console.log("\n🔍 第2步：创建区块链连接");
        console.log("-".repeat(50));
        
        try {
            // 使用工作的RPC创建provider
            workingProvider = new hre.ethers.providers.JsonRpcProvider(bestRpc.url);
            
            // 测试基本功能
            const blockNumber = await workingProvider.getBlockNumber();
            const network = await workingProvider.getNetwork();
            
            console.log(`✅ Provider创建成功`);
            console.log(`✅ 当前区块: ${blockNumber}`);
            console.log(`✅ 网络ID: ${network.chainId}`);
            
            if (network.chainId !== 3797) {
                console.log(`⚠️  警告: 网络ID不正确! 期望3797，实际${network.chainId}`);
            }
            
        } catch (error) {
            console.log(`❌ Provider创建失败: ${error.message}`);
            return;
        }
        
        // 🔍 第3步：获取测试账户
        console.log("\n🔍 第3步：获取测试账户");
        console.log("-".repeat(50));
        
        let signer;
        try {
            [signer] = await hre.ethers.getSigners();
            console.log(`✅ 测试账户: ${signer.address}`);
            
            // 检查账户余额
            const balance = await signer.getBalance();
            console.log(`✅ ALV余额: ${hre.ethers.utils.formatEther(balance)} ALV`);
            
            if (balance.eq(0)) {
                console.log(`⚠️  警告: ALV余额为0，可能无法支付Gas费用`);
            }
            
        } catch (error) {
            console.log(`❌ 获取账户失败: ${error.message}`);
            return;
        }
        
        // 🔍 第4步：测试代币合约
        console.log("\n🔍 第4步：测试代币合约");
        console.log("-".repeat(50));
        
        try {
            console.log("\n📝 MAO代币测试:");
            const maoContract = new hre.ethers.Contract(
                CONTRACTS.MAO_TOKEN,
                ["function symbol() view returns (string)", "function balanceOf(address) view returns (uint256)"],
                signer
            );
            
            const maoSymbol = await maoContract.symbol();
            const maoBalance = await maoContract.balanceOf(signer.address);
            
            console.log(`  ✅ 符号: ${maoSymbol}`);
            console.log(`  ✅ 余额: ${hre.ethers.utils.formatEther(maoBalance)} MAO`);
            
            console.log("\n📝 PI代币测试:");
            const piContract = new hre.ethers.Contract(
                CONTRACTS.PI_TOKEN,
                ["function symbol() view returns (string)", "function balanceOf(address) view returns (uint256)"],
                signer
            );
            
            const piSymbol = await piContract.symbol();
            const piBalance = await piContract.balanceOf(signer.address);
            
            console.log(`  ✅ 符号: ${piSymbol}`);
            console.log(`  ✅ 余额: ${hre.ethers.utils.formatEther(piBalance)} PI`);
            
        } catch (error) {
            console.log(`❌ 代币合约测试失败: ${error.message}`);
        }
        
        // 🔍 第5步：游戏合约关键测试
        console.log("\n🔍 第5步：游戏合约关键测试");
        console.log("-".repeat(50));
        
        try {
            // 检查合约是否存在
            const gameCode = await workingProvider.getCode(CONTRACTS.WHEEL_GAME);
            if (gameCode === "0x") {
                console.log(`❌ 游戏合约不存在: ${CONTRACTS.WHEEL_GAME}`);
                return;
            }
            console.log(`✅ 游戏合约存在, 代码大小: ${gameCode.length / 2 - 1} 字节`);
            
            // 创建游戏合约
            const gameContract = new hre.ethers.Contract(
                CONTRACTS.WHEEL_GAME,
                [
                    "function playMAOGame() external",
                    "function getPlayerHistory(address) view returns (tuple(address,uint8,uint256,uint256,uint8,uint256,uint256,bool)[])"
                ],
                signer
            );
            
            // 测试只读函数
            console.log("\n📚 测试游戏历史查询:");
            try {
                const history = await gameContract.getPlayerHistory(signer.address);
                console.log(`  ✅ 历史查询成功: ${history.length} 条记录`);
            } catch (historyError) {
                console.log(`  ❌ 历史查询失败: ${historyError.message}`);
            }
            
            // 🚨 关键测试：Gas估算
            console.log("\n🎯 关键测试：MAO游戏Gas估算");
            try {
                const gasEstimate = await gameContract.estimateGas.playMAOGame();
                console.log(`  ✅ Gas估算成功: ${gasEstimate.toString()}`);
                console.log(`  🎉 游戏合约功能正常！问题可能在前端！`);
                
                // 计算预估费用
                const gasPrice = await workingProvider.getGasPrice();
                const estimatedCost = gasEstimate.mul(gasPrice);
                console.log(`  💰 预估费用: ${hre.ethers.utils.formatEther(estimatedCost)} ALV`);
                
            } catch (gasError) {
                console.log(`  ❌ Gas估算失败: ${gasError.message}`);
                console.log(`  🚨 这就是游戏失败的根本原因！`);
                
                // 详细分析错误
                if (gasError.message.includes("insufficient funds")) {
                    console.log(`  💡 诊断: 余额不足`);
                } else if (gasError.message.includes("allowance")) {
                    console.log(`  💡 诊断: 授权不足`);
                } else if (gasError.message.includes("prize pool")) {
                    console.log(`  💡 诊断: 奖金池问题`);
                } else if (gasError.message.includes("execution reverted")) {
                    console.log(`  💡 诊断: 合约执行被回滚`);
                    
                    // 尝试获取更详细的错误信息
                    try {
                        await gameContract.callStatic.playMAOGame();
                    } catch (staticError) {
                        console.log(`  🔍 详细错误: ${staticError.message}`);
                    }
                }
            }
            
        } catch (error) {
            console.log(`❌ 游戏合约测试失败: ${error.message}`);
        }
        
        // 🎯 第6步：诊断结论
        console.log("\n🎯 诊断结论");
        console.log("=".repeat(80));
        
        console.log(`\n🌐 网络状态:`);
        console.log(`  🏆 推荐RPC: ${bestRpc.name} - ${bestRpc.url}`);
        console.log(`  ⚡ 响应时间: ${bestRpc.responseTime}ms`);
        console.log(`  🔗 区块高度: ${bestRpc.blockNumber}`);
        
        console.log(`\n💡 修复建议:`);
        console.log(`  1. 前端应该使用: ${bestRpc.url}`);
        console.log(`  2. 设置合理的超时时间: 10-30秒`);
        console.log(`  3. 实现智能RPC切换机制`);
        console.log(`  4. 增加连接重试逻辑`);
        
    } catch (error) {
        console.error("🚨 诊断过程出错:", error);
    }
}

async function main() {
    try {
        await smartNetworkDiagnosis();
        console.log("\n🎉 智能诊断完成！");
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

module.exports = { smartNetworkDiagnosis }; 