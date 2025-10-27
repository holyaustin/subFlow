// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const SubFlow = await ethers.getContractFactory("SubFlow");
  const subFlow = await SubFlow.deploy();
  await subFlow.deployed();

  console.log("SubFlow deployed to:", subFlow.address);

  // Optionally add the deployer as executor so you can test executePayment
  const tx = await subFlow.addExecutor(deployer.address);
  await tx.wait();
  console.log("Added deployer as executor for testing.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
