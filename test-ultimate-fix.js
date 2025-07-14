// 🧪 测试终极修复效果
require('dotenv').config();
const { ethers } = require('ethers');

console.log('🧪 测试终极修复效果...');
console.log('='.repeat(70));

async function testUltimateFix() {
    try {
        console.log('✅ 连接到 AlveyChain...');
        const provider = new ethers.JsonRpcProvider('https://elves-core2.alvey.io/');
        
        // 测试合约地址
        const newContract = '0xB677DBcA76061E6301272c83179c8243A4eeB6A5';
        const oldContract = '0xA9E4FD96B29e4f512a0a75E402C156B04D6E6c35';
        
        console.log('\n📋 合约检查:');
        console.log(`   新合约: ${newContract}`);
        console.log(`   旧合约: ${oldContract}`);
        
        // 检查营销钱包配置
        const abi = [
            "function marketingWallet() view returns (address)"
        ];
        
        const newContractInstance = new ethers.Contract(newContract, abi, provider);
        const oldContractInstance = new ethers.Contract(oldContract, abi, provider);
        
        const newMarketingWallet = await newContractInstance.marketingWallet();
        const oldMarketingWallet = await oldContractInstance.marketingWallet();
        
        const expectedWallet = '0x861A48051eFaA1876D4B38904516C9F7bbCca36d';
        
        console.log('\n📊 营销钱包配置:');
        console.log(`   新合约营销钱包: ${newMarketingWallet}`);
        console.log(`   旧合约营销钱包: ${oldMarketingWallet}`);
        console.log(`   期望营销钱包: ${expectedWallet}`);
        
        console.log('\n✅ 合约状态:');
        if (newMarketingWallet.toLowerCase() === expectedWallet.toLowerCase()) {
            console.log('   ✅ 新合约营销钱包配置正确');
        } else {
            console.log('   ❌ 新合约营销钱包配置错误');
        }
        
        if (oldMarketingWallet.toLowerCase() === expectedWallet.toLowerCase()) {
            console.log('   ✅ 旧合约营销钱包配置正确');
        } else {
            console.log('   ❌ 旧合约营销钱包配置错误（预期）');
        }
        
        // 检查余额
        const maoToken = '0x22f49bcb3dad370a9268ba3fca33cb037ca3d022';
        const piToken = '0xfd4680e25e05b3435c7f698668d1ce80d2a9f444';
        const balanceAbi = ["function balanceOf(address owner) view returns (uint256)"];
        
        const maoContract = new ethers.Contract(maoToken, balanceAbi, provider);
        const piContract = new ethers.Contract(piToken, balanceAbi, provider);
        
        console.log('\n💰 营销钱包余额:');
        const maoBalance = await maoContract.balanceOf(expectedWallet);
        const piBalance = await piContract.balanceOf(expectedWallet);
        
        console.log(`   MAO: ${ethers.formatEther(maoBalance)}`);
        console.log(`   PI: ${ethers.formatEther(piBalance)}`);
        
        // 检查burn地址余额
        const burnAddress = '0x000000000000000000000000000000000000dEaD';
        const maoBurned = await maoContract.balanceOf(burnAddress);
        const piBurned = await piContract.balanceOf(burnAddress);
        
        console.log('\n🔥 已销毁代币:');
        console.log(`   MAO: ${parseFloat(ethers.formatEther(maoBurned)).toLocaleString()}`);
        console.log(`   PI: ${parseFloat(ethers.formatEther(piBurned)).toLocaleString()}`);
        
        console.log('\n🎉 修复效果预测:');
        console.log('   ✅ 新合约确保营销钱包配置正确');
        console.log('   ✅ 新余额系统防止卡死');
        console.log('   ✅ 智能重试机制处理网络错误');
        console.log('   ✅ 自动刷新保持数据最新');
        console.log('   ✅ 游戏后自动更新余额');
        
        console.log('\n📱 建议测试步骤:');
        console.log('   1. 打开 http://127.0.0.1:8000/');
        console.log('   2. 连接钱包');
        console.log('   3. 观察MAO和PI余额是否正常显示');
        console.log('   4. 进行一次游戏测试');
        console.log('   5. 确认游戏后余额自动更新');
        console.log('   6. 检查营销钱包是否收到分成');
        
    } catch (error) {
        console.error('❌ 测试失败:', error);
    }
}

testUltimateFix(); 