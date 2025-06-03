<template>
  <div class="min-h-screen bg-gray-100 relative">

    <!-- Fehlermeldung, wenn keine Wallet gefunden wird -->
    <div v-if="!walletInstalled" class="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-red-500 text-white text-center py-4 px-6 rounded-lg shadow-xl flex items-center justify-center gap-3 z-20">
      <i class="fas fa-exclamation-circle text-2xl"></i>
      <span>
        Keine Wallet gefunden, <br>
        installiere <a href="https://metamask.io" target="_blank" class="underline font-bold">MetaMask</a> um fortzufahren.
      </span>
    </div>

    <!-- Info Box, wenn MetaMask installiert ist -->
    <div v-if="walletInstalled" class="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-blue-500 text-white text-center py-4 px-6 rounded-lg shadow-xl flex items-center justify-center gap-3 z-20">
      <i class="fas fa-info-circle text-2xl"></i>
      <span>
        MetaMask ist installiert! Lade dein Wallet <a href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" target="_blank" class="underline font-bold">hier</a> auf.
      
      </span>
    </div>

    <!-- Login Box -->
    <div class="min-h-screen flex items-center justify-center">
      <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center z-10 relative">
        <h2 class="text-2xl font-bold mb-6">Login</h2>
    
        <p class="text-sm text-gray-600 mb-2">
          Als Login würde z.B. <strong>Veridian.ID</strong> verwendet werden,<br>
          dies ist aber <strong>nicht implementiert</strong>.
        </p>

        <!-- Vorname Feld -->
        <div class="mb-4">
          <label for="firstName" class="block text-sm font-medium text-gray-700">Dein Vorname</label>
          <input
            v-model="firstName"
            id="firstName"
            type="text"
            class="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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

<style scoped>
/* Custom styling for the error and info message boxes */
.bg-red-500 {
  background-color: #f56565;
}

.bg-blue-500 {
  background-color: #3182ce;
}

.text-white {
  color: white;
}

.bg-red-500 a, .bg-blue-500 a {
  color: white;
  text-decoration: underline;
}

.bg-red-500 a:hover, .bg-blue-500 a:hover {
  color: #f5c6cb;
}

.shadow-xl {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.fas {
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
}
</style>
