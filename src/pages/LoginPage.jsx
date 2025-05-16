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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app/account`,
            data: {
              full_name: email.split('@')[0],
            }
          }
        })
        if (error) throw error
        
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

  return (
    <div className="bg-black min-h-screen">
      <div className="p-4 max-w-xs mx-auto pt-32">
        <h1 className="text-6xl font-mono font-bold tracking-tighter mb-6">
          {isSignUp ? 'SIGN UP' : 'SIGN IN'}
        </h1>
        <p className="text-gray-400 mb-8 font-mono">
          {isSignUp 
            ? 'Create your HYPR/LINK account' 
            : 'Welcome back to HYPR/LINK'}
        </p>

        <form onSubmit={handleSubmit} className="mb-8">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 font-mono"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 font-mono"
            required
          />
          <button 
            type="submit"
            className="bg-white text-black w-full py-4 font-mono hover:bg-gray-200 transition-colors">
            {isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </button>
        </form>

        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-white font-mono hover:underline text-sm">
          {isSignUp 
            ? 'Already have an account? Sign In' 
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  )
}