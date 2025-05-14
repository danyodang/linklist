import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        navigate('/app/account')
      }
    }
    checkUser()
  }, [navigate])

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/app/account`
      }
    })

    if (error) {
      console.error('Error signing in:', error.message)
    }
  }

  return (
    <div>
      <div className="p-4 max-w-xs mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">
          Sign In
        </h1>
        <p className="text-center mb-6 text-gray-500">
          Sign in to your account using one of the methods below
        </p>
        <button 
          onClick={handleSignIn}
          className="bg-white shadow text-center w-full py-4 flex gap-3 items-center justify-center">
          <span>Sign In with Google</span>
        </button>
      </div>
    </div>
  )
}