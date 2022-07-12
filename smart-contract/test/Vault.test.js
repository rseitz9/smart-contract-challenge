const Vault = artifacts.require("Vault");
const fud = artifacts.require("FUDToken");
const truffleAssert = require("truffle-assertions");

contract("Vault", (accounts) => {
  let FUDTokenInstance;
  let VaultInstance;
  let depositTransaction;

  beforeEach(async () => {
    FUDTokenInstance = await fud.new();
    VaultInstance = await Vault.new(FUDTokenInstance.address);

    //transfer 5000 from minter to account
    await FUDTokenInstance.transfer(accounts[1], 5000, {
      from: accounts[0],
    });
  });

  // it("Should only allow mint to be called by the minter", async () => {
  //   const FUDTokenInstance = await fud.deployed();
  //   const aa = await Vault.deployed();
  //   console.log(await fud.address);
  //   console.log(await aa.fudtokenaddress());
  // });

  it("Should allow depositing tokens", async () => {
    await FUDTokenInstance.approve(VaultInstance.address, 1000, {
      from: accounts[1],
    });
    await VaultInstance.deposit(1000, { from: accounts[1] });

    const vaultBalance = await VaultInstance.lockedBalanceOf(accounts[1]);
    const fudBalance = await FUDTokenInstance.balanceOf(accounts[1]);
    assert.equal(vaultBalance.toString(), 1000);
    assert.equal(fudBalance.toString(), 4000);
  });

  it("Should emit event when depositing tokens", async () => {
    await FUDTokenInstance.approve(VaultInstance.address, 1000, {
      from: accounts[1],
    });
    transaction = await VaultInstance.deposit(1000, { from: accounts[1] });

    truffleAssert.eventEmitted(transaction, "Deposit", (ev) => {
      return ev.from === accounts[1] && ev.amount.toString() === "1000";
    });
  });

  it("Should allow withdrawing tokens", async () => {
    await FUDTokenInstance.approve(VaultInstance.address, 1000, {
      from: accounts[1],
    });
    const transaction = await VaultInstance.deposit(1000, {
      from: accounts[1],
    });

    const withdrawTransaction = await VaultInstance.withdraw(500, {
      from: accounts[1],
    });

    const vaultBalance = await VaultInstance.lockedBalanceOf(accounts[1]);
    const fudBalance = await FUDTokenInstance.balanceOf(accounts[1]);

    assert.equal(vaultBalance.toString(), 500);
    assert.equal(fudBalance.toString(), 4500);
  });

  it("Should emit an event when withdrawing tokens", async () => {
    await FUDTokenInstance.approve(VaultInstance.address, 1000, {
      from: accounts[1],
    });
    const transaction = await VaultInstance.deposit(1000, {
      from: accounts[1],
    });

    const withdrawTransaction = await VaultInstance.withdraw(500, {
      from: accounts[1],
    });

    truffleAssert.eventEmitted(withdrawTransaction, "Withdraw", (ev) => {
      return ev.to === accounts[1] && ev.amount.toString() === "500";
    });
  });

  it("Should not allow withdrawing more than you deposited", async () => {
    await FUDTokenInstance.approve(VaultInstance.address, 1000, {
      from: accounts[1],
    });
    const transaction = await VaultInstance.deposit(1000, {
      from: accounts[1],
    });
    let error;
    try {
      await VaultInstance.withdraw(5000, {
        from: accounts[1],
      });
    } catch (e) {
      error = e;
    }

    assert(error);
    assert(error.message.includes("Insufficient funds"));
  });
});
