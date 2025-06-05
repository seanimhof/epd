import { keccak256 } from "ethers"
import { hashIdentity } from "./registryService"

export interface User {
    name: string
    id: string
    isArzt: boolean
}

const defaultUser: User = {
    id: 'public',
    name: 'Öffentlich',
    isArzt: false
}

export function getUsers(): User[] {
    return [
        {
            id: hashIdentity('Arzt ', '#1'),
            name: 'Arzt #123456',
            isArzt: true
        },
        {
            id: hashIdentity('Professor ', '#2'),
            name: 'Professor #987654',
            isArzt: true
        },
        defaultUser
    ]
}

export function getUserIdForAuditLog(hashId: string): string {
    return hashId == hashIdentity('Arzt ', '#1') ? '123456' : '987654'
}

export function getDefaultUser(): User {
    return defaultUser;
}

export function getCurrentUser(): User | undefined {
    const currentUserId = localStorage.getItem('Role')
    return getUsers().filter(x => x.id == currentUserId).at(0);
}

export function setUser(id: string) {
    localStorage.setItem('Role', id)
}