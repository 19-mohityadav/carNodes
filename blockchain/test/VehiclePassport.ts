import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("VehiclePassport", function () {
  it("Should mint a vehicle passport and retrieve details", async function () {
    const [owner, recipient] = await ethers.getSigners();
    const passport = await ethers.deployContract("VehiclePassport");

    await passport.mintPassport(
      recipient.address,
      "VIN-123456",
      "QmHashExample123",
      15n
    );

    expect(await passport.ownerOf(1)).to.equal(recipient.address);

    const vehicle = await passport.vehicles(1);
    expect(vehicle.vehicleId).to.equal("VIN-123456");
    expect(vehicle.documentCID).to.equal("QmHashExample123");
    expect(vehicle.verified).to.equal(true);
    expect(vehicle.riskScore).to.equal(15n);
  });
});
