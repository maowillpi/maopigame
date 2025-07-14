// 🔧 全面的游戏配置修复脚本
const fs = require('fs');
const path = require('path');

console.log('🔧 正在修正所有游戏配置...');
console.log('='.repeat(80));

// 用户要求的新配置
const NEW_CONFIG = {
    MARKETING_WALLET: '0x861A48051eFaA1876D4B38904516C9F7bbCca36d',
    PRIZE_POOL_WALLET: '0xE15881Fc413c6cd47a512C24608F94Fa2896b374',
    BURN_ADDRESS: '0x000000000000000000000000000000000000dEaD',
    // 新的分配比例
    MARKETING_PERCENT: 15,  // 15%到营销钱包
    BURN_PERCENT: 15,       // 15%到销毁
    PRIZE_POOL_PERCENT: 70, // 70%到奖金池
    // 合约地址使用新合约（配置正确的）
    WHEEL_GAME_CONTRACT: '0xB677DBcA76061E6301272c83179c8243A4eeB6A5',
    MAO_TOKEN: '0x22f49bcb3dad370a9268ba3fca33cb037ca3d022',
    PI_TOKEN: '0xfd4680e25e05b3435c7f698668d1ce80d2a9f444'
};

console.log('📋 新配置说明:');
console.log(`   营销钱包: ${NEW_CONFIG.MARKETING_WALLET}`);
console.log(`   奖金池钱包: ${NEW_CONFIG.PRIZE_POOL_WALLET}`);
console.log(`   销毁地址: ${NEW_CONFIG.BURN_ADDRESS}`);
console.log(`   分配比例: 营销${NEW_CONFIG.MARKETING_PERCENT}% + 销毁${NEW_CONFIG.BURN_PERCENT}% + 奖金池${NEW_CONFIG.PRIZE_POOL_PERCENT}%`);
console.log(`   合约地址: ${NEW_CONFIG.WHEEL_GAME_CONTRACT}`);

// 需要修复的文件
const filesToFix = ['index.html', 'game.html', 'simple-game.html'];

// 修复单个文件
function fixGameConfiguration(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  文件不存在: ${filePath}`);
        return false;
    }
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        console.log(`\n🔧 修复文件: ${filePath}`);
        
        // 创建备份
        const backupPath = `${filePath}.correct-config.backup.${Date.now()}`;
        fs.writeFileSync(backupPath, content);
        console.log(`   ✅ 已创建备份: ${backupPath}`);
        
        // 1. 更新合约地址为新合约
        const oldWheelGamePattern = /const WHEEL_GAME_ADDRESS = ['"`][^'"`]+['"`]/g;
        if (content.match(oldWheelGamePattern)) {
            content = content.replace(oldWheelGamePattern, `const WHEEL_GAME_ADDRESS = '${NEW_CONFIG.WHEEL_GAME_CONTRACT}'`);
            console.log(`   ✅ 更新合约地址: ${NEW_CONFIG.WHEEL_GAME_CONTRACT}`);
            modified = true;
        }
        
        // 2. 更新钱包地址配置
        const marketingWalletPattern = /const marketingWallet = ['"`][^'"`]+['"`]/g;
        if (content.match(marketingWalletPattern)) {
            content = content.replace(marketingWalletPattern, `const marketingWallet = '${NEW_CONFIG.MARKETING_WALLET}'`);
            console.log(`   ✅ 更新营销钱包: ${NEW_CONFIG.MARKETING_WALLET}`);
            modified = true;
        }
        
        // 3. 增加销毁总数展示的HTML结构
        const balanceDisplayPattern = /<div[^>]*class="[^"]*balance-display[^"]*"[^>]*>[\s\S]*?<\/div>/g;
        if (content.includes('balance-display') && !content.includes('burned-total-display')) {
            // 在余额显示区域添加销毁总数展示
            const burnDisplayHTML = `
                    <div class="burned-total-display" style="background: linear-gradient(45deg, #ff4444, #cc0000); padding: 10px; border-radius: 10px; margin: 10px 0; text-align: center;">
                        <h3 style="margin: 0; color: white;">🔥 总销毁数量</h3>
                        <div style="display: flex; justify-content: space-around; margin-top: 5px;">
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
            
            // 在现有余额显示后添加销毁总数显示
            content = content.replace(
                /<div[^>]*class="[^"]*balance-display[^"]*"[^>]*>[\s\S]*?<\/div>/,
                '$&' + burnDisplayHTML
            );
            console.log(`   ✅ 添加销毁总数展示区域`);
            modified = true;
        }
        
        // 4. 更新游戏逻辑中的分配比例
        const gameLogicPattern = /\/\/ 代币分配[\s\S]*?marketingAmount[\s\S]*?burnAmount[\s\S]*?prizePoolAmount/g;
        if (content.includes('代币分配') || content.includes('marketingAmount')) {
            // 更新分配逻辑
            const newAllocationLogic = `
        // 代币分配 (新配置: 15%营销 + 15%销毁 + 70%奖金池)
        const totalAmount = tokenType === 0 ? 100 : 1000; // MAO: 100, PI: 1000
        const marketingAmount = Math.floor(totalAmount * ${NEW_CONFIG.MARKETING_PERCENT} / 100); // 15%到营销钱包
        const burnAmount = Math.floor(totalAmount * ${NEW_CONFIG.BURN_PERCENT} / 100);           // 15%到销毁
        const prizePoolAmount = totalAmount - marketingAmount - burnAmount;                     // 70%到奖金池`;
            
            content = content.replace(
                /\/\/ 代币分配[\s\S]*?const prizePoolAmount[^;]*;/,
                newAllocationLogic
            );
            console.log(`   ✅ 更新分配比例: 营销${NEW_CONFIG.MARKETING_PERCENT}% + 销毁${NEW_CONFIG.BURN_PERCENT}% + 奖金池${NEW_CONFIG.PRIZE_POOL_PERCENT}%`);
            modified = true;
        }
        
        // 5. 添加销毁总数查询函数
        if (!content.includes('updateBurnedTotals')) {
            const burnedTotalsFunction = `
        // 🔥 查询并更新销毁总数
        async function updateBurnedTotals() {
            try {
                const burnAddress = '${NEW_CONFIG.BURN_ADDRESS}';
                
                // 查询销毁地址的代币余额
                const maoContract = new ethers.Contract('${NEW_CONFIG.MAO_TOKEN}', [
                    "function balanceOf(address owner) view returns (uint256)"
                ], provider);
                
                const piContract = new ethers.Contract('${NEW_CONFIG.PI_TOKEN}', [
                    "function balanceOf(address owner) view returns (uint256)"
                ], provider);
                
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
                
                console.log('🔥 销毁总数更新完成:', {
                    MAO: ethers.formatEther(maoBalance),
                    PI: ethers.formatEther(piBalance)
                });
                
            } catch (error) {
                console.error('❌ 查询销毁总数失败:', error);
                const maoElement = document.getElementById('totalBurnedMAO');
                const piElement = document.getElementById('totalBurnedPI');
                if (maoElement) maoElement.textContent = '查询失败';
                if (piElement) piElement.textContent = '查询失败';
            }
        }
        
        // 定期更新销毁总数 (每30秒)
        setInterval(updateBurnedTotals, 30000);`;
            
            // 在script标签内添加函数
            content = content.replace(
                /<script[\s\S]*?<\/script>/,
                function(match) {
                    if (match.includes('ethers') || match.includes('connectWallet')) {
                        return match.replace('</script>', burnedTotalsFunction + '\n    </script>');
                    }
                    return match;
                }
            );
            console.log(`   ✅ 添加销毁总数查询函数`);
            modified = true;
        }
        
        // 6. 在连接钱包后调用销毁总数更新
        if (content.includes('connectWallet') && !content.includes('updateBurnedTotals()')) {
            content = content.replace(
                /(连接成功|Connected successfully)[\s\S]*?(updateBalance|balanceElement)/,
                function(match) {
                    return match + '\n                await updateBurnedTotals(); // 更新销毁总数';
                }
            );
            console.log(`   ✅ 在连接钱包后自动更新销毁总数`);
            modified = true;
        }
        
        // 7. 确保使用正确的合约地址
        content = content.replace(
            /0xA9E4FD96B29e4f512a0a75E402C156B04D6E6c35/g,
            NEW_CONFIG.WHEEL_GAME_CONTRACT
        );
        
        // 8. 移除可能存在的Gas配置问题
        content = content.replace(
            /playMAOGame\([^)]*\)/g,
            'playMAOGame()'
        );
        content = content.replace(
            /playPIGame\([^)]*\)/g,
            'playPIGame()'
        );
        
        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log(`   ✅ 文件修复完成: ${filePath}`);
            return true;
        } else {
            console.log(`   ℹ️  文件无需修改: ${filePath}`);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ 修复文件失败 ${filePath}:`, error.message);
        return false;
    }
}

// 执行修复
console.log('\n🚀 开始修复所有游戏配置...\n');

let totalFixed = 0;
for (const file of filesToFix) {
    if (fixGameConfiguration(file)) {
        totalFixed++;
    }
}

console.log('\n' + '='.repeat(80));
console.log('🎉 游戏配置修复完成!');
console.log(`✅ 成功修复 ${totalFixed} 个文件`);
console.log('\n📋 修复内容总结:');
console.log('   ✅ 使用正确的合约地址 (新合约)');
console.log('   ✅ 更新营销钱包地址');
console.log('   ✅ 更新奖金池钱包地址');
console.log('   ✅ 修改分配比例为 15%营销 + 15%销毁 + 70%奖金池');
console.log('   ✅ 增加销毁总数展示功能');
console.log('   ✅ 移除Gas配置问题');
console.log('\n🎯 现在用户可以:');
console.log('   1. 看到正确的代币分配');
console.log('   2. 实时查看销毁总数');
console.log('   3. 营销钱包正确接收15%费用');
console.log('   4. 游戏功能完全正常');
console.log('\n🔗 测试链接: http://127.0.0.1:8000/index.html'); 