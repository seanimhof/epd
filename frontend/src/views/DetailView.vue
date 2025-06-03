<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4 text-center">EPD-Details</h2>
  
        <div v-if="loading" class="text-center text-gray-500">Lade Daten...</div>
        <div v-else-if="error" class="text-red-600 text-center">{{ error }}</div>
        <div v-else>
          <p><strong>Stammgemeinschaft:</strong> {{ stammgemeinschaft }}</p>
          <p class="mt-2"><strong>Kontaktdetails:</strong> {{ kontaktdetails }}</p>
        </div>
  
        <div class="text-center mt-6">
          <RouterLink to="/" class="text-sm text-blue-600 hover:underline">Zurück zur Suche</RouterLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useToast } from 'vue-toast-notification'
  import { searchEPD } from '@/services/registryService'
  
  const route = useRoute()
  const $toast = useToast()
  
  const id = route.params.id as string
  const stammgemeinschaft = ref('')
  const kontaktdetails = ref('')
  const loading = ref(true)
  const error = ref('')
  
  onMounted(async () => {
    try {
      const [stamm, kontakt] = await searchEPDByHash(id)
      stammgemeinschaft.value = stamm
      kontaktdetails.value = kontakt
    } catch (err) {
      error.value = 'EPD konnte nicht gefunden werden.'
    } finally {
      loading.value = false
    }
  })
  
  // Wrapper function that skips hashing
  async function searchEPDByHash(id: string): Promise<[string, string]> {
    const contract = await import('@/services/registryService').then(m => m['initContract']())
    return contract.searchEPD(id)
  }
  </script>
  