<script setup lang="ts">
import { computed } from 'vue'
import { useAudit } from '../composables/useAudit'
import addresses from '../contracts/addresses.json'

const CONTRACT_ADDRESS = addresses.audit

const { entries } = useAudit()

const sortedEntries = computed(() => {
  return [...entries.value].sort((a, b) => Number(a.timestamp - b.timestamp))
})

const formatTimestamp = (timestamp: bigint) => {
  return new Date(Number(timestamp) * 1000).toLocaleString("de-CH", {
        timeZone: "Europe/Zurich",
        dateStyle: "medium",
        timeStyle: "short",
      })
};

</script>

<template>

    <h2 class="text-4xl font-bold mt-8 text-center">Blockchain History</h2>
    <p class="text-x1 mb-4 text-center">CA: {{ CONTRACT_ADDRESS }}</p>
    <div class="grid grid-cols-5 gap-4 mb-6 max-w-full w-full">

     <div v-for="(event, index) in sortedEntries.slice(-15).reverse()" :key="event.txHash + index" class="bg-gray-800 p-4 rounded-lg shadow-md">
      <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0">

        <span class="font-semibold">Block Number:</span>
        <span>{{ event.blockNumber }}</span>

        <span class="font-semibold">Tx Hash:</span>
        <span>{{ event.txHash ? event.txHash.substring(0, 6) + "..." + event.txHash.slice(-4) : '—' }}</span>

        <span class="font-semibold">Timestamp:</span>
        <span>{{ formatTimestamp(event.timestamp) }}</span>

        <span class="font-semibold">Accessor:</span>
        <span>{{ event.accessorId }}</span>

        <span class="font-semibold">EPD ID:</span>
        <span class="break-all">{{ event.epdId }}</span>

        <span class="font-semibold">AccessType:</span>
        <span>{{ event.accessType }}</span>
      </div>
    </div>
    
    </div>

</template>



<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
