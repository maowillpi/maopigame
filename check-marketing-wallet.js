// 🔍 检查营销钱包代币接收状态
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
        WHEEL_GAME: '0xB677DBcA76061E6301272c83179c8243A4eeB6A5',
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

// 检查合约配置
async function checkContractConfig(provider) {
    try {
        console.log('\n🔍 检查合约配置...');
        
        const gameABI = [
            "function marketingWallet() view returns (address)",
            "function prizePool() view returns (address)",
            "function maoToken() view returns (address)",
            "function piToken() view returns (address)"
        ];
        
        const gameContract = new ethers.Contract(CONFIG.CONTRACTS.WHEEL_GAME, gameABI, provider);
        
        const marketingWallet = await gameContract.marketingWallet();
        const prizePool = await gameContract.prizePool();
        const maoToken = await gameContract.maoToken();
        const piToken = await gameContract.piToken();
        
        console.log(`📊 合约配置状态:`);
        console.log(`   游戏合约: ${CONFIG.CONTRACTS.WHEEL_GAME}`);
        console.log(`   营销钱包: ${marketingWallet}`);
        console.log(`   奖金池: ${prizePool}`);
        console.log(`   MAO代币: ${maoToken}`);
        console.log(`   PI代币: ${piToken}`);
        
        // 检查营销钱包是否匹配
        if (marketingWallet.toLowerCase() === CONFIG.MARKETING_WALLET.toLowerCase()) {
            console.log(`✅ 营销钱包配置正确`);
        } else {
            console.log(`❌ 营销钱包配置不匹配!`);
            console.log(`   期望: ${CONFIG.MARKETING_WALLET}`);
            console.log(`   实际: ${marketingWallet}`);
        }
        
        return {
            marketingWallet,
            prizePool,
            maoToken,
            piToken
        };
        
    } catch (error) {
        console.error('❌ 检查合约配置失败:', error.message);
        throw error;
    }
}

// 检查营销钱包余额
async function checkMarketingWalletBalance(provider) {
    try {
        console.log('\n💰 检查营销钱包余额...');
        
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
            maoBalance,
            piBalance
        };
        
    } catch (error) {
        console.error('❌ 检查营销钱包余额失败:', error.message);
        throw error;
    }
}

// 检查最近的游戏交易
async function checkRecentGameTransactions(provider) {
    try {
        console.log('\n🎮 检查最近的游戏交易...');
        
        const gameABI = [
            "event GamePlayed(address indexed player, uint8 tokenType, uint256 betAmount, uint256 rewardAmount, uint8 rewardLevel, uint256 randomSeed)"
        ];
        
        const gameContract = new ethers.Contract(CONFIG.CONTRACTS.WHEEL_GAME, gameABI, provider);
        
        // 获取最近的区块
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = currentBlock - 10000; // 检查最近10000个区块，扩大搜索范围
        
        console.log(`🔍 搜索区块范围: ${fromBlock} - ${currentBlock}`);
        
        const filter = gameContract.filters.GamePlayed();
        const events = await gameContract.queryFilter(filter, fromBlock, currentBlock);
        
        console.log(`📊 找到 ${events.length} 个游戏事件`);
        
        if (events.length > 0) {
            console.log('\n📋 最近的游戏记录:');
            events.slice(-5).forEach((event, index) => {
                const { player, tokenType, betAmount, rewardAmount, rewardLevel } = event.args;
                const tokenName = tokenType === 0 ? 'MAO' : 'PI';
                const betValue = ethers.formatEther(betAmount);
                const rewardValue = ethers.formatEther(rewardAmount);
                
                console.log(`   ${index + 1}. 玩家: ${player}`);
                console.log(`      代币: ${tokenName}, 投注: ${betValue}, 奖励: ${rewardValue}, 等级: ${rewardLevel}`);
                console.log(`      区块: ${event.blockNumber}, 交易: ${event.transactionHash}`);
            });
        } else {
            console.log('⚠️ 没有找到最近的游戏记录');
        }
        
        return events;
        
    } catch (error) {
        console.error('❌ 检查游戏交易失败:', error.message);
        throw error;
    }
}

// 分析营销钱包收益问题
async function analyzeMarketingWalletIssue(provider, gameEvents) {
    try {
        console.log('\n🔧 分析营销钱包收益问题...');
        
        if (gameEvents.length === 0) {
            console.log('❌ 没有游戏记录，无法分析收益问题');
            return;
        }
        
        // 计算期望收益
        let expectedMAO = 0;
        let expectedPI = 0;
        
        gameEvents.forEach(event => {
            const { tokenType, betAmount } = event.args;
            const betValue = parseFloat(ethers.formatEther(betAmount));
            
            if (tokenType === 0) { // MAO
                expectedMAO += betValue * 0.2; // 20%营销费用
            } else { // PI
                expectedPI += betValue * 0.2; // 20%营销费用
            }
        });
        
        console.log(`📊 期望营销收益:`);
        console.log(`   MAO: ${expectedMAO.toFixed(2)}`);
        console.log(`   PI: ${expectedPI.toFixed(2)}`);
        
        // 获取实际余额
        const balances = await checkMarketingWalletBalance(provider);
        const actualMAO = parseFloat(ethers.formatEther(balances.maoBalance));
        const actualPI = parseFloat(ethers.formatEther(balances.piBalance));
        
        console.log(`📊 实际营销余额:`);
        console.log(`   MAO: ${actualMAO.toFixed(2)}`);
        console.log(`   PI: ${actualPI.toFixed(2)}`);
        
        // 分析差异
        const maoDiff = actualMAO - expectedMAO;
        const piDiff = actualPI - expectedPI;
        
        console.log(`📊 收益差异分析:`);
        console.log(`   MAO差异: ${maoDiff.toFixed(2)} (${maoDiff >= 0 ? '✅ 正常' : '❌ 缺少'})`);
        console.log(`   PI差异: ${piDiff.toFixed(2)} (${piDiff >= 0 ? '✅ 正常' : '❌ 缺少'})`);
        
        // 提供解决建议
        if (maoDiff < 0 || piDiff < 0) {
            console.log('\n💡 问题分析:');
            console.log('   营销钱包收益不足，可能原因:');
            console.log('   1. 合约中营销钱包地址配置错误');
            console.log('   2. 合约代码中资金分配逻辑问题');
            console.log('   3. 交易执行失败但事件仍然触发');
            console.log('   4. 使用了错误的合约地址');
            
            console.log('\n🔧 建议解决方案:');
            console.log('   1. 检查合约源码中的营销钱包配置');
            console.log('   2. 验证每笔游戏交易的内部转账记录');
            console.log('   3. 确认使用的是正确的合约地址');
            console.log('   4. 检查是否有交易失败但事件仍然触发的情况');
        } else {
            console.log('\n✅ 营销钱包收益正常');
        }
        
    } catch (error) {
        console.error('❌ 分析营销钱包问题失败:', error.message);
        throw error;
    }
}

// 主函数
async function main() {
    try {
        console.log('🚀 开始检查营销钱包状态...');
        
        const provider = await createProvider();
        
        // 检查合约配置
        const contractConfig = await checkContractConfig(provider);
        
        // 检查营销钱包余额
        await checkMarketingWalletBalance(provider);
        
        // 检查最近的游戏交易
        const gameEvents = await checkRecentGameTransactions(provider);
        
        // 分析营销钱包收益问题
        await analyzeMarketingWalletIssue(provider, gameEvents);
        
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