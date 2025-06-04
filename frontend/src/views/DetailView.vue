<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div  v-if="role !== 'oeffentlich'" class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-4xl">
      <h2 class="text-2xl font-bold mb-6 text-center">EPD-Details</h2>

      <div v-if="loading" class="text-center text-gray-500 dark:text-gray-400">Lade Daten...</div>
      <div v-else-if="error" class="text-red-600 dark:text-red-400 text-center">{{ error }}</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Patient information -->
        <div>
          <h3 class="text-xl font-semibold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Patienteninformationen</h3>
          <p style="word-wrap: break-word;"><span class="font-semibold">ID:</span> {{ id }}</p>
          <p><strong>Vorname:</strong> {{ patient.vorname }}</p>
          <p><strong>Nachname:</strong> {{ patient.nachname }}</p>
          <p><strong>Geburtsdatum:</strong> {{ patient.geburtsdatum }}</p>
        </div>

        <!-- Documents -->
        <div>
          <h3 class="text-xl font-semibold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Dokumente</h3>

          <ul class="space-y-3 mb-6">
            <li v-for="(doc, index) in documents" :key="index" class="flex justify-between items-center">
              <span>{{ doc.name }}</span>
              <button
                @click="downloadDocument(doc)"
                class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm"
              >
                Download
              </button>
            </li>
          </ul>

          <div class="border-t border-gray-300 dark:border-gray-600 pt-6">
            <h4 class="text-xl font-semibold mb-4">Neues Dokument hochladen</h4>

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

              <p v-if="uploadMessage" class="text-green-600 dark:text-green-400 text-sm mt-2">{{ uploadMessage }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Kontaktinformationen -->
      <div class="mt-10" v-if="editingContact" >
        <h3 class="text-xl font-semibold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Kontaktinformationen</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium">Stammgemeinschaft</label>
            <input v-model="kontakt.stamm" type="text" class="mt-1 block w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label class="block text-sm font-medium">Kontaktdetails</label>
            <input v-model="kontakt.url" type="text" class="mt-1 block w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white" />
          </div>

          <button @click="saveKontakt" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Speichern</button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 space-y-4">
        <button
          @click="deleteDossier"
          class="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition"
        >
          Dossier löschen
        </button>

        <button
          @click="toggleEditContact"
          class="w-full bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-700 transition"
        >
          {{ editingContact ? 'Abbrechen' : 'Kontaktdetails anpassen' }}
        </button>
      </div>

      <!-- Back Link -->
      <div class="text-center mt-8">
        <RouterLink to="/search" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">Zurück zur Suche</RouterLink>
      </div>
    </div>
    <div v-else class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-4xl">
      <h2 class="text-2xl font-bold mb-6 text-center">Kein Zugriff auf Dossier</h2>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { writeAccess, readAccess, hashData } from '@/services/auditService'
import { deleteEPD as apiDeleteEPD, updateEPD } from '@/services/registryService'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const id = route.params.id as string
const loading = ref(true)
const error = ref('')
const uploadMessage = ref('')
const editingContact = ref(false)
const role = ref<'oeffentlich' | 'Professor Dr. Franke'>(localStorage.getItem('Role') as 'oeffentlich' | 'Professor Dr. Franke' || 'oeffentlich')

const patient = ref({
  vorname: '',
  nachname: '',
  geburtsdatum: ''
})

const documents = ref<{ name: string }[]>([])

const kontakt = ref<{ stamm: string, url: string }>({
  stamm: '',
  url: ''
})

function loadEPD() {
  const epdRaw = localStorage.getItem(`epd_${id}`)
  if (!epdRaw) {
    const newEPD = {
      patient: {
        vorname: 'Max',
        nachname: 'Muster',
        geburtsdatum: '1990-01-01'
      },
      documents: [],
    }
    localStorage.setItem(`epd_${id}`, JSON.stringify(newEPD))
    Object.assign(patient.value, newEPD.patient)
    documents.value = newEPD.documents
    loading.value = false
    return
  }

  try {
    const epd = JSON.parse(epdRaw)
    patient.value = epd.patient || { vorname: '', nachname: '', geburtsdatum: '' }
    documents.value = epd.documents || []
    kontakt.value = epd.kontakt || { stamm: '', url: '' }
  } catch (err) {
    error.value = 'Fehler beim Laden des EPD.'
  } finally {
    loading.value = false
  }
}

async function downloadDocument(doc: { name: string }) {
  toast.success(`'${doc.name}' wird heruntergeladen (Demo)`)
}
function saveEPD() {
  const epd = {
    patient: patient.value,
    documents: documents.value,
  }
  localStorage.setItem(`epd_${id}`, JSON.stringify(epd))
}

async function handleUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  documents.value.push({ name: file.name })
  saveEPD()
  uploadMessage.value = `'${file.name}' erfolgreich hochgeladen (Demo)`
  await writeAccess(id, hashData(file.name))

  setTimeout(() => (uploadMessage.value = ''), 3000)
}

async function deleteDossier() {
  const confirmDelete = window.confirm('Möchten Sie das Dossier wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')
  if (confirmDelete) {
    try {
      localStorage.removeItem(`epd_${id}`)
      await apiDeleteEPD(id)
      toast.success('Dossier wurde erfolgreich gelöscht.')
      router.push({ path: '/search' })
    } catch (error) {
      toast.error('Dossier konnte nicht gelöscht werden')
    }
  }
}

function toggleEditContact() {
  editingContact.value = !editingContact.value
}

async function saveKontakt() {
  const epd = {
    patient: patient.value,
    documents: documents.value,
  }
  localStorage.setItem(`epd_${id}`, JSON.stringify(epd))
  updateEPD(id, kontakt.value.stamm, kontakt.value.url)
  toast.success('Kontaktdaten gespeichert')
  editingContact.value = false
}

onMounted(() => {
  loadEPD()
})
</script>

