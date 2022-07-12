import { Contract } from "web3-eth-contract";

export class VaultContract {
  private _contract: Contract;
  constructor(web3: any, abi: any, contractAddress: string) {
    this._contract = new web3.eth.Contract(abi, contractAddress);
  }

  subscribeToEvents = async (callback: Function) => {
    this._contract.events.allEvents({ fromBlock: 0 }, callback);
  };
}
