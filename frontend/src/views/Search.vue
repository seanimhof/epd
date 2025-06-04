<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Fehlermeldung -->
    <div
      v-if="!walletInstalled"
      class="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-red-600 text-white text-center py-4 px-6 rounded-lg shadow-xl flex items-center justify-center gap-3 z-20 dark:bg-red-800"
    >
      <i class="fas fa-exclamation-circle text-2xl"></i>
      <span>
        Keine Wallet gefunden, <br />
        installiere
        <a href="https://metamask.io/download" target="_blank" class="underline font-bold">MetaMask</a>
        um fortzufahren.
      </span>
    </div>

    <!-- Info Box -->
    <div
      v-if="walletInstalled"
      class="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-blue-500 text-white text-center py-4 px-6 rounded-lg shadow-xl flex items-center justify-center gap-3 z-20 dark:bg-blue-600"
    >
      <i class="fas fa-info-circle text-2xl"></i>
      <span>
        MetaMask ist installiert! Lade dein Wallet
        <a href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" target="_blank" class="underline font-bold">hier</a>
        auf.
      </span>
    </div>
    
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">EPD suchen</h2>

      <form @submit.prevent="openEPD" class="space-y-4">
        <!-- AHV-Nummer -->
        <div>
          <label for="ahv" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AHV-Nummer</label>
          <input
            id="ahv"
            v-model="ahvNummer"
            type="text"
            placeholder="756.1234.5678.97"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Geburtsdatum -->
        <div>
          <label for="dob" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Geburtsdatum</label>
          <input
            id="dob"
            v-model="geburtsdatum"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          :disabled="!walletInstalled"
        >
          EPD suchen
        </button>

        <!-- Insert Link -->
        <div class="pt-4 text-center">
          <RouterLink to="/insert" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Noch nicht eingetragen?
          </RouterLink>
        </div>

        <!-- Eingefügte Dossiers -->
        <div class="pt-4 border-t border-gray-300 dark:border-gray-600 mt-4">
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Eingefügte Dossiers:</h3>
          <div class="space-y-1">
            <button
              v-for="(dossier, index) in insertedDossiers"
              :key="index"
              type="button"
              @click="fillSample((dossier as any).ahv, (dossier as any).dob)"
              class="text-left w-full text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              {{ (dossier as any).ahv }} – {{ (dossier as any).dob }}
            </button>
          </div>
        </div>

        <!-- Demo entries -->
        <div class="pt-4 border-t border-gray-300 dark:border-gray-600 mt-4">
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Beispiel-Daten:</h3>
          <div class="space-y-1">
            <button
              v-for="(sample, index) in samples"
              :key="index"
              type="button"
              @click="fillSample(sample.ahv, sample.birthdate)"
              class="text-left w-full text-blue-600 dark:text-blue-400 hover:underline text-sm"
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
import { onMounted, ref } from 'vue'
import { keccak256, toUtf8Bytes } from 'ethers'
import { useToast } from 'vue-toast-notification'
import { useRouter } from 'vue-router'
import { searchEPD } from '@/services/registryService'

const ahvNummer = ref('')
const geburtsdatum = ref('')
const $toast = useToast()
const router = useRouter()

const samples = [
  { ahv: '756.1234.5678.90', birthdate: '2002-01-01' },
  { ahv: '756.0987.6543.21', birthdate: '1999-12-31' },
  { ahv: '756.1212.1212.12', birthdate: '1985-06-06' }
]

const insertedDossiers = ref([])

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
    const [stamm, kontakt] = await searchEPD(hash)

    if (stamm && kontakt) {
      router.push(`/open/${hash}`)
    } else {
      $toast.error('Kein EPD gefunden.')
    }
  } catch (err) {
    $toast.error('Fehler beim Abrufen des EPD.')
  }
}

const walletInstalled = ref(false)
onMounted(() => {
  walletInstalled.value = typeof (window as any).ethereum !== 'undefined'

  // Retrieve inserted dossiers from localStorage
  const storedDossiers = JSON.parse(localStorage.getItem('epd-dossiers') || '[]')
  insertedDossiers.value = storedDossiers
})
</script>
