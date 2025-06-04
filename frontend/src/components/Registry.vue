<script setup lang="ts">
import { ref, watch } from 'vue'
import { BrowserProvider, Contract, keccak256, toUtf8Bytes } from 'ethers'
import abi from '../contracts/registry_abi.json'
import addresses from '../contracts/addresses.json'
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();

const CONTRACT_ADDRESS = addresses.registry

const epdAhvSearch = ref('756.1234.5678.90')
const epdBirthdateSearch = ref('2002-01-01')
const epdId = ref('')
const searchResult = ref<[string, string]| null>(null)

const epdAhvInsert = ref('')
const epdBirthdateInsert = ref('')
const epdProviderNameInsert = ref('')
const epdContactInfoInsert = ref('')

const epdAhvUpdate = ref('')
const epdBirthdateUpdate = ref('')
const epdProviderNameUpdate = ref('')
const epdContactInfoUpdate = ref('')

const epdAhvDelete = ref('')
const epdBirthdateDelete = ref('')
const epdIdDelete = ref('')

let provider: BrowserProvider
let signer: any
let contract: Contract

const init = async () => {
  provider = new BrowserProvider((window as any).ethereum)
  await provider.send("eth_requestAccounts", [])
  signer = await provider.getSigner()
  contract = new Contract(CONTRACT_ADDRESS, abi, signer)
}

const searchEPD = async () => {
  if (!contract) await init()
  const hash = await keccak256(toUtf8Bytes(epdAhvSearch.value + epdBirthdateSearch.value))
  epdId.value = hash
  let value, value2: string
  try {
    [value, value2] = await contract.searchEPD(epdId.value)
    searchResult.value = [value, value2]
    
  } catch (err) {
    $toast.error(`No EPD found for AHV=${epdAhvSearch.value}, Birthdate=${epdBirthdateSearch.value}`);
    searchResult.value = ['', '']
  }
}

const insertEPD = async () => {
  if (!contract) await init()
  let hash = await keccak256(toUtf8Bytes(epdAhvInsert.value + epdBirthdateInsert.value))
  try {
    const tx = await contract.insertEPD(hash, epdProviderNameInsert.value, epdContactInfoInsert.value)
    const res = await tx.wait()
    $toast.success('Sucessfully inserted EPD');
  } catch (err: any) {
    console.log(err)
    if (err?.shortMessage) {
      $toast.error(err.shortMessage);
      console.error("Short message:", err.shortMessage)
    }
    if (err?.reason) {
      $toast.error(err.reason);
      console.error("Revert reason:", err.reason)
    }
    if (err?.data?.message) {
      $toast.error(err.data.message);
      console.error("EVM message:", err.data.message)
    }
    console.error("Full error object:", err)
  }
}

const updateEPD = async () => { 
  if (!contract) await init()
  try {
    let hash = await keccak256(toUtf8Bytes(epdAhvUpdate.value + epdBirthdateUpdate.value))
    const tx = await contract.updateEPD(hash, epdProviderNameUpdate.value, epdContactInfoUpdate.value)
    const res = await tx.wait();
    $toast.success('Sucessfully updated EPD');
  } catch (err: any) {
    if (err?.shortMessage) {
      console.error("Short message:", err.shortMessage)
    }
    if (err?.reason) {
      $toast.error(`Failed to update EPD, reason=${err.reason}`);
      console.error("Revert reason:", err.reason)
    }
    if (err?.data?.message) {
      console.error("EVM message:", err.data.message)
    }
    console.error("Full error object:", err)
  }
  
}

const deleteEPD = async () => { 
if (!contract) await init()
  try {
    let hash = await keccak256(toUtf8Bytes(epdAhvDelete.value + epdBirthdateDelete.value))
    const tx = await contract.deleteEPD(hash)
    const res = await tx.wait();
    $toast.success('Sucessfully deleted EPD');
  } catch (err: any) {
    if (err?.reason) {
      $toast.error(`Failed to delete EPD, reason=${err.reason}`);
      console.error("Short message:", err.reason)
    }
    console.error("Full error object:", err)
  }

}

watch([epdAhvDelete, epdBirthdateDelete], async ([ahv, birthdate]) => {
  if (!ahv || !birthdate) {
    epdIdDelete.value = ''
    return
  }
  epdIdDelete.value = await keccak256(toUtf8Bytes(ahv + birthdate))
});

</script>

<template>

    <h1 class="text-4xl font-bold my-6 text-center">EPD Registry</h1>

    <div class="grid grid-cols-4 gap-4 max-w-full w-full">
      
      <div class="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl text-center font-semibold mb-4">Search</h2>
        <input v-model="epdAhvSearch" placeholder="AHV" class="border px-3 py-2 w-full rounded mb-4 dark:text-white" />
        <input v-model="epdBirthdateSearch" type="date" placeholder="Birthdate" class="border px-3 py-2 w-full rounded mb-4 dark:text-white" />
        <button @click="searchEPD" class="bg-green-500 dark:text-white px-4 py-2 rounded w-full mb-4">Search</button>
        <div v-if="searchResult && searchResult[0].length" class="mt-2 break-all">
          <p class="font-mono">ID: {{ epdId }}</p>
          <p class="font-mono">Stammgemeinschaf: {{ searchResult[0] }} </p>
          <p class="font-mono">Kommunikation: {{ searchResult[1] }} </p>
        </div>
        <p v-else-if="epdId" class="text-red-400 break-all">No EPD found with the ID: {{ epdId }}</p>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 class="text-xl text-center font-semibold mb-4 pb-2">Insert</h2>
        <input v-model="epdAhvInsert" placeholder="AHV" class="border px-3 py-2 w-full rounded mb-4 dark:text-white" />
        <input v-model="epdBirthdateInsert" type="date" placeholder="Birthdate" class="border px-3 py-2 w-full rounded mb-4 dark:text-white" />
        <input v-model="epdProviderNameInsert" placeholder="EPD Provider" class="border px-3 py-2 w-full rounded mb-4 dark:text-white" />
        <input v-model="epdContactInfoInsert" placeholder="EPD Contact Info" class="border px-3 py-2 w-full rounded mb-4 dark:text-white" />
        <button @click="insertEPD" class="bg-blue-500 dark:text-white px-4 py-2 rounded w-full">Insert</button>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 class="text-xl text-center  font-semibold mb-4 pb-2">Update</h2>
        <input v-model="epdAhvUpdate" placeholder="AHV" class="border px-3 py-2 w-full rounded mb-4 dark:text-white" />
        <input v-model="epdBirthdateUpdate" type="date" placeholder="Birthdate" class="border px-3 py-2 w-full rounded mb-4 dark:text-white" />
        <input v-model="epdProviderNameUpdate" placeholder="EPD Provider" class="border px-3 py-2 w-full rounded mb-4 dark:text-white" />
        <input v-model="epdContactInfoUpdate" placeholder="EPD Contact Info" class="border px-3 py-2 w-full rounded mb-4 dark:text-white" />
        <button @click="updateEPD" class="bg-blue-500 dark:text-white px-4 py-2 rounded w-full">Update</button>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 class="text-xl text-center  font-semibold mb-4 pb-2">Delete</h2>
        <input v-model="epdAhvDelete" placeholder="AHV" class="border px-3 py-2 w-full rounded mb-4 dark:text-white" />
        <input v-model="epdBirthdateDelete" type="date" placeholder="Birthdate" class="border px-3 py-2 w-full rounded mb-4 dark:text-white" />
        <input v-model="epdIdDelete" placeholder="ID" class="border px-3 py-2 w-full rounded mb-4 dark:text-white"/>
        <button @click="deleteEPD" class="bg-red-500 dark:text-white px-4 py-2 rounded w-full">Delete</button>
      </div>

    </div>

</template>



<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
