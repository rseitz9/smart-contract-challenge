import Web3 from "web3";
import { CallbackFn } from "../interfaces";

export class EthChainSubscriber {
  private _web3: Web3;
  constructor(web3: Web3) {
    this._web3 = web3;
  }

  subscribeToBlockEvents = async (callback: CallbackFn) => {
    this._web3.eth.subscribe("newBlockHeaders", callback);
  };
}
