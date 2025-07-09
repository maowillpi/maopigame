const WalletConnection = ({ account, balances, onConnect }) => {
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance) => {
    return parseFloat(balance).toFixed(2);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4">钱包连接</h3>
      
      {!account ? (
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-blue-200 mb-4">请连接您的钱包开始游戏</p>
          <button
            onClick={onConnect}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            🔗 连接钱包
          </button>
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

export default WalletConnection; 