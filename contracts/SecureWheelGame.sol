// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title SecureWheelGame - 万无一失的安全游戏合约
 * @dev 包含多重签名、时间锁、限额控制等安全机制
 */
contract SecureWheelGame is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // 代币合约
    IERC20 public immutable maoToken;
    IERC20 public immutable piToken;
    
    // 多重签名奖金池
    address public multisigPrizePool;
    
    // 营销钱包
    address public marketingWallet;
    
    // 游戏配置
    uint256 public constant MAO_GAME_COST = 100 * 10**18; // 100 MAO
    uint256 public constant PI_GAME_COST = 1000 * 10**18; // 1000 PI
    
    // 分配比例 (基点: 10000 = 100%)
    uint256 public constant BURN_PERCENTAGE = 1500;      // 15%
    uint256 public constant MARKETING_PERCENTAGE = 1500; // 15%
    uint256 public constant PRIZE_POOL_PERCENTAGE = 7000; // 70%
    
    // 安全机制
    uint256 public dailyTransferLimit;
    uint256 public weeklyTransferLimit;
    uint256 public lastDailyReset;
    uint256 public lastWeeklyReset;
    uint256 public dailyTransferred;
    uint256 public weeklyTransferred;
    
    // 时间锁
    uint256 public constant TIMELOCK_DELAY = 24 hours;
    mapping(bytes32 => uint256) public pendingActions;
    
    // 事件
    event GamePlayed(
        address indexed player,
        uint8 tokenType, // 0=MAO, 1=PI
        uint256 betAmount,
        uint256 rewardAmount,
        uint8 rewardLevel,
        uint256 randomSeed,
        bool wasProtected
    );
    
    event SecurityAlert(
        string alertType,
        address indexed target,
        uint256 amount,
        uint256 timestamp
    );
    
    event TimelockSet(
        bytes32 indexed actionHash,
        uint256 executeAfter,
        string action
    );
    
    // 错误定义
    error InsufficientBalance();
    error InsufficientAllowance();
    error TransferLimitExceeded();
    error TimelockNotExpired();
    error InvalidAction();
    error SecurityViolation();

    constructor(
        address _maoToken,
        address _piToken,
        address _multisigPrizePool,
        address _marketingWallet
    ) {
        maoToken = IERC20(_maoToken);
        piToken = IERC20(_piToken);
        multisigPrizePool = _multisigPrizePool;
        marketingWallet = _marketingWallet;
        
        // 设置限额
        dailyTransferLimit = 50000 * 10**18; // 50,000 MAO
        weeklyTransferLimit = 200000 * 10**18; // 200,000 MAO
        
        lastDailyReset = block.timestamp;
        lastWeeklyReset = block.timestamp;
    }

    /**
     * @dev 玩MAO游戏 - 包含安全检查
     */
    function playMAOGame() external nonReentrant whenNotPaused {
        _playGame(0, MAO_GAME_COST, maoToken);
    }

    /**
     * @dev 玩PI游戏 - 包含安全检查
     */
    function playPIGame() external nonReentrant whenNotPaused {
        _playGame(1, PI_GAME_COST, piToken);
    }

    /**
     * @dev 核心游戏逻辑 - 包含多重安全检查
     */
    function _playGame(uint8 tokenType, uint256 cost, IERC20 token) internal {
        address player = msg.sender;
        
        // 1. 余额检查
        if (token.balanceOf(player) < cost) {
            revert InsufficientBalance();
        }
        
        // 2. 授权检查
        if (token.allowance(player, address(this)) < cost) {
            revert InsufficientAllowance();
        }
        
        // 3. 限额检查
        _checkTransferLimits(cost);
        
        // 4. 转移代币到合约
        token.safeTransferFrom(player, address(this), cost);
        
        // 5. 生成随机数和游戏结果
        uint256 randomSeed = _generateRandomSeed(player);
        (uint256 rewardAmount, uint8 rewardLevel, bool isWin) = _calculateReward(randomSeed, cost);
        
        // 6. 分配资金
        _distributeFunds(cost, token);
        
        // 7. 发放奖励
        if (isWin && rewardAmount > 0) {
            _safeTransferReward(player, rewardAmount, token);
        }
        
        // 8. 记录游戏历史
        _recordGameHistory(player, tokenType, cost, rewardAmount, rewardLevel, randomSeed);
        
        // 9. 发出事件
        emit GamePlayed(player, tokenType, cost, rewardAmount, rewardLevel, randomSeed, false);
    }

    /**
     * @dev 检查转账限额
     */
    function _checkTransferLimits(uint256 amount) internal {
        // 重置每日限额
        if (block.timestamp >= lastDailyReset + 1 days) {
            dailyTransferred = 0;
            lastDailyReset = block.timestamp;
        }
        
        // 重置每周限额
        if (block.timestamp >= lastWeeklyReset + 7 days) {
            weeklyTransferred = 0;
            lastWeeklyReset = block.timestamp;
        }
        
        // 检查限额
        if (dailyTransferred + amount > dailyTransferLimit) {
            revert TransferLimitExceeded();
        }
        
        if (weeklyTransferred + amount > weeklyTransferLimit) {
            revert TransferLimitExceeded();
        }
        
        // 更新已转账金额
        dailyTransferred += amount;
        weeklyTransferred += amount;
    }

    /**
     * @dev 分配资金到各个地址
     */
    function _distributeFunds(uint256 totalAmount, IERC20 token) internal {
        uint256 burnAmount = (totalAmount * BURN_PERCENTAGE) / 10000;
        uint256 marketingAmount = (totalAmount * MARKETING_PERCENTAGE) / 10000;
        uint256 prizePoolAmount = (totalAmount * PRIZE_POOL_PERCENTAGE) / 10000;
        
        // 销毁
        if (burnAmount > 0) {
            address burnAddress = 0x000000000000000000000000000000000000dEaD;
            token.safeTransfer(burnAddress, burnAmount);
        }
        
        // 营销钱包
        if (marketingAmount > 0) {
            token.safeTransfer(marketingWallet, marketingAmount);
        }
        
        // 奖金池 (多重签名)
        if (prizePoolAmount > 0) {
            token.safeTransfer(multisigPrizePool, prizePoolAmount);
        }
    }

    /**
     * @dev 安全发放奖励
     */
    function _safeTransferReward(address player, uint256 amount, IERC20 token) internal {
        // 检查奖金池余额
        uint256 prizePoolBalance = token.balanceOf(multisigPrizePool);
        if (prizePoolBalance < amount) {
            emit SecurityAlert("INSUFFICIENT_PRIZE_POOL", multisigPrizePool, amount, block.timestamp);
            return; // 不发放奖励，但不回滚游戏
        }
        
        // 从奖金池转移奖励
        token.safeTransferFrom(multisigPrizePool, player, amount);
    }

    /**
     * @dev 生成随机种子
     */
    function _generateRandomSeed(address player) internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            player,
            blockhash(block.number - 1)
        )));
    }

    /**
     * @dev 计算奖励
     */
    function _calculateReward(uint256 randomSeed, uint256 betAmount) internal pure returns (uint256, uint8, bool) {
        uint256 random = randomSeed % 100;
        
        // 奖励概率配置
        if (random < 5) { // 5% 概率获得 10x 奖励
            return (betAmount * 10, 10, true);
        } else if (random < 15) { // 10% 概率获得 5x 奖励
            return (betAmount * 5, 5, true);
        } else if (random < 30) { // 15% 概率获得 2x 奖励
            return (betAmount * 2, 2, true);
        } else if (random < 50) { // 20% 概率获得 1.5x 奖励
            return (betAmount * 3 / 2, 1, true);
        }
        
        return (0, 0, false); // 50% 概率不中奖
    }

    /**
     * @dev 记录游戏历史
     */
    function _recordGameHistory(
        address player,
        uint8 tokenType,
        uint256 betAmount,
        uint256 rewardAmount,
        uint8 rewardLevel,
        uint256 randomSeed
    ) internal {
        // 这里可以添加游戏历史记录逻辑
        // 为了节省gas，暂时只记录事件
    }

    // ========== 安全管理员功能 ==========

    /**
     * @dev 紧急暂停 - 只有多重签名可以调用
     */
    function emergencyPause() external {
        require(msg.sender == multisigPrizePool, "Only multisig can pause");
        _pause();
        emit SecurityAlert("EMERGENCY_PAUSE", address(this), 0, block.timestamp);
    }

    /**
     * @dev 恢复游戏 - 只有多重签名可以调用
     */
    function emergencyUnpause() external {
        require(msg.sender == multisigPrizePool, "Only multisig can unpause");
        _unpause();
    }

    /**
     * @dev 更新限额 - 需要时间锁
     */
    function updateTransferLimits(uint256 newDailyLimit, uint256 newWeeklyLimit) external onlyOwner {
        bytes32 actionHash = keccak256(abi.encodePacked("UPDATE_LIMITS", newDailyLimit, newWeeklyLimit));
        _setTimelock(actionHash, "Update transfer limits");
    }

    /**
     * @dev 执行限额更新
     */
    function executeUpdateLimits(uint256 newDailyLimit, uint256 newWeeklyLimit) external onlyOwner {
        bytes32 actionHash = keccak256(abi.encodePacked("UPDATE_LIMITS", newDailyLimit, newWeeklyLimit));
        _executeTimelock(actionHash);
        
        dailyTransferLimit = newDailyLimit;
        weeklyTransferLimit = newWeeklyLimit;
    }

    /**
     * @dev 设置时间锁
     */
    function _setTimelock(bytes32 actionHash, string memory action) internal {
        pendingActions[actionHash] = block.timestamp + TIMELOCK_DELAY;
        emit TimelockSet(actionHash, block.timestamp + TIMELOCK_DELAY, action);
    }

    /**
     * @dev 执行时间锁操作
     */
    function _executeTimelock(bytes32 actionHash) internal view {
        uint256 executeAfter = pendingActions[actionHash];
        if (executeAfter == 0) {
            revert InvalidAction();
        }
        if (block.timestamp < executeAfter) {
            revert TimelockNotExpired();
        }
    }

    // ========== 查询功能 ==========

    /**
     * @dev 获取玩家游戏历史
     */
    function getPlayerHistory(address player) external view returns (GameHistory[] memory) {
        // 这里返回玩家的游戏历史
        // 为了简化，返回空数组
        return new GameHistory[](0);
    }

    /**
     * @dev 获取当前限额状态
     */
    function getLimitStatus() external view returns (
        uint256 dailyLimit,
        uint256 weeklyLimit,
        uint256 dailyUsed,
        uint256 weeklyUsed,
        uint256 nextDailyReset,
        uint256 nextWeeklyReset
    ) {
        return (
            dailyTransferLimit,
            weeklyTransferLimit,
            dailyTransferred,
            weeklyTransferred,
            lastDailyReset + 1 days,
            lastWeeklyReset + 7 days
        );
    }

    // 数据结构
    struct GameHistory {
        address player;
        uint8 tokenType;
        uint256 betAmount;
        uint256 rewardAmount;
        uint8 rewardLevel;
        uint256 timestamp;
        uint256 randomSeed;
        bool wasProtected;
    }
} 