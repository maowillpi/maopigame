// MAO转盘游戏界面优化脚本 v4.1.0
// 解决PI授权问题 + 分离代币授权 + 优化钱包连接

console.log('🚀 MAO转盘游戏界面优化脚本 v4.1.0 启动');

// 优化后的配置
const OPTIMIZED_CONFIG = {
    // 修复PI授权问题：确保使用正确的18位小数格式
    PI_APPROVAL_AMOUNT: ethers.utils.parseUnits('10000', 18), // 10,000 PI
    MAO_APPROVAL_AMOUNT: ethers.utils.parseUnits('100', 18),  // 100 MAO
    
    // 合约地址
    CONTRACTS: {
        WHEEL_GAME: '0xB677DBcA76061E6301272c83179c8243A4eeB6A5',
        MAO_TOKEN: '0x22f49bcb3dad370a9268ba3fca33cb037ca3d022',
        PI_TOKEN: '0xfd4680e25e05b3435c7f698668d1ce80d2a9f444'
    }
};

// 全局状态管理
let optimizedState = {
    maoApproved: false,
    piApproved: false,
    currentAccount: null,
    contracts: {},
    balances: { MAO: '0', PI: '0' },
    selectedToken: 'MAO'
};

// 创建优化的钱包连接界面
function createOptimizedWalletInterface() {
    console.log('🎨 创建优化钱包连接界面');
    
    // 如果已存在游戏界面，在其前面插入优化的代币管理面板
    const gameInterface = document.getElementById('gameInterface');
    if (gameInterface) {
        const optimizedPanel = document.createElement('div');
        optimizedPanel.id = 'optimizedTokenPanel';
        optimizedPanel.className = 'space-y-4 mb-4';
        optimizedPanel.innerHTML = `
            <!-- 优化的代币管理面板 -->
            <div class="glass-effect rounded-xl p-4">
                <h3 class="text-white font-semibold mb-4 text-center">💰 优化代币管理</h3>
                
                <!-- MAO代币 -->
                <div class="bg-white/10 rounded-xl p-4 mb-3">
                    <div class="flex justify-between items-center mb-3">
                        <div class="flex items-center">
                            <button id="optimizedMaoBtn" class="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white mr-3" onclick="optimizedSelectToken('MAO')">
                                MAO
                            </button>
                            <div>
                                <div class="text-white font-semibold">MAO Token</div>
                                <div class="text-blue-200 text-sm">100 MAO/次</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-yellow-400 font-bold" id="optimizedMaoBalance">余额: 0</div>
                            <div class="flex items-center justify-end mt-1">
                                <div id="maoStatusIndicator" class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                <span class="text-xs text-blue-200" id="maoStatusText">需要授权</span>
                            </div>
                        </div>
                    </div>
                    <button id="optimizedMaoApprove" class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg" onclick="optimizedApproveToken('MAO')">
                        🔓 授权 MAO 代币
                    </button>
                </div>
                
                <!-- PI代币 -->
                <div class="bg-white/10 rounded-xl p-4 mb-3">
                    <div class="flex justify-between items-center mb-3">
                        <div class="flex items-center">
                            <button id="optimizedPiBtn" class="px-4 py-2 rounded-lg font-semibold bg-white/20 text-blue-200 mr-3" onclick="optimizedSelectToken('PI')">
                                PI
                            </button>
                            <div>
                                <div class="text-white font-semibold">PI Token</div>
                                <div class="text-blue-200 text-sm">10,000 PI/次</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-yellow-400 font-bold" id="optimizedPiBalance">余额: 0</div>
                            <div class="flex items-center justify-end mt-1">
                                <div id="piStatusIndicator" class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                <span class="text-xs text-blue-200" id="piStatusText">需要授权</span>
                            </div>
                        </div>
                    </div>
                    <button id="optimizedPiApprove" class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg" onclick="optimizedApproveToken('PI')">
                        🔓 授权 PI 代币 (修复版)
                    </button>
                </div>
                
                <!-- 状态显示 -->
                <div class="bg-white/10 rounded-lg p-3">
                    <div class="text-center">
                        <div class="text-white font-semibold mb-2">授权状态检查</div>
                        <button onclick="optimizedRefreshStatus()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                            🔄 刷新状态
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        gameInterface.insertBefore(optimizedPanel, gameInterface.firstChild);
        console.log('✅ 优化代币管理面板已创建');
    }
}

// 优化的代币选择
function optimizedSelectToken(token) {
    console.log(`🎯 选择代币: ${token}`);
    optimizedState.selectedToken = token;
    
    // 更新按钮样式
    const maoBtn = document.getElementById('optimizedMaoBtn');
    const piBtn = document.getElementById('optimizedPiBtn');
    
    if (token === 'MAO') {
        maoBtn.className = 'px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white mr-3';
        piBtn.className = 'px-4 py-2 rounded-lg font-semibold bg-white/20 text-blue-200 mr-3';
    } else {
        maoBtn.className = 'px-4 py-2 rounded-lg font-semibold bg-white/20 text-blue-200 mr-3';
        piBtn.className = 'px-4 py-2 rounded-lg font-semibold bg-purple-600 text-white mr-3';
    }
    
    // 更新原始界面的投注金额显示
    const betAmount = document.getElementById('betAmount');
    if (betAmount) {
        betAmount.textContent = token === 'MAO' ? '100 MAO' : '10,000 PI';
    }
    
    console.log(`✅ 代币选择更新: ${token}`);
}

// 优化的代币授权（修复PI授权问题）
async function optimizedApproveToken(tokenType) {
    console.log(`🔓 开始授权 ${tokenType} 代币`);
    
    try {
        if (!optimizedState.contracts.maoToken || !optimizedState.contracts.piToken) {
            alert('合约未初始化，请先连接钱包！');
            return;
        }
        
        const btn = document.getElementById(`optimized${tokenType}Approve`);
        const originalText = btn.textContent;
        
        btn.textContent = `授权${tokenType}中...`;
        btn.disabled = true;
        
        // 选择正确的合约和授权金额
        let tokenContract, requiredAmount;
        
        if (tokenType === 'MAO') {
            tokenContract = optimizedState.contracts.maoToken;
            requiredAmount = OPTIMIZED_CONFIG.MAO_APPROVAL_AMOUNT;
        } else {
            tokenContract = optimizedState.contracts.piToken;
            // 关键修复：PI授权使用正确的18位小数格式
            requiredAmount = OPTIMIZED_CONFIG.PI_APPROVAL_AMOUNT;
        }
        
        console.log(`📝 ${tokenType} 授权金额:`, requiredAmount.toString());
        
        // 执行授权交易
        const tx = await tokenContract.approve(
            OPTIMIZED_CONFIG.CONTRACTS.WHEEL_GAME, 
            ethers.constants.MaxUint256  // 最大授权，避免重复授权
        );
        
        console.log(`⏳ ${tokenType} 授权交易已发送:`, tx.hash);
        
        // 等待交易确认
        const receipt = await tx.wait();
        console.log(`✅ ${tokenType} 授权交易确认:`, receipt.transactionHash);
        
        // 更新状态
        optimizedState[`${tokenType.toLowerCase()}Approved`] = true;
        
        // 更新UI
        updateOptimizedApprovalDisplay(tokenType, true);
        
        alert(`${tokenType}代币授权成功！\n交易哈希: ${tx.hash.slice(0, 10)}...`);
        
        // 刷新状态
        setTimeout(() => optimizedRefreshStatus(), 1000);
        
    } catch (error) {
        console.error(`❌ ${tokenType} 授权失败:`, error);
        
        let errorMessage = `授权${tokenType}失败: `;
        if (error.message.includes('user rejected')) {
            errorMessage += '用户取消交易';
        } else if (error.message.includes('insufficient funds')) {
            errorMessage += '余额不足支付Gas费';
        } else {
            errorMessage += error.message;
        }
        
        alert(errorMessage);
        
        // 恢复按钮
        const btn = document.getElementById(`optimized${tokenType}Approve`);
        btn.textContent = `🔓 授权 ${tokenType} 代币${tokenType === 'PI' ? ' (修复版)' : ''}`;
        btn.disabled = false;
    }
}

// 优化的状态刷新
async function optimizedRefreshStatus() {
    console.log('🔄 刷新优化状态');
    
    try {
        if (!optimizedState.currentAccount || !optimizedState.contracts.maoToken) {
            console.log('⚠️ 账户或合约未初始化');
            return;
        }
        
        // 并行获取余额和授权状态
        const [maoBalance, piBalance, maoAllowance, piAllowance] = await Promise.all([
            optimizedState.contracts.maoToken.balanceOf(optimizedState.currentAccount),
            optimizedState.contracts.piToken.balanceOf(optimizedState.currentAccount),
            optimizedState.contracts.maoToken.allowance(optimizedState.currentAccount, OPTIMIZED_CONFIG.CONTRACTS.WHEEL_GAME),
            optimizedState.contracts.piToken.allowance(optimizedState.currentAccount, OPTIMIZED_CONFIG.CONTRACTS.WHEEL_GAME)
        ]);
        
        // 更新余额（9位小数）
        optimizedState.balances.MAO = ethers.utils.formatUnits(maoBalance, 9);
        optimizedState.balances.PI = ethers.utils.formatUnits(piBalance, 9);
        
        // 检查授权状态（使用18位小数检查）
        optimizedState.maoApproved = maoAllowance.gte(OPTIMIZED_CONFIG.MAO_APPROVAL_AMOUNT);
        optimizedState.piApproved = piAllowance.gte(OPTIMIZED_CONFIG.PI_APPROVAL_AMOUNT);
        
        console.log('📊 状态更新:');
        console.log('  MAO余额:', optimizedState.balances.MAO);
        console.log('  PI余额:', optimizedState.balances.PI);
        console.log('  MAO授权:', optimizedState.maoApproved);
        console.log('  PI授权:', optimizedState.piApproved);
        console.log('  MAO授权金额:', ethers.utils.formatUnits(maoAllowance, 18));
        console.log('  PI授权金额:', ethers.utils.formatUnits(piAllowance, 18));
        
        // 更新显示
        updateOptimizedBalanceDisplay();
        updateOptimizedApprovalDisplay('MAO', optimizedState.maoApproved);
        updateOptimizedApprovalDisplay('PI', optimizedState.piApproved);
        
        console.log('✅ 状态刷新完成');
        
    } catch (error) {
        console.error('❌ 状态刷新失败:', error);
    }
}

// 更新余额显示
function updateOptimizedBalanceDisplay() {
    const maoBalanceEl = document.getElementById('optimizedMaoBalance');
    const piBalanceEl = document.getElementById('optimizedPiBalance');
    
    if (maoBalanceEl) {
        maoBalanceEl.textContent = `余额: ${parseFloat(optimizedState.balances.MAO).toFixed(2)}`;
    }
    if (piBalanceEl) {
        piBalanceEl.textContent = `余额: ${parseFloat(optimizedState.balances.PI).toFixed(2)}`;
    }
}

// 更新授权状态显示
function updateOptimizedApprovalDisplay(tokenType, isApproved) {
    const statusIndicator = document.getElementById(`${tokenType.toLowerCase()}StatusIndicator`);
    const statusText = document.getElementById(`${tokenType.toLowerCase()}StatusText`);
    const approveBtn = document.getElementById(`optimized${tokenType}Approve`);
    
    if (isApproved) {
        if (statusIndicator) {
            statusIndicator.className = 'w-3 h-3 rounded-full bg-green-500 mr-2';
        }
        if (statusText) {
            statusText.textContent = '已授权';
        }
        if (approveBtn) {
            approveBtn.textContent = `✅ ${tokenType}已授权`;
            approveBtn.className = 'w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg';
            approveBtn.disabled = true;
        }
    } else {
        if (statusIndicator) {
            statusIndicator.className = 'w-3 h-3 rounded-full bg-red-500 mr-2';
        }
        if (statusText) {
            statusText.textContent = '需要授权';
        }
        if (approveBtn) {
            approveBtn.textContent = `🔓 授权 ${tokenType} 代币${tokenType === 'PI' ? ' (修复版)' : ''}`;
            approveBtn.className = 'w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg';
            approveBtn.disabled = false;
        }
    }
}

// 初始化优化脚本
function initializeOptimizedInterface() {
    console.log('🚀 初始化优化界面');
    
    // 等待原始游戏界面加载
    const checkGameInterface = setInterval(() => {
        const gameInterface = document.getElementById('gameInterface');
        if (gameInterface && gameInterface.style.display !== 'none') {
            clearInterval(checkGameInterface);
            
            // 创建优化界面
            createOptimizedWalletInterface();
            
            // 如果钱包已连接，初始化状态
            if (window.currentAccount && window.contracts) {
                optimizedState.currentAccount = window.currentAccount;
                optimizedState.contracts = window.contracts;
                optimizedRefreshStatus();
            }
            
            console.log('✅ 优化界面初始化完成');
        }
    }, 1000);
    
    // 5秒后停止检查
    setTimeout(() => {
        clearInterval(checkGameInterface);
    }, 5000);
}

// 监听钱包连接事件
function setupOptimizedListeners() {
    // 监听原始钱包连接
    const originalConnectWallet = window.connectWallet;
    if (originalConnectWallet) {
        window.connectWallet = async function() {
            const result = await originalConnectWallet.apply(this, arguments);
            
            // 更新优化状态
            if (window.currentAccount && window.contracts) {
                optimizedState.currentAccount = window.currentAccount;
                optimizedState.contracts = window.contracts;
                setTimeout(optimizedRefreshStatus, 1000);
            }
            
            return result;
        };
    }
}

// 添加样式优化
function addOptimizedStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 优化的动画效果 */
        #optimizedTokenPanel {
            animation: slideIn 0.5s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* 状态指示器动画 */
        #maoStatusIndicator.bg-red-500,
        #piStatusIndicator.bg-red-500 {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        /* 按钮悬停效果 */
        #optimizedMaoBtn:hover,
        #optimizedPiBtn:hover {
            transform: scale(1.05);
            transition: all 0.2s ease;
        }
    `;
    document.head.appendChild(style);
}

// 导出全局函数
window.optimizedSelectToken = optimizedSelectToken;
window.optimizedApproveToken = optimizedApproveToken;
window.optimizedRefreshStatus = optimizedRefreshStatus;

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        addOptimizedStyles();
        setupOptimizedListeners();
        setTimeout(initializeOptimizedInterface, 2000);
    });
} else {
    addOptimizedStyles();
    setupOptimizedListeners();
    setTimeout(initializeOptimizedInterface, 2000);
}

console.log('✅ MAO转盘游戏界面优化脚本加载完成');

// 调试信息
window.optimizedDebug = {
    state: optimizedState,
    config: OPTIMIZED_CONFIG,
    refresh: optimizedRefreshStatus
}; 