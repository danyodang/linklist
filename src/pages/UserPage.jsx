import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faLink } from '@fortawesome/free-solid-svg-icons'
import {
  faDiscord,
  faFacebook,
  faGithub,
  faInstagram,
  faTelegram,
  faTiktok,
  faWhatsapp,
  faYoutube
} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'

const buttonsIcons = {
  email: faEnvelope,
  mobile: faPhone,
  instagram: faInstagram,
  facebook: faFacebook,
  discord: faDiscord,
  tiktok: faTiktok,
  youtube: faYoutube,
  whatsapp: faWhatsapp,
  github: faGithub,
  telegram: faTelegram,
}

function buttonLink(key, value) {
  if (key === 'mobile') {
    return 'tel:'+value
  }
  if (key === 'email') {
    return 'mailto:'+value
  }
  return value
}

export default function UserPage() {
  const { username } = useParams()
  const [page, setPage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      // Get page data
      const { data: page } = await supabase
        .from('pages')
        .select('*, users(*)')
        .eq('uri', username)
        .single()

      if (page) {
        setPage(page)
        setUser(page.users)

        // Record view
        await supabase
          .from('events')
          .insert([{
            type: 'view',
            page_id: page.id
          }])
      }
    }

    fetchData()
  }, [username])

  if (!page || !user) return null

  const handleLinkClick = async (url) => {
    await supabase
      .from('events')
      .insert([{
        type: 'click',
        page_id: page.id,
        uri: url
      }])
  }

  return (
    <div className="bg-blue-950 text-white min-h-screen">
      <div
        className="h-36 bg-gray-400 bg-cover bg-center"
        style={
          page.bg_type === 'color'
            ? {backgroundColor: page.bg_color}
            : {backgroundImage: `url(${page.bg_image})`}
        }
      />
      <div className="aspect-square w-36 h-36 mx-auto relative -top-16 -mb-12">
        <img
          className="rounded-full w-full h-full object-cover"
          src={user.image}
          alt="avatar"
        />
      </div>
      <h2 className="text-2xl text-center mb-1">{page.display_name}</h2>
      <h3 className="text-md flex gap-2 justify-center items-center text-white/70">
        <FontAwesomeIcon className="h-4" icon={faLocationDot} />
        <span>{page.location}</span>
      </h3>
      <div className="max-w-xs mx-auto text-center my-2">
        <p>{page.bio}</p>
      </div>
      <div className="flex gap-2 justify-center mt-4 pb-4">
        {Object.keys(page.buttons).map(buttonKey => (
          <a
            key={buttonKey}
            href={buttonLink(buttonKey, page.buttons[buttonKey])}
            className="rounded-full bg-white text-blue-950 p-2 flex items-center justify-center">
            <FontAwesomeIcon className="w-5 h-5" icon={buttonsIcons[buttonKey]} />
          </a>
        ))}
      </div>
      <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6 p-4 px-8">
        {page.links.map(link => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            onClick={() => handleLinkClick(link.url)}
            className="bg-indigo-800 p-2 block flex">
            <div className="relative -left-4 overflow-hidden w-16">
              <div className="w-16 h-16 bg-blue-700 aspect-square relative flex items-center justify-center aspect-square">
                {link.icon ? (
                  <img
                    className="w-full h-full object-cover"
                    src={link.icon}
                    alt="icon"
                  />
                ) : (
                  <FontAwesomeIcon icon={faLink} className="w-8 h-8" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-center shrink grow-0 overflow-hidden">
              <div>
                <h3>{link.title}</h3>
                <p className="text-white/50 h-6 overflow-hidden">{link.subtitle}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}