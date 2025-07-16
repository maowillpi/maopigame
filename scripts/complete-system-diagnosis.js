// 🔍 完整系统诊断 - 检查所有配置和合约状态
const { ethers } = require("hardhat");

async function completeSystemDiagnosis() {
    console.log("🔍 开始完整系统诊断...\n");
    
    // 配置信息对比
    const CONFIG = {
        // 用户提供的正确配置
        CORRECT: {
            NETWORK_NAME: "AlveyChain",
            RPC_URLS: [
                "https://elves-core1.alvey.io/",
                "https://elves-core2.alvey.io/",
                "https://elves-core3.alvey.io/"
            ],
            CHAIN_ID: 3797,
            CURRENCY: "ALV",
            EXPLORER: "https://alveyscan.com/",
            MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
            PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444",
            MARKETING_WALLET: "0x861A48051eFaA1876D4B38904516C9F7bbCca36d",
            PRIZE_POOL: "0xE15881Fc413c6cd47a512C24608F94Fa2896b374",
            GAME_COSTS: { MAO: 100, PI: 1000 },
            DISTRIBUTION: { BURN: "15%", MARKETING: "15%", PRIZE_POOL: "70%" }
        },
        // 当前.env文件配置
        ENV_FILE: {
            MAO_TOKEN: process.env.MAO_TOKEN_ADDRESS,
            PI_TOKEN: process.env.PI_TOKEN_ADDRESS,
            WHEEL_GAME: process.env.WHEEL_GAME_ADDRESS,
            RPC_URL: process.env.ALVEY_RPC_URL,
            CHAIN_ID: process.env.ALVEY_CHAIN_ID
        }
    };

    // index.html中的配置
    const INDEX_HTML_CONFIG = {
        MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
        PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444", 
        WHEEL_GAME: "0x621DF9e0DE6b4e7EDC5Dc22Cd7c0F883c3F56966"
    };

    console.log("📋 配置信息对比:");
    console.log("================");
    console.log("1. MAO代币地址:");
    console.log(`   正确配置: ${CONFIG.CORRECT.MAO_TOKEN}`);
    console.log(`   .env文件: ${CONFIG.ENV_FILE.MAO_TOKEN}`);
    console.log(`   index.html: ${INDEX_HTML_CONFIG.MAO_TOKEN}`);
    console.log(`   ✅ 一致性: ${CONFIG.CORRECT.MAO_TOKEN === CONFIG.ENV_FILE.MAO_TOKEN && CONFIG.CORRECT.MAO_TOKEN === INDEX_HTML_CONFIG.MAO_TOKEN ? '是' : '否'}`);
    
    console.log("\n2. PI代币地址:");
    console.log(`   正确配置: ${CONFIG.CORRECT.PI_TOKEN}`);
    console.log(`   .env文件: ${CONFIG.ENV_FILE.PI_TOKEN}`);
    console.log(`   index.html: ${INDEX_HTML_CONFIG.PI_TOKEN}`);
    console.log(`   ✅ 一致性: ${CONFIG.CORRECT.PI_TOKEN === CONFIG.ENV_FILE.PI_TOKEN && CONFIG.CORRECT.PI_TOKEN === INDEX_HTML_CONFIG.PI_TOKEN ? '是' : '否'}`);
    
    console.log("\n3. 游戏合约地址:");
    console.log(`   .env文件: ${CONFIG.ENV_FILE.WHEEL_GAME}`);
    console.log(`   index.html: ${INDEX_HTML_CONFIG.WHEEL_GAME}`);
    console.log(`   ❌ 一致性: ${CONFIG.ENV_FILE.WHEEL_GAME === INDEX_HTML_CONFIG.WHEEL_GAME ? '是' : '否'}`);
    
    if (CONFIG.ENV_FILE.WHEEL_GAME !== INDEX_HTML_CONFIG.WHEEL_GAME) {
        console.log("   🚨 发现问题：游戏合约地址不一致！");
    }

    try {
        console.log("\n🔗 网络连接测试:");
        console.log("=================");
        
        const [signer] = await ethers.getSigners();
        console.log(`测试账户: ${signer.address}`);
        
        const provider = signer.provider;
        const network = await provider.getNetwork();
        console.log(`当前网络ID: ${network.chainId}`);
        console.log(`期望网络ID: ${CONFIG.CORRECT.CHAIN_ID}`);
        console.log(`✅ 网络正确: ${network.chainId === CONFIG.CORRECT.CHAIN_ID ? '是' : '否'}`);

        // 测试所有RPC节点
        console.log("\n🌐 RPC节点测试:");
        console.log("================");
        
        for (let i = 0; i < CONFIG.CORRECT.RPC_URLS.length; i++) {
            const rpcUrl = CONFIG.CORRECT.RPC_URLS[i];
            try {
                const response = await fetch(rpcUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'eth_blockNumber',
                        params: [],
                        id: 1
                    }),
                    signal: AbortSignal.timeout(10000)
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`✅ RPC${i+1} ${rpcUrl}: 正常 (区块: ${parseInt(data.result, 16)})`);
                } else {
                    console.log(`❌ RPC${i+1} ${rpcUrl}: HTTP ${response.status}`);
                }
            } catch (error) {
                console.log(`❌ RPC${i+1} ${rpcUrl}: ${error.message}`);
            }
        }

        console.log("\n🔍 合约状态检查:");
        console.log("=================");

        // 检查MAO合约
        try {
            const maoContract = new ethers.Contract(
                CONFIG.CORRECT.MAO_TOKEN,
                ["function symbol() view returns (string)", "function balanceOf(address) view returns (uint256)"],
                signer
            );
            
            const maoSymbol = await maoContract.symbol();
            const maoBalance = await maoContract.balanceOf(signer.address);
            console.log(`✅ MAO合约: ${maoSymbol} | 测试账户余额: ${ethers.utils.formatEther(maoBalance)}`);
        } catch (error) {
            console.log(`❌ MAO合约检查失败: ${error.message}`);
        }

        // 检查PI合约
        try {
            const piContract = new ethers.Contract(
                CONFIG.CORRECT.PI_TOKEN,
                ["function symbol() view returns (string)", "function balanceOf(address) view returns (uint256)"],
                signer
            );
            
            const piSymbol = await piContract.symbol();
            const piBalance = await piContract.balanceOf(signer.address);
            console.log(`✅ PI合约: ${piSymbol} | 测试账户余额: ${ethers.utils.formatEther(piBalance)}`);
        } catch (error) {
            console.log(`❌ PI合约检查失败: ${error.message}`);
        }

        // 检查游戏合约 (.env版本)
        console.log("\n🎮 游戏合约检查:");
        console.log("=================");
        
        if (CONFIG.ENV_FILE.WHEEL_GAME) {
            try {
                const code = await provider.getCode(CONFIG.ENV_FILE.WHEEL_GAME);
                console.log(`📋 .env游戏合约 ${CONFIG.ENV_FILE.WHEEL_GAME}:`);
                console.log(`   合约代码长度: ${code.length > 2 ? '存在' : '不存在'}`);
            } catch (error) {
                console.log(`❌ .env游戏合约检查失败: ${error.message}`);
            }
        }

        // 检查游戏合约 (index.html版本)
        try {
            const code = await provider.getCode(INDEX_HTML_CONFIG.WHEEL_GAME);
            console.log(`📋 index.html游戏合约 ${INDEX_HTML_CONFIG.WHEEL_GAME}:`);
            console.log(`   合约代码长度: ${code.length > 2 ? '存在' : '不存在'}`);
        } catch (error) {
            console.log(`❌ index.html游戏合约检查失败: ${error.message}`);
        }

        // 检查关键钱包
        console.log("\n💰 关键钱包检查:");
        console.log("=================");

        const wallets = [
            { name: "营销钱包", address: CONFIG.CORRECT.MARKETING_WALLET },
            { name: "奖金池钱包", address: CONFIG.CORRECT.PRIZE_POOL }
        ];

        for (const wallet of wallets) {
            try {
                const alvBalance = await provider.getBalance(wallet.address);
                const maoContract = new ethers.Contract(
                    CONFIG.CORRECT.MAO_TOKEN,
                    ["function balanceOf(address) view returns (uint256)"],
                    signer
                );
                const maoBalance = await maoContract.balanceOf(wallet.address);
                
                console.log(`${wallet.name} (${wallet.address}):`);
                console.log(`   ALV余额: ${ethers.utils.formatEther(alvBalance)}`);
                console.log(`   MAO余额: ${ethers.utils.formatEther(maoBalance)}`);
            } catch (error) {
                console.log(`❌ ${wallet.name}检查失败: ${error.message}`);
            }
        }

        // 检查销毁地址 (0x000...)
        console.log("\n🔥 销毁统计:");
        console.log("=============");
        try {
            const burnAddress = "0x000000000000000000000000000000000000dEaD";
            const maoContract = new ethers.Contract(
                CONFIG.CORRECT.MAO_TOKEN,
                ["function balanceOf(address) view returns (uint256)"],
                signer
            );
            const burnedMAO = await maoContract.balanceOf(burnAddress);
            console.log(`🔥 已销毁MAO总量: ${ethers.utils.formatEther(burnedMAO)}`);
        } catch (error) {
            console.log(`❌ 销毁统计查询失败: ${error.message}`);
        }

        console.log("\n📊 总结和建议:");
        console.log("===============");
        console.log("1. 如果游戏合约地址不一致，需要统一地址");
        console.log("2. 如果测试账户余额为0，需要充值MAO代币");
        console.log("3. 如果奖金池余额为0，需要先给奖金池充值");
        console.log("4. 检查所有RPC节点的连接状态");
        console.log("5. 确认游戏合约是否已正确部署");

    } catch (error) {
        console.error("❌ 诊断过程出错:", error.message);
    }
}

completeSystemDiagnosis()
    .then(() => console.log("\n🎯 诊断完成！"))
    .catch(console.error); 