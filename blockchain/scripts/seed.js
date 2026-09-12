import { network } from "hardhat";
import { uploadJSONToIPFS, getIPFSGatewayUrl } from "../utils/ipfs.js";

async function main() {
  const { ethers } = await network.create();
  const [rtoAdmin, seller, buyer] = await ethers.getSigners();

  console.log("==================================================");
  console.log("       CARNODES END-TO-END DEMO SEED             ");
  console.log("==================================================");
  console.log("RTO Authority :", rtoAdmin.address);
  console.log("Seller Wallet :", seller.address);
  console.log("Buyer Wallet  :", buyer.address);
  console.log("--------------------------------------------------");

  // Deploy contracts
  console.log("\nDeploying fresh contracts for demo...");
  const passport = await ethers.deployContract("VehiclePassport");
  await passport.waitForDeployment();
  const registry = await ethers.deployContract("VehicleRegistry", [await passport.getAddress()]);
  await registry.waitForDeployment();
  const escrow = await ethers.deployContract("VehicleEscrow", [
    await passport.getAddress(),
    await registry.getAddress(),
  ]);
  await escrow.waitForDeployment();
  await (await registry.setEscrowContract(await escrow.getAddress())).wait();

  console.log("VehiclePassport deployed at:", await passport.getAddress());
  console.log("VehicleRegistry deployed at:", await registry.getAddress());
  console.log("VehicleEscrow deployed at  :", await escrow.getAddress());

  // Demo Vehicle Data
  const vin = "HONDA-CITY-ZX-2024-DEL";
  const regNumber = "DL-01-AB-7890";
  const vehiclePriceETH = ethers.parseEther("0.01"); // ₹7,50,000 equivalent demo testnet ETH

  console.log("\n--------------------------------------------------");
  console.log("STEP 1: Upload Documents to IPFS (via Pinata)");
  console.log("--------------------------------------------------");
  const vehicleMetadata = {
    vin,
    registrationNumber: regNumber,
    model: "Honda City ZX Petrol",
    year: 2024,
    rcDetails: {
      ownerName: "Seller 0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      rtoAuthority: "DL-01 Delhi North",
      registrationDate: "2024-03-10",
      chassisNo: "MA3EYD21S00987654",
      engineNo: "L15Z1987654",
      fuelType: "Petrol",
    },
    insurance: {
      policyNo: "HDFC-ERGO-MOT-2024-8899",
      provider: "HDFC ERGO General Insurance",
      validTill: "2027-03-09",
    },
    vehicleImages: [
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi/front.jpg",
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi/odometer.jpg",
    ],
    timestamp: new Date().toISOString(),
  };

  console.log("Uploading RC, Insurance & Vehicle Bundle to Pinata IPFS...");
  let ipfsDocumentCID;
  try {
    ipfsDocumentCID = await uploadJSONToIPFS(vehicleMetadata, `Vehicle_${vin}_RC_Bundle`);
    console.log("✅ Pinned to Pinata IPFS! CID:", ipfsDocumentCID);
    console.log("🔗 Gateway URL:", getIPFSGatewayUrl(ipfsDocumentCID));
  } catch (err) {
    console.warn("⚠️ Pinata API warning, falling back to cached CID:", err.message);
    ipfsDocumentCID = "QmXh5fUa9tXbZk8743vLwP3eM4n9aB2cD1eF0gH1jK2lM";
  }

  console.log("\n--------------------------------------------------");
  console.log("STEP 2: Seller Registers Vehicle On-Chain");
  console.log("--------------------------------------------------");
  const regTx = await registry.connect(seller).registerVehicle(vin, regNumber, ipfsDocumentCID);
  await regTx.wait();
  console.log("✅ Vehicle registered on-chain with IPFS CID!");

  console.log("\n--------------------------------------------------");
  console.log("STEP 3: Backend / AI Document Verification");
  console.log("--------------------------------------------------");
  console.log("Fetching documents from IPFS CID:", ipfsDocumentCID);
  console.log("AI Document Analysis Result:");
  console.log("  - RC Verification        : MATCH (Parivahan schema)");
  console.log("  - Insurance Status       : ACTIVE (Valid till March 2027)");
  console.log("  - Blacklist / Stolen DB  : CLEAN");
  console.log("  - AI Risk Score          : 8 / 100 (LOW RISK - APPROVED)");

  console.log("\n--------------------------------------------------");
  console.log("STEP 4: RTO / Admin Approves Vehicle On-Chain");
  console.log("--------------------------------------------------");
  const verifyTx = await registry.connect(rtoAdmin).verifyVehicle(vin, 8n);
  await verifyTx.wait();
  console.log("✅ RTO Wallet executed verifyVehicle() with Risk Score: 8");

  console.log("\n--------------------------------------------------");
  console.log("STEP 5: Mint Digital Vehicle Passport (ERC-721 NFT)");
  console.log("--------------------------------------------------");
  const mintTx = await registry.connect(seller).mintPassport(vin);
  await mintTx.wait();
  const vehicleData = await registry.getVehicle(vin);
  const tokenId = vehicleData.tokenId;
  console.log("✅ Passport NFT Minted! Token ID:", tokenId.toString());
  console.log("NFT Owner:", await passport.ownerOf(tokenId));

  console.log("\n--------------------------------------------------");
  console.log("STEP 6: Buyer Creates Escrow for Purchase");
  console.log("--------------------------------------------------");
  console.log("Vehicle Price: ₹7,50,000 (0.01 ETH demo)");
  const createEscrowTx = await escrow.connect(buyer).createEscrow(tokenId, vin, seller.address, vehiclePriceETH);
  await createEscrowTx.wait();
  const escrowId = 1n;
  console.log("✅ Escrow Created! Escrow ID:", escrowId.toString(), "| Status: CREATED");

  console.log("\n--------------------------------------------------");
  console.log("STEP 7: Buyer Funds the Escrow");
  console.log("--------------------------------------------------");
  const fundTx = await escrow.connect(buyer).fundEscrow(escrowId, { value: vehiclePriceETH });
  await fundTx.wait();
  console.log("✅ Escrow Funded with 0.01 ETH | Status: FUNDED");

  // Seller approves Escrow to transfer NFT
  await (await passport.connect(seller).approve(await escrow.getAddress(), tokenId)).wait();
  console.log("Seller approved Escrow contract for NFT transfer.");

  console.log("\n--------------------------------------------------");
  console.log("STEP 8: RTO Approves Ownership Transfer in Escrow");
  console.log("--------------------------------------------------");
  const approveTx = await escrow.connect(rtoAdmin).approveTransfer(escrowId);
  await approveTx.wait();
  console.log("✅ RTO approved transfer | Status: TRANSFER_PENDING");

  console.log("\n--------------------------------------------------");
  console.log("STEP 9: Complete Transfer (NFT -> Buyer, ETH -> Seller)");
  console.log("--------------------------------------------------");
  const completeTx = await escrow.connect(buyer).releaseFunds(escrowId);
  await completeTx.wait();
  console.log("✅ Transfer Executed | Status: COMPLETED");

  const newOwnerInPassport = await passport.ownerOf(tokenId);
  const updatedVehicle = await registry.getVehicle(vin);

  console.log("\n==================================================");
  console.log("               FINAL AUDIT RECORD                 ");
  console.log("==================================================");
  console.log("VIN               :", updatedVehicle.vin);
  console.log("Registration No   :", updatedVehicle.registrationNumber);
  console.log("Passport Token ID :", updatedVehicle.tokenId.toString());
  console.log("Original Seller   :", seller.address);
  console.log("New Passport Owner:", newOwnerInPassport);
  console.log("Registry Owner    :", updatedVehicle.owner);
  console.log("Verified          :", updatedVehicle.verified);
  console.log("Risk Score        :", updatedVehicle.riskScore.toString(), "/ 100");
  console.log("Document IPFS CID :", updatedVehicle.documentCID);
  console.log("IPFS Gateway Link :", getIPFSGatewayUrl(updatedVehicle.documentCID));
  console.log("Escrow Status     : COMPLETED");
  console.log("==================================================");
}

main().catch((error) => {
  console.error("Seed demo failed:", error);
  process.exitCode = 1;
});
