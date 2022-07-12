const FUDToken = artifacts.require("FUDToken");
const truffleAssert = require("truffle-assertions");

contract("FUDToken", (accounts) => {
  it("Should log a Transfer event on creation", async () => {
    const FUDTokenInstance = await FUDToken.new();
    let txHash = FUDTokenInstance.transactionHash;
    let result = await truffleAssert.createTransactionResult(
      FUDTokenInstance,
      txHash
    );
    truffleAssert.eventEmitted(result, "Transfer");
  });

  it("Should send 1.5 million tokens to the creator", async () => {
    const FUDTokenInstance = await FUDToken.deployed();
    const balance = await FUDTokenInstance.balanceOf(accounts[0]);
    assert.equal(balance.valueOf(), 1500000);
  });

  it("Should set total supply to 1.5 million", async () => {
    const FUDTokenInstance = await FUDToken.deployed();
    const totalSupply = await FUDTokenInstance.totalSupply();
    assert.equal(totalSupply.valueOf(), 1500000);
  });

  it("Should transfer 500 to the second account", async () => {
    const FUDTokenInstance = await FUDToken.deployed();
    const transferResult = await FUDTokenInstance.transfer(accounts[1], 500, {
      from: accounts[0],
    });
    const balanceMinter = await FUDTokenInstance.balanceOf(accounts[0]);
    const balanceAcct = await FUDTokenInstance.balanceOf(accounts[1]);

    assert.equal(transferResult.receipt.status, true);
    assert.equal(balanceMinter.valueOf(), 1499500);
    assert.equal(balanceAcct.valueOf(), 500);
  });

  it("Should emit a Transfer event when transferring tokens", async () => {
    const FUDTokenInstance = await FUDToken.deployed();
    const transferResult = await FUDTokenInstance.transfer(accounts[1], 500, {
      from: accounts[0],
    });

    truffleAssert.eventEmitted(transferResult, "Transfer");
  });
});
