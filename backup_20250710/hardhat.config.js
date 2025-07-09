require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// 从环境变量获取私钥
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// 验证私钥是否存在
if (!PRIVATE_KEY || PRIVATE_KEY === "请在此处输入您的64位私钥（不要0x前缀）") {
  console.warn("⚠️ 警告：请先在 .env 文件中配置您的私钥！");
  console.warn("📝 步骤：");
  console.warn("1. 复制 env-template.txt 为 .env");
  console.warn("2. 在 .env 文件中填入您的私钥");
  console.warn("3. 重新运行命令");
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    alvey: {
      url: process.env.ALVEY_RPC_URL_1 || "https://elves-core1.alvey.io/",
      chainId: parseInt(process.env.CHAIN_ID) || 3797,
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
    },
    alvey2: {
      url: process.env.ALVEY_RPC_URL_2 || "https://elves-core2.alvey.io/",
      chainId: parseInt(process.env.CHAIN_ID) || 3797,
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
    },
    alvey3: {
      url: process.env.ALVEY_RPC_URL_3 || "https://elves-core3.alvey.io/",
      chainId: parseInt(process.env.CHAIN_ID) || 3797,
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
    },
  },
  etherscan: {
    apiKey: {
      alvey: process.env.ALVEY_API_KEY || "YOUR_API_KEY",
    },
    customChains: [
      {
        network: "alvey",
        chainId: parseInt(process.env.CHAIN_ID) || 3797,
        urls: {
          apiURL: "https://alveyscan.com/api",
          browserURL: "https://alveyscan.com",
        },
      },
    ],
  },
}; 