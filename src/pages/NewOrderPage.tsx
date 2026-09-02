import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createDraft } from '../access/orders'
import { useCurrentUser } from '../context/UserContext'
import { getOrderType } from '../registry/orderTypes'

export function NewOrderPage() {
  const { typeKey = '' } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useCurrentUser()

  useEffect(() => {
    try {
      getOrderType(typeKey)
      const order = createDraft(currentUser.id, typeKey)
      navigate(`/orders/${order.id}`, { replace: true })
    } catch {
      navigate('/', { replace: true })
    }
  }, [currentUser.id, navigate, typeKey])

  return <p className="text-sm text-stone-600">Creating draft…</p>
}
