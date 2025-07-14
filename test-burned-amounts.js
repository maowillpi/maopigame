// 🔥 测试销毁地址余额脚本
require('dotenv').config();
const { ethers } = require("ethers");

console.log('🔥 测试销毁地址余额...');
console.log('='.repeat(60));

async function main() {
    try {
        // 连接到区块链
        const provider = new ethers.JsonRpcProvider('https://elves-core2.alvey.io/');
        console.log('✅ 已连接到AlveyChain网络');
        
        // 配置
        const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD';
        const MAO_TOKEN = '0x22f49bcb3dad370a9268ba3fca33cb037ca3d022';
        const PI_TOKEN = '0xfd4680e25e05b3435c7f698668d1ce80d2a9f444';
        
        // ERC20 ABI
        const ERC20_ABI = [
            "function balanceOf(address owner) view returns (uint256)",
            "function symbol() view returns (string)",
            "function decimals() view returns (uint8)"
        ];
        
        // 创建合约实例
        const maoContract = new ethers.Contract(MAO_TOKEN, ERC20_ABI, provider);
        const piContract = new ethers.Contract(PI_TOKEN, ERC20_ABI, provider);
        
        console.log('\n📊 查询销毁地址余额...');
        console.log(`销毁地址: ${BURN_ADDRESS}`);
        
        // 查询余额
        const maoBalance = await maoContract.balanceOf(BURN_ADDRESS);
        const piBalance = await piContract.balanceOf(BURN_ADDRESS);
        
        // 格式化显示
        const maoFormatted = parseFloat(ethers.formatEther(maoBalance));
        const piFormatted = parseFloat(ethers.formatEther(piBalance));
        
        console.log('\n🔥 销毁总数:');
        console.log(`   MAO: ${maoFormatted.toLocaleString()} (原始值: ${maoBalance.toString()})`);
        console.log(`   PI: ${piFormatted.toLocaleString()} (原始值: ${piBalance.toString()})`);
        
        // 前端JavaScript代码生成
        console.log('\n📝 前端代码示例:');
        console.log(`
// 更新销毁总数的函数
async function updateBurnedTotals() {
    try {
        const burnAddress = '${BURN_ADDRESS}';
        
        const maoContract = new ethers.Contract('${MAO_TOKEN}', [
            "function balanceOf(address owner) view returns (uint256)"
        ], provider);
        
        const piContract = new ethers.Contract('${PI_TOKEN}', [
            "function balanceOf(address owner) view returns (uint256)"
        ], provider);
        
        const maoBalance = await maoContract.balanceOf(burnAddress);
        const piBalance = await piContract.balanceOf(burnAddress);
        
        // 更新显示
        const maoElement = document.getElementById('totalBurnedMAO');
        const piElement = document.getElementById('totalBurnedPI');
        
        if (maoElement) {
            maoElement.textContent = parseFloat(ethers.formatEther(maoBalance)).toLocaleString();
        }
        if (piElement) {
            piElement.textContent = parseFloat(ethers.formatEther(piBalance)).toLocaleString();
        }
        
        console.log('🔥 销毁总数更新完成');
        
    } catch (error) {
        console.error('❌ 查询销毁总数失败:', error);
        // 显示错误信息
        const maoElement = document.getElementById('totalBurnedMAO');
        const piElement = document.getElementById('totalBurnedPI');
        if (maoElement) maoElement.textContent = '查询失败';
        if (piElement) piElement.textContent = '查询失败';
    }
}
        `);
        
    } catch (error) {
        console.error('❌ 测试失败:', error);
    }
}

main(); 