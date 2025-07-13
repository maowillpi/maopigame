// 🔍 重新检查钱包角色和代币分配
require('dotenv').config();
const { ethers } = require("ethers");

// 根据用户提供的信息重新定义配置
const CONFIG = {
    RPC_URLS: [
        'https://elves-core2.alvey.io/',
        'https://elves-core3.alvey.io/',
        'https://elves-core1.alvey.io/'
    ],
    CONTRACTS: {
        OLD_WHEEL_GAME: '0xA9E4FD96B29e4f512a0a75E402C156B04D6E6c35',
        NEW_WHEEL_GAME: '0xB677DBcA76061E6301272c83179c8243A4eeB6A5',
        MAO_TOKEN: '0x22f49bcb3dad370a9268ba3fca33cb037ca3d022',
        PI_TOKEN: '0xfd4680e25e05b3435c7f698668d1ce80d2a9f444'
    },
    WALLETS: {
        MARKETING_WALLET: '0x861A48051eFaA1876D4B38904516C9F7bbCca36d', // 用户确认的营销钱包
        PRIZE_POOL_WALLET: '0xE15881Fc413c6cd47a512C24608F94Fa2896b374' // 用户确认的奖金池钱包
    }
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
async function checkContractConfig(provider, contractAddress, contractName) {
    try {
        console.log(`\n🔍 检查 ${contractName} 配置...`);
        
        const gameABI = [
            "function marketingWallet() view returns (address)",
            "function prizePool() view returns (address)",
            "function maoToken() view returns (address)",
            "function piToken() view returns (address)"
        ];
        
        const gameContract = new ethers.Contract(contractAddress, gameABI, provider);
        
        const marketingWallet = await gameContract.marketingWallet();
        const prizePool = await gameContract.prizePool();
        const maoToken = await gameContract.maoToken();
        const piToken = await gameContract.piToken();
        
        console.log(`📊 ${contractName} 配置:`);
        console.log(`   合约地址: ${contractAddress}`);
        console.log(`   营销钱包: ${marketingWallet}`);
        console.log(`   奖金池: ${prizePool}`);
        console.log(`   MAO代币: ${maoToken}`);
        console.log(`   PI代币: ${piToken}`);
        
        // 检查营销钱包配置
        const marketingCorrect = marketingWallet.toLowerCase() === CONFIG.WALLETS.MARKETING_WALLET.toLowerCase();
        console.log(`   营销钱包配置: ${marketingCorrect ? '✅ 正确' : '❌ 错误'}`);
        
        // 检查奖金池配置
        const prizePoolCorrect = prizePool.toLowerCase() === CONFIG.WALLETS.PRIZE_POOL_WALLET.toLowerCase();
        console.log(`   奖金池配置: ${prizePoolCorrect ? '✅ 正确' : '❌ 错误'}`);
        
        return {
            marketingWallet,
            prizePool,
            maoToken,
            piToken,
            marketingCorrect,
            prizePoolCorrect
        };
        
    } catch (error) {
        console.error(`❌ 检查 ${contractName} 失败:`, error.message);
        return null;
    }
}

// 检查钱包余额
async function checkWalletBalances(provider) {
    try {
        console.log(`\n💰 检查钱包余额...`);
        
        const ERC20_ABI = [
            "function balanceOf(address owner) view returns (uint256)"
        ];
        
        const maoToken = new ethers.Contract(CONFIG.CONTRACTS.MAO_TOKEN, ERC20_ABI, provider);
        const piToken = new ethers.Contract(CONFIG.CONTRACTS.PI_TOKEN, ERC20_ABI, provider);
        
        // 检查营销钱包余额
        const marketingMAO = await maoToken.balanceOf(CONFIG.WALLETS.MARKETING_WALLET);
        const marketingPI = await piToken.balanceOf(CONFIG.WALLETS.MARKETING_WALLET);
        
        console.log(`📊 营销钱包余额 (${CONFIG.WALLETS.MARKETING_WALLET}):`);
        console.log(`   MAO: ${ethers.formatEther(marketingMAO)}`);
        console.log(`   PI: ${ethers.formatEther(marketingPI)}`);
        
        // 检查奖金池钱包余额
        const prizePoolMAO = await maoToken.balanceOf(CONFIG.WALLETS.PRIZE_POOL_WALLET);
        const prizePoolPI = await piToken.balanceOf(CONFIG.WALLETS.PRIZE_POOL_WALLET);
        
        console.log(`📊 奖金池钱包余额 (${CONFIG.WALLETS.PRIZE_POOL_WALLET}):`);
        console.log(`   MAO: ${ethers.formatEther(prizePoolMAO)}`);
        console.log(`   PI: ${ethers.formatEther(prizePoolPI)}`);
        
        return {
            marketing: {
                mao: parseFloat(ethers.formatEther(marketingMAO)),
                pi: parseFloat(ethers.formatEther(marketingPI))
            },
            prizePool: {
                mao: parseFloat(ethers.formatEther(prizePoolMAO)),
                pi: parseFloat(ethers.formatEther(prizePoolPI))
            }
        };
        
    } catch (error) {
        console.error(`❌ 检查钱包余额失败:`, error.message);
        return null;
    }
}

// 检查游戏活动
async function checkGameActivity(provider) {
    try {
        console.log(`\n🎮 检查游戏活动...`);
        
        const gameABI = [
            "event GamePlayed(address indexed player, uint8 tokenType, uint256 betAmount, uint256 rewardAmount, uint8 rewardLevel, uint256 randomSeed)"
        ];
        
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = currentBlock - 5000; // 检查最近5000个区块
        
        // 检查旧合约
        const oldContract = new ethers.Contract(CONFIG.CONTRACTS.OLD_WHEEL_GAME, gameABI, provider);
        const oldFilter = oldContract.filters.GamePlayed();
        const oldEvents = await oldContract.queryFilter(oldFilter, fromBlock, currentBlock);
        
        console.log(`📊 旧合约游戏记录: ${oldEvents.length} 个`);
        
        // 检查新合约
        const newContract = new ethers.Contract(CONFIG.CONTRACTS.NEW_WHEEL_GAME, gameABI, provider);
        const newFilter = newContract.filters.GamePlayed();
        const newEvents = await newContract.queryFilter(newFilter, fromBlock, currentBlock);
        
        console.log(`📊 新合约游戏记录: ${newEvents.length} 个`);
        
        return { oldEvents, newEvents };
        
    } catch (error) {
        console.error(`❌ 检查游戏活动失败:`, error.message);
        return { oldEvents: [], newEvents: [] };
    }
}

// 主函数
async function main() {
    try {
        console.log('🔍 重新检查钱包角色和代币分配...');
        console.log('='.repeat(60));
        console.log(`营销钱包: ${CONFIG.WALLETS.MARKETING_WALLET}`);
        console.log(`奖金池钱包: ${CONFIG.WALLETS.PRIZE_POOL_WALLET}`);
        console.log('='.repeat(60));
        
        const provider = await createProvider();
        
        // 检查旧合约配置
        const oldConfig = await checkContractConfig(provider, CONFIG.CONTRACTS.OLD_WHEEL_GAME, '旧合约');
        
        // 检查新合约配置
        const newConfig = await checkContractConfig(provider, CONFIG.CONTRACTS.NEW_WHEEL_GAME, '新合约');
        
        // 检查钱包余额
        const balances = await checkWalletBalances(provider);
        
        // 检查游戏活动
        const activity = await checkGameActivity(provider);
        
        // 分析结果
        console.log('\n📋 分析结果:');
        console.log('='.repeat(60));
        
        if (oldConfig && newConfig) {
            console.log('\n🔍 合约配置对比:');
            console.log(`旧合约营销钱包: ${oldConfig.marketingCorrect ? '✅ 正确' : '❌ 错误'}`);
            console.log(`新合约营销钱包: ${newConfig.marketingCorrect ? '✅ 正确' : '❌ 错误'}`);
            console.log(`旧合约奖金池: ${oldConfig.prizePoolCorrect ? '✅ 正确' : '❌ 错误'}`);
            console.log(`新合约奖金池: ${newConfig.prizePoolCorrect ? '✅ 正确' : '❌ 错误'}`);
            
            // 重新分析问题
            if (oldConfig.marketingCorrect && activity.oldEvents.length > 0) {
                console.log('\n🎯 重要发现：');
                console.log('旧合约的营销钱包配置是正确的，且有游戏活动！');
                console.log('这意味着营销钱包应该已经在收到代币分配。');
            }
            
            if (newConfig.marketingCorrect && activity.newEvents.length === 0) {
                console.log('\n⚠️ 问题确认：');
                console.log('新合约配置正确，但没有游戏活动。');
                console.log('用户可能仍在使用旧合约，但旧合约配置也是正确的。');
            }
        }
        
        if (balances) {
            console.log('\n💰 余额分析:');
            console.log(`营销钱包总余额: MAO ${balances.marketing.mao}, PI ${balances.marketing.pi}`);
            console.log(`奖金池钱包总余额: MAO ${balances.prizePool.mao}, PI ${balances.prizePool.pi}`);
            
            if (balances.marketing.mao > 0 || balances.marketing.pi > 0) {
                console.log('✅ 营销钱包确实有代币余额！');
            }
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