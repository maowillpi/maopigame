import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import QRCode from 'react-qr-code';
import { EthereumProvider } from '@walletconnect/ethereum-provider';

const MobileMultiWalletConnection = ({ account, balances, onConnect, onDisconnect }) => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [walletConnectProvider, setWalletConnectProvider] = useState(null);
  const [wcUri, setWcUri] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  
  // 移动端钱包配置
  const mobileWalletOptions = [
    {
      name: 'TP钱包',
      icon: '🔵',
      type: 'app',
      description: '最受欢迎的多链钱包',
      id: 'tokenpocket',
      downloadUrl: 'https://www.tokenpocket.pro/zh/download/app',
      deepLink: 'tpoutside://wc?uri='
    },
    {
      name: 'Trust Wallet',
      icon: '🛡️',
      type: 'app',
      description: '币安官方钱包',
      id: 'trust',
      downloadUrl: 'https://trustwallet.com/download',
      deepLink: 'https://link.trustwallet.com/wc?uri='
    },
    {
      name: 'Coinbase Wallet',
      icon: '🔵',
      type: 'app',
      description: 'Coinbase官方钱包',
      id: 'coinbase',
      downloadUrl: 'https://www.coinbase.com/wallet/downloads',
      deepLink: 'https://go.cb-w.com/wc?uri='
    },
    {
      name: 'MetaMask',
      icon: '🦊',
      type: 'app',
      description: '以太坊钱包',
      id: 'metamask',
      downloadUrl: 'https://metamask.io/download/',
      deepLink: 'https://metamask.app.link/wc?uri='
    },
    {
      name: 'imToken',
      icon: '💎',
      type: 'app',
      description: '专业数字资产钱包',
      id: 'imtoken',
      downloadUrl: 'https://token.im/download',
      deepLink: 'imtokenv2://wc?uri='
    },
    {
      name: 'Bitget Wallet',
      icon: '🟡',
      type: 'app',
      description: 'Web3多链钱包',
      id: 'bitget',
      downloadUrl: 'https://web3.bitget.com/wallet-download',
      deepLink: 'bitkeep://wc?uri='
    },
    {
      name: 'OKX Wallet',
      icon: '⚫',
      type: 'app',
      description: 'OKX官方钱包',
      id: 'okx',
      downloadUrl: 'https://www.okx.com/download',
      deepLink: 'okex://main/wc?uri='
    },
    {
      name: '其他钱包',
      icon: '📱',
      type: 'qr',
      description: '扫码连接任意钱包',
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

  // 初始化WalletConnect
  const initializeWalletConnect = async () => {
    try {
      const provider = await EthereumProvider.init({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'c4f79cc821d1f5821e3f6f001cfe0e45',
        chains: [3797], // AlveyChain
        optionalChains: [3797],
        rpcMap: {
          3797: [
            'https://elves-core1.alvey.io',
            'https://elves-core2.alvey.io',
            'https://elves-core3.alvey.io'
          ]
        },
        metadata: {
          name: 'MAO转盘游戏',
          description: 'AlveyChain上的MAO转盘游戏',
          url: window.location.origin,
          icons: [`${window.location.origin}/icon.png`]
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
      
      // 检查网络并自动切换
      const network = await ethersProvider.getNetwork();
      const chainId = Number(network.chainId);
      if (chainId !== 3797) {
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xED5' }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [ALVEY_NETWORK],
            });
          } else {
            throw new Error('网络切换失败，请手动切换到AlveyChain');
          }
        }
      }
      
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
      setShowQRCode(false);
    } catch (error) {
      console.error('Handle wallet connection error:', error);
      setIsConnecting(false);
      alert('钱包连接失败: ' + (error.message || '未知错误'));
    }
  };

  // 连接特定钱包
  const connectWallet = async (wallet) => {
    try {
      setIsConnecting(true);
      setSelectedWallet(wallet);
      
      let provider = walletConnectProvider;
      if (!provider) {
        console.log('初始化 WalletConnect...');
        provider = await initializeWalletConnect();
      }

      console.log('正在连接钱包...');
      await provider.connect();
      
      // 检查网络
      const chainId = await provider.request({ method: 'eth_chainId' });
      if (chainId !== ALVEY_NETWORK.chainId) {
        console.log('切换到 AlveyChain 网络...');
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ALVEY_NETWORK.chainId }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            console.log('添加 AlveyChain 网络...');
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [ALVEY_NETWORK],
            });
          } else {
            throw switchError;
          }
        }
      }
    } catch (error) {
      console.error('连接钱包错误:', error);
      let errorMessage = '连接失败';
      
      if (error.message.includes('User rejected')) {
        errorMessage = '用户取消了连接请求';
      } else if (error.message.includes('network')) {
        errorMessage = '网络连接错误，请检查网络后重试';
      } else if (error.message.includes('chain')) {
        errorMessage = '网络切换失败，请手动切换到 AlveyChain';
      }
      
      alert(errorMessage);
      setIsConnecting(false);
    }
  };

  // 处理钱包应用连接
  const handleWalletAppConnect = (wallet) => {
    connectWallet(wallet);
  };

  // 处理二维码连接
  const handleQRConnect = () => {
    setShowQRCode(true);
    connectWallet({ id: 'qr', type: 'qr' });
  };

  // 生成特定钱包的深链接
  const generateWalletDeepLink = (wallet, uri) => {
    if (!wallet.deepLink || !uri) return '#';
    return wallet.deepLink + encodeURIComponent(uri);
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

  // 复制链接到剪贴板
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('链接已复制到剪贴板');
    }).catch((err) => {
      console.error('复制失败:', err);
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">连接钱包</h3>
      
      {!account ? (
        <div className="text-center">
          <div className="text-4xl mb-4">📱</div>
          <p className="text-blue-200 mb-4 text-sm">选择您的手机钱包</p>
          
          {isConnecting && (
            <div className="mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-blue-200 text-sm">正在连接钱包，请在钱包中确认...</p>
            </div>
          )}
          
          {!showWalletOptions ? (
            <button
              onClick={() => setShowWalletOptions(true)}
              disabled={isConnecting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              {isConnecting ? '连接中...' : '🔗 连接钱包'}
            </button>
          ) : (
            <div className="space-y-3">
              {/* 钱包选项 */}
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {mobileWalletOptions.map((wallet) => (
                  <div key={wallet.id} className="border border-white/20 rounded-lg p-3 bg-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{wallet.icon}</span>
                        <div className="text-left">
                          <div className="text-white font-semibold text-sm">{wallet.name}</div>
                          <div className="text-blue-200 text-xs">{wallet.description}</div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        {wallet.type === 'app' ? (
                          <>
                            <button
                              onClick={() => handleWalletAppConnect(wallet)}
                              disabled={isConnecting}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
                            >
                              连接
                            </button>
                            <a
                              href={wallet.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors text-center"
                            >
                              下载
                            </a>
                          </>
                        ) : (
                          <button
                            onClick={handleQRConnect}
                            disabled={isConnecting}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
                          >
                            扫码
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* WalletConnect二维码 */}
              {(showQRCode || (selectedWallet && wcUri)) && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-semibold mb-3 text-center text-sm">
                    扫描二维码连接
                  </h4>
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-3 rounded-lg">
                      <QRCode 
                        value={wcUri} 
                        size={180}
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </div>
                  </div>
                  
                  {/* 快捷连接按钮 */}
                  <div className="space-y-2">
                    <div className="text-center text-blue-200 text-xs mb-2">
                      或点击快捷连接:
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {mobileWalletOptions.filter(w => w.type === 'app').slice(0, 4).map((wallet) => (
                        <a
                          key={wallet.id}
                          href={generateWalletDeepLink(wallet, wcUri)}
                          className="flex items-center justify-center px-2 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <span className="mr-1">{wallet.icon}</span>
                          {wallet.name}
                        </a>
                      ))}
                    </div>
                    
                    {/* 复制链接按钮 */}
                    <button
                      onClick={() => copyToClipboard(wcUri)}
                      className="w-full py-2 px-4 bg-gray-600 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      📋 复制连接
                    </button>
                  </div>
                </div>
              )}

              {/* 返回按钮 */}
              <button
                onClick={() => {
                  setShowWalletOptions(false);
                  setSelectedWallet(null);
                  setWcUri('');
                  setShowQRCode(false);
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
            <div className="text-3xl mb-2">✅</div>
            <p className="text-green-400 font-semibold">钱包已连接</p>
            <p className="text-blue-200 text-sm mt-1">
              {formatAddress(account)}
            </p>
          </div>
          
          <div className="border-t border-white/20 pt-4">
            <h4 className="text-white font-semibold mb-3 text-sm">代币余额</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-white/5 rounded-lg p-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
                    M
                  </div>
                  <span className="text-white text-sm">MAO</span>
                </div>
                <span className="text-yellow-400 font-bold text-sm">
                  {formatBalance(balances.MAO)}
                </span>
              </div>
              
              <div className="flex justify-between items-center bg-white/5 rounded-lg p-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
                    π
                  </div>
                  <span className="text-white text-sm">PI</span>
                </div>
                <span className="text-yellow-400 font-bold text-sm">
                  {formatBalance(balances.PI)}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={disconnectWallet}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
          >
            断开连接
          </button>
          
          <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-2">
            <div className="flex items-center">
              <div className="text-blue-400 mr-2">ℹ️</div>
              <p className="text-blue-200 text-xs">
                确保您在 AlveyChain 网络上
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMultiWalletConnection; 