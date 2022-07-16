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

    expect(error).to.exist;
    expect(error.message).to.include("must have minter role to mint");
  });

  it("should mint tokens directly to account", async () => {
    await WINTokenInstance.mint(accounts[1], 199, {
      from: accounts[0],
    });

    const balanceAcct = await WINTokenInstance.balanceOf(accounts[1]);
    expect(balanceAcct).to.deep.equal(web3.utils.toBN(199));
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
