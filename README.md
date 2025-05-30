# Project Setup

## Build the contract
```shell
forge build
```

## Get ABI of the contract (needed only for the frontend)
```shell
forge build --silent && jq '.abi' ./out/Registry.sol/Registry.json > registry_abi.json
```
Or copy direct from out/Registry.sol/Registry.json

## Run locally with anvil as the blockchain

### Start Anvil
```shell
anvil --state ./anvil/state
```
After the start anvil shows informatins about the rpc url Private Keys and Public Keys. <br>
Create env vars for the rpc url, private and public Key to the env
```shell
export RPC=http://127.0.0.1:8545
export PKEY=<Private Key>
```

### deploy contract and create some test entries
```shell
forge script script/Deploy.s.sol --broadcast --rpc-url $RPC --private-key $PKEY
```
After the Deplyoment you get a contract address to set as env var for later interactions
```shell
export CONTRACT_ADDRESS=<CA>
```
```shell
forge script script/Seed.s.sol --broadcast --rpc-url $RPC --private-key $PKEY
```


### Interact with the Frontend
Check the Frontend Repository to set it up locally: [Frontend](https://github.com/seanimhof/epd-frontend)

### Interact locally with cast

**Search an EPD with the AHV-Number and Birthdate**
```shell
cast decode-abi "searchEPD(string,string)" --input "$(
  cast call $CONTRACT_ADDRESS "searchEPD(bytes32)" "$(cast keccak '<ahv+birthdate>')"
)"
```
**Insert a new EPD Record**
```shell
cast send --private-key $PKEY $CONTRACT_ADDRESS "insertEPD(bytes32, string, string)" $(cast keccak "<ahv+birthdate>") '"<EPD-Provider>"' '"<URL>"'
```

**Update a Record**
```shell
cast send --private-key $PKEY $CONTRACT_ADDRESS "updateEPD(bytes32, string, string)" $(cast keccak "<ahv+birthdate>") '"<EPD-Provider>"' '"<URL>"'
```

**Delete a Record**
```shell
cast send --private-key $PKEY $CONTRACT_ADDRESS "deleteEPD(bytes32)" $(cast keccak "<ahv+birthdate>")
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
