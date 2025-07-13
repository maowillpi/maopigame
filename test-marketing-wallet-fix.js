// 🧪 测试营销钱包修复
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
        OLD_WHEEL_GAME: '0xA9E4FD96B29e4f512a0a75E402C156B04D6E6c35', // 旧合约(有问题)
        NEW_WHEEL_GAME: '0xB677DBcA76061E6301272c83179c8243A4eeB6A5', // 新合约(已修复)
        MAO_TOKEN: '0x22f49bcb3dad370a9268ba3fca33cb037ca3d022',
        PI_TOKEN: '0xfd4680e25e05b3435c7f698668d1ce80d2a9f444'
    },
    MARKETING_WALLET: '0x861A48051eFaA1876D4B38904516C9F7bbCca36d',
    WRONG_MARKETING_WALLET: '0xE15881Fc413c6cd47a512C24608F94Fa2896b374'
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

// 检查合约营销钱包配置
async function checkMarketingWalletConfig(provider, contractAddress, contractName) {
    try {
        console.log(`\n🔍 检查 ${contractName} 营销钱包配置...`);
        
        const gameABI = [
            "function marketingWallet() view returns (address)"
        ];
        
        const gameContract = new ethers.Contract(contractAddress, gameABI, provider);
        const marketingWallet = await gameContract.marketingWallet();
        
        console.log(`📊 ${contractName} 配置:`);
        console.log(`   合约地址: ${contractAddress}`);
        console.log(`   营销钱包: ${marketingWallet}`);
        
        const isCorrect = marketingWallet.toLowerCase() === CONFIG.MARKETING_WALLET.toLowerCase();
        console.log(`   配置状态: ${isCorrect ? '✅ 正确' : '❌ 错误'}`);
        
        if (!isCorrect) {
            console.log(`   期望地址: ${CONFIG.MARKETING_WALLET}`);
            console.log(`   实际地址: ${marketingWallet}`);
        }
        
        return { isCorrect, marketingWallet };
        
    } catch (error) {
        console.error(`❌ 检查 ${contractName} 失败:`, error.message);
        return { isCorrect: false, marketingWallet: null };
    }
}

// 检查营销钱包余额
async function checkMarketingWalletBalances(provider) {
    try {
        console.log(`\n💰 检查营销钱包余额...`);
        
        const ERC20_ABI = [
            "function balanceOf(address owner) view returns (uint256)"
        ];
        
        const maoToken = new ethers.Contract(CONFIG.CONTRACTS.MAO_TOKEN, ERC20_ABI, provider);
        const piToken = new ethers.Contract(CONFIG.CONTRACTS.PI_TOKEN, ERC20_ABI, provider);
        
        // 检查正确的营销钱包
        const correctMaoBalance = await maoToken.balanceOf(CONFIG.MARKETING_WALLET);
        const correctPiBalance = await piToken.balanceOf(CONFIG.MARKETING_WALLET);
        
        console.log(`📊 正确营销钱包余额 (${CONFIG.MARKETING_WALLET}):`);
        console.log(`   MAO: ${ethers.formatEther(correctMaoBalance)}`);
        console.log(`   PI: ${ethers.formatEther(correctPiBalance)}`);
        
        // 检查错误的营销钱包
        const wrongMaoBalance = await maoToken.balanceOf(CONFIG.WRONG_MARKETING_WALLET);
        const wrongPiBalance = await piToken.balanceOf(CONFIG.WRONG_MARKETING_WALLET);
        
        console.log(`📊 错误营销钱包余额 (${CONFIG.WRONG_MARKETING_WALLET}):`);
        console.log(`   MAO: ${ethers.formatEther(wrongMaoBalance)}`);
        console.log(`   PI: ${ethers.formatEther(wrongPiBalance)}`);
        
        return {
            correct: {
                mao: parseFloat(ethers.formatEther(correctMaoBalance)),
                pi: parseFloat(ethers.formatEther(correctPiBalance))
            },
            wrong: {
                mao: parseFloat(ethers.formatEther(wrongMaoBalance)),
                pi: parseFloat(ethers.formatEther(wrongPiBalance))
            }
        };
        
    } catch (error) {
        console.error(`❌ 检查营销钱包余额失败:`, error.message);
        return null;
    }
}

// 检查最近的游戏活动
async function checkRecentGameActivity(provider) {
    try {
        console.log(`\n🎮 检查最近的游戏活动...`);
        
        const gameABI = [
            "event GamePlayed(address indexed player, uint8 tokenType, uint256 betAmount, uint256 rewardAmount, uint8 rewardLevel, uint256 randomSeed)"
        ];
        
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = currentBlock - 1000; // 检查最近1000个区块
        
        // 检查新合约
        const newGameContract = new ethers.Contract(CONFIG.CONTRACTS.NEW_WHEEL_GAME, gameABI, provider);
        const newFilter = newGameContract.filters.GamePlayed();
        const newEvents = await newGameContract.queryFilter(newFilter, fromBlock, currentBlock);
        
        console.log(`📊 新合约 (${CONFIG.CONTRACTS.NEW_WHEEL_GAME}) 最近游戏记录: ${newEvents.length} 个`);
        
        // 检查旧合约
        const oldGameContract = new ethers.Contract(CONFIG.CONTRACTS.OLD_WHEEL_GAME, gameABI, provider);
        const oldFilter = oldGameContract.filters.GamePlayed();
        const oldEvents = await oldGameContract.queryFilter(oldFilter, fromBlock, currentBlock);
        
        console.log(`📊 旧合约 (${CONFIG.CONTRACTS.OLD_WHEEL_GAME}) 最近游戏记录: ${oldEvents.length} 个`);
        
        if (newEvents.length > 0) {
            console.log(`\n✅ 检测到新合约有游戏活动，营销钱包将收到正确分配！`);
            newEvents.slice(-2).forEach((event, index) => {
                const { player, tokenType, betAmount } = event.args;
                const tokenName = tokenType === 0 ? 'MAO' : 'PI';
                const betValue = ethers.formatEther(betAmount);
                const marketingShare = parseFloat(betValue) * 0.2;
                
                console.log(`   ${index + 1}. 玩家: ${player.slice(0, 10)}...`);
                console.log(`      代币: ${tokenName}, 投注: ${betValue}`);
                console.log(`      营销分配: ${marketingShare} ${tokenName} → ${CONFIG.MARKETING_WALLET}`);
            });
        }
        
        if (oldEvents.length > 0) {
            console.log(`\n⚠️ 检测到旧合约仍有游戏活动，这些收益将发送到错误的营销钱包！`);
            console.log(`   建议：确保所有用户都使用新的游戏界面`);
        }
        
        return { newEvents, oldEvents };
        
    } catch (error) {
        console.error(`❌ 检查游戏活动失败:`, error.message);
        return { newEvents: [], oldEvents: [] };
    }
}

// 主函数
async function main() {
    try {
        console.log('🧪 开始测试营销钱包修复...');
        console.log('='.repeat(60));
        
        const provider = await createProvider();
        
        // 1. 检查合约配置
        const oldConfig = await checkMarketingWalletConfig(provider, CONFIG.CONTRACTS.OLD_WHEEL_GAME, '旧合约');
        const newConfig = await checkMarketingWalletConfig(provider, CONFIG.CONTRACTS.NEW_WHEEL_GAME, '新合约');
        
        // 2. 检查营销钱包余额
        const balances = await checkMarketingWalletBalances(provider);
        
        // 3. 检查最近的游戏活动
        const activity = await checkRecentGameActivity(provider);
        
        // 4. 生成修复报告
        console.log('\n📋 修复状态报告:');
        console.log('='.repeat(60));
        
        if (newConfig.isCorrect) {
            console.log('✅ 新合约营销钱包配置正确');
        } else {
            console.log('❌ 新合约营销钱包配置仍有问题');
        }
        
        if (!oldConfig.isCorrect) {
            console.log('⚠️ 旧合约营销钱包配置错误（预期）');
        }
        
        if (activity.newEvents.length > 0) {
            console.log('✅ 新合约有游戏活动，营销钱包将收到正确分配');
        } else {
            console.log('⚠️ 新合约暂无游戏活动');
        }
        
        if (activity.oldEvents.length > 0) {
            console.log('⚠️ 旧合约仍有游戏活动，需要引导用户使用新界面');
        }
        
        console.log('\n💡 建议操作:');
        if (activity.newEvents.length === 0 && activity.oldEvents.length > 0) {
            console.log('1. 用户仍在使用旧合约，需要更新游戏界面');
            console.log('2. 确保所有HTML文件都使用新的合约地址');
            console.log('3. 清除浏览器缓存，重新加载游戏');
        } else if (activity.newEvents.length > 0) {
            console.log('1. 修复成功！继续使用新合约');
            console.log('2. 监控营销钱包余额增长');
            console.log('3. 定期运行检查脚本');
        } else {
            console.log('1. 进行一次测试游戏，验证修复效果');
            console.log('2. 检查网络连接和合约状态');
        }
        
        console.log('\n🎉 测试完成!');
        
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
        process.exit(1);
    }
}

// 运行脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { main }; 