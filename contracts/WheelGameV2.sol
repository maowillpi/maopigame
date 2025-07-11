// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WheelGameV2 is ReentrancyGuard, Ownable {
    IERC20 public maoToken;
    IERC20 public piToken;
    
    address public marketingWallet;
    address public prizePool;
    address public constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;
    
    // 🔧 可修改的游戏参数
    uint256 public maoBetAmount = 100 * 10**18; // 可修改的投注金额
    uint256 public piBetAmount = 1000 * 10**18;  // 修正为1000 PI，更合理
    
    // 🎰 可修改的奖励配置
    uint256[6] public maoRewards = [
        0,            // 谢谢惠顾
        105 * 10**18, // 小奖 105 MAO (有盈利)
        150 * 10**18, // 中奖 150 MAO
        250 * 10**18, // 大奖 250 MAO
        400 * 10**18, // 超级大奖 400 MAO
        700 * 10**18  // 终极大奖 700 MAO
    ];
    
    uint256[6] public piRewards = [
        0,              // 谢谢惠顾
        1050 * 10**18,  // 小奖 1,050 PI (有盈利)
        1500 * 10**18,  // 中奖 1,500 PI
        2500 * 10**18,  // 大奖 2,500 PI
        4000 * 10**18,  // 超级大奖 4,000 PI
        7000 * 10**18   // 终极大奖 7,000 PI
    ];
    
    // 🎯 可修改的概率区间 - 更合理的分配
    uint256[6] public probabilityRanges = [
        5800,  // 谢谢惠顾 58%
        5800 + 2200,   // 小奖 22% (有盈利感)
        5800 + 2200 + 1200,  // 中奖 12%
        5800 + 2200 + 1200 + 600,  // 大奖 6%
        5800 + 2200 + 1200 + 600 + 150,  // 超级大奖 1.5%
        10000  // 终极大奖 0.5%
    ];
    
    // 💰 资金分配比例 (可修改)
    uint256 public prizePoolPercent = 70;  // 70%到奖金池
    uint256 public burnPercent = 10;       // 10%销毁
    uint256 public marketingPercent = 20;  // 20%营销
    
    // 游戏记录
    struct GameResult {
        address player;
        uint8 tokenType;
        uint256 betAmount;
        uint256 rewardAmount;
        uint8 rewardLevel;
        uint256 timestamp;
        uint256 randomSeed;
    }
    
    mapping(address => GameResult[]) public playerHistory;
    GameResult[] public allGames;
    
    // 🎉 新增事件
    event GamePlayed(address indexed player, uint8 tokenType, uint256 betAmount, uint256 rewardAmount, uint8 rewardLevel, uint256 randomSeed);
    event RewardsUpdated(string tokenType, uint256[6] newRewards);
    event ProbabilitiesUpdated(uint256[6] newProbabilities);
    event BetAmountsUpdated(uint256 newMaoBet, uint256 newPiBet);
    event FundingRatiosUpdated(uint256 prizePool, uint256 burn, uint256 marketing);
    
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
    
    // 🔧 管理函数：更新MAO奖励
    function updateMaoRewards(uint256[6] memory newRewards) external onlyOwner {
        maoRewards = newRewards;
        emit RewardsUpdated("MAO", newRewards);
    }
    
    // 🔧 管理函数：更新PI奖励
    function updatePiRewards(uint256[6] memory newRewards) external onlyOwner {
        piRewards = newRewards;
        emit RewardsUpdated("PI", newRewards);
    }
    
    // 🎯 管理函数：更新概率
    function updateProbabilities(uint256[6] memory newProbabilities) external onlyOwner {
        // 验证概率总和为10000 (100%)
        require(newProbabilities[5] == 10000, "Total probability must be 10000");
        probabilityRanges = newProbabilities;
        emit ProbabilitiesUpdated(newProbabilities);
    }
    
    // 💰 管理函数：更新投注金额
    function updateBetAmounts(uint256 newMaoBet, uint256 newPiBet) external onlyOwner {
        maoBetAmount = newMaoBet;
        piBetAmount = newPiBet;
        emit BetAmountsUpdated(newMaoBet, newPiBet);
    }
    
    // 📊 管理函数：更新资金分配比例
    function updateFundingRatios(uint256 _prizePool, uint256 _burn, uint256 _marketing) external onlyOwner {
        require(_prizePool + _burn + _marketing == 100, "Ratios must sum to 100");
        prizePoolPercent = _prizePool;
        burnPercent = _burn;
        marketingPercent = _marketing;
        emit FundingRatiosUpdated(_prizePool, _burn, _marketing);
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
        return 0;
    }
    
    // MAO游戏 - 使用动态参数
    function playMAOGame() external nonReentrant {
        require(maoToken.balanceOf(msg.sender) >= maoBetAmount, "Insufficient MAO balance");
        require(maoToken.allowance(msg.sender, address(this)) >= maoBetAmount, "Insufficient MAO allowance");
        
        require(maoToken.transferFrom(msg.sender, address(this), maoBetAmount), "MAO transfer failed");
        
        // 动态资金分配
        uint256 toPrizePool = (maoBetAmount * prizePoolPercent) / 100;
        uint256 toBurn = (maoBetAmount * burnPercent) / 100;
        uint256 toMarketing = (maoBetAmount * marketingPercent) / 100;
        
        require(maoToken.transfer(prizePool, toPrizePool), "Prize pool transfer failed");
        require(maoToken.transfer(BURN_ADDRESS, toBurn), "Burn transfer failed");
        require(maoToken.transfer(marketingWallet, toMarketing), "Marketing transfer failed");
        
        // 生成结果
        uint256 randomSeed = generateRandomNumber(msg.sender, allGames.length);
        uint8 rewardLevel = getRewardLevel(randomSeed);
        uint256 rewardAmount = maoRewards[rewardLevel];
        
        // 发放奖励
        if (rewardAmount > 0) {
            require(maoToken.allowance(prizePool, address(this)) >= rewardAmount, "Insufficient prize pool allowance");
            require(maoToken.transferFrom(prizePool, msg.sender, rewardAmount), "Reward transfer failed");
        }
        
        // 记录结果
        GameResult memory gameResult = GameResult({
            player: msg.sender,
            tokenType: 0,
            betAmount: maoBetAmount,
            rewardAmount: rewardAmount,
            rewardLevel: rewardLevel,
            timestamp: block.timestamp,
            randomSeed: randomSeed
        });
        
        playerHistory[msg.sender].push(gameResult);
        allGames.push(gameResult);
        
        emit GamePlayed(msg.sender, 0, maoBetAmount, rewardAmount, rewardLevel, randomSeed);
    }
    
    // PI游戏 - 使用动态参数
    function playPIGame() external nonReentrant {
        require(piToken.balanceOf(msg.sender) >= piBetAmount, "Insufficient PI balance");
        require(piToken.allowance(msg.sender, address(this)) >= piBetAmount, "Insufficient PI allowance");
        
        require(piToken.transferFrom(msg.sender, address(this), piBetAmount), "PI transfer failed");
        
        // 动态资金分配
        uint256 toPrizePool = (piBetAmount * prizePoolPercent) / 100;
        uint256 toBurn = (piBetAmount * burnPercent) / 100;
        uint256 toMarketing = (piBetAmount * marketingPercent) / 100;
        
        require(piToken.transfer(prizePool, toPrizePool), "Prize pool transfer failed");
        require(piToken.transfer(BURN_ADDRESS, toBurn), "Burn transfer failed");
        require(piToken.transfer(marketingWallet, toMarketing), "Marketing transfer failed");
        
        // 生成结果
        uint256 randomSeed = generateRandomNumber(msg.sender, allGames.length);
        uint8 rewardLevel = getRewardLevel(randomSeed);
        uint256 rewardAmount = piRewards[rewardLevel];
        
        // 发放奖励
        if (rewardAmount > 0) {
            require(piToken.allowance(prizePool, address(this)) >= rewardAmount, "Insufficient prize pool allowance");
            require(piToken.transferFrom(prizePool, msg.sender, rewardAmount), "Reward transfer failed");
        }
        
        // 记录结果
        GameResult memory gameResult = GameResult({
            player: msg.sender,
            tokenType: 1,
            betAmount: piBetAmount,
            rewardAmount: rewardAmount,
            rewardLevel: rewardLevel,
            timestamp: block.timestamp,
            randomSeed: randomSeed
        });
        
        playerHistory[msg.sender].push(gameResult);
        allGames.push(gameResult);
        
        emit GamePlayed(msg.sender, 1, piBetAmount, rewardAmount, rewardLevel, randomSeed);
    }
    
    // 查询函数
    function getPlayerHistory(address player) external view returns (GameResult[] memory) {
        return playerHistory[player];
    }
    
    function getContractBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
    
    function getPrizePoolBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(prizePool);
    }
    
    // 紧急管理功能
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(owner(), amount), "Emergency withdraw failed");
    }
    
    function depositRewardsToPrizePool(address token, uint256 amount) external {
        require(IERC20(token).transferFrom(msg.sender, prizePool, amount), "Deposit failed");
    }
} 