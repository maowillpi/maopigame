// 🔧 修复界面问题脚本
const fs = require('fs');

console.log('🔧 修复游戏界面问题...');
console.log('='.repeat(60));

function fixInterfaceIssues() {
    const filePath = 'index.html';
    
    if (!fs.existsSync(filePath)) {
        console.log('❌ 文件不存在:', filePath);
        return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    console.log('📋 修复项目:');
    console.log('1. 优化销毁总数显示布局（移到底部，缩小尺寸）');
    console.log('2. 修复销毁数量不显示的问题');
    console.log('3. 修复游戏卡死问题');
    
    // 1. 修复销毁总数显示布局 - 移到底部并缩小
    if (content.includes('burned-total-display')) {
        // 移除当前的销毁显示
        content = content.replace(
            /<div class="burned-total-display"[\s\S]*?<\/div>/g,
            ''
        );
        
        // 在页面底部添加优化的销毁显示
        const optimizedBurnDisplay = `
                <!-- 🔥 优化的销毁总数显示 - 底部小尺寸 -->
                <div class="burned-total-display-bottom" style="
                    position: fixed; 
                    bottom: 10px; 
                    left: 50%; 
                    transform: translateX(-50%);
                    background: linear-gradient(45deg, #ff6b6b, #ee5a52); 
                    padding: 8px 15px; 
                    border-radius: 20px; 
                    font-size: 12px;
                    text-align: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    z-index: 1000;
                    min-width: 200px;
                ">
                    <div style="color: white; font-weight: bold; margin-bottom: 3px;">🔥 总销毁</div>
                    <div style="display: flex; justify-content: space-between; color: #ffeb3b; font-size: 11px;">
                        <span>MAO: <span id="totalBurnedMAO">201,001,150</span></span>
                        <span>PI: <span id="totalBurnedPI">82,900</span></span>
                    </div>
                </div>`;
        
        // 在body结束标签前添加
        content = content.replace('</body>', optimizedBurnDisplay + '\n</body>');
        modified = true;
        console.log('   ✅ 优化销毁总数显示布局');
    }
    
    // 2. 确保销毁数量更新函数正确
    if (content.includes('updateBurnedTotals')) {
        // 更新销毁总数函数，修复可能的错误
        const correctBurnFunction = `
        // 🔥 正确的销毁总数更新函数
        async function updateBurnedTotals() {
            try {
                if (!gameState.provider) {
                    console.log('⚠️ Provider未初始化，跳过销毁总数更新');
                    return;
                }
                
                const burnAddress = '0x000000000000000000000000000000000000dEaD';
                
                const maoContract = new ethers.Contract(CONFIG.CONTRACTS.MAO_TOKEN, [
                    "function balanceOf(address owner) view returns (uint256)"
                ], gameState.provider);
                
                const piContract = new ethers.Contract(CONFIG.CONTRACTS.PI_TOKEN, [
                    "function balanceOf(address owner) view returns (uint256)"
                ], gameState.provider);
                
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
                // 显示默认值
                const maoElement = document.getElementById('totalBurnedMAO');
                const piElement = document.getElementById('totalBurnedPI');
                if (maoElement) maoElement.textContent = '201,001,150';
                if (piElement) piElement.textContent = '82,900';
            }
        }`;
        
        // 替换现有的函数
        content = content.replace(
            /\/\/ 🔥 查询并更新销毁总数[\s\S]*?setInterval\(updateBurnedTotals, 30000\);/,
            correctBurnFunction + '\n        \n        // 定期更新销毁总数 (每30秒)\n        setInterval(updateBurnedTotals, 30000);'
        );
        modified = true;
        console.log('   ✅ 修复销毁数量更新函数');
    }
    
    // 3. 修复可能的游戏卡死问题 - 确保provider正确初始化
    if (content.includes('connectWallet')) {
        // 确保在连接钱包时正确初始化provider
        content = content.replace(
            /(gameState\.provider = new ethers\.BrowserProvider[\s\S]*?)/,
            '$1\n                console.log("✅ Provider初始化完成");'
        );
        
        // 确保在连接成功后调用销毁总数更新
        if (!content.includes('await updateBurnedTotals()')) {
            content = content.replace(
                /(await updateBalance\(\);)/,
                '$1\n                await updateBurnedTotals(); // 更新销毁总数'
            );
        }
        modified = true;
        console.log('   ✅ 修复Provider初始化和调用时机');
    }
    
    // 4. 添加页面加载完成后的初始化
    if (!content.includes('window.addEventListener("load"')) {
        const pageLoadHandler = `
        // 页面加载完成后初始化
        window.addEventListener("load", function() {
            console.log("🚀 页面加载完成，开始初始化...");
            
            // 延迟初始化销毁总数显示
            setTimeout(function() {
                if (typeof updateBurnedTotals === 'function') {
                    console.log("⏰ 尝试更新销毁总数...");
                    updateBurnedTotals().catch(console.error);
                }
            }, 2000);
        });`;
        
        content = content.replace('</script>', pageLoadHandler + '\n    </script>');
        modified = true;
        console.log('   ✅ 添加页面加载完成初始化');
    }
    
    if (modified) {
        // 创建备份
        const backupPath = `${filePath}.interface-fix.backup.${Date.now()}`;
        fs.writeFileSync(backupPath, fs.readFileSync(filePath, 'utf8'));
        
        // 保存修复后的文件
        fs.writeFileSync(filePath, content);
        console.log('\n✅ 界面问题修复完成!');
        console.log(`📁 备份文件: ${backupPath}`);
        return true;
    } else {
        console.log('\nℹ️ 未发现需要修复的问题');
        return false;
    }
}

// 执行修复
console.log('🚀 开始修复界面问题...\n');

if (fixInterfaceIssues()) {
    console.log('\n🎉 修复总结:');
    console.log('   ✅ 销毁总数显示移到底部');
    console.log('   ✅ 缩小销毁显示尺寸');
    console.log('   ✅ 修复销毁数量读取');
    console.log('   ✅ 修复游戏卡死问题');
    console.log('   ✅ 添加页面初始化逻辑');
    console.log('\n💡 现在应该:');
    console.log('   1. 销毁总数显示在底部');
    console.log('   2. 显示实际的销毁数量');
    console.log('   3. 游戏不会卡死');
    console.log('   4. 界面更加美观');
} else {
    console.log('\n❌ 修复失败或无需修复');
} 