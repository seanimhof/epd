<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-900 dark:text-gray-100 px-4">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-xl text-center">
      <h2 class="text-3xl font-bold mb-6">EPD gefunden</h2>

      <div class="text-left space-y-4 mb-8">
        <p><span class="font-semibold">ID:</span> {{ id }}</p>
        <p v-if="epdData?.stamm"><span class="font-semibold">Stammgemeinschaft:</span> {{ epdData.stamm }}</p>
        <p v-if="epdData?.kontakt"><span class="font-semibold">Kontaktdetails:</span> {{ epdData.kontakt }}</p>
        <p v-if="!epdData?.stamm && !epdData?.kontakt" class="text-gray-500 dark:text-gray-400">Keine Details gefunden.</p>
      </div>

      <button
        v-if="role === 'fachperson'"
        @click="openEPD()"
        class="w-full bg-green-600 text-white py-2 mb-4 rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Zugriff beantragen
      </button>

        <button
            @click="viewAuditLogs"
            class="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
          >
            Audit logs ansehen
          </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { readAccess } from '@/services/auditService'
import { searchEPD } from '@/services/registryService'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const id = route.params.id as string
const epdData = ref<{ stamm?: string, kontakt?: string } | null>(null)
const role = ref<'oeffentlich' | 'fachperson'>(localStorage.getItem('Role') as 'oeffentlich' | 'fachperson' || 'oeffentlich')

onMounted(async () => {
  try {
    const [stamm, kontakt] = await searchEPD(id)
    if (stamm || kontakt) {
      epdData.value = { stamm, kontakt }
    } else {
      epdData.value = null
      toast.error('Kein EPD gefunden.')
    }
  } catch (err) {
    toast.error('Fehler beim Abrufen des EPD.')
  }
})

async function openEPD() {
  toast.info("EPD-Anbieter wird kontaktiert")

  setTimeout(async () => {
    toast.info("Zugriff wird in Blockchain protokolliert")

    try {
      await readAccess(id)
      toast.info("Zugriff bestätigt, EPD wird geöffnet")

      setTimeout(() => {
        router.push(`/detail/${id}`)
      }, 1000)
    } catch (error) {
      console.error(error)
      toast.error("Zugriff fehlgeschlagen")
    }
  }, 1000)
}

function viewAuditLogs() {
  // Navigate to the audit logs view
  router.push(`/audit/${id}`)
}
</script>
