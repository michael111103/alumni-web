// src/lib/upload.ts
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export async function uploadFotoAlumni(file: File, alumniId: string): Promise<string> {
  const ext = file.name.split('.').pop()
  const fileName = `${alumniId}-${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('alumni-photos')
    .upload(fileName, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage
    .from('alumni-photos')
    .getPublicUrl(fileName)

  return data.publicUrl
}

export async function uploadFotoUMKM(file: File, umkmId: string, index = 0): Promise<string> {
  const ext = file.name.split('.').pop()
  const fileName = `${umkmId}-${index}-${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('umkm-photos')
    .upload(fileName, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage
    .from('umkm-photos')
    .getPublicUrl(fileName)

  return data.publicUrl
}

export async function uploadLogo(file: File, umkmId: string): Promise<string> {
  const ext = file.name.split('.').pop()
  const fileName = `logo-${umkmId}-${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('logos')
    .upload(fileName, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage
    .from('logos')
    .getPublicUrl(fileName)

  return data.publicUrl
}

export function validateImageFile(file: File): string | null {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!allowedTypes.includes(file.type)) {
    return 'File harus berupa JPG, PNG, atau WebP'
  }
  if (file.size > maxSize) {
    return 'Ukuran file maksimal 5MB'
  }
  return null
}
