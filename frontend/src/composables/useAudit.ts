import { ref, onMounted, onUnmounted } from 'vue'
import { Contract, BrowserProvider } from 'ethers'
import abi from '../contracts/audit_abi.json'
import addresses from '../contracts/addresses.json'

const CONTRACT_ADDRESS = addresses.audit
const CONTRACT_ABI = abi

type AuditEvent = {
  txHash: string
  blockNumber: number
  timestamp: bigint
  accessorId: string
  epdId: string
  accessType: string
  dataHash: string
};

const entries = ref<AuditEvent[]>([])
let contract: Contract | null = null
let provider: BrowserProvider | null = null

export function useAudit() {
  const loadEntries = async () => {
    if (!window.ethereum) {
      console.error("Wallet not found")
      return
    }
    
    if(entries.value.length > 0) return

    provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

    const insertedLogs = await contract.queryFilter(contract.filters.AuditLogged())

    for (const log of insertedLogs) {
      const decoded = contract.interface.decodeEventLog("AuditLogged", log.data, log.topics)
      entries.value.push({
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
        timestamp: decoded.timestamp,
        accessorId: decoded.accessorId,
        epdId: decoded.epdId,
        accessType: decoded.accessType,
        dataHash: decoded.dataHash
      });
    }
  };

  const listenForNewEntries = () => {
    if (!contract || !provider) return

    contract.on("AuditLogged", async (timestamp, accessorId, epdId, accessType, dataHash, payload) => {

      if (!provider) return

      entries.value.push({
        txHash: payload.log.transactionHash,
        blockNumber: payload.log.blockNumber,
        timestamp: timestamp,
        accessorId: accessorId,
        epdId: epdId,
        accessType: accessType,
        dataHash: dataHash
      });
    });
  };

  const stopListening = () => {
    if (contract) {
      contract.removeAllListeners("AuditLogged")
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
