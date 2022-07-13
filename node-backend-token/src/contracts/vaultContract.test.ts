import Web3 from "web3";
import { VaultContract } from "./vaultContract";

describe("vaultContract", () => {
  it("subscribes to allEvents", () => {
    const web3 = new Web3();
    let mockContract = { events: { allEvents: jest.fn() } };
    jest.spyOn(web3.eth, "Contract").mockImplementation(() => {
      return mockContract as any;
    });
    const spy = jest.spyOn(mockContract.events, "allEvents");
    const sut = new VaultContract(web3, "");
    let callback = () => {};
    sut.subscribeToEvents(callback);
    expect(spy).toHaveBeenCalledWith({ fromBlock: 0 }, callback);
  });
});
