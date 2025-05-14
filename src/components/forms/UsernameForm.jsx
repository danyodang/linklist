import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function UsernameForm({ desiredUsername }) {
  const [taken, setTaken] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(ev) {
    ev.preventDefault()
    const form = ev.target
    const username = form.username.value

    // Check if username exists
    const { data: existingPage } = await supabase
      .from('pages')
      .select('uri')
      .eq('uri', username)
      .single()

    if (existingPage) {
      setTaken(true)
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // Create new page
    const { data: page, error } = await supabase
      .from('pages')
      .insert([{
        uri: username,
        owner_id: session.user.id,
      }])
      .select()
      .single()

    if (!error) {
      navigate('/app/account')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-4xl font-bold text-center mb-2">
        Grab your username
      </h1>
      <p className="text-center mb-6 text-gray-500">
        Choose your username
      </p>
      <div className="max-w-xs mx-auto">
        <input
          name="username"
          className="block p-2 mx-auto border w-full mb-2 text-center"
          defaultValue={desiredUsername}
          type="text"
          placeholder="username"
        />
        {taken && (
          <div className="bg-red-200 border border-red-500 p-2 mb-2 text-center">
            This username is taken
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 px-4 rounded-md">
          Claim your username
        </button>
      </div>
    </form>
  )
}