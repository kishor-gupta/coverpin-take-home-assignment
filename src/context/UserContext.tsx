import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { getUser, readStoredUserId, writeStoredUserId } from '../access/users'
import type { User, UserId } from '../types/order'

interface UserContextValue {
  currentUser: User
  setCurrentUserId: (id: UserId) => void
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<UserId>(() => readStoredUserId())
  const value = useMemo<UserContextValue>(
    () => ({
      currentUser: getUser(userId),
      setCurrentUserId: (id) => {
        writeStoredUserId(id)
        setUserId(id)
      },
    }),
    [userId],
  )
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useCurrentUser(): UserContextValue {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useCurrentUser must be used within UserProvider')
  }
  return context
}
