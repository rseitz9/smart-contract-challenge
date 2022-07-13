import { Contract } from "web3-eth-contract";
import { VaultABI } from "../abi/VaultABI";
import { CallbackFn } from "../interfaces";

export class VaultContract {
  private _contract: Contract;
  constructor(web3: any, contractAddress: string) {
    this._contract = new web3.eth.Contract(VaultABI, contractAddress);
  }

  subscribeToEvents = async (callback: CallbackFn) => {
    this._contract.events.allEvents({ fromBlock: 0 }, callback);
  };
}
