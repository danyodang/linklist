import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCloudArrowUp,
  faImage,
  faPalette,
  faSave
} from '@fortawesome/free-solid-svg-icons'
import SectionBox from '../layout/SectionBox'
import RadioTogglers from '../formItems/RadioTogglers'
import { uploadFile } from '../../api/upload'
import toast from 'react-hot-toast'

export default function PageSettingsForm({ page, user }) {
  const [bgType, setBgType] = useState(page.bg_type)
  const [bgColor, setBgColor] = useState(page.bg_color)
  const [bgImage, setBgImage] = useState(page.bg_image)
  const [avatar, setAvatar] = useState(user?.user_metadata?.avatar_url)

  async function saveBaseSettings(ev) {
    ev.preventDefault()
    const formData = new FormData(ev.target)
    
    const dataToUpdate = {
      display_name: formData.get('displayName'),
      location: formData.get('location'),
      bio: formData.get('bio'),
      bg_type: bgType,
      bg_color: bgColor,
      bg_image: bgImage,
    }

    const { error: pageError } = await supabase
      .from('pages')
      .update(dataToUpdate)
      .eq('owner_id', user.id)

    if (avatar !== user.user_metadata.avatar_url) {
      const { error: userError } = await supabase.auth.updateUser({
        data: { avatar_url: avatar }
      })

      if (userError) {
        toast.error('Failed to update avatar')
        return
      }
    }

    if (!pageError) {
      toast.success('Settings saved!')
    }
  }

  async function handleCoverImageChange(ev) {
    const file = ev.target.files?.[0]
    if (file) {
      try {
        const imageUrl = await uploadFile(file)
        setBgImage(imageUrl)
        toast.success('Image uploaded!')
      } catch (e) {
        toast.error('Upload failed')
      }
    }
  }

  async function handleAvatarImageChange(ev) {
    const file = ev.target.files?.[0]
    if (file) {
      try {
        const imageUrl = await uploadFile(file)
        setAvatar(imageUrl)
        toast.success('Avatar uploaded!')
      } catch (e) {
        toast.error('Upload failed')
      }
    }
  }

  return (
    <div>
      <SectionBox>
        <form onSubmit={saveBaseSettings}>
          <div
            className="py-4 -m-4 min-h-[300px] flex justify-center items-center bg-cover bg-center"
            style={
              bgType === 'color'
                ? {backgroundColor: bgColor}
                : {backgroundImage: `url(${bgImage})`}
            }
          >
            <div>
              <RadioTogglers
                defaultValue={page.bg_type}
                options={[
                  {value: 'color', icon: faPalette, label: 'Color'},
                  {value: 'image', icon: faImage, label: 'Image'},
                ]}
                onChange={val => setBgType(val)}
              />
              {bgType === 'color' && (
                <div className="bg-gray-200 shadow text-gray-700 p-2 mt-2">
                  <div className="flex gap-2 justify-center">
                    <span>Background color:</span>
                    <input
                      type="color"
                      name="bgColor"
                      onChange={ev => setBgColor(ev.target.value)}
                      defaultValue={page.bg_color}
                    />
                  </div>
                </div>
              )}
              {bgType === 'image' && (
                <div className="flex justify-center">
                  <label className="bg-white shadow px-4 py-2 mt-2 flex gap-2">
                    <input
                      type="file"
                      onChange={handleCoverImageChange}
                      className="hidden"
                    />
                    <div className="flex gap-2 items-center cursor-pointer">
                      <FontAwesomeIcon
                        icon={faCloudArrowUp}
                        className="text-gray-700"
                      />
                      <span>Change image</span>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center -mb-12">
            <div className="relative -top-8 w-[128px] h-[128px]">
              <div className="overflow-hidden h-full rounded-full border-4 border-white shadow shadow-black/50">
                <img
                  className="w-full h-full object-cover"
                  src={avatar}
                  alt="avatar"
                />
              </div>
              <label
                htmlFor="avatarIn"
                className="absolute bottom-0 -right-2 bg-white p-2 rounded-full shadow shadow-black/50 aspect-square flex items-center cursor-pointer">
                <FontAwesomeIcon size="xl" icon={faCloudArrowUp} />
              </label>
              <input
                onChange={handleAvatarImageChange}
                id="avatarIn"
                type="file"
                className="hidden"
              />
            </div>
          </div>
          <div className="p-0">
            <label className="input-label" htmlFor="nameIn">Display name</label>
            <input
              type="text"
              id="nameIn"
              name="displayName"
              defaultValue={page.display_name}
              placeholder="John Doe"
            />
            <label className="input-label" htmlFor="locationIn">Location</label>
            <input
              type="text"
              id="locationIn"
              name="location"
              defaultValue={page.location}
              placeholder="Somewhere in the world"
            />
            <label className="input-label" htmlFor="bioIn">Bio</label>
            <textarea
              name="bio"
              defaultValue={page.bio}
              id="bioIn"
              placeholder="Your bio goes here..."
            />
            <div className="max-w-[200px] mx-auto">
              <button
                type="submit"
                className="bg-blue-500 text-white w-full py-2 px-4 rounded-md flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faSave} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </form>
      </SectionBox>
    </div>
  )
}