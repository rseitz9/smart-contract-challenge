// Contracts
const FUDToken = artifacts.require("FUDToken");
const WINToken = artifacts.require("WINToken");
const AirVault = artifacts.require("AirVault");
module.exports = async function (callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const FudContract = await FUDToken.deployed();
    const FUDSymbol = await FudContract.symbol();
    const WinContract = await WINToken.deployed();
    const AirVaultContract = await AirVault.deployed();
    const FudTokenMinter = accounts[0];

    await FudContract.transfer(accounts[1], 10000, {
      from: FudTokenMinter,
    });

    await FudContract.approve(AirVaultContract.address, 5000, {
      from: accounts[1],
    });

    await AirVaultContract.deposit(FUDSymbol, 1000, { from: accounts[1] });
    await AirVaultContract.withdraw(FUDSymbol, 250, { from: accounts[1] });
    await AirVaultContract.deposit(FUDSymbol, 250, { from: accounts[1] });
    await AirVaultContract.withdraw(FUDSymbol, 250, { from: accounts[1] });
    await AirVaultContract.deposit(FUDSymbol, 1000, { from: accounts[1] });

    await FudContract.transfer(accounts[2], 1000, {
      from: FudTokenMinter,
    });
    await FudContract.approve(AirVaultContract.address, 1000, {
      from: accounts[2],
    });
    await AirVaultContract.deposit(FUDSymbol, 1000, { from: accounts[2] });

    await FudContract.transfer(accounts[3], 1000, {
      from: FudTokenMinter,
    });
    await FudContract.approve(AirVaultContract.address, 500, {
      from: accounts[3],
    });
    await AirVaultContract.deposit(FUDSymbol, 500, { from: accounts[3] });
    console.log(
      `account ${
        accounts[1]
      } has final balance of ${await AirVaultContract.lockedBalanceOf(
        FUDSymbol,
        accounts[1]
      )}`
    );
    console.log(
      `account ${
        accounts[2]
      } has final balance of ${await AirVaultContract.lockedBalanceOf(
        FUDSymbol,
        accounts[2]
      )}`
    );
    console.log(
      `account ${
        accounts[3]
      } has final balance of ${await AirVaultContract.lockedBalanceOf(
        FUDSymbol,
        accounts[3]
      )}`
    );
  } catch (error) {
    console.error(error);
  }

  callback();
};
