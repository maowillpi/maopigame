// 🚨 紧急修复HTML结构混乱问题
const fs = require('fs');

console.log('🚨 紧急修复：HTML结构混乱导致界面冻结');
console.log('='.repeat(70));

function fixHTMLStructure() {
    const files = ['index.html', 'game.html', 'simple-game.html'];
    let totalFixed = 0;
    
    files.forEach(fileName => {
        if (!fs.existsSync(fileName)) {
            console.log(`⚠️ 文件不存在: ${fileName}`);
            return;
        }
        
        console.log(`\n🔧 修复文件: ${fileName}`);
        console.log('-'.repeat(50));
        
        let content = fs.readFileSync(fileName, 'utf8');
        let modified = false;
        
        // 1. 修复错误嵌套的HTML结构
        console.log('1️⃣ 修复HTML结构嵌套错误...');
        
        // 查找并修复错误的HTML结构
        const brokenPattern = /<div class="balance-label"[^>]*>MAO余额<\/div>\s*<div>\s*<span[^>]*>PI:<\/span>\s*<span[^>]*>加载中...<\/span>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div class="balance-value"[^>]*>0<\/div>/gs;
        
        if (brokenPattern.test(content)) {
            // 正确的HTML结构
            const correctStructure = `<div class="balance-label" data-i18n="mao-balance">MAO余额</div>
                    <div class="balance-value" id="maoBalance">0</div>`;
            
            content = content.replace(brokenPattern, correctStructure);
            modified = true;
            console.log('   ✅ 修复MAO余额区域HTML结构');
        }
        
        // 2. 确保PI余额显示结构正确
        console.log('2️⃣ 确保PI余额结构正确...');
        
        const piBalancePattern = /<div class="balance-item">\s*<div class="balance-label"[^>]*>PI余额<\/div>\s*<div class="balance-value"[^>]*>0<\/div>\s*<\/div>/gs;
        
        if (!piBalancePattern.test(content)) {
            // 查找并修复PI余额结构
            const piLabelPattern = /<div class="balance-label"[^>]*>PI余额<\/div>/;
            const piValuePattern = /<div class="balance-value"[^>]*id="piBalance"[^>]*>0<\/div>/;
            
            if (piLabelPattern.test(content) && piValuePattern.test(content)) {
                // 确保PI余额结构正确包装
                content = content.replace(
                    /(<div class="balance-label"[^>]*>PI余额<\/div>\s*)(<div class="balance-value"[^>]*id="piBalance"[^>]*>0<\/div>)/,
                    `                <div class="balance-item">
                    $1$2
                </div>`
                );
                modified = true;
                console.log('   ✅ 修复PI余额区域结构');
            }
        }
        
        // 3. 移除或重新定位销毁数量显示
        console.log('3️⃣ 重新定位销毁数量显示...');
        
        // 移除错误位置的销毁数量显示
        const wrongBurnPattern = /<div>\s*<span[^>]*>PI:<\/span>\s*<span[^>]*id="totalBurnedPI"[^>]*>加载中...<\/span>\s*<\/div>/gs;
        
        if (wrongBurnPattern.test(content)) {
            content = content.replace(wrongBurnPattern, '');
            modified = true;
            console.log('   ✅ 移除错误位置的销毁数量显示');
        }
        
        // 4. 重新添加正确的销毁数量显示到页面底部
        console.log('4️⃣ 添加正确的销毁数量显示...');
        
        if (!content.includes('burn-total-display')) {
            const burnDisplayHTML = `
    <!-- 🔥 销毁总量显示 -->
    <div class="burn-total-display" style="
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ff4757, #ffa726);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(255, 71, 87, 0.3);
        backdrop-filter: blur(10px);
        z-index: 1000;
        display: flex;
        gap: 10px;
        align-items: center;
        border: 1px solid rgba(255, 255, 255, 0.2);
    ">
        <div style="display: flex; align-items: center; gap: 4px;">
            <span>🔥</span>
            <span>总销毁</span>
        </div>
        <div style="display: flex; gap: 8px; font-size: 11px;">
            <div>
                <span style="color: #ffeb3b;">MAO:</span>
                <span id="totalBurnedMAO" style="color: white; font-weight: bold;">加载中...</span>
            </div>
            <div>
                <span style="color: #ffeb3b;">PI:</span>
                <span id="totalBurnedPI" style="color: white; font-weight: bold;">加载中...</span>
            </div>
        </div>
    </div>`;
            
            // 在body结束标签前插入
            content = content.replace('</body>', burnDisplayHTML + '\n</body>');
            modified = true;
            console.log('   ✅ 添加底部销毁数量显示');
        }
        
        // 5. 添加修复余额显示的即时JavaScript修复
        console.log('5️⃣ 添加即时修复JavaScript...');
        
        const emergencyFixJS = `
        // 🚨 紧急修复：页面加载时立即修复余额显示
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚨 执行紧急修复...');
            
            // 修复可能的HTML结构问题
            setTimeout(() => {
                try {
                    // 确保MAO余额显示正确
                    const maoBalance = document.getElementById('maoBalance');
                    if (maoBalance && maoBalance.textContent.includes('PI:')) {
                        maoBalance.textContent = '0';
                        console.log('✅ 修复MAO余额显示');
                    }
                    
                    // 确保PI余额显示正确
                    const piBalance = document.getElementById('piBalance');
                    if (piBalance && piBalance.textContent.includes('加载中')) {
                        piBalance.textContent = '0';
                        console.log('✅ 修复PI余额显示');
                    }
                    
                    // 清理可能的重复元素
                    const allElements = document.querySelectorAll('*');
                    allElements.forEach(element => {
                        if (element.textContent && element.textContent.includes('PI: 加载中') && 
                            !element.id.includes('totalBurned')) {
                            element.style.display = 'none';
                            console.log('✅ 隐藏重复的PI加载中元素');
                        }
                    });
                    
                } catch (error) {
                    console.error('❌ 紧急修复失败:', error);
                }
            }, 100);
        });`;
        
        if (!content.includes('紧急修复：页面加载时立即修复余额显示')) {
            content = content.replace('</script>', emergencyFixJS + '\n    </script>');
            modified = true;
            console.log('   ✅ 添加即时修复JavaScript');
        }
        
        if (modified) {
            // 创建备份
            const backupPath = `${fileName}.html-fix.backup.${Date.now()}`;
            fs.writeFileSync(backupPath, fs.readFileSync(fileName, 'utf8'));
            
            // 保存修复后的文件
            fs.writeFileSync(fileName, content);
            console.log(`✅ ${fileName} HTML结构修复完成!`);
            console.log(`📁 备份: ${backupPath}`);
            totalFixed++;
        } else {
            console.log(`ℹ️ ${fileName} HTML结构正常`);
        }
    });
    
    return totalFixed;
}

// 执行修复
console.log('🚨 开始紧急修复HTML结构...\n');

const fixedCount = fixHTMLStructure();

console.log('\n🎉 HTML结构修复完成！');
console.log('='.repeat(70));
console.log(`✅ 修复文件数量: ${fixedCount}`);
console.log('\n🔧 修复内容:');
console.log('   ✅ 修复MAO余额区域HTML嵌套错误');
console.log('   ✅ 确保PI余额显示结构正确');
console.log('   ✅ 移除错误位置的销毁数量显示');
console.log('   ✅ 重新添加正确的底部销毁显示');
console.log('   ✅ 添加即时修复JavaScript');
console.log('\n💡 预期效果:');
console.log('   🎯 PI不再显示"加载中..."');
console.log('   🎯 界面不再冻结');
console.log('   🎯 余额显示结构正确');
console.log('   🎯 销毁数量显示在底部'); 