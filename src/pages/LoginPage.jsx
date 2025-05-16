import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        navigate('/app/account')
      }
    }
    checkUser()
  }, [navigate])

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app/account`,
            data: {
              full_name: email.split('@')[0], // Use part before @ as name
            }
          }
        })
        if (error) throw error
        // Sign in immediately after sign up
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        navigate('/app/account')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        navigate('/app/account')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/app/account`
      }
    })

    if (error) {
      toast.error('Error signing in with Google')
    }
  }

  return (
    <div>
      <div className="p-4 max-w-xs mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h1>
        <p className="text-center mb-6 text-gray-500">
          {isSignUp 
            ? 'Create a new account' 
            : 'Sign in to your account'}
        </p>

        <form onSubmit={handleEmailSubmit} className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white w-full py-2 rounded mb-4">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mb-4">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 text-sm">
            {isSignUp 
              ? 'Already have an account? Sign In' 
              : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="bg-white shadow text-center w-full py-4 flex gap-3 items-center justify-center">
          <span>Sign In with Google</span>
        </button>
      </div>
    </div>
  )
}