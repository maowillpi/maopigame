// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WheelGameFixed
 * @dev 修正版转盘游戏合约 - 真正的50%中奖率
 * 
 * 🎯 修正内容:
 * - 概率配置修正为真正的50%中奖率
 * - 改进随机数生成机制
 * - 添加连败保护机制
 * - 增强透明度和可验证性
 */
contract WheelGameFixed is ReentrancyGuard, Ownable {
    IERC20 public maoToken;
    IERC20 public piToken;
    
    address public marketingWallet;
    address public prizePool;
    address public constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;
    
    // 游戏参数
    uint256 public constant MAO_BET_AMOUNT = 100 * 10**18; // 100 MAO
    uint256 public constant PI_BET_AMOUNT = 1000 * 10**18; // 1000 PI
    
    // 🎯 修正后的MAO奖励配置 - 50%中奖率
    uint256[6] public maoRewards = [
        0,            // 谢谢惠顾 50%
        105 * 10**18, // 小奖 105 MAO (22%)
        125 * 10**18, // 中奖 125 MAO (20%)
        200 * 10**18, // 大奖 200 MAO (7%)
        600 * 10**18, // 超级大奖 600 MAO (0.8%)
        1000 * 10**18 // 终极大奖 1000 MAO (0.2%)
    ];
    
    // 🎯 修正后的PI奖励配置 - 50%中奖率
    uint256[6] public piRewards = [
        0,               // 谢谢惠顾 50%
        1050 * 10**18,   // 小奖 1,050 PI (22%)
        1250 * 10**18,   // 中奖 1,250 PI (20%)
        2000 * 10**18,   // 大奖 2,000 PI (7%)
        6000 * 10**18,   // 超级大奖 6,000 PI (0.8%)
        10000 * 10**18   // 终极大奖 10,000 PI (0.2%)
    ];
    
    // 🎯 修正后的概率区间 - 真正的50%中奖率
    uint256[6] public probabilityRanges = [
        5000,  // 谢谢惠顾 50.0% (0-4999)
        7200,  // 小奖 22.0% (5000-7199)
        9200,  // 中奖 20.0% (7200-9199)
        9900,  // 大奖 7.0% (9200-9899)
        9980,  // 超级大奖 0.8% (9900-9979)
        10000  // 终极大奖 0.2% (9980-9999)
    ];
    
    // 💰 资金分配比例
    uint256 public constant PRIZE_POOL_PERCENT = 70;  // 70%到奖金池
    uint256 public constant BURN_PERCENT = 15;        // 15%销毁
    uint256 public constant MARKETING_PERCENT = 15;   // 15%营销
    
    // 🔒 连败保护机制
    mapping(address => uint256) public consecutiveLosses;
    uint256 public constant MAX_CONSECUTIVE_LOSSES = 5; // 连续5次失败后触发保护
    
    // 游戏记录
    struct GameResult {
        address player;
        uint8 tokenType; // 0=MAO, 1=PI
        uint256 betAmount;
        uint256 rewardAmount;
        uint8 rewardLevel;
        uint256 timestamp;
        uint256 randomSeed;
        bool wasProtected; // 是否触发了连败保护
    }
    
    mapping(address => GameResult[]) public playerHistory;
    GameResult[] public allGames;
    
    // 统计数据
    struct GameStats {
        uint256 totalGames;
        uint256 totalWins;
        uint256 totalBets;
        uint256 totalRewards;
        uint256 protectedGames; // 连败保护触发次数
    }
    
    mapping(uint8 => GameStats) public tokenStats; // 0=MAO, 1=PI
    
    // 事件
    event GamePlayed(
        address indexed player,
        uint8 tokenType,
        uint256 betAmount,
        uint256 rewardAmount,
        uint8 rewardLevel,
        uint256 randomSeed,
        bool wasProtected
    );
    
    event ConsecutiveLossProtectionTriggered(address indexed player, uint256 lossCount);
    event ProbabilityConfigUpdated(string reason);
    event TokensBurned(address indexed token, uint256 amount);
    
    constructor(
        address _maoToken,
        address _piToken,
        address _marketingWallet,
        address _prizePool
    ) {
        maoToken = IERC20(_maoToken);
        piToken = IERC20(_piToken);
        marketingWallet = _marketingWallet;
        prizePool = _prizePool;
        
        emit ProbabilityConfigUpdated("Contract deployed with fixed 50% win rate");
    }
    
    // 🔧 改进的随机数生成函数
    function generateRandomNumber(address player, uint256 nonce) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            player,
            nonce,
            blockhash(block.number - 1),
            gasleft(),          // 剩余gas增加随机性
            tx.gasprice,        // gas价格增加随机性
            block.coinbase      // 矿工地址增加随机性
        ))) % 10000;
    }
    
    // 根据随机数确定奖励等级（带连败保护）
    function getRewardLevel(uint256 randomNum, address player, bool applyProtection) private returns (uint8) {
        // 连败保护机制
        if (applyProtection && consecutiveLosses[player] >= MAX_CONSECUTIVE_LOSSES) {
            consecutiveLosses[player] = 0;
            emit ConsecutiveLossProtectionTriggered(player, MAX_CONSECUTIVE_LOSSES);
            return 1; // 强制给予小奖
        }
        
        // 正常概率判断
        for (uint8 i = 0; i < 6; i++) {
            if (randomNum < probabilityRanges[i]) {
                // 更新连败计数
                if (i == 0) {
                    consecutiveLosses[player]++;
                } else {
                    consecutiveLosses[player] = 0;
                }
                return i;
            }
        }
        
        // 默认返回谢谢惠顾
        consecutiveLosses[player]++;
        return 0;
    }
    
    // MAO游戏 - 修正版
    function playMAOGame() external nonReentrant {
        require(maoToken.balanceOf(msg.sender) >= MAO_BET_AMOUNT, "Insufficient MAO balance");
        require(maoToken.allowance(msg.sender, address(this)) >= MAO_BET_AMOUNT, "Insufficient MAO allowance");
        
        // 转入投注金额
        require(maoToken.transferFrom(msg.sender, address(this), MAO_BET_AMOUNT), "MAO transfer failed");
        
        // 资金分配
        uint256 toPrizePool = (MAO_BET_AMOUNT * PRIZE_POOL_PERCENT) / 100;   // 70 MAO
        uint256 toBurn = (MAO_BET_AMOUNT * BURN_PERCENT) / 100;              // 15 MAO
        uint256 toMarketing = (MAO_BET_AMOUNT * MARKETING_PERCENT) / 100;    // 15 MAO
        
        require(maoToken.transfer(prizePool, toPrizePool), "Prize pool transfer failed");
        require(maoToken.transfer(BURN_ADDRESS, toBurn), "Burn transfer failed");
        require(maoToken.transfer(marketingWallet, toMarketing), "Marketing transfer failed");
        
        emit TokensBurned(address(maoToken), toBurn);
        
        // 生成随机数并确定奖励（带连败保护）
        uint256 randomSeed = generateRandomNumber(msg.sender, allGames.length);
        uint8 rewardLevel = getRewardLevel(randomSeed, msg.sender, true);
        uint256 rewardAmount = maoRewards[rewardLevel];
        bool wasProtected = (consecutiveLosses[msg.sender] == 0 && rewardLevel > 0 && randomSeed < probabilityRanges[0]);
        
        // 从奖金池发放奖励
        if (rewardAmount > 0) {
            require(maoToken.allowance(prizePool, address(this)) >= rewardAmount, "Insufficient prize pool allowance");
            require(maoToken.transferFrom(prizePool, msg.sender, rewardAmount), "Reward transfer failed");
        }
        
        // 记录游戏结果
        GameResult memory gameResult = GameResult({
            player: msg.sender,
            tokenType: 0, // MAO
            betAmount: MAO_BET_AMOUNT,
            rewardAmount: rewardAmount,
            rewardLevel: rewardLevel,
            timestamp: block.timestamp,
            randomSeed: randomSeed,
            wasProtected: wasProtected
        });
        
        playerHistory[msg.sender].push(gameResult);
        allGames.push(gameResult);
        
        // 更新统计数据
        tokenStats[0].totalGames++;
        tokenStats[0].totalBets += MAO_BET_AMOUNT;
        if (rewardAmount > 0) {
            tokenStats[0].totalWins++;
            tokenStats[0].totalRewards += rewardAmount;
        }
        if (wasProtected) {
            tokenStats[0].protectedGames++;
        }
        
        emit GamePlayed(msg.sender, 0, MAO_BET_AMOUNT, rewardAmount, rewardLevel, randomSeed, wasProtected);
    }
    
    // PI游戏 - 修正版
    function playPIGame() external nonReentrant {
        require(piToken.balanceOf(msg.sender) >= PI_BET_AMOUNT, "Insufficient PI balance");
        require(piToken.allowance(msg.sender, address(this)) >= PI_BET_AMOUNT, "Insufficient PI allowance");
        
        // 转入投注金额
        require(piToken.transferFrom(msg.sender, address(this), PI_BET_AMOUNT), "PI transfer failed");
        
        // 资金分配
        uint256 toPrizePool = (PI_BET_AMOUNT * PRIZE_POOL_PERCENT) / 100;   // 700 PI
        uint256 toBurn = (PI_BET_AMOUNT * BURN_PERCENT) / 100;              // 150 PI
        uint256 toMarketing = (PI_BET_AMOUNT * MARKETING_PERCENT) / 100;    // 150 PI
        
        require(piToken.transfer(prizePool, toPrizePool), "Prize pool transfer failed");
        require(piToken.transfer(BURN_ADDRESS, toBurn), "Burn transfer failed");
        require(piToken.transfer(marketingWallet, toMarketing), "Marketing transfer failed");
        
        emit TokensBurned(address(piToken), toBurn);
        
        // 生成随机数并确定奖励（带连败保护）
        uint256 randomSeed = generateRandomNumber(msg.sender, allGames.length);
        uint8 rewardLevel = getRewardLevel(randomSeed, msg.sender, true);
        uint256 rewardAmount = piRewards[rewardLevel];
        bool wasProtected = (consecutiveLosses[msg.sender] == 0 && rewardLevel > 0 && randomSeed < probabilityRanges[0]);
        
        // 从奖金池发放奖励
        if (rewardAmount > 0) {
            require(piToken.allowance(prizePool, address(this)) >= rewardAmount, "Insufficient prize pool allowance");
            require(piToken.transferFrom(prizePool, msg.sender, rewardAmount), "Reward transfer failed");
        }
        
        // 记录游戏结果
        GameResult memory gameResult = GameResult({
            player: msg.sender,
            tokenType: 1, // PI
            betAmount: PI_BET_AMOUNT,
            rewardAmount: rewardAmount,
            rewardLevel: rewardLevel,
            timestamp: block.timestamp,
            randomSeed: randomSeed,
            wasProtected: wasProtected
        });
        
        playerHistory[msg.sender].push(gameResult);
        allGames.push(gameResult);
        
        // 更新统计数据
        tokenStats[1].totalGames++;
        tokenStats[1].totalBets += PI_BET_AMOUNT;
        if (rewardAmount > 0) {
            tokenStats[1].totalWins++;
            tokenStats[1].totalRewards += rewardAmount;
        }
        if (wasProtected) {
            tokenStats[1].protectedGames++;
        }
        
        emit GamePlayed(msg.sender, 1, PI_BET_AMOUNT, rewardAmount, rewardLevel, randomSeed, wasProtected);
    }
    
    // 🔍 透明度功能：获取玩家游戏历史
    function getPlayerHistory(address player) external view returns (GameResult[] memory) {
        return playerHistory[player];
    }
    
    // 🔍 透明度功能：获取概率配置
    function getProbabilityRanges() external view returns (uint256[6] memory) {
        return probabilityRanges;
    }
    
    // 🔍 透明度功能：获取奖励配置
    function getRewardConfig(uint8 tokenType) external view returns (uint256[6] memory) {
        return tokenType == 0 ? maoRewards : piRewards;
    }
    
    // 🔍 透明度功能：计算实际中奖率
    function getActualWinRate(uint8 tokenType) external view returns (uint256) {
        GameStats memory stats = tokenStats[tokenType];
        if (stats.totalGames == 0) return 0;
        return (stats.totalWins * 10000) / stats.totalGames; // 返回基点(万分之一)
    }
    
    // 🔍 透明度功能：获取玩家连败次数
    function getPlayerConsecutiveLosses(address player) external view returns (uint256) {
        return consecutiveLosses[player];
    }
    
    // 🔍 透明度功能：获取游戏统计
    function getGameStats(uint8 tokenType) external view returns (GameStats memory) {
        return tokenStats[tokenType];
    }
    
    // 📊 管理功能：更新营销钱包
    function updateMarketingWallet(address newMarketingWallet) external onlyOwner {
        require(newMarketingWallet != address(0), "Invalid marketing wallet address");
        marketingWallet = newMarketingWallet;
    }
    
    // 📊 管理功能：更新奖金池地址
    function updatePrizePool(address newPrizePool) external onlyOwner {
        require(newPrizePool != address(0), "Invalid prize pool address");
        prizePool = newPrizePool;
    }
    
    // 🚨 紧急功能：提取合约代币（仅限所有者）
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(owner(), amount), "Emergency withdraw failed");
    }
    
    // 💰 工具功能：获取合约代币余额
    function getContractBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
    
    // 💰 工具功能：获取奖金池代币余额
    function getPrizePoolBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(prizePool);
    }
} 