import { useState, useEffect } from 'react';

const GameHistory = ({ history, account }) => {
  const [localHistory, setLocalHistory] = useState([]);

  useEffect(() => {
    // 从本地存储加载历史记录
    if (typeof window !== 'undefined' && account) {
      const stored = localStorage.getItem(`gameHistory_${account}`);
      if (stored) {
        setLocalHistory(JSON.parse(stored));
      }
    }
  }, [account]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(2);
  };

  // 模拟历史数据（用于演示）
  const mockHistory = [
    {
      id: 1,
      token: 'MAO',
      betAmount: '100',
      rewardAmount: '0',
      isWin: false,
      timestamp: Date.now() - 3600000,
      txHash: '0x123...abc'
    },
    {
      id: 2,
      token: 'PI',
      betAmount: '10000',
      rewardAmount: '1000',
      isWin: true,
      timestamp: Date.now() - 7200000,
      txHash: '0x456...def'
    },
    {
      id: 3,
      token: 'MAO',
      betAmount: '100',
      rewardAmount: '25',
      isWin: true,
      timestamp: Date.now() - 10800000,
      txHash: '0x789...ghi'
    }
  ];

  const displayHistory = localHistory.length > 0 ? localHistory : mockHistory;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 h-full">
      <h3 className="text-xl font-semibold text-white mb-4">游戏历史</h3>
      
      {!account ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📈</div>
          <p className="text-blue-200">连接钱包查看游戏历史</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎮</div>
              <p className="text-blue-200">还没有游戏记录</p>
              <p className="text-blue-200 text-sm mt-1">开始您的第一次游戏吧！</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-blue-200 text-sm">最近游戏记录</span>
                <span className="text-blue-200 text-sm">{displayHistory.length} 条记录</span>
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-3">
                {displayHistory.map((game) => (
                  <div
                    key={game.id}
                    className={`p-4 rounded-lg border ${
                      game.isWin
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">
                          {game.isWin ? '🎉' : '😔'}
                        </div>
                        <div>
                          <div className="text-white font-semibold">
                            {game.token} 转盘
                          </div>
                          <div className="text-blue-200 text-xs">
                            {formatTime(game.timestamp)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-bold ${
                          game.isWin ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {game.isWin ? `+${formatAmount(game.rewardAmount)}` : '谢谢惠顾'}
                        </div>
                        <div className="text-blue-200 text-xs">
                          投注: {formatAmount(game.betAmount)} {game.token}
                        </div>
                      </div>
                    </div>
                    
                    {game.txHash && (
                      <div className="mt-2 pt-2 border-t border-white/20">
                        <a
                          href={`https://alveyscan.com/tx/${game.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-xs flex items-center"
                        >
                          <span className="mr-1">🔗</span>
                          查看交易详情
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">总游戏次数:</span>
                  <span className="text-white font-semibold">{displayHistory.length}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-blue-200">胜率:</span>
                  <span className="text-green-400 font-semibold">
                    {displayHistory.length > 0 
                      ? `${((displayHistory.filter(g => g.isWin).length / displayHistory.length) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GameHistory; 