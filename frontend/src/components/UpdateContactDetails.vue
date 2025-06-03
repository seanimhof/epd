<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
        <h2 class="text-2xl font-bold mb-6 text-center">EPD-Details aktualisieren</h2>
  
        <!-- Error or Loading message -->
        <div v-if="loading" class="text-center text-gray-500">Lade Daten...</div>
        <div v-else-if="error" class="text-red-600 text-center">{{ error }}</div>
  
        <div v-else class="space-y-6">
          <!-- Stammgemeinschaft Input -->
          <div>
            <label for="newStamm" class="block text-sm font-medium text-gray-700 mb-1">Neue Stammgemeinschaft</label>
            <input
              id="newStamm"
              v-model="newStamm"
              type="text"
              placeholder="z.B. emedo, esanita"
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>
  
          <!-- Kontaktdetails Input -->
          <div>
            <label for="newKontakt" class="block text-sm font-medium text-gray-700 mb-1">Neue Kontaktdetails</label>
            <textarea
              id="newKontakt"
              v-model="newKontakt"
              rows="3"
              placeholder="E-Mail, Telefonnummer, etc."
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>
  
          <!-- Update Button -->
          <div class="mt-4">
            <button
              @click="updateEPDDetails"
              :disabled="loading || !newStamm || !newKontakt"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              EPD aktualisieren
            </button>
          </div>
        </div>
  
        <div class="text-center mt-8">
          <RouterLink to="/" class="text-sm text-blue-600 hover:underline">Zurück zur Suche</RouterLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useToast } from 'vue-toast-notification'
  import { updateEPD } from '@/services/registryService' // Import the updateEPD method
  
  const $toast = useToast()
  const $router = useRouter()
  
  const newStamm = ref('')
  const newKontakt = ref('')
  const loading = ref(false)
  const error = ref('')
  
  // Handle the update process
  async function updateEPDDetails() {
    if (!newStamm.value || !newKontakt.value) {
      $toast.error('Bitte beide Felder ausfüllen.')
      return
    }
  
    try {
      loading.value = true
  
      // Call the updateEPD function from the auditService to update the smart contract
      await updateEPD('some-hash', newStamm.value, newKontakt.value)
  
      $toast.success('EPD-Daten wurden erfolgreich aktualisiert!')
      newStamm.value = ''
      newKontakt.value = ''
      await $router.push({ path: '/search' }) // Redirect after updating
    } catch (err) {
      error.value = 'Fehler beim Aktualisieren des EPD: ' + err
      $toast.error('Aktualisierung fehlgeschlagen!')
    } finally {
      loading.value = false
    }
  }
  </script>
  