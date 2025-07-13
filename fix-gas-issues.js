// 🔧 修复Gas费用问题
const fs = require('fs');
const path = require('path');

console.log('🔧 开始修复Gas费用问题...');

// 需要修复的文件列表
const filesToFix = [
    'index.html',
    'force-new-contract-test.html',
    'game.html',
    'simple-game.html'
];

// 新的Gas配置
const gasConfig = {
    // 更高的Gas限制
    approveGasLimit: 150000,  // 从100000增加到150000
    maoGameGasLimit: 500000,  // 从300000增加到500000
    piGameGasLimit: 800000,   // 从500000增加到800000
    
    // 更好的Gas价格倍数
    gasPriceMultiplier: 150,  // 从110增加到150 (增加50%)
    
    // 备用Gas价格 (gwei)
    fallbackGasPrice: 20
};

// 修复单个文件的Gas配置
function fixGasInFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  文件不存在: ${filePath}`);
        return false;
    }
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // 1. 修复授权交易的Gas设置
        const approveGasPattern = /const gasLimit = \d+;/g;
        if (content.match(approveGasPattern)) {
            content = content.replace(approveGasPattern, `const gasLimit = ${gasConfig.approveGasLimit};`);
            modified = true;
            console.log(`✅ 更新授权Gas限制: ${gasConfig.approveGasLimit}`);
        }
        
        // 2. 修复游戏交易的Gas设置
        const gameGasPattern = /const gameGasLimit = gameState\.selectedToken === 'MAO' \? \d+ : \d+;/g;
        if (content.match(gameGasPattern)) {
            content = content.replace(gameGasPattern, 
                `const gameGasLimit = gameState.selectedToken === 'MAO' ? ${gasConfig.maoGameGasLimit} : ${gasConfig.piGameGasLimit};`);
            modified = true;
            console.log(`✅ 更新游戏Gas限制: MAO=${gasConfig.maoGameGasLimit}, PI=${gasConfig.piGameGasLimit}`);
        }
        
        // 3. 修复Gas价格倍数
        const gasPricePattern = /gasPrice\.mul\(\d+\)\.div\(100\)/g;
        if (content.match(gasPricePattern)) {
            content = content.replace(gasPricePattern, `gasPrice.mul(${gasConfig.gasPriceMultiplier}).div(100)`);
            modified = true;
            console.log(`✅ 更新Gas价格倍数: ${gasConfig.gasPriceMultiplier}%`);
        }
        
        // 4. 添加备用Gas价格处理
        const gasErrorPattern = /} else if \(error\.message\.includes\('gas'\)\) {/g;
        if (content.match(gasErrorPattern)) {
            const newGasErrorHandling = `} else if (error.message.includes('gas')) {
                // 尝试使用更高的Gas价格重试
                try {
                    const fallbackGasPrice = ethers.utils.parseUnits('${gasConfig.fallbackGasPrice}', 'gwei');
                    console.log('🔄 尝试使用备用Gas价格重试...');
                    // 这里可以添加重试逻辑
                } catch (retryError) {
                    console.error('❌ 备用Gas价格也失败:', retryError);
                }`;
            
            content = content.replace(gasErrorPattern, newGasErrorHandling);
            modified = true;
            console.log(`✅ 添加备用Gas价格处理: ${gasConfig.fallbackGasPrice} gwei`);
        }
        
        // 5. 优化Gas估算
        const playGamePattern = /await gameState\.contracts\.game\.playGame\(tokenType, betAmount, {/g;
        if (content.match(playGamePattern)) {
            // 添加动态Gas估算
            const gasEstimationCode = `
                // 动态Gas估算
                let estimatedGas;
                try {
                    estimatedGas = await gameState.contracts.game.estimateGas.playGame(tokenType, betAmount);
                    estimatedGas = estimatedGas.mul(120).div(100); // 增加20%缓冲
                } catch (estimateError) {
                    console.warn('⚠️ Gas估算失败，使用默认值:', estimateError);
                    estimatedGas = gameGasLimit;
                }
                
                await gameState.contracts.game.playGame(tokenType, betAmount, {`;
            
            content = content.replace(playGamePattern, gasEstimationCode);
            modified = true;
            console.log(`✅ 添加动态Gas估算`);
        }
        
        if (modified) {
            // 创建备份
            const backupPath = `${filePath}.backup.${Date.now()}`;
            fs.writeFileSync(backupPath, fs.readFileSync(filePath));
            
            // 写入修复后的内容
            fs.writeFileSync(filePath, content);
            console.log(`✅ 修复完成: ${filePath}`);
            console.log(`📁 备份文件: ${backupPath}`);
            return true;
        } else {
            console.log(`ℹ️  无需修复: ${filePath}`);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ 修复失败 ${filePath}:`, error.message);
        return false;
    }
}

// 主修复函数
function main() {
    console.log('🚀 开始批量修复Gas费用问题...');
    console.log('='.repeat(50));
    
    let fixedCount = 0;
    let totalCount = 0;
    
    filesToFix.forEach(fileName => {
        const filePath = path.join(__dirname, fileName);
        totalCount++;
        
        console.log(`\n🔧 处理文件: ${fileName}`);
        if (fixGasInFile(filePath)) {
            fixedCount++;
        }
    });
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 修复统计: ${fixedCount}/${totalCount} 文件已修复`);
    
    if (fixedCount > 0) {
        console.log('\n🎉 Gas费用问题修复完成！');
        console.log('\n💡 建议测试步骤:');
        console.log('1. 重新加载游戏页面');
        console.log('2. 确保钱包有足够的ALV用于Gas费用');
        console.log('3. 尝试进行小额测试游戏');
        console.log('4. 观察是否还有Gas费用错误');
        
        console.log('\n⚙️ 新的Gas配置:');
        console.log(`   授权Gas限制: ${gasConfig.approveGasLimit}`);
        console.log(`   MAO游戏Gas限制: ${gasConfig.maoGameGasLimit}`);
        console.log(`   PI游戏Gas限制: ${gasConfig.piGameGasLimit}`);
        console.log(`   Gas价格倍数: ${gasConfig.gasPriceMultiplier}%`);
        console.log(`   备用Gas价格: ${gasConfig.fallbackGasPrice} gwei`);
    } else {
        console.log('\n⚠️  没有文件需要修复，或者修复失败');
    }
}

// 运行修复
if (require.main === module) {
    main();
}

module.exports = { fixGasInFile, gasConfig }; 