// 🔧 最终Gas费用问题修复脚本
const fs = require('fs');
const path = require('path');

console.log('🔧 最终Gas费用问题修复...');
console.log('='.repeat(60));

// 问题分析
console.log('📋 问题分析:');
console.log('1. 当前使用旧合约地址 0xA9E4FD96B29e4f512a0a75E402C156B04D6E6c35');
console.log('2. 该合约营销钱包配置错误（指向奖金池地址）');
console.log('3. Gas费用问题可能由于合约方法调用方式不兼容');
console.log('4. 需要恢复到最原始的工作版本');

// 解决方案
console.log('\n🔧 解决方案:');
console.log('1. 保持使用旧合约地址（因为它有游戏记录）');
console.log('2. 移除所有Gas配置参数');
console.log('3. 恢复最简单的方法调用');
console.log('4. 优化错误处理');

console.log('\n' + '='.repeat(60));

// 需要修复的文件
const filesToFix = ['index.html'];

// 修复单个文件
function fixGasIssue(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  文件不存在: ${filePath}`);
        return false;
    }
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // 1. 确保使用旧合约地址（因为它有游戏数据）
        const contractPattern = /WHEEL_GAME: '0x[a-fA-F0-9]{40}'/g;
        if (content.match(contractPattern)) {
            content = content.replace(contractPattern, 
                "WHEEL_GAME: '0xA9E4FD96B29e4f512a0a75E402C156B04D6E6c35'");
            modified = true;
            console.log(`✅ 确认使用旧合约地址（有游戏数据）`);
        }
        
        // 2. 移除授权交易的复杂Gas配置，使用简单方式
        const approvePattern = /const approveTx = await tokenContract\.approve\(CONFIG\.CONTRACTS\.WHEEL_GAME, ethers\.constants\.MaxUint256, \{[\s\S]*?\}\);/g;
        if (content.match(approvePattern)) {
            content = content.replace(approvePattern, 
                `const approveTx = await tokenContract.approve(CONFIG.CONTRACTS.WHEEL_GAME, ethers.constants.MaxUint256);`);
            modified = true;
            console.log(`✅ 简化授权交易调用`);
        }
        
        // 3. 确保游戏方法调用不带参数
        const gameCallPattern = /const tx = gameState\.selectedToken === 'MAO' \? \s*await gameState\.contracts\.wheelGame\.playMAOGame\(\) : \s*await gameState\.contracts\.wheelGame\.playPIGame\(\);/g;
        if (!content.match(gameCallPattern)) {
            // 如果没有找到正确的调用方式，添加它
            const gameCallPlaceholder = /\/\/ 调用合约[\s\S]*?await gameState\.contracts\.wheelGame\.play[^;]*;/g;
            if (content.match(gameCallPlaceholder)) {
                content = content.replace(gameCallPlaceholder, 
                    `// 调用合约（最简单的方式）
                const tx = gameState.selectedToken === 'MAO' ? 
                    await gameState.contracts.wheelGame.playMAOGame() : 
                    await gameState.contracts.wheelGame.playPIGame();`);
                modified = true;
                console.log(`✅ 确保游戏方法调用不带参数`);
            }
        }
        
        // 4. 优化Gas错误处理
        const gasErrorPattern = /} else if \(error\.message\.includes\('gas'\)\) \{[\s\S]*?errorMessage = 'Gas费用问题，请稍后重试或增加Gas限制';/g;
        if (content.match(gasErrorPattern)) {
            content = content.replace(gasErrorPattern, 
                `} else if (error.message.includes('gas')) {
                    errorMessage = 'Gas费用问题，请稍后重试';`);
            modified = true;
            console.log(`✅ 优化Gas错误处理`);
        }
        
        // 5. 移除不必要的Gas配置代码
        const gasConfigPattern = /\/\/ Gas配置已注释[\s\S]*?\/\/ \};/g;
        if (content.match(gasConfigPattern)) {
            content = content.replace(gasConfigPattern, 
                `// 使用合约默认Gas设置`);
            modified = true;
            console.log(`✅ 移除不必要的Gas配置代码`);
        }
        
        // 6. 添加更好的错误提示
        const errorHandlingPattern = /alert\('❌ ' \+ errorMessage\);/g;
        if (content.match(errorHandlingPattern)) {
            content = content.replace(errorHandlingPattern, 
                `alert('❌ ' + errorMessage);
                console.log('🔍 错误详情:', error);
                console.log('💡 建议: 刷新页面重试，或检查钱包连接');`);
            modified = true;
            console.log(`✅ 添加更好的错误提示`);
        }
        
        if (modified) {
            // 创建备份
            const backupPath = `${filePath}.final-gas-fix.backup.${Date.now()}`;
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

// 主函数
function main() {
    console.log('🚀 开始最终Gas费用问题修复...');
    
    let fixedCount = 0;
    let totalCount = 0;
    
    filesToFix.forEach(fileName => {
        const filePath = path.join(__dirname, fileName);
        totalCount++;
        
        console.log(`\n🔧 处理文件: ${fileName}`);
        if (fixGasIssue(filePath)) {
            fixedCount++;
        }
    });
    
    console.log('\n' + '='.repeat(60));
    console.log(`📊 修复统计: ${fixedCount}/${totalCount} 文件已修复`);
    
    if (fixedCount > 0) {
        console.log('\n🎉 Gas费用问题修复完成！');
        console.log('\n💡 修复内容:');
        console.log('✅ 保持使用旧合约地址（有游戏数据）');
        console.log('✅ 移除复杂的Gas配置参数');
        console.log('✅ 恢复最简单的方法调用');
        console.log('✅ 优化错误处理和提示');
        
        console.log('\n🔍 测试步骤:');
        console.log('1. 清除浏览器缓存 (Cmd+Shift+Delete)');
        console.log('2. 重新打开游戏页面');
        console.log('3. 连接钱包');
        console.log('4. 尝试进行MAO游戏');
        console.log('5. 应该不会再出现Gas费用错误');
        
        console.log('\n⚠️  重要说明:');
        console.log('- 使用旧合约地址是因为它有游戏记录');
        console.log('- 营销钱包虽然配置错误，但游戏功能正常');
        console.log('- 这个修复专注于解决Gas费用问题');
        console.log('- 如果要修复营销钱包，需要部署新合约');
        
    } else {
        console.log('\n⚠️  没有文件需要修复，或者修复失败');
    }
}

// 运行修复
main(); 