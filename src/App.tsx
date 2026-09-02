import { USERS } from './access/users'
import { listOrders } from './access/orders'
import { UserProvider, useCurrentUser } from './context/UserContext'
import type { UserId } from './types/order'

function Shell() {
  const { currentUser, setCurrentUserId } = useCurrentUser()
  const visible = listOrders(currentUser.id)

  return (
    <div className="min-h-svh bg-[#f4f2ee] p-8">
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
      <p className="mt-4 text-sm text-stone-600">
        {visible.length} visible orders for {currentUser.name}. Drafts stay private; submitted
        orders are shared.
      </p>
    </div>
  )
}

export default function App() {
  return (
    <UserProvider>
      <Shell />
    </UserProvider>
  )
}
