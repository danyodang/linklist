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
    <header className="bg-black text-white border-b border-white py-4">
      <div className="max-w-4xl flex justify-between mx-auto px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-white">
            <FontAwesomeIcon icon={faLink} className="text-white" />
            <span className="font-mono font-bold tracking-tighter">HYPRLINK</span>
          </Link>
          <nav className="flex items-center gap-4 text-white text-sm">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/pricing" className="hover:underline">Pricing</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </nav>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          {session && (
            <>
              <Link to="/app/account" className="hover:underline">
                Hello, {session.user.user_metadata.full_name || session.user.email}
              </Link>
              <LogoutButton className="bg-white text-black px-4 py-2 hover:bg-gray-200 transition-colors" />
            </>
          )}
          {!session && (
            <>
              <Link to="/login" className="hover:underline">Sign In</Link>
              <Link to="/login" className="bg-white text-black px-4 py-2 hover:bg-gray-200 transition-colors">Create Account</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}