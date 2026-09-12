import { network } from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const { ethers } = await network.create();
  const [deployer] = await ethers.getSigners();

  console.log("==================================================");
  console.log("       CARNODES SMART CONTRACT DEPLOYMENT         ");
  console.log("==================================================");
  console.log("Network         :", process.env.HARDHAT_NETWORK || "sepolia / active");
  console.log("Deployer Address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer Balance:", ethers.formatEther(balance), "ETH");
  console.log("--------------------------------------------------");

  // 1. Deploy VehiclePassport (ERC721)
  console.log("\n[1/4] Deploying VehiclePassport...");
  const passport = await ethers.deployContract("VehiclePassport");
  await passport.waitForDeployment();
  const passportAddress = await passport.getAddress();
  console.log("VehiclePassport deployed at:", passportAddress);

  // 2. Deploy VehicleRegistry
  console.log("\n[2/4] Deploying VehicleRegistry...");
  const registry = await ethers.deployContract("VehicleRegistry", [passportAddress]);
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("VehicleRegistry deployed at:", registryAddress);

  // 3. Deploy VehicleEscrow
  console.log("\n[3/4] Deploying VehicleEscrow...");
  const escrow = await ethers.deployContract("VehicleEscrow", [
    passportAddress,
    registryAddress,
  ]);
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log("VehicleEscrow deployed at:", escrowAddress);

  // 4. Link VehicleEscrow in VehicleRegistry
  console.log("\n[+] Authorizing VehicleEscrow inside VehicleRegistry...");
  const linkTx = await registry.setEscrowContract(escrowAddress);
  await linkTx.wait();
  console.log("Registry linked with Escrow successfully!");

  // 5. Deploy MockINR Token
  console.log("\n[4/4] Deploying MockINR (mINR)...");
  const mockINR = await ethers.deployContract("MockINR");
  await mockINR.waitForDeployment();
  const mockINRAddress = await mockINR.getAddress();
  console.log("MockINR deployed at:", mockINRAddress);

  console.log("\n==================================================");
  console.log("             DEPLOYMENT COMPLETE                  ");
  console.log("==================================================");
  console.log("VehiclePassport deployed:\n" + passportAddress);
  console.log("\nVehicleRegistry deployed:\n" + registryAddress);
  console.log("\nVehicleEscrow deployed:\n" + escrowAddress);
  console.log("\nMockINR deployed:\n" + mockINRAddress);
  console.log("==================================================");

  const deploymentData = {
    deployer: deployer.address,
    contracts: {
      VehiclePassport: passportAddress,
      VehicleRegistry: registryAddress,
      VehicleEscrow: escrowAddress,
      MockINR: mockINRAddress,
    },
    deployedAt: new Date().toISOString(),
  };

  // Save to blockchain folder
  const localOutputPath = path.join(__dirname, "..", "deployedAddresses.json");
  fs.writeFileSync(localOutputPath, JSON.stringify(deploymentData, null, 2));
  console.log(`\nAddresses saved to: ${localOutputPath}`);

  // Export ABIs and Addresses directly to frontend/src/contracts/
  const frontendContractsDir = path.join(__dirname, "..", "..", "frontend", "src", "contracts");
  if (!fs.existsSync(frontendContractsDir)) {
    fs.mkdirSync(frontendContractsDir, { recursive: true });
  }

  // Copy Addresses to frontend
  fs.writeFileSync(
    path.join(frontendContractsDir, "deployedAddresses.json"),
    JSON.stringify(deploymentData, null, 2)
  );

  // Copy ABIs to frontend
  const contractsToCopy = [
    "VehiclePassport",
    "VehicleRegistry",
    "VehicleEscrow",
    "MockINR",
  ];

  for (const name of contractsToCopy) {
    const artifactPath = path.join(
      __dirname,
      "..",
      "artifacts",
      "contracts",
      `${name}.sol`,
      `${name}.json`
    );
    if (fs.existsSync(artifactPath)) {
      const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
      fs.writeFileSync(
        path.join(frontendContractsDir, `${name}.json`),
        JSON.stringify(artifact, null, 2)
      );
    }
  }

  console.log(`Exported contract addresses and ABIs to: ${frontendContractsDir}`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
