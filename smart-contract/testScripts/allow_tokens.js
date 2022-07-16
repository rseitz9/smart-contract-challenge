// Contracts
const FUDToken = artifacts.require("FUDToken");
const WINToken = artifacts.require("WINToken");
const AirVault = artifacts.require("AirVault");
module.exports = async function (callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const FudContract = await FUDToken.deployed();
    const AirVaultContract = await AirVault.deployed();

    await AirVaultContract.allowToken(
      await FudContract.symbol(),
      FudContract.address,
      {
        from: accounts[0],
      }
    );
  } catch (error) {
    console.error(error);
  }

  callback();
};
