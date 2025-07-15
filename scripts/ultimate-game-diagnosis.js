const hre = require("hardhat");

// 🔥 终极游戏诊断系统 - 最顶级的问题发现和解决方案
async function ultimateGameDiagnosis() {
    console.log("🔥 启动终极游戏诊断系统...");
    console.log("=" .repeat(80));
    
    const CONTRACTS = {
        MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
        PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444", 
        WHEEL_GAME: "0x621DF9e0DE6b4e7EDC5Dc22Cd7c0F883c3F56966"
    };

    const RPC_NODES = [
        'https://elves-core2.alvey.io',
        'https://elves-core3.alvey.io', 
        'https://elves-core1.alvey.io'
    ];

    try {
        const [signer] = await hre.ethers.getSigners();
        console.log(`🎯 测试账户: ${signer.address}`);
        
        // 🔍 第1步：RPC节点全面诊断
        console.log("\n🔍 第1步：RPC节点深度诊断");
        console.log("-".repeat(50));
        
        const nodeResults = [];
        for (let i = 0; i < RPC_NODES.length; i++) {
            const rpcUrl = RPC_NODES[i];
            console.log(`\n测试节点 ${i + 1}: ${rpcUrl}`);
            
            try {
                const provider = new hre.ethers.providers.JsonRpcProvider({
                    url: rpcUrl,
                    timeout: 10000
                });
                
                const startTime = Date.now();
                
                // 基础连接测试
                const blockNumber = await provider.getBlockNumber();
                const network = await provider.getNetwork();
                
                // 合约调用测试
                const maoContract = new hre.ethers.Contract(
                    CONTRACTS.MAO_TOKEN,
                    ["function symbol() view returns (string)"],
                    provider
                );
                const symbol = await maoContract.symbol();
                
                const responseTime = Date.now() - startTime;
                
                nodeResults.push({
                    index: i,
                    url: rpcUrl,
                    working: true,
                    blockNumber,
                    chainId: network.chainId,
                    responseTime,
                    symbol
                });
                
                console.log(`  ✅ 响应时间: ${responseTime}ms`);
                console.log(`  ✅ 区块高度: ${blockNumber}`);
                console.log(`  ✅ 网络ID: ${network.chainId}`);
                console.log(`  ✅ MAO合约: ${symbol}`);
                
            } catch (error) {
                console.log(`  ❌ 节点失败: ${error.message}`);
                nodeResults.push({
                    index: i,
                    url: rpcUrl,
                    working: false,
                    error: error.message
                });
            }
        }
        
        // 分析最佳节点
        const workingNodes = nodeResults.filter(n => n.working);
        if (workingNodes.length === 0) {
            throw new Error("🚨 所有RPC节点都无法工作！这是主要问题！");
        }
        
        const bestNode = workingNodes.sort((a, b) => a.responseTime - b.responseTime)[0];
        console.log(`\n🏆 最佳节点: ${bestNode.url} (${bestNode.responseTime}ms)`);
        
        // 🔍 第2步：智能合约深度验证
        console.log("\n🔍 第2步：智能合约深度验证");
        console.log("-".repeat(50));
        
        const provider = hre.ethers.provider;
        
        // 验证MAO合约
        console.log("\n📝 MAO合约验证:");
        try {
            const maoContract = new hre.ethers.Contract(
                CONTRACTS.MAO_TOKEN,
                [
                    "function symbol() view returns (string)",
                    "function decimals() view returns (uint8)",
                    "function balanceOf(address) view returns (uint256)",
                    "function allowance(address,address) view returns (uint256)"
                ],
                signer
            );
            
            const maoSymbol = await maoContract.symbol();
            const maoDecimals = await maoContract.decimals();
            const maoBalance = await maoContract.balanceOf(signer.address);
            const maoAllowance = await maoContract.allowance(signer.address, CONTRACTS.WHEEL_GAME);
            
            console.log(`  ✅ 符号: ${maoSymbol}`);
            console.log(`  ✅ 精度: ${maoDecimals}`);
            console.log(`  ✅ 余额: ${hre.ethers.utils.formatEther(maoBalance)} MAO`);
            console.log(`  ✅ 授权: ${hre.ethers.utils.formatEther(maoAllowance)} MAO`);
            
            if (maoBalance.lt(hre.ethers.utils.parseEther("100"))) {
                console.log(`  ⚠️  警告: MAO余额不足100个进行游戏`);
            }
            
        } catch (error) {
            console.log(`  ❌ MAO合约错误: ${error.message}`);
        }
        
        // 验证PI合约
        console.log("\n📝 PI合约验证:");
        try {
            const piContract = new hre.ethers.Contract(
                CONTRACTS.PI_TOKEN,
                [
                    "function symbol() view returns (string)",
                    "function decimals() view returns (uint8)",
                    "function balanceOf(address) view returns (uint256)",
                    "function allowance(address,address) view returns (uint256)"
                ],
                signer
            );
            
            const piSymbol = await piContract.symbol();
            const piDecimals = await piContract.decimals();
            const piBalance = await piContract.balanceOf(signer.address);
            const piAllowance = await piContract.allowance(signer.address, CONTRACTS.WHEEL_GAME);
            
            console.log(`  ✅ 符号: ${piSymbol}`);
            console.log(`  ✅ 精度: ${piDecimals}`);
            console.log(`  ✅ 余额: ${hre.ethers.utils.formatEther(piBalance)} PI`);
            console.log(`  ✅ 授权: ${hre.ethers.utils.formatEther(piAllowance)} PI`);
            
            if (piBalance.lt(hre.ethers.utils.parseEther("1000"))) {
                console.log(`  ⚠️  警告: PI余额不足1000个进行游戏`);
            }
            
        } catch (error) {
            console.log(`  ❌ PI合约错误: ${error.message}`);
        }
        
        // 🔍 第3步：游戏合约终极验证
        console.log("\n🔍 第3步：游戏合约终极验证");
        console.log("-".repeat(50));
        
        try {
            // 检查合约代码是否存在
            const gameContractCode = await provider.getCode(CONTRACTS.WHEEL_GAME);
            if (gameContractCode === "0x") {
                throw new Error("🚨 游戏合约不存在！合约地址错误！");
            }
            console.log(`✅ 游戏合约代码存在，大小: ${gameContractCode.length / 2 - 1} 字节`);
            
            // 创建游戏合约实例
            const gameContract = new hre.ethers.Contract(
                CONTRACTS.WHEEL_GAME,
                [
                    "function playMAOGame() external",
                    "function playPIGame() external",
                    "function getPlayerHistory(address player) external view returns (tuple(address player, uint8 tokenType, uint256 betAmount, uint256 rewardAmount, uint8 rewardLevel, uint256 timestamp, uint256 randomSeed, bool wasProtected)[])",
                    "function getConsecutiveLosses(address player) external view returns (uint256)"
                ],
                signer
            );
            
            // 读取游戏历史
            console.log("\n📚 游戏历史查询:");
            const history = await gameContract.getPlayerHistory(signer.address);
            console.log(`  ✅ 历史记录数量: ${history.length}`);
            
            if (history.length > 0) {
                const lastGame = history[history.length - 1];
                console.log(`  📅 最后游戏时间: ${new Date(lastGame.timestamp.toNumber() * 1000).toLocaleString()}`);
                console.log(`  💰 最后奖励: ${hre.ethers.utils.formatEther(lastGame.rewardAmount)}`);
            }
            
            // 检查连败次数
            const consecutiveLosses = await gameContract.getConsecutiveLosses(signer.address);
            console.log(`  📊 连败次数: ${consecutiveLosses.toString()}`);
            
        } catch (error) {
            console.log(`❌ 游戏合约验证失败: ${error.message}`);
            console.log(`🔍 详细错误:`, error);
            
            // 深度错误分析
            if (error.message.includes("execution reverted")) {
                console.log(`💡 分析: 合约执行被回滚，可能原因:`);
                console.log(`   - 合约内部逻辑错误`);
                console.log(`   - 权限不足`);
                console.log(`   - 状态不满足条件`);
            }
        }
        
        // 🔍 第4步：Gas费用深度分析
        console.log("\n🔍 第4步：Gas费用深度分析");
        console.log("-".repeat(50));
        
        try {
            const gasPrice = await provider.getGasPrice();
            console.log(`💰 当前Gas价格: ${hre.ethers.utils.formatUnits(gasPrice, 'gwei')} Gwei`);
            
            // 估算MAO游戏Gas
            try {
                const gameContract = new hre.ethers.Contract(
                    CONTRACTS.WHEEL_GAME,
                    ["function playMAOGame() external"],
                    signer
                );
                
                const maoGasEstimate = await gameContract.estimateGas.playMAOGame();
                const maoGasCost = maoGasEstimate.mul(gasPrice);
                
                console.log(`🎮 MAO游戏Gas估算: ${maoGasEstimate.toString()}`);
                console.log(`💸 MAO游戏费用: ${hre.ethers.utils.formatEther(maoGasCost)} ALV`);
                
            } catch (gasError) {
                console.log(`❌ MAO游戏Gas估算失败: ${gasError.message}`);
                
                // 这里是关键！如果Gas估算失败，游戏就会失败
                if (gasError.message.includes("execution reverted")) {
                    console.log(`🚨 关键问题发现: Gas估算失败意味着交易会失败！`);
                    console.log(`🔍 可能原因:`);
                    console.log(`   - 余额不足`);
                    console.log(`   - 授权不足`);
                    console.log(`   - 合约状态异常`);
                    console.log(`   - 奖金池问题`);
                }
            }
            
        } catch (error) {
            console.log(`❌ Gas分析失败: ${error.message}`);
        }
        
        // 🔍 第5步：奖金池状态检查
        console.log("\n🔍 第5步：奖金池状态深度检查");
        console.log("-".repeat(50));
        
        // 这是最关键的检查！
        try {
            const PRIZE_POOL = "0xE15881Fc413c6cd47a512C24608F94Fa2896b374"; // 从配置中获取
            
            const maoContract = new hre.ethers.Contract(
                CONTRACTS.MAO_TOKEN,
                [
                    "function balanceOf(address) view returns (uint256)",
                    "function allowance(address,address) view returns (uint256)"
                ],
                signer
            );
            
            const piContract = new hre.ethers.Contract(
                CONTRACTS.PI_TOKEN,
                [
                    "function balanceOf(address) view returns (uint256)",
                    "function allowance(address,address) view returns (uint256)"
                ],
                signer
            );
            
            // 检查奖金池余额
            const prizePoolMaoBalance = await maoContract.balanceOf(PRIZE_POOL);
            const prizePoolPiBalance = await piContract.balanceOf(PRIZE_POOL);
            
            console.log(`💰 奖金池MAO余额: ${hre.ethers.utils.formatEther(prizePoolMaoBalance)}`);
            console.log(`💰 奖金池PI余额: ${hre.ethers.utils.formatEther(prizePoolPiBalance)}`);
            
            // 检查奖金池授权给游戏合约
            const maoAllowanceToGame = await maoContract.allowance(PRIZE_POOL, CONTRACTS.WHEEL_GAME);
            const piAllowanceToGame = await piContract.allowance(PRIZE_POOL, CONTRACTS.WHEEL_GAME);
            
            console.log(`🔐 奖金池→游戏合约 MAO授权: ${hre.ethers.utils.formatEther(maoAllowanceToGame)}`);
            console.log(`🔐 奖金池→游戏合约 PI授权: ${hre.ethers.utils.formatEther(piAllowanceToGame)}`);
            
            // 关键检查：如果奖金池授权不足，游戏会失败！
            if (maoAllowanceToGame.eq(0)) {
                console.log(`🚨 关键问题发现: 奖金池MAO授权为0！这会导致游戏失败！`);
            }
            if (piAllowanceToGame.eq(0)) {
                console.log(`🚨 关键问题发现: 奖金池PI授权为0！这会导致游戏失败！`);
            }
            
            if (prizePoolMaoBalance.eq(0)) {
                console.log(`🚨 关键问题发现: 奖金池MAO余额为0！无法发放奖励！`);
            }
            if (prizePoolPiBalance.eq(0)) {
                console.log(`🚨 关键问题发现: 奖金池PI余额为0！无法发放奖励！`);
            }
            
        } catch (error) {
            console.log(`❌ 奖金池检查失败: ${error.message}`);
        }
        
        // 🔍 第6步：完整游戏流程模拟
        console.log("\n🔍 第6步：完整游戏流程模拟测试");
        console.log("-".repeat(50));
        
        try {
            // 模拟完整的游戏流程，但不实际执行
            console.log("🎮 模拟MAO游戏流程:");
            
            const maoContract = new hre.ethers.Contract(
                CONTRACTS.MAO_TOKEN,
                [
                    "function balanceOf(address) view returns (uint256)",
                    "function allowance(address,address) view returns (uint256)",
                    "function approve(address,uint256) external returns (bool)"
                ],
                signer
            );
            
            const gameContract = new hre.ethers.Contract(
                CONTRACTS.WHEEL_GAME,
                ["function playMAOGame() external"],
                signer
            );
            
            // 1. 检查用户余额
            const userBalance = await maoContract.balanceOf(signer.address);
            const requiredAmount = hre.ethers.utils.parseEther("100");
            
            if (userBalance.lt(requiredAmount)) {
                console.log(`  ❌ 用户余额不足: ${hre.ethers.utils.formatEther(userBalance)} < 100 MAO`);
                return;
            }
            console.log(`  ✅ 用户余额充足: ${hre.ethers.utils.formatEther(userBalance)} MAO`);
            
            // 2. 检查用户授权
            const userAllowance = await maoContract.allowance(signer.address, CONTRACTS.WHEEL_GAME);
            if (userAllowance.lt(requiredAmount)) {
                console.log(`  ⚠️  用户授权不足: ${hre.ethers.utils.formatEther(userAllowance)} < 100 MAO`);
                console.log(`  🔧 需要授权操作`);
            } else {
                console.log(`  ✅ 用户授权充足: ${hre.ethers.utils.formatEther(userAllowance)} MAO`);
            }
            
            // 3. 尝试Gas估算（关键测试点）
            try {
                const gasEstimate = await gameContract.estimateGas.playMAOGame();
                console.log(`  ✅ Gas估算成功: ${gasEstimate.toString()}`);
                
                // 如果能够成功估算Gas，说明游戏逻辑基本正常
                console.log(`  🎯 游戏合约基本功能正常`);
                
            } catch (estimateError) {
                console.log(`  ❌ Gas估算失败: ${estimateError.message}`);
                console.log(`  🚨 这是导致游戏失败的根本原因！`);
                
                // 详细分析Gas估算失败的原因
                if (estimateError.message.includes("Insufficient prize pool allowance")) {
                    console.log(`  💡 确诊: 奖金池授权不足！`);
                } else if (estimateError.message.includes("Insufficient")) {
                    console.log(`  💡 确诊: 某种资源不足！`);
                } else if (estimateError.message.includes("execution reverted")) {
                    console.log(`  💡 确诊: 合约执行被回滚！`);
                }
            }
            
        } catch (error) {
            console.log(`❌ 游戏流程模拟失败: ${error.message}`);
        }
        
        // 🎯 第7步：问题总结和解决方案
        console.log("\n🎯 终极诊断结果");
        console.log("=".repeat(80));
        
        console.log(`\n📊 RPC节点状态:`);
        nodeResults.forEach((node, i) => {
            if (node.working) {
                console.log(`  节点${i+1}: ✅ ${node.url} (${node.responseTime}ms)`);
            } else {
                console.log(`  节点${i+1}: ❌ ${node.url} - ${node.error}`);
            }
        });
        
        console.log(`\n🎮 推荐最优配置:`);
        console.log(`  🏆 主要RPC: ${bestNode.url}`);
        console.log(`  ⚡ 响应时间: ${bestNode.responseTime}ms`);
        console.log(`  🔗 区块高度: ${bestNode.blockNumber}`);
        
    } catch (error) {
        console.error("🚨 终极诊断过程中出现严重错误:", error);
        throw error;
    }
}

// 执行终极诊断
async function main() {
    try {
        await ultimateGameDiagnosis();
        console.log("\n🎉 终极诊断完成！");
    } catch (error) {
        console.error("\n💥 终极诊断失败:", error);
        process.exit(1);
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

module.exports = { ultimateGameDiagnosis }; 