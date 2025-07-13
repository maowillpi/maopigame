// 🔧 区块链交易错误修复脚本
// 解决 gasPrice、maxFeePerGas 等常见交易错误

require('dotenv').config();
const { ethers } = require("ethers");

// 配置
const CONFIG = {
    ALVEY_NETWORK: {
        rpcUrls: [
            'https://elves-core2.alvey.io/',
            'https://elves-core3.alvey.io/',
            'https://elves-core1.alvey.io/'
        ],
        chainId: 3797,
        name: 'AlveyChain'
    },
    CONTRACTS: {
        WHEEL_GAME: '0xB677DBcA76061E6301272c83179c8243A4eeB6A5',
        MAO_TOKEN: '0x22f49bcb3dad370a9268ba3fca33cb037ca3d022',
        PI_TOKEN: '0xfd4680e25e05b3435c7f698668d1ce80d2a9f444'
    },
    GAS_SETTINGS: {
        APPROVAL_GAS_LIMIT: 100000,
        MAO_GAME_GAS_LIMIT: 300000,
        PI_GAME_GAS_LIMIT: 500000,
        GAS_PRICE_MULTIPLIER: 1.2, // 增加20%确保交易成功
        MAX_RETRIES: 3,
        RETRY_DELAY: 2000 // 2秒
    }
};

// 创建稳定的provider连接
async function createStableProvider() {
    for (const rpcUrl of CONFIG.ALVEY_NETWORK.rpcUrls) {
        try {
            console.log(`🔗 尝试连接到 ${rpcUrl}`);
            const provider = new ethers.JsonRpcProvider(rpcUrl);
            
            // 测试连接
            const network = await provider.getNetwork();
            const blockNumber = await provider.getBlockNumber();
            
            console.log(`✅ 成功连接到 ${rpcUrl}`);
            console.log(`📊 网络: ${network.name} (${network.chainId})`);
            console.log(`🧱 当前区块: ${blockNumber}`);
            
            return provider;
        } catch (error) {
            console.log(`❌ 连接失败: ${rpcUrl} - ${error.message}`);
            continue;
        }
    }
    throw new Error('❌ 所有RPC节点连接失败');
}

// 优化的gas费用计算
async function calculateOptimalGas(provider, transaction) {
    try {
        // 获取当前网络gas价格
        const gasPrice = await provider.getGasPrice();
        
        // 估算gas限制
        let gasLimit;
        try {
            gasLimit = await provider.estimateGas(transaction);
            gasLimit = (gasLimit * 120n) / 100n; // 增加20%缓冲
        } catch (error) {
            console.log('⚠️ Gas估算失败，使用默认值');
            gasLimit = BigInt(transaction.gasLimit || 300000);
        }
        
        // 计算优化的gas价格
        const optimizedGasPrice = (gasPrice * BigInt(Math.floor(CONFIG.GAS_SETTINGS.GAS_PRICE_MULTIPLIER * 100))) / 100n;
        
        console.log(`⛽ Gas设置:`);
        console.log(`   Gas Price: ${ethers.formatUnits(optimizedGasPrice, 'gwei')} Gwei`);
        console.log(`   Gas Limit: ${gasLimit.toString()}`);
        console.log(`   预估费用: ${ethers.formatEther(optimizedGasPrice * gasLimit)} ALV`);
        
        return {
            gasPrice: optimizedGasPrice,
            gasLimit: gasLimit
        };
    } catch (error) {
        console.error('❌ Gas计算失败:', error);
        throw error;
    }
}

// 带重试机制的交易发送
async function sendTransactionWithRetry(contract, method, params = [], options = {}) {
    let lastError;
    
    for (let attempt = 1; attempt <= CONFIG.GAS_SETTINGS.MAX_RETRIES; attempt++) {
        try {
            console.log(`🔄 尝试发送交易 (${attempt}/${CONFIG.GAS_SETTINGS.MAX_RETRIES})`);
            
            // 获取优化的gas设置
            const gasSettings = await calculateOptimalGas(contract.provider, {
                to: contract.address,
                data: contract.interface.encodeFunctionData(method, params),
                ...options
            });
            
            // 合并gas设置
            const txOptions = {
                ...options,
                ...gasSettings
            };
            
            // 发送交易
            const tx = await contract[method](...params, txOptions);
            console.log(`📤 交易已发送: ${tx.hash}`);
            
            // 等待确认
            const receipt = await tx.wait();
            console.log(`✅ 交易确认: ${receipt.transactionHash}`);
            console.log(`⛽ 实际Gas使用: ${receipt.gasUsed.toString()}`);
            
            return receipt;
            
        } catch (error) {
            lastError = error;
            console.error(`❌ 交易失败 (尝试 ${attempt}/${CONFIG.GAS_SETTINGS.MAX_RETRIES}):`, error.message);
            
            // 分析错误类型
            if (error.code === 4001) {
                console.log('🚫 用户取消交易，停止重试');
                throw error;
            }
            
            if (error.message.includes('nonce')) {
                console.log('🔄 Nonce错误，等待后重试');
                await new Promise(resolve => setTimeout(resolve, CONFIG.GAS_SETTINGS.RETRY_DELAY));
                continue;
            }
            
            if (error.message.includes('gas')) {
                console.log('⛽ Gas相关错误，调整参数后重试');
                await new Promise(resolve => setTimeout(resolve, CONFIG.GAS_SETTINGS.RETRY_DELAY));
                continue;
            }
            
            if (attempt === CONFIG.GAS_SETTINGS.MAX_RETRIES) {
                console.error('❌ 达到最大重试次数，交易失败');
                throw lastError;
            }
            
            await new Promise(resolve => setTimeout(resolve, CONFIG.GAS_SETTINGS.RETRY_DELAY));
        }
    }
    
    throw lastError;
}

// 修复授权交易
async function fixTokenApproval(tokenContract, spenderAddress, amount = ethers.MaxUint256) {
    try {
        console.log('🔓 开始修复代币授权...');
        
        // 检查当前授权
        const currentAllowance = await tokenContract.allowance(
            wallet.address,
            spenderAddress
        );
        
        console.log(`📊 当前授权额度: ${ethers.formatEther(currentAllowance)}`);
        
        if (currentAllowance < ethers.parseEther("1000000")) {
            console.log('🔧 需要重新授权...');
            
            const receipt = await sendTransactionWithRetry(
                tokenContract,
                'approve',
                [spenderAddress, amount],
                { gasLimit: CONFIG.GAS_SETTINGS.APPROVAL_GAS_LIMIT }
            );
            
            console.log('✅ 授权修复完成');
            return receipt;
        } else {
            console.log('✅ 授权充足，无需修复');
            return null;
        }
        
    } catch (error) {
        console.error('❌ 授权修复失败:', error);
        throw error;
    }
}

// 修复游戏交易
async function fixGameTransaction(gameContract, gameFunction, tokenType) {
    try {
        console.log(`🎮 开始修复${tokenType}游戏交易...`);
        
        const gasLimit = tokenType === 'MAO' ? 
            CONFIG.GAS_SETTINGS.MAO_GAME_GAS_LIMIT : 
            CONFIG.GAS_SETTINGS.PI_GAME_GAS_LIMIT;
        
        const receipt = await sendTransactionWithRetry(
            gameContract,
            gameFunction,
            [],
            { gasLimit: gasLimit }
        );
        
        console.log(`✅ ${tokenType}游戏交易修复完成`);
        return receipt;
        
    } catch (error) {
        console.error(`❌ ${tokenType}游戏交易修复失败:`, error);
        throw error;
    }
}

// 主修复函数
async function main() {
    try {
        console.log('🚀 开始区块链交易错误修复...');
        
        // 检查私钥
        if (!process.env.PRIVATE_KEY) {
            throw new Error('❌ 请设置 PRIVATE_KEY 环境变量');
        }
        
        // 创建稳定连接
        const provider = await createStableProvider();
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        
        console.log(`💰 钱包地址: ${wallet.address}`);
        
        // 检查ALV余额
        const balance = await provider.getBalance(wallet.address);
        console.log(`💎 ALV余额: ${ethers.formatEther(balance)}`);
        
        if (balance < ethers.parseEther("0.1")) {
            console.warn('⚠️ ALV余额较低，可能无法支付Gas费用');
        }
        
        // 创建合约实例
        const ERC20_ABI = [
            "function balanceOf(address owner) view returns (uint256)",
            "function approve(address spender, uint256 amount) returns (bool)",
            "function allowance(address owner, address spender) view returns (uint256)"
        ];
        
        const GAME_ABI = [
            "function playMAOGame() external",
            "function playPIGame() external"
        ];
        
        const maoToken = new ethers.Contract(CONFIG.CONTRACTS.MAO_TOKEN, ERC20_ABI, wallet);
        const piToken = new ethers.Contract(CONFIG.CONTRACTS.PI_TOKEN, ERC20_ABI, wallet);
        const gameContract = new ethers.Contract(CONFIG.CONTRACTS.WHEEL_GAME, GAME_ABI, wallet);
        
        // 修复MAO授权
        console.log('\n🔧 修复MAO代币授权...');
        await fixTokenApproval(maoToken, CONFIG.CONTRACTS.WHEEL_GAME);
        
        // 修复PI授权
        console.log('\n🔧 修复PI代币授权...');
        await fixTokenApproval(piToken, CONFIG.CONTRACTS.WHEEL_GAME);
        
        console.log('\n🎉 所有交易错误修复完成！');
        console.log('\n📋 修复总结:');
        console.log('✅ 网络连接优化');
        console.log('✅ Gas费用优化');
        console.log('✅ 重试机制启用');
        console.log('✅ 错误处理改进');
        console.log('✅ 代币授权修复');
        
        console.log('\n🎮 游戏现在应该可以正常运行了！');
        
    } catch (error) {
        console.error('❌ 修复过程失败:', error);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    createStableProvider,
    calculateOptimalGas,
    sendTransactionWithRetry,
    fixTokenApproval,
    fixGameTransaction
}; 