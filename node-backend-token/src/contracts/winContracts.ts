import BN from "bn.js";
import { Contract } from "web3-eth-contract";

export class WINContract {
  private _web3: any;
  private _contract: Contract;
  private _minterAddress: string;
  constructor(
    web3: any,
    abi: any,
    contractAddress: string,
    minterAddress: string,
    minterPrivateKey: string
  ) {
    this._web3 = web3;
    this._contract = new web3.eth.Contract(abi, contractAddress);
    this._minterAddress = minterAddress;
    this.importPrivateKey(minterPrivateKey);
  }
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

  async importPrivateKey(key: string) {
    let account = await this._web3.eth.accounts.privateKeyToAccount("0x" + key);
    await this._web3.eth.accounts.wallet.add(account);
  }
}
