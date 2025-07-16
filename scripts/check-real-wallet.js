// 🔍 检查真实钱包地址的MAO余额和授权
const fetch = require('node-fetch');

async function checkRealWallet() {
    console.log("🔍 检查真实钱包的MAO余额和授权");
    console.log("=".repeat(50));
    
    const CONTRACTS = {
        MAO_TOKEN: "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022",
        WHEEL_GAME: "0x621DF9e0DE6b4e7EDC5Dc22Cd7c0F883c3F56966"
    };
    
    const RPC_URL = "https://elves-core1.alvey.io/";
    
    // 请在这里输入你的真实钱包地址
    const WALLET_ADDRESS = "请输入你的钱包地址"; // 替换为实际地址
    
    if (WALLET_ADDRESS === "请输入你的钱包地址") {
        console.log("❌ 请在脚本中输入你的真实钱包地址");
        return;
    }
    
    try {
        console.log(`🎯 检查钱包: ${WALLET_ADDRESS}`);
        
        // 检查MAO余额
        console.log("\n📝 检查MAO代币余额:");
        const balanceData = {
            jsonrpc: "2.0",
            method: "eth_call",
            params: [{
                to: CONTRACTS.MAO_TOKEN,
                data: "0x70a08231000000000000000000000000" + WALLET_ADDRESS.slice(2).toLowerCase()
            }, "latest"],
            id: 1
        };
        
        const balanceResponse = await fetch(RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(balanceData)
        });
        
        const balanceResult = await balanceResponse.json();
        const balanceHex = balanceResult.result;
        const balanceWei = BigInt(balanceHex);
        const balanceEther = Number(balanceWei) / 1e18;
        
        console.log(`  💰 MAO余额: ${balanceEther.toFixed(2)} MAO`);
        
        if (balanceEther < 100) {
            console.log(`  🚨 问题发现: MAO余额不足100个! (当前: ${balanceEther.toFixed(2)})`);
            console.log(`  💡 解决方案: 请先获取至少100个MAO代币才能进行游戏`);
        } else {
            console.log(`  ✅ MAO余额充足，可以进行游戏`);
        }
        
        // 检查授权
        console.log("\n📝 检查MAO代币授权:");
        
        // allowance(address owner, address spender) 的函数签名
        const allowanceData = {
            jsonrpc: "2.0",
            method: "eth_call",
            params: [{
                to: CONTRACTS.MAO_TOKEN,
                data: "0xdd62ed3e000000000000000000000000" + WALLET_ADDRESS.slice(2).toLowerCase() + 
                      "000000000000000000000000" + CONTRACTS.WHEEL_GAME.slice(2).toLowerCase()
            }, "latest"],
            id: 2
        };
        
        const allowanceResponse = await fetch(RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(allowanceData)
        });
        
        const allowanceResult = await allowanceResponse.json();
        const allowanceHex = allowanceResult.result;
        const allowanceWei = BigInt(allowanceHex);
        const allowanceEther = Number(allowanceWei) / 1e18;
        
        console.log(`  🔐 游戏合约授权: ${allowanceEther.toFixed(2)} MAO`);
        
        if (allowanceEther < 100) {
            console.log(`  🚨 问题发现: 授权不足100个MAO! (当前: ${allowanceEther.toFixed(2)})`);
            console.log(`  💡 解决方案: 需要先授权游戏合约可以使用你的MAO代币`);
            console.log(`  🔧 操作步骤:`);
            console.log(`     1. 在游戏中点击"真实区块链转盘"按钮`);
            console.log(`     2. 系统会自动检测并提示授权`);
            console.log(`     3. 在MetaMask中确认授权交易`);
            console.log(`     4. 等待授权交易确认后即可进行游戏`);
        } else {
            console.log(`  ✅ 授权充足，可以进行游戏`);
        }
        
        // 检查ALV余额
        console.log("\n📝 检查ALV余额 (用于Gas费用):");
        const alvBalanceData = {
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [WALLET_ADDRESS, "latest"],
            id: 3
        };
        
        const alvBalanceResponse = await fetch(RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alvBalanceData)
        });
        
        const alvBalanceResult = await alvBalanceResponse.json();
        const alvBalanceHex = alvBalanceResult.result;
        const alvBalanceWei = BigInt(alvBalanceHex);
        const alvBalanceEther = Number(alvBalanceWei) / 1e18;
        
        console.log(`  💳 ALV余额: ${alvBalanceEther.toFixed(4)} ALV`);
        
        if (alvBalanceEther < 0.001) {
            console.log(`  🚨 问题发现: ALV余额不足支付Gas费用!`);
            console.log(`  💡 解决方案: 请充值至少0.01 ALV用于支付交易费用`);
        } else {
            console.log(`  ✅ ALV余额充足，可以支付Gas费用`);
        }
        
        // 总结
        console.log("\n🎯 诊断总结");
        console.log("-".repeat(30));
        
        const issues = [];
        if (balanceEther < 100) issues.push("MAO余额不足");
        if (allowanceEther < 100) issues.push("MAO授权不足");
        if (alvBalanceEther < 0.001) issues.push("ALV余额不足");
        
        if (issues.length === 0) {
            console.log("✅ 所有条件都满足，游戏应该可以正常进行!");
            console.log("💡 如果仍然出现错误，可能是网络连接问题，请稍后重试。");
        } else {
            console.log("🚨 发现以下问题:");
            issues.forEach((issue, i) => {
                console.log(`  ${i + 1}. ${issue}`);
            });
            console.log("\n💡 请解决上述问题后再尝试游戏。");
        }
        
    } catch (error) {
        console.error("❌ 检查过程中出现错误:", error.message);
    }
}

// 使用说明
console.log("📖 使用说明:");
console.log("1. 请修改脚本中的 WALLET_ADDRESS 为你的真实钱包地址");
console.log("2. 然后运行: node scripts/check-real-wallet.js");
console.log("");

checkRealWallet(); 