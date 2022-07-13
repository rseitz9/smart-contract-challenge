import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import Web3 from "Web3";
import { VaultABI } from "./abi/VaultABI";
import { Account } from "./interfaces";
import { calculateReward } from "./helpers/calculateReward";
import { extractEvent } from "./helpers/extractEvent";
import { WINContract } from "./contracts/winContracts";
import { WINTokenABI } from "./abi/WINTokenABI";
import { VaultContract } from "./contracts/vaultContract";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { EthChainSubscriber } from "./contracts/ethChainSubscriber";

dotenv.config();

const VaultContractAddress = process.env.VAULT_CONTRACT_ADDRESS || "";
const WINTokenContractAddress = process.env.WIN_CONTRACT_ADDRESS || "";
const rpcUrlWs = process.env.RPC_URL_WS || "";
const rpcUrlHttp = process.env.RPC_URL_HTTP || "";
const MINTER_ADDRESS = process.env.MINTER_ADDRESS || "";
const MINTER_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY || "";
const RewardBlockInterval = parseInt(process.env.REWARD_BLOCK_INTERVAL || "10");

const socketProvider = new Web3.providers.WebsocketProvider(rpcUrlWs);
const web3Socket = new Web3(socketProvider);

const localKeyProvider = new HDWalletProvider(MINTER_PRIVATE_KEY, rpcUrlHttp);

const web3LocalWallet = new Web3(localKeyProvider);
// web3Wallet.eth.getAccounts().then(console.log);

const vaultContract = new VaultContract(
  web3Socket,
  VaultABI,
  VaultContractAddress
);

const winContract = new WINContract(
  web3LocalWallet,
  WINTokenABI,
  WINTokenContractAddress,
  MINTER_ADDRESS,
  MINTER_PRIVATE_KEY
);

const ethChainSubscriber = new EthChainSubscriber(web3Socket);

let AddressAccountMapping = new Map<string, Account>();

const rewardWorkflow = async (startBlock: number, stopBlock: number) => {
  let keys = Array.from(AddressAccountMapping.keys());
  for (let i = 0; i < keys.length; i++) {
    let account = AddressAccountMapping.get(keys[i]);
    let reward = calculateReward(startBlock, stopBlock, account);
    //need to process transactions synchronously or nonce gets out of sync
    //would need to nonce outside the web3js lib to speed up
    await winContract.mintTokens(keys[i], reward);
  }
};

const newBlockCallback = (error: any, result: any) => {
  if (error) {
    console.error(error);
    return;
  }
  let blockNumber = result.number;
  if (blockNumber % RewardBlockInterval === 0) {
    console.log(`paying out reward for ${blockNumber}`);
    rewardWorkflow(blockNumber - RewardBlockInterval, blockNumber);
  }
};

ethChainSubscriber.subscribeToBlockEvents(newBlockCallback);

const vaultContractEventCallback = extractEvent(AddressAccountMapping);
vaultContract.subscribeToEvents(vaultContractEventCallback);

const app: Express = express();
const port = process.env.PORT;

app.get("/", async (req: Request, res: Response) => {
  let localAccountAddresses = await web3LocalWallet.eth.getAccounts();
  let debugInfo = {
    localAccountAddresses,
    addressAccountMapping: Object.fromEntries(AddressAccountMapping),
  };
  res.json(debugInfo);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
