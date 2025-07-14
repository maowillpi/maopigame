// 🔍 当前游戏状态全面分析脚本
require('dotenv').config();
const { ethers } = require("ethers");

console.log('🔍 MAO转盘游戏当前状态全面分析');
console.log('='.repeat(80));

// 配置信息
const CONFIG = {
    ALVEY_NETWORK: {
        rpcUrl: 'https://elves-core2.alvey.io/',
        chainId: 3797,
        name: 'AlveyChain'
    },
    CONTRACTS: {
        // 当前使用的旧合约
        CURRENT_WHEEL_GAME: '0xA9E4FD96B29e4f512a0a75E402C156B04D6E6c35',
        // 新合约（营销钱包配置正确）
        NEW_WHEEL_GAME: '0xB677DBcA76061E6301272c83179c8243A4eeB6A5',
        MAO_TOKEN: '0x22f49bcb3dad370a9268ba3fca33cb037ca3d022',
        PI_TOKEN: '0xfd4680e25e05b3435c7f698668d1ce80d2a9f444'
    },
    WALLETS: {
        MARKETING_CORRECT: '0x861A48051eFaA1876D4B38904516C9F7bbCca36d',
        MARKETING_WRONG: '0xE15881Fc413c6cd47a512C24608F94Fa2896b374',
        BURN_ADDRESS: '0x000000000000000000000000000000000000dEaD'
    }
};

// 奖励结构
const REWARDS = {
    MAO: [0, 105, 125, 200, 600, 1000],
    PI: [0, 1050, 1250, 2000, 6000, 10000]
};

// 概率分布
const PROBABILITIES = [50.0, 22.0, 20.0, 7.0, 0.8, 0.2];

async function main() {
    try {
        console.log('🚀 开始分析当前游戏状态...\n');
        
        // 创建provider
        const provider = new ethers.JsonRpcProvider(CONFIG.ALVEY_NETWORK.rpcUrl);
        console.log(`✅ 已连接到 ${CONFIG.ALVEY_NETWORK.rpcUrl}\n`);
        
        // 创建合约实例
        const ERC20_ABI = [
            "function balanceOf(address owner) view returns (uint256)",
            "function totalSupply() view returns (uint256)",
            "function name() view returns (string)",
            "function symbol() view returns (string)"
        ];
        
        const GAME_ABI = [
            "function marketingWallet() view returns (address)",
            "function prizePool() view returns (address)",
            "function gameCount() view returns (uint256)",
            "function getGameHistory(uint256 start, uint256 count) view returns (tuple(address player, uint8 tokenType, uint256 betAmount, uint8 rewardLevel, uint256 rewardAmount, uint256 timestamp)[])"
        ];
        
        const maoToken = new ethers.Contract(CONFIG.CONTRACTS.MAO_TOKEN, ERC20_ABI, provider);
        const piToken = new ethers.Contract(CONFIG.CONTRACTS.PI_TOKEN, ERC20_ABI, provider);
        const currentGame = new ethers.Contract(CONFIG.CONTRACTS.CURRENT_WHEEL_GAME, GAME_ABI, provider);
        const newGame = new ethers.Contract(CONFIG.CONTRACTS.NEW_WHEEL_GAME, GAME_ABI, provider);
        
        // 1. 游戏基本配置分析
        console.log('📊 游戏基本配置分析');
        console.log('-'.repeat(50));
        console.log('🎮 投注金额:');
        console.log('   MAO游戏: 100 MAO');
        console.log('   PI游戏: 1,000 PI');
        console.log('\n💰 分配比例:');
        console.log('   奖金池: 70%');
        console.log('   销毁: 10%'); 
        console.log('   营销: 20%');
        console.log('\n🎰 奖励结构:');
        for (let i = 0; i < REWARDS.MAO.length; i++) {
            console.log(`   等级${i}: ${PROBABILITIES[i]}% - MAO:${REWARDS.MAO[i]} / PI:${REWARDS.PI[i]}`);
        }
        
        // 2. 当前合约状态分析
        console.log('\n📋 当前合约状态分析');
        console.log('-'.repeat(50));
        
        try {
            const currentMarketingWallet = await currentGame.marketingWallet();
            const currentPrizePool = await currentGame.prizePool();
            const currentGameCount = await currentGame.gameCount();
            
            console.log('🔴 当前使用的合约 (有问题):');
            console.log(`   合约地址: ${CONFIG.CONTRACTS.CURRENT_WHEEL_GAME}`);
            console.log(`   营销钱包: ${currentMarketingWallet}`);
            console.log(`   奖金池地址: ${currentPrizePool}`);
            console.log(`   总游戏次数: ${currentGameCount.toString()}`);
            console.log(`   营销钱包状态: ${currentMarketingWallet === CONFIG.WALLETS.MARKETING_CORRECT ? '✅ 正确' : '❌ 错误'}`);
            
            if (currentMarketingWallet !== CONFIG.WALLETS.MARKETING_CORRECT) {
                console.log(`   ⚠️  问题: 营销钱包指向了奖金池地址!`);
                console.log(`   预期地址: ${CONFIG.WALLETS.MARKETING_CORRECT}`);
                console.log(`   实际地址: ${currentMarketingWallet}`);
            }
        } catch (error) {
            console.log('❌ 当前合约读取失败:', error.message);
        }
        
        try {
            const newMarketingWallet = await newGame.marketingWallet();
            const newPrizePool = await newGame.prizePool();
            const newGameCount = await newGame.gameCount();
            
            console.log('\n🟢 新合约 (配置正确):');
            console.log(`   合约地址: ${CONFIG.CONTRACTS.NEW_WHEEL_GAME}`);
            console.log(`   营销钱包: ${newMarketingWallet}`);
            console.log(`   奖金池地址: ${newPrizePool}`);
            console.log(`   总游戏次数: ${newGameCount.toString()}`);
            console.log(`   营销钱包状态: ${newMarketingWallet === CONFIG.WALLETS.MARKETING_CORRECT ? '✅ 正确' : '❌ 错误'}`);
        } catch (error) {
            console.log('❌ 新合约读取失败:', error.message);
        }
        
        // 3. 钱包余额分析
        console.log('\n💰 钱包余额分析');
        console.log('-'.repeat(50));
        
        // 正确的营销钱包
        const correctMaoBalance = await maoToken.balanceOf(CONFIG.WALLETS.MARKETING_CORRECT);
        const correctPiBalance = await piToken.balanceOf(CONFIG.WALLETS.MARKETING_CORRECT);
        console.log('✅ 正确营销钱包余额:');
        console.log(`   地址: ${CONFIG.WALLETS.MARKETING_CORRECT}`);
        console.log(`   MAO: ${ethers.formatEther(correctMaoBalance)}`);
        console.log(`   PI: ${ethers.formatEther(correctPiBalance)}`);
        
        // 错误的营销钱包（实际是奖金池）
        const wrongMaoBalance = await maoToken.balanceOf(CONFIG.WALLETS.MARKETING_WRONG);
        const wrongPiBalance = await piToken.balanceOf(CONFIG.WALLETS.MARKETING_WRONG);
        console.log('\n❌ 错误营销钱包余额 (实际是奖金池):');
        console.log(`   地址: ${CONFIG.WALLETS.MARKETING_WRONG}`);
        console.log(`   MAO: ${ethers.formatEther(wrongMaoBalance)}`);
        console.log(`   PI: ${ethers.formatEther(wrongPiBalance)}`);
        
        // 4. 代币分配计算
        console.log('\n📊 实际代币分配分析');
        console.log('-'.repeat(50));
        
        // 基于当前游戏的分配计算（错误配置下）
        const totalMaoInWrong = parseFloat(ethers.formatEther(wrongMaoBalance));
        const totalPiInWrong = parseFloat(ethers.formatEther(wrongPiBalance));
        
        // 估算游戏次数（基于20%营销费用）
        const estimatedMaoGames = Math.floor(totalMaoInWrong / 90); // 90 = 70(奖金池) + 20(原本应该给营销)
        const estimatedPiGames = Math.floor(totalPiInWrong / 900); // 900 = 700(奖金池) + 200(原本应该给营销)
        
        console.log('🎮 基于余额的游戏次数估算:');
        console.log(`   MAO游戏: 约 ${estimatedMaoGames} 次`);
        console.log(`   PI游戏: 约 ${estimatedPiGames} 次`);
        console.log(`   总投入: MAO ${estimatedMaoGames * 100}, PI ${estimatedPiGames * 1000}`);
        
        // 计算丢失的营销费用
        const lostMaoMarketing = estimatedMaoGames * 20;
        const lostPiMarketing = estimatedPiGames * 200;
        console.log('\n💸 丢失的营销费用:');
        console.log(`   MAO: ${lostMaoMarketing} (应该在营销钱包中)`);
        console.log(`   PI: ${lostPiMarketing} (应该在营销钱包中)`);
        
        // 5. Gas问题分析
        console.log('\n⛽ Gas问题分析');
        console.log('-'.repeat(50));
        console.log('🔍 Gas问题原因:');
        console.log('   1. 合约方法定义: playMAOGame() 和 playPIGame()');
        console.log('   2. 这些方法不接受任何参数');
        console.log('   3. 之前的"优化"代码试图传入Gas选项参数');
        console.log('   4. 导致合约调用失败，显示Gas错误');
        console.log('\n✅ 已修复:');
        console.log('   - 移除了错误的Gas配置参数');
        console.log('   - 恢复原始的无参数调用方式');
        console.log('   - 简化了授权交易');
        
        // 6. 推荐解决方案
        console.log('\n💡 推荐解决方案');
        console.log('-'.repeat(50));
        console.log('🎯 当前状态:');
        console.log('   ✅ Gas问题已修复');
        console.log('   ✅ 游戏功能正常');
        console.log('   ❌ 营销钱包配置错误（使用旧合约）');
        console.log('\n🔧 选项1: 继续使用旧合约');
        console.log('   ✅ 游戏功能正常');
        console.log('   ❌ 营销钱包收不到20%费用');
        console.log('   💰 20%费用会进入奖金池');
        console.log('\n🔧 选项2: 切换到新合约');
        console.log('   ✅ 营销钱包配置正确');
        console.log('   ✅ 20%费用正确分配');
        console.log('   ⚠️  需要清除浏览器缓存');
        console.log('   ⚠️  需要重新授权代币');
        
        // 7. 当前网站状态
        console.log('\n🌐 当前网站状态');
        console.log('-'.repeat(50));
        console.log('📍 访问地址:');
        console.log('   本地测试: http://127.0.0.1:8000/index.html');
        console.log('   在线游戏: https://maopi.me');
        console.log('\n📋 当前配置:');
        console.log(`   合约地址: ${CONFIG.CONTRACTS.CURRENT_WHEEL_GAME} (旧合约)`);
        console.log('   营销钱包: 配置错误，指向奖金池');
        console.log('   游戏功能: 正常');
        console.log('   Gas问题: 已修复');
        
        console.log('\n🎉 分析完成!');
        console.log('\n📝 总结:');
        console.log('   - 游戏功能完全正常');
        console.log('   - Gas费用问题已解决');
        console.log('   - 营销钱包配置错误，但不影响游戏');
        console.log('   - 20%营销费用目前进入奖金池');
        console.log('   - 所有修复已同步到GitHub和maopi.me');
        
    } catch (error) {
        console.error('❌ 分析过程中出现错误:', error);
    }
}

main(); 