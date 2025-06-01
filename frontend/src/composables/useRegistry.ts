import { ref, onMounted, onUnmounted } from 'vue'
import { Contract, BrowserProvider } from 'ethers'
import abi from '../contracts/registry_abi.json'
import addresses from '../contracts/addresses.json'

const CONTRACT_ADDRESS = addresses.registry
const CONTRACT_ABI = abi

type EPDEvent = {
  eventType: string
  txHash: string
  blockNumber: number
  blockTimestamp: number
  epdProviderName: string
  epdContactInfo: string
};

const entries = ref<EPDEvent[]>([])
let contract: Contract | null = null
let provider: BrowserProvider | null = null

export function useRegistry() {
  const loadEntries = async () => {
    if (!window.ethereum) {
      console.error("Wallet not found")
      return
    }
    
    if(entries.value.length > 0) return

    provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

    const insertedLogs = await contract.queryFilter(contract.filters.EPDInserted())
    const updatedLogs = await contract.queryFilter(contract.filters.EPDUpdated())
    const deletedLogs = await contract.queryFilter(contract.filters.EPDDeleted())
    

    for (const log of insertedLogs) {
      const decoded = contract.interface.decodeEventLog("EPDInserted", log.data, log.topics)
      const timestamp = await getTimestamp(log.blockNumber)
      if(!timestamp) continue
      entries.value.push({
        eventType: "insert",
        epdProviderName: decoded[1].epdProviderName,
        epdContactInfo: decoded[1].contactInfo,
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
        blockTimestamp: timestamp,
      });
    }

    for (const log of updatedLogs) {
      const decoded = contract.interface.decodeEventLog("EPDUpdated", log.data, log.topics)
      const timestamp = await getTimestamp(log.blockNumber)
      if(!timestamp) continue
      entries.value.push({
        eventType: "update",
        epdProviderName: decoded[1].epdProviderName,
        epdContactInfo: decoded[1].contactInfo,
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
        blockTimestamp: timestamp
      });
    }

    for (const log of deletedLogs) {
      const decoded = contract.interface.decodeEventLog("EPDDeleted", log.data, log.topics)
      const timestamp = await getTimestamp(log.blockNumber)
      if(!timestamp) continue
      entries.value.push({
        eventType: "delete",
        epdProviderName: decoded[1].epdProviderName,
        epdContactInfo: decoded[1].contactInfo,
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
        blockTimestamp: timestamp
      });
    }
  };

  const listenForNewEntries = () => {
    if (!contract || !provider) return

    contract.on("EPDInserted", async (indexed, payload, event) => {

      if (!provider) return
      const block = await provider.getBlock(event.log.blockNumber)
      if(!block) return

      const timestamp = await getTimestamp(event.log.blockNumber)
      if(!timestamp) return

      entries.value.push({
        eventType: "insert",
        txHash: indexed.hash,
        blockNumber: event.log.blockNumber,
        blockTimestamp: timestamp,
        epdProviderName: payload.epdProviderName,
        epdContactInfo: payload.contactInfo
      });
    });

    contract.on("EPDUpdated", async (indexed, payload, event) => {

      if (!provider) return
      const block = await provider.getBlock(event.log.blockNumber)
      if(!block) return

      const timestamp = await getTimestamp(event.log.blockNumber)
      if(!timestamp) return

      entries.value.push({
        eventType: "update",
        txHash: indexed.hash,
        blockNumber: event.log.blockNumber,
        blockTimestamp: timestamp,
        epdProviderName: payload.epdProviderName,
        epdContactInfo: payload.contactInfo
      });
    });

    contract.on("EPDDeleted", async (indexed, payload, event) => {

      if (!provider) return
      const block = await provider.getBlock(event.log.blockNumber)
      if(!block) return

      const timestamp = await getTimestamp(event.log.blockNumber)
      if(!timestamp) return

      entries.value.push({
        eventType: "delete",
        txHash: indexed.hash,
        blockNumber: event.log.blockNumber,
        blockTimestamp: timestamp,
        epdProviderName: payload.epdProviderName,
        epdContactInfo: payload.contactInfo
      });
    });
  };

  const stopListening = () => {
    if (contract) {
      contract.removeAllListeners("EPDInserted")
      contract.removeAllListeners("EPDUpdated")
      contract.removeAllListeners("EPDDeleted")
    }
  };

  onMounted(async () => {
    await loadEntries()
    listenForNewEntries()
  });

  onUnmounted(() => {
    stopListening()
  });

  return { entries }
}

const getTimestamp = async (blockNumber: number) => {
  if(!provider) return
  const block = await provider.getBlock(blockNumber)
  return block?.timestamp
};
