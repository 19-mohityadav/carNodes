import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("VehicleEscrow (Financial Settlement & Multi-Token Escrow)", function () {
  let passport: any;
  let registry: any;
  let escrow: any;
  let mockINR: any;
  let rtoAdmin: any;
  let seller: any;
  let buyer: any;

  const vin = "HONDA-CITY-2025-ESCROW";
  const regNumber = "DL-01-AB-7890";
  const documentCID = "QmXRCInsuranceBundleCID123456789";
  const ethPrice = ethers.parseEther("0.01");
  const inrPrice = ethers.parseEther("750000"); // 750,000 mINR (₹7,50,000)

  beforeEach(async function () {
    [rtoAdmin, seller, buyer] = await ethers.getSigners();

    passport = await ethers.deployContract("VehiclePassport");
    registry = await ethers.deployContract("VehicleRegistry", [
      await passport.getAddress(),
    ]);
    escrow = await ethers.deployContract("VehicleEscrow", [
      await passport.getAddress(),
      await registry.getAddress(),
    ]);
    mockINR = await ethers.deployContract("MockINR");

    // Link registry & escrow
    await passport.setRegistry(await registry.getAddress());
    await registry.setEscrowContract(await escrow.getAddress());

    // Setup vehicle, verify & mint passport to seller
    await registry.connect(seller).registerVehicle(vin, regNumber, documentCID);
    await registry.connect(rtoAdmin).approveVehicle(vin, 8);
    await registry.connect(seller).mintPassport(vin);

    // Give buyer 1,000,000 mINR and approve escrow
    await mockINR.mint(buyer.address, ethers.parseEther("1000000"));
    await mockINR.connect(buyer).approve(await escrow.getAddress(), ethers.parseEther("1000000"));
  });

  it("Should complete escrow purchase using native ETH", async function () {
    const tokenId = 1n;

    // 1. Create Escrow
    const createTx = await escrow.connect(buyer).createEscrow(tokenId, vin, seller.address, ethPrice);
    await createTx.wait();
    const escrowId = 1n;

    // 2. Fund Escrow
    await escrow.connect(buyer).fundEscrow(escrowId, { value: ethPrice });
    let record = await escrow.getEscrow(escrowId);
    expect(record.status).to.equal(1); // Funded

    // 3. Seller approves Escrow to transfer NFT
    await passport.connect(seller).approve(await escrow.getAddress(), tokenId);

    // 4. RTO approves transfer
    await escrow.connect(rtoAdmin).approveTransfer(escrowId);
    record = await escrow.getEscrow(escrowId);
    expect(record.status).to.equal(2); // TransferPending

    // 5. Release funds (Atomic swap: NFT -> buyer, ETH -> seller)
    const initialSellerBalance = await ethers.provider.getBalance(seller.address);
    await escrow.connect(buyer).releaseFunds(escrowId);

    expect(await passport.ownerOf(tokenId)).to.equal(buyer.address);
    const vehicle = await registry.getVehicle(vin);
    expect(vehicle.owner).to.equal(buyer.address);

    const finalSellerBalance = await ethers.provider.getBalance(seller.address);
    expect(finalSellerBalance).to.equal(initialSellerBalance + ethPrice);
  });

  it("Should complete escrow purchase using MockINR (mINR) ERC-20 token", async function () {
    const tokenId = 1n;

    // 1. Create Escrow specifying MockINR token
    const createTx = await escrow
      .connect(buyer)
      .createTokenEscrow(tokenId, vin, seller.address, await mockINR.getAddress(), inrPrice);
    await createTx.wait();
    const escrowId = 1n;

    // 2. Fund Escrow with MockINR
    await escrow.connect(buyer).fundEscrow(escrowId);
    let record = await escrow.getEscrow(escrowId);
    expect(record.status).to.equal(1); // Funded
    expect(await mockINR.balanceOf(await escrow.getAddress())).to.equal(inrPrice);

    // 3. Seller approves Escrow for NFT
    await passport.connect(seller).approve(await escrow.getAddress(), tokenId);

    // 4. RTO approves transfer
    await escrow.connect(rtoAdmin).approveTransfer(escrowId);

    // 5. Release funds (Atomic swap: NFT -> buyer, MockINR -> seller)
    const initialSellerTokens = await mockINR.balanceOf(seller.address);
    await escrow.connect(buyer).releaseFunds(escrowId);

    expect(await passport.ownerOf(tokenId)).to.equal(buyer.address);
    const finalSellerTokens = await mockINR.balanceOf(seller.address);
    expect(finalSellerTokens).to.equal(initialSellerTokens + inrPrice);
  });

  it("Should allow refund to buyer when escrow is cancelled", async function () {
    const tokenId = 1n;
    await escrow
      .connect(buyer)
      .createTokenEscrow(tokenId, vin, seller.address, await mockINR.getAddress(), inrPrice);
    await escrow.connect(buyer).fundEscrow(1n);

    const initialBuyerTokens = await mockINR.balanceOf(buyer.address);

    // Buyer cancels and gets refund
    await escrow.connect(buyer).refund(1n);

    const finalBuyerTokens = await mockINR.balanceOf(buyer.address);
    expect(finalBuyerTokens).to.equal(initialBuyerTokens + inrPrice);

    const record = await escrow.getEscrow(1n);
    expect(record.status).to.equal(4); // Refunded
  });
});
