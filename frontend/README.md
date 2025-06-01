# Configure for use with Smart Contracts

## Smart Contract Config and Repositories
Blockchain configs are to configure in the src/contracts folder.
1. Add the contract addresses for the registry and the audit in the addresses.json file. 
2. Set the ABI for each contract in the registry_abi.json and audit_abi.json.  

How to get the address and abi is described in the Repositories for the Smart Contracts:  
[Registry Repo](https://github.com/seanimhof/epd-registry)  
[Audit Repo](https://github.com/seanimhof/epd-audit)

## Web3 Wallet
To use the Frontend a Web3 Wallet like [Metamask](https://metamask.io/download) Browser Extensions is needed.
After the installation the Network with the RPC URL needs to be configured to communicate with the Blockchain.  
Instruction to add a custom Network in Metamask (https://support.metamask.io/configure/networks/how-to-add-a-custom-network-rpc/)
For the local test environment it's anvil:  
Network Name: Anvil
RPC URL: http://127.0.0.1:8545  
Chain ID: 31337
Currency Symobl: ETH
Block-Explorer: empty

# Build and Run Project

## Install Dependencies
```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Preview

```sh
pnpm preview
```
<br>