import { supabase } from '../lib/supabase'
import uniqid from 'uniqid'

export async function uploadFile(file) {
  const ext = file.name.split('.').pop()
  const newFilename = uniqid() + '.' + ext
  const filePath = `public/${newFilename}`

  const { data, error } = await supabase.storage
    .from('files')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (error) {
    throw error
  }

  const { data: { publicUrl } } = supabase.storage
    .from('files')
    .getPublicUrl(filePath)

  return publicUrl
}