// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NovaGuardian
 * @notice Agent Sandbox & Security Layer - On-chain trust registry for AI agents
 * @dev Provides manifest scanning, URL analysis, and trust scoring
 */
contract NovaGuardian is Ownable, ReentrancyGuard {
    
    // ============ Structs ============
    
    struct AgentProfile {
        address wallet;
        string name;
        string manifestHash;    // IPFS hash of agent manifest
        uint256 trustScore;     // 0-100
        uint256 scanCount;
        uint256 registeredAt;
        bool isVerified;
        bool isBanned;
    }
    
    struct ScanResult {
        address agent;
        string targetHash;      // Hash of scanned content
        uint8 riskLevel;        // 0=safe, 1=low, 2=medium, 3=high, 4=critical
        uint256 timestamp;
        string[] findings;
    }
    
    struct TrustedSkill {
        string skillHash;       // IPFS hash of skill
        address submitter;
        uint256 trustScore;
        uint256 verifications;
        bool isApproved;
    }
    
    // ============ State ============
    
    mapping(address => AgentProfile) public agents;
    mapping(bytes32 => ScanResult) public scans;
    mapping(bytes32 => TrustedSkill) public trustedSkills;
    
    address[] public registeredAgents;
    bytes32[] public allScans;
    
    uint256 public totalScans;
    uint256 public totalAgents;
    
    uint256 public constant MIN_TRUST_SCORE = 0;
    uint256 public constant MAX_TRUST_SCORE = 100;
    uint256 public constant INITIAL_TRUST_SCORE = 50;
    
    // ============ Events ============
    
    event AgentRegistered(address indexed wallet, string name, uint256 timestamp);
    event AgentVerified(address indexed wallet, uint256 trustScore);
    event AgentBanned(address indexed wallet, string reason);
    event ScanCompleted(bytes32 indexed scanId, address indexed agent, uint8 riskLevel);
    event SkillSubmitted(bytes32 indexed skillId, string skillHash, address submitter);
    event SkillApproved(bytes32 indexed skillId, uint256 trustScore);
    event TrustScoreUpdated(address indexed agent, uint256 oldScore, uint256 newScore);
    
    // ============ Constructor ============
    
    constructor() Ownable(msg.sender) {}
    
    // ============ Agent Registration ============
    
    function registerAgent(string calldata name, string calldata manifestHash) external {
        require(agents[msg.sender].registeredAt == 0, "Already registered");
        require(bytes(name).length > 0, "Name required");
        
        agents[msg.sender] = AgentProfile({
            wallet: msg.sender,
            name: name,
            manifestHash: manifestHash,
            trustScore: INITIAL_TRUST_SCORE,
            scanCount: 0,
            registeredAt: block.timestamp,
            isVerified: false,
            isBanned: false
        });
        
        registeredAgents.push(msg.sender);
        totalAgents++;
        
        emit AgentRegistered(msg.sender, name, block.timestamp);
    }
    
    function updateManifest(string calldata manifestHash) external {
        require(agents[msg.sender].registeredAt > 0, "Not registered");
        require(!agents[msg.sender].isBanned, "Agent banned");
        
        agents[msg.sender].manifestHash = manifestHash;
    }
    
    // ============ Security Scanning ============
    
    function submitScan(
        string calldata targetHash,
        uint8 riskLevel,
        string[] calldata findings
    ) external returns (bytes32 scanId) {
        require(agents[msg.sender].registeredAt > 0, "Not registered");
        require(!agents[msg.sender].isBanned, "Agent banned");
        require(riskLevel <= 4, "Invalid risk level");
        
        scanId = keccak256(abi.encodePacked(msg.sender, targetHash, block.timestamp));
        
        scans[scanId] = ScanResult({
            agent: msg.sender,
            targetHash: targetHash,
            riskLevel: riskLevel,
            timestamp: block.timestamp,
            findings: findings
        });
        
        allScans.push(scanId);
        agents[msg.sender].scanCount++;
        totalScans++;
        
        // Increase trust score for contributing scans
        _adjustTrustScore(msg.sender, 1);
        
        emit ScanCompleted(scanId, msg.sender, riskLevel);
    }
    
    // ============ Skill Trust Registry ============
    
    function submitSkill(string calldata skillHash) external returns (bytes32 skillId) {
        require(agents[msg.sender].registeredAt > 0, "Not registered");
        
        skillId = keccak256(abi.encodePacked(skillHash));
        require(trustedSkills[skillId].submitter == address(0), "Skill exists");
        
        trustedSkills[skillId] = TrustedSkill({
            skillHash: skillHash,
            submitter: msg.sender,
            trustScore: 0,
            verifications: 0,
            isApproved: false
        });
        
        emit SkillSubmitted(skillId, skillHash, msg.sender);
    }
    
    function verifySkill(bytes32 skillId, uint256 score) external {
        require(agents[msg.sender].isVerified, "Not verified agent");
        require(trustedSkills[skillId].submitter != address(0), "Skill not found");
        require(score <= 100, "Invalid score");
        
        TrustedSkill storage skill = trustedSkills[skillId];
        skill.verifications++;
        skill.trustScore = (skill.trustScore + score) / skill.verifications;
        
        if (skill.verifications >= 3 && skill.trustScore >= 70) {
            skill.isApproved = true;
            emit SkillApproved(skillId, skill.trustScore);
        }
    }
    
    function isSkillTrusted(string calldata skillHash) external view returns (bool, uint256) {
        bytes32 skillId = keccak256(abi.encodePacked(skillHash));
        TrustedSkill storage skill = trustedSkills[skillId];
        return (skill.isApproved, skill.trustScore);
    }
    
    // ============ Admin Functions ============
    
    function verifyAgent(address agent) external onlyOwner {
        require(agents[agent].registeredAt > 0, "Not registered");
        agents[agent].isVerified = true;
        emit AgentVerified(agent, agents[agent].trustScore);
    }
    
    function banAgent(address agent, string calldata reason) external onlyOwner {
        require(agents[agent].registeredAt > 0, "Not registered");
        agents[agent].isBanned = true;
        agents[agent].trustScore = 0;
        emit AgentBanned(agent, reason);
    }
    
    function setTrustScore(address agent, uint256 score) external onlyOwner {
        require(agents[agent].registeredAt > 0, "Not registered");
        require(score <= MAX_TRUST_SCORE, "Invalid score");
        
        uint256 oldScore = agents[agent].trustScore;
        agents[agent].trustScore = score;
        emit TrustScoreUpdated(agent, oldScore, score);
    }
    
    // ============ Internal ============
    
    function _adjustTrustScore(address agent, int256 delta) internal {
        uint256 oldScore = agents[agent].trustScore;
        uint256 newScore;
        
        if (delta > 0) {
            newScore = oldScore + uint256(delta);
            if (newScore > MAX_TRUST_SCORE) newScore = MAX_TRUST_SCORE;
        } else {
            uint256 decrease = uint256(-delta);
            if (decrease > oldScore) {
                newScore = MIN_TRUST_SCORE;
            } else {
                newScore = oldScore - decrease;
            }
        }
        
        agents[agent].trustScore = newScore;
        emit TrustScoreUpdated(agent, oldScore, newScore);
    }
    
    // ============ View Functions ============
    
    function getAgent(address wallet) external view returns (AgentProfile memory) {
        return agents[wallet];
    }
    
    function getScan(bytes32 scanId) external view returns (ScanResult memory) {
        return scans[scanId];
    }
    
    function getAgentCount() external view returns (uint256) {
        return totalAgents;
    }
    
    function getScanCount() external view returns (uint256) {
        return totalScans;
    }
}
