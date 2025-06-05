<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-900 dark:text-gray-100 px-4">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-2xl text-center">
      <h2 class="text-3xl font-bold mb-6">EPD gefunden</h2>

      <div class="text-left space-y-4 mb-8">
        <p style="word-wrap: break-word;"><span class="font-semibold">ID:</span> {{ id }}</p>
        <p v-if="epdData?.stamm"><span class="font-semibold">Stammgemeinschaft:</span> {{ epdData.stamm }}</p>
        <p v-if="epdData?.kontakt"><span class="font-semibold">Kontaktdetails:</span> {{ epdData.kontakt }}</p>
        <p v-if="!epdData?.stamm && !epdData?.kontakt" class="text-gray-500 dark:text-gray-400">Keine Details gefunden.</p>
      </div>

      <button
        v-if="getCurrentUser()?.isArzt"
        @click="openEPD()"
        :disabled="isLoading"
        class="w-full bg-green-600 text-white py-2 mb-4 rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Dossier öffnen
      </button>

        <button
            @click="viewAuditLogs"
            class="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
          >
            Audit logs ansehen
          </button>
          <div class="text-center mt-8">
      <RouterLink to="/search" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">Zurück zur Suche</RouterLink>
      </div>  
    </div>

  </div>
</template>
<script setup lang="ts">
import { hashData, readAccess } from '@/services/auditService'
import { searchEPD } from '@/services/registryService'
import { getCurrentUser } from '@/services/userService'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const isLoading = ref(false)

const id = route.params.id as string
const epdData = ref<{ stamm?: string, kontakt?: string } | null>(null)
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
  isLoading.value = true
  toast.info("EPD-Anbieter wird kontaktiert")

  setTimeout(async () => {
    toast.info("Zugriff wird in Blockchain protokolliert")

    const userInteraction = toast.warning("Bevor das Dossier geöffnet werden kann, musst du deine Anfrage via Metamask signieren werden.<br/>Nach dem bestätigen kann es einige Sekunden dauern bis das Dossier geöffnet wird.", {
      duration: 0
    })

    try {
      await readAccess(id, hashData(getCurrentUser()!.id))
      userInteraction.dismiss()
      toast.info("Zugriff bestätigt, EPD wird geöffnet")

      router.push(`/detail/${id}`)
    } catch (error) {
      console.error(error)
      toast.error("Zugriff fehlgeschlagen")
      isLoading.value = false;
      userInteraction.dismiss()
    }
  }, 1000)
}

function viewAuditLogs() {
  // Navigate to the audit logs view
  router.push(`/audit/${id}`)
}
</script>
