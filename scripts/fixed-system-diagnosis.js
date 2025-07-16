// 🔧 修复版系统诊断 - 解决ethers版本兼容性问题
const { ethers } = require("hardhat");

async function fixedSystemDiagnosis() {
    console.log("🔧 修复版系统诊断开始...\n");
    
    // 关键发现：游戏合约地址不一致！
    const CONTRACTS = {
        // 正确的配置
        MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
        PI_TOKEN: "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444", 
        MARKETING_WALLET: "0x861A48051eFaA1876D4B38904516C9F7bbCca36d",
        PRIZE_POOL: "0xE15881Fc413c6cd47a512C24608F94Fa2896b374",
        
        // 问题：两个不同的游戏合约地址
        WHEEL_GAME_ENV: "0xc27e29BCe41db77815435a9415329424849Daeb6",    // .env文件中的
        WHEEL_GAME_HTML: "0x621DF9e0DE6b4e7EDC5Dc22Cd7c0F883c3F56966"   // index.html中的
    };

    try {
        const [signer] = await ethers.getSigners();
        console.log(`🔍 测试账户: ${signer.address}`);
        
        // 1. 检查网络
        const provider = signer.provider;
        const network = await provider.getNetwork();
        console.log(`🌐 当前网络: ChainID ${network.chainId} (期望: 3797)`);
        
        // 2. 检查代币合约
        console.log("\n💰 代币合约检查:");
        console.log("=================");
        
        const tokenABI = [
            "function symbol() view returns (string)",
            "function balanceOf(address) view returns (uint256)",
            "function allowance(address,address) view returns (uint256)"
        ];
        
        try {
            const maoContract = new ethers.Contract(CONTRACTS.MAO_TOKEN, tokenABI, signer);
            const symbol = await maoContract.symbol();
            const balance = await maoContract.balanceOf(signer.address);
            console.log(`✅ MAO合约 (${symbol}): 余额 ${ethers.utils.formatEther(balance)}`);
        } catch (error) {
            console.log(`❌ MAO合约检查失败: ${error.message}`);
        }
        
        try {
            const piContract = new ethers.Contract(CONTRACTS.PI_TOKEN, tokenABI, signer);
            const symbol = await piContract.symbol();
            const balance = await piContract.balanceOf(signer.address);
            console.log(`✅ PI合约 (${symbol}): 余额 ${ethers.utils.formatEther(balance)}`);
        } catch (error) {
            console.log(`❌ PI合约检查失败: ${error.message}`);
        }

        // 3. 检查两个游戏合约
        console.log("\n🎮 游戏合约对比:");
        console.log("=================");
        
        const gameABI = [
            "function playMAOGame() external",
            "function playPIGame() external"
        ];
        
        // 检查.env中的游戏合约
        try {
            const code1 = await provider.getCode(CONTRACTS.WHEEL_GAME_ENV);
            console.log(`📋 .env游戏合约 ${CONTRACTS.WHEEL_GAME_ENV}:`);
            console.log(`   存在: ${code1.length > 2 ? '是' : '否'} (代码长度: ${code1.length})`);
            
            if (code1.length > 2) {
                try {
                    const envGameContract = new ethers.Contract(CONTRACTS.WHEEL_GAME_ENV, gameABI, signer);
                    // 尝试估算gas来测试合约是否可用
                    const gasEstimate = await envGameContract.estimateGas.playMAOGame();
                    console.log(`   可调用: 是 (Gas估算: ${gasEstimate.toString()})`);
                } catch (gasError) {
                    console.log(`   可调用: 否 (${gasError.reason || gasError.message})`);
                }
            }
        } catch (error) {
            console.log(`❌ .env游戏合约检查失败: ${error.message}`);
        }
        
        // 检查index.html中的游戏合约
        try {
            const code2 = await provider.getCode(CONTRACTS.WHEEL_GAME_HTML);
            console.log(`📋 index.html游戏合约 ${CONTRACTS.WHEEL_GAME_HTML}:`);
            console.log(`   存在: ${code2.length > 2 ? '是' : '否'} (代码长度: ${code2.length})`);
            
            if (code2.length > 2) {
                try {
                    const htmlGameContract = new ethers.Contract(CONTRACTS.WHEEL_GAME_HTML, gameABI, signer);
                    const gasEstimate = await htmlGameContract.estimateGas.playMAOGame();
                    console.log(`   可调用: 是 (Gas估算: ${gasEstimate.toString()})`);
                } catch (gasError) {
                    console.log(`   可调用: 否 (${gasError.reason || gasError.message})`);
                }
            }
        } catch (error) {
            console.log(`❌ index.html游戏合约检查失败: ${error.message}`);
        }

        // 4. 检查关键钱包
        console.log("\n💼 关键钱包检查:");
        console.log("=================");
        
        const wallets = [
            { name: "营销钱包", address: CONTRACTS.MARKETING_WALLET },
            { name: "奖金池钱包", address: CONTRACTS.PRIZE_POOL }
        ];
        
        for (const wallet of wallets) {
            try {
                const alvBalance = await provider.getBalance(wallet.address);
                console.log(`${wallet.name} (${wallet.address.slice(0,10)}...):`);
                console.log(`   ALV余额: ${ethers.utils.formatEther(alvBalance)}`);
                
                // 检查MAO余额
                const maoContract = new ethers.Contract(CONTRACTS.MAO_TOKEN, tokenABI, signer);
                const maoBalance = await maoContract.balanceOf(wallet.address);
                console.log(`   MAO余额: ${ethers.utils.formatEther(maoBalance)}`);
                
            } catch (error) {
                console.log(`❌ ${wallet.name}检查失败: ${error.message}`);
            }
        }

        // 5. 检查销毁统计
        console.log("\n🔥 销毁统计:");
        console.log("=============");
        
        const burnAddresses = [
            "0x000000000000000000000000000000000000dEaD",
            "0x0000000000000000000000000000000000000000"
        ];
        
        for (const burnAddr of burnAddresses) {
            try {
                const maoContract = new ethers.Contract(CONTRACTS.MAO_TOKEN, tokenABI, signer);
                const burnedMAO = await maoContract.balanceOf(burnAddr);
                if (ethers.utils.formatEther(burnedMAO) !== "0.0") {
                    console.log(`🔥 地址 ${burnAddr.slice(0,10)}... 销毁MAO: ${ethers.utils.formatEther(burnedMAO)}`);
                }
            } catch (error) {
                console.log(`❌ 销毁地址 ${burnAddr.slice(0,10)}... 检查失败`);
            }
        }

        // 6. 游戏授权检查
        console.log("\n🔐 游戏授权检查:");
        console.log("=================");
        
        const maoContract = new ethers.Contract(CONTRACTS.MAO_TOKEN, tokenABI, signer);
        
        // 检查对两个游戏合约的授权
        try {
            const allowance1 = await maoContract.allowance(signer.address, CONTRACTS.WHEEL_GAME_ENV);
            console.log(`授权给.env游戏合约: ${ethers.utils.formatEther(allowance1)} MAO`);
            
            const allowance2 = await maoContract.allowance(signer.address, CONTRACTS.WHEEL_GAME_HTML);
            console.log(`授权给index.html游戏合约: ${ethers.utils.formatEther(allowance2)} MAO`);
        } catch (error) {
            console.log(`❌ 授权检查失败: ${error.message}`);
        }

        // 7. 奖金池授权检查
        try {
            const prizePoolAllowance1 = await maoContract.allowance(CONTRACTS.PRIZE_POOL, CONTRACTS.WHEEL_GAME_ENV);
            const prizePoolAllowance2 = await maoContract.allowance(CONTRACTS.PRIZE_POOL, CONTRACTS.WHEEL_GAME_HTML);
            
            console.log(`奖金池对.env游戏合约授权: ${ethers.utils.formatEther(prizePoolAllowance1)} MAO`);
            console.log(`奖金池对index.html游戏合约授权: ${ethers.utils.formatEther(prizePoolAllowance2)} MAO`);
        } catch (error) {
            console.log(`❌ 奖金池授权检查失败: ${error.message}`);
        }

        console.log("\n🎯 诊断结论:");
        console.log("=============");
        console.log("🚨 发现的主要问题:");
        console.log("1. 游戏合约地址不一致！");
        console.log(`   .env文件: ${CONTRACTS.WHEEL_GAME_ENV}`);
        console.log(`   index.html: ${CONTRACTS.WHEEL_GAME_HTML}`);
        console.log("2. 需要确定使用哪个游戏合约地址");
        console.log("3. 需要检查奖金池对正确游戏合约的授权");
        console.log("4. 需要检查用户对正确游戏合约的授权");
        
        console.log("\n💡 修复建议:");
        console.log("=============");
        console.log("1. 统一游戏合约地址到一个正确的版本");
        console.log("2. 更新所有配置文件使用同一个合约地址");
        console.log("3. 确保奖金池对游戏合约有足够授权");
        console.log("4. 确保奖金池有足够的MAO余额");
        
    } catch (error) {
        console.error("❌ 诊断过程出错:", error.message);
        console.error("完整错误:", error);
    }
}

fixedSystemDiagnosis()
    .then(() => console.log("\n✅ 修复版诊断完成！"))
    .catch(console.error); 