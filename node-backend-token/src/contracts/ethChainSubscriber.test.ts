import Web3 from "web3";
import { EthChainSubscriber } from "./ethChainSubscriber";

describe("ethChainSubscriber", () => {
  it("subscribes to newBlockHeaders", () => {
    const web3 = new Web3();
    const spy = jest.spyOn(web3.eth, "subscribe");
    const sut = new EthChainSubscriber(web3);
    let callback = () => {};
    sut.subscribeToBlockEvents(callback);
    expect(spy).toHaveBeenCalledWith("newBlockHeaders", callback);
  });
});
