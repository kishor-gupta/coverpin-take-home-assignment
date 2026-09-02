import { USER_IDS, type User, type UserId } from '../types/order'

export const USERS: User[] = [
  { id: 'kg', name: 'Kishor' },
  { id: 'sm', name: 'Sumit' },
]

const USER_STORAGE_KEY = 'coverpin.currentUser'

export function isUserId(value: string): value is UserId {
  return (USER_IDS as readonly string[]).includes(value)
}

export function getUser(id: UserId): User {
  const user = USERS.find((item) => item.id === id)
  if (!user) {
    throw new Error(`Unknown user: ${id}`)
  }
  return user
}

export function readStoredUserId(): UserId {
  const stored = sessionStorage.getItem(USER_STORAGE_KEY)
  if (stored && isUserId(stored)) return stored
  return 'kg'
}

export function writeStoredUserId(id: UserId): void {
  sessionStorage.setItem(USER_STORAGE_KEY, id)
}
