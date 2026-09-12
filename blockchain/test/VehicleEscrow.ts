import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("VehicleEscrow End-to-End Workflow", function () {
  let passport: any;
  let registry: any;
  let escrow: any;
  let mockINR: any;
  let rtoAdmin: any;
  let seller: any;
  let buyer: any;

  const vin = "HONDA-CITY-2024-DELHI";
  const regNumber = "DL-01-AB-7890";
  const documentCID = "QmXRCInsuranceBundleCID123456789";
  const purchasePrice = ethers.parseEther("0.01"); // Demo testnet ETH equivalent of ₹7,50,000

  beforeEach(async function () {
    [rtoAdmin, seller, buyer] = await ethers.getSigners();

    // 1. Deploy Passport
    passport = await ethers.deployContract("VehiclePassport");

    // 2. Deploy Registry
    registry = await ethers.deployContract("VehicleRegistry", [
      await passport.getAddress(),
    ]);

    // 3. Deploy Escrow
    escrow = await ethers.deployContract("VehicleEscrow", [
      await passport.getAddress(),
      await registry.getAddress(),
    ]);

    // 4. Link Escrow to Registry so Escrow can update ownership on-chain
    await registry.setEscrowContract(await escrow.getAddress());

    // 5. Deploy MockINR
    mockINR = await ethers.deployContract("MockINR");
  });

  it("Should complete the full purchase flow: List -> Verify -> Escrow -> RTO Approval -> Ownership Transfer -> Payment", async function () {
    // --- Step 1: Seller submits vehicle ---
    await registry
      .connect(seller)
      .registerVehicle(vin, regNumber, documentCID);

    // --- Step 2 & 3: RTO verifies vehicle with AI risk score ---
    await registry.connect(rtoAdmin).verifyVehicle(vin, 8n); // Low risk score: 8/100

    // --- Step 4: Mint Passport NFT to Seller ---
    await registry.connect(seller).mintPassport(vin);
    const tokenId = 1n;
    expect(await passport.ownerOf(tokenId)).to.equal(seller.address);

    // --- Step 5: Buyer creates Escrow ---
    const tx = await escrow
      .connect(buyer)
      .createEscrow(tokenId, vin, seller.address, purchasePrice);
    const receipt = await tx.wait();
    const escrowId = 1n;

    let escrowRecord = await escrow.getEscrow(escrowId);
    expect(escrowRecord.status).to.equal(0); // Status.Created
    expect(escrowRecord.buyer).to.equal(buyer.address);
    expect(escrowRecord.seller).to.equal(seller.address);

    // --- Step 6: Buyer funds Escrow ---
    await escrow.connect(buyer).fundEscrow(escrowId, { value: purchasePrice });
    escrowRecord = await escrow.getEscrow(escrowId);
    expect(escrowRecord.status).to.equal(1); // Status.Funded

    // Seller approves Escrow contract to transfer the Passport NFT
    await passport.connect(seller).approve(await escrow.getAddress(), tokenId);

    // --- Step 7: RTO approves the ownership transfer ---
    await escrow.connect(rtoAdmin).approveTransfer(escrowId);
    escrowRecord = await escrow.getEscrow(escrowId);
    expect(escrowRecord.status).to.equal(2); // Status.TransferPending

    // --- Step 8: Complete transfer (Release funds to Seller, transfer NFT to Buyer) ---
    const initialSellerBalance = await ethers.provider.getBalance(seller.address);

    await escrow.connect(buyer).releaseFunds(escrowId);

    // Verify Escrow Completed
    escrowRecord = await escrow.getEscrow(escrowId);
    expect(escrowRecord.status).to.equal(3); // Status.Completed

    // Verify NFT ownership transferred to Buyer
    expect(await passport.ownerOf(tokenId)).to.equal(buyer.address);

    // Verify Vehicle Registry updated owner to Buyer
    const vehicleInRegistry = await registry.getVehicle(vin);
    expect(vehicleInRegistry.owner).to.equal(buyer.address);

    // Verify Seller received the escrow funds
    const finalSellerBalance = await ethers.provider.getBalance(seller.address);
    expect(finalSellerBalance).to.equal(initialSellerBalance + purchasePrice);
  });

  it("Should allow buyer to cancel and receive refund if not yet approved", async function () {
    // Setup verified vehicle & passport
    await registry.connect(seller).registerVehicle(vin, regNumber, documentCID);
    await registry.connect(rtoAdmin).verifyVehicle(vin, 5n);
    await registry.connect(seller).mintPassport(vin);

    const tokenId = 1n;
    await escrow.connect(buyer).createEscrow(tokenId, vin, seller.address, purchasePrice);
    await escrow.connect(buyer).fundEscrow(1n, { value: purchasePrice });

    const balanceBeforeCancel = await ethers.provider.getBalance(buyer.address);

    // Buyer cancels before RTO approval
    const cancelTx = await escrow.connect(buyer).cancelEscrow(1n);
    const cancelReceipt = await cancelTx.wait();
    const gasUsed = cancelReceipt.gasUsed * cancelReceipt.gasPrice;

    const balanceAfterCancel = await ethers.provider.getBalance(buyer.address);
    expect(balanceAfterCancel).to.equal(balanceBeforeCancel + purchasePrice - gasUsed);

    const escrowRecord = await escrow.getEscrow(1n);
    expect(escrowRecord.status).to.equal(4); // Status.Cancelled
  });
});
