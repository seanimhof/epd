<script setup lang="ts">
import { getAllAuditLogsByEpdId } from '@/services/auditServices'

// const allLogs = await getAllAuditLogsByEpdId('1111')


</script>

<template>

    <h1 class="text-4xl font-bold my-6 text-center">EPD Audit</h1>

    <div class="flex flew-row gap-4 w-125">
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
       <!-- <div v-for="allLogs" class="mt-2 break-all">
        {{  }}
          
        </div> -->
      </div>

    </div>

</template>



<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
