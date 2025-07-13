// 🔍 检查所有合约地址的游戏记录
require('dotenv').config();
const { ethers } = require("ethers");

// 配置
const CONFIG = {
    RPC_URLS: [
        'https://elves-core2.alvey.io/',
        'https://elves-core3.alvey.io/',
        'https://elves-core1.alvey.io/'
    ],
    CONTRACTS: {
        // 发现的所有合约地址
        WHEEL_GAME_V1: '0xA9E4FD96B29e4f512a0a75E402C156B04D6E6c35',
        WHEEL_GAME_V2: '0xB677DBcA76061E6301272c83179c8243A4eeB6A5',
        WHEEL_GAME_V3: '0xc27e29BCe41db77815435a9415329424849Daeb6',
        MAO_TOKEN: '0x22f49bcb3dad370a9268ba3fca33cb037ca3d022',
        PI_TOKEN: '0xfd4680e25e05b3435c7f698668d1ce80d2a9f444'
    },
    MARKETING_WALLET: '0x861A48051eFaA1876D4B38904516C9F7bbCca36d'
};

// 创建provider
async function createProvider() {
    for (const rpcUrl of CONFIG.RPC_URLS) {
        try {
            const provider = new ethers.JsonRpcProvider(rpcUrl);
            await provider.getBlockNumber();
            console.log(`✅ 连接到 ${rpcUrl}`);
            return provider;
        } catch (error) {
            console.log(`❌ 连接失败: ${rpcUrl}`);
            continue;
        }
    }
    throw new Error('❌ 所有RPC连接失败');
}

// 检查单个合约的配置和游戏记录
async function checkContract(provider, contractAddress, contractName) {
    try {
        console.log(`\n🔍 检查 ${contractName} (${contractAddress})...`);
        
        const gameABI = [
            "function marketingWallet() view returns (address)",
            "function prizePool() view returns (address)",
            "function maoToken() view returns (address)",
            "function piToken() view returns (address)",
            "event GamePlayed(address indexed player, uint8 tokenType, uint256 betAmount, uint256 rewardAmount, uint8 rewardLevel, uint256 randomSeed)"
        ];
        
        const gameContract = new ethers.Contract(contractAddress, gameABI, provider);
        
        // 检查合约是否存在
        try {
            const code = await provider.getCode(contractAddress);
            if (code === '0x') {
                console.log(`❌ 合约不存在或未部署`);
                return { exists: false, events: [] };
            }
        } catch (error) {
            console.log(`❌ 无法访问合约: ${error.message}`);
            return { exists: false, events: [] };
        }
        
        // 检查合约配置
        try {
            const marketingWallet = await gameContract.marketingWallet();
            const prizePool = await gameContract.prizePool();
            const maoToken = await gameContract.maoToken();
            const piToken = await gameContract.piToken();
            
            console.log(`📊 合约配置:`);
            console.log(`   营销钱包: ${marketingWallet}`);
            console.log(`   奖金池: ${prizePool}`);
            console.log(`   MAO代币: ${maoToken}`);
            console.log(`   PI代币: ${piToken}`);
            
            // 检查营销钱包是否匹配
            const isCorrectWallet = marketingWallet.toLowerCase() === CONFIG.MARKETING_WALLET.toLowerCase();
            console.log(`   营销钱包配置: ${isCorrectWallet ? '✅ 正确' : '❌ 错误'}`);
            
        } catch (error) {
            console.log(`⚠️ 无法读取合约配置: ${error.message}`);
        }
        
        // 检查游戏记录
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = currentBlock - 50000; // 检查最近50000个区块
        
        console.log(`🔍 搜索游戏记录 (区块 ${fromBlock} - ${currentBlock})...`);
        
        const filter = gameContract.filters.GamePlayed();
        const events = await gameContract.queryFilter(filter, fromBlock, currentBlock);
        
        console.log(`📊 找到 ${events.length} 个游戏事件`);
        
        if (events.length > 0) {
            console.log(`\n📋 最近的游戏记录:`);
            events.slice(-3).forEach((event, index) => {
                const { player, tokenType, betAmount, rewardAmount, rewardLevel } = event.args;
                const tokenName = tokenType === 0 ? 'MAO' : 'PI';
                const betValue = ethers.formatEther(betAmount);
                const rewardValue = ethers.formatEther(rewardAmount);
                
                console.log(`   ${index + 1}. 玩家: ${player.slice(0, 10)}...`);
                console.log(`      代币: ${tokenName}, 投注: ${betValue}, 奖励: ${rewardValue}, 等级: ${rewardLevel}`);
                console.log(`      区块: ${event.blockNumber}, 交易: ${event.transactionHash}`);
            });
            
            // 分析营销钱包收益
            await analyzeMarketingWalletRevenue(events, contractName);
        }
        
        return { exists: true, events, contractName };
        
    } catch (error) {
        console.error(`❌ 检查合约失败: ${error.message}`);
        return { exists: false, events: [] };
    }
}

// 分析营销钱包收益
async function analyzeMarketingWalletRevenue(events, contractName) {
    try {
        console.log(`\n💰 分析 ${contractName} 的营销钱包收益...`);
        
        let expectedMAO = 0;
        let expectedPI = 0;
        
        events.forEach(event => {
            const { tokenType, betAmount } = event.args;
            const betValue = parseFloat(ethers.formatEther(betAmount));
            
            if (tokenType === 0) { // MAO
                expectedMAO += betValue * 0.2; // 20%营销费用
            } else { // PI
                expectedPI += betValue * 0.2; // 20%营销费用
            }
        });
        
        console.log(`📊 基于游戏记录的期望营销收益:`);
        console.log(`   MAO: ${expectedMAO.toFixed(2)}`);
        console.log(`   PI: ${expectedPI.toFixed(2)}`);
        
        return { expectedMAO, expectedPI };
        
    } catch (error) {
        console.error(`❌ 分析营销钱包收益失败: ${error.message}`);
        return { expectedMAO: 0, expectedPI: 0 };
    }
}

// 检查营销钱包余额
async function checkMarketingWalletBalance(provider) {
    try {
        console.log(`\n💰 检查营销钱包余额...`);
        
        const ERC20_ABI = [
            "function balanceOf(address owner) view returns (uint256)",
            "function symbol() view returns (string)",
            "function decimals() view returns (uint8)"
        ];
        
        const maoToken = new ethers.Contract(CONFIG.CONTRACTS.MAO_TOKEN, ERC20_ABI, provider);
        const piToken = new ethers.Contract(CONFIG.CONTRACTS.PI_TOKEN, ERC20_ABI, provider);
        
        const maoBalance = await maoToken.balanceOf(CONFIG.MARKETING_WALLET);
        const piBalance = await piToken.balanceOf(CONFIG.MARKETING_WALLET);
        
        console.log(`📊 营销钱包余额 (${CONFIG.MARKETING_WALLET}):`);
        console.log(`   MAO余额: ${ethers.formatEther(maoBalance)}`);
        console.log(`   PI余额: ${ethers.formatEther(piBalance)}`);
        
        return {
            maoBalance: parseFloat(ethers.formatEther(maoBalance)),
            piBalance: parseFloat(ethers.formatEther(piBalance))
        };
        
    } catch (error) {
        console.error(`❌ 检查营销钱包余额失败: ${error.message}`);
        return { maoBalance: 0, piBalance: 0 };
    }
}

// 主函数
async function main() {
    try {
        console.log('🚀 开始检查所有合约地址...');
        
        const provider = await createProvider();
        
        // 检查营销钱包当前余额
        const currentBalance = await checkMarketingWalletBalance(provider);
        
        // 检查所有合约
        const contractResults = [];
        
        for (const [name, address] of Object.entries(CONFIG.CONTRACTS)) {
            if (name.startsWith('WHEEL_GAME')) {
                const result = await checkContract(provider, address, name);
                if (result.exists) {
                    contractResults.push(result);
                }
            }
        }
        
        // 总结分析
        console.log('\n📊 总结分析:');
        console.log('='.repeat(50));
        
        const totalEvents = contractResults.reduce((sum, result) => sum + result.events.length, 0);
        console.log(`总游戏记录数: ${totalEvents}`);
        
        if (totalEvents > 0) {
            const activeContract = contractResults.find(result => result.events.length > 0);
            if (activeContract) {
                console.log(`\n🎯 活跃合约: ${activeContract.contractName}`);
                console.log(`游戏记录数: ${activeContract.events.length}`);
                
                // 分析问题
                console.log('\n🔧 问题分析:');
                if (activeContract.events.length > 0) {
                    console.log('✅ 找到游戏记录，说明游戏正在运行');
                    console.log('📋 建议检查:');
                    console.log('   1. 确认使用的是正确的合约地址');
                    console.log('   2. 检查合约中的营销钱包配置');
                    console.log('   3. 验证资金分配逻辑是否正确');
                    console.log('   4. 检查是否有交易失败的情况');
                } else {
                    console.log('❌ 未找到游戏记录，可能原因:');
                    console.log('   1. 游戏还没有开始');
                    console.log('   2. 使用了错误的合约地址');
                    console.log('   3. 合约部署有问题');
                }
            }
        } else {
            console.log('❌ 所有合约都没有找到游戏记录');
            console.log('💡 建议:');
            console.log('   1. 确认游戏是否正在运行');
            console.log('   2. 检查合约部署状态');
            console.log('   3. 验证网络连接');
        }
        
        console.log('\n🎉 检查完成!');
        
    } catch (error) {
        console.error('❌ 检查失败:', error.message);
        process.exit(1);
    }
}

// 运行脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { main }; 