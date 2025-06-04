import { BrowserProvider, Contract, keccak256, toUtf8Bytes } from 'ethers'
import abi from '@/contracts/registry_abi.json'
import addresses from '@/contracts/addresses.json'

const CONTRACT_ADDRESS = addresses.registry

let contract: Contract | null = null
let initPromise: Promise<Contract> | null = null

async function initContract(): Promise<Contract> {
    if (contract) return contract
    if (initPromise) return initPromise

    initPromise = (async () => {
        const provider = new BrowserProvider((window as any).ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = await provider.getSigner()
        contract = new Contract(CONTRACT_ADDRESS, abi, signer)
        return contract
    })()

    return initPromise
}

export function hashIdentity(ahv: string, birthdate: string): string {
    return keccak256(toUtf8Bytes(ahv + birthdate))
}

export async function searchEPD(hash: string): Promise<[string, string]> {
    const contract = await initContract()
    return contract.searchEPD(hash)
}

export async function insertEPD(ahv: string, birthdate: string, stamm: string, kontakt: string): Promise<void> {
    const contract = await initContract()
    const hash = hashIdentity(ahv, birthdate)
    await contract.insertEPD(hash, stamm, kontakt)
}

export async function updateEPD(hash: string, newStamm: string, newKontakt: string): Promise<void> {
    const contract = await initContract()
    await contract.updateEPD(hash, newStamm, newKontakt)
}

export async function deleteEPD(hash: string): Promise<void> {
    const contract = await initContract()
    await contract.deleteEPD(hash)
}
