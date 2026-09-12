import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DeploymentData {
  deployer: string;
  contracts: {
    VehiclePassport: string;
    VehicleRegistry: string;
    VehicleEscrow: string;
    MockINR: string;
  };
  deployedAt?: string;
}

interface ContractToVerify {
  name: string;
  address: string;
  args: string;
}

async function main(): Promise<void> {
  const addressesPath = path.join(__dirname, "..", "deployedAddresses.json");
  if (!fs.existsSync(addressesPath)) {
    console.error("deployedAddresses.json not found! Please run deploy script first.");
    process.exit(1);
  }

  const deployment: DeploymentData = JSON.parse(fs.readFileSync(addressesPath, "utf-8"));
  const { VehiclePassport, VehicleRegistry, VehicleEscrow, MockINR } = deployment.contracts;

  console.log("==================================================");
  console.log("       CARNODES SMART CONTRACT VERIFICATION       ");
  console.log("==================================================");
  console.log("Etherscan API Key:", process.env.ETHERSCAN_API_KEY ? "Configured [OK]" : "Missing [X]");
  console.log("--------------------------------------------------");

  const contracts: ContractToVerify[] = [
    {
      name: "VehiclePassport",
      address: VehiclePassport,
      args: "",
    },
    {
      name: "VehicleRegistry",
      address: VehicleRegistry,
      args: `"${VehiclePassport}"`,
    },
    {
      name: "VehicleEscrow",
      address: VehicleEscrow,
      args: `"${VehiclePassport}" "${VehicleRegistry}"`,
    },
    {
      name: "MockINR",
      address: MockINR,
      args: "",
    },
  ];

  for (const contract of contracts) {
    console.log(`\n[+] Verifying ${contract.name} at: ${contract.address}`);
    const cmd = `npx hardhat verify --network sepolia ${contract.address} ${contract.args}`.trim();
    try {
      execSync(cmd, { stdio: "inherit" });
      console.log(`✅ ${contract.name} verified successfully!`);
    } catch (e: any) {
      console.warn(`⚠️ ${contract.name}: Verification note (check output above for status).`);
    }
  }

  console.log("\n==================================================");
  console.log("             ALL VERIFICATIONS COMPLETE           ");
  console.log("==================================================");
}

main().catch((error) => {
  console.error("Verification script error:", error);
  process.exitCode = 1;
});

