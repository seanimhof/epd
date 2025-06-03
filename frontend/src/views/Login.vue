<template>
    <div class="min-h-screen bg-gray-100 relative">
      <!-- Wallet Hinweis Overlay -->
      <div
        v-if="!walletInstalled"
        class="absolute top-0 right-0 w-64 h-32 bg-yellow-200 border-2 border-yellow-500 rounded-bl-xl shadow-lg z-50 flex flex-col justify-center px-4 pointer-events-none"
      >
        <p class="text-sm font-semibold text-gray-800">
          👉 Hier erscheint deine Wallet (z. B. MetaMask)
        </p>
        <p class="text-xs text-gray-700 mt-1">
          Nicht installiert? 
          <a
            href="https://metamask.io/download/"
            target="_blank"
            class="text-blue-600 underline"
          >
            Jetzt MetaMask herunterladen
          </a>
        </p>
      </div>
  
      <!-- Login Box -->
      <div class="min-h-screen flex items-center justify-center">
        <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center z-10 relative">
          <h2 class="text-2xl font-bold mb-6">Login</h2>
  
          <p class="text-sm text-gray-600 mb-2">
            Als Login würde z.B. <strong>Veridian.ID</strong> verwendet werden,<br>
            dies ist aber <strong>nicht implementiert</strong>.
          </p>
  
          <div class="mt-6">
            <button
              @click="loginAs('doctor')"
              class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
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
  
  const router = useRouter()
  const walletInstalled = ref(false)
  
  onMounted(() => {
    walletInstalled.value = typeof (window as any).ethereum !== 'undefined'
  })
  
  function loginAs(role: string) {
    localStorage.setItem('mockUser', role)
    router.push('/search')
  }
  </script>
  