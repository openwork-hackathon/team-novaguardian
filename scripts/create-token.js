/**
 * Create NovaGuardian Platform Token via Mint Club V2
 * Token backed by $OPENWORK on Base
 */

const { ethers } = require("ethers");

// Mint Club V2 Contracts (Base)
const CONTRACTS = {
  MCV2_Bond: "0xc5a076cad94176c2996B32d8466Be1cE757FAa27",
  MCV2_Token: "0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df",
  OPENWORK: "0x299c30DD5974BF4D5bFE42C340CA40462816AB07"
};

const BOND_ABI = [
  "function createToken((string name, string symbol) tokenParams, (uint16 mintRoyalty, uint16 burnRoyalty, address reserveToken, uint128 maxSupply, uint128[] stepRanges, uint128[] stepPrices) bondParams) external payable returns (address)",
  "function creationFee() view returns (uint256)"
];

async function main() {
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  
  // Load wallet from clawnch
  const walletData = require("/home/tt/.config/clawnch/wallet.json");
  const wallet = new ethers.Wallet(walletData.privateKey, provider);
  
  console.log("Creating NovaGuardian Token ($NOVA)...");
  console.log("Wallet:", wallet.address);
  
  const bond = new ethers.Contract(CONTRACTS.MCV2_Bond, BOND_ABI, wallet);
  
  // Check creation fee
  const fee = await bond.creationFee();
  console.log("Creation fee:", ethers.formatEther(fee), "ETH");
  
  // Token params
  const tokenParams = {
    name: "NovaGuardian Token",
    symbol: "NOVA"
  };
  
  // Bonding curve params
  const bondParams = {
    mintRoyalty: 100,  // 1%
    burnRoyalty: 100,  // 1%
    reserveToken: CONTRACTS.OPENWORK,
    maxSupply: ethers.parseEther("1000000"),  // 1M tokens
    stepRanges: [
      ethers.parseEther("100000"),   // 100K
      ethers.parseEther("500000"),   // 500K
      ethers.parseEther("1000000")   // 1M
    ],
    stepPrices: [
      ethers.parseEther("0.001"),    // 0.001 OPENWORK per token
      ethers.parseEther("0.005"),    // 0.005
      ethers.parseEther("0.01")      // 0.01
    ]
  };
  
  console.log("\nToken Config:");
  console.log("  Name:", tokenParams.name);
  console.log("  Symbol:", tokenParams.symbol);
  console.log("  Max Supply: 1,000,000 NOVA");
  console.log("  Reserve: $OPENWORK");
  
  // Create token
  console.log("\nCreating token...");
  const tx = await bond.createToken(tokenParams, bondParams, { value: fee });
  console.log("TX:", tx.hash);
  
  const receipt = await tx.wait();
  console.log("✅ Token created in block:", receipt.blockNumber);
  
  // Parse token address from logs
  const tokenAddress = receipt.logs[0]?.address;
  console.log("\n🎉 $NOVA Token Address:", tokenAddress);
  console.log("\nMint Club URL: https://mint.club/token/base/NOVA");
}

main().catch(console.error);
