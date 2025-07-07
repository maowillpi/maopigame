const { ethers } = require("hardhat");

async function main() {
  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  
  console.log("使用账户部署合约:", deployer.address);

  // 代币合约地址
  const MAO_TOKEN = "0x22f49bcb3dad370a9268ba3fca33cb037ca3d022";
  const PI_TOKEN = "0xfd4680e25e05b3435c7f698668d1ce80d2a9f444";
  
  // 钱包地址配置
  const MARKETING_WALLET = "0x861A48051eFaA1876D4B38904516C9F7bbCca36d"; // 营销钱包（20%）
  const PRIZE_POOL = deployer.address; // 奖金池 = 部署者地址（70% + 发放奖励）
  const BURN_ADDRESS = "0x000000000000000000000000000000000000dEaD"; // 销毁地址（10%）

  console.log("🏦 钱包地址配置:");
  console.log("部署者地址:", deployer.address);
  console.log("奖金池地址:", PRIZE_POOL, "(与部署者相同)");
  console.log("营销钱包:", MARKETING_WALLET);
  console.log("销毁地址:", BURN_ADDRESS);

  // 部署合约
  const WheelGame = await ethers.getContractFactory("WheelGame");
  const wheelGame = await WheelGame.deploy(
    MAO_TOKEN,
    PI_TOKEN,
    MARKETING_WALLET,
    PRIZE_POOL
  );

  // 等待部署完成
  await wheelGame.waitForDeployment();

  console.log("\n🎯 部署完成!");
  console.log("转盘游戏合约部署到:", await wheelGame.getAddress());
  console.log("MAO代币地址:", MAO_TOKEN);
  console.log("PI代币地址:", PI_TOKEN);

  console.log("\n💰 资金分配:");
  console.log("投注金额 → 70%奖金池 + 10%销毁 + 20%营销");
  console.log("奖励发放 ← 从奖金池地址发放");

  // 保存合约地址到配置文件
  const fs = require("fs");
  const contractAddress = await wheelGame.getAddress();
  const deploymentInfo = {
    contractAddress: contractAddress,
    maoToken: MAO_TOKEN,
    piToken: PI_TOKEN,
    marketingWallet: MARKETING_WALLET,
    prizePool: PRIZE_POOL,
    burnAddress: BURN_ADDRESS,
    deployerAddress: deployer.address,
    network: "alvey",
    chainId: 3797,
    blockNumber: await ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString(),
    fundAllocation: {
      prizePool: "70%",
      burn: "10%", 
      marketing: "20%"
    }
  };

  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n📄 部署信息已保存到 deployment-info.json");
  
  console.log("\n⚠️ 重要提醒:");
  console.log("1. 向奖金池地址充值MAO和PI代币用于发放奖励");
  console.log("2. 奖金池需要授权合约代表发放奖励");
  console.log("3. 奖金池地址:", PRIZE_POOL);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 