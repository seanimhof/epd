<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">EPD öffnen</h2>

      <form @submit.prevent="openEPD" class="space-y-4">
        <div>
          <label for="ahv" class="block text-sm font-medium text-gray-700 mb-1">AHV-Nummer</label>
          <input
            id="ahv"
            v-model="ahvNummer"
            type="text"
            placeholder="756.1234.5678.97"
            class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="dob" class="block text-sm font-medium text-gray-700 mb-1">Geburtsdatum</label>
          <input
            id="dob"
            v-model="geburtsdatum"
            type="date"
            class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          EPD öffnen
        </button>

        <div class="pt-4 text-center">
          <RouterLink to="/insert" class="text-sm text-blue-600 hover:underline">
            Noch nicht eingetragen?
          </RouterLink>
        </div>

        <!-- Demo entries -->
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
import { keccak256, toUtf8Bytes } from 'ethers'
import { useToast } from 'vue-toast-notification'
import { useRouter } from 'vue-router'
import { searchEPD } from '@/services/registryService'

const ahvNummer = ref('')
const geburtsdatum = ref('')
const $toast = useToast()
const router = useRouter()

const samples = [
  { ahv: '756.1234.5678.97', birthdate: '1990-01-01' },
  { ahv: '756.4321.8765.21', birthdate: '1985-05-15' },
  { ahv: '756.0000.1111.22', birthdate: '2000-12-31' }
]

function fillSample(ahv: string, birthdate: string) {
  ahvNummer.value = ahv
  geburtsdatum.value = birthdate
}

function isValidAhvNumber(input: string): boolean {
  const pattern = /^756\.\d{4}\.\d{4}\.\d{2}$/
  return pattern.test(input)
}

async function openEPD() {
  if (!isValidAhvNumber(ahvNummer.value)) {
    $toast.error('Ungültiges AHV-Nummer-Format. Beispiel: 756.1234.5678.97')
    return
  }

  if (!geburtsdatum.value) {
    $toast.error('Bitte Geburtsdatum eingeben.')
    return
  }

  const hash = keccak256(toUtf8Bytes(ahvNummer.value + geburtsdatum.value))

  try {
    const [stamm, kontakt] = await searchEPD(ahvNummer.value, geburtsdatum.value)

    if (stamm && kontakt) {
      router.push(`/epd/${hash}`)
    } else {
      $toast.error('Kein EPD gefunden.')
    }
  } catch (err) {
    $toast.error('Fehler beim Abrufen des EPD.')
  }
}
</script>
