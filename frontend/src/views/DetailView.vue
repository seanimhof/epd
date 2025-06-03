<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
        <h2 class="text-2xl font-bold mb-6 text-center">EPD-Details</h2>
  
        <div v-if="loading" class="text-center text-gray-500">Lade Daten...</div>
        <div v-else-if="error" class="text-red-600 text-center">{{ error }}</div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Patient information -->
          <div>
            <h3 class="text-xl font-semibold mb-4 border-b pb-2">Patienteninformationen</h3>
            <p><strong>Vorname:</strong> {{ patient.vorname }}</p>
            <p><strong>Nachname:</strong> {{ patient.nachname }}</p>
            <p><strong>Geburtsdatum:</strong> {{ patient.geburtsdatum }}</p>
          </div>
  
          <!-- Documents -->
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
  
            <div class="border-t pt-6">
              <h4 class="text-xl font-semibold mb-4">Neues Dokument hochladen</h4>
              
              <!-- File Upload Section -->
              <div class="flex flex-col items-start space-y-4">
                <label for="file-upload" class="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition duration-200">
                  <span>Dokument auswählen</span>
                  <input 
                    id="file-upload" 
                    type="file" 
                    @change="handleUpload" 
                    class="hidden"
                  />
                </label>
  
                <p v-if="uploadMessage" class="text-green-600 text-sm mt-2">{{ uploadMessage }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Access Log -->
        <div class="mt-10 border-t pt-6">
          <h3 class="text-xl font-semibold mb-4">Zugriffsverlauf</h3>
          <ul class="space-y-2 text-sm text-gray-700">
            <li v-for="(entry, index) in auditEntries" :key="index">
              {{ entry.Timestamp.toLocaleString() }} – Zugriff durch {{ entry.Initiator }} ({{ accessTypeGerman(entry.accessType) }})
            </li>
          </ul>
        </div>
  
        <!-- Additional buttons for "Delete Dossier" and "Edit Contact Details" -->
        <div class="mt-8 space-y-4">
          <button
            @click="deleteDossier"
            class="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition"
          >
            Dossier löschen
          </button>
  
          <button
            @click="editContactDetails"
            class="w-full bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-700 transition"
          >
            Kontaktdetails anpassen
          </button>
        </div>
  
        <div class="text-center mt-8">
          <RouterLink to="/" class="text-sm text-blue-600 hover:underline">Zurück zur Suche</RouterLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useToast } from 'vue-toast-notification'
  import { writeAccess, readAccess, emergencyAccess, getAuditEntries, AccessType } from '@/services/auditService'
import { deleteEPD, updateEPD } from '@/services/registryService'
  
  const route = useRoute()
  const $router = useRouter()
  const $toast = useToast()
  
  const id = route.params.id as string
  const loading = ref(true)
  const error = ref('')
  const uploadMessage = ref('')
  const auditEntries = ref<any[]>([])
  
  const patient = ref({
    vorname: 'Max',
    nachname: 'Muster',
    geburtsdatum: '1990-01-01'
  })
  
  const documents = ref([
    { name: 'Impfpass.pdf' },
    { name: 'Röntgenaufnahme.jpg' },
    { name: 'Blutwerte_2024.pdf' }
  ])
  
  onMounted(async () => {
    try {
      auditEntries.value = await getAuditEntries(id)
    } catch (err) {
      error.value = 'EPD konnte nicht geladen werden.'
    } finally {
      loading.value = false
    }
  })
  
  async function downloadDocument(doc: { name: string }) {
    await readAccess()
    await reloadAuditLog()
    $toast.success(`'${doc.name}' wird heruntergeladen (Demo)`)
  }
  
  async function handleUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    documents.value.push({ name: file.name })
    uploadMessage.value = `'${file.name}' erfolgreich hochgeladen (Demo)`
    await writeAccess()
    await reloadAuditLog()
    setTimeout(() => (uploadMessage.value = ''), 3000)
  }
  
  async function reloadAuditLog() {
    try {
      auditEntries.value = await getAuditEntries(id)
    } catch (err) {
      console.error('Failed to reload audit log:', err)
    }
  }
  
  function accessTypeGerman(accessType: AccessType): string {
    switch (accessType) {
      case AccessType.Read:
        return 'Lesen';
      case AccessType.Write:
        return 'Schreiben';
      case AccessType.Emergency:
        return 'Notfall';
      default:
        return '';
    }
  }
  
  async function deleteDossier() {
    const confirmDelete = window.confirm('Möchten Sie das Dossier wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')
    if (confirmDelete) {
        try {
            await deleteEPD(id)
            $toast.success('Dossier wurde erfolgreich gelöscht.')
            $router.push({ path: '/search' })
        } catch (error) {
            $toast.error('Dossier konnte nicht gelöscht werden')
        }
      
    }
  }
  
  async function editContactDetails() {
  
  }
  </script>
  
  <style scoped>
  /* Custom styling for the delete and edit buttons */
  .bg-red-600 {
    background-color: #e53e3e;
  }
  
  .bg-red-600:hover {
    background-color: #c53030;
  }
  
  .bg-yellow-600 {
    background-color: #d69e2e;
  }
  
  .bg-yellow-600:hover {
    background-color: #b7791f;
  }
  
  .shadow-md {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  }
  </style>
  