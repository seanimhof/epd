# Preconditions

## Foundry

Foundry is a "Blazing fast smart contract developement toolkit", which is used in this project. Installation instruction can be found [here](https://book. getfoundry.sh). Ensure it is installed, and the anvil command can be run.

# Setup Registry

## 1. Checkout the following repositories

- [epd-frontend](https://github.com/seanimhof/epd-frontend)
- [epd-audit](https://github.com/seanimhof/epd-audit)
- [epd-registry](https://github.com/seanimhof/epd-registry)

## 2. Open a terminal and navigate to the checked out folder containing "epd-registry"

## 3. Build the contract
```shell
forge build
```

## 4. Get ABI of the contract
```shell
forge build --silent && jq '.abi' ./out/Registry.sol/Registry.json > registry_abi.json
```

## 5. Setup Environment variables

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
4. Copy the first private key and export it as follows. Replace \<Private Key\> with the private key from the output above
```shell
export PKEY=<Private Key>
```
5. Copy the address from the output above ("127.0.0.1:8545")
```shell
export RPC=http://<listening-address>
```
6. Deploy the contract
```shell
forge script script/Deploy.s.sol --broadcast --rpc-url $RPC --private-key $PKEY
```
7. You should see the following output
```shell
##### anvil-hardhat
✅  [Success] Hash: 0xc8253ac6b04db9d4687499723a8fb4c3184d3493fa851ee9f4869df44228c8b2
Contract Address: <Contract Address>
Block: 1
Paid: 0.001212772001212772 ETH (1212772 gas * 1.000000001 gwei)
```
8. Export the contact address
```shell
export CONTRACT_ADDRESS=<Contract Address>
```

9. At last you need to write some test entries
```shell
forge script script/Seed.s.sol --broadcast --rpc-url $RPC --private-key $PKEY
```

## Setup Audit

## Setup Frontend

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
