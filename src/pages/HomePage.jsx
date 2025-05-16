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
    <main className="bg-black text-white">
      <section className="pt-32 px-4">
        <div className="max-w-md mb-12">
          <h1 className="text-8xl font-mono font-bold tracking-tighter leading-none mb-8">
            ONE LINK<br />
            FOR<br />
            EVERYTHING
          </h1>
          <h2 className="text-gray-400 text-xl mt-6 font-mono">
            Share your links, social profiles, contact info and more on one page
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="inline-flex items-center border-4 border-white">
          <span className="bg-black py-4 pl-4 font-mono">
            hyprlink.to/
          </span>
          <input
            type="text"
            className="p-2 bg-black border-none focus:outline-none font-mono"
            style={{marginBottom:0,paddingLeft:0}}
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            type="submit"
            className="bg-white text-black py-4 px-6 whitespace-nowrap font-mono hover:bg-gray-200 transition-colors">
            JOIN NOW
          </button>
        </form>
      </section>
    </main>
  )
}