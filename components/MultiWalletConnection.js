import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import QRCode from 'react-qr-code';
import { EthereumProvider } from '@walletconnect/ethereum-provider';

const MultiWalletConnection = ({ account, balances, onConnect, onDisconnect }) => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [walletConnectProvider, setWalletConnectProvider] = useState(null);
  const [wcUri, setWcUri] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  
  // 钱包配置
  const walletOptions = [
    {
      name: 'MetaMask',
      icon: '🦊',
      type: 'injected',
      description: '浏览器扩展钱包',
      id: 'metamask'
    },
    {
      name: 'TP钱包',
      icon: '🔵',
      type: 'walletconnect',
      description: '移动端钱包',
      id: 'tokenpocket'
    },
    {
      name: 'Trust Wallet',
      icon: '🛡️',
      type: 'walletconnect',
      description: '移动端钱包',
      id: 'trust'
    },
    {
      name: 'Coinbase Wallet',
      icon: '🔵',
      type: 'walletconnect',
      description: '移动端钱包',
      id: 'coinbase'
    },
    {
      name: 'Binance Chain Wallet',
      icon: '🟨',
      type: 'injected',
      description: '币安钱包',
      id: 'binance'
    },
    {
      name: 'OKX Wallet',
      icon: '⚫',
      type: 'injected',
      description: 'OKX钱包',
      id: 'okx'
    },
    {
      name: '其他钱包',
      icon: '📱',
      type: 'walletconnect',
      description: '通过WalletConnect连接',
      id: 'other'
    }
  ];

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

  // 检测钱包是否已安装
  const detectWallet = (walletId) => {
    switch (walletId) {
      case 'metamask':
        return window.ethereum && window.ethereum.isMetaMask;
      case 'binance':
        return window.BinanceChain;
      case 'okx':
        return window.okxwallet;
      default:
        return false;
    }
  };

  // 初始化WalletConnect
  const initializeWalletConnect = async () => {
    try {
      const provider = await EthereumProvider.init({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '2f5a2c1a2b3c3d4e5f6g7h8i9j0k1l2m', // 需要从WalletConnect Dashboard获取
        chains: [3797], // AlveyChain
        optionalChains: [3797],
        rpcMap: {
          3797: 'https://elves-core1.alvey.io'
        },
        metadata: {
          name: 'MAO转盘游戏',
          description: 'AlveyChain上的MAO转盘游戏',
          url: 'https://mao-game.alvey.io',
          icons: ['https://mao-game.alvey.io/icon.png']
        }
      });

      // 监听连接事件
      provider.on('display_uri', (uri) => {
        console.log('WalletConnect URI:', uri);
        setWcUri(uri);
      });

      provider.on('connect', (accounts) => {
        console.log('WalletConnect connected:', accounts);
        handleWalletConnected(provider, accounts[0]);
      });

      provider.on('disconnect', () => {
        console.log('WalletConnect disconnected');
        if (onDisconnect) onDisconnect();
      });

      setWalletConnectProvider(provider);
      return provider;
    } catch (error) {
      console.error('WalletConnect initialization error:', error);
      throw error;
    }
  };

  // 处理钱包连接成功
  const handleWalletConnected = async (provider, accountAddress) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      
      if (onConnect) {
        onConnect({
          account: accountAddress,
          provider: ethersProvider,
          signer: signer
        });
      }
      
      setIsConnecting(false);
      setShowWalletOptions(false);
      setSelectedWallet(null);
    } catch (error) {
      console.error('Handle wallet connection error:', error);
      setIsConnecting(false);
    }
  };

  // 连接注入式钱包 (MetaMask, Binance, OKX等)
  const connectInjectedWallet = async (walletId) => {
    let provider;
    
    switch (walletId) {
      case 'metamask':
        if (!window.ethereum?.isMetaMask) {
          alert('请安装MetaMask钱包!');
          return;
        }
        provider = window.ethereum;
        break;
      case 'binance':
        if (!window.BinanceChain) {
          alert('请安装Binance Chain Wallet!');
          return;
        }
        provider = window.BinanceChain;
        break;
      case 'okx':
        if (!window.okxwallet) {
          alert('请安装OKX Wallet!');
          return;
        }
        provider = window.okxwallet;
        break;
      default:
        provider = window.ethereum;
    }

    try {
      setIsConnecting(true);
      
      // 切换到AlveyChain网络
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ALVEY_NETWORK.chainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [ALVEY_NETWORK],
          });
        }
      }

      // 请求账户权限
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        
        handleWalletConnected(provider, accounts[0]);
      }
    } catch (error) {
      console.error('Connect injected wallet error:', error);
      alert('连接钱包失败: ' + error.message);
      setIsConnecting(false);
    }
  };

  // 连接WalletConnect钱包
  const connectWalletConnect = async () => {
    try {
      setIsConnecting(true);
      
      let provider = walletConnectProvider;
      if (!provider) {
        provider = await initializeWalletConnect();
      }

      await provider.connect();
    } catch (error) {
      console.error('Connect WalletConnect error:', error);
      alert('连接钱包失败: ' + error.message);
      setIsConnecting(false);
    }
  };

  // 处理钱包选择
  const handleWalletSelect = async (wallet) => {
    setSelectedWallet(wallet);
    
    if (wallet.type === 'injected') {
      await connectInjectedWallet(wallet.id);
    } else if (wallet.type === 'walletconnect') {
      await connectWalletConnect();
    }
  };

  // 断开钱包连接
  const disconnectWallet = async () => {
    if (walletConnectProvider) {
      await walletConnectProvider.disconnect();
    }
    if (onDisconnect) onDisconnect();
  };

  // 格式化地址
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 格式化余额
  const formatBalance = (balance) => {
    return parseFloat(balance || 0).toFixed(2);
  };

  // 生成特定钱包的深链接
  const generateWalletDeepLink = (walletId, uri) => {
    const encodedUri = encodeURIComponent(uri);
    
    switch (walletId) {
      case 'tokenpocket':
        return `tpoutside://wc?uri=${encodedUri}`;
      case 'trust':
        return `https://link.trustwallet.com/wc?uri=${encodedUri}`;
      case 'coinbase':
        return `https://go.cb-w.com/wc?uri=${encodedUri}`;
      default:
        return uri;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4">多钱包连接</h3>
      
      {!account ? (
        <div className="text-center">
          <div className="text-4xl mb-4">🔗</div>
          <p className="text-blue-200 mb-4">选择您的钱包</p>
          
          {!showWalletOptions ? (
            <button
              onClick={() => setShowWalletOptions(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              🔗 连接钱包
            </button>
          ) : (
            <div className="space-y-4">
              {/* 钱包选项 */}
              <div className="grid grid-cols-1 gap-3">
                {walletOptions.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletSelect(wallet)}
                    disabled={isConnecting}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                      selectedWallet?.id === wallet.id
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10'
                    } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{wallet.icon}</span>
                      <div className="text-left">
                        <div className="text-white font-semibold">{wallet.name}</div>
                        <div className="text-blue-200 text-sm">{wallet.description}</div>
                      </div>
                    </div>
                    {wallet.type === 'injected' && !detectWallet(wallet.id) && (
                      <span className="text-orange-400 text-xs">未安装</span>
                    )}
                  </button>
                ))}
              </div>

              {/* WalletConnect二维码 */}
              {selectedWallet?.type === 'walletconnect' && wcUri && (
                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-semibold mb-3 text-center">
                    扫描二维码连接钱包
                  </h4>
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-4 rounded-lg">
                      <QRCode value={wcUri} size={200} />
                    </div>
                  </div>
                  
                  {/* 钱包快捷链接 */}
                  <div className="space-y-2">
                    <div className="text-center text-blue-200 text-sm mb-2">
                      或点击快捷连接:
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['tokenpocket', 'trust', 'coinbase'].map((walletId) => (
                        <a
                          key={walletId}
                          href={generateWalletDeepLink(walletId, wcUri)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {walletId === 'tokenpocket' ? 'TP钱包' : 
                           walletId === 'trust' ? 'Trust' : 
                           walletId === 'coinbase' ? 'Coinbase' : walletId}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 返回按钮 */}
              <button
                onClick={() => {
                  setShowWalletOptions(false);
                  setSelectedWallet(null);
                  setWcUri('');
                }}
                className="w-full py-2 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                返回
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-green-400 font-semibold">钱包已连接</p>
            <p className="text-blue-200 text-sm mt-1">
              {formatAddress(account)}
            </p>
          </div>
          
          <div className="border-t border-white/20 pt-4">
            <h4 className="text-white font-semibold mb-3">代币余额</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                    M
                  </div>
                  <span className="text-white">MAO</span>
                </div>
                <span className="text-yellow-400 font-bold">
                  {formatBalance(balances.MAO)}
                </span>
              </div>
              
              <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                    π
                  </div>
                  <span className="text-white">PI</span>
                </div>
                <span className="text-yellow-400 font-bold">
                  {formatBalance(balances.PI)}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={disconnectWallet}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            断开连接
          </button>
          
          <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-3">
            <div className="flex items-center">
              <div className="text-blue-400 mr-2">ℹ️</div>
              <p className="text-blue-200 text-sm">
                确保您在 AlveyChain 网络上
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiWalletConnection; 