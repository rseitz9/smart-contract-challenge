// Contracts
const FUDToken = artifacts.require("FUDToken");
module.exports = async function (callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const FudContract = await FUDToken.deployed();
    const FudTokenMinter = accounts[0];

    for (let i = 1; i < accounts.length; i++) {
      await FudContract.transfer(accounts[i], 5000, {
        from: FudTokenMinter,
      });
    }
  } catch (error) {
    console.error(error);
  }

  callback();
};
