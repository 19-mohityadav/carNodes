import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("VehicleRegistry Verification Workflow", function () {
  let passport: any;
  let registry: any;
  let rtoAdmin: any;
  let seller: any;
  let unauthorizedUser: any;

  beforeEach(async function () {
    [rtoAdmin, seller, unauthorizedUser] = await ethers.getSigners();

    passport = await ethers.deployContract("VehiclePassport");
    registry = await ethers.deployContract("VehicleRegistry", [
      await passport.getAddress(),
    ]);
  });

  it("Should complete the full vehicle verification and passport minting workflow", async function () {
    const vin = "VIN-WBABV12345XYZ";
    const regNumber = "DL-01-AB-1234";
    const documentCID = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";

    // Step 1: Seller submits vehicle
    await expect(
      registry.connect(seller).registerVehicle(vin, regNumber, documentCID)
    )
      .to.emit(registry, "VehicleSubmitted")
      .withArgs(vin, regNumber, seller.address, documentCID, (ts: bigint) => ts > 0n);

    let vehicle = await registry.getVehicle(vin);
    expect(vehicle.vin).to.equal(vin);
    expect(vehicle.registrationNumber).to.equal(regNumber);
    expect(vehicle.documentCID).to.equal(documentCID);
    expect(vehicle.owner).to.equal(seller.address);
    expect(vehicle.verified).to.equal(false);
    expect(vehicle.riskScore).to.equal(0n);
    expect(vehicle.tokenId).to.equal(0n);

    // Step 2 & 3: RTO/admin verifies vehicle with AI risk score (e.g., 12 / 100)
    const riskScore = 12n;
    await expect(
      registry.connect(unauthorizedUser).verifyVehicle(vin, riskScore)
    ).to.be.revertedWith("Only RTO/admin authorized");

    await expect(
      registry.connect(rtoAdmin).verifyVehicle(vin, riskScore)
    )
      .to.emit(registry, "VehicleVerified")
      .withArgs(vin, riskScore, rtoAdmin.address, (ts: bigint) => ts > 0n);

    // Step 4: Smart contract records verified = true & riskScore
    vehicle = await registry.getVehicle(vin);
    expect(vehicle.verified).to.equal(true);
    expect(vehicle.riskScore).to.equal(riskScore);

    // Step 5: Mint passport NFT
    await expect(
      registry.connect(seller).mintPassport(vin)
    )
      .to.emit(registry, "PassportMinted")
      .withArgs(vin, 1n, seller.address, (ts: bigint) => ts > 0n);

    vehicle = await registry.getVehicle(vin);
    expect(vehicle.tokenId).to.equal(1n);

    // Verify ERC721 ownership and metadata stored in Passport contract
    expect(await passport.ownerOf(1n)).to.equal(seller.address);
    const passportRecord = await passport.vehicles(1n);
    expect(passportRecord.vehicleId).to.equal(vin);
    expect(passportRecord.documentCID).to.equal(documentCID);
    expect(passportRecord.verified).to.equal(true);
    expect(passportRecord.riskScore).to.equal(riskScore);
  });

  it("Should prevent minting passport before verification", async function () {
    const vin = "VIN-TEST-UNVERIFIED";
    await registry.connect(seller).registerVehicle(vin, "MH-02-CD-5678", "ipfs://test");

    await expect(
      registry.connect(seller).mintPassport(vin)
    ).to.be.revertedWith("Vehicle not verified");
  });
});
