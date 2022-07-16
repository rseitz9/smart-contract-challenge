const AirVault = artifacts.require("AirVault");
const fud = artifacts.require("FUDToken");
const erc20 = artifacts.require("ERC20PresetFixedSupply");
const truffleAssert = require("truffle-assertions");

contract("AirVault", (accounts) => {
  let FUDTokenInstance;
  let AirVaultInstance;
  let otherTokenInstance;
  let depositTransaction;
  let FUDSymbol = "FUD";
  let otherSymbol = "M20";

  beforeEach(async () => {
    FUDTokenInstance = await fud.new();
    AirVaultInstance = await AirVault.new(FUDTokenInstance.address);
    otherTokenInstance = await erc20.new(
      "Mock ERC20",
      "M20",
      100000000,
      accounts[0]
    );

    AirVaultInstance.allowToken(FUDSymbol, FUDTokenInstance.address);

    //transfer 5000 from minter to account
    await FUDTokenInstance.transfer(accounts[1], 5000, {
      from: accounts[0],
    });
    await otherTokenInstance.transfer(accounts[1], 5000, {
      from: accounts[0],
    });
  });

  it("Should allow depositing tokens", async () => {
    await FUDTokenInstance.approve(AirVaultInstance.address, 1000, {
      from: accounts[1],
    });
    await AirVaultInstance.deposit(FUDSymbol, 1000, { from: accounts[1] });

    const vaultBalance = await AirVaultInstance.lockedBalanceOf(
      FUDSymbol,
      accounts[1]
    );
    const fudBalance = await FUDTokenInstance.balanceOf(accounts[1]);
    expect(vaultBalance.toString()).to.equal("1000");
    expect(fudBalance.toString()).to.equal("4000");
  });

  it("Should emit event when depositing tokens", async () => {
    await FUDTokenInstance.approve(AirVaultInstance.address, 1000, {
      from: accounts[1],
    });
    transaction = await AirVaultInstance.deposit("FUD", 1000, {
      from: accounts[1],
    });

    truffleAssert.eventEmitted(transaction, "Deposit", (ev) => {
      return (
        ev.from === accounts[1] &&
        ev.amount.toString() === "1000" &&
        ev.symbol === FUDSymbol &&
        ev.totalLocked.toString() === "1000"
      );
    });
  });

  it("Should allow withdrawing tokens", async () => {
    await FUDTokenInstance.approve(AirVaultInstance.address, 1000, {
      from: accounts[1],
    });
    const transaction = await AirVaultInstance.deposit(FUDSymbol, 1000, {
      from: accounts[1],
    });

    const withdrawTransaction = await AirVaultInstance.withdraw(
      FUDSymbol,
      500,
      {
        from: accounts[1],
      }
    );

    const vaultBalance = await AirVaultInstance.lockedBalanceOf(
      FUDSymbol,
      accounts[1]
    );
    const fudBalance = await FUDTokenInstance.balanceOf(accounts[1]);

    expect(vaultBalance.toString()).to.equal("500");
    expect(fudBalance.toString()).to.equal("4500");
  });

  it("Should emit an event when withdrawing tokens", async () => {
    await FUDTokenInstance.approve(AirVaultInstance.address, 1000, {
      from: accounts[1],
    });
    const transaction = await AirVaultInstance.deposit(FUDSymbol, 1000, {
      from: accounts[1],
    });

    const withdrawTransaction = await AirVaultInstance.withdraw(
      FUDSymbol,
      500,
      {
        from: accounts[1],
      }
    );

    truffleAssert.eventEmitted(withdrawTransaction, "Withdraw", (ev) => {
      return (
        ev.to === accounts[1] &&
        ev.amount.toString() === "500" &&
        ev.symbol === FUDSymbol
      );
    });
  });

  it("Should not allow withdrawing more than you deposited", async () => {
    await FUDTokenInstance.approve(AirVaultInstance.address, 1000, {
      from: accounts[1],
    });
    const transaction = await AirVaultInstance.deposit(FUDSymbol, 1000, {
      from: accounts[1],
    });
    let error;
    try {
      await AirVaultInstance.withdraw(FUDSymbol, 5000, {
        from: accounts[1],
      });
    } catch (e) {
      error = e;
    }

    expect(error).to.exist;
    expect(error.message).to.include("Insufficient Funds");
  });

  it("Should not allow depositing tokens that are not allowed", async () => {
    let error;
    try {
      //deposit other
      await AirVaultInstance.deposit(otherTokenInstance.symbol, 10, {
        from: accounts[1],
      });
    } catch (e) {
      error = e;
    }

    expect(error).to.exist;
    expect(error.message).to.include("Token Not Allowed");
  });

  it("Should not allow withdrawing tokens you have not deposited", async () => {
    await AirVaultInstance.allowToken(otherSymbol, otherTokenInstance.address);

    await FUDTokenInstance.approve(AirVaultInstance.address, 1000, {
      from: accounts[1],
    });

    await otherTokenInstance.approve(AirVaultInstance.address, 1000, {
      from: accounts[1],
    });

    //deposit fud
    await AirVaultInstance.deposit(FUDSymbol, 1000, {
      from: accounts[1],
    });
    //deposit other
    await AirVaultInstance.deposit(otherSymbol, 10, {
      from: accounts[1],
    });

    let error;
    try {
      await AirVaultInstance.withdraw(otherSymbol, 1000, {
        from: accounts[1],
      });
    } catch (e) {
      error = e;
    }

    expect(error).to.exist;
    expect(error.message).to.include("Insufficient Funds");
  });
});
