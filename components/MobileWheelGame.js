import { useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers';

const MobileWheelGame = ({ account, contract, balances, selectedToken, onUpdateBalances, onGameResult }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef(null);

  // 奖励配置
  const rewardConfig = {
    MAO: {
      betAmount: 100,
      rewards: [
        { level: 0, name: '谢谢惠顾', amount: 0, color: '#6B7280', textColor: '#FFFFFF' },
        { level: 1, name: '小奖', amount: 150, color: '#F59E0B', textColor: '#FFFFFF' },
        { level: 2, name: '中奖', amount: 400, color: '#EF4444', textColor: '#FFFFFF' },
        { level: 3, name: '大奖', amount: 800, color: '#8B5CF6', textColor: '#FFFFFF' },
        { level: 4, name: '超级大奖', amount: 1500, color: '#10B981', textColor: '#FFFFFF' },
        { level: 5, name: '终极大奖', amount: 3000, color: '#F97316', textColor: '#FFFFFF' }
      ]
    },
    PI: {
      betAmount: 10000,
      rewards: [
        { level: 0, name: '谢谢惠顾', amount: 0, color: '#6B7280', textColor: '#FFFFFF' },
        { level: 1, name: '小奖', amount: 15000, color: '#F59E0B', textColor: '#FFFFFF' },
        { level: 2, name: '中奖', amount: 40000, color: '#EF4444', textColor: '#FFFFFF' },
        { level: 3, name: '大奖', amount: 80000, color: '#8B5CF6', textColor: '#FFFFFF' },
        { level: 4, name: '超级大奖', amount: 150000, color: '#10B981', textColor: '#FFFFFF' },
        { level: 5, name: '终极大奖', amount: 300000, color: '#F97316', textColor: '#FFFFFF' }
      ]
    }
  };

  // 计算转盘区域
  const calculateSections = (rewards) => {
    const anglePerSection = 360 / 6;
    return rewards.map((reward, index) => ({
      ...reward,
      startAngle: index * anglePerSection,
      endAngle: (index + 1) * anglePerSection,
      angle: anglePerSection
    }));
  };

  const sections = calculateSections(rewardConfig[selectedToken].rewards);

  // 绘制移动端转盘
  const drawWheel = () => {
    const canvas = wheelRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制外圆阴影
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();

    // 绘制扇形
    sections.forEach((section, index) => {
      const startAngle = (section.startAngle * Math.PI) / 180 - Math.PI / 2;
      const endAngle = (section.endAngle * Math.PI) / 180 - Math.PI / 2;

      // 绘制扇形
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // 渐变色填充
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, section.color);
      gradient.addColorStop(1, section.color + '80');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // 边框
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 绘制文字
      const textAngle = (startAngle + endAngle) / 2;
      const textRadius = radius * 0.7;
      const textX = centerX + Math.cos(textAngle) * textRadius;
      const textY = centerY + Math.sin(textAngle) * textRadius;

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = section.textColor;
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.lineWidth = 1;
      
      // 文字描边和填充
      ctx.strokeText(section.name, 0, -3);
      ctx.fillText(section.name, 0, -3);
      
      if (section.amount > 0) {
        ctx.font = 'bold 8px Arial';
        const amountText = `${section.amount.toLocaleString()}`;
        ctx.strokeText(amountText, 0, 8);
        ctx.fillText(amountText, 0, 8);
      }
      ctx.restore();
    });

    // 绘制中心装饰圆
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
    centerGradient.addColorStop(0, '#FFFFFF');
    centerGradient.addColorStop(1, '#E5E7EB');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 中心LOGO
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎰', centerX, centerY + 5);

    // 绘制指针
    const pointerSize = 20;
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 3, centerY);
    ctx.lineTo(centerX + radius - pointerSize, centerY - pointerSize / 2);
    ctx.lineTo(centerX + radius - pointerSize, centerY + pointerSize / 2);
    ctx.closePath();
    
    // 指针渐变
    const pointerGradient = ctx.createLinearGradient(centerX + radius + 3, centerY, centerX + radius - pointerSize, centerY);
    pointerGradient.addColorStop(0, '#EF4444');
    pointerGradient.addColorStop(1, '#DC2626');
    ctx.fillStyle = pointerGradient;
    ctx.fill();
    ctx.strokeStyle = '#7F1D1D';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    drawWheel();
  }, [selectedToken]);

  // 转盘动画
  const spinWheel = (finalAngle) => {
    const canvas = wheelRef.current;
    if (!canvas) return;

    const spins = 6;
    const totalRotation = spins * 360 + finalAngle;
    const duration = 3000; // 3秒
    const startTime = Date.now();
    let currentRotation = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 4);
      currentRotation = totalRotation * easeOut;

      canvas.style.transform = `rotate(${currentRotation}deg)`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setShowResult(true);
      }
    };

    requestAnimationFrame(animate);
  };

  // 模拟游戏结果
  const simulateGame = () => {
    const random = Math.random();
    let selectedLevel = 0;
    
    // 模拟概率分布
    if (random < 0.85) {
      selectedLevel = 0; // 谢谢惠顾
    } else if (random < 0.93) {
      selectedLevel = 1; // 小奖
    } else if (random < 0.97) {
      selectedLevel = 2; // 中奖
    } else if (random < 0.99) {
      selectedLevel = 3; // 大奖
    } else if (random < 0.998) {
      selectedLevel = 4; // 超级大奖
    } else {
      selectedLevel = 5; // 终极大奖
    }

    const reward = rewardConfig[selectedToken].rewards[selectedLevel];
    return {
      level: selectedLevel,
      name: reward.name,
      amount: reward.amount,
      isWin: selectedLevel > 0
    };
  };

  // 玩游戏
  const playGame = async () => {
    if (!account) {
      alert('请先连接钱包');
      return;
    }

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
  };

  // 关闭结果显示
  const closeResult = () => {
    setShowResult(false);
    setLastResult(null);
    if (wheelRef.current) {
      wheelRef.current.style.transform = 'rotate(0deg)';
    }
  };

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
            width={260}
            height={260}
            className="transition-transform duration-1000 ease-out drop-shadow-xl"
          />
        </div>
      </div>

      {/* 游戏信息 */}
      <div className="bg-white/20 rounded-lg p-3 mb-4">
        <div className="text-center">
          <div className="text-blue-200 text-sm space-y-1">
            <p>投注: <span className="text-yellow-400 font-bold">
              {rewardConfig[selectedToken].betAmount.toLocaleString()} {selectedToken}
            </span></p>
            <p>余额: <span className="text-green-400 font-bold">
              {balances[selectedToken].toLocaleString()} {selectedToken}
            </span></p>
          </div>
        </div>
      </div>

      {/* 游戏按钮 */}
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
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white active:scale-95 shadow-lg'
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

      {/* 奖励表 */}
      <div className="bg-white/20 rounded-lg p-3">
        <h5 className="text-white font-semibold mb-2 text-center text-sm">🏆 奖励表</h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {rewardConfig[selectedToken].rewards.map((reward, index) => (
            <div key={index} className="flex justify-between items-center p-1 rounded">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded mr-1"
                  style={{ backgroundColor: reward.color }}
                ></div>
                <span className="text-white text-xs">{reward.name}</span>
              </div>
              <div className="text-yellow-400 font-bold text-xs">
                {reward.amount > 0 ? `${reward.amount.toLocaleString()}` : '无'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 结果弹窗 */}
      {showResult && lastResult && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-enter" 
          onClick={closeResult}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl" 
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
                      {lastResult.amount.toLocaleString()} {selectedToken}
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
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform active:scale-95 transition-all"
              >
                继续游戏
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileWheelGame; 