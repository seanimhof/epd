export enum AccessType {
    Read = 'read',
    Write = 'write',
    Emergency = 'emergency'
}

export interface AuditEntry {
    Initiator: string;
    Timestamp: Date;
    accessType: AccessType; // Using the enum here
}

export async function getAuditEntries(hash: string): Promise<AuditEntry[]> {
    return [
        {
            'Initiator': 'A',
            'Timestamp': new Date(2024, 3, 31, 12, 15, 45, 300),
            'accessType': AccessType.Read, // English enum
        },
        {
            'Initiator': 'B',
            'Timestamp': new Date(2025, 3, 31, 12, 15, 45, 300),
            'accessType': AccessType.Write, // English enum
        }
    ]
}

export async function writeAccess(): Promise<void> {
    console.log('Write access logged');
}

export async function readAccess(): Promise<void> {
    console.log('Read access logged');
}

export async function emergencyAccess(): Promise<void> {
    console.log('Emergency access logged');
}
