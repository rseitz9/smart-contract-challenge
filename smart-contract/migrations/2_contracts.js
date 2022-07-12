const FUDToken = artifacts.require("FUDToken");
const WINToken = artifacts.require("WINToken");
const Vault = artifacts.require("Vault");

module.exports = function (deployer) {
  deployer.deploy(FUDToken).then(() => {
    return deployer.deploy(Vault, FUDToken.address);
  });
  deployer.deploy(WINToken);
};
