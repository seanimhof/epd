# Preconditions

## Foundry

Foundry is a "Blazing fast smart contract developement toolkit", which is used in this project. Installation instruction can be found [here](https://book. getfoundry.sh). Ensure it is installed, and the anvil command can be run.

## Frontend

- Install [nodejs](https://nodejs.org/en)
- Install pnpm from [here](https://pnpm.io/installation)

# Getting started


## Open a terminal and navigate to thec checked out folder

## Build the contract
```shell
forge build
```

## Get ABI of the contracts
```shell
forge build --silent && jq '.abi' ./out/Registry.sol/Registry.json > frontend/src/contracts/registry_abi.json  && jq '.abi' ./out/Audit.sol/Audit.json > frontend/src/contracts/audit_abi.json
```

## Setup Environment variables

1. Start anvil
```shell
anvil --state ./anvil/state
```
2. This may take a couple of seconds, after that you should see the following message
```shell
Private Keys
==================

...
...
...
Listening on 127.0.0.1:8545
```
3. Open a second terminal
4. Copy the first private key and export it as follows. Replace \<Private Key\> with the private key from the output above. Note the private key, we need it later
```shell
export PKEY=<Private Key>
```
5. Copy the address from the output above ("127.0.0.1:8545")
```shell
export RPC=http://<listening-address>
6. Deploy the contract
```shell
forge script script/Deploy.s.sol --broadcast --rpc-url $RPC --private-key $PKEY
```
```
7. You should see the following output
```shell
== Logs ==
  Registry deployed at: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
  Audit deployed at: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707

```
8. Setup environment variables
```shell
export REGISTRY_CONTRACT_ADDRESS=<Registry-Contract Address> # 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
export AUDIT_CONTRACT_ADDRESS=<Audit-Contract Address> #0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
```
9. Seed the Registry
```shell
CONTRACT_ADDRESS=$REGISTRY_CONTRACT_ADDRESS forge script script/Seed.s.sol --broadcast --rpc-url $RPC --private-key $PKEY --tc=SeedRegistry
CONTRACT_ADDRESS=$AUDIT_CONTRACT_ADDRESS forge script script/Seed.s.sol --broadcast --rpc-url $RPC --private-key $PKEY --tc=SeedAudit
```

10. Create the contract
```shell
REGISTRY=$REGISTRY_CONTRACT_ADDRESS AUDIT=$AUDIT_CONTRACT_ADDRESS pnpm exec -- node -e "require('fs').writeFileSync('addresses.json', JSON.stringify({ registry: process.env.REGISTRY, audit: process.env.AUDIT }, null, 2))"
```

# Run the frontend



1. Install [metamask](https://metamask.io/download) in a supported browser. 

2. Restart Firefox
3. To use the Frontend a Web3 Wallet like [Metamask](https://metamask.io/download) Browser Extensions is needed. After the installation the Network with the RPC URL needs to be configured to communicate with the Blockchain.   Instruction to add a custom Network in Metamask (https://support.metamask.io/configure/networks/how-to-add-a-custom-network-rpc/) For the local test environment it's anvil:  
```
Network Name: Anvil
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symobl: ETH
Block-Explorer: empty
```
4. Add a new wallet by adding the private key copied above (without the 0x at the start)

5. Copy the Contract Addresses from the Deplyoment to the frontend/src/contracts/addresses.json  

6. Open a new terminal and type the following command
```shell
cd frontend && pnpm install && pnpm build && pnpm preview 
```

7. Open [http://localhost:4173/epd-frontend](http://localhost:4173/epd-frontend) in the browser, where metamask is installed. Open the registry

## Setup Frontend

### Interact with the Frontend
Check the Frontend Repository to set it up locally: [Frontend](https://github.com/seanimhof/epd-frontend)

### Interact locally with cast

**Search an EPD with the AHV-Number and Birthdate**
```shell
cast decode-abi "searchEPD(string,string)" --input "$(
  cast call $REGISTRY_CONTRACT_ADDRESS "searchEPD(bytes32)" "$(cast keccak '<ahv+birthdate>')"
)"
```
**Insert a new EPD Record**
```shell
cast send --private-key $PKEY $REGISTRY_CONTRACT_ADDRESS "insertEPD(bytes32, string, string)" $(cast keccak "<ahv+birthdate>") '"<EPD-Provider>"' '"<URL>"'
```

**Update a Record**
```shell
cast send --private-key $PKEY $REGISTRY_CONTRACT_ADDRESS "updateEPD(bytes32, string, string)" $(cast keccak "<ahv+birthdate>") '"<EPD-Provider>"' '"<URL>"'
```

**Delete a Record**
```shell
cast send --private-key $PKEY $REGISTRY_CONTRACT_ADDRESS "deleteEPD(bytes32)" $(cast keccak "<ahv+birthdate>")
```


# Foundry Readme

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
