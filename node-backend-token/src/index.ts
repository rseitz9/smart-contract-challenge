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

dotenv.config();

const VaultContractAddress = process.env.VAULT_CONTRACT_ADDRESS || "";
const WINTokenContractAddress = process.env.WIN_CONTRACT_ADDRESS || "";
const rpcurl = process.env.RPC_URL || "";
const MINTER_ADDRESS = process.env.MINTER_ADDRESS || "";
const RewardBlockInterval = parseInt(process.env.REWARD_BLOCK_INTERVAL || "10");

const provider = new Web3.providers.WebsocketProvider(rpcurl);
const web3 = new Web3(provider);

const vaultContract = new VaultContract(web3, VaultABI, VaultContractAddress);
const winContract = new WINContract(
  web3,
  WINTokenABI,
  WINTokenContractAddress,
  MINTER_ADDRESS
);

let AddressAccountMapping = new Map<string, Account>();

const rewardWorkflow = async (startBlock: number, stopBlock: number) => {
  AddressAccountMapping.forEach((account, address) => {
    let reward = calculateReward(startBlock, stopBlock, account);
    winContract.mintTokens(address, reward);
  });
};

const newBlockCallback = (error: any, result: any) => {
  let blockNumber = result.number;
  if (blockNumber % RewardBlockInterval === 0) {
    rewardWorkflow(blockNumber - RewardBlockInterval, blockNumber);
  }
};

web3.eth.subscribe("newBlockHeaders", newBlockCallback);
const eventCallback = extractEvent(AddressAccountMapping);
vaultContract.subscribeToEvents(eventCallback);

const app: Express = express();
const port = process.env.PORT;

app.get("/", async (req: Request, res: Response) => {
  let importedAccounts = await web3.eth.getAccounts();
  let debugInfo = {
    importedAccounts,
    addressAccountMapping: Object.fromEntries(AddressAccountMapping),
  };
  res.json(debugInfo);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
