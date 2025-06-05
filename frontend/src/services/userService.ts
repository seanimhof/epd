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
            name: 'Arzt #1',
            isArzt: true
        },
        {
            id: hashIdentity('Professor ', '#2'),
            name: 'Professor #2',
            isArzt: true
        },
        defaultUser
    ]
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