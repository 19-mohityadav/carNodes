import { testPinataAuth, uploadJSONToIPFS, getIPFSGatewayUrl } from "../utils/ipfs.js";

async function main() {
  console.log("Testing Pinata IPFS authentication...");
  const auth = await testPinataAuth();
  console.log("Authentication successful! Response:", auth);

  console.log("\nTesting JSON upload to IPFS...");
  const demoVehicleDocument = {
    vin: "HONDA-CITY-ZX-2024-DEL",
    registrationNumber: "DL-01-AB-7890",
    model: "Honda City ZX Petrol",
    year: 2024,
    rcDocument: {
      registrationDate: "2024-02-15",
      rtoOffice: "DL-01 Delhi North",
      chassisNumber: "MA3EYD21S00123456",
      engineNumber: "L15Z1987654",
      fuelType: "Petrol",
    },
    insurance: {
      policyNumber: "POL-9988776655",
      provider: "HDFC ERGO General Insurance",
      validUntil: "2026-11-20",
    },
    serviceHistory: [
      { date: "2024-08-10", mileage: 5200, serviceType: "1st Free Service" },
      { date: "2025-02-14", mileage: 12400, serviceType: "Annual Maintenance" },
    ],
    verifiedBy: "CarNodes AI & Parivahan Gateway",
  };

  const cid = await uploadJSONToIPFS(demoVehicleDocument, "Vehicle_Honda_City_ZX_RC");
  console.log("Upload Success! IPFS CID:", cid);
  console.log("View Document at:", getIPFSGatewayUrl(cid));
}

main().catch((err) => {
  console.error("IPFS Test Failed:", err);
  process.exit(1);
});
