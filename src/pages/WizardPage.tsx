import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getOrder, saveDraft, submitOrder } from '../access/orders'
import { ValidationError } from '../access/errors'
import { getUser } from '../access/users'
import { useCurrentUser } from '../context/UserContext'
import { getOrderType } from '../registry/orderTypes'
import { REVIEW_AND_PLACE } from '../sections/keys'
import { OrderSummary } from '../runtime/OrderSummary'
import { SectionRenderer } from '../runtime/SectionRenderer'
import { asSectionValues, setSectionField } from '../runtime/sectionValues'
import { errorsForSection, firstSectionWithErrors, validateOrder } from '../runtime/validation'

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString()
}

export function WizardPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useCurrentUser()
  const loaded = getOrder(currentUser.id, id)
  const [values, setValues] = useState<Record<string, unknown>>(loaded?.values ?? {})
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [savedAt, setSavedAt] = useState<string | null>(loaded?.updatedAt ?? null)
  const [saveNote, setSaveNote] = useState<string | null>(null)
  const [placing, setPlacing] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const definition = useMemo(
    () => (loaded ? getOrderType(loaded.typeKey) : null),
    [loaded],
  )

  useEffect(() => {
    const order = getOrder(currentUser.id, id)
    if (!order) return
    const nextDefinition = getOrderType(order.typeKey)
    setValues(order.values)
    setSavedAt(order.updatedAt)
    setErrors({})
    setSaveNote(null)
    setFormError(null)
    setStep(order.status === 'submitted' ? nextDefinition.sections.length - 1 : 0)
  }, [currentUser.id, id])

  if (!loaded || !definition) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-6">
        <h1 className="text-lg font-semibold text-stone-900">Order unavailable</h1>
        <p className="mt-2 text-sm text-stone-600">
          This draft is hidden from other users, or it no longer exists.
        </p>
        <Link to="/orders" className="mt-4 inline-block text-sm text-stone-900 underline">
          Back to orders
        </Link>
      </div>
    )
  }

  const order = loaded
  const typeDef = definition
  const readOnly = order.status === 'submitted' || order.creatorId !== currentUser.id
  const section = typeDef.sections[step] ?? typeDef.sections[0]
  const isReview = section.sectionKey === REVIEW_AND_PLACE
  const sectionErrors = errorsForSection(errors, section.key)

  function persist(nextValues: Record<string, unknown>): void {
    const saved = saveDraft(currentUser.id, order.id, nextValues)
    setSavedAt(saved.updatedAt)
    setSaveNote(`Draft saved at ${formatWhen(saved.updatedAt)}`)
  }

  function handleChange(fieldKey: string, value: unknown): void {
    const next = setSectionField(values, section.key, fieldKey, value)
    setValues(next)
    setErrors((current) => {
      const copy = { ...current }
      delete copy[`${section.key}.${fieldKey}`]
      return copy
    })
  }

  function handleSave(): void {
    persist(values)
  }

  function handlePlace(): void {
    setPlacing(true)
    setFormError(null)
    try {
      persist(values)
      const validation = validateOrder(typeDef, values)
      if (!validation.ok) {
        setErrors(validation.errors)
        const first = firstSectionWithErrors(typeDef, validation.errors)
        if (first) {
          const index = typeDef.sections.findIndex((item) => item.key === first)
          if (index >= 0) setStep(index)
        }
        setFormError('Fix the highlighted fields before placing this order.')
        return
      }
      submitOrder(currentUser.id, order.id)
      navigate('/orders')
    } catch (error) {
      if (error instanceof ValidationError) {
        setErrors(error.errors)
        setFormError(error.message)
        return
      }
      setFormError(error instanceof Error ? error.message : 'Could not place order')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
          {typeDef.category}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
          {typeDef.label}
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          {order.status === 'submitted'
            ? `Placed by ${getUser(order.creatorId).name}`
            : 'Incomplete fields still save. Placement validates the full form.'}
        </p>
      </div>

      <ol className="flex flex-wrap gap-2">
        {typeDef.sections.map((item, index) => (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => setStep(index)}
              className={`rounded-full px-3 py-1 text-xs ${
                index === step ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 ring-1 ring-stone-300'
              }`}
            >
              {index + 1}. {item.title}
            </button>
          </li>
        ))}
      </ol>

      {saveNote ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {saveNote}
        </div>
      ) : null}
      {formError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {formError}
        </div>
      ) : null}

      <div className="rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-stone-900">{section.title}</h2>
        {section.description ? (
          <p className="mt-1 mb-4 text-sm text-stone-600">{section.description}</p>
        ) : (
          <div className="mb-4" />
        )}

        {isReview ? (
          <div className="mb-6 rounded-md bg-stone-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-stone-900">Order summary</h3>
            <OrderSummary definition={typeDef} values={values} />
          </div>
        ) : null}

        <SectionRenderer
          section={section}
          values={asSectionValues(values, section.key)}
          errors={sectionErrors}
          handlers={{
            onChange: handleChange,
            onPlaceOrder: readOnly ? undefined : handlePlace,
          }}
          state={{ disabled: readOnly, placing }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => {
              if (!readOnly) persist(values)
              setStep((current) => Math.max(0, current - 1))
            }}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            disabled={step >= typeDef.sections.length - 1}
            onClick={() => {
              if (!readOnly) persist(values)
              setStep((current) => Math.min(typeDef.sections.length - 1, current + 1))
            }}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
        <div className="flex items-center gap-3">
          {savedAt ? <p className="text-xs text-stone-500">Last written {formatWhen(savedAt)}</p> : null}
          {!readOnly ? (
            <button
              type="button"
              onClick={handleSave}
              className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm"
            >
              Save draft
            </button>
          ) : null}
          <Link to="/orders" className="text-sm text-stone-700 underline">
            Back to orders
          </Link>
        </div>
      </div>
    </div>
  )
}
