<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
        <h2 class="text-2xl font-bold mb-6 text-center">EPD-Details</h2>
  
        <div v-if="loading" class="text-center text-gray-500">Lade Daten...</div>
        <div v-else-if="error" class="text-red-600 text-center">{{ error }}</div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Patienteninformationen -->
          <div>
            <h3 class="text-xl font-semibold mb-4 border-b pb-2">Patienteninformationen</h3>
            <p><strong>Vorname:</strong> {{ patient.vorname }}</p>
            <p><strong>Nachname:</strong> {{ patient.nachname }}</p>
            <p><strong>Geburtsdatum:</strong> {{ patient.geburtsdatum }}</p>
          </div>
  
          <!-- Dokumente -->
          <div>
            <h3 class="text-xl font-semibold mb-4 border-b pb-2">Dokumente</h3>
  
            <ul class="space-y-3 mb-6">
              <li v-for="(doc, index) in documents" :key="index" class="flex justify-between items-center">
                <span>{{ doc.name }}</span>
                <button
                  @click="downloadDocument(doc)"
                  class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                >
                  Download
                </button>
              </li>
            </ul>
  
            <div class="border-t pt-4">
              <h4 class="font-semibold mb-2">Neues Dokument hochladen</h4>
              <input type="file" @change="handleUpload" class="mb-2" />
              <p v-if="uploadMessage" class="text-green-600 text-sm">{{ uploadMessage }}</p>
            </div>
          </div>
        </div>
  
        <!-- Zugriffsverlauf -->
        <div class="mt-10 border-t pt-6">
          <h3 class="text-xl font-semibold mb-4">Zugriffsverlauf</h3>
          <ul class="space-y-2 text-sm text-gray-700">
            <li>03.06.2025 – Hirslanden Klinik – Zugriff durch Dr. Schmid</li>
            <li>29.05.2025 – Medbase Zürich – Zugriff durch Dr. Meier</li>
            <li>15.05.2025 – Apotheke Müller – Rezept abgerufen</li>
          </ul>
        </div>
  
        <div class="text-center mt-8">
          <RouterLink to="/" class="text-sm text-blue-600 hover:underline">Zurück zur Suche</RouterLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useToast } from 'vue-toast-notification'
  
  const route = useRoute()
  const $toast = useToast()
  
  const id = route.params.id as string
  const loading = ref(true)
  const error = ref('')
  const uploadMessage = ref('')
  
  // Mocked patient info
  const patient = ref({
    vorname: 'Max',
    nachname: 'Muster',
    geburtsdatum: '1990-01-01'
  })
  
  // Mocked document list
  const documents = ref([
    { name: 'Impfpass.pdf' },
    { name: 'Röntgenaufnahme.jpg' },
    { name: 'Blutwerte_2024.pdf' }
  ])
  
  onMounted(async () => {
    
    try {
        /*
      const contract = await initContract()
      await contract.searchEPD(id) // still validates the EPD exists
      */
    } catch (err) {
      error.value = 'EPD konnte nicht geladen werden.'
    } finally {
      loading.value = false
    }
  })
  
  // Mock download
  function downloadDocument(doc: { name: string }) {
    $toast.success(`'${doc.name}' wird heruntergeladen (Demo)`)
  }
  
  // Mock upload
  function handleUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    documents.value.push({ name: file.name })
    uploadMessage.value = `'${file.name}' erfolgreich hochgeladen (Demo)`
    setTimeout(() => (uploadMessage.value = ''), 3000)
  }
  </script>
  