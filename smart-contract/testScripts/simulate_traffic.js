// Contracts
const FUDToken = artifacts.require("FUDToken");
module.exports = async function (callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const FudContract = await FUDToken.deployed();
    const FudTokenMinter = accounts[0];
    while (true) {
      let accountFromIndex = getRandomInt(1, 9);
      let accountToIndex = getRandomInt(1, 9);
      while (accountToIndex === accountFromIndex) {
        accountToIndex = getRandomInt(1, 9);
      }
      let balanceOfFrom = await FudContract.balanceOf(
        accounts[accountFromIndex]
      );
      let transferAmount = web3.utils.toBN(Math.floor(0.05 * balanceOfFrom));
      //transfer 5% of balance from one random account to another
      await FudContract.transfer(accounts[accountToIndex], transferAmount, {
        from: accounts[accountFromIndex],
      });
      console.log(
        `transferred ${transferAmount} from ${accountFromIndex} to ${accountToIndex}`
      );
      //wait
      await new Promise((r) => setTimeout(r, 500));
    }
  } catch (error) {
    console.error(error);
  }

  callback();
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
