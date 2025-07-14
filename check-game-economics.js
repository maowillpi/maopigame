const { ethers } = require('ethers');
require('dotenv').config();

// 合约配置
const GAME_CONTRACT_ADDRESS = '0xB677DBcA76061E6301272c83179c8243A4eeB6A5';
const MAO_CONTRACT_ADDRESS = '0x22f49bcb3dad370a9268ba3fca33cb037ca3d022';
const PI_CONTRACT_ADDRESS = '0xfd4680e25e05b3435c7f698668d1ce80d2a9f444';
const MARKETING_WALLET = '0x861A48051eFaA1876D4B38904516C9F7bbCca36d';

const RPC_URLS = [
    'https://elves-core1.alvey.io/',
    'https://elves-core2.alvey.io/',
    'https://elves-core3.alvey.io/'
];

// 完整的游戏合约ABI
const GAME_ABI = [
    "function playMAOGame() external",
    "function playPIGame() external",
    "function prizePool() external view returns (uint256)",
    "function marketingWallet() external view returns (address)",
    "function burnWallet() external view returns (address)",
    "function marketingPercentage() external view returns (uint256)",
    "function burnPercentage() external view returns (uint256)",
    "function prizePoolPercentage() external view returns (uint256)",
    "function getGameCost(bool useMAO) external view returns (uint256)",
    "event GamePlayed(address indexed player, bool useMAO, uint256 amount, uint256 multiplier, uint256 reward)",
    "event TokensBurned(address indexed token, uint256 amount)",
    "event MarketingFeeTransferred(address indexed token, uint256 amount)"
];

const TOKEN_ABI = [
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)",
    "function symbol() external view returns (string)",
    "function totalSupply() external view returns (uint256)"
];

async function checkGameEconomics() {
    console.log('🔍 检查MAO转盘游戏经济模型和合约配置...');
    console.log('='.repeat(80));

    try {
        // 连接到网络
        const provider = new ethers.providers.JsonRpcProvider(RPC_URLS[1]);
        console.log('✅ 连接到', RPC_URLS[1]);

        // 创建合约实例
        const gameContract = new ethers.Contract(GAME_CONTRACT_ADDRESS, GAME_ABI, provider);
        const maoContract = new ethers.Contract(MAO_CONTRACT_ADDRESS, TOKEN_ABI, provider);
        const piContract = new ethers.Contract(PI_CONTRACT_ADDRESS, TOKEN_ABI, provider);

        console.log('\n📊 合约基本信息:');
        console.log('   游戏合约:', GAME_CONTRACT_ADDRESS);
        console.log('   MAO合约:', MAO_CONTRACT_ADDRESS);
        console.log('   PI合约:', PI_CONTRACT_ADDRESS);

        // 检查代币信息
        console.log('\n💰 代币信息:');
        try {
            const maoSymbol = await maoContract.symbol();
            const maoDecimals = await maoContract.decimals();
            const maoSupply = await maoContract.totalSupply();
            console.log(`   ${maoSymbol}: ${maoDecimals} decimals, 总供应量: ${ethers.utils.formatEther(maoSupply)}`);
            
            const piSymbol = await piContract.symbol();
            const piDecimals = await piContract.decimals();
            const piSupply = await piContract.totalSupply();
            console.log(`   ${piSymbol}: ${piDecimals} decimals, 总供应量: ${ethers.utils.formatEther(piSupply)}`);
        } catch (error) {
            console.log('   ❌ 代币信息获取失败:', error.message);
        }

        // 检查游戏合约配置
        console.log('\n🎮 游戏合约配置:');
        try {
            const marketingWallet = await gameContract.marketingWallet();
            console.log('   营销钱包:', marketingWallet);
            console.log('   配置正确:', marketingWallet.toLowerCase() === MARKETING_WALLET.toLowerCase() ? '✅' : '❌');
            
            // 检查经济模型比例
            try {
                const marketingPercentage = await gameContract.marketingPercentage();
                const burnPercentage = await gameContract.burnPercentage();
                const prizePoolPercentage = await gameContract.prizePoolPercentage();
                
                console.log('   营销比例:', marketingPercentage.toString() + '%');
                console.log('   销毁比例:', burnPercentage.toString() + '%');
                console.log('   奖金池比例:', prizePoolPercentage.toString() + '%');
                
                // 验证是否为15% + 15% + 70%
                if (marketingPercentage.toString() === '15' && 
                    burnPercentage.toString() === '15' && 
                    prizePoolPercentage.toString() === '70') {
                    console.log('   ✅ 经济模型正确: 15%销毁 + 15%营销 + 70%奖金池');
                } else {
                    console.log('   ❌ 经济模型不正确，期望: 15%销毁 + 15%营销 + 70%奖金池');
                }
            } catch (error) {
                console.log('   ❌ 无法获取经济模型比例，可能合约不支持这些方法');
            }

            // 检查游戏费用
            try {
                const maoCost = await gameContract.getGameCost(true);
                const piCost = await gameContract.getGameCost(false);
                console.log('   MAO游戏费用:', ethers.utils.formatEther(maoCost), 'MAO');
                console.log('   PI游戏费用:', ethers.utils.formatEther(piCost), 'PI');
                
                // 验证费用是否正确
                if (ethers.utils.formatEther(maoCost) === '100.0' && 
                    ethers.utils.formatEther(piCost) === '1000.0') {
                    console.log('   ✅ 游戏费用正确');
                } else {
                    console.log('   ❌ 游戏费用不正确，期望: 100 MAO, 1000 PI');
                }
            } catch (error) {
                console.log('   ⚠️ 无法获取游戏费用，使用默认值: 100 MAO, 1000 PI');
            }

            // 检查奖金池余额
            const prizePool = await gameContract.prizePool();
            console.log('   奖金池余额:', ethers.utils.formatEther(prizePool), 'tokens');

        } catch (error) {
            console.log('   ❌ 游戏合约配置检查失败:', error.message);
        }

        // 检查营销钱包余额
        console.log('\n🏦 营销钱包余额:');
        try {
            const maoBalance = await maoContract.balanceOf(MARKETING_WALLET);
            const piBalance = await piContract.balanceOf(MARKETING_WALLET);
            
            console.log('   MAO余额:', ethers.utils.formatEther(maoBalance));
            console.log('   PI余额:', ethers.utils.formatEther(piBalance));
            
            if (parseFloat(ethers.utils.formatEther(maoBalance)) > 0 || 
                parseFloat(ethers.utils.formatEther(piBalance)) > 0) {
                console.log('   ✅ 营销钱包有余额，说明分配机制可能正常');
            } else {
                console.log('   ⚠️ 营销钱包余额为0，可能还没有游戏或分配有问题');
            }
        } catch (error) {
            console.log('   ❌ 营销钱包余额检查失败:', error.message);
        }

        // 检查最近的游戏事件
        console.log('\n📈 最近游戏活动:');
        try {
            const currentBlock = await provider.getBlockNumber();
            const fromBlock = Math.max(0, currentBlock - 1000); // 最近1000个块
            
            const gameEvents = await gameContract.queryFilter(
                gameContract.filters.GamePlayed(),
                fromBlock,
                currentBlock
            );
            
            console.log(`   最近${currentBlock - fromBlock}个块中的游戏次数:`, gameEvents.length);
            
            if (gameEvents.length > 0) {
                console.log('   ✅ 有游戏活动');
                
                // 分析最后几个游戏
                const recentGames = gameEvents.slice(-3);
                console.log('\n   📋 最近3次游戏详情:');
                recentGames.forEach((event, index) => {
                    const { player, useMAO, amount, multiplier, reward } = event.args;
                    console.log(`   ${index + 1}. 玩家: ${player.slice(0,8)}...`);
                    console.log(`      代币: ${useMAO ? 'MAO' : 'PI'}`);
                    console.log(`      投入: ${ethers.utils.formatEther(amount)}`);
                    console.log(`      倍数: ${ethers.utils.formatEther(multiplier)}`);
                    console.log(`      奖励: ${ethers.utils.formatEther(reward)}`);
                });
            } else {
                console.log('   ⚠️ 没有找到最近的游戏活动');
            }
        } catch (error) {
            console.log('   ❌ 游戏事件查询失败:', error.message);
        }

        // 诊断建议
        console.log('\n🔧 诊断和建议:');
        console.log('='.repeat(80));
        
        console.log('✅ 检查完成的项目:');
        console.log('   - 合约地址配置');
        console.log('   - 代币合约连接');
        console.log('   - 营销钱包配置');
        console.log('   - 奖金池状态');
        console.log('   - 游戏活动记录');
        
        console.log('\n💡 如果游戏仍有问题，可能原因:');
        console.log('   1. 奖金池余额不足 - 需要预充值奖金池');
        console.log('   2. 合约权限问题 - 检查代币授权');
        console.log('   3. Gas费用不足 - 确保钱包有足够ALV');
        console.log('   4. 网络连接问题 - 尝试其他RPC节点');
        console.log('   5. 浏览器缓存 - 清除缓存重新加载');
        
        console.log('\n📱 游戏流程应该是:');
        console.log('   1. ✅ 连接钱包并切换到Alvey网络');
        console.log('   2. ✅ 授权代币给游戏合约');
        console.log('   3. ✅ 扣除游戏费用（100 MAO 或 1000 PI）');
        console.log('   4. ✅ 按15%销毁+15%营销+70%奖金池分配');
        console.log('   5. ✅ 根据中奖结果从奖金池发放奖励');
        console.log('   6. ✅ 播放转盘动画显示结果');

    } catch (error) {
        console.error('❌ 检查失败:', error);
    }
}

// 运行检查
if (require.main === module) {
    checkGameEconomics();
}

module.exports = { checkGameEconomics }; 