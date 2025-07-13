// 🔄 恢复原始合约地址
const fs = require('fs');
const path = require('path');

console.log('🔄 恢复原始合约地址...');

// 原始合约地址（用户说这个是正常工作的）
const ORIGINAL_CONTRACT = '0xA9E4FD96B29e4f512a0a75E402C156B04D6E6c35';
const NEW_CONTRACT = '0xB677DBcA76061E6301272c83179c8243A4eeB6A5';

// 需要恢复的文件列表
const filesToRestore = [
    'index.html',
    'force-new-contract-test.html',
    'game.html',
    'simple-game.html'
];

// 恢复单个文件的合约地址
function restoreContractInFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  文件不存在: ${filePath}`);
        return false;
    }
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // 查找并替换合约地址
        const contractPattern = new RegExp(NEW_CONTRACT, 'g');
        if (content.includes(NEW_CONTRACT)) {
            content = content.replace(contractPattern, ORIGINAL_CONTRACT);
            modified = true;
            console.log(`✅ 恢复合约地址: ${NEW_CONTRACT} → ${ORIGINAL_CONTRACT}`);
        }
        
        if (modified) {
            // 创建备份
            const backupPath = `${filePath}.restore.backup.${Date.now()}`;
            fs.writeFileSync(backupPath, fs.readFileSync(filePath));
            
            // 写入恢复后的内容
            fs.writeFileSync(filePath, content);
            console.log(`✅ 恢复完成: ${filePath}`);
            console.log(`📁 备份文件: ${backupPath}`);
            return true;
        } else {
            console.log(`ℹ️  无需恢复: ${filePath}`);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ 恢复失败 ${filePath}:`, error.message);
        return false;
    }
}

// 主恢复函数
function main() {
    console.log('🚀 开始恢复原始合约地址...');
    console.log('='.repeat(50));
    console.log(`🔄 恢复到原始合约: ${ORIGINAL_CONTRACT}`);
    console.log(`📝 原因: 用户确认原始分配机制正常工作`);
    console.log('='.repeat(50));
    
    let restoredCount = 0;
    let totalCount = 0;
    
    filesToRestore.forEach(fileName => {
        const filePath = path.join(__dirname, fileName);
        totalCount++;
        
        console.log(`\n🔧 处理文件: ${fileName}`);
        if (restoreContractInFile(filePath)) {
            restoredCount++;
        }
    });
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 恢复统计: ${restoredCount}/${totalCount} 文件已恢复`);
    
    if (restoredCount > 0) {
        console.log('\n🎉 合约地址恢复完成！');
        console.log('\n💡 现在的配置:');
        console.log(`   合约地址: ${ORIGINAL_CONTRACT}`);
        console.log(`   营销钱包: 0x861A48051eFaA1876D4B38904516C9F7bbCca36d`);
        console.log(`   奖金池: 0xE15881Fc413c6cd47a512C24608F94Fa2896b374`);
        
        console.log('\n⚙️ 优化的Gas配置已保留:');
        console.log('   授权Gas限制: 150000');
        console.log('   MAO游戏Gas限制: 500000');
        console.log('   PI游戏Gas限制: 800000');
        console.log('   Gas价格倍数: 150%');
        
        console.log('\n🔍 下一步测试:');
        console.log('1. 重新加载游戏页面');
        console.log('2. 确保钱包有足够的ALV用于Gas费用');
        console.log('3. 尝试进行MAO游戏测试');
        console.log('4. 检查营销钱包是否收到20 MAO');
        
        console.log('\n⚠️  重要提醒:');
        console.log('如果营销钱包仍然没有收到分配，问题可能是:');
        console.log('- Gas费用不足');
        console.log('- 网络拥堵');
        console.log('- 需要更高的Gas价格');
        
    } else {
        console.log('\n⚠️  没有文件需要恢复，或者恢复失败');
    }
}

// 运行恢复
if (require.main === module) {
    main();
}

module.exports = { restoreContractInFile, ORIGINAL_CONTRACT }; 