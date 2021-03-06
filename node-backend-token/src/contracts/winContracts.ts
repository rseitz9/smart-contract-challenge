import BN from "bn.js";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { WINTokenABI } from "../abi/WINTokenABI";

export class WINContract {
  private _web3: Web3;
  private _contract: Contract;
  private _minterAddress!: string;

  constructor(web3: any, contractAddress: string, minterPrivateKey: string) {
    this._web3 = web3;
    this._contract = new web3.eth.Contract(WINTokenABI, contractAddress);
    this.importPrivateKey(minterPrivateKey).then((address) => {
      this._minterAddress = address;
    });
  }
  //TODO: can use estimateGas here. We can also implement
  //a queue to store transactions when gas prices are high
  //that will be executed later.
  mintTokens = async (address: string, amount: number) => {
    console.log(`minting ${amount} to ${address}`);
    try {
      await this._contract.methods
        .mint(address, new BN(amount))
        .send({ from: this._minterAddress, gasLimit: 200000 });
    } catch (e) {
      console.error(e);
    }
  };

  async importPrivateKey(key: string): Promise<string> {
    let account = await this._web3.eth.accounts.privateKeyToAccount("0x" + key);
    await this._web3.eth.accounts.wallet.add(account);
    return account.address;
  }
}
