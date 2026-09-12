import { network } from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const { ethers } = await network.create();
  const [signer] = await ethers.getSigners();

  console.log("==================================================");
  console.log("       SENDING REAL TRANSACTION TO SEPOLIA        ");
  console.log("==================================================");
  console.log("Network :", process.env.HARDHAT_NETWORK || "sepolia");
  console.log("Signer  :", signer.address);

  const balance = await ethers.provider.getBalance(signer.address);
  console.log("Balance :", ethers.formatEther(balance), "ETH");
  console.log("--------------------------------------------------");

  // 1. Read deployed addresses
  const addressesPath = path.join(__dirname, "..", "deployedAddresses.json");
  if (!fs.existsSync(addressesPath)) {
    throw new Error("deployedAddresses.json not found! Please run deploy script first.");
  }
  const { contracts } = JSON.parse(fs.readFileSync(addressesPath, "utf-8"));
  const registryAddress = contracts.VehicleRegistry;

  // 2. Read VehicleRegistry ABI
  const artifactPath = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "VehicleRegistry.sol",
    "VehicleRegistry.json"
  );
  const { abi } = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

  const registry = new ethers.Contract(registryAddress, abi, signer);

  // 3. Generate unique test VIN with timestamp
  const timestamp = Math.floor(Date.now() / 1000);
  const testVin = `VIN-SEPOLIA-${timestamp}`;
  const regNumber = `MH-12-TEST-${timestamp.toString().slice(-4)}`;
  const docCID = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";

  console.log(`\nRegistering Vehicle on Blockchain:`);
  console.log(`- Contract    : ${registryAddress}`);
  console.log(`- VIN         : ${testVin}`);
  console.log(`- Reg Number  : ${regNumber}`);
  console.log(`- Document CID: ${docCID}`);
  console.log(`\nBroadcasting transaction to Ethereum Sepolia...`);

  const tx = await registry.registerVehicle(testVin, regNumber, docCID);
  console.log(`\nTx Hash Submitted: ${tx.hash}`);
  console.log(`Awaiting block confirmation...`);

  const receipt = await tx.wait();
  console.log(`\n==================================================`);
  console.log(`       TRANSACTION CONFIRMED IN BLOCK #${receipt.blockNumber}       `);
  console.log(`==================================================`);
  console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
  console.log(`\nView on Sepolia Etherscan:`);
  console.log(`https://sepolia.etherscan.io/tx/${tx.hash}`);
  console.log(`==================================================\n`);
}

main().catch((error) => {
  console.error("Transaction failed:", error);
  process.exitCode = 1;
});
