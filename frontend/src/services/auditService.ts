import { Contract, BrowserProvider, keccak256, toUtf8Bytes } from 'ethers'
import abi from '@/contracts/audit_abi.json'
import addresses from '@/contracts/addresses.json'
import { getCurrentUser } from './userService'

const CONTRACT_ADDRESS = addresses.audit

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

export enum AccessType {
    Read = 'read',
    Write = 'write',
    Emergency = 'emergency',
    Create = 'create'
}

export interface AuditEntry {
    Initiator: string;
    Timestamp: string;
    accessType: AccessType;
}

const formatTimestamp = (timestamp: bigint): string => {
    return new Date(Number(timestamp) * 1000).toLocaleString("de-CH", {
        timeZone: "Europe/Zurich",
        dateStyle: "medium",
        timeStyle: "short",
    })
}

async function getCurrentAddress(): Promise<string> {
    const provider = new BrowserProvider((window as any).ethereum)
    const signer = await provider.getSigner()
    return signer.getAddress()
}

export async function getAuditEntries2(hash: string): Promise<AuditEntry[]> {
    const contract = await initContract()
    const insertedLogs = await contract.queryFilter(contract.filters.AuditLogged())

    return insertedLogs.map(x => {
        const decoded = contract.interface.decodeEventLog("AuditLogged", x.data, x.topics)
        return {
            Initiator: decoded.accessor, // assuming your contract emits this
            Timestamp: formatTimestamp(decoded.timestamp),
            accessType: decoded.accessType
        }
    })
}

export async function getAuditEntries(epdId: string): Promise<AuditEntry[]> {
    let logs = []
    if (!contract) await initContract()
    try {
        const count = await contract!.getEpdLogCount(epdId)
        logs = await Promise.all(
            Array.from({ length: Number(count) }, (_, i) =>
                contract!.getEpdLogByIndex(epdId, i)
            )
        )
    } catch (e: any) {
        console.log(e.message)
    }

    return logs
}

export function hashData(data: string): string {
    return keccak256(toUtf8Bytes(data))
}

// Shared logging function
async function logAccess(type: AccessType, hash: string, dataHash: string): Promise<void> {
    const accessor = getCurrentUser()?.id
    const contract = await initContract()
    const tx = await contract.addAuditLog(accessor, hash, type, dataHash)
    await tx.wait()
}

// Public API
export const writeAccess = (hash: string, dataHash: string) =>
    logAccess(AccessType.Write, hash, dataHash)

export const readAccess = (hash: string, dataHash: string) =>
    logAccess(AccessType.Read, hash, dataHash)

export const emergencyAccess = (hash: string, dataHash: string) =>
    logAccess(AccessType.Emergency, hash, dataHash)

export const auditCreation = (hash: string, dataHash: string) =>
    logAccess(AccessType.Create, hash, dataHash)
