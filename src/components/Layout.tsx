import { NavLink, Outlet } from 'react-router-dom'
import { USERS } from '../access/users'
import { useCurrentUser } from '../context/UserContext'
import type { UserId } from '../types/order'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm ${isActive ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-200'}`

export function Layout() {
  const { currentUser, setCurrentUserId } = useCurrentUser()

  return (
    <div className="min-h-svh">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-6">
            <p className="text-sm font-semibold tracking-tight text-stone-900">
              Order Infrastructure
            </p>
            <nav className="flex gap-1">
              <NavLink to="/" end className={linkClass}>
                Catalog
              </NavLink>
              <NavLink to="/orders" className={linkClass}>
                Orders
              </NavLink>
            </nav>
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-600">
            Acting as
            <select
              value={currentUser.id}
              onChange={(event) => setCurrentUserId(event.target.value as UserId)}
              className="rounded-md border border-stone-300 bg-white px-2 py-1 text-sm text-stone-900"
            >
              {USERS.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
