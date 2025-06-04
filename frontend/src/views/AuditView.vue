<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div  class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-4xl">
      <h2 class="text-2xl font-bold mb-6 text-center">Zugriffsverlauf</h2>
      <p style="word-wrap: break-word;"><span class="font-semibold">ID:</span> {{ id }}</p>
      <div v-if="auditEntries.length === 0" class="text-gray-500 dark:text-gray-400">
      Keine Zugriffe vorhanden.
      </div>

    <ul class="space-y-3">
      <li
        v-for="(entry, index) in auditEntries"
        :key="index"
        class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-sm"
      >
        <div class="text-sm text-gray-800 dark:text-gray-100 font-medium">
          {{ formatDate(entry.Timestamp) }}
        </div>
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Zugriff durch <span class="font-semibold">{{ entry.Initiator }}</span>
          ({{ accessTypeGerman(entry.accessType) }})
        </div>
      </li>
      </ul>
    </div>
  </div>  

</template>

<script setup lang="ts">
import { getAuditEntries } from '@/services/auditService'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const auditEntries = ref<any[]>([])
const error = ref('')
const route = useRoute()
const id = route.params.id as string

function accessTypeGerman(type: string): string {
  switch (type) {
    case 'read': return 'Lesen'
    case 'write': return 'Schreiben'
    case 'delete': return 'Löschen'
    default: return 'Unbekannt'
  }
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleString('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(async () => {
  try {
    auditEntries.value = await getAuditEntries(id)
  } catch (err) {
    error.value = 'EPD konnte nicht geladen werden.'
  }
})
</script>
