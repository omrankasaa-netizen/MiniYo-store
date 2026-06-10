import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export function AdminSetupPage() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/admin/login', { replace: true })
  }, [navigate])

  return null
}
