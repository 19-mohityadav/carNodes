import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("VehiclePassport (Digital Vehicle Identity & History)", function () {
  let passport: any;
  let owner: any;
  let recipient: any;
  let unauthorized: any;

  const vin = "HONDA-CITY-123456";
  const vinHash = ethers.keccak256(ethers.toUtf8Bytes(vin));
  const metadataCID = "QmXMetadataBundleCID123456789";

  beforeEach(async function () {
    [owner, recipient, unauthorized] = await ethers.getSigners();
    passport = await ethers.deployContract("VehiclePassport");
  });

  it("Should mint a vehicle passport and retrieve details", async function () {
    await passport.mintPassport(recipient.address, vinHash, metadataCID, owner.address, 15);

    expect(await passport.ownerOf(1n)).to.equal(recipient.address);

    const vehicle = await passport.getVehicle(1n);
    expect(vehicle.vehicleId).to.equal(1n);
    expect(vehicle.vinHash).to.equal(vinHash);
    expect(vehicle.metadataCID).to.equal(metadataCID);
    expect(vehicle.owner).to.equal(recipient.address);
    expect(vehicle.verifier).to.equal(owner.address);
    expect(vehicle.riskScore).to.equal(15);
    expect(vehicle.verified).to.equal(true);

    // Verify tokenURI
    expect(await passport.tokenURI(1n)).to.equal(`ipfs://${metadataCID}`);
  });

  it("Should reject duplicate passport for the same VIN hash", async function () {
    await passport.mintPassport(recipient.address, vinHash, metadataCID, owner.address, 15);

    await expect(
      passport.mintPassport(recipient.address, vinHash, "QmAnotherCID", owner.address, 20)
    ).to.be.revertedWith("Passport already exists for this VIN");
  });

  it("Should allow adding evidence to passport", async function () {
    await passport.mintPassport(recipient.address, vinHash, metadataCID, owner.address, 15);

    const inspectionCID = "QmInspectionReportCID987654";
    await expect(passport.connect(recipient).addEvidence(1n, inspectionCID))
      .to.emit(passport, "EvidenceAdded")
      .withArgs(1n, inspectionCID, recipient.address, (ts: bigint) => ts > 0n);
  });

  it("Should allow verifier to update risk score", async function () {
    await passport.mintPassport(recipient.address, vinHash, metadataCID, owner.address, 15);

    await expect(passport.connect(owner).updateRiskScore(1n, 8))
      .to.emit(passport, "RiskScoreUpdated")
      .withArgs(1n, 15, 8, (ts: bigint) => ts > 0n);

    const vehicle = await passport.getVehicle(1n);
    expect(vehicle.riskScore).to.equal(8);
  });
});
