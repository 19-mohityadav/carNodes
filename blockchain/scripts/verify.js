import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const addressesPath = path.join(__dirname, "..", "deployedAddresses.json");
if (!fs.existsSync(addressesPath)) {
  console.error("deployedAddresses.json not found! Please run deploy script first.");
  process.exit(1);
}

const deployment = JSON.parse(fs.readFileSync(addressesPath, "utf-8"));
const { VehiclePassport, VehicleRegistry, VehicleEscrow, MockINR } = deployment.contracts;

const contracts = [
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

console.log("==================================================");
console.log("       CARNODES SMART CONTRACT VERIFICATION       ");
console.log("==================================================");

for (const contract of contracts) {
  console.log(`\n[+] Verifying ${contract.name} at: ${contract.address}`);
  const cmd = `npx hardhat verify --network sepolia ${contract.address} ${contract.args}`.trim();
  try {
    execSync(cmd, { stdio: "inherit" });
    console.log(`✅ ${contract.name} verified successfully!`);
  } catch (e) {
    console.log(`⚠️ ${contract.name}: Check above output (already verified or pending).`);
  }
}

console.log("\n==================================================");
console.log("             ALL VERIFICATIONS COMPLETE           ");
console.log("==================================================");
