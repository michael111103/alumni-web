'use client'
// src/components/admin/AlumniFormModal.tsx
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { alumniSchema, type AlumniFormValues } from '@/lib/validations'
import { useAlumniById, useCreateAlumni, useUpdateAlumni, useMasterKota, useMasterProfesi } from '@/hooks/useAlumni'
import { uploadFotoAlumni, validateImageFile } from '@/lib/upload'
import { X, Upload } from 'lucide-react'

interface Props {
  alumniId: string | null
  onClose: () => void
  onSuccess: () => void
}

export default function AlumniFormModal({ alumniId, onClose, onSuccess }: Props) {
  const isEdit = !!alumniId
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const { data: existing } = useAlumniById(alumniId || '')
  const { data: kotas } = useMasterKota()
  const { data: profesis } = useMasterProfesi()
  const createMutation = useCreateAlumni()
  const updateMutation = useUpdateAlumni()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AlumniFormValues>({
    resolver: zodResolver(alumniSchema),
    defaultValues: { is_active: true },
  })

  useEffect(() => {
    if (existing && isEdit) {
      reset({
        nama_lengkap: existing.nama_lengkap,
        angkatan: existing.angkatan as any,
        jurusan: existing.jurusan,
        kota_id: existing.kota_id,
        profesi_id: existing.profesi_id,
        jabatan: existing.jabatan,
        perusahaan: existing.perusahaan,
        whatsapp: existing.whatsapp,
        email: existing.email,
        instagram: existing.instagram,
        linkedin: existing.linkedin,
        bio: existing.bio,
        is_active: existing.is_active,
      })
      if (existing.foto_url) setFotoPreview(existing.foto_url)
    }
  }, [existing, isEdit, reset])

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const err = validateImageFile(file)
    if (err) { setError(err); return }
    setFotoFile(file)
    setFotoPreview(URL.createObjectURL(file))
    setError('')
  }

  const onSubmit = async (values: AlumniFormValues) => {
    setError('')
    try {
      let foto_url = existing?.foto_url

      if (isEdit && alumniId) {
        if (fotoFile) {
          setUploading(true)
          foto_url = await uploadFotoAlumni(fotoFile, alumniId)
          setUploading(false)
        }
        await updateMutation.mutateAsync({
          id: alumniId,
          data: { ...values, foto_url },
        })
      } else {
        // Create first to get ID, then upload foto
        const result = await createMutation.mutateAsync({ ...values, foto_url: '' } as any)
        if (fotoFile && result) {
          setUploading(true)
          foto_url = await uploadFotoAlumni(fotoFile, result.id)
          setUploading(false)
          await updateMutation.mutateAsync({ id: result.id, data: { foto_url } })
        }
      }

      onSuccess()
    } catch (e: any) {
      setError(e.message || 'Terjadi kesalahan')
      setUploading(false)
    }
  }

  const isLoading = isSubmitting || uploading || createMutation.isPending || updateMutation.isPending

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? 'Edit Alumni' : 'Tambah Alumni Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Foto */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Foto Alumni</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                {fotoPreview ? (
                  <img src={fotoPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-6 h-6 text-gray-300" />
                )}
              </div>
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
                <Upload className="w-4 h-4" />
                Pilih Foto
                <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Identitas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">Nama Lengkap *</label>
              <input
                {...register('nama_lengkap')}
                placeholder="Nama sesuai KTP"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors.nama_lengkap && <p className="text-xs text-red-500 mt-1">{errors.nama_lengkap.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Angkatan / Tahun Lulus</label>
              <input
                {...register('angkatan', { valueAsNumber: true })}
                type="number"
                placeholder="cth: 2015"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Jurusan / Program Studi</label>
              <input
                {...register('jurusan')}
                placeholder="cth: Teknik Informatika"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Kota Domisili</label>
              <select
                {...register('kota_id')}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Pilih kota...</option>
                {kotas?.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Profesi / Pekerjaan</label>
              <select
                {...register('profesi_id')}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Pilih profesi...</option>
                {profesis?.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Jabatan</label>
              <input
                {...register('jabatan')}
                placeholder="cth: Software Engineer"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Perusahaan / Instansi</label>
              <input
                {...register('perusahaan')}
                placeholder="cth: PT Contoh Jaya"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">WhatsApp</label>
              <input
                {...register('whatsapp')}
                placeholder="08xxxxxxxxxx"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors.whatsapp && <p className="text-xs text-red-500 mt-1">{errors.whatsapp.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="email@contoh.com"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Instagram</label>
              <input
                {...register('instagram')}
                placeholder="@namaakun"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">LinkedIn URL</label>
              <input
                {...register('linkedin')}
                placeholder="https://linkedin.com/in/..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Bio Singkat</label>
            <textarea
              {...register('bio')}
              rows={3}
              placeholder="Deskripsi singkat tentang alumni..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input {...register('is_active')} type="checkbox" id="is_active" className="rounded" />
            <label htmlFor="is_active" className="text-sm text-gray-700">Alumni aktif (tampil di website)</label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
            >
              {isLoading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Alumni'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
