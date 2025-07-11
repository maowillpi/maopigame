// 🚨 MAO转盘游戏 - 游戏按钮修复脚本
// 解决授权后按钮仍然无法点击的问题

console.log('🚨 启动游戏按钮修复脚本');

// 强制检查和修复游戏按钮状态
function forceFixGameButton() {
    const spinBtn = document.getElementById('spinBtn');
    if (!spinBtn) {
        console.error('❌ 找不到游戏按钮');
        return;
    }

    // 获取当前授权状态
    const selectedToken = window.selectedToken || 'MAO';
    const approvalStatus = window.approvalStatus || { MAO: false, PI: false };
    
    console.log('🔍 当前选择的代币:', selectedToken);
    console.log('🔍 当前授权状态:', approvalStatus);
    
    // 强制启用按钮
    if (approvalStatus[selectedToken]) {
        console.log('✅ 检测到已授权，强制启用游戏按钮');
        
        spinBtn.disabled = false;
        spinBtn.className = 'game-button font-bold text-white';
        spinBtn.style.pointerEvents = 'auto';
        spinBtn.style.opacity = '1';
        spinBtn.innerHTML = '<div class="text-2xl mb-1">🎲</div><div class="text-xs font-bold">开始游戏</div>';
        
        // 更新游戏状态
        const gameStatus = document.getElementById('gameStatus');
        if (gameStatus) {
            gameStatus.textContent = '✅ 已授权，可以开始游戏！';
        }
        
        console.log('✅ 游戏按钮已强制启用');
        
    } else {
        console.log('⚠️ 未检测到授权，按钮保持禁用状态');
        
        spinBtn.disabled = true;
        spinBtn.className = 'game-button font-bold text-white opacity-50 cursor-not-allowed';
        spinBtn.innerHTML = '<div class="text-2xl mb-1">🔒</div><div class="text-xs font-bold">需要授权</div>';
        
        // 更新游戏状态
        const gameStatus = document.getElementById('gameStatus');
        if (gameStatus) {
            gameStatus.textContent = `⚠️ 请先授权${selectedToken}代币`;
        }
    }
}

// 监听授权状态变化
function watchApprovalStatus() {
    let lastApprovalStatus = null;
    
    setInterval(() => {
        const currentApprovalStatus = window.approvalStatus;
        const selectedToken = window.selectedToken || 'MAO';
        
        if (currentApprovalStatus && currentApprovalStatus !== lastApprovalStatus) {
            console.log('🔄 检测到授权状态变化，重新检查游戏按钮');
            forceFixGameButton();
            lastApprovalStatus = currentApprovalStatus;
        }
    }, 1000);
}

// 页面加载完成后执行修复
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            forceFixGameButton();
            watchApprovalStatus();
        }, 1000);
    });
} else {
    setTimeout(() => {
        forceFixGameButton();
        watchApprovalStatus();
    }, 1000);
}

// 导出修复函数到全局
window.forceFixGameButton = forceFixGameButton;

console.log('✅ 游戏按钮修复脚本加载完成');

// 添加手动修复按钮
setTimeout(() => {
    const debugBtn = document.getElementById('debugBtn');
    if (debugBtn && debugBtn.parentElement) {
        const fixBtn = document.createElement('button');
        fixBtn.id = 'forceFixBtn';
        fixBtn.className = 'w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200 mt-2';
        fixBtn.onclick = () => {
            forceFixGameButton();
            alert('🔧 已强制修复游戏按钮状态！');
        };
        fixBtn.innerHTML = '🔧 强制修复游戏按钮';
        
        debugBtn.parentElement.insertBefore(fixBtn, debugBtn.nextSibling);
        console.log('✅ 已添加强制修复按钮');
    }
}, 2000); 