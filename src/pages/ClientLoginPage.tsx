import { useNavigate } from 'react-router-dom'
import ClientLogin from '../components/ClientLogin'
import { useClientAuth } from '../contexts/ClientAuthContext'

export default function ClientLoginPage() {
  const navigate = useNavigate()
  const { login } = useClientAuth()

  return (
    <ClientLogin
      onLogin={(client) => {
        login(client)
        navigate('/panel')
      }}
    />
  )
}


