# Preconditions

## Foundry

Foundry is a "Blazing fast smart contract developement toolkit", which is used in this project. Installation instruction can be found [here](https://book. getfoundry.sh). Ensure it is installed, and the anvil command can be run.

## Frontend



# Setup


## Open a terminal and navigate to thec checked out folder

## Build the contract
```shell
forge build
```

## Get ABI of the contracts
```shell
forge build --silent && jq '.abi' ./out/Registry.sol/Registry.json > registry_abi.json 
forge build --silent && jq '.abi' ./out/Audit.sol/Audit.json > audit_abi.json
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
4. Copy the first private key and export it as follows. Replace \<Private Key\> with the private key from the output above
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
7. Seed the Registry
```shell
export REGISTRY_CONTRACT_ADDRESS=<Contract Address>
CONTRACT_ADDRESS=<Contract Address> & forge script script/Seed.s.sol --broadcast --rpc-url $RPC --private-key $PKEY --tc=SeedRegistry
```

8. Seed the Audit
```shell
export AUDIT_CONTRACT_ADDRESS=<Contract Address>
CONTRACT_ADDRESS=<Contract Address> & forge script script/Seed.s.sol --broadcast --rpc-url $RPC --private-key $PKEY --tc=SeedAudit
```

CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 forge script script/Seed.s.sol --broadcast --rpc-url $RPC --private-key $PKEY --tc=SeedAudit


// TODO


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
