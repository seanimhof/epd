#!/bin/bash
set -euo pipefail

### CONFIGURATION ###
REGISTRY_JSON="frontend/src/contracts/registry_abi.json"
AUDIT_JSON="frontend/src/contracts/audit_abi.json"
ADDRESSES_JSON="frontend/src/contracts/addresses.json"
ANVIL_STATE="./anvil/state"
RPC_URL="http://127.0.0.1:8545"
CHAIN_ID=31337

### CLEANUP FUNCTION ###
cleanup() {
    if [[ -n "${ANVIL_PID:-}" ]]; then
        echo "Stopping Anvil..."
        kill $ANVIL_PID
    fi
}
trap cleanup EXIT

### START ANVIL ###
echo "Starting Anvil..."
anvil --state "$ANVIL_STATE" > anvil_output.log 2>&1 &
ANVIL_PID=$!

echo "Waiting for Anvil to start..."
sleep 3

### EXTRACT PRIVATE KEY AND ADDRESS ###
PKEY=$(grep -A 10 "Private Keys" anvil_output.log | grep -Eo '0x[a-f0-9]{64}' | head -n 1)
ADDRESS=$(grep -A 10 "Available Accounts" anvil_output.log | grep -Eo '0x[a-fA-F0-9]{40}' | head -n 1)

if [[ -z "$PKEY" || -z "$ADDRESS" ]]; then
    echo "Failed to extract private key or address"
    exit 1
fi

echo "Using PKEY=$PKEY"
echo "Using RPC=$RPC_URL"

export PKEY
export RPC=$RPC_URL

### BUILD CONTRACTS ###
echo "Building contracts..."
forge build --silent

mkdir "frontend/src/contracts/"

echo "Exporting ABIs..."
jq '.abi' ./out/Registry.sol/Registry.json > "$REGISTRY_JSON"
jq '.abi' ./out/Audit.sol/Audit.json > "$AUDIT_JSON"

### DEPLOY CONTRACTS ###
echo "Deploying contracts..."
DEPLOY_OUTPUT=$(forge script script/Deploy.s.sol --broadcast --rpc-url "$RPC" --private-key "$PKEY" 2>&1)
REGISTRY_CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "Registry deployed at:" | awk '{print $4}')
AUDIT_CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "Audit deployed at:" | awk '{print $4}')

if [[ -z "$REGISTRY_CONTRACT_ADDRESS" || -z "$AUDIT_CONTRACT_ADDRESS" ]]; then
    echo "Failed to deploy contracts."
    exit 1
fi

export REGISTRY_CONTRACT_ADDRESS
export AUDIT_CONTRACT_ADDRESS

### SEED CONTRACTS ###
echo "Seeding Registry..."
CONTRACT_ADDRESS=$REGISTRY_CONTRACT_ADDRESS forge script script/Seed.s.sol --broadcast --rpc-url "$RPC" --private-key "$PKEY" --tc=SeedRegistry
echo "Seeding Audit..."
CONTRACT_ADDRESS=$AUDIT_CONTRACT_ADDRESS forge script script/Seed.s.sol --broadcast --rpc-url "$RPC" --private-key "$PKEY" --tc=SeedAudit

### GENERATE ADDRESSES.JSON ###
echo "Creating addresses.json..."
echo '{
  "registry": "'"$REGISTRY_CONTRACT_ADDRESS"'",
  "audit": "'"$AUDIT_CONTRACT_ADDRESS"'"
}' > "$ADDRESSES_JSON"

### START FRONTEND ###
echo "Setting up frontend..."
cd frontend
pnpm install
pnpm dev
