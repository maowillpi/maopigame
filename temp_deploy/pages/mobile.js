import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ethers } from 'ethers';
import MobileWheelGame from '../components/MobileWheelGame';
import MobileMultiWalletConnection from '../components/MobileMultiWalletConnection';

export default function MobileGame() {
  const router = useRouter();
  const [gameToken, setGameToken] = useState('MAO');
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contracts, setContracts] = useState({});
  const [balances, setBalances] = useState({ MAO: 0, PI: 0 });
  const [gameHistory, setGameHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 网络配置
  const ALVEY_CHAIN_ID = '3797';
  const ALVEY_RPC_URL = 'https://elves-core1.alvey.io';
  
  // 合约地址
  const CONTRACTS = {
    WHEEL_GAME: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x1234567890abcdef1234567890abcdef12345678',
    MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
    PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444"
  };

  // 合约ABI
  const WHEEL_GAME_ABI = [
    "function playMAOGame() external returns (uint256)",
    "function playPIGame() external returns (uint256)",
    "function getPlayerHistory(address player) external view returns (tuple(address player, uint8 tokenType, uint256 betAmount, uint256 rewardAmount, uint8 rewardLevel, uint256 timestamp, uint256 randomSeed)[])",
    "function getRewardLevelName(uint8 level) external pure returns (string)",
    "event GamePlayed(address indexed player, uint8 tokenType, uint256 betAmount, uint256 rewardAmount, uint8 rewardLevel, uint256 randomSeed)"
  ];

  const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
  ];

  // 获取URL参数
  useEffect(() => {
    if (router.isReady) {
      const { token } = router.query;
      if (token && ['MAO', 'PI'].includes(token.toUpperCase())) {
        setGameToken(token.toUpperCase());
      }
    }
  }, [router.isReady, router.query]);

  // 处理钱包连接
  const handleWalletConnect = async (walletData) => {
    try {
      setIsLoading(true);
      
      const { account, provider, signer } = walletData;
      
      setAccount(account);
      setProvider(provider);
      setSigner(signer);
      
      // 初始化合约
      await initializeContracts(signer);
      
      // 加载余额
      await loadBalances(account, signer);
      
      // 加载游戏历史
      await loadGameHistory(account, signer);
      
    } catch (error) {
      console.error('钱包连接处理错误:', error);
      alert('连接处理失败: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理钱包断开连接
  const handleWalletDisconnect = () => {
    setAccount('');
    setProvider(null);
    setSigner(null);
    setContracts({});
    setBalances({ MAO: 0, PI: 0 });
    setGameHistory([]);
  };

  // 初始化合约
  const initializeContracts = async (userSigner) => {
    try {
      const wheelGameContract = new ethers.Contract(
        CONTRACTS.WHEEL_GAME,
        WHEEL_GAME_ABI,
        userSigner
      );
      
      const maoTokenContract = new ethers.Contract(
        CONTRACTS.MAO_TOKEN,
        ERC20_ABI,
        userSigner
      );
      
      const piTokenContract = new ethers.Contract(
        CONTRACTS.PI_TOKEN,
        ERC20_ABI,
        userSigner
      );

      const contractsObj = {
        wheelGame: wheelGameContract,
        maoToken: maoTokenContract,
        piToken: piTokenContract
      };

      setContracts(contractsObj);
      return contractsObj;
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
      // 使用模拟数据
      setBalances({
        MAO: 1000,
        PI: 50000
      });
    }
  };

  // 加载游戏历史
  const loadGameHistory = async (userAccount, userSigner) => {
    try {
      const contractsToUse = contracts.wheelGame ? contracts : await initializeContracts(userSigner);
      
      const history = await contractsToUse.wheelGame.getPlayerHistory(userAccount);
      
      const formattedHistory = history.map((record, index) => ({
        id: index,
        player: record.player,
        tokenType: record.tokenType,
        betAmount: ethers.formatEther(record.betAmount),
        rewardAmount: ethers.formatEther(record.rewardAmount),
        rewardLevel: record.rewardLevel,
        timestamp: new Date(Number(record.timestamp) * 1000).toLocaleString(),
        randomSeed: record.randomSeed.toString()
      }));
      
      setGameHistory(formattedHistory);
    } catch (error) {
      console.error('加载游戏历史错误:', error);
      setGameHistory([]);
    }
  };

  // 更新余额
  const updateBalances = async () => {
    if (!account || !signer) return;
    await loadBalances(account, signer);
  };

  // 处理游戏结果
  const handleGameResult = (result) => {
    const gameRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      token: gameToken,
      level: result.level,
      amount: result.amount,
      isWin: result.isWin,
      txHash: result.txHash || ''
    };
    
    setGameHistory(prev => [gameRecord, ...prev]);
    updateBalances();
  };

  // 切换代币
  const switchToken = (token) => {
    setGameToken(token);
    router.push(`/mobile?token=${token}`, undefined, { shallow: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Head>
        <title>MAO转盘游戏 - 移动端</title>
        <meta name="description" content="MAO转盘游戏移动端 - 支持多钱包连接" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto px-4 py-6">
        {/* 头部 */}
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            🎰 MAO转盘游戏
          </h1>
          <p className="text-blue-200 text-sm">
            移动端游戏 • AlveyChain • 多钱包支持
          </p>
        </header>

        {/* 代币选择 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-6">
          <h3 className="text-white font-bold mb-3 text-center">选择代币</h3>
          <div className="flex justify-center">
            <div className="bg-white/20 rounded-lg p-1 flex w-full max-w-xs">
              {['MAO', 'PI'].map((token) => (
                <button
                  key={token}
                  onClick={() => switchToken(token)}
                  className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                    gameToken === token
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-200 hover:text-white'
                  }`}
                >
                  {token}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 多钱包连接 */}
        <div className="mb-6">
          <MobileMultiWalletConnection
            account={account}
            balances={balances}
            onConnect={handleWalletConnect}
            onDisconnect={handleWalletDisconnect}
          />
        </div>

        {/* 游戏区域 */}
        {account && (
          <div className="space-y-6">
            {/* 转盘游戏 */}
            <MobileWheelGame
              selectedToken={gameToken}
              account={account}
              balances={balances}
              contract={contracts.wheelGame}
              onUpdateBalances={updateBalances}
              onGameResult={handleGameResult}
            />

            {/* 游戏历史 */}
            {gameHistory.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                <h3 className="text-white font-bold mb-4 text-center">游戏历史</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {gameHistory.slice(0, 5).map((record) => (
                    <div key={record.id} className="bg-white/5 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-white text-sm font-semibold">
                            {record.token} 游戏
                          </span>
                          <div className="text-blue-200 text-xs">
                            {record.timestamp}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold text-sm ${
                            record.isWin ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {record.isWin ? '+' : ''}{record.amount}
                          </div>
                          <div className="text-blue-200 text-xs">
                            等级 {record.level}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 使用提示 */}
        <div className="mt-6 bg-blue-500/20 border border-blue-500 rounded-xl p-4">
          <h4 className="text-blue-400 font-semibold mb-2">📱 使用提示</h4>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• 支持 TP钱包、Trust Wallet、MetaMask等多种钱包</li>
            <li>• 扫描二维码即可快速连接钱包</li>
            <li>• 确保钱包已切换到AlveyChain网络</li>
            <li>• 游戏结果将自动同步到您的钱包</li>
          </ul>
        </div>

        {/* 底部信息 */}
        <footer className="mt-8 text-center text-blue-200 text-sm">
          <p>© 2024 MAO转盘游戏 • AlveyChain</p>
          <p className="mt-1">安全 • 公平 • 透明</p>
        </footer>
      </div>
    </div>
  );
} 