// 🚨 紧急修复ethers.js库加载问题
const fs = require('fs');

console.log('🚨 紧急修复：ethers.js库加载问题');
console.log('='.repeat(70));

function fixEthersLoading() {
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
        
        // 1. 修复ethers.js script标签问题
        console.log('1️⃣ 修复ethers.js script标签...');
        
        // 查找并修复错误的script标签
        const brokenScriptPattern = /<script src="[^"]*ethers[^"]*">\s*(?!<\/script>)/;
        
        if (brokenScriptPattern.test(content)) {
            // 修复未正确关闭的script标签
            content = content.replace(
                /<script src="([^"]*ethers[^"]*)">\s*(?=\s*\/\/|\s*async|\s*function|\s*const|\s*let|\s*var)/,
                '<script src="$1"></script>\n    <script>'
            );
            modified = true;
            console.log('   ✅ 修复ethers.js script标签闭合问题');
        }
        
        // 2. 确保ethers.js在HTML head部分正确引入
        console.log('2️⃣ 确保ethers.js在head部分引入...');
        
        if (!content.includes('<script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>')) {
            // 在head结束前添加ethers.js
            content = content.replace(
                '</head>',
                '    <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>\n</head>'
            );
            modified = true;
            console.log('   ✅ 在head部分添加ethers.js引入');
        }
        
        // 3. 移除重复的ethers.js引入
        console.log('3️⃣ 移除重复的ethers.js引入...');
        
        const ethersScriptCount = (content.match(/ethers@5\.7\.2/g) || []).length;
        if (ethersScriptCount > 1) {
            // 保留head中的引入，移除其他位置的
            const headMatch = content.match(/<head>[\s\S]*?<\/head>/);
            if (headMatch) {
                const headContent = headMatch[0];
                if (headContent.includes('ethers@5.7.2')) {
                    // 移除head外的ethers引入
                    const bodyContent = content.replace(/<head>[\s\S]*?<\/head>/, '');
                    const cleanBodyContent = bodyContent.replace(
                        /<script src="[^"]*ethers[^"]*"[^>]*><\/script>/g,
                        ''
                    );
                    content = headContent + cleanBodyContent;
                    modified = true;
                    console.log('   ✅ 移除重复的ethers.js引入');
                }
            }
        }
        
        // 4. 添加ethers.js加载检查
        console.log('4️⃣ 添加ethers.js加载检查...');
        
        const ethersCheckScript = `
        // 🔍 ethers.js加载检查
        window.addEventListener('load', function() {
            if (typeof ethers === 'undefined') {
                console.error('❌ ethers.js未正确加载！');
                
                // 显示用户友好的错误提示
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = \`
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #ff4757;
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    z-index: 10000;
                    text-align: center;
                    font-family: Arial, sans-serif;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                \`;
                errorDiv.innerHTML = \`
                    <h3>🚨 网络错误</h3>
                    <p>区块链库加载失败，请刷新页面重试</p>
                    <button onclick="location.reload()" style="
                        background: white;
                        color: #ff4757;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        margin-top: 10px;
                        cursor: pointer;
                        font-weight: bold;
                    ">刷新页面</button>
                \`;
                document.body.appendChild(errorDiv);
            } else {
                console.log('✅ ethers.js加载成功');
            }
        });`;
        
        if (!content.includes('ethers.js加载检查')) {
            content = content.replace('</script>', ethersCheckScript + '\n    </script>');
            modified = true;
            console.log('   ✅ 添加ethers.js加载检查');
        }
        
        // 5. 修复可能的ethers版本兼容性问题
        console.log('5️⃣ 确保ethers版本兼容性...');
        
        // 将新版本ethers语法转换为v5语法
        if (content.includes('ethers.formatEther')) {
            content = content.replace(/ethers\.formatEther/g, 'ethers.utils.formatEther');
            modified = true;
            console.log('   ✅ 修复formatEther语法');
        }
        
        if (content.includes('new ethers.JsonRpcProvider')) {
            content = content.replace(/new ethers\.JsonRpcProvider/g, 'new ethers.providers.JsonRpcProvider');
            modified = true;
            console.log('   ✅ 修复JsonRpcProvider语法');
        }
        
        if (modified) {
            // 创建备份
            const backupPath = `${fileName}.ethers-fix.backup.${Date.now()}`;
            fs.writeFileSync(backupPath, fs.readFileSync(fileName, 'utf8'));
            
            // 保存修复后的文件
            fs.writeFileSync(fileName, content);
            console.log(`✅ ${fileName} ethers.js问题修复完成!`);
            console.log(`📁 备份: ${backupPath}`);
            totalFixed++;
        } else {
            console.log(`ℹ️ ${fileName} ethers.js正常`);
        }
    });
    
    return totalFixed;
}

// 执行修复
console.log('🚨 开始紧急修复ethers.js问题...\n');

const fixedCount = fixEthersLoading();

console.log('\n🎉 ethers.js问题修复完成！');
console.log('='.repeat(70));
console.log(`✅ 修复文件数量: ${fixedCount}`);
console.log('\n🔧 修复内容:');
console.log('   ✅ 修复ethers.js script标签闭合问题');
console.log('   ✅ 确保ethers.js在head部分正确引入');
console.log('   ✅ 移除重复的ethers.js引入');
console.log('   ✅ 添加ethers.js加载检查');
console.log('   ✅ 修复ethers版本兼容性问题');
console.log('\n💡 预期效果:');
console.log('   🎯 ethers.js正确加载');
console.log('   🎯 连接钱包功能正常');
console.log('   🎯 余额查询正常工作');
console.log('   🎯 消除"ethers is not defined"错误'); 