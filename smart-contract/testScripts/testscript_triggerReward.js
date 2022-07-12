// Contracts
const FUDToken = artifacts.require("FUDToken");
const WINToken = artifacts.require("WINToken");
const Vault = artifacts.require("Vault");
module.exports = async function (callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const FudContract = await FUDToken.deployed();
    const WinContract = await WINToken.deployed();
    const VaultContract = await Vault.deployed();
    const FudTokenMinter = accounts[0];

    for (let i = 0; i < 10; i++) {
      await FudContract.transfer(accounts[4], 1, {
        from: FudTokenMinter,
      });
    }
  } catch (error) {
    console.error(error);
  }

  callback();
};
