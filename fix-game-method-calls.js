// 🔧 修复游戏方法调用问题
const fs = require('fs');
const path = require('path');

console.log('🔧 修复游戏方法调用问题...');

// 需要修复的文件列表
const filesToFix = [
    'index.html',
    'force-new-contract-test.html',
    'game.html',
    'simple-game.html'
];

// 修复单个文件的游戏方法调用
function fixGameMethodCalls(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  文件不存在: ${filePath}`);
        return false;
    }
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // 1. 修复playMAOGame和playPIGame调用，移除gas选项参数
        const gameCallPattern = /await gameState\.contracts\.wheelGame\.play(MAO|PI)Game\(gameOptions\)/g;
        if (content.match(gameCallPattern)) {
            content = content.replace(
                /await gameState\.contracts\.wheelGame\.playMAOGame\(gameOptions\)/g,
                'await gameState.contracts.wheelGame.playMAOGame()'
            );
            content = content.replace(
                /await gameState\.contracts\.wheelGame\.playPIGame\(gameOptions\)/g,
                'await gameState.contracts.wheelGame.playPIGame()'
            );
            modified = true;
            console.log(`✅ 修复游戏方法调用: 移除gas选项参数`);
        }
        
        // 2. 检查是否有新的playGame方法调用（如果存在的话）
        const newGameCallPattern = /await gameState\.contracts\.game\.playGame\(tokenType, betAmount, \{/g;
        if (content.match(newGameCallPattern)) {
            // 如果使用的是新的playGame方法，保持gas配置
            console.log(`ℹ️  检测到新的playGame方法，保持gas配置`);
        }
        
        // 3. 修复gas配置代码（如果不需要的话，可以注释掉）
        const gasConfigPattern = /\/\/ 优化游戏交易的gas设置[\s\S]*?const gameOptions = \{[\s\S]*?\};/g;
        if (content.match(gasConfigPattern) && content.includes('playMAOGame()') && content.includes('playPIGame()')) {
            // 如果使用的是旧的方法，注释掉gas配置
            content = content.replace(gasConfigPattern, 
                `// Gas配置已注释（旧方法不需要）
                // const gameGasLimit = gameState.selectedToken === 'MAO' ? 500000 : 800000;
                // const gameGasPrice = await gameState.provider.getGasPrice();
                // const gameOptions = {
                //     gasLimit: gameGasLimit,
                //     gasPrice: gameGasPrice.mul(150).div(100)
                // };`);
            modified = true;
            console.log(`✅ 注释掉不需要的gas配置`);
        }
        
        // 4. 确保合约ABI正确
        const abiPattern = /"function playMAOGame\(\) external"/g;
        if (!content.match(abiPattern)) {
            console.log(`⚠️  警告: 未找到正确的playMAOGame ABI定义`);
        }
        
        if (modified) {
            // 创建备份
            const backupPath = `${filePath}.method.backup.${Date.now()}`;
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
    console.log('🚀 开始修复游戏方法调用问题...');
    console.log('='.repeat(50));
    console.log('📋 问题分析:');
    console.log('   原始版本: playMAOGame() 和 playPIGame() 不接受参数');
    console.log('   当前版本: 错误地传入了gas选项参数');
    console.log('   解决方案: 移除gas选项参数，恢复原始调用方式');
    console.log('='.repeat(50));
    
    let fixedCount = 0;
    let totalCount = 0;
    
    filesToFix.forEach(fileName => {
        const filePath = path.join(__dirname, fileName);
        totalCount++;
        
        console.log(`\n🔧 处理文件: ${fileName}`);
        if (fixGameMethodCalls(filePath)) {
            fixedCount++;
        }
    });
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 修复统计: ${fixedCount}/${totalCount} 文件已修复`);
    
    if (fixedCount > 0) {
        console.log('\n🎉 游戏方法调用修复完成！');
        console.log('\n💡 修复内容:');
        console.log('✅ 移除了playMAOGame()和playPIGame()的gas选项参数');
        console.log('✅ 恢复了原始的无参数调用方式');
        console.log('✅ 注释了不必要的gas配置代码');
        
        console.log('\n🔍 下一步测试:');
        console.log('1. 重新加载游戏页面');
        console.log('2. 连接钱包');
        console.log('3. 尝试进行MAO游戏测试');
        console.log('4. 应该不会再出现Gas费用错误');
        console.log('5. 检查营销钱包是否收到20 MAO');
        
        console.log('\n⚠️  重要说明:');
        console.log('这个修复恢复了原始的工作方式，应该能解决Gas费用问题');
        console.log('原始合约的设计就是不需要手动指定gas参数的');
        
    } else {
        console.log('\n⚠️  没有文件需要修复，或者修复失败');
    }
}

// 运行修复
if (require.main === module) {
    main();
}

module.exports = { fixGameMethodCalls }; 