<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAudit } from '../composables/useAudit'
import addresses from '../contracts/addresses.json'
import { BrowserProvider } from 'ethers'

const CONTRACT_ADDRESS = addresses.audit

const { entries } = useAudit()

const explorerBaseUrl = ref<string | null>(null)

onMounted(async () => {
  const provider = new BrowserProvider((window as any).ethereum)
  explorerBaseUrl.value = await getExplorerBaseUrl(provider)
})

const sortedEntries = computed(() => {
  return [...entries.value].sort((a, b) => Number(a.timestamp - b.timestamp))
})

const decoratedEntries = computed(() =>
  sortedEntries.value.map((entry) => ({
    ...entry,
    explorerUrl: explorerBaseUrl.value
      ? `${explorerBaseUrl.value}/tx/${entry.txHash}`
      : null
  }))
)

const formatTimestamp = (timestamp: bigint) => {
  return new Date(Number(timestamp) * 1000).toLocaleString("de-CH", {
        timeZone: "Europe/Zurich",
        dateStyle: "medium",
        timeStyle: "short",
      })
};

async function getExplorerBaseUrl(provider: BrowserProvider): Promise<string | null> {
  const network = await provider.getNetwork()

  switch (network.chainId) {
    case 1n: return 'https://etherscan.io'
    case 5n: return 'https://goerli.etherscan.io'
    case 11155111n: return 'https://sepolia.etherscan.io'
    case 137n: return 'https://polygonscan.com'
    case 10n: return 'https://optimistic.etherscan.io'
    case 42161n: return 'https://arbiscan.io'
    case 31337n: return 'https://etherscan.io'
    default: return null
  }
}

</script>

<template>

    <h2 class="text-4xl font-bold mt-8 text-center">Blockchain History</h2>
    <p class="text-x1 mb-4 text-center">CA: {{ CONTRACT_ADDRESS }}</p>
    <div class="grid grid-cols-5 gap-4 mb-6 max-w-full w-full">

     <div v-for="(event, index) in decoratedEntries.slice(-15).reverse()" :key="event.txHash + index" class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0">

        <span class="font-semibold">Timestamp:</span>
        <span>{{ formatTimestamp(event.timestamp) }}</span>

        <span class="font-semibold">Accessor:</span>
        <span>{{ event.accessorWallet }}</span>

        <span class="font-semibold">EPD ID:</span>
        <span class="break-all">{{ event.epdId.slice(0,10) }}...{{ event.epdId.slice(-4) }}</span>

        <span class="font-semibold">AccessType:</span>
        <span>{{ event.accessType }}</span>

        <span class="font-semibold">File Hash:</span>
        <span>{{ event.dataHash.slice(0, 11) }}...{{ event.dataHash.slice(-4) }}</span>

        <span class="font-semibold">Details:</span>
        <span v-if="event.explorerUrl">
          <a :href="event.explorerUrl" target="_blank" class="text-blue-500 hover:underline">
            {{ event.txHash.slice(0, 10) }}...
          </a>
        </span>
        <span v-else>{{ event.txHash.slice(0, 10) }}</span>
      </div>
    </div>
    
    </div>

</template>



<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
