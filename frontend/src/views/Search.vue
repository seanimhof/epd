<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center">EPD suchen</h2>
  
        <form @submit.prevent="_searchEPD" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="ahv">AHV-Nummer</label>
            <input
              id="ahv"
              v-model="ahvNummer"
              @input="epdFound = false"
              type="text"
              placeholder="756.1234.5678.97"
              class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="dob">Geburtsdatum</label>
            <input
              id="dob"
              v-model="geburtsdatum"
              @input="epdFound = false"
              type="date"
              class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <button
            type="submit"
            class="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            EPD suchen
          </button>
  
          <button
            v-if="epdFound"
            @click.prevent="openEPD"
            class="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition mt-2"
          >
            EPD öffnen
          </button>
          <div class="text-center mt-4">
            <RouterLink
              to="/insert"
              class="text-sm text-blue-600 hover:underline"
            >
              Noch nicht eingetragen?
            </RouterLink>
          </div>

  
          <!-- Sample inputs -->
          <div class="pt-4 border-t mt-4">
            <h3 class="text-sm font-semibold text-gray-600 mb-2">Beispiel-Daten:</h3>
            <div class="space-y-1">
              <button
                v-for="(sample, index) in samples"
                :key="index"
                type="button"
                @click="fillSample(sample.ahv, sample.birthdate)"
                class="text-left w-full text-blue-600 hover:underline text-sm"
              >
                {{ sample.ahv }} – {{ sample.birthdate }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useToast } from 'vue-toast-notification'
  import { searchEPD } from '@/services/registryService'
  
  const $toast = useToast()

  const ahvNummer = ref('')
  const geburtsdatum = ref('')
  const epdFound = ref(false)
  
  const samples = [
    { ahv: '756.1234.5678.97', birthdate: '1990-01-01' },
    { ahv: '756.4321.8765.21', birthdate: '1985-05-15' },
    { ahv: '756.0000.1111.22', birthdate: '2000-12-31' },
  ]
  
  function fillSample(ahv: string, birthdate: string) {
    ahvNummer.value = ahv
    geburtsdatum.value = birthdate
    epdFound.value = false
  }
  
  function isValidAhvNumber(input: string): boolean {
    const ahvPattern = /^756\.\d{4}\.\d{4}\.\d{2}$/
    return ahvPattern.test(input)
  }
  
  
  async function _searchEPD() {
    if (!isValidAhvNumber(ahvNummer.value)) {
      $toast.error('Ungültiges AHV-Nummer-Format. Beispiel: 756.1234.5678.97')
      return
    }
  
    try {
      const [value, value2]: [string, string] = await searchEPD(ahvNummer.value, geburtsdatum.value)
  
      if (value && value2) {
        epdFound.value = true
        $toast.success('EPD gefunden.')
      } else {
        $toast.error(`Kein EPD gefunden für AHV=${ahvNummer.value}, Geburtsdatum=${geburtsdatum.value}`)
      }
    } catch (err) {
      epdFound.value = false
      $toast.error(`Fehler bei der Suche: ${String(err)}`)
    }
  }
  
  function openEPD() {
    $toast.success('EPD wird geöffnet...')
    // Add your actual EPD opening logic here.
  }
  </script>
  
  <style>
  body {
    margin: 0;
    font-family: system-ui, sans-serif;
  }
  </style>
  