<script setup lang="ts">

</script>

<template>
  <div class="min-h-screen">
  <nav class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo / Title -->
        <router-link
            to="/epd-frontend"
            class="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white transition"
            active-class="bg-gray-200 dark:bg-gray-800 font-semibold"
            exact
          >
            EPD
          </router-link>

        <!-- Navigation Links -->
        <div class="flex space-x-4">
          

          <router-link
            to="/epd-frontend/registry"
            class="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white transition"
            active-class="bg-gray-200 dark:bg-gray-800 font-semibold"
          >
            Registry
          </router-link>

          <router-link
            to="/epd-frontend/audit"
            class="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white transition"
            active-class="bg-gray-200 dark:bg-gray-800 font-semibold"
          >
            Audit
          </router-link>
        </div>
      </div>
    </div>
  </nav>

  <main>
      <router-view />
    </main>
  </div>
</template>



<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
