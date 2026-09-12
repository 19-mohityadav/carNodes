import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CarNodesModule", (m) => {
  const passport = m.contract("VehiclePassport");
  const registry = m.contract("VehicleRegistry", [passport]);
  const escrow = m.contract("VehicleEscrow", [passport, registry]);
  const mockINR = m.contract("MockINR");

  m.call(passport, "setRegistry", [registry]);
  m.call(registry, "setEscrowContract", [escrow]);

  return { passport, registry, escrow, mockINR };
});
