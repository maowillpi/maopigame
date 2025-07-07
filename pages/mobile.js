import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WheelGame from '../components/WheelGame';

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

  // 奖励表
  const rewards = [
    { name: '谢谢惠顾', probability: '85%', maoReward: 0, piReward: 0, color: '#6B7280' },
    { name: '小奖', probability: '8%', maoReward: 150, piReward: 15000, color: '#F59E0B' },
    { name: '中奖', probability: '4%', maoReward: 400, piReward: 40000, color: '#EF4444' },
    { name: '大奖', probability: '2%', maoReward: 800, piReward: 80000, color: '#8B5CF6' },
    { name: '超级大奖', probability: '0.8%', maoReward: 1500, piReward: 150000, color: '#10B981' },
    { name: '终极大奖', probability: '0.2%', maoReward: 3000, piReward: 300000, color: '#F97316' },
  ];

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
      alert('请使用支持Web3的钱包浏览器！');
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

  // 游戏结果处理
  const handleGameResult = (result) => {
    const newGame = {
      id: Date.now(),
      token: selectedToken,
      betAmount: selectedToken === 'MAO' ? '100' : '10000',
      rewardAmount: result.amount.toString(),
      isWin: result.isWin,
      timestamp: Date.now(),
      rewardLevel: result.rewardLevel
    };
    
    setGameHistory(prev => [newGame, ...prev]);
    
    // 刷新余额
    setTimeout(() => {
      loadBalances(account, signer);
    }, 2000);
  };

  // 自动连接钱包
  useEffect(() => {
    if (window.ethereum) {
      // 检查是否已连接
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            connectWallet();
          }
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pb-20">
      {/* 简化的头部 */}
      <header className="bg-black/30 backdrop-blur-lg">
        <div className="px-4 py-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">🎰 MAO转盘游戏</h1>
            <p className="text-sm text-blue-200">AlveyChain 区块链游戏</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        {!account ? (
          // 连接钱包界面
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6">
              <div className="text-6xl mb-4">🎰</div>
              <h2 className="text-2xl font-bold text-white mb-4">开始游戏</h2>
              <p className="text-blue-200 mb-6">连接钱包开始您的转盘之旅</p>
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
              >
                {isLoading ? '连接中...' : '🔗 连接钱包'}
              </button>
            </div>
            
            {/* 快速说明 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">💰 奖励一览</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white">
                  <span>🎁 小奖</span>
                  <span className="text-yellow-400">150 MAO / 15,000 PI</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>🏆 大奖</span>
                  <span className="text-yellow-400">800 MAO / 80,000 PI</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>💎 终极大奖</span>
                  <span className="text-yellow-400">3,000 MAO / 300,000 PI</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // 游戏界面
          <div className="space-y-6">
            {/* 余额显示 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-200 text-sm">我的余额</p>
                  <p className="text-white font-bold text-lg">
                    {Number(balances[selectedToken]).toFixed(2)} {selectedToken}
                  </p>
                </div>
                <button
                  onClick={() => loadBalances(account, signer)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  🔄
                </button>
              </div>
            </div>

            {/* 代币选择 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 text-center">选择代币</h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedToken('MAO')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    selectedToken === 'MAO'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white/20 text-blue-200 hover:bg-white/30'
                  }`}
                >
                  MAO
                  <div className="text-xs mt-1">100 MAO/次</div>
                </button>
                <button
                  onClick={() => setSelectedToken('PI')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    selectedToken === 'PI'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white/20 text-blue-200 hover:bg-white/30'
                  }`}
                >
                  PI
                  <div className="text-xs mt-1">10,000 PI/次</div>
                </button>
              </div>
            </div>

            {/* 转盘游戏 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <WheelGame
                selectedToken={selectedToken}
                account={account}
                contracts={contracts}
                balances={balances}
                onGameResult={handleGameResult}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>

            {/* 快速操作按钮 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-lg font-semibold transition-all"
              >
                📈 游戏记录
              </button>
              <button
                onClick={() => {
                  window.open('https://alveyscan.com/address/' + CONTRACTS.WHEEL_GAME, '_blank');
                }}
                className="bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-lg font-semibold transition-all"
              >
                🔗 合约信息
              </button>
            </div>

            {/* 游戏历史 */}
            {showHistory && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">🎮 最近游戏</h3>
                {gameHistory.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {gameHistory.slice(0, 5).map((game) => (
                      <div key={game.id} className="bg-white/10 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-white font-medium">{game.token}</span>
                            <span className="text-blue-200 text-sm ml-2">
                              {game.isWin ? `+${game.rewardAmount}` : '未中奖'}
                            </span>
                          </div>
                          <div className="text-xs text-blue-300">
                            {new Date(game.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-blue-200 text-center py-4">暂无游戏记录</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 