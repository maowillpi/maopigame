const { ethers } = require("hardhat");

async function main() {
    console.log("🏦 更新 WheelGameV2 营销钱包地址...");
    
    // 合约地址
    const WHEEL_GAME_V2 = "0xB677DBcA76061E6301272c83179c8243A4eeB6A5";
    const NEW_MARKETING_WALLET = "0x861A48051eFaA1876D4B38904516C9F7bbCca36d";
    
    // 获取部署者账户
    const [deployer] = await ethers.getSigners();
    console.log("部署者地址:", deployer.address);
    console.log("新营销钱包:", NEW_MARKETING_WALLET);
    
    // 连接到已部署的合约
    const WheelGameV2 = await ethers.getContractFactory("WheelGameV2");
    const wheelGameV2 = WheelGameV2.attach(WHEEL_GAME_V2);
    
    console.log("📊 获取当前营销钱包地址...");
    const currentMarketingWallet = await wheelGameV2.marketingWallet();
    console.log("当前营销钱包:", currentMarketingWallet);
    
    // 检查是否需要更新
    if (currentMarketingWallet.toLowerCase() === NEW_MARKETING_WALLET.toLowerCase()) {
        console.log("✅ 营销钱包地址已经是最新的，无需更新");
        return;
    }
    
    console.log("🔄 正在更新营销钱包地址...");
    
    try {
        // 调用更新函数
        const tx = await wheelGameV2.updateMarketingWallet(NEW_MARKETING_WALLET);
        console.log("📝 交易哈希:", tx.hash);
        
        // 等待交易确认
        console.log("⏳ 等待交易确认...");
        const receipt = await tx.wait();
        console.log("✅ 交易已确认，区块:", receipt.blockNumber);
        
        // 验证更新结果
        const updatedMarketingWallet = await wheelGameV2.marketingWallet();
        console.log("✅ 营销钱包地址更新成功！");
        console.log("旧地址:", currentMarketingWallet);
        console.log("新地址:", updatedMarketingWallet);
        
        // 显示交易链接
        console.log("\n🔗 查看交易详情:");
        console.log(`https://alveyscan.com/tx/${tx.hash}`);
        
        console.log("\n🎉 营销钱包地址更新完成！");
        console.log("现在所有营销费用将发送到新的钱包地址。");
        
    } catch (error) {
        console.error("❌ 更新失败:", error);
        
        if (error.message.includes("Ownable: caller is not the owner")) {
            console.log("\n⚠️ 权限错误: 只有合约所有者可以更新营销钱包地址");
            console.log("请确保使用部署合约的钱包账户执行此操作");
        }
        
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("脚本执行失败:", error);
        process.exit(1);
    }); 