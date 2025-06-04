<template>
<div class="mt-10 border-t border-gray-300 dark:border-gray-600 pt-6">
    <h3 class="text-xl font-semibold mb-4">Zugriffsverlauf</h3>
    <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
      <li v-for="(entry, index) in auditEntries" :key="index">
        {{ entry.Timestamp }} – Zugriff durch {{ entry.Initiator }} ({{ accessTypeGerman(entry.accessType) }})
      </li>
    </ul>
  </div>
</template>


<script setup lang="ts">
  import { getAuditEntries } from '@/services/auditService'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
  const auditEntries = ref<any[]>([])
    const error = ref('')

    const route = useRoute()

      function accessTypeGerman(acessType: any): any {
          return accessType;
      }
  const id = route.params.id as string

onMounted(async () => {
    try {
      auditEntries.value = await getAuditEntries(id)
    } catch (err) {
      error.value = 'EPD konnte nicht geladen werden.'
    } finally {

    }
  })
</script>
