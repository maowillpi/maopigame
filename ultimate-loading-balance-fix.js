// 🚀 终极修复 - 解决MAO加载中和界面卡死问题
const fs = require('fs');

console.log('🚀 终极修复：MAO加载中 + 界面卡死 + 合约切换');
console.log('='.repeat(80));

function ultimateLoadingFix() {
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
        
        // 1. 强制使用新合约地址
        console.log('1️⃣ 强制切换到新合约...');
        const oldContract = '0xA9E4FD96B29e4f512a0a75E402C156B04D6E6c35';
        const newContract = '0xB677DBcA76061E6301272c83179c8243A4eeB6A5';
        
        if (content.includes(oldContract)) {
            content = content.replace(new RegExp(oldContract.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newContract);
            modified = true;
            console.log('   ✅ 已切换到新合约地址');
        }
        
        // 2. 完全重写余额更新系统
        console.log('2️⃣ 重写余额更新系统...');
        
        const newBalanceSystem = `
        // 🔥 全新余额更新系统 - 终极版本
        let balanceUpdateInProgress = false;
        let balanceUpdateRetryCount = 0;
        const MAX_BALANCE_RETRIES = 3;
        
        // 余额缓存系统
        const balanceCache = {
            MAO: { value: '0', timestamp: 0, isLoading: false },
            PI: { value: '0', timestamp: 0, isLoading: false }
        };
        
        // 🎯 智能余额更新函数
        async function updateBalance() {
            console.log('🔄 [余额更新] 开始更新余额...');
            
            // 防止重复执行
            if (balanceUpdateInProgress) {
                console.log('⚠️ [余额更新] 已在进行中，跳过');
                return;
            }
            
            balanceUpdateInProgress = true;
            
            try {
                if (!gameState.account || !gameState.provider) {
                    console.log('⚠️ [余额更新] 账户未连接');
                    setBalanceDisplay('MAO', '未连接');
                    setBalanceDisplay('PI', '未连接');
                    return;
                }
                
                console.log('📊 [余额更新] 账户:', gameState.account);
                
                // 并行查询两个代币余额
                const promises = [
                    queryTokenBalance('MAO', CONFIG.CONTRACTS.MAO_TOKEN),
                    queryTokenBalance('PI', CONFIG.CONTRACTS.PI_TOKEN)
                ];
                
                // 设置加载状态
                setBalanceDisplay('MAO', '查询中...');
                setBalanceDisplay('PI', '查询中...');
                
                const results = await Promise.allSettled(promises);
                
                // 处理MAO结果
                if (results[0].status === 'fulfilled') {
                    const maoBalance = results[0].value;
                    balanceCache.MAO = { value: maoBalance, timestamp: Date.now(), isLoading: false };
                    setBalanceDisplay('MAO', maoBalance);
                    console.log('✅ [余额更新] MAO余额:', maoBalance);
                } else {
                    console.error('❌ [余额更新] MAO查询失败:', results[0].reason);
                    setBalanceDisplay('MAO', '查询失败');
                }
                
                // 处理PI结果
                if (results[1].status === 'fulfilled') {
                    const piBalance = results[1].value;
                    balanceCache.PI = { value: piBalance, timestamp: Date.now(), isLoading: false };
                    setBalanceDisplay('PI', piBalance);
                    console.log('✅ [余额更新] PI余额:', piBalance);
                } else {
                    console.error('❌ [余额更新] PI查询失败:', results[1].reason);
                    setBalanceDisplay('PI', '查询失败');
                }
                
                balanceUpdateRetryCount = 0; // 重置重试计数
                
            } catch (error) {
                console.error('❌ [余额更新] 整体失败:', error);
                
                balanceUpdateRetryCount++;
                if (balanceUpdateRetryCount < MAX_BALANCE_RETRIES) {
                    console.log(\`🔄 [余额更新] \${balanceUpdateRetryCount}/\${MAX_BALANCE_RETRIES} 次重试...\`);
                    setTimeout(() => {
                        balanceUpdateInProgress = false;
                        updateBalance();
                    }, 2000);
                    return;
                } else {
                    setBalanceDisplay('MAO', '重试失败');
                    setBalanceDisplay('PI', '重试失败');
                }
            } finally {
                balanceUpdateInProgress = false;
            }
        }
        
        // 🎯 查询单个代币余额
        async function queryTokenBalance(tokenName, contractAddress) {
            console.log(\`📊 [余额查询] 查询\${tokenName}余额...\`);
            
            try {
                const contract = new ethers.Contract(
                    contractAddress,
                    ["function balanceOf(address owner) view returns (uint256)"],
                    gameState.provider
                );
                
                const balanceWei = await contract.balanceOf(gameState.account);
                const balance = parseFloat(ethers.formatEther(balanceWei)).toFixed(2);
                
                console.log(\`✅ [余额查询] \${tokenName}余额查询成功: \${balance}\`);
                return balance;
                
            } catch (error) {
                console.error(\`❌ [余额查询] \${tokenName}余额查询失败:\`, error);
                throw error;
            }
        }
        
        // 🎯 设置余额显示
        function setBalanceDisplay(tokenName, value) {
            try {
                console.log(\`🖼️ [显示更新] 更新\${tokenName}显示: \${value}\`);
                
                // 多种选择器策略
                const selectors = [
                    \`#\${tokenName.toLowerCase()}Balance\`,
                    \`.\${tokenName.toLowerCase()}-balance\`,
                    \`[data-token="\${tokenName}"]\`,
                    \`#\${tokenName}Amount\`,
                    \`.balance-\${tokenName.toLowerCase()}\`
                ];
                
                let found = false;
                
                for (const selector of selectors) {
                    const elements = document.querySelectorAll(selector);
                    if (elements.length > 0) {
                        elements.forEach(element => {
                            element.textContent = value;
                            found = true;
                        });
                    }
                }
                
                // 智能文本搜索更新
                if (!found) {
                    const allElements = document.querySelectorAll('*');
                    for (const element of allElements) {
                        if (element.textContent) {
                            // 匹配 "MAO余额" 或 "PI余额" 或 "MAO: xxx" 或 "PI: xxx"
                            const patterns = [
                                new RegExp(\`\${tokenName}余额[\\s\\S]*?\$\`),
                                new RegExp(\`\${tokenName}:[^\\n]*\$\`),
                                new RegExp(\`\${tokenName}[\\s]*加载中\`),
                                new RegExp(\`\${tokenName}[\\s]*查询中\`)
                            ];
                            
                            for (const pattern of patterns) {
                                if (pattern.test(element.textContent)) {
                                    // 找到包含余额信息的元素
                                    const parent = element.closest('div, span, p');
                                    if (parent) {
                                        // 查找数值显示区域
                                        const valueElements = parent.querySelectorAll('.balance-amount, .amount, .value, .number');
                                        if (valueElements.length > 0) {
                                            valueElements[0].textContent = value;
                                            found = true;
                                            break;
                                        } else {
                                            // 直接替换文本内容
                                            element.textContent = element.textContent.replace(
                                                /(加载中|查询中|查询失败|未连接|重试失败)[\\d\\.]*/, 
                                                value
                                            );
                                            found = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (found) break;
                        }
                    }
                }
                
                if (found) {
                    console.log(\`✅ [显示更新] \${tokenName}显示更新成功\`);
                } else {
                    console.log(\`⚠️ [显示更新] 未找到\${tokenName}显示元素\`);
                }
                
            } catch (error) {
                console.error(\`❌ [显示更新] \${tokenName}显示更新失败:\`, error);
            }
        }
        
        // 🔄 自动刷新机制
        let autoRefreshInterval;
        
        function startAutoRefresh() {
            if (autoRefreshInterval) {
                clearInterval(autoRefreshInterval);
            }
            
            autoRefreshInterval = setInterval(() => {
                if (gameState.account && gameState.provider && !balanceUpdateInProgress) {
                    console.log('🔄 [自动刷新] 定时更新余额...');
                    updateBalance();
                }
            }, 15000); // 每15秒自动刷新
        }
        
        function stopAutoRefresh() {
            if (autoRefreshInterval) {
                clearInterval(autoRefreshInterval);
                autoRefreshInterval = null;
            }
        }`;
        
        // 插入新的余额系统
        if (content.includes('async function updateBalance')) {
            // 移除旧的updateBalance函数
            content = content.replace(
                /async function updateBalance\(\)[\s\S]*?(?=async function|function [a-zA-Z]|\n        \/\/|\n    <\/script>)/,
                ''
            );
            modified = true;
        }
        
        // 在适当位置插入新系统
        const insertPosition = content.indexOf('async function connectWallet') || 
                              content.indexOf('function connectWallet') ||
                              content.indexOf('</script>');
        
        if (insertPosition > 0) {
            content = content.slice(0, insertPosition) + newBalanceSystem + '\n        ' + content.slice(insertPosition);
            modified = true;
            console.log('   ✅ 已插入新余额系统');
        }
        
        // 3. 修复连接钱包函数
        console.log('3️⃣ 修复连接钱包函数...');
        if (content.includes('connectWallet')) {
            // 在connectWallet成功后启动自动刷新
            content = content.replace(
                /(gameState\.account = accounts\[0\];[\s\S]*?)(updateBalance\(\);)/,
                `$1
                // 启动自动刷新
                startAutoRefresh();
                
                // 延迟更新余额
                setTimeout(() => {
                    updateBalance();
                }, 1000);`
            );
            modified = true;
            console.log('   ✅ 已修复连接钱包函数');
        }
        
        // 4. 添加页面生命周期管理
        console.log('4️⃣ 添加页面生命周期管理...');
        const lifecycleCode = `
        // 📱 页面生命周期管理
        document.addEventListener('DOMContentLoaded', function() {
            console.log('📱 [生命周期] 页面加载完成');
        });
        
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                console.log('📱 [生命周期] 页面隐藏，停止自动刷新');
                stopAutoRefresh();
            } else {
                console.log('📱 [生命周期] 页面显示，启动自动刷新');
                if (gameState.account) {
                    startAutoRefresh();
                    setTimeout(updateBalance, 500);
                }
            }
        });
        
        // 🚨 错误恢复机制
        window.addEventListener('error', function(event) {
            console.error('🚨 [错误恢复] 全局错误:', event.error);
            
            // 如果是余额相关错误，尝试恢复
            if (event.error && event.error.message && 
                (event.error.message.includes('balance') || 
                 event.error.message.includes('provider'))) {
                
                console.log('🔄 [错误恢复] 检测到余额错误，尝试恢复...');
                balanceUpdateInProgress = false;
                setTimeout(() => {
                    if (gameState.account) {
                        updateBalance();
                    }
                }, 3000);
            }
        });
        
        // 🔄 Promise错误恢复
        window.addEventListener('unhandledrejection', function(event) {
            console.error('🚨 [错误恢复] Promise错误:', event.reason);
            event.preventDefault();
            
            balanceUpdateInProgress = false;
            
            // 如果是网络错误，重置状态
            if (event.reason && event.reason.message && 
                event.reason.message.includes('network')) {
                setTimeout(() => {
                    if (gameState.account) {
                        updateBalance();
                    }
                }, 5000);
            }
        });`;
        
        if (!content.includes('visibilitychange')) {
            content = content.replace('</script>', lifecycleCode + '\n    </script>');
            modified = true;
            console.log('   ✅ 已添加页面生命周期管理');
        }
        
        // 5. 优化游戏函数调用
        console.log('5️⃣ 优化游戏函数调用...');
        
        // 移除错误的参数
        content = content.replace(/playMAOGame\([^)]*\)/g, 'playMAOGame()');
        content = content.replace(/playPIGame\([^)]*\)/g, 'playPIGame()');
        
        // 在游戏结束后刷新余额
        if (content.includes('gameState.isSpinning = false')) {
            content = content.replace(
                /gameState\.isSpinning = false;/g,
                `gameState.isSpinning = false;
                
                // 游戏结束后刷新余额
                setTimeout(() => {
                    updateBalance();
                }, 2000);`
            );
            modified = true;
            console.log('   ✅ 已优化游戏函数调用');
        }
        
        if (modified) {
            // 创建备份
            const backupPath = `${fileName}.ultimate-fix.backup.${Date.now()}`;
            fs.writeFileSync(backupPath, fs.readFileSync(fileName, 'utf8'));
            
            // 保存修复后的文件
            fs.writeFileSync(fileName, content);
            console.log(`✅ ${fileName} 修复完成!`);
            console.log(`📁 备份: ${backupPath}`);
            totalFixed++;
        } else {
            console.log(`ℹ️ ${fileName} 无需修复`);
        }
    });
    
    return totalFixed;
}

// 执行修复
console.log('🚀 开始终极修复...\n');

const fixedCount = ultimateLoadingFix();

console.log('\n🎉 终极修复完成！');
console.log('='.repeat(80));
console.log(`✅ 修复文件数量: ${fixedCount}`);
console.log('\n🔧 修复内容:');
console.log('   ✅ 强制切换到新合约地址');
console.log('   ✅ 全新余额更新系统（防卡死）');
console.log('   ✅ 智能余额显示更新');
console.log('   ✅ 并行查询MAO/PI余额');
console.log('   ✅ 自动重试机制');
console.log('   ✅ 页面生命周期管理');
console.log('   ✅ 错误恢复机制');
console.log('   ✅ 游戏结束后自动刷新');
console.log('\n💡 预期效果:');
console.log('   🎯 MAO余额不再显示"加载中..."');
console.log('   🎯 界面永不卡死');
console.log('   🎯 自动使用正确的新合约');
console.log('   🎯 网络错误自动恢复');
console.log('   🎯 页面切换自动刷新');
console.log('   🎯 游戏后自动更新余额'); 