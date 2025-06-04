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
            id: '0xd3d8c449eb124c9da0f213170f974f3f',
            name: 'Arzt #1',
            isArzt: true
        },
        {
            id: '0xfcd5a3a0129f73e791562a91baf0c301',
            name: 'Arzt #2',
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