const WINToken = artifacts.require("WINToken");
const truffleAssert = require("truffle-assertions");

contract("WINToken", (accounts) => {
  let WINTokenInstance;
  beforeEach(async () => {
    WINTokenInstance = await WINToken.deployed();
  });
  it("Should only allow mint to be called by the minter", async () => {
    let error;
    try {
      await WINTokenInstance.mint(accounts[1], 100, {
        from: accounts[1],
      });
    } catch (e) {
      error = e;
    }
    assert(error);
    assert(error.message.includes("must have minter role to mint"));
  });

  it("should mint tokens directly to account", async () => {
    await WINTokenInstance.mint(accounts[1], 199, {
      from: accounts[0],
    });

    const balanceAcct = await WINTokenInstance.balanceOf(accounts[1]);
    assert.equal(balanceAcct.valueOf(), 199);
  });

  it("Should emit a Transfer event when minting tokens", async () => {
    const transaction = await WINTokenInstance.mint(accounts[1], 199, {
      from: accounts[0],
    });

    truffleAssert.eventEmitted(transaction, "Transfer", (ev) => {
      return (
        ev.from === "0x0000000000000000000000000000000000000000" &&
        ev.to === accounts[1] &&
        ev.value.toString() === "199"
      );
    });
  });
});
