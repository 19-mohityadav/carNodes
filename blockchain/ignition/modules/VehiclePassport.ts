import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VehiclePassportModule", (m) => {
  const vehiclePassport = m.contract("VehiclePassport");

  return { vehiclePassport };
});
