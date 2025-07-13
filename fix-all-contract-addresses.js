// 🔧 批量修复所有HTML文件中的合约地址
const fs = require('fs');
const path = require('path');

// 配置
const OLD_CONTRACT_ADDRESS = '0xA9E4FD96B29e4f512a0a75E402C156B04D6E6c35';
const NEW_CONTRACT_ADDRESS = '0xB677DBcA76061E6301272c83179c8243A4eeB6A5';

// 获取所有HTML文件
function getAllHtmlFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            files.push(...getAllHtmlFiles(fullPath));
        } else if (item.endsWith('.html')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

// 修复单个文件
function fixContractAddress(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 检查是否包含旧地址
        if (content.includes(OLD_CONTRACT_ADDRESS)) {
            console.log(`🔧 修复文件: ${filePath}`);
            
            // 替换旧地址为新地址
            const newContent = content.replace(
                new RegExp(OLD_CONTRACT_ADDRESS, 'g'),
                NEW_CONTRACT_ADDRESS
            );
            
            // 写入文件
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`✅ 已修复: ${filePath}`);
            return true;
        } else if (content.includes(NEW_CONTRACT_ADDRESS)) {
            console.log(`✅ 已是正确地址: ${filePath}`);
            return false;
        } else {
            console.log(`⚪ 无合约地址: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ 修复失败: ${filePath} - ${error.message}`);
        return false;
    }
}

// 主函数
function main() {
    console.log('🚀 开始批量修复合约地址...');
    console.log(`📍 旧地址: ${OLD_CONTRACT_ADDRESS}`);
    console.log(`📍 新地址: ${NEW_CONTRACT_ADDRESS}`);
    console.log('='.repeat(60));
    
    const htmlFiles = getAllHtmlFiles('.');
    console.log(`📊 找到 ${htmlFiles.length} 个HTML文件`);
    
    let fixedCount = 0;
    let correctCount = 0;
    
    for (const file of htmlFiles) {
        const result = fixContractAddress(file);
        if (result) {
            fixedCount++;
        } else if (fs.readFileSync(file, 'utf8').includes(NEW_CONTRACT_ADDRESS)) {
            correctCount++;
        }
    }
    
    console.log('\n📋 修复完成报告:');
    console.log('='.repeat(60));
    console.log(`✅ 已修复文件: ${fixedCount} 个`);
    console.log(`✅ 已正确文件: ${correctCount} 个`);
    console.log(`📊 总计处理: ${htmlFiles.length} 个`);
    
    if (fixedCount > 0) {
        console.log('\n🎉 合约地址修复完成！');
        console.log('\n💡 下一步操作:');
        console.log('1. 清除浏览器缓存 (Ctrl+Shift+Delete)');
        console.log('2. 重新加载游戏页面');
        console.log('3. 进行测试游戏验证修复效果');
    } else {
        console.log('\n✅ 所有文件已使用正确的合约地址！');
    }
}

// 运行脚本
if (require.main === module) {
    main();
}

module.exports = { main }; 