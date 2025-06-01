<template>
  <div class="min-h-[calc(100vh-128px)] flex flex-col items-center justify-center text-center">
    <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-8">
      Welcome to the EPD Registry and Audit Demo
    </h1>

    <div class="flex gap-6">
      <button
        @click="goTo('registry')"
        class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Go to Registry
      </button>

      <button
        @click="goTo('audit')"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go to Audit
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goTo(path: string) {
  router.push({ name: path === 'registry' ? 'Registry' : 'Audit' })
}
</script>