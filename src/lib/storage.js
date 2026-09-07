import { supabase } from './supabase'

const MAX_FILE_SIZE_MB = 2
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

/**
 * Validasi file gambar sebelum diunggah
 * @param {File} file
 */
export const validateImageFile = (file) => {
  if (!file) {
    throw new Error('Pilih file gambar terlebih dahulu.')
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Format file tidak didukung. Gunakan JPG, JPEG, PNG, atau WEBP.')
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`Ukuran file maksimal adalah ${MAX_FILE_SIZE_MB}MB.`)
  }
}

/**
 * Mengunggah file gambar ke Supabase Storage Bucket
 * @param {File} file - Objek file dari input form
 * @param {'product-images' | 'owner-images'} bucket - Nama bucket penyimpanan
 * @returns {Promise<string>} URL publik gambar yang diunggah
 */
export const uploadImage = async (file, bucket) => {
  validateImageFile(file)

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const fileName = `${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw new Error(`Gagal mengunggah gambar: ${uploadError.message}`)
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return data.publicUrl
}

/**
 * Menghapus file gambar dari Supabase Storage Bucket berdasarkan public URL atau nama file
 * @param {string} imageUrlOrPath
 * @param {'product-images' | 'owner-images'} bucket
 */
export const deleteImage = async (imageUrlOrPath, bucket) => {
  if (!imageUrlOrPath) return

  const fileName = imageUrlOrPath.split('/').pop()
  if (!fileName) return

  const { error } = await supabase.storage.from(bucket).remove([fileName])
  if (error) {
    console.error(`Gagal menghapus gambar dari storage: ${error.message}`)
  }
}
