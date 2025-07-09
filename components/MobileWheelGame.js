import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';

const MobileWheelGame = ({ account, contract, balances, selectedToken, onUpdateBalances, onGameResult }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef(null);
  const animationRef = useRef(null);
  const cachedCanvas = useRef(null);

  // 奖励配置 - 优化整数版本
  const rewardConfig = useMemo(() => ({
    MAO: {
      betAmount: 100,
      rewards: [
        { level: 0, name: '谢谢惠顾', amount: 0, color: '#6B7280', textColor: '#FFFFFF' },
        { level: 1, name: '安慰奖', amount: 25, color: '#F59E0B', textColor: '#FFFFFF' },
        { level: 2, name: '小奖', amount: 80, color: '#EF4444', textColor: '#FFFFFF' },
        { level: 3, name: '中奖', amount: 200, color: '#8B5CF6', textColor: '#FFFFFF' },
        { level: 4, name: '大奖', amount: 500, color: '#10B981', textColor: '#FFFFFF' },
        { level: 5, name: '超级大奖', amount: 1000, color: '#F97316', textColor: '#FFFFFF' },
        { level: 6, name: '终极大奖', amount: 2000, color: '#DC2626', textColor: '#FFFFFF' }
      ]
    },
    PI: {
      betAmount: 1000,
      rewards: [
        { level: 0, name: '谢谢惠顾', amount: 0, color: '#6B7280', textColor: '#FFFFFF' },
        { level: 1, name: '安慰奖', amount: 250, color: '#F59E0B', textColor: '#FFFFFF' },
        { level: 2, name: '小奖', amount: 800, color: '#EF4444', textColor: '#FFFFFF' },
        { level: 3, name: '中奖', amount: 2000, color: '#8B5CF6', textColor: '#FFFFFF' },
        { level: 4, name: '大奖', amount: 5000, color: '#10B981', textColor: '#FFFFFF' },
        { level: 5, name: '超级大奖', amount: 10000, color: '#F97316', textColor: '#FFFFFF' },
        { level: 6, name: '终极大奖', amount: 20000, color: '#DC2626', textColor: '#FFFFFF' }
      ]
    }
  }), []);

  // 计算转盘区域 - 优化性能
  const sections = useMemo(() => {
    const rewards = rewardConfig[selectedToken].rewards;
    const anglePerSection = 360 / 7;
    return rewards.map((reward, index) => ({
      ...reward,
      startAngle: index * anglePerSection,
      endAngle: (index + 1) * anglePerSection,
      angle: anglePerSection
    }));
  }, [selectedToken, rewardConfig]);

  // 优化的转盘绘制函数 - 使用缓存和离屏渲染
  const drawWheel = useCallback(() => {
    const canvas = wheelRef.current;
    if (!canvas) return;

    // 检查是否需要重新绘制
    const cacheKey = `${selectedToken}-${canvas.width}x${canvas.height}`;
    if (cachedCanvas.current === cacheKey) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // 使用离屏canvas提高性能
    const offscreenCanvas = new OffscreenCanvas ? new OffscreenCanvas(canvas.width, canvas.height) : document.createElement('canvas');
    if (!offscreenCanvas.getContext) {
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
    }
    const offCtx = offscreenCanvas.getContext('2d');

    offCtx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制外圆阴影
    offCtx.beginPath();
    offCtx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    offCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    offCtx.fill();

    // 批量绘制扇形 - 优化路径操作
    offCtx.save();
    sections.forEach((section, index) => {
      const startAngle = (section.startAngle * Math.PI) / 180 - Math.PI / 2;
      const endAngle = (section.endAngle * Math.PI) / 180 - Math.PI / 2;

      // 绘制扇形
      offCtx.beginPath();
      offCtx.moveTo(centerX, centerY);
      offCtx.arc(centerX, centerY, radius, startAngle, endAngle);
      offCtx.closePath();
      
      // 渐变色填充
      const gradient = offCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, section.color);
      gradient.addColorStop(1, section.color + '80');
      offCtx.fillStyle = gradient;
      offCtx.fill();
      
      // 边框
      offCtx.strokeStyle = '#FFFFFF';
      offCtx.lineWidth = 2;
      offCtx.stroke();

      // 绘制文字 - 优化字体渲染
      const textAngle = (startAngle + endAngle) / 2;
      const textRadius = radius * 0.7;
      const textX = centerX + Math.cos(textAngle) * textRadius;
      const textY = centerY + Math.sin(textAngle) * textRadius;

      offCtx.save();
      offCtx.translate(textX, textY);
      offCtx.rotate(textAngle + Math.PI / 2);
      offCtx.fillStyle = section.textColor;
      offCtx.font = 'bold 10px -apple-system, BlinkMacSystemFont, Arial';
      offCtx.textAlign = 'center';
      offCtx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      offCtx.lineWidth = 1;
      
      // 文字描边和填充
      offCtx.strokeText(section.name, 0, -3);
      offCtx.fillText(section.name, 0, -3);
      
      if (section.amount > 0) {
        offCtx.font = 'bold 8px -apple-system, BlinkMacSystemFont, Arial';
        const amountText = section.amount >= 1000 ? `${(section.amount / 1000).toFixed(0)}K` : section.amount.toLocaleString();
        offCtx.strokeText(amountText, 0, 8);
        offCtx.fillText(amountText, 0, 8);
      }
      offCtx.restore();
    });
    offCtx.restore();

    // 绘制中心装饰圆
    const centerGradient = offCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
    centerGradient.addColorStop(0, '#FFFFFF');
    centerGradient.addColorStop(1, '#E5E7EB');
    offCtx.beginPath();
    offCtx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    offCtx.fillStyle = centerGradient;
    offCtx.fill();
    offCtx.strokeStyle = '#374151';
    offCtx.lineWidth = 2;
    offCtx.stroke();

    // 中心LOGO
    offCtx.fillStyle = '#374151';
    offCtx.font = 'bold 14px -apple-system, BlinkMacSystemFont, Arial';
    offCtx.textAlign = 'center';
    offCtx.fillText('🎰', centerX, centerY + 5);

    // 绘制指针
    const pointerSize = 20;
    offCtx.beginPath();
    offCtx.moveTo(centerX + radius + 3, centerY);
    offCtx.lineTo(centerX + radius - pointerSize, centerY - pointerSize / 2);
    offCtx.lineTo(centerX + radius - pointerSize, centerY + pointerSize / 2);
    offCtx.closePath();
    
    // 指针渐变
    const pointerGradient = offCtx.createLinearGradient(centerX + radius + 3, centerY, centerX + radius - pointerSize, centerY);
    pointerGradient.addColorStop(0, '#EF4444');
    pointerGradient.addColorStop(1, '#DC2626');
    offCtx.fillStyle = pointerGradient;
    offCtx.fill();
    offCtx.strokeStyle = '#7F1D1D';
    offCtx.lineWidth = 2;
    offCtx.stroke();

    // 复制到主canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (offscreenCanvas.transferToImageBitmap) {
      const imageBitmap = offscreenCanvas.transferToImageBitmap();
      ctx.drawImage(imageBitmap, 0, 0);
    } else {
      ctx.drawImage(offscreenCanvas, 0, 0);
    }

    // 缓存标记
    cachedCanvas.current = cacheKey;
  }, [sections, selectedToken]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // 高性能转盘动画 - 使用RAF和硬件加速
  const spinWheel = useCallback((finalAngle) => {
    const canvas = wheelRef.current;
    if (!canvas) return;

    // 取消之前的动画
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const spins = 6;
    const totalRotation = spins * 360 + finalAngle;
    const duration = 3000;
    const startTime = performance.now();
    let currentRotation = 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用三次贝塞尔缓动函数，更流畅
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentRotation = totalRotation * easeOut;

      // 使用transform3d启用硬件加速
      canvas.style.transform = `translate3d(0, 0, 0) rotate(${currentRotation}deg)`;

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setShowResult(true);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // 正确的概率分布函数 - 60%谢谢惠顾，40%中奖
  const simulateGame = useCallback(() => {
    const random = Math.random() * 10000; // 使用10000为基数提高精度
    let selectedLevel = 0;
    
    // 智能合约概率分布 (60%谢谢惠顾, 40%中奖率)
    if (random < 6000) {
      selectedLevel = 0; // 谢谢惠顾 60%
    } else if (random < 7600) {
      selectedLevel = 1; // 安慰奖 16%
    } else if (random < 8800) {
      selectedLevel = 2; // 小奖 12%
    } else if (random < 9600) {
      selectedLevel = 3; // 中奖 8%
    } else if (random < 9900) {
      selectedLevel = 4; // 大奖 3%
    } else if (random < 9990) {
      selectedLevel = 5; // 超级大奖 0.9%
    } else {
      selectedLevel = 6; // 终极大奖 0.1%
    }

    const reward = rewardConfig[selectedToken].rewards[selectedLevel];
    return {
      level: selectedLevel,
      name: reward.name,
      amount: reward.amount,
      isWin: selectedLevel > 0
    };
  }, [selectedToken, rewardConfig]);

  // 防抖处理的游戏函数
  const playGame = useCallback(async () => {
    if (!account) {
      alert('请先连接钱包');
      return;
    }

    if (isSpinning) return; // 防止重复点击

    const config = rewardConfig[selectedToken];
    const requiredBalance = config.betAmount;

    if (balances[selectedToken] < requiredBalance) {
      alert(`余额不足！需要 ${requiredBalance.toLocaleString()} ${selectedToken}`);
      return;
    }

    try {
      setIsSpinning(true);
      setShowResult(false);
      setLastResult(null);

      // 模拟游戏结果（实际应该调用智能合约）
      const result = simulateGame();
      setLastResult(result);

      // 计算转盘停止位置
      const section = sections[result.level];
      const randomAngleInSection = Math.random() * section.angle;
      const finalAngle = 360 - (section.startAngle + randomAngleInSection);

      // 开始转盘动画
      spinWheel(finalAngle);

      // 模拟交易确认延迟
      setTimeout(() => {
        if (onUpdateBalances) {
          onUpdateBalances();
        }
        if (onGameResult) {
          onGameResult(result);
        }
      }, 3000);

    } catch (error) {
      console.error('游戏错误:', error);
      setIsSpinning(false);
      alert('游戏失败：' + error.message);
    }
  }, [account, isSpinning, selectedToken, balances, rewardConfig, simulateGame, sections, spinWheel, onUpdateBalances, onGameResult]);

  // 关闭结果显示
  const closeResult = useCallback(() => {
    setShowResult(false);
    setLastResult(null);
    if (wheelRef.current) {
      wheelRef.current.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
    }
  }, []);

  // 清理动画
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
      <h3 className="text-xl font-bold text-white mb-4 text-center">
        🎰 {selectedToken} 转盘游戏
      </h3>
      
      {/* 转盘 */}
      <div className="flex justify-center mb-6">
        <div className="relative wheel-container">
          <canvas
            ref={wheelRef}
            width={280}
            height={280}
            className="transition-transform duration-1000 ease-out drop-shadow-xl will-change-transform"
            style={{ imageRendering: 'auto' }}
          />
        </div>
      </div>

      {/* 游戏信息 - 优化布局 */}
      <div className="bg-white/20 rounded-lg p-3 mb-4">
        <div className="text-center">
          <div className="text-blue-200 text-sm space-y-1">
            <p>投注: <span className="text-yellow-400 font-bold">
              {rewardConfig[selectedToken].betAmount.toLocaleString()} {selectedToken}
            </span></p>
            <p>余额: <span className="text-green-400 font-bold">
              {(balances[selectedToken] || 0).toLocaleString()} {selectedToken}
            </span></p>
          </div>
        </div>
      </div>

      {/* 游戏按钮 - 优化交互 */}
      <div className="text-center mb-4">
        <button
          onClick={playGame}
          disabled={isSpinning || !account || balances[selectedToken] < rewardConfig[selectedToken].betAmount}
          className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 transform ${
            isSpinning
              ? 'bg-gray-500 cursor-not-allowed'
              : !account
              ? 'bg-gray-500 cursor-not-allowed'
              : balances[selectedToken] < rewardConfig[selectedToken].betAmount
              ? 'bg-red-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white active:scale-95 shadow-lg will-change-transform'
          }`}
        >
          {isSpinning ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              转盘中...
            </div>
          ) : !account ? (
            '请连接钱包'
          ) : balances[selectedToken] < rewardConfig[selectedToken].betAmount ? (
            '余额不足'
          ) : (
            `🎯 开始游戏`
          )}
        </button>
      </div>

      {/* 奖励表 - 移除概率显示 */}
      <div className="bg-white/20 rounded-lg p-3">
        <h5 className="text-white font-semibold mb-2 text-center text-sm">🏆 奖励表</h5>
        <div className="grid grid-cols-1 gap-1 text-xs">
          {rewardConfig[selectedToken].rewards.map((reward, index) => (
            <div key={index} className="flex justify-between items-center p-2 rounded hover:bg-white/10 transition-colors">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded mr-2"
                  style={{ backgroundColor: reward.color }}
                ></div>
                <span className="text-white text-xs font-medium">{reward.name}</span>
              </div>
              <div className="text-yellow-400 font-bold text-xs">
                {reward.amount > 0 ? (
                  reward.amount >= 1000 ? `${(reward.amount / 1000).toFixed(0)}K` : reward.amount.toLocaleString()
                ) : '无'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 结果弹窗 - 优化动画 */}
      {showResult && lastResult && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" 
          onClick={closeResult}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl animate-slideUp will-change-transform" 
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-5xl mb-4 animate-bounce">
                {lastResult.isWin ? '🎉' : '😔'}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                {lastResult.name}
              </h3>
              {lastResult.isWin ? (
                <div>
                  <p className="text-green-600 text-lg font-bold mb-2">
                    恭喜中奖！
                  </p>
                  <p className="text-gray-600 mb-4">
                    获得奖励: <span className="text-yellow-600 font-bold text-lg">
                      {lastResult.amount >= 1000 ? `${(lastResult.amount / 1000).toFixed(0)}K` : lastResult.amount.toLocaleString()} {selectedToken}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 mb-4">
                  很遗憾，请再试一次！
                </p>
              )}
              <button
                onClick={closeResult}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform active:scale-95 transition-all will-change-transform"
              >
                继续游戏
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MobileWheelGame; 