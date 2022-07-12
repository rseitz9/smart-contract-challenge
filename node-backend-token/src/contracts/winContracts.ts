import BN from "bn.js";
import { Contract } from "web3-eth-contract";

export class WINContract {
  private _contract: Contract;
  private _minterAddress: string;
  constructor(
    web3: any,
    abi: any,
    contractAddress: string,
    minterAddress: string
  ) {
    this._contract = new web3.eth.Contract(abi, contractAddress);
    this._minterAddress = minterAddress;
  }
  mintTokens = async (address: string, amount: number) => {
    console.log(`minting ${amount} to ${address}`);
    try {
      this._contract.methods
        .mint(address, new BN(amount))
        .send({ from: this._minterAddress });
    } catch (e) {
      console.error(e);
    }
  };
}
