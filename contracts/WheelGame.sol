// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WheelGame is ReentrancyGuard, Ownable {
    IERC20 public maoToken;
    IERC20 public piToken;
    
    address public marketingWallet;
    address public prizePool;
    address public constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD; // 销毁地址
    
    // 游戏参数
    uint256 public constant MAO_BET_AMOUNT = 100 * 10**18; // 100 MAO
    uint256 public constant PI_BET_AMOUNT = 10000 * 10**18; // 10,000 PI
    
    // MAO奖励配置
    uint256[6] public maoRewards = [
        0,           // 谢谢惠顾 85%
        150 * 10**18, // 小奖 150 MAO (8%)
        400 * 10**18, // 中奖 400 MAO (4%)
        800 * 10**18, // 大奖 800 MAO (2%)
        1500 * 10**18, // 超级大奖 1500 MAO (0.8%)
        3000 * 10**18  // 终极大奖 3000 MAO (0.2%)
    ];
    
    // PI奖励配置
    uint256[6] public piRewards = [
        0,              // 谢谢惠顾 85%
        15000 * 10**18,  // 小奖 15,000 PI (8%)
        40000 * 10**18,  // 中奖 40,000 PI (4%)
        80000 * 10**18,  // 大奖 80,000 PI (2%)
        150000 * 10**18, // 超级大奖 150,000 PI (0.8%)
        300000 * 10**18  // 终极大奖 300,000 PI (0.2%)
    ];
    
    // 概率区间
    uint256[6] public probabilityRanges = [
        8500,  // 谢谢惠顾 85%
        8500 + 800,   // 小奖 8%
        8500 + 800 + 400,  // 中奖 4%
        8500 + 800 + 400 + 200,  // 大奖 2%
        8500 + 800 + 400 + 200 + 80,  // 超级大奖 0.8%
        10000  // 终极大奖 0.2%
    ];
    
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
    
    // 事件
    event GamePlayed(
        address indexed player,
        uint8 tokenType,
        uint256 betAmount,
        uint256 rewardAmount,
        uint8 rewardLevel,
        uint256 randomSeed
    );
    
    event TokensWithdrawn(address indexed token, uint256 amount);
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
    }
    
    // 生成伪随机数
    function generateRandomNumber(address player, uint256 nonce) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            player,
            nonce,
            blockhash(block.number - 1)
        ))) % 10000;
    }
    
    // 根据随机数确定奖励等级
    function getRewardLevel(uint256 randomNum) private view returns (uint8) {
        for (uint8 i = 0; i < 6; i++) {
            if (randomNum < probabilityRanges[i]) {
                return i;
            }
        }
        return 0; // 默认返回谢谢惠顾
    }

    // 授权奖金池代表合约发放奖励
    function authorizeRewardDistribution(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transferFrom(prizePool, address(this), amount), "Prize pool authorization failed");
    }
    
    // MAO游戏
    function playMAOGame() external nonReentrant {
        require(maoToken.balanceOf(msg.sender) >= MAO_BET_AMOUNT, "Insufficient MAO balance");
        require(maoToken.allowance(msg.sender, address(this)) >= MAO_BET_AMOUNT, "Insufficient MAO allowance");
        
        // 转入投注金额
        require(maoToken.transferFrom(msg.sender, address(this), MAO_BET_AMOUNT), "MAO transfer failed");
        
        // 新的资金分配: 70%奖金池 + 10%销毁 + 20%营销
        uint256 toPrizePool = (MAO_BET_AMOUNT * 70) / 100;   // 70 MAO
        uint256 toBurn = (MAO_BET_AMOUNT * 10) / 100;        // 10 MAO
        uint256 toMarketing = (MAO_BET_AMOUNT * 20) / 100;   // 20 MAO
        
        require(maoToken.transfer(prizePool, toPrizePool), "Prize pool transfer failed");
        require(maoToken.transfer(BURN_ADDRESS, toBurn), "Burn transfer failed");
        require(maoToken.transfer(marketingWallet, toMarketing), "Marketing transfer failed");
        
        emit TokensBurned(address(maoToken), toBurn);
        
        // 生成随机数并确定奖励
        uint256 randomSeed = generateRandomNumber(msg.sender, allGames.length);
        uint8 rewardLevel = getRewardLevel(randomSeed);
        uint256 rewardAmount = maoRewards[rewardLevel];
        
        // 从奖金池发放奖励（需要奖金池预先授权）
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
            randomSeed: randomSeed
        });
        
        playerHistory[msg.sender].push(gameResult);
        allGames.push(gameResult);
        
        emit GamePlayed(msg.sender, 0, MAO_BET_AMOUNT, rewardAmount, rewardLevel, randomSeed);
    }
    
    // PI游戏
    function playPIGame() external nonReentrant {
        require(piToken.balanceOf(msg.sender) >= PI_BET_AMOUNT, "Insufficient PI balance");
        require(piToken.allowance(msg.sender, address(this)) >= PI_BET_AMOUNT, "Insufficient PI allowance");
        
        // 转入投注金额
        require(piToken.transferFrom(msg.sender, address(this), PI_BET_AMOUNT), "PI transfer failed");
        
        // 新的资金分配: 70%奖金池 + 10%销毁 + 20%营销
        uint256 toPrizePool = (PI_BET_AMOUNT * 70) / 100;   // 7000 PI
        uint256 toBurn = (PI_BET_AMOUNT * 10) / 100;        // 1000 PI
        uint256 toMarketing = (PI_BET_AMOUNT * 20) / 100;   // 2000 PI
        
        require(piToken.transfer(prizePool, toPrizePool), "Prize pool transfer failed");
        require(piToken.transfer(BURN_ADDRESS, toBurn), "Burn transfer failed");
        require(piToken.transfer(marketingWallet, toMarketing), "Marketing transfer failed");
        
        emit TokensBurned(address(piToken), toBurn);
        
        // 生成随机数并确定奖励
        uint256 randomSeed = generateRandomNumber(msg.sender, allGames.length);
        uint8 rewardLevel = getRewardLevel(randomSeed);
        uint256 rewardAmount = piRewards[rewardLevel];
        
        // 从奖金池发放奖励（需要奖金池预先授权）
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
            randomSeed: randomSeed
        });
        
        playerHistory[msg.sender].push(gameResult);
        allGames.push(gameResult);
        
        emit GamePlayed(msg.sender, 1, PI_BET_AMOUNT, rewardAmount, rewardLevel, randomSeed);
    }
    
    // 获取玩家游戏历史
    function getPlayerHistory(address player) external view returns (GameResult[] memory) {
        return playerHistory[player];
    }
    
    // 获取合约代币余额
    function getContractBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
    
    // 获取奖金池代币余额
    function getPrizePoolBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(prizePool);
    }
    
    // 管理员提取代币（紧急情况）
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(owner(), amount), "Emergency withdraw failed");
        emit TokensWithdrawn(token, amount);
    }
    
    // 充值奖金到奖金池（用于发放奖励）
    function depositRewardsToPrizePool(address token, uint256 amount) external {
        require(IERC20(token).transferFrom(msg.sender, prizePool, amount), "Deposit to prize pool failed");
    }
} 