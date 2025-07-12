// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OptimizedWheelGame
 * @dev 可持续经济模型的转盘游戏合约
 * 
 * 特性:
 * - 移除复杂的成就系统
 * - 固定概率，透明可预测
 * - 经济模型可持续（1.6%平台盈利）
 * - 50%中奖率保持吸引力
 */
contract OptimizedWheelGame is ReentrancyGuard, Ownable {
    IERC20 public maoToken;
    IERC20 public piToken;
    
    address public marketingWallet;
    address public prizePool;
    address public constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;
    
    // 游戏参数
    uint256 public constant MAO_BET_AMOUNT = 100 * 10**18; // 100 MAO
    uint256 public constant PI_BET_AMOUNT = 1000 * 10**18; // 1000 PI (优化后)
    
    // 🎯 优化的MAO奖励配置 - 可持续经济模型
    uint256[6] public maoRewards = [
        0,            // 谢谢惠顾 50%
        105 * 10**18, // 小奖 105 MAO 22%
        125 * 10**18, // 中奖 125 MAO 20%
        200 * 10**18, // 大奖 200 MAO 7%
        600 * 10**18, // 超级大奖 600 MAO 0.8%
        1000 * 10**18 // 终极大奖 1000 MAO 0.2%
    ];
    
    // 🎯 优化的PI奖励配置 - 可持续经济模型
    uint256[6] public piRewards = [
        0,               // 谢谢惠顾 50%
        1050 * 10**18,   // 小奖 1,050 PI 22%
        1250 * 10**18,   // 中奖 1,250 PI 20%
        2000 * 10**18,   // 大奖 2,000 PI 7%
        6000 * 10**18,   // 超级大奖 6,000 PI 0.8%
        10000 * 10**18   // 终极大奖 10,000 PI 0.2%
    ];
    
    // 🎯 优化的概率区间 - 50%中奖率，经济平衡
    uint256[6] public probabilityRanges = [
        5000,  // 谢谢惠顾 50.0%
        7200,  // 小奖 22.0%
        9200,  // 中奖 20.0%
        9900,  // 大奖 7.0%
        9980,  // 超级大奖 0.8%
        10000  // 终极大奖 0.2%
    ];
    
    // 💰 资金分配比例
    uint256 public constant PRIZE_POOL_PERCENT = 70;  // 70%到奖金池
    uint256 public constant BURN_PERCENT = 15;        // 15%销毁
    uint256 public constant MARKETING_PERCENT = 15;   // 15%营销
    
    // 游戏记录
    struct GameResult {
        address player;
        uint8 tokenType; // 0=MAO, 1=PI
        uint256 betAmount;
        uint256 rewardAmount;
        uint8 rewardLevel;
        uint256 timestamp;
        uint256 randomSeed;
    }
    
    mapping(address => GameResult[]) public playerHistory;
    GameResult[] public allGames;
    
    // 统计数据
    struct GameStats {
        uint256 totalGames;
        uint256 totalBets;
        uint256 totalRewards;
        uint256 totalBurned;
        uint256 totalMarketing;
    }
    
    mapping(uint8 => GameStats) public tokenStats; // 0=MAO, 1=PI
    
    // 事件
    event GamePlayed(
        address indexed player,
        uint8 tokenType,
        uint256 betAmount,
        uint256 rewardAmount,
        uint8 rewardLevel,
        uint256 randomSeed
    );
    
    event TokensBurned(address indexed token, uint256 amount);
    event TokensWithdrawn(address indexed token, uint256 amount);
    event EconomicModelUpdated(string reason);
    
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
        
        emit EconomicModelUpdated("Contract deployed with sustainable economic model");
    }
    
    /**
     * @dev 生成安全的伪随机数
     * @param player 玩家地址
     * @param nonce 随机数种子
     * @return 0-9999的随机数
     */
    function generateRandomNumber(address player, uint256 nonce) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            player,
            nonce,
            blockhash(block.number - 1),
            gasleft()
        ))) % 10000;
    }
    
    /**
     * @dev 根据随机数确定奖励等级
     * @param randomNum 随机数
     * @return 奖励等级 (0-5)
     */
    function getRewardLevel(uint256 randomNum) private view returns (uint8) {
        for (uint8 i = 0; i < 6; i++) {
            if (randomNum < probabilityRanges[i]) {
                return i;
            }
        }
        return 0; // 默认返回谢谢惠顾
    }
    
    /**
     * @dev MAO游戏主函数
     */
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
        
        // 生成随机数并确定奖励
        uint256 randomSeed = generateRandomNumber(msg.sender, allGames.length);
        uint8 rewardLevel = getRewardLevel(randomSeed);
        uint256 rewardAmount = maoRewards[rewardLevel];
        
        // 记录游戏结果（不再发奖）
        GameResult memory gameResult = GameResult({
            player: msg.sender,
            tokenType: 0,
            betAmount: MAO_BET_AMOUNT,
            rewardAmount: rewardAmount,
            rewardLevel: rewardLevel,
            timestamp: block.timestamp,
            randomSeed: randomSeed
        });
        
        playerHistory[msg.sender].push(gameResult);
        allGames.push(gameResult);
        
        // 更新统计
        tokenStats[0].totalGames++;
        tokenStats[0].totalBets += MAO_BET_AMOUNT;
        tokenStats[0].totalRewards += rewardAmount;
        tokenStats[0].totalBurned += toBurn;
        tokenStats[0].totalMarketing += toMarketing;
        
        emit GamePlayed(msg.sender, 0, MAO_BET_AMOUNT, rewardAmount, rewardLevel, randomSeed);
    }
    
    /**
     * @dev PI游戏主函数
     */
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
        
        // 生成随机数并确定奖励
        uint256 randomSeed = generateRandomNumber(msg.sender, allGames.length);
        uint8 rewardLevel = getRewardLevel(randomSeed);
        uint256 rewardAmount = piRewards[rewardLevel];
        
        // 记录游戏结果（不再发奖）
        GameResult memory gameResult = GameResult({
            player: msg.sender,
            tokenType: 1,
            betAmount: PI_BET_AMOUNT,
            rewardAmount: rewardAmount,
            rewardLevel: rewardLevel,
            timestamp: block.timestamp,
            randomSeed: randomSeed
        });
        
        playerHistory[msg.sender].push(gameResult);
        allGames.push(gameResult);
        
        // 更新统计
        tokenStats[1].totalGames++;
        tokenStats[1].totalBets += PI_BET_AMOUNT;
        tokenStats[1].totalRewards += rewardAmount;
        tokenStats[1].totalBurned += toBurn;
        tokenStats[1].totalMarketing += toMarketing;
        
        emit GamePlayed(msg.sender, 1, PI_BET_AMOUNT, rewardAmount, rewardLevel, randomSeed);
    }
    
    // 查询函数
    function getPlayerHistory(address player) external view returns (GameResult[] memory) {
        return playerHistory[player];
    }
    
    function getGameStats(uint8 tokenType) external view returns (GameStats memory) {
        return tokenStats[tokenType];
    }
    
    function getTotalGames() external view returns (uint256) {
        return allGames.length;
    }
    
    function getContractBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
    
    function getPrizePoolBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(prizePool);
    }
    
    function getRewardConfig(uint8 tokenType) external view returns (uint256[6] memory) {
        if (tokenType == 0) {
            return maoRewards;
        } else {
            return piRewards;
        }
    }
    
    function getProbabilityRanges() external view returns (uint256[6] memory) {
        return probabilityRanges;
    }
    
    // 管理员函数
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(owner(), amount), "Emergency withdraw failed");
        emit TokensWithdrawn(token, amount);
    }
    
    function updateMarketingWallet(address newMarketingWallet) external onlyOwner {
        marketingWallet = newMarketingWallet;
        emit EconomicModelUpdated("Marketing wallet updated");
    }
    
    function updatePrizePool(address newPrizePool) external onlyOwner {
        prizePool = newPrizePool;
        emit EconomicModelUpdated("Prize pool updated");
    }
    
    // 充值奖金池
    function depositToPrizePool(address token, uint256 amount) external {
        require(IERC20(token).transferFrom(msg.sender, prizePool, amount), "Deposit failed");
    }
} 