import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listCategories, listOrderTypes } from '../registry/orderTypes'
import { EmptyState } from '../components/EmptyState'

export function CatalogPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const types = listOrderTypes()
  const categories = listCategories()

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return types.filter((type) => {
      const matchesCategory = category === 'all' || type.category === category
      const haystack = `${type.label} ${type.description} ${type.category}`.toLowerCase()
      const matchesQuery = needle.length === 0 || haystack.includes(needle)
      return matchesCategory && matchesQuery
    })
  }, [category, query, types])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Service catalog</h1>
        <p className="mt-1 text-sm text-stone-600">
          Choose an offering to start a multi-step intake. Progress is saved locally as a draft.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search services"
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`rounded-full px-3 py-1 text-xs ${category === 'all' ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 ring-1 ring-stone-300'}`}
          >
            All
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-3 py-1 text-xs ${category === item ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 ring-1 ring-stone-300'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No services match"
          body="Try a different search term or category. The catalog is driven by registered order types."
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {visible.map((type) => (
            <li key={type.key} className="rounded-lg border border-stone-200 bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                {type.category}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-stone-900">{type.label}</h2>
              <p className="mt-2 text-sm text-stone-600">{type.description}</p>
              <p className="mt-3 text-xs text-stone-500">{type.sections.length} sections</p>
              <Link
                to={`/orders/new/${type.key}`}
                className="mt-4 inline-flex rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white"
              >
                Start request
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
