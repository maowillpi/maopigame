// 🔧 修复加载和卡死问题脚本
const fs = require('fs');

console.log('🔧 修复MAO加载中和界面卡死问题...');
console.log('='.repeat(70));

function fixLoadingIssues() {
    const filePath = 'index.html';
    
    if (!fs.existsSync(filePath)) {
        console.log('❌ 文件不存在:', filePath);
        return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    console.log('📋 诊断问题:');
    console.log('1. MAO余额显示"加载中..."不更新');
    console.log('2. PI余额正常显示，说明部分功能正常');
    console.log('3. 界面卡死，可能是异步调用问题');
    console.log('4. 需要优化错误处理和重试机制');
    
    // 1. 修复余额更新函数 - 确保MAO和PI都能正确更新
    if (content.includes('updateBalance')) {
        // 找到并优化updateBalance函数
        const improvedUpdateBalance = `
        // 💰 优化的余额更新函数
        async function updateBalance() {
            try {
                console.log('🔄 开始更新余额...');
                
                if (!gameState.account || !gameState.provider) {
                    console.log('⚠️ 账户或Provider未初始化');
                    // 显示默认状态
                    updateBalanceDisplay('MAO', '0');
                    updateBalanceDisplay('PI', '0');
                    return;
                }
                
                // 创建合约实例，确保使用正确的provider
                const maoContract = new ethers.Contract(
                    CONFIG.CONTRACTS.MAO_TOKEN,
                    ["function balanceOf(address owner) view returns (uint256)"],
                    gameState.provider
                );
                
                const piContract = new ethers.Contract(
                    CONFIG.CONTRACTS.PI_TOKEN,
                    ["function balanceOf(address owner) view returns (uint256)"],
                    gameState.provider
                );
                
                console.log('📊 查询MAO余额...');
                let maoBalance = '0';
                try {
                    const maoResult = await maoContract.balanceOf(gameState.account);
                    maoBalance = parseFloat(ethers.formatEther(maoResult)).toFixed(2);
                    console.log('✅ MAO余额查询成功:', maoBalance);
                } catch (error) {
                    console.error('❌ MAO余额查询失败:', error);
                    maoBalance = '查询失败';
                }
                
                console.log('📊 查询PI余额...');
                let piBalance = '0';
                try {
                    const piResult = await piContract.balanceOf(gameState.account);
                    piBalance = parseFloat(ethers.formatEther(piResult)).toFixed(2);
                    console.log('✅ PI余额查询成功:', piBalance);
                } catch (error) {
                    console.error('❌ PI余额查询失败:', error);
                    piBalance = '查询失败';
                }
                
                // 更新显示
                updateBalanceDisplay('MAO', maoBalance);
                updateBalanceDisplay('PI', piBalance);
                
                // 更新游戏状态
                gameState.balances.MAO = parseFloat(maoBalance) || 0;
                gameState.balances.PI = parseFloat(piBalance) || 0;
                
                console.log('🎉 余额更新完成:', { MAO: maoBalance, PI: piBalance });
                
            } catch (error) {
                console.error('❌ 更新余额失败:', error);
                // 显示错误状态
                updateBalanceDisplay('MAO', '网络错误');
                updateBalanceDisplay('PI', '网络错误');
            }
        }
        
        // 💰 更新余额显示的辅助函数
        function updateBalanceDisplay(token, balance) {
            try {
                // 查找所有可能的余额显示元素
                const selectors = [
                    \`#\${token.toLowerCase()}Balance\`,
                    \`.\${token.toLowerCase()}-balance\`,
                    \`[data-token="\${token}"]\`,
                    \`#\${token}Amount\`
                ];
                
                let updated = false;
                
                for (const selector of selectors) {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        if (element) {
                            element.textContent = balance;
                            updated = true;
                            console.log(\`✅ 更新 \${token} 显示: \${selector} = \${balance}\`);
                        }
                    });
                }
                
                // 特殊处理：查找包含"MAO余额"或"PI余额"文本的元素
                if (!updated) {
                    const allElements = document.querySelectorAll('*');
                    allElements.forEach(element => {
                        if (element.textContent && 
                            (element.textContent.includes(\`\${token}余额\`) || 
                             element.textContent.includes(\`\${token}: 加载中\`))) {
                            // 更新父元素中的数值部分
                            const parent = element.closest('div');
                            if (parent) {
                                const numberElement = parent.querySelector('.balance-number, .amount, .value') ||
                                                    parent.children[parent.children.length - 1];
                                if (numberElement) {
                                    numberElement.textContent = balance;
                                    updated = true;
                                    console.log(\`✅ 特殊更新 \${token} 显示: \${balance}\`);
                                }
                            }
                        }
                    });
                }
                
                if (!updated) {
                    console.log(\`⚠️  未找到 \${token} 的显示元素\`);
                }
                
            } catch (error) {
                console.error(\`❌ 更新\${token}显示失败:\`, error);
            }
        }`;
        
        // 替换现有的updateBalance函数
        content = content.replace(
            /async function updateBalance\(\)[\s\S]*?(?=async function|function [a-zA-Z]|\n        \/\/|\n    <\/script>)/,
            improvedUpdateBalance + '\n        '
        );
        modified = true;
        console.log('   ✅ 优化余额更新函数');
    }
    
    // 2. 修复连接钱包函数 - 确保不会卡死
    if (content.includes('connectWallet')) {
        // 在connectWallet函数中添加超时和重试机制
        content = content.replace(
            /(await updateBalance\(\);)/,
            `$1
                
                // 延迟更新，避免卡死
                setTimeout(async () => {
                    try {
                        console.log('🔄 延迟重新更新余额...');
                        await updateBalance();
                    } catch (error) {
                        console.error('❌ 延迟更新失败:', error);
                    }
                }, 1000);`
        );
        modified = true;
        console.log('   ✅ 添加延迟重试机制');
    }
    
    // 3. 添加页面可见性变化时的重新加载机制
    const visibilityHandler = `
        // 👁️ 页面可见性变化处理
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && gameState.account) {
                console.log('📱 页面重新可见，刷新余额...');
                setTimeout(() => {
                    updateBalance().catch(console.error);
                }, 500);
            }
        });
        
        // 🔄 定期健康检查
        let healthCheckInterval = setInterval(function() {
            try {
                // 检查MAO余额是否还在显示"加载中"
                const elements = document.querySelectorAll('*');
                let hasLoadingText = false;
                
                elements.forEach(element => {
                    if (element.textContent && element.textContent.includes('加载中')) {
                        hasLoadingText = true;
                    }
                });
                
                if (hasLoadingText && gameState.account && gameState.provider) {
                    console.log('🚨 检测到持续加载状态，尝试修复...');
                    updateBalance().catch(console.error);
                }
            } catch (error) {
                console.error('❌ 健康检查失败:', error);
            }
        }, 10000); // 每10秒检查一次`;
    
    if (!content.includes('visibilitychange')) {
        content = content.replace('</script>', visibilityHandler + '\n    </script>');
        modified = true;
        console.log('   ✅ 添加页面可见性和健康检查');
    }
    
    // 4. 优化错误处理 - 添加用户友好的错误提示
    const errorHandler = `
        // 🚨 全局错误处理
        window.addEventListener('error', function(event) {
            console.error('💥 全局错误:', event.error);
            
            // 如果是网络相关错误，尝试重新连接
            if (event.error && event.error.message && 
                (event.error.message.includes('network') || 
                 event.error.message.includes('provider') ||
                 event.error.message.includes('connection'))) {
                
                console.log('🔄 检测到网络错误，尝试重新初始化...');
                setTimeout(() => {
                    if (gameState.account) {
                        updateBalance().catch(console.error);
                    }
                }, 2000);
            }
        });
        
        // 🔄 Promise错误处理
        window.addEventListener('unhandledrejection', function(event) {
            console.error('💥 未处理的Promise错误:', event.reason);
            event.preventDefault(); // 防止错误导致页面崩溃
        });`;
    
    if (!content.includes('unhandledrejection')) {
        content = content.replace('</script>', errorHandler + '\n    </script>');
        modified = true;
        console.log('   ✅ 添加全局错误处理');
    }
    
    if (modified) {
        // 创建备份
        const backupPath = `${filePath}.loading-fix.backup.${Date.now()}`;
        fs.writeFileSync(backupPath, fs.readFileSync(filePath, 'utf8'));
        
        // 保存修复后的文件
        fs.writeFileSync(filePath, content);
        console.log('\n✅ 加载问题修复完成!');
        console.log(`📁 备份文件: ${backupPath}`);
        return true;
    } else {
        console.log('\nℹ️ 未发现需要修复的问题');
        return false;
    }
}

// 执行修复
console.log('🚀 开始修复加载问题...\n');

if (fixLoadingIssues()) {
    console.log('\n🎉 修复总结:');
    console.log('   ✅ 优化MAO/PI余额更新逻辑');
    console.log('   ✅ 添加智能元素查找机制');
    console.log('   ✅ 增加延迟重试机制');
    console.log('   ✅ 添加页面可见性监听');
    console.log('   ✅ 添加健康检查机制');
    console.log('   ✅ 优化全局错误处理');
    console.log('\n💡 预期效果:');
    console.log('   1. MAO余额不再显示"加载中..."');
    console.log('   2. 界面不会卡死');
    console.log('   3. 网络错误自动重试');
    console.log('   4. 页面切换后自动刷新');
    console.log('   5. 更好的用户体验');
} else {
    console.log('\n❌ 修复失败或无需修复');
} 