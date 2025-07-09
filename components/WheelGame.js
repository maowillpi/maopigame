import { useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers';

const WheelGame = ({ account, contract, balances, onUpdateBalances, onGameResult }) => {
  const [selectedToken, setSelectedToken] = useState('MAO');
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef(null);

  // 奖励配置 - 6个区域平均分配
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
      betAmount: 1000,
      rewards: [
        { level: 0, name: '谢谢惠顾', amount: 0, color: '#6B7280', textColor: '#FFFFFF' },
        { level: 1, name: '小奖', amount: 1500, color: '#F59E0B', textColor: '#FFFFFF' },
        { level: 2, name: '中奖', amount: 4000, color: '#EF4444', textColor: '#FFFFFF' },
        { level: 3, name: '大奖', amount: 8000, color: '#8B5CF6', textColor: '#FFFFFF' },
        { level: 4, name: '超级大奖', amount: 15000, color: '#10B981', textColor: '#FFFFFF' },
        { level: 5, name: '终极大奖', amount: 30000, color: '#F97316', textColor: '#FFFFFF' }
      ]
    }
  };

  // 6个平均分配的扇形区域
  const calculateSections = (rewards) => {
    const anglePerSection = 360 / 6; // 每个区域60度
    return rewards.map((reward, index) => ({
      ...reward,
      startAngle: index * anglePerSection,
      endAngle: (index + 1) * anglePerSection,
      angle: anglePerSection
    }));
  };

  const sections = calculateSections(rewardConfig[selectedToken].rewards);

  // 绘制美观的转盘
  const drawWheel = () => {
    const canvas = wheelRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 15;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制外圆阴影
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();

    // 绘制扇形
    sections.forEach((section, index) => {
      const startAngle = (section.startAngle * Math.PI) / 180 - Math.PI / 2; // 从顶部开始
      const endAngle = (section.endAngle * Math.PI) / 180 - Math.PI / 2;

      // 绘制扇形
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // 渐变色填充
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, section.color);
      gradient.addColorStop(1, section.color + '80'); // 添加透明度
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // 边框
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 绘制文字
      const textAngle = (startAngle + endAngle) / 2;
      const textRadius = radius * 0.65;
      const textX = centerX + Math.cos(textAngle) * textRadius;
      const textY = centerY + Math.sin(textAngle) * textRadius;

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = section.textColor;
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.lineWidth = 2;
      
      // 文字描边和填充
      ctx.strokeText(section.name, 0, -5);
      ctx.fillText(section.name, 0, -5);
      
      if (section.amount > 0) {
        ctx.font = 'bold 12px Arial';
        const amountText = `${section.amount.toLocaleString()}`;
        ctx.strokeText(amountText, 0, 10);
        ctx.fillText(amountText, 0, 10);
      }
      ctx.restore();
    });

    // 绘制中心装饰圆
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40);
    centerGradient.addColorStop(0, '#FFFFFF');
    centerGradient.addColorStop(1, '#E5E7EB');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 中心LOGO
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎰', centerX, centerY + 5);

    // 绘制指针
    const pointerSize = 25;
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 5, centerY);
    ctx.lineTo(centerX + radius - pointerSize, centerY - pointerSize / 2);
    ctx.lineTo(centerX + radius - pointerSize, centerY + pointerSize / 2);
    ctx.closePath();
    
    // 指针渐变
    const pointerGradient = ctx.createLinearGradient(centerX + radius + 5, centerY, centerX + radius - pointerSize, centerY);
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

    const spins = 8; // 转8圈
    const totalRotation = spins * 360 + finalAngle;
    const duration = 4000; // 4秒
    const startTime = Date.now();
    let currentRotation = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用缓动函数
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

  // 玩游戏
  const playGame = async () => {
    if (!account || !contract) {
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

      // 调用智能合约
      let tx;
      if (selectedToken === 'MAO') {
        tx = await contract.playMAOGame();
      } else {
        tx = await contract.playPIGame();
      }

      // 等待交易确认
      const receipt = await tx.wait();
      
      // 解析事件获取结果
      const gameEvent = receipt.events.find(event => event.event === 'GamePlayed');
      if (gameEvent) {
        const { rewardAmount, rewardLevel, randomSeed } = gameEvent.args;
        
        const result = {
          level: rewardLevel,
          name: config.rewards[rewardLevel].name,
          amount: parseFloat(ethers.utils.formatEther(rewardAmount)),
          isWin: rewardLevel > 0
        };

        setLastResult(result);

        // 计算转盘停止位置
        const section = sections[rewardLevel];
        const randomAngleInSection = Math.random() * section.angle;
        const finalAngle = 360 - (section.startAngle + randomAngleInSection);

        // 开始转盘动画
        spinWheel(finalAngle);

        // 更新余额
        if (onUpdateBalances) {
          onUpdateBalances();
        }

        // 通知游戏结果
        if (onGameResult) {
          onGameResult(result);
        }
      }
    } catch (error) {
      console.error('游戏错误:', error);
      setIsSpinning(false);
      alert('游戏失败：' + (error.reason || error.message));
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
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">🎰 转盘游戏</h3>
      
      {/* 代币选择 */}
      <div className="flex justify-center mb-6">
        <div className="bg-white/20 rounded-lg p-1 flex">
          {['MAO', 'PI'].map((token) => (
            <button
              key={token}
              onClick={() => setSelectedToken(token)}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                selectedToken === token
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              {token}
            </button>
          ))}
        </div>
      </div>

      {/* 转盘 */}
      <div className="flex justify-center mb-6">
        <div className="relative wheel-container">
          <canvas
            ref={wheelRef}
            width={350}
            height={350}
            className="transition-transform duration-1000 ease-out drop-shadow-2xl"
          />
        </div>
      </div>

      {/* 游戏信息 */}
      <div className="bg-white/20 rounded-lg p-4 mb-6">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-white mb-2">
            {selectedToken} 转盘游戏
          </h4>
          <div className="text-blue-200 text-sm space-y-1">
            <p>投注金额: <span className="text-yellow-400 font-bold">
              {rewardConfig[selectedToken].betAmount.toLocaleString()} {selectedToken}
            </span></p>
            <p>您的余额: <span className="text-green-400 font-bold">
              {parseFloat(balances[selectedToken]).toFixed(2)} {selectedToken}
            </span></p>
          </div>
        </div>
      </div>

      {/* 奖励表 - 隐藏概率 */}
      <div className="bg-white/20 rounded-lg p-4 mb-6">
        <h5 className="text-white font-semibold mb-3 text-center">🏆 奖励表</h5>
        <div className="space-y-2">
          {rewardConfig[selectedToken].rewards.map((reward, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded mr-2"
                  style={{ backgroundColor: reward.color }}
                ></div>
                <span className="text-white font-medium">{reward.name}</span>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-bold">
                  {reward.amount > 0 ? `${reward.amount.toLocaleString()} ${selectedToken}` : '无奖励'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 游戏按钮 */}
      <div className="text-center">
        <button
          onClick={playGame}
          disabled={isSpinning || !account || balances[selectedToken] < rewardConfig[selectedToken].betAmount}
          className={`w-full py-4 px-6 rounded-lg font-bold text-xl transition-all duration-200 transform ${
            isSpinning
              ? 'bg-gray-500 cursor-not-allowed'
              : !account
              ? 'bg-gray-500 cursor-not-allowed'
              : balances[selectedToken] < rewardConfig[selectedToken].betAmount
              ? 'bg-red-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white hover:scale-105 shadow-lg'
          }`}
        >
          {isSpinning ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
              转盘中...
            </div>
          ) : !account ? (
            '请连接钱包'
          ) : balances[selectedToken] < rewardConfig[selectedToken].betAmount ? (
            '余额不足'
          ) : (
            `🎯 开始游戏 (${rewardConfig[selectedToken].betAmount.toLocaleString()} ${selectedToken})`
          )}
        </button>
      </div>

      {/* 结果弹窗 */}
      {showResult && lastResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-enter" onClick={closeResult}>
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">
                {lastResult.isWin ? '🎉' : '😔'}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">
                {lastResult.name}
              </h3>
              {lastResult.isWin ? (
                <div>
                  <p className="text-green-600 text-xl font-bold mb-2">
                    恭喜中奖！
                  </p>
                  <p className="text-gray-600 mb-4">
                    获得奖励: <span className="text-yellow-600 font-bold text-xl">
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all"
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

export default WheelGame; 