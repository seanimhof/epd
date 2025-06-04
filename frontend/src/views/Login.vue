<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 relative text-gray-900 dark:text-gray-100">

    <!-- Onchain Details Box -->
    <div v-if="epdData" class="bg-blue-100 dark:bg-blue-900 p-4 rounded-xl mb-6">
      <h3 class="font-bold text-lg">Onchain Details</h3>
      <p v-if="epdData.stamm" class="text-sm text-gray-600 dark:text-gray-300">Stamm: {{ epdData.stamm }}</p>
      <p v-if="epdData.kontakt" class="text-sm text-gray-600 dark:text-gray-300">Kontakt: {{ epdData.kontakt }}</p>
      <p v-if="!epdData.stamm || !epdData.kontakt" class="text-sm text-gray-600 dark:text-gray-300">Keine Details gefunden.</p>
    </div>

    <!-- Flex container for side-by-side views -->
    <div class="flex min-h-screen justify-center items-center space-x-8">
      <!-- Login Box -->
      <div class="min-h-screen flex items-center justify-center">
        <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md text-center z-10 relative">
          <h2 class="text-2xl font-bold mb-6">Login als Fachperson</h2>

          <!-- Vorname Feld -->
          <div class="mb-4 text-left">
            <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Anmelden als</label>
            <select
              v-model="firstName"
              id="firstName"
              type="text"
              class="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Dein Vorname"
            >
            <option value="Prof. Dr. Müller">Prof. Dr.Müller</option>
          </select>
          </div>

          <div class="mt-6">
            <button
              @click="loginAs('doctor')"
              :disabled="!firstName"
              class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Mit Wallet anmelden
            </button>
          </div>
        </div>
      </div>

      <!-- Öffentliche Aktionen View -->
      <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 class="text-2xl font-bold mb-6">Öffentliche Aktionen</h2>

        <div class="mt-6 space-y-4">
          <button
            @click="viewAuditLogs"
            class="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
          >
            Audit logs ansehen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { searchEPD } from '@/services/registryService'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const id = route.params.id as string

const firstName = ref('')
const epdData = ref<{ stamm?: string, kontakt?: string } | null>(null)

onMounted(async () => {
  // Überprüfen, ob der Vorname bereits im localStorage gespeichert ist
  const storedFirstName = localStorage.getItem('firstName')
  if (storedFirstName) {
    firstName.value = storedFirstName
  }

  // Suchen nach EPD-Daten
  try {
    const [stamm, kontakt] = await searchEPD(id)  // Example values for AHV number and birthdate
    if (stamm && kontakt) {
      epdData.value = { stamm, kontakt }
    } else {
      epdData.value = null
      toast.error('Kein EPD gefunden.')
    }
  } catch (err) {
    toast.error('Fehler beim Abrufen des EPD.')
  }
})


function loginAs(role: string) {
  if (firstName.value) {
    // Speichern des Vornamens im localStorage
    localStorage.setItem('firstName', firstName.value)
  }
  
  localStorage.setItem('mockUser', role)
  router.push(`/detail/${id}`)
}


function viewAuditLogs() {
  // Navigate to the audit logs view
  router.push(`/audit/${id}`)
}
</script>
