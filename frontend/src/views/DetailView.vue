<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div  v-if="getCurrentUser()?.isArzt" class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-7xl">
      <h2 class="text-2xl font-bold mb-6 text-center">EPD-Details</h2>

      <div v-if="loading" class="text-center text-gray-500 dark:text-gray-400">Lade Daten...</div>
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
        <div class="break-all">
          <h3 class="text-xl font-semibold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Dokumente</h3>

          <ul class="space-y-3 mb-6">
            <li
              v-for="(doc, index) in documents"
              :key="index"
              class="flex items-start justify-between gap-4"
            >
              <!-- Allow text to wrap -->
              <span class="flex-1 break-words text-sm">{{ doc.name }}</span>

              <!-- Fixed-width button -->
              <button
                @click="downloadDocument(doc)"
                class="w-32 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                Download
              </button>
            </li>
          </ul>

          <!-- Neues Dokument hochladen -->
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

              <p v-if="pendingFile" class="text-sm text-gray-700 dark:text-gray-300">
                Ausgewählte Datei: <strong>{{ pendingFile.name }}</strong>
              </p>

              <button
                v-if="pendingFile"
                @click="saveAndCloseUpload"
                class="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Kontaktinformationen -->
      <div class="mt-10" v-if="editingContact">
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
      <div class="mt-8 space-y-4 flex flex-col items-center text-center">
        <button
          @click="toggleEditContact"
          class="w-1/2 bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-700 transition"
        >
          {{ editingContact ? 'Abbrechen' : 'Kontaktdetails anpassen' }}
        </button>
        <button
          @click="deleteDossier"
          class="w-1/2 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition"
        >
          Dossier löschen
        </button>
      </div>

      <!-- Back Link -->
      <div class="text-center mt-8 flex justify-center gap-4">
        <RouterLink :to="`/open/${id}`" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Zurück
        </RouterLink>
        <RouterLink :to="`/audit/${id}`" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Audit logs ansehen
        </RouterLink>
      </div>
    </div>

    <!-- Kein Zugriff -->
    <div v-else class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-4xl">
      <h2 class="text-2xl font-bold mb-6 text-center">Kein Zugriff auf Dossier</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { writeAccess, hashData, auditCreationDelete, auditCreationUpdate } from '@/services/auditService'
import { deleteEPD as apiDeleteEPD, updateEPD } from '@/services/registryService'
import { getCurrentUser } from '@/services/userService'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const id = route.params.id as string
const loading = ref(true)
const editingContact = ref(false)
const pendingFile = ref<File | null>(null)

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
    toast.error('Fehler beim Laden des EPD.')
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

function handleUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  pendingFile.value = file
  toast.info(`Datei '${file.name}' ausgewählt. Klicken Sie auf "Speichern".`)
}

async function saveAndCloseUpload() {
  const file = pendingFile.value
  if (!file) return

  const userInteraction = toast.warning("Bevor die Datei gespeichert werden kann, musst du deine Anfrage via Metamask signieren werden.<br/>Nach dem bestätigen kann es einige Sekunden dauern bis die Datei im Dossier erscheint.", {
      duration: 0
    })
  try {
    await writeAccess(id, hashData(file.name))
    userInteraction.dismiss();
    documents.value.push({ name: file.name + " (" + hashData(file.name) + ")" })
    saveEPD()
    toast.success(`'${file.name}' erfolgreich hochgeladen und gespeichert`)
    pendingFile.value = null
  } catch (error) {
    userInteraction.dismiss();
    toast.error("Dokument konnte nicht hochgeladen werden")
  }
}

async function deleteDossier() {
  if(checkDemoDossier(id)) {
    toast.warning('Demo Dossier können nicht gelöscht werden')
    return
  }
  const confirmDelete = window.confirm('Möchten Sie das Dossier wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')
  if (confirmDelete) {

    const userInteraction = toast.warning("Bevor das Dossier gelöscht werden kann, musst du deine Anfrage via Metamask signieren werden.<br/>Nach dem bestätigen kann es einige Sekunden dauern bis das Dossier gelöscht ist.", {
      duration: 0
    })
    try {
      localStorage.removeItem(`epd_${id}`)
      await apiDeleteEPD(id)
      await auditCreationDelete(id, hashData(""));
      userInteraction.dismiss();
      toast.success('Dossier wurde erfolgreich gelöscht.')
      router.push({ path: '/search' })
    } catch (error) {
      userInteraction.dismiss();
      toast.error('Dossier konnte nicht gelöscht werden')
    }
  }
}

function toggleEditContact() {
  editingContact.value = !editingContact.value
}

function checkDemoDossier(id: string): boolean {
  const demoDossierIds: string[] = [
    '0x7e91342f1fe10a13f55046eca6b565e6fc810e59719b34cefbab2d603ead6169', 
    '0x00e5afdac19d2988381fd7b11e8a7c6e7c55f13fd63a6fa45eb554f93f66415d',
    '0x82890cc5629da597e20a74a4e6c22bc8afb3cc9d97f1e56b6017cd82ddd2ce40'
  ]
  return demoDossierIds.includes(id)
}

async function saveKontakt() {
  const epd = {
    patient: patient.value,
    documents: documents.value,
  }

  const userInteraction = toast.warning("Bevor die Kontaktdaten im Dossier angepasst werden können, musst du deine Anfrage via Metamask signieren werden.<br/>Nach dem bestätigen kann es einige Sekunden dauern bis eine Bestätigung erscheint.", {
      duration: 0
    })
  try {
    await updateEPD(id, kontakt.value.stamm, kontakt.value.url)
    await auditCreationUpdate(id, hashData(""));
    userInteraction.dismiss();
    localStorage.setItem(`epd_${id}`, JSON.stringify(epd))
    toast.success('Kontaktdaten gespeichert')
    editingContact.value = false
  } catch (error) {
    userInteraction.dismiss();
    toast.error('Kontaktdaten konnten nicht angepasst werden')
  }
}

onMounted(() => {
  loadEPD()
})
</script>