import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteDraft, listOrders } from '../access/orders'
import { getUser } from '../access/users'
import { EmptyState } from '../components/EmptyState'
import { useCurrentUser } from '../context/UserContext'
import { getOrderType, listOrderTypes } from '../registry/orderTypes'
import type { OrderStatus } from '../types/order'

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString()
}

export function DashboardPage() {
  const { currentUser } = useCurrentUser()
  const [status, setStatus] = useState<'all' | OrderStatus>('all')
  const [typeKey, setTypeKey] = useState('all')
  const [revision, setRevision] = useState(0)
  const types = listOrderTypes()
  const orders = useMemo(
    () => listOrders(currentUser.id),
    [currentUser.id, revision],
  )

  const visible = orders.filter((order) => {
    const matchesStatus = status === 'all' || order.status === status
    const matchesType = typeKey === 'all' || order.typeKey === typeKey
    return matchesStatus && matchesType
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Orders</h1>
        <p className="mt-1 text-sm text-stone-600">
          Drafts are private to you. Submitted orders are visible to every user.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm text-stone-600">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as 'all' | OrderStatus)}
            className="rounded-md border border-stone-300 bg-white px-2 py-1 text-sm text-stone-900"
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-600">
          Type
          <select
            value={typeKey}
            onChange={(event) => setTypeKey(event.target.value)}
            className="rounded-md border border-stone-300 bg-white px-2 py-1 text-sm text-stone-900"
          >
            <option value="all">All</option>
            {types.map((type) => (
              <option key={type.key} value={type.key}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          body="Start a request from the catalog. Incomplete drafts still save and will appear here."
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No orders match these filters"
          body="Clear the status or type filter to see the rest of the history you can access."
        />
      ) : (
        <ul className="divide-y divide-stone-200 overflow-hidden rounded-lg border border-stone-200 bg-white">
          {visible.map((order) => {
            const definition = getOrderType(order.typeKey)
            const creator = getUser(order.creatorId)
            const canDelete = order.status === 'draft' && order.creatorId === currentUser.id
            return (
              <li key={order.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-900">{definition.label}</p>
                  <p className="mt-1 text-xs text-stone-500">
                    {order.status === 'draft' ? 'Draft' : 'Submitted'} · {creator.name} · updated{' '}
                    {formatWhen(order.updatedAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/orders/${order.id}`}
                    className="rounded-md border border-stone-300 px-3 py-1.5 text-sm text-stone-800"
                  >
                    {order.status === 'draft' && order.creatorId === currentUser.id
                      ? 'Continue'
                      : 'View'}
                  </Link>
                  {canDelete ? (
                    <button
                      type="button"
                      className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-800"
                      onClick={() => {
                        if (!window.confirm('Delete this draft? This cannot be undone.')) return
                        deleteDraft(currentUser.id, order.id)
                        setRevision((value) => value + 1)
                      }}
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
