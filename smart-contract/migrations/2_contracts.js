const FUDToken = artifacts.require("FUDToken");
const WINToken = artifacts.require("WINToken");
const AirVault = artifacts.require("AirVault");

module.exports = function (deployer) {
  deployer.deploy(FUDToken);
  deployer.deploy(WINToken);
  deployer.deploy(AirVault);
};
