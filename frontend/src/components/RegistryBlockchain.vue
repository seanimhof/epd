<script setup lang="ts">
import { computed } from 'vue'
import { useRegistry } from '../composables/useRegistry'
import addresses from '../contracts/addresses.json'

const CONTRACT_ADDRESS = addresses.registry

const { entries } = useRegistry()

const sortedEntries = computed(() => {
  return [...entries.value].sort((a, b) => a.blockTimestamp - b.blockTimestamp)
})

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString("de-CH", {
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
        <span class="font-semibold">Event Type:</span>
        <span>{{ event.eventType }}</span>

        <span class="font-semibold">Block Number:</span>
        <span>{{ event.blockNumber }}</span>

        <span class="font-semibold">Tx Hash:</span>
        <span>{{ event.txHash ? event.txHash.substring(0, 6) + "..." + event.txHash.slice(-4) : '—' }}</span>

        <span class="font-semibold">Provider:</span>
        <span>{{ event.epdProviderName }}</span>

        <span class="font-semibold">Contact Info:</span>
        <span class="break-all">{{ event.epdContactInfo }}</span>

        <span class="font-semibold">Timestamp:</span>
        <span>{{ formatTimestamp(event.blockTimestamp) }}</span>
      </div>
    </div>
    
    </div>

</template>



<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
