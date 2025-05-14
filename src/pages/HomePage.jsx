import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'

export default function HomePage() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (username.length > 0) {
      navigate(`/app/account?desiredUsername=${username}`)
    }
  }

  return (
    <main>
      <section className="pt-32">
        <div className="max-w-md mb-8">
          <h1 className="text-6xl font-bold">
            Your one link<br />for everything
          </h1>
          <h2 className="text-gray-500 text-xl mt-6">
            Share your links, social profiles, contact info and more on one page
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="inline-flex items-center shadow-lg bg-white shadow-gray-500/20">
          <span className="bg-white py-4 pl-4">
            linklist.to/
          </span>
          <input
            type="text"
            className="p-2"
            style={{backgroundColor:'white',marginBottom:0,paddingLeft:0}}
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-4 px-6 whitespace-nowrap">
            Join for Free
          </button>
        </form>
      </section>
    </main>
  )
}