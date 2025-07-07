import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const QRGameComponent = ({ gameType, onGameResult }) => {
  const [qrCode, setQrCode] = useState('');
  const [gameUrl, setGameUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // 生成移动端游戏链接
  const generateMobileGameUrl = () => {
    const baseUrl = window.location.origin;
    const mobileUrl = `${baseUrl}/mobile?token=${gameType}`;
    return mobileUrl;
  };

  // 生成QR码
  const generateQRCode = async () => {
    try {
      setIsGenerating(true);
      const mobileUrl = generateMobileGameUrl();
      setGameUrl(mobileUrl);
      
      const qrDataUrl = await QRCode.toDataURL(mobileUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      
      setQrCode(qrDataUrl);
    } catch (error) {
      console.error('生成二维码失败:', error);
      alert('生成二维码失败');
    } finally {
      setIsGenerating(false);
    }
  };

  // 重置
  const resetGame = () => {
    setQrCode('');
    setGameUrl('');
  };

  // 复制链接
  const copyUrl = () => {
    if (gameUrl) {
      navigator.clipboard.writeText(gameUrl).then(() => {
        alert('链接已复制到剪贴板！');
      }).catch(() => {
        alert('复制失败，请手动复制链接');
      });
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 max-w-md mx-auto">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          📱 手机游戏
        </h3>
        
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4">
          <p className="font-semibold">{gameType} 游戏</p>
          <p className="text-sm opacity-90">
            投注: {gameType === 'MAO' ? '100 MAO' : '10,000 PI'}
          </p>
        </div>

        {!qrCode ? (
          <div className="space-y-4">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-4xl mb-3">🎰</div>
              <p className="text-blue-200 text-sm mb-2">
                📝 使用说明
              </p>
              <ul className="text-xs text-blue-100 space-y-1 text-left">
                <li>• 点击"生成二维码"按钮</li>
                <li>• 用手机扫描二维码</li>
                <li>• 在手机上连接钱包</li>
                <li>• 开始游戏！</li>
              </ul>
            </div>
            
            <button
              onClick={generateQRCode}
              disabled={isGenerating}
              className={`w-full py-3 px-6 rounded-lg font-bold transition-all transform ${
                isGenerating
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105 shadow-lg'
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  生成中...
                </div>
              ) : (
                '🎯 生成游戏二维码'
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 qr-container">
              <img 
                src={qrCode} 
                alt="游戏二维码" 
                className="w-full max-w-xs mx-auto qr-code"
              />
            </div>
            
            <div className="bg-white/20 rounded-lg p-4">
              <p className="text-blue-200 text-sm mb-2">
                📱 扫码说明
              </p>
              <div className="text-xs text-blue-100 space-y-1">
                <p>• 使用手机相机或微信扫一扫</p>
                <p>• 自动跳转到移动端游戏</p>
                <p>• 连接钱包开始游戏</p>
              </div>
            </div>

            <div className="bg-white/20 rounded-lg p-4">
              <p className="text-blue-200 text-sm mb-2">🔗 游戏链接</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={gameUrl}
                  readOnly
                  className="flex-1 bg-black/20 text-white text-xs p-2 rounded border border-white/20 font-mono"
                />
                <button
                  onClick={copyUrl}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs font-bold transition-colors"
                >
                  复制
                </button>
              </div>
            </div>
            
            <div className="bg-white/20 rounded-lg p-4">
              <p className="text-blue-200 text-sm mb-2">
                🎮 支持的钱包
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'MetaMask', icon: '🦊' },
                  { name: 'Trust Wallet', icon: '🛡️' },
                  { name: 'Coinbase Wallet', icon: '💰' },
                  { name: 'WalletConnect', icon: '🔗' }
                ].map(wallet => (
                  <div key={wallet.name} className="bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center">
                    <span className="mr-1">{wallet.icon}</span>
                    {wallet.name}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={resetGame}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                🔄 重新生成
              </button>
              <button
                onClick={() => window.open(gameUrl, '_blank')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                🚀 直接访问
              </button>
            </div>
          </div>
        )}

        {/* 游戏特色 */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 mt-4">
          <h4 className="text-white font-bold text-sm mb-2">🌟 游戏特色</h4>
          <div className="text-xs text-yellow-200 space-y-1">
            <p>• 🎯 6个区域平均分配，视觉美观</p>
            <p>• 🏆 丰富奖励等级，从150到{gameType === 'MAO' ? '3000' : '300000'}</p>
            <p>• 📱 移动端优化，流畅游戏体验</p>
            <p>• 🔗 区块链技术，透明公平</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGameComponent; 