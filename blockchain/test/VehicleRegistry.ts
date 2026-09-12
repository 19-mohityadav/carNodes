import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("VehicleRegistry (Authority & Lifecycle Layer)", function () {
  let passport: any;
  let registry: any;
  let admin: any;
  let verifierRTO: any;
  let seller: any;
  let buyer: any;
  let unauthorized: any;

  const vin = "VIN-TATA-NEXON-2025-DL";
  const regNumber = "DL-01-XY-9999";
  const documentCID = "QmXDocumentEvidenceCID123456";

  beforeEach(async function () {
    [admin, verifierRTO, seller, buyer, unauthorized] = await ethers.getSigners();

    passport = await ethers.deployContract("VehiclePassport");
    registry = await ethers.deployContract("VehicleRegistry", [
      await passport.getAddress(),
    ]);

    // Link registry in passport so registry can mint
    await passport.setRegistry(await registry.getAddress());

    // Add verifier role to verifierRTO
    await registry.addVerifier(verifierRTO.address);
  });

  it("Should register a vehicle and reject duplicate registration", async function () {
    const vinHash = ethers.keccak256(ethers.toUtf8Bytes(vin));

    await expect(
      registry.connect(seller).registerVehicle(vin, regNumber, documentCID)
    )
      .to.emit(registry, "VehicleRegistered")
      .withArgs(vin, vinHash, seller.address, regNumber, documentCID, (ts: bigint) => ts > 0n);

    const vehicle = await registry.getVehicle(vin);
    expect(vehicle.vin).to.equal(vin);
    expect(vehicle.vinHash).to.equal(vinHash);
    expect(vehicle.status).to.equal(0); // VehicleStatus.Pending

    // Attempt duplicate registration
    await expect(
      registry.connect(seller).registerVehicle(vin, regNumber, documentCID)
    ).to.be.revertedWith("VIN already registered");
  });

  it("Should allow authorized verifier to approve and reject vehicles", async function () {
    await registry.connect(seller).registerVehicle(vin, regNumber, documentCID);

    // Unauthorized cannot approve
    await expect(
      registry.connect(unauthorized).approveVehicle(vin, 12)
    ).to.be.revertedWith("Only authorized verifier or admin");

    // Authorized verifier approves
    await expect(registry.connect(verifierRTO).approveVehicle(vin, 12))
      .to.emit(registry, "VehicleVerified");

    let status = await registry.getVehicleStatus(vin);
    expect(status).to.equal(1); // Verified

    // Register another vehicle to test rejection
    const vin2 = "VIN-REJECT-TEST-001";
    await registry.connect(seller).registerVehicle(vin2, "DL-02-REJECT", "QmBadDoc");
    await expect(
      registry.connect(verifierRTO).rejectVehicle(vin2, "Odometer rollback detected")
    )
      .to.emit(registry, "VehicleRejected");

    status = await registry.getVehicleStatus(vin2);
    expect(status).to.equal(2); // Rejected
  });

  it("Should allow listing only after verification", async function () {
    await registry.connect(seller).registerVehicle(vin, regNumber, documentCID);

    // Cannot list when pending
    await expect(
      registry.connect(seller).setVehicleListed(vin, true)
    ).to.be.revertedWith("Only verified vehicles can be listed");

    // Approve vehicle
    await registry.connect(verifierRTO).approveVehicle(vin, 10);

    // Now seller can list
    await registry.connect(seller).setVehicleListed(vin, true);
    expect(await registry.getVehicleStatus(vin)).to.equal(3); // Listed
  });

  it("Should mint passport NFT upon verification and handle ownership transfer request", async function () {
    await registry.connect(seller).registerVehicle(vin, regNumber, documentCID);
    await registry.connect(verifierRTO).approveVehicle(vin, 10);

    // Mint passport
    const tx = await registry.connect(seller).mintPassport(vin);
    await tx.wait();

    const vehicle = await registry.getVehicle(vin);
    expect(vehicle.tokenId).to.equal(1n);
    expect(await passport.ownerOf(1n)).to.equal(seller.address);

    // Request ownership transfer
    await expect(
      registry.connect(seller).requestOwnershipTransfer(vin, buyer.address)
    )
      .to.emit(registry, "OwnershipTransferRequested")
      .withArgs(1n, seller.address, buyer.address, (ts: bigint) => ts > 0n);

    // Authority approves ownership transfer
    await expect(
      registry.connect(verifierRTO).approveOwnershipTransfer(vin)
    )
      .to.emit(registry, "OwnershipTransferred")
      .withArgs(1n, seller.address, buyer.address, (ts: bigint) => ts > 0n);

    const updated = await registry.getVehicle(vin);
    expect(updated.owner).to.equal(buyer.address);
  });
});
