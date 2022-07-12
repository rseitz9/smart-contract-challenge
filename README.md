There are two projects contained in this repo.

/smart-contract:

this is the repository containing solidity code for the smart contracts pertaining to FUD tokens, WIN tokens, and the Vault. The Vault can take a deposit of FUD tokens. Through integration with the other project contained in /node-backend-token, depositors will be paid out in WIN tokens.

the tokens were developed using the open zeppelin standard ethereum contracts. Initially, I implemented ERC20 token standard myself, but using this standard made it much easier and likely more secure.

in the /smart-contract project, I used truffle and ganache to develop the solution. Truffle made the smart-contract development project hassle free as webjs imports the default accounts from ganache.

the contracts can be deployed through running `truffle migrate`

I have also included scripts to make some test transactions on the local development chain by running `truffle exec ./testScripts/testScript.js` and `truffle exec ./testScripts/testScript_triggerReward.js`

I have also added some tests to verify the smart contract logic. As I had implemented some of the smart contract functions previously, I also have left the tests that verify some functionality from the open zeppelin implementation. This also helped me to verify that their implementation works as I expected.

\*note if you are using vscode:
one downside of this project structure is that the vs code extension for solidity requires setting the path the the node_modules directory as `solidity.packageDefaultDependenciesDirectory: smart-contract/node_modules`

Extending the contracts:
One future update to extend the contracts may be adding the ability to deposit additional types of tokens. In this case, we can use a map of tokens to tokenContractAddresses. We can allow the contract owner to add more tokens to this mapping.

/node-backend-token

contains a javascript service to listen to events from the VaultContract and new block events from the blockchain. This uses web3js to interact with the blockchain, express to run a server, and dotenv to load environment configuration. The only endpoint exposed on the server is to log some debug information, otherwise, it's only job is to keep the process running to listen to events from the blockchain.

I abstracted the contract interactions in the service under `/src/contracts`. These classes only contain the logic necessary to interact with the smart-contracts. Logic for calculating rewards and mapping events from the Vault contract I extracted to separate functions. There could be an argument for adding `calculateRewards` to the `VaultContract`, but since the smart-contract has no knowledge of this function, I decided to separate it (similarly with the extractEvents function). This also made these functions easy to test.

these vars need to be defined in the .env file (with relevant defaults where applicable):

PORT = 8000
RPC_URL = ws://127.0.0.1:7545
REWARD_BLOCK_INTERVAL = 10
MINTER_ADDRESS =
VAULT_CONTRACT_ADDRESS =
WIN_CONTRACT_ADDRESS =

Still to do:

1. allow importing accounts using private key:
   This can be done securely by providing the secret during deployment with github encrypted secrets
   https://docs.github.com/en/actions/security-guides/encrypted-secrets

   Another less secure option is to store the private key in the environment variables. I have already setup a .env file with other environment configuration and added it to the .gitignore.

   Once the private key is provided to the service, it can be used by importing it into the web3js lib:
   `web3.eth.accounts.privateKeyToAccount`

2. Add additional tests. I have added tests for the complex logic in calculateReward and extractEvent, but I have not yet added tests for the contract classes and other smaller functions.

3. `truffle test` runs slowly for the Vault contract. Check if it's possible to reduce this

4. Look into minimizing gas fees.
