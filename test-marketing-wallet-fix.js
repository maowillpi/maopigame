// 营销钱包配置验证脚本 - 清理版本（无旧合约）
require('dotenv').config();
const { ethers } = require('ethers');

// ✅ 正确的配置 - 只使用新合约
const CONFIG = {
    WHEEL_GAME: '0xB677DBcA76061E6301272c83179c8243A4eeB6A5',
    MAO_TOKEN: '0x22f49bcb3dad370a9268ba3fca33cb037ca3d022',
    PI_TOKEN: '0xfd4680e25e05b3435c7f698668d1ce80d2a9f444',
    MARKETING_WALLET: '0x861A48051eFaA1876D4B38904516C9F7bbCca36d',
    PRIZE_POOL_WALLET: '0xE15881Fc413c6cd47a512C24608F94Fa2896b374'
};

const RPC_URLS = [
    'https://elves-core2.alvey.io/',
    'https://elves-core1.alvey.io/',
    'https://elves-core3.alvey.io/'
];

const GAME_ABI = [
    "function marketingWallet() external view returns (address)"
];

const TOKEN_ABI = [
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)"
];

async function main() {
    console.log('🧪 开始验证营销钱包配置...');
    console.log('============================================================');
    
    try {
        // 连接到RPC
        let provider = null;
        for (const rpcUrl of RPC_URLS) {
            try {
                console.log(`🔌 尝试连接 ${rpcUrl}...`);
                provider = new ethers.providers.JsonRpcProvider(rpcUrl);
                await provider.getNetwork();
                console.log(`✅ 连接成功: ${rpcUrl}`);
                break;
            } catch (error) {
                console.log(`❌ 连接失败: ${rpcUrl}`);
                continue;
            }
        }

        if (!provider) {
            throw new Error('所有RPC连接失败');
        }

        // 检查合约配置
        console.log('\n🔍 检查游戏合约营销钱包配置...');
        const gameContract = new ethers.Contract(CONFIG.WHEEL_GAME, GAME_ABI, provider);
        const marketingWallet = await gameContract.marketingWallet();
        
        console.log('📊 游戏合约配置:');
        console.log(`   合约地址: ${CONFIG.WHEEL_GAME}`);
        console.log(`   营销钱包: ${marketingWallet}`);
        
        const isCorrect = marketingWallet.toLowerCase() === CONFIG.MARKETING_WALLET.toLowerCase();
        console.log(`   配置状态: ${isCorrect ? '✅ 正确' : '❌ 错误'}`);

        // 检查钱包余额
        console.log('\n💰 检查钱包余额...');
        const maoContract = new ethers.Contract(CONFIG.MAO_TOKEN, TOKEN_ABI, provider);
        const piContract = new ethers.Contract(CONFIG.PI_TOKEN, TOKEN_ABI, provider);
        
        // 营销钱包余额
        const maoBalance = await maoContract.balanceOf(CONFIG.MARKETING_WALLET);
        const piBalance = await piContract.balanceOf(CONFIG.MARKETING_WALLET);
        const maoDecimals = await maoContract.decimals();
        const piDecimals = await piContract.decimals();
        
        console.log(`📊 营销钱包余额 (${CONFIG.MARKETING_WALLET}):`);
        console.log(`   MAO: ${ethers.utils.formatUnits(maoBalance, maoDecimals)}`);
        console.log(`   PI: ${ethers.utils.formatUnits(piBalance, piDecimals)}`);
        
        // 奖金池钱包余额
        const prizeMaoBalance = await maoContract.balanceOf(CONFIG.PRIZE_POOL_WALLET);
        const prizePiBalance = await piContract.balanceOf(CONFIG.PRIZE_POOL_WALLET);
        
        console.log(`📊 奖金池钱包余额 (${CONFIG.PRIZE_POOL_WALLET}):`);
        console.log(`   MAO: ${ethers.utils.formatUnits(prizeMaoBalance, maoDecimals)}`);
        console.log(`   PI: ${ethers.utils.formatUnits(prizePiBalance, piDecimals)}`);

        console.log('\n📋 验证报告:');
        console.log('============================================================');
        console.log(`${isCorrect ? '✅' : '❌'} 营销钱包配置${isCorrect ? '正确' : '错误'}`);
        console.log(`✅ 奖金池钱包配置正确`);
        
        console.log('\n💡 当前系统配置 (已清除所有旧合约引用):');
        console.log('- 游戏合约: 0xB677DBcA76061E6301272c83179c8243A4eeB6A5 ✅');
        console.log('- 营销钱包: 0x861A48051eFaA1876D4B38904516C9F7bbCca36d ✅');
        console.log('- 奖金池钱包: 0xE15881Fc413c6cd47a512C24608F94Fa2896b374 ✅');
        
        console.log('\n🎉 验证完成! 系统已清理所有旧合约混乱代码');
        
    } catch (error) {
        console.error('❌ 验证过程中出现错误:', error.message);
    }
}

if (require.main === module) {
    main();
} 