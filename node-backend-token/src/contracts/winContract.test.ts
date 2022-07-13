import Web3 from "web3";
import { VaultContract } from "./vaultContract";
import { WINContract } from "./winContracts";

describe("winContract", () => {
  it("should import private key", async () => {
    const web3 = new Web3();
    let mock = jest.fn();
    let privateKeyToAccountSpy = jest
      .spyOn(web3.eth.accounts, "privateKeyToAccount")
      .mockImplementation(() => {
        return mock as any;
      });
    jest.spyOn(web3.eth, "Contract").mockImplementation(() => {
      return {} as any;
    });
    let walletSpy = jest
      .spyOn(web3.eth.accounts.wallet, "add")
      .mockImplementation(() => {
        return Promise.resolve() as any;
      });
    let winContract = new WINContract(web3, "", "0x1", "0x2", "00");
    await new Promise(process.nextTick); //wait for all promises to resolve
    expect(privateKeyToAccountSpy).toHaveBeenCalledWith("0x00");
    expect(walletSpy).toHaveBeenCalledWith(mock);
  });
});
