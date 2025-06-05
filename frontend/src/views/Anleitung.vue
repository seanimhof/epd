<template>
  <div
    class="min-h-[calc(100vh-5rem)] flex justify-center px-4 py-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-full overflow-x-auto"
  >
    <div class="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <h1 class="text-3xl font-bold mb-6 text-center">Anleitung zur Demo</h1>

      <p class="mb-6 text-center text-gray-700 dark:text-gray-300">
        Diese Demo zeigt, wie das elektronische Patientendossier (EPD) mithilfe der Blockchain verwaltet werden kann.
      </p>

      <!-- Öffentliche Funktionen -->
      <h2 class="text-xl font-semibold mb-3">🔓 Öffentlich zugängliche Funktionen</h2>
      <ul class="list-disc list-inside space-y-2 mb-6">
        <li><strong>EPD suchen</strong>: Eingabe von AHV-Nummer und Geburtsdatum.</li>
        <li><strong>Audit-Historie ansehen</strong>: Einsicht in alle Zugriffe auf ein EPD.</li>
      </ul>

      <!-- Ärzte-Funktionen -->
      <h2 class="text-xl font-semibold mb-3">🩺 Funktionen für Fachpersonen</h2>
      <ul class="list-disc list-inside space-y-2 mb-6">
        <li><strong>EPD öffnen</strong>: Vollständige Einsicht in bestehende Dossiers.</li>
        <li>
          <strong>EPD eintragen</strong>: Neues Dossier erfassen über
          <RouterLink to="/insert" class="underline text-blue-600 dark:text-blue-400">einfügen</RouterLink>.
        </li>
        <li><strong>EPD anpassen</strong>: Kontaktinformationen ändern.</li>
        <li><strong>EPD löschen</strong>: Dossier aus der Registry entfernen.</li>
      </ul>

      <!-- Erste Schritte -->
      <h2 class="text-xl font-semibold mb-3">🚀 Erste Schritte</h2>
      <ol class="list-decimal list-inside space-y-4 text-base leading-relaxed mb-6">
        <li>
          <strong>MetaMask installieren</strong><br />
          Lade
          <a href="https://metamask.io/download" target="_blank" class="underline text-blue-600 dark:text-blue-400">MetaMask</a>
          herunter, um mit der Demo zu interagieren.
        </li>
        <li>
          <strong>Wallet aufladen</strong><br />
          Verwende den
          <a href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" target="_blank" class="underline text-blue-600 dark:text-blue-400">Sepolia Faucet</a>,
          um Test-ETH zu erhalten.
        </li>
        <li>
          <strong>Beispiel-Daten ausprobieren</strong><br />
          Nutze vordefinierte Einträge auf der Startseite zur Demonstration.
        </li>
      </ol>

      <!-- Video-Anleitungen -->
      <h2 class="text-xl font-semibold mb-3">🎥 Video-Anleitungen</h2>
      <div class="space-y-8">
        <div>
          <h3 class="font-semibold mb-2">💰 Wie lade ich mein Wallet auf?</h3>
          <video class="w-full rounded-lg" controls>
            <source :src="walletVideo" type="video/mp4" />
            Dein Browser unterstützt kein Video.
          </video>
        </div>
        <div>
          <h3 class="font-semibold mb-2">📂 Wie kann ich ein Dossier ansehen?</h3>
          <video class="w-full rounded-lg" controls>
            <source :src="viewDossierVideo" type="video/mp4" />
            Dein Browser unterstützt kein Video.
          </video>
        </div>
        <div>
          <h3 class="font-semibold mb-2">📎 Wie lade ich Dokumente ins Dossier?</h3>
          <video class="w-full rounded-lg" controls>
            <source :src="uploadDocumentsVideo" type="video/mp4" />
            Dein Browser unterstützt kein Video.
          </video>
        </div>
        <div>
          <h3 class="font-semibold mb-2">🗑️ Wie erstelle / lösche ich ein Dossier?</h3>
          <video class="w-full rounded-lg" controls>
            <source :src="manageDossierVideo" type="video/mp4" />
            Dein Browser unterstützt kein Video.
          </video>
        </div>
      </div>

      <!-- Zurück zur Startseite -->
      <div class="mt-8 text-center">
        <RouterLink to="/" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition">
          Zurück zur Startseite
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

// Lokale Videodateien importieren
import walletVideo from '@/assets/videos/Wallet aufladen.mov'
import viewDossierVideo from '@/assets/videos/Dossier ansehen.mov'
import uploadDocumentsVideo from '@/assets/videos/EPD suchen - Dokumente eintragen.mp4'
import manageDossierVideo from '@/assets/videos/EPD eintragen_loeschen.mov'
</script>
