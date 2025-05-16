import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PageSettingsForm from '../components/forms/PageSettingsForm.jsx'
import PageButtonsForm from '../components/forms/PageButtonsForm.jsx'
import PageLinksForm from '../components/forms/PageLinksForm.jsx'
import UsernameForm from '../components/forms/UsernameForm.jsx'

export default function AccountPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [page, setPage] = useState(null)
  const desiredUsername = searchParams.get('desiredUsername')

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }
      setSession(session)

      const { data: page } = await supabase
        .from('pages')
        .select('*')
        .eq('owner_id', session.user.id)
        .single()

      setPage(page)
    }
    getSession()
  }, [navigate])

  if (!session) return null

  if (page) {
    return (
      <>
        <PageSettingsForm page={page} user={session.user} />
        <PageButtonsForm page={page} user={session.user} />
        <PageLinksForm page={page} user={session.user} />
      </>
    )
  }

  return (
    <div>
      <UsernameForm desiredUsername={desiredUsername} />
    </div>
  )
}