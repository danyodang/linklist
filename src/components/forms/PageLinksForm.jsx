import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCloudArrowUp,
  faLink,
  faPlus,
  faSave,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import SectionBox from '../layout/SectionBox'
import toast from 'react-hot-toast'

export default function PageLinksForm({ page, user }) {
  const [links, setLinks] = useState(page.links || [])

  async function save(ev) {
    ev.preventDefault()
    const { error } = await supabase
      .from('pages')
      .update({ links })
      .eq('owner_id', user.id)

    if (!error) {
      toast.success('Saved!')
    }
  }

  function addNewLink() {
    setLinks(prev => [...prev, {
      key: Date.now().toString(),
      title: '',
      subtitle: '',
      icon: '',
      url: '',
    }])
  }

  async function handleUpload(ev, linkKeyForUpload) {
    const file = ev.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      if (response.ok) {
        const link = await response.json()
        setLinks(prev => {
          const newLinks = [...prev]
          newLinks.forEach(link => {
            if (link.key === linkKeyForUpload) {
              link.icon = link
            }
          })
          return newLinks
        })
      }
    }
  }

  function handleLinkChange(keyOfLinkToChange, prop, ev) {
    setLinks(prev => {
      const newLinks = [...prev]
      newLinks.forEach(link => {
        if (link.key === keyOfLinkToChange) {
          link[prop] = ev.target.value
        }
      })
      return [...prev]
    })
  }

  function removeLink(linkKeyToRemove) {
    setLinks(prev => prev.filter(l => l.key !== linkKeyToRemove))
  }

  return (
    <SectionBox>
      <form onSubmit={save}>
        <h2 className="text-2xl font-bold mb-4">Links</h2>
        <button
          onClick={addNewLink}
          type="button"
          className="text-blue-500 text-lg flex gap-2 items-center cursor-pointer">
          <FontAwesomeIcon
            className="bg-blue-500 text-white p-1 rounded-full aspect-square"
            icon={faPlus}
          />
          <span>Add new</span>
        </button>
        <div className="">
          {links.map(l => (
            <div key={l.key} className="mt-8 md:flex gap-6 items-center">
              <div className="text-center">
                <div className="bg-gray-300 inline-block relative aspect-square overflow-hidden w-16 h-16 inline-flex justify-center items-center">
                  {l.icon ? (
                    <img
                      className="w-full h-full object-cover"
                      src={l.icon}
                      alt="icon"
                    />
                  ) : (
                    <FontAwesomeIcon size="xl" icon={faLink} />
                  )}
                </div>
                <div>
                  <input
                    onChange={ev => handleUpload(ev, l.key)}
                    id={'icon'+l.key}
                    type="file"
                    className="hidden"
                  />
                  <label
                    htmlFor={'icon'+l.key}
                    className="border mt-2 p-2 flex items-center gap-1 text-gray-600 cursor-pointer mb-2 justify-center">
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                    <span>Change icon</span>
                  </label>
                  <button
                    onClick={() => removeLink(l.key)}
                    type="button"
                    className="w-full bg-gray-300 py-2 px-3 mb-2 h-full flex gap-2 items-center justify-center">
                    <FontAwesomeIcon icon={faTrash} />
                    <span>Remove this link</span>
                  </button>
                </div>
              </div>
              <div className="grow">
                <label className="input-label">Title:</label>
                <input
                  value={l.title}
                  onChange={ev => handleLinkChange(l.key, 'title', ev)}
                  type="text"
                  placeholder="title"
                />
                <label className="input-label">Subtitle:</label>
                <input
                  value={l.subtitle}
                  onChange={ev => handleLinkChange(l.key, 'subtitle', ev)}
                  type="text"
                  placeholder="subtitle (optional)"
                />
                <label className="input-label">URL:</label>
                <input
                  value={l.url}
                  onChange={ev => handleLinkChange(l.key, 'url', ev)}
                  type="text"
                  placeholder="url"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white max-w-xs mx-auto w-full py-2 px-4 rounded-md flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faSave} />
            <span>Save</span>
          </button>
        </div>
      </form>
    </SectionBox>
  )
}