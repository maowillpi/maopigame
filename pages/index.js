import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletConnection from '../components/WalletConnection';
import WheelGame from '../components/WheelGame';
import GameHistory from '../components/GameHistory';
import QRGameComponent from '../components/QRGameComponent';

// 智能合约ABI (简化版，实际使用时应该导入完整ABI)
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

// 合约地址 (部署后更新)
const CONTRACTS = {
  WHEEL_GAME: "0xc27e29BCe41db77815435a9415329424849Daeb6", // 已部署的合约地址
  MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
  PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444"
};

// AlveyChain 网络配置
const ALVEY_NETWORK = {
  chainId: '0xED5', // 3797
  chainName: 'AlveyChain Mainnet',
  nativeCurrency: {
    name: 'ALV',
    symbol: 'ALV',
    decimals: 18,
  },
  rpcUrls: ['https://elves-core1.alvey.io'],
  blockExplorerUrls: ['https://alveyscan.com'],
};

export default function Home() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contracts, setContracts] = useState({});
  const [balances, setBalances] = useState({ MAO: '0', PI: '0' });
  const [gameHistory, setGameHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [gameMode, setGameMode] = useState('web'); // 'web' or 'qr'
  const [selectedToken, setSelectedToken] = useState('MAO'); // 新增：代币选择状态

  // 检查是否在正确的网络
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

  // 切换到 AlveyChain 网络
  const switchToAlveyNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ALVEY_NETWORK.chainId }],
      });
    } catch (switchError) {
      // 如果网络不存在，添加网络
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
      alert('请安装 MetaMask!');
      return;
    }

    try {
      setIsLoading(true);
      
      // 检查并切换网络
      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
        await switchToAlveyNetwork();
      }

      // 请求账户权限
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        setAccount(accounts[0]);
        setProvider(provider);
        setSigner(signer);

        // 初始化合约
        await initializeContracts(signer);
        
        // 加载余额
        await loadBalances(accounts[0], signer);
        
        // 加载游戏历史
        await loadGameHistory(accounts[0], signer);
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
      const wheelGameContract = new ethers.Contract(
        CONTRACTS.WHEEL_GAME,
        WHEEL_GAME_ABI,
        signer
      );
      
      const maoTokenContract = new ethers.Contract(
        CONTRACTS.MAO_TOKEN,
        ERC20_ABI,
        signer
      );
      
      const piTokenContract = new ethers.Contract(
        CONTRACTS.PI_TOKEN,
        ERC20_ABI,
        signer
      );

      setContracts({
        wheelGame: wheelGameContract,
        maoToken: maoTokenContract,
        piToken: piTokenContract
      });

      return {
        wheelGame: wheelGameContract,
        maoToken: maoTokenContract,
        piToken: piTokenContract
      };
    } catch (error) {
      console.error('初始化合约错误:', error);
      throw error;
    }
  };

  // 加载代币余额
  const loadBalances = async (userAccount, userSigner) => {
    try {
      const contractsToUse = contracts.maoToken ? contracts : await initializeContracts(userSigner);
      
      const [maoBalance, piBalance] = await Promise.all([
        contractsToUse.maoToken.balanceOf(userAccount),
        contractsToUse.piToken.balanceOf(userAccount)
      ]);

      setBalances({
        MAO: ethers.utils.formatEther(maoBalance),
        PI: ethers.utils.formatEther(piBalance)
      });
    } catch (error) {
      console.error('加载余额错误:', error);
    }
  };

  // 加载游戏历史
  const loadGameHistory = async (userAccount, userSigner) => {
    try {
      const contractsToUse = contracts.wheelGame ? contracts : await initializeContracts(userSigner);
      
      const history = await contractsToUse.wheelGame.getPlayerHistory(userAccount);
      
      const formattedHistory = history.map((game, index) => ({
        id: index + 1,
        token: game.tokenType === 0 ? 'MAO' : 'PI',
        betAmount: ethers.utils.formatEther(game.betAmount),
        rewardAmount: ethers.utils.formatEther(game.rewardAmount),
        isWin: game.rewardLevel > 0,
        timestamp: game.timestamp.toNumber() * 1000,
        txHash: null // 实际应用中可以从事件日志获取
      }));

      setGameHistory(formattedHistory);
    } catch (error) {
      console.error('加载游戏历史错误:', error);
    }
  };

  // 更新余额
  const updateBalances = async () => {
    if (account && signer) {
      await loadBalances(account, signer);
    }
  };

  // 处理游戏结果
  const handleGameResult = (result) => {
    // 添加到游戏历史
    const newGame = {
      id: gameHistory.length + 1,
      token: result.token,
      betAmount: result.betAmount,
      rewardAmount: result.amount,
      isWin: result.isWin,
      timestamp: Date.now(),
      txHash: null
    };
    
    setGameHistory(prev => [newGame, ...prev]);
    
    // 保存到本地存储
    if (typeof window !== 'undefined' && account) {
      const updated = [newGame, ...gameHistory];
      localStorage.setItem(`gameHistory_${account}`, JSON.stringify(updated));
    }
  };

  // 处理二维码游戏完成
  const handleQRGameComplete = (result) => {
    // 添加到游戏历史
    const newGame = {
      id: gameHistory.length + 1,
      token: selectedToken,
      betAmount: selectedToken === 'MAO' ? '100' : '10000',
      rewardAmount: result.amount.toString(),
      isWin: result.isWin,
      timestamp: Date.now(),
      txHash: result.transactionHash
    };
    
    setGameHistory(prev => [newGame, ...prev]);
    
    // 保存到本地存储
    if (typeof window !== 'undefined' && account) {
      const updated = [newGame, ...gameHistory];
      localStorage.setItem(`gameHistory_${account}`, JSON.stringify(updated));
    }

    // 更新余额
    updateBalances();
    
    // 显示结果
    alert(`游戏完成！${result.isWin ? `恭喜获得 ${result.amount} ${selectedToken}！` : '谢谢惠顾！'}`);
  };

  // 授权代币
  const approveTokens = async () => {
    if (!contracts.maoToken || !contracts.piToken) return;

    try {
      setIsLoading(true);
      
      const maxAmount = ethers.constants.MaxUint256;
      
      // 检查现有授权
      const [maoAllowance, piAllowance] = await Promise.all([
        contracts.maoToken.allowance(account, CONTRACTS.WHEEL_GAME),
        contracts.piToken.allowance(account, CONTRACTS.WHEEL_GAME)
      ]);

      const transactions = [];

      // 如果授权不足，进行授权
      if (maoAllowance.lt(ethers.utils.parseEther('1000'))) {
        transactions.push(
          contracts.maoToken.approve(CONTRACTS.WHEEL_GAME, maxAmount)
        );
      }

      if (piAllowance.lt(ethers.utils.parseEther('100000'))) {
        transactions.push(
          contracts.piToken.approve(CONTRACTS.WHEEL_GAME, maxAmount)
        );
      }

      if (transactions.length > 0) {
        alert(`需要授权 ${transactions.length} 个代币，请在钱包中确认交易`);
        
        for (const tx of transactions) {
          const receipt = await tx;
          await receipt.wait();
        }
        
        alert('代币授权成功！');
      }
    } catch (error) {
      console.error('授权错误:', error);
      alert('授权失败: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 监听账户变化
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          setProvider(null);
          setSigner(null);
          setContracts({});
          setBalances({ MAO: '0', PI: '0' });
          setGameHistory([]);
        } else {
          connectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* 头部 */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-white">
                🎰 MAO转盘游戏
              </h1>
              <div className="ml-4 text-sm text-blue-200">
                AlveyChain 区块链游戏
              </div>
            </div>
            
            {account && (
              <div className="flex items-center space-x-4">
                {/* 游戏模式切换 */}
                <div className="bg-white/10 rounded-lg p-1 flex">
                  <button
                    onClick={() => setGameMode('web')}
                    className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                      gameMode === 'web'
                        ? 'bg-blue-600 text-white'
                        : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    🖥️ 网页游戏
                  </button>
                  <button
                    onClick={() => setGameMode('qr')}
                    className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                      gameMode === 'qr'
                        ? 'bg-purple-600 text-white'
                        : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    📱 扫码游戏
                  </button>
                </div>
                
                <button
                  onClick={approveTokens}
                  disabled={isLoading}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
                >
                  {isLoading ? '处理中...' : '授权代币'}
                </button>
                <button
                  onClick={updateBalances}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
                >
                  🔄 刷新余额
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {CONTRACTS.WHEEL_GAME === "0x0000000000000000000000000000000000000000" && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <div className="text-red-400 mr-2">⚠️</div>
              <div>
                <p className="text-red-200 font-semibold">合约未部署</p>
                <p className="text-red-200 text-sm">请先部署智能合约并更新合约地址</p>
              </div>
            </div>
          </div>
        )}

        {/* 游戏模式说明 */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-4xl mb-2">🖥️</div>
                <h3 className="text-white font-semibold">网页游戏</h3>
                <p className="text-blue-200 text-sm">在电脑上直接游戏</p>
              </div>
              <div className="text-white text-2xl">VS</div>
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <h3 className="text-white font-semibold">扫码游戏</h3>
                <p className="text-blue-200 text-sm">用手机钱包扫码游戏</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左列：钱包连接 */}
          <div className="lg:col-span-1 space-y-8">
            <WalletConnection
              account={account}
              balances={balances}
              onConnect={connectWallet}
            />
            
            {/* 代币选择（仅在二维码模式下显示） */}
            {gameMode === 'qr' && account && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">🎯 选择代币</h3>
                <div className="space-y-3">
                  {['MAO', 'PI'].map((token) => (
                    <button
                      key={token}
                      onClick={() => setSelectedToken(token)}
                      className={`w-full p-3 rounded-lg font-semibold transition-all ${
                        selectedToken === token
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/20 text-blue-200 hover:bg-white/30 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{token}</span>
                        <span className="text-sm">
                          {token === 'MAO' ? '100 MAO' : '10,000 PI'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* 游戏统计 */}
            {account && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">🏆 游戏统计</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-200">总游戏次数:</span>
                    <span className="text-white font-bold">{gameHistory.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">获胜次数:</span>
                    <span className="text-green-400 font-bold">
                      {gameHistory.filter(g => g.isWin).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">胜率:</span>
                    <span className="text-yellow-400 font-bold">
                      {gameHistory.length > 0 
                        ? `${((gameHistory.filter(g => g.isWin).length / gameHistory.length) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">游戏模式:</span>
                    <span className="text-purple-400 font-bold">
                      {gameMode === 'web' ? '🖥️ 网页' : '📱 扫码'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 中列：游戏区域 */}
          <div className="lg:col-span-1">
            {gameMode === 'web' ? (
              <WheelGame
                account={account}
                contract={contracts.wheelGame}
                balances={balances}
                onUpdateBalances={updateBalances}
                onGameResult={handleGameResult}
              />
            ) : (
              <QRGameComponent
                gameType={selectedToken}
                onGameResult={handleQRGameComplete}
              />
            )}
          </div>

          {/* 右列：游戏历史 */}
          <div className="lg:col-span-1">
            <GameHistory
              history={gameHistory}
              account={account}
            />
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-blue-200 text-sm">
              🎮 基于 AlveyChain 的去中心化转盘游戏
            </p>
            <p className="text-blue-300 text-xs mt-2">
              支持网页游戏和手机扫码游戏 • 请理性游戏，风险自担
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 