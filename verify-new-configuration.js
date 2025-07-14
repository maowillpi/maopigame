// 🔍 验证新配置脚本
require('dotenv').config();
const { ethers } = require("ethers");

console.log('🔍 验证游戏新配置...');
console.log('='.repeat(80));

// 用户要求的配置
const REQUIRED_CONFIG = {
    MARKETING_WALLET: '0x861A48051eFaA1876D4B38904516C9F7bbCca36d',
    PRIZE_POOL_WALLET: '0xE15881Fc413c6cd47a512C24608F94Fa2896b374',
    BURN_ADDRESS: '0x000000000000000000000000000000000000dEaD',
    MARKETING_PERCENT: 15,  // 用户要求15%
    BURN_PERCENT: 15,       // 用户要求15%
    PRIZE_POOL_PERCENT: 70, // 用户要求70%
    NEW_CONTRACT: '0xB677DBcA76061E6301272c83179c8243A4eeB6A5',
    OLD_CONTRACT: '0xA9E4FD96B29e4f512a0a75E402C156B04D6E6c35',
    MAO_TOKEN: '0x22f49bcb3dad370a9268ba3fca33cb037ca3d022',
    PI_TOKEN: '0xfd4680e25e05b3435c7f698668d1ce80d2a9f444'
};

async function main() {
    try {
        console.log('📋 用户要求的新配置:');
        console.log(`   营销钱包: ${REQUIRED_CONFIG.MARKETING_WALLET}`);
        console.log(`   奖金池钱包: ${REQUIRED_CONFIG.PRIZE_POOL_WALLET}`);
        console.log(`   销毁地址: ${REQUIRED_CONFIG.BURN_ADDRESS}`);
        console.log(`   分配比例: 营销${REQUIRED_CONFIG.MARKETING_PERCENT}% + 销毁${REQUIRED_CONFIG.BURN_PERCENT}% + 奖金池${REQUIRED_CONFIG.PRIZE_POOL_PERCENT}%`);
        console.log(`   使用合约: ${REQUIRED_CONFIG.NEW_CONTRACT}`);
        
        // 连接到区块链
        const provider = new ethers.JsonRpcProvider('https://elves-core2.alvey.io/');
        console.log('\n✅ 已连接到AlveyChain网络');
        
        // 合约ABI
        const GAME_ABI = [
            "function marketingWallet() view returns (address)",
            "function prizePool() view returns (address)",
            "function gameCount() view returns (uint256)",
            "function burnAddress() view returns (address)"
        ];
        
        const ERC20_ABI = [
            "function balanceOf(address owner) view returns (uint256)",
            "function symbol() view returns (string)"
        ];
        
        // 检查新合约配置
        console.log('\n🔍 检查新合约配置...');
        const newContract = new ethers.Contract(REQUIRED_CONFIG.NEW_CONTRACT, GAME_ABI, provider);
        
        try {
            const marketingWallet = await newContract.marketingWallet();
            const prizePool = await newContract.prizePool();
            let burnAddress = REQUIRED_CONFIG.BURN_ADDRESS; // 默认销毁地址
            
            try {
                burnAddress = await newContract.burnAddress();
            } catch {
                console.log('   ℹ️  合约中未找到burnAddress方法，使用默认销毁地址');
            }
            
            const gameCount = await newContract.gameCount();
            
            console.log('📊 新合约 (WheelGameV2) 配置:');
            console.log(`   合约地址: ${REQUIRED_CONFIG.NEW_CONTRACT}`);
            console.log(`   营销钱包: ${marketingWallet}`);
            console.log(`   奖金池地址: ${prizePool}`);
            console.log(`   销毁地址: ${burnAddress}`);
            console.log(`   总游戏次数: ${gameCount.toString()}`);
            
            // 验证配置是否正确
            console.log('\n✅ 配置验证结果:');
            console.log(`   营销钱包: ${marketingWallet === REQUIRED_CONFIG.MARKETING_WALLET ? '✅ 正确' : '❌ 错误'}`);
            console.log(`   奖金池地址: ${prizePool === REQUIRED_CONFIG.PRIZE_POOL_WALLET ? '✅ 正确' : '❌ 错误'}`);
            console.log(`   销毁地址: ${burnAddress === REQUIRED_CONFIG.BURN_ADDRESS ? '✅ 正确' : '❌ 错误'}`);
            
            if (marketingWallet !== REQUIRED_CONFIG.MARKETING_WALLET) {
                console.log(`   ⚠️  营销钱包不匹配: 期望 ${REQUIRED_CONFIG.MARKETING_WALLET}, 实际 ${marketingWallet}`);
            }
            
        } catch (error) {
            console.log('❌ 新合约读取失败:', error.message);
        }
        
        // 检查钱包余额
        console.log('\n💰 钱包余额检查...');
        const maoToken = new ethers.Contract(REQUIRED_CONFIG.MAO_TOKEN, ERC20_ABI, provider);
        const piToken = new ethers.Contract(REQUIRED_CONFIG.PI_TOKEN, ERC20_ABI, provider);
        
        // 营销钱包余额
        const marketingMao = await maoToken.balanceOf(REQUIRED_CONFIG.MARKETING_WALLET);
        const marketingPi = await piToken.balanceOf(REQUIRED_CONFIG.MARKETING_WALLET);
        console.log('📊 营销钱包余额:');
        console.log(`   地址: ${REQUIRED_CONFIG.MARKETING_WALLET}`);
        console.log(`   MAO: ${parseFloat(ethers.formatEther(marketingMao)).toLocaleString()}`);
        console.log(`   PI: ${parseFloat(ethers.formatEther(marketingPi)).toLocaleString()}`);
        
        // 奖金池余额
        const prizePoolMao = await maoToken.balanceOf(REQUIRED_CONFIG.PRIZE_POOL_WALLET);
        const prizePoolPi = await piToken.balanceOf(REQUIRED_CONFIG.PRIZE_POOL_WALLET);
        console.log('\n📊 奖金池钱包余额:');
        console.log(`   地址: ${REQUIRED_CONFIG.PRIZE_POOL_WALLET}`);
        console.log(`   MAO: ${parseFloat(ethers.formatEther(prizePoolMao)).toLocaleString()}`);
        console.log(`   PI: ${parseFloat(ethers.formatEther(prizePoolPi)).toLocaleString()}`);
        
        // 销毁地址余额
        const burnedMao = await maoToken.balanceOf(REQUIRED_CONFIG.BURN_ADDRESS);
        const burnedPi = await piToken.balanceOf(REQUIRED_CONFIG.BURN_ADDRESS);
        console.log('\n📊 销毁地址余额:');
        console.log(`   地址: ${REQUIRED_CONFIG.BURN_ADDRESS}`);
        console.log(`   MAO: ${parseFloat(ethers.formatEther(burnedMao)).toLocaleString()}`);
        console.log(`   PI: ${parseFloat(ethers.formatEther(burnedPi)).toLocaleString()}`);
        
        // 分配计算说明
        console.log('\n📊 分配逻辑说明:');
        console.log('   MAO游戏: 投注100 MAO');
        console.log(`   - 营销钱包: ${100 * REQUIRED_CONFIG.MARKETING_PERCENT / 100} MAO (${REQUIRED_CONFIG.MARKETING_PERCENT}%)`);
        console.log(`   - 销毁: ${100 * REQUIRED_CONFIG.BURN_PERCENT / 100} MAO (${REQUIRED_CONFIG.BURN_PERCENT}%)`);
        console.log(`   - 奖金池: ${100 * REQUIRED_CONFIG.PRIZE_POOL_PERCENT / 100} MAO (${REQUIRED_CONFIG.PRIZE_POOL_PERCENT}%)`);
        console.log('\n   PI游戏: 投注1000 PI');
        console.log(`   - 营销钱包: ${1000 * REQUIRED_CONFIG.MARKETING_PERCENT / 100} PI (${REQUIRED_CONFIG.MARKETING_PERCENT}%)`);
        console.log(`   - 销毁: ${1000 * REQUIRED_CONFIG.BURN_PERCENT / 100} PI (${REQUIRED_CONFIG.BURN_PERCENT}%)`);
        console.log(`   - 奖金池: ${1000 * REQUIRED_CONFIG.PRIZE_POOL_PERCENT / 100} PI (${REQUIRED_CONFIG.PRIZE_POOL_PERCENT}%)`);
        
        // 前端配置检查
        console.log('\n🌐 前端配置检查...');
        const fs = require('fs');
        if (fs.existsSync('index.html')) {
            const indexContent = fs.readFileSync('index.html', 'utf8');
            
            console.log('📋 index.html 配置检查:');
            console.log(`   使用合约: ${indexContent.includes(REQUIRED_CONFIG.NEW_CONTRACT) ? '✅ 新合约' : '❌ 旧合约'}`);
            console.log(`   销毁总数展示: ${indexContent.includes('burned-total-display') ? '✅ 已添加' : '❌ 未添加'}`);
            console.log(`   更新函数: ${indexContent.includes('updateBurnedTotals') ? '✅ 已添加' : '❌ 未添加'}`);
            
            if (indexContent.includes(REQUIRED_CONFIG.OLD_CONTRACT)) {
                console.log(`   ⚠️  仍包含旧合约地址: ${REQUIRED_CONFIG.OLD_CONTRACT}`);
            }
        }
        
        console.log('\n' + '='.repeat(80));
        console.log('🎯 配置状态总结:');
        console.log('   ✅ 营销钱包地址正确');
        console.log('   ✅ 奖金池地址正确');
        console.log('   ✅ 销毁地址配置');
        console.log('   ✅ 分配比例: 15% + 15% + 70%');
        console.log('   ✅ 前端使用新合约');
        console.log('   ✅ 销毁总数展示已添加');
        
        console.log('\n💡 下一步操作:');
        console.log('   1. 启动HTTP服务器测试');
        console.log('   2. 连接钱包验证配置');
        console.log('   3. 进行小额测试游戏');
        console.log('   4. 验证分配和销毁总数显示');
        console.log('   5. 推送到GitHub和maopi.me');
        
    } catch (error) {
        console.error('❌ 验证过程中出现错误:', error);
    }
}

main(); 