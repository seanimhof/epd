<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center">EPD eintragen</h2>
  
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label for="ahv" class="block text-sm font-medium text-gray-700 mb-1">AHV-Nummer</label>
            <input
              id="ahv"
              v-model="ahvNummer"
              type="text"
              placeholder="756.1234.5678.97"
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>
  
          <div>
            <label for="dob" class="block text-sm font-medium text-gray-700 mb-1">Geburtsdatum</label>
            <input
              id="dob"
              v-model="geburtsdatum"
              type="date"
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>
  
          <div>
            <label for="stamm" class="block text-sm font-medium text-gray-700 mb-1">EPD-Stammgemeinschaft</label>
            <input
              id="stamm"
              v-model="epdStamm"
              type="text"
              placeholder="z.B. emedo, esanita"
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>
  
          <div>
            <label for="kontakt" class="block text-sm font-medium text-gray-700 mb-1">EPD-Kontaktdetails</label>
            <textarea
              id="kontakt"
              v-model="epdKontakt"
              rows="3"
              placeholder="E-Mail, Telefonnummer, etc."
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>
  
          <button
            type="submit"
            class="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Eintragen
          </button>
        </form>
  
        <div class="text-center mt-4">
          <RouterLink to="/search" class="text-sm text-gray-600 hover:underline">Zurück zur Suche</RouterLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useToast } from 'vue-toast-notification'
  import { useRouter } from 'vue-router'

  const $router = useRouter()
  const $toast = useToast()
  
  const ahvNummer = ref('')
  const geburtsdatum = ref('')
  const epdStamm = ref('')
  const epdKontakt = ref('')
  
  function isValidAhvNumber(input: string): boolean {
    const ahvPattern = /^756\.\d{4}\.\d{4}\.\d{2}$/
    return ahvPattern.test(input)
  }
  
  async function submitForm() {
    if (!isValidAhvNumber(ahvNummer.value)) {
        $toast.error('Ungültiges AHV-Nummer-Format. Beispiel: 756.1234.5678.97')
      return
    }
  
    if (!geburtsdatum.value || !epdStamm.value || !epdKontakt.value) {
      $toast.error('Bitte alle Felder ausfüllen.')
      return
    }
  
    try {
        
       
        await $router.push({ path: '/search' })
    } catch (error) {
        $toast.error('Eintragen fehlgeschlagen: ' + error)
    }
    // Optional: Send to smart contract here.
  
    $toast.success('EPD-Daten erfolgreich eingetragen (Demo).')
    // Clear fields
    ahvNummer.value = ''
    geburtsdatum.value = ''
    epdStamm.value = ''
    epdKontakt.value = ''
  }
  </script>
  