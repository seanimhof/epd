<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 relative text-gray-900 dark:text-gray-100">

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

    <!-- Login Box -->
    <div class="min-h-screen flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md text-center z-10 relative">
        <h2 class="text-2xl font-bold mb-6">Login</h2>

        <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
          Als Login würde z.B. <strong>Veridian.ID</strong> verwendet werden,<br />
          dies ist aber <strong>nicht implementiert</strong>.
        </p>

        <!-- Vorname Feld -->
        <div class="mb-4 text-left">
          <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Dein Vorname</label>
          <input
            v-model="firstName"
            id="firstName"
            type="text"
            class="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Dein Vorname"
          />
        </div>

        <div class="mt-6">
          <button
            @click="loginAs('doctor')"
            :disabled="!walletInstalled || !firstName"
            class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Als Fachperson anmelden (Demo)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const router = useRouter()
const toast = useToast()
const walletInstalled = ref(false)
const firstName = ref('')

onMounted(() => {
  walletInstalled.value = typeof (window as any).ethereum !== 'undefined'
  
  // Überprüfen, ob der Vorname bereits im localStorage gespeichert ist
  const storedFirstName = localStorage.getItem('firstName')
  if (storedFirstName) {
    firstName.value = storedFirstName
  }

  if (!walletInstalled.value) {
    toast.error('Wallet nicht gefunden! Bitte installiere eine Wallet wie MetaMask, um fortzufahren.', {
      duration: 0, // Nie automatisch schließen
      position: 'top-center',
      clickable: true, // Ermöglicht Klicken
    })
  }
})

function loginAs(role: string) {
  if (firstName.value) {
    // Speichern des Vornamens im localStorage
    localStorage.setItem('firstName', firstName.value)
  }
  
  localStorage.setItem('mockUser', role)
  router.push('/search')
}
</script>
