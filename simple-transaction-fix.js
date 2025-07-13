// 🔧 简单的区块链交易错误修复脚本
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
    }
};

// 创建provider
async function createProvider() {
    for (const rpcUrl of CONFIG.RPC_URLS) {
        try {
            console.log(`🔗 尝试连接到 ${rpcUrl}`);
            const provider = new ethers.JsonRpcProvider(rpcUrl);
            await provider.getBlockNumber();
            console.log(`✅ 成功连接到 ${rpcUrl}`);
            return provider;
        } catch (error) {
            console.log(`❌ 连接失败: ${rpcUrl}`);
            continue;
        }
    }
    throw new Error('❌ 所有RPC连接失败');
}

// 检查和修复授权
async function checkAndFixApproval(tokenContract, spenderAddress, tokenName, walletAddress) {
    try {
        console.log(`🔍 检查${tokenName}授权...`);
        
        const allowance = await tokenContract.allowance(walletAddress, spenderAddress);
        const minRequired = ethers.parseEther("1000000");
        
        console.log(`📊 当前${tokenName}授权额度: ${ethers.formatEther(allowance)}`);
        
        if (allowance < minRequired) {
            console.log(`🔧 需要重新授权${tokenName}...`);
            
            // 获取当前gas价格
            const gasPrice = await tokenContract.runner.provider.getGasPrice();
            const adjustedGasPrice = gasPrice * 110n / 100n; // 增加10%
            
            const tx = await tokenContract.approve(spenderAddress, ethers.MaxUint256, {
                gasLimit: 100000,
                gasPrice: adjustedGasPrice
            });
            
            console.log(`📤 ${tokenName}授权交易发送: ${tx.hash}`);
            
            const receipt = await tx.wait();
            console.log(`✅ ${tokenName}授权成功! Gas使用: ${receipt.gasUsed}`);
            
            return receipt;
        } else {
            console.log(`✅ ${tokenName}授权充足，无需修复`);
            return null;
        }
        
    } catch (error) {
        console.error(`❌ ${tokenName}授权修复失败:`, error.message);
        
        // 提供具体的错误解决建议
        if (error.message.includes('insufficient funds')) {
            console.log('💡 解决方案: 确保钱包有足够的ALV支付Gas费用');
        } else if (error.message.includes('user rejected')) {
            console.log('💡 解决方案: 请在钱包中确认交易');
        } else if (error.message.includes('gas')) {
            console.log('💡 解决方案: Gas费用问题，请稍后重试');
        }
        
        throw error;
    }
}

// 主函数
async function main() {
    try {
        console.log('🚀 开始修复区块链交易错误...');
        
        if (!process.env.PRIVATE_KEY) {
            throw new Error('❌ 请设置 PRIVATE_KEY 环境变量');
        }
        
        // 创建provider和wallet
        const provider = await createProvider();
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        
        console.log(`💰 钱包地址: ${wallet.address}`);
        
        // 检查ALV余额
        const balance = await provider.getBalance(wallet.address);
        console.log(`💎 ALV余额: ${ethers.formatEther(balance)}`);
        
        if (balance < ethers.parseEther("0.01")) {
            console.warn('⚠️ ALV余额较低，可能无法支付Gas费用');
        }
        
        // 创建代币合约
        const ERC20_ABI = [
            "function balanceOf(address owner) view returns (uint256)",
            "function approve(address spender, uint256 amount) returns (bool)",
            "function allowance(address owner, address spender) view returns (uint256)"
        ];
        
        const maoToken = new ethers.Contract(CONFIG.CONTRACTS.MAO_TOKEN, ERC20_ABI, wallet);
        const piToken = new ethers.Contract(CONFIG.CONTRACTS.PI_TOKEN, ERC20_ABI, wallet);
        
        // 检查代币余额
        const maoBalance = await maoToken.balanceOf(wallet.address);
        const piBalance = await piToken.balanceOf(wallet.address);
        
        console.log(`📊 MAO余额: ${ethers.formatEther(maoBalance)}`);
        console.log(`📊 PI余额: ${ethers.formatEther(piBalance)}`);
        
        // 修复授权
        console.log('\n🔧 开始修复代币授权...');
        
        await checkAndFixApproval(maoToken, CONFIG.CONTRACTS.WHEEL_GAME, 'MAO', wallet.address);
        await checkAndFixApproval(piToken, CONFIG.CONTRACTS.WHEEL_GAME, 'PI', wallet.address);
        
        console.log('\n🎉 交易错误修复完成!');
        console.log('\n📋 修复内容:');
        console.log('✅ 网络连接优化');
        console.log('✅ Gas费用优化 (增加10%缓冲)');
        console.log('✅ 代币授权修复');
        console.log('✅ 错误处理改进');
        
        console.log('\n🎮 现在可以正常使用游戏了!');
        console.log('💡 如果仍有问题，请检查:');
        console.log('   - 钱包是否有足够的ALV支付Gas费用');
        console.log('   - 网络连接是否稳定');
        console.log('   - 是否在正确的网络 (AlveyChain)');
        
    } catch (error) {
        console.error('❌ 修复失败:', error.message);
        
        // 根据错误类型提供解决方案
        if (error.message.includes('insufficient funds')) {
            console.log('\n💡 解决方案:');
            console.log('   1. 确保钱包有足够的ALV支付Gas费用');
            console.log('   2. 当前推荐Gas费用约为 0.01-0.1 ALV');
        } else if (error.message.includes('network')) {
            console.log('\n💡 解决方案:');
            console.log('   1. 检查网络连接');
            console.log('   2. 尝试切换到其他RPC节点');
            console.log('   3. 稍后重试');
        } else if (error.message.includes('private key')) {
            console.log('\n💡 解决方案:');
            console.log('   1. 检查 .env 文件中的 PRIVATE_KEY 设置');
            console.log('   2. 确保私钥格式正确 (64位十六进制)');
        }
        
        process.exit(1);
    }
}

// 运行脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { main, checkAndFixApproval }; 