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

    await FudContract.transfer(accounts[1], 10000, {
      from: FudTokenMinter,
    });

    await FudContract.approve(VaultContract.address, 5000, {
      from: accounts[1],
    });

    await VaultContract.deposit(1000, { from: accounts[1] });
    await VaultContract.withdraw(250, { from: accounts[1] });
    await VaultContract.deposit(250, { from: accounts[1] });
    await VaultContract.withdraw(250, { from: accounts[1] });
    await VaultContract.deposit(1000, { from: accounts[1] });

    await FudContract.transfer(accounts[2], 1000, {
      from: FudTokenMinter,
    });
    await FudContract.approve(VaultContract.address, 1000, {
      from: accounts[2],
    });
    await VaultContract.deposit(1000, { from: accounts[2] });

    await FudContract.transfer(accounts[3], 1000, {
      from: FudTokenMinter,
    });
    await FudContract.approve(VaultContract.address, 500, {
      from: accounts[3],
    });
    await VaultContract.deposit(500, { from: accounts[3] });
    console.log(
      `account ${
        accounts[1]
      } has final balance of ${await VaultContract.lockedBalanceOf(
        accounts[1]
      )}`
    );
    console.log(
      `account ${
        accounts[2]
      } has final balance of ${await VaultContract.lockedBalanceOf(
        accounts[2]
      )}`
    );
    console.log(
      `account ${
        accounts[3]
      } has final balance of ${await VaultContract.lockedBalanceOf(
        accounts[3]
      )}`
    );
  } catch (error) {
    console.error(error);
  }

  callback();
};
