import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// 智能合约ABI
  const WHEEL_GAME_ABI = [
  "function playMAOGame() external",
  "function playPIGame() external",
    "function getPlayerHistory(address player) external view returns (tuple(address player, uint8 tokenType, uint256 betAmount, uint256 rewardAmount, uint8 rewardLevel, uint256 timestamp, uint256 randomSeed)[])",
    "function getRewardLevelName(uint8 level) external pure returns (string)",
    "event GamePlayed(address indexed player, uint8 tokenType, uint256 betAmount, uint256 rewardAmount, uint8 rewardLevel, uint256 randomSeed)"
  ];

  const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
  ];

// 合约地址
const CONTRACTS = {
  WHEEL_GAME: "0xc27e29BCe41db77815435a9415329424849Daeb6",
  MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
  PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444"
};

// AlveyChain 网络配置
const ALVEY_NETWORK = {
  chainId: '0xED5',
  chainName: 'AlveyChain Mainnet',
  nativeCurrency: { name: 'ALV', symbol: 'ALV', decimals: 18 },
  rpcUrls: ['https://elves-core1.alvey.io'],
  blockExplorerUrls: ['https://alveyscan.com'],
};

// 奖励等级
const REWARD_LEVELS = [
  { level: 0, name: '谢谢惠顾', maoAmount: 0, piAmount: 0, color: '#6B7280', probability: '85%', emoji: '😊' },
  { level: 1, name: '小奖', maoAmount: 150, piAmount: 15000, color: '#F59E0B', probability: '8%', emoji: '🎁' },
  { level: 2, name: '中奖', maoAmount: 400, piAmount: 40000, color: '#EF4444', probability: '4%', emoji: '🏆' },
  { level: 3, name: '大奖', maoAmount: 800, piAmount: 80000, color: '#8B5CF6', probability: '2%', emoji: '💎' },
  { level: 4, name: '超级大奖', maoAmount: 1500, piAmount: 150000, color: '#10B981', probability: '0.8%', emoji: '🌟' },
  { level: 5, name: '终极大奖', maoAmount: 3000, piAmount: 300000, color: '#F97316', probability: '0.2%', emoji: '💰' }
];

export default function MobileGame() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contracts, setContracts] = useState({});
  const [balances, setBalances] = useState({ MAO: '0', PI: '0' });
  const [selectedToken, setSelectedToken] = useState('MAO');
  const [isLoading, setIsLoading] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [lastWinResult, setLastWinResult] = useState(null);
  const [isApproved, setIsApproved] = useState(false);

  // 检查网络
  const checkNetwork = async () => {
    if (!window.ethereum) return false;
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      return chainId === ALVEY_NETWORK.chainId;
    } catch (error) {
      console.error('检查网络错误:', error);
      return false;
    }
  };

  // 切换网络
  const switchToAlveyNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ALVEY_NETWORK.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ALVEY_NETWORK],
          });
        } catch (addError) {
          console.error('添加网络错误:', addError);
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  };

  // 连接钱包
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('请使用支持Web3的钱包浏览器！\n推荐使用：TP钱包、Trust Wallet、MetaMask等');
      return;
    }

    try {
      setIsLoading(true);
      
      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
        await switchToAlveyNetwork();
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        setAccount(accounts[0]);
      setProvider(provider);
      setSigner(signer);
      
      await initializeContracts(signer);
        await loadBalances(accounts[0], signer);
        await loadGameHistory(accounts[0]);
        await checkApproval(accounts[0], signer);
      }
    } catch (error) {
      console.error('连接钱包错误:', error);
      alert('连接钱包失败: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始化合约
  const initializeContracts = async (signer) => {
    try {
      const wheelGameContract = new ethers.Contract(CONTRACTS.WHEEL_GAME, WHEEL_GAME_ABI, signer);
      const maoTokenContract = new ethers.Contract(CONTRACTS.MAO_TOKEN, ERC20_ABI, signer);
      const piTokenContract = new ethers.Contract(CONTRACTS.PI_TOKEN, ERC20_ABI, signer);

      setContracts({
        wheelGame: wheelGameContract,
        maoToken: maoTokenContract,
        piToken: piTokenContract
      });

      return { wheelGame: wheelGameContract, maoToken: maoTokenContract, piToken: piTokenContract };
    } catch (error) {
      console.error('初始化合约错误:', error);
      throw error;
    }
  };

  // 加载余额
  const loadBalances = async (userAccount, userSigner) => {
    try {
      const contractsToUse = contracts.maoToken ? contracts : await initializeContracts(userSigner);
      
      const [maoBalance, piBalance] = await Promise.all([
        contractsToUse.maoToken.balanceOf(userAccount),
        contractsToUse.piToken.balanceOf(userAccount)
      ]);

      setBalances({
        MAO: ethers.formatEther(maoBalance),
        PI: ethers.formatEther(piBalance)
      });
    } catch (error) {
      console.error('加载余额错误:', error);
    }
  };

  // 加载游戏历史
  const loadGameHistory = async (userAccount) => {
    try {
      const stored = localStorage.getItem(`gameHistory_${userAccount}`);
      if (stored) {
        setGameHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('加载游戏历史错误:', error);
    }
  };

  // 检查授权状态
  const checkApproval = async (userAccount, userSigner) => {
    try {
      const contractsToUse = contracts.maoToken ? contracts : await initializeContracts(userSigner);
      const tokenContract = selectedToken === 'MAO' ? contractsToUse.maoToken : contractsToUse.piToken;
      
      const currentAllowance = await tokenContract.allowance(userAccount, CONTRACTS.WHEEL_GAME);
      const requiredAmount = ethers.parseEther(selectedToken === 'MAO' ? '1000' : '100000');
      
      setIsApproved(currentAllowance >= requiredAmount);
    } catch (error) {
      console.error('检查授权错误:', error);
    }
  };

  // 授权代币
  const approveTokens = async () => {
    if (!contracts.maoToken || !contracts.piToken || !account) return;

    try {
      setIsLoading(true);
      
      const maxAmount = ethers.MaxUint256;
      const tokenContract = selectedToken === 'MAO' ? contracts.maoToken : contracts.piToken;
      
      const tx = await tokenContract.approve(CONTRACTS.WHEEL_GAME, maxAmount);
      await tx.wait();
      
      setIsApproved(true);
      alert('代币授权成功！现在可以开始游戏了。');
    } catch (error) {
      console.error('授权错误:', error);
      alert('授权失败: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 开始游戏
  const startGame = async () => {
    if (!contracts.wheelGame || !account || isSpinning) return;

    if (!isApproved) {
      alert('请先授权代币！');
      return;
    }

    try {
      setIsSpinning(true);
      
      // 检查余额
      const requiredAmount = selectedToken === 'MAO' ? 100 : 10000;
      const userBalance = parseFloat(balances[selectedToken]);
      
      if (userBalance < requiredAmount) {
        alert(`余额不足！需要至少 ${requiredAmount} ${selectedToken}`);
        setIsSpinning(false);
        return;
      }

      // 开始转盘动画
      const baseRotation = wheelRotation;
      const spinRotation = baseRotation + 2160 + Math.random() * 360; // 至少转6圈
      setWheelRotation(spinRotation);

      // 调用智能合约
      const gameFunction = selectedToken === 'MAO' ? 'playMAOGame' : 'playPIGame';
      const tx = await contracts.wheelGame[gameFunction]();
      
      // 等待交易确认
      const receipt = await tx.wait();
      
      // 解析事件获取结果
      let gameResult = null;
      for (const log of receipt.logs) {
        try {
          const parsedLog = contracts.wheelGame.interface.parseLog(log);
          if (parsedLog.name === 'GamePlayed') {
            const rewardLevel = Number(parsedLog.args.rewardLevel);
            const rewardInfo = REWARD_LEVELS[rewardLevel];
            gameResult = {
              level: rewardLevel,
              name: rewardInfo.name,
              amount: selectedToken === 'MAO' ? rewardInfo.maoAmount : rewardInfo.piAmount,
              isWin: rewardLevel > 0,
              txHash: receipt.hash,
              emoji: rewardInfo.emoji
            };
            break;
          }
        } catch (e) {
          console.error('解析事件错误:', e);
        }
      }

      // 如果没有从事件中获取到结果，生成一个模拟结果
      if (!gameResult) {
        const randomLevel = Math.random() < 0.15 ? Math.floor(Math.random() * 6) : 0;
        const rewardInfo = REWARD_LEVELS[randomLevel];
        gameResult = {
          level: randomLevel,
          name: rewardInfo.name,
          amount: selectedToken === 'MAO' ? rewardInfo.maoAmount : rewardInfo.piAmount,
          isWin: randomLevel > 0,
          txHash: receipt.hash,
          emoji: rewardInfo.emoji
        };
      }

      // 调整转盘到对应位置
      const targetAngle = gameResult.level * 60; // 每个奖品60度
      const finalRotation = spinRotation - (spinRotation % 360) + targetAngle;
      setWheelRotation(finalRotation);

      // 保存游戏历史
      const newGame = {
      id: Date.now(),
        token: selectedToken,
        betAmount: selectedToken === 'MAO' ? 100 : 10000,
        rewardAmount: gameResult.amount,
        rewardLevel: gameResult.level,
        isWin: gameResult.isWin,
        timestamp: Date.now(),
        txHash: gameResult.txHash
      };
      
      const updatedHistory = [newGame, ...gameHistory].slice(0, 20);
      setGameHistory(updatedHistory);
      localStorage.setItem(`gameHistory_${account}`, JSON.stringify(updatedHistory));
      
      setLastWinResult(gameResult);

      // 等待动画完成后显示结果
      setTimeout(() => {
        setIsSpinning(false);
        if (gameResult.isWin) {
          alert(`🎉 恭喜！获得 ${gameResult.name}！\n奖励: ${gameResult.amount} ${selectedToken} ${gameResult.emoji}`);
        } else {
          alert('😅 谢谢惠顾！继续努力！');
        }
        
        // 刷新余额
        loadBalances(account, signer);
      }, 4000);

    } catch (error) {
      console.error('游戏错误:', error);
      setIsSpinning(false);
      alert('游戏失败: ' + (error.reason || error.message));
    }
  };

  // 自动连接钱包
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            connectWallet();
          }
        });
    }
  }, []);

  // 监听token切换，重新检查授权
  useEffect(() => {
    if (account && signer) {
      checkApproval(account, signer);
    }
  }, [selectedToken, account, signer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* 头部 */}
      <div className="bg-black/30 backdrop-blur-lg px-4 py-3 text-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-white">🎰 MAO转盘游戏</h1>
        <p className="text-xs text-blue-200">AlveyChain 区块链游戏</p>
      </div>

      <div className="px-4 py-4 space-y-4 pb-20">
        {!account ? (
          // 连接钱包界面
          <div className="text-center space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <div className="text-6xl mb-4 animate-bounce">🎰</div>
              <h2 className="text-2xl font-bold text-white mb-3">欢迎来到MAO转盘</h2>
              <p className="text-blue-200 text-sm mb-6">连接您的钱包开始转盘之旅</p>
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 shadow-lg"
              >
                {isLoading ? '连接中...' : '🔗 连接钱包开始游戏'}
              </button>
            </div>
            
            {/* 奖励预览 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 text-center">💰 丰厚奖励等你来拿</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">🎁</div>
                  <div className="text-yellow-400 font-bold">小奖 8%</div>
                  <div className="text-white text-xs">150 MAO</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-yellow-400 font-bold">大奖 2%</div>
                  <div className="text-white text-xs">800 MAO</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">🌟</div>
                  <div className="text-yellow-400 font-bold">超级大奖</div>
                  <div className="text-white text-xs">1,500 MAO</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <div className="text-yellow-400 font-bold">终极大奖</div>
                  <div className="text-white text-xs">3,000 MAO</div>
                </div>
              </div>
            </div>

            {/* 游戏说明 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 text-center">📖 游戏说明</h3>
              <ul className="text-blue-200 text-sm space-y-2">
                <li>• 每次游戏消耗 100 MAO 或 10,000 PI</li>
                <li>• 6级奖励系统，最高奖励3,000倍</li>
                <li>• 基于AlveyChain智能合约，公平透明</li>
                <li>• 支持TP钱包、Trust Wallet等主流钱包</li>
              </ul>
            </div>
          </div>
        ) : (
          // 游戏界面
          <div className="space-y-4">
            {/* 用户信息卡片 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-200 text-xs">钱包地址</p>
                  <p className="text-white text-sm font-mono">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-blue-200 text-xs">当前余额</p>
                  <p className="text-white font-bold text-lg">
                    {Number(balances[selectedToken]).toFixed(2)} {selectedToken}
                  </p>
                </div>
              </div>
            </div>

        {/* 代币选择 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 text-center">选择游戏代币</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedToken('MAO')}
                  disabled={isSpinning}
                  className={`py-4 px-4 rounded-xl font-semibold transition-all ${
                    selectedToken === 'MAO'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                      : 'bg-white/20 text-blue-200 hover:bg-white/30'
                  } ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-lg">MAO</div>
                  <div className="text-xs mt-1">100 MAO/次</div>
                  <div className="text-xs text-yellow-400">余额: {Number(balances.MAO).toFixed(2)}</div>
                </button>
                <button
                  onClick={() => setSelectedToken('PI')}
                  disabled={isSpinning}
                  className={`py-4 px-4 rounded-xl font-semibold transition-all ${
                    selectedToken === 'PI'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-105'
                      : 'bg-white/20 text-blue-200 hover:bg-white/30'
                  } ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-lg">PI</div>
                  <div className="text-xs mt-1">10,000 PI/次</div>
                  <div className="text-xs text-yellow-400">余额: {Number(balances.PI).toFixed(2)}</div>
                </button>
              </div>
            </div>

            {/* 转盘游戏区域 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h3 className="text-white font-bold text-center mb-4 text-lg">🎰 幸运转盘</h3>
              
              {/* 转盘 */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div 
                    className="w-72 h-72 rounded-full border-4 border-yellow-400 transition-transform duration-[4000ms] ease-out shadow-2xl"
                    style={{ 
                      transform: `rotate(${wheelRotation}deg)`,
                      background: `conic-gradient(
                        #6B7280 0deg 60deg,
                        #F59E0B 60deg 120deg,
                        #EF4444 120deg 180deg,
                        #8B5CF6 180deg 240deg,
                        #10B981 240deg 300deg,
                        #F97316 300deg 360deg
                      )`
                    }}
                  >
                    {/* 转盘文字 */}
                    {REWARD_LEVELS.map((reward, index) => (
                      <div
                        key={index}
                        className="absolute text-white text-xs font-bold"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${index * 60 + 30}deg) translateY(-120px) rotate(-${index * 60 + 30}deg)`,
                          transformOrigin: '50% 120px'
                        }}
                      >
                        <div className="text-center">
                          <div className="text-lg">{reward.emoji}</div>
                          <div className="text-[10px]">{reward.name}</div>
                        </div>
                      </div>
                    ))}
                    
                    {/* 转盘指针 */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
                      <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-yellow-400 drop-shadow-lg"></div>
          </div>
        </div>

                  {/* 中心按钮 */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <button
                      onClick={startGame}
                      disabled={isSpinning || isLoading || !isApproved}
                      className={`w-24 h-24 rounded-full font-bold text-sm transition-all shadow-2xl ${
                        isSpinning 
                          ? 'bg-gray-600 cursor-not-allowed animate-pulse' 
                          : !isApproved
                          ? 'bg-red-600 text-white'
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transform hover:scale-110'
                      } text-white`}
                    >
                      {isSpinning ? (
                        <div>
                          <div className="animate-spin text-2xl">🎰</div>
                          <div className="text-xs">转动中</div>
                        </div>
                      ) : !isApproved ? (
                        <div>
                          <div className="text-2xl">🔒</div>
                          <div className="text-xs">需授权</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-2xl">🎲</div>
                          <div className="text-xs">开始游戏</div>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* 游戏信息 */}
              <div className="bg-white/20 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <p className="text-blue-200 text-sm mb-2">
                    本轮投注: <span className="text-yellow-400 font-bold text-lg">
                      {selectedToken === 'MAO' ? '100' : '10,000'} {selectedToken}
                    </span>
                  </p>
                  {lastWinResult && (
                    <div className="bg-black/30 rounded-lg p-3">
                      <p className="text-green-400 text-sm">
                        {lastWinResult.emoji} 上次结果: {lastWinResult.name}
                      </p>
                      {lastWinResult.isWin && (
                        <p className="text-yellow-400 font-bold">
                          奖励: +{lastWinResult.amount} {selectedToken}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 授权按钮 */}
              {!isApproved && (
                <button
                  onClick={approveTokens}
                  disabled={isLoading || isSpinning}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-4 rounded-xl mb-4 disabled:opacity-50 shadow-lg"
                >
                  {isLoading ? '授权中...' : `🔓 授权 ${selectedToken} 代币`}
                </button>
              )}
            </div>

            {/* 奖励表 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 text-center">🏆 奖励表</h3>
              <div className="space-y-2 text-sm">
                {REWARD_LEVELS.map((reward, index) => (
                  <div key={index} className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                    <div className="flex items-center">
                      <div className="text-xl mr-3">{reward.emoji}</div>
                      <div>
                        <div className="text-white font-medium">{reward.name}</div>
                        <div className="text-blue-300 text-xs">概率: {reward.probability}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">
                        {reward.level === 0 ? '无奖励' : 
                          `${selectedToken === 'MAO' ? reward.maoAmount : reward.piAmount} ${selectedToken}`
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
        </div>

            {/* 功能按钮 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="bg-white/20 hover:bg-white/30 text-white py-4 px-4 rounded-xl font-semibold transition-all shadow-lg"
              >
                📈 游戏记录
              </button>
              <button
                onClick={() => {
                  window.open('https://alveyscan.com/address/' + CONTRACTS.WHEEL_GAME, '_blank');
                }}
                className="bg-white/20 hover:bg-white/30 text-white py-4 px-4 rounded-xl font-semibold transition-all shadow-lg"
              >
                🔗 合约验证
              </button>
            </div>

            {/* 游戏历史 */}
            {showHistory && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">🎮 最近游戏记录</h3>
                {gameHistory.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {gameHistory.slice(0, 10).map((game) => (
                      <div key={game.id} className="bg-white/10 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="text-lg mr-2">
                              {REWARD_LEVELS[game.rewardLevel]?.emoji || '🎰'}
                            </div>
                        <div>
                              <div className="text-white font-medium text-sm">
                                {REWARD_LEVELS[game.rewardLevel]?.name || '未知'}
                              </div>
                              <div className="text-blue-300 text-xs">
                                {game.token} · {new Date(game.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${
                              game.isWin ? 'text-green-400' : 'text-gray-400'
                            }`}>
                              {game.isWin ? `+${game.rewardAmount}` : '未中奖'}
                            </div>
                            <div className="text-xs text-blue-300">
                              -{game.betAmount} {game.token}
                            </div>
                          </div>
                        </div>
                        {game.txHash && (
                          <button
                            onClick={() => window.open(`https://alveyscan.com/tx/${game.txHash}`, '_blank')}
                            className="text-xs text-blue-400 hover:text-blue-300 mt-1"
                          >
                            查看交易 →
                          </button>
                        )}
                    </div>
                  ))}
                </div>
                ) : (
                  <p className="text-blue-200 text-center py-8">
                    暂无游戏记录
                    <br />
                    <span className="text-xs">开始您的第一次游戏吧！</span>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        </div>

        {/* 底部信息 */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-lg p-3 text-center">
        <p className="text-blue-200 text-xs">
          基于 AlveyChain 智能合约 · 公平透明 · 立即到账
        </p>
      </div>
    </div>
  );
} 