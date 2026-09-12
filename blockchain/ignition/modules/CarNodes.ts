import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CarNodesModule", (m) => {
  const passport = m.contract("VehiclePassport");
  const registry = m.contract("VehicleRegistry", [passport]);

  return { passport, registry };
});
