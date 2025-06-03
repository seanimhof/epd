import { Contract, BrowserProvider } from 'ethers'
import abi from '@/contracts/audit_abi.json'
import addresses from '@/contracts/addresses.json'

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
    Emergency = 'emergency'
}

export interface AuditEntry {
    Initiator: string;
    Timestamp: string;
    accessType: AccessType; // Using the enum here
}

const formatTimestamp = (timestamp: bigint): string => {
    return new Date(Number(timestamp) * 1000).toLocaleString("de-CH", {
        timeZone: "Europe/Zurich",
        dateStyle: "medium",
        timeStyle: "short",
    })
};
export async function getAuditEntries2(hash: string): Promise<AuditEntry[]> {
    const contract = await initContract()
    const insertedLogs = await contract.queryFilter(contract.filters.AuditLogged())

    return insertedLogs.map(x => {
        const decoded = contract.interface.decodeEventLog("AuditLogged", x.data, x.topics)
        return {
            Initiator: 'Initiator',
            Timestamp: formatTimestamp(decoded.timestamp),
            accessType: decoded.accessType
        };
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
    
    }catch(e: any) {
        console.log(e.message);
    }

    return logs
}

export async function writeAccess(hash: string): Promise<void> {
    const accessor = localStorage.getItem('firstName')
    const contract = await initContract()
    const tx = await contract.addAuditLog(accessor, hash, AccessType.Write)
    await tx.wait()
}

export async function readAccess(hash: string): Promise<void> {
    const accessor = localStorage.getItem('firstName')
    const contract = await initContract()
    const tx = await contract.addAuditLog(accessor, hash, AccessType.Read)
    await tx.wait()
}

export async function emergencyAccess(hash: string): Promise<void> {
    const accessor = localStorage.getItem('firstName')
    const contract = await initContract()

    const tx = await contract.addAuditLog(accessor, hash, AccessType.Emergency)
    await tx.wait()
}
