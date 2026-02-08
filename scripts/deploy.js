const hre = require("hardhat");

async function main() {
  console.log("Deploying NovaGuardian...");

  const NovaGuardian = await hre.ethers.getContractFactory("NovaGuardian");
  const guardian = await NovaGuardian.deploy();
  await guardian.waitForDeployment();

  const address = await guardian.getAddress();
  console.log(`NovaGuardian deployed to: ${address}`);

  // Verify on explorer
  console.log("\nVerify with:");
  console.log(`npx hardhat verify --network base-sepolia ${address}`);

  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
