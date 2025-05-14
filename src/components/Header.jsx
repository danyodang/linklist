import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import LogoutButton from './buttons/LogoutButton'

export default function Header() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    getSession()
  }, [])

  return (
    <header className="bg-white border-b py-4">
      <div className="max-w-4xl flex justify-between mx-auto px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-blue-500">
            <FontAwesomeIcon icon={faLink} className="text-blue-500" />
            <span className="font-bold">LinkList</span>
          </Link>
          <nav className="flex items-center gap-4 text-slate-500 text-sm">
            <Link to="/about">About</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
        <nav className="flex items-center gap-4 text-sm text-slate-500">
          {session && (
            <>
              <Link to="/app/account">
                Hello, {session.user.user_metadata.full_name || session.user.email}
              </Link>
              <LogoutButton />
            </>
          )}
          {!session && (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/login">Create Account</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}