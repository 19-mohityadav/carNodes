import { run } from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const addressesPath = path.join(__dirname, "..", "deployedAddresses.json");
  if (!fs.existsSync(addressesPath)) {
    console.error("deployedAddresses.json not found! Please run deploy script first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(addressesPath, "utf-8"));
  const { VehiclePassport, VehicleRegistry, VehicleEscrow, MockINR } = deployment.contracts;

  console.log("==================================================");
  console.log("       CARNODES CONTRACT VERIFICATION             ");
  console.log("==================================================");
  console.log("Etherscan API Key:", process.env.ETHERSCAN_API_KEY ? "Configured [OK]" : "Missing [X]");
  console.log("--------------------------------------------------");

  // 1. Verify VehiclePassport
  console.log("\n[1/4] Verifying VehiclePassport at:", VehiclePassport);
  try {
    await run("verify", {
      address: VehiclePassport,
      constructorArgs: [],
    });
    console.log("[OK] VehiclePassport verified successfully!");
  } catch (err: any) {
    console.warn("[!] VehiclePassport verification note:", err?.message || err);
  }

  // 2. Verify VehicleRegistry
  console.log("\n[2/4] Verifying VehicleRegistry at:", VehicleRegistry);
  try {
    await run("verify", {
      address: VehicleRegistry,
      constructorArgs: [VehiclePassport],
    });
    console.log("[OK] VehicleRegistry verified successfully!");
  } catch (err: any) {
    console.warn("[!] VehicleRegistry verification note:", err?.message || err);
  }

  // 3. Verify VehicleEscrow
  console.log("\n[3/4] Verifying VehicleEscrow at:", VehicleEscrow);
  try {
    await run("verify", {
      address: VehicleEscrow,
      constructorArgs: [VehiclePassport, VehicleRegistry],
    });
    console.log("[OK] VehicleEscrow verified successfully!");
  } catch (err: any) {
    console.warn("[!] VehicleEscrow verification note:", err?.message || err);
  }

  // 4. Verify MockINR
  console.log("\n[4/4] Verifying MockINR at:", MockINR);
  try {
    await run("verify", {
      address: MockINR,
      constructorArgs: [],
    });
    console.log("[OK] MockINR verified successfully!");
  } catch (err: any) {
    console.warn("[!] MockINR verification note:", err?.message || err);
  }

  console.log("\n==================================================");
  console.log("             VERIFICATION COMPLETE                ");
  console.log("==================================================");
}

main().catch((error) => {
  console.error("Verification script error:", error);
  process.exitCode = 1;
});
