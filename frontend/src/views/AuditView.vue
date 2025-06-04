<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div  class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-4xl">
      <h2 class="text-2xl font-bold mb-6 text-center">Zugriffsverlauf</h2>
      <p class="mb-6 text-center"><span class="font-semibold">Dossier ID:</span> {{ id }}</p>
      <div v-if="auditEntries.length === 0" class="text-gray-500 dark:text-gray-400">
      Keine Zugriffe vorhanden.
      </div>

    <ul class="space-y-3">
      <li
        v-for="(entry, index) in sortedAuditEntries"
        :key="index"
        class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-sm"
      >
        <div class="text-sm text-gray-800 dark:text-gray-100 font-medium">
          {{ formatDate(entry[0]) }}
        </div>
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Zugriff durch <span class="font-semibold">{{ entry[1] }}</span>
          ({{ accessTypeGerman(entry[3]) }})
        </div>
        <div v-if="accessTypeGerman(entry[3])  == 'Schreiben'" class="text-sm text-gray-700 dark:text-gray-300">
          Dokument Hash: {{ entry[4] }}
        </div>
      </li>
      </ul>
    </div>
  </div>  

</template>

<script setup lang="ts">
import { getAuditEntries } from '@/services/auditService'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const auditEntries = ref<any[]>([])
const sortedAuditEntries = computed(() =>
  [...auditEntries.value].sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
)
const error = ref('')
const route = useRoute()
const id = route.params.id as string

function accessTypeGerman(type: string): string {
  switch (type) {
    case 'read': return 'Lesen'
    case 'write': return 'Schreiben'
    case 'delete': return 'Löschen'
    case 'Create EPD': return 'EPD erstellt'
    default: return 'Unbekannt'
  }
}

function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000).toLocaleString("de-CH", {
  timeZone: "Europe/Zurich",
  dateStyle: "medium",
  timeStyle: "medium"
})
return date
}

onMounted(async () => {
  try {
    auditEntries.value = await getAuditEntries(id)
  } catch (err) {
    error.value = 'EPD konnte nicht geladen werden.'
  }
})
</script>
