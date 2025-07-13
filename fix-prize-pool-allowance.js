const { ethers } = require('ethers');
require('dotenv').config();

// 配置
const CONFIG = {
    ALVEY_NETWORK: {
        rpcUrls: ['https://elves-core2.alvey.io', 'https://elves-core3.alvey.io', 'https://elves-core1.alvey.io']
    },
    CONTRACTS: {
        WHEEL_GAME: '0xA9E4FD96B29e4f512a0a75E402C156B04D6E6c35',
        MAO_TOKEN: '0x22f49bcb3dad370a9268ba3fca33cb037ca3d022',
        PI_TOKEN: '0xfd4680e25e05b3435c7f698668d1ce80d2a9f444'
    }
};

const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
];

async function createProvider() {
    for (const rpcUrl of CONFIG.ALVEY_NETWORK.rpcUrls) {
        try {
            const provider = new ethers.JsonRpcProvider(rpcUrl);
            await provider.getNetwork();
            console.log(`✅ 连接到 RPC: ${rpcUrl}`);
            return provider;
        } catch (error) {
            console.log(`❌ RPC 连接失败: ${rpcUrl}`);
            continue;
        }
    }
    throw new Error('所有 RPC 连接失败');
}

async function fixPrizePoolAllowance() {
    try {
        console.log('🔧 开始修复奖池授权问题...');
        
        // 创建提供者和签名者 - 使用PRIVATE_KEY作为奖池钱包
        const provider = await createProvider();
        const prizePoolWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        
        console.log(`💰 奖池钱包地址: ${prizePoolWallet.address}`);
        console.log(`🎮 游戏合约地址: ${CONFIG.CONTRACTS.WHEEL_GAME}`);
        
        // 创建代币合约实例
        const maoToken = new ethers.Contract(CONFIG.CONTRACTS.MAO_TOKEN, ERC20_ABI, prizePoolWallet);
        const piToken = new ethers.Contract(CONFIG.CONTRACTS.PI_TOKEN, ERC20_ABI, prizePoolWallet);
        
        // 检查当前余额和授权
        console.log('\n📊 检查当前状态...');
        
        const maoBalance = await maoToken.balanceOf(prizePoolWallet.address);
        const piBalance = await piToken.balanceOf(prizePoolWallet.address);
        const maoAllowance = await maoToken.allowance(prizePoolWallet.address, CONFIG.CONTRACTS.WHEEL_GAME);
        const piAllowance = await piToken.allowance(prizePoolWallet.address, CONFIG.CONTRACTS.WHEEL_GAME);
        
        console.log(`MAO 余额: ${ethers.formatEther(maoBalance)}`);
        console.log(`PI 余额: ${ethers.formatEther(piBalance)}`);
        console.log(`MAO 当前授权: ${ethers.formatEther(maoAllowance)}`);
        console.log(`PI 当前授权: ${ethers.formatEther(piAllowance)}`);
        
        // 设置足够大的授权额度（最大值）
        const maxAllowance = ethers.MaxUint256;
        
        console.log('\n🔓 开始授权操作...');
        
        // 授权 MAO 代币
        if (maoAllowance < ethers.parseEther("1000000")) {
            console.log('授权 MAO 代币...');
            const maoApproveTx = await maoToken.approve(CONFIG.CONTRACTS.WHEEL_GAME, maxAllowance);
            console.log(`MAO 授权交易: ${maoApproveTx.hash}`);
            await maoApproveTx.wait();
            console.log('✅ MAO 授权完成');
        } else {
            console.log('✅ MAO 授权已足够');
        }
        
        // 授权 PI 代币
        if (piAllowance < ethers.parseEther("1000000")) {
            console.log('授权 PI 代币...');
            const piApproveTx = await piToken.approve(CONFIG.CONTRACTS.WHEEL_GAME, maxAllowance);
            console.log(`PI 授权交易: ${piApproveTx.hash}`);
            await piApproveTx.wait();
            console.log('✅ PI 授权完成');
        } else {
            console.log('✅ PI 授权已足够');
        }
        
        // 再次检查授权状态
        console.log('\n📊 检查授权后状态...');
        const newMaoAllowance = await maoToken.allowance(prizePoolWallet.address, CONFIG.CONTRACTS.WHEEL_GAME);
        const newPiAllowance = await piToken.allowance(prizePoolWallet.address, CONFIG.CONTRACTS.WHEEL_GAME);
        
        console.log(`MAO 新授权额度: ${ethers.formatEther(newMaoAllowance)}`);
        console.log(`PI 新授权额度: ${ethers.formatEther(newPiAllowance)}`);
        
        console.log('\n🎉 奖池授权修复完成！游戏现在应该可以正常运行了。');
        
    } catch (error) {
        console.error('❌ 修复奖池授权失败:', error);
        throw error;
    }
}

// 运行修复
fixPrizePoolAllowance().catch(console.error); 