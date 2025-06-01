<script setup lang="ts">
import { ref, watch } from 'vue'
import { BrowserProvider, Contract } from 'ethers'
import abi from '../contracts/audit_abi.json'
import addresses from '../contracts/addresses.json'

const CONTRACT_ADDRESS = addresses.audit

const accessorId = ref('')
const epdId = ref('')
const accessType = ref('')

let provider: BrowserProvider
let signer: any
let contract: Contract

const init = async () => {
  provider = new BrowserProvider((window as any).ethereum)
  await provider.send("eth_requestAccounts", [])
  signer = await provider.getSigner()
  contract = new Contract(CONTRACT_ADDRESS, abi, signer)
}

const addAuditLog = async () => {
  if (!contract) await init()
  try {
    const tx = await contract.addAuditLog(accessorId.value, epdId.value, accessType.value)
    const res = await tx.wait()
  } catch (err: any) {
    if (err?.shortMessage) {
      console.error("Short message:", err.shortMessage)
    }
    if (err?.reason) {
      console.error("Revert reason:", err.reason)
    }
    if (err?.data?.message) {
      console.error("EVM message:", err.data.message)
    }
    console.error("Full error object:", err)
  }
}

</script>

<template>

    <h1 class="text-4xl font-bold my-6 text-center">EPD Audit</h1>

    <div class="flex flew-row gap-4 w-125">
      
      <div class="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 class="text-xl text-center font-semibold mb-4 pb-2">Add Audit Log</h2>
        <input v-model="accessorId" placeholder="Zugreifer" class="border px-3 py-2 w-full rounded mb-4 text-white" />
        <input v-model="epdId" placeholder="EPD" class="border px-3 py-2 w-full rounded mb-4 text-white" />
        <input v-model="accessType" placeholder="Zugriffsart" class="border px-3 py-2 w-full rounded mb-4 text-white" />
        <button @click="addAuditLog" class="bg-blue-500 text-white px-4 py-2 rounded w-full">Add</button>
      </div>

    </div>

</template>



<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
