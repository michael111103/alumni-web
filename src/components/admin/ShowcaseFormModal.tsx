'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showcaseSchema, type ShowcaseFormValues } from '@/lib/validations'
import { useCreateShowcase, useUpdateShowcase, useAllShowcase, useUMKM } from '@/hooks/useAlumni'
import { X } from 'lucide-react'

interface Props {
  showcaseId: string | null
  onClose: () => void
  onSuccess: () => void
}

export default function ShowcaseFormModal({ showcaseId, onClose, onSuccess }: Props) {
  const isEdit = !!showcaseId
  const { data: allShowcase } = useAllShowcase()
  const { data: umkmData } = useUMKM({}, 1, 100)
  const createMutation = useCreateShowcase()
  const updateMutation = useUpdateShowcase()

  const existing = allShowcase?.find(s => s.id === showcaseId)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ShowcaseFormValues>({
    resolver: zodResolver(showcaseSchema),
    defaultValues: { urutan: 1, is_published: false },
  })

  useEffect(() => {
    if (existing && isEdit) {
      reset({
        umkm_id: existing.umkm_id,
        tanggal_mulai: existing.tanggal_mulai,
        tanggal_selesai: existing.tanggal_selesai,
        judul: existing.judul || '',
        deskripsi_showcase: existing.deskripsi_showcase || '',
        urutan: existing.urutan,
        is_published: existing.is_published,
      })
    }
  }, [existing, isEdit, reset])

  const onSubmit = async (values: ShowcaseFormValues) => {
    try {
      if (isEdit && showcaseId) {
        await updateMutation.mutateAsync({ id: showcaseId, data: values })
      } else {
        await createMutation.mutateAsync(values as any)
      }
      onSuccess()
    } catch (e: any) {
      alert(e.message || 'Terjadi kesalahan')
    }
  }

  const isLoading = isSubmitting || createMutation.isPending || updateMutation.isPending

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? 'Edit Showcase' : 'Tambah Showcase Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {/* Pilih UMKM */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              UMKM yang Ditampilkan <span className="text-red-500">*</span>
            </label>
            <select {...register('umkm_id')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
              <option value="">Pilih UMKM...</option>
              {umkmData?.data.map(umkm => (
                <option key={umkm.id} value={umkm.id}>
                  {umkm.nama_usaha} — {(umkm.alumni as any)?.nama_lengkap || '-'}
                </option>
              ))}
            </select>
            {errors.umkm_id && <p className="text-xs text-red-500 mt-1">{errors.umkm_id.message}</p>}
          </div>

          {/* Tanggal - 1 kolom di mobile, 2 kolom di desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <input {...register('tanggal_mulai')} type="date"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
              {errors.tanggal_mulai && <p className="text-xs text-red-500 mt-1">{errors.tanggal_mulai.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Tanggal Selesai <span className="text-red-500">*</span>
              </label>
              <input {...register('tanggal_selesai')} type="date"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
              {errors.tanggal_selesai && <p className="text-xs text-red-500 mt-1">{errors.tanggal_selesai.message}</p>}
            </div>
          </div>

          {/* Urutan */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Urutan Tampil (1-5)</label>
            <input {...register('urutan', { valueAsNumber: true })} type="number" min={1} max={5}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>

          {/* Judul */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Judul Showcase (opsional)</label>
            <input {...register('judul')} placeholder="Judul custom untuk showcase ini"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Deskripsi Showcase (opsional)</label>
            <textarea {...register('deskripsi_showcase')} rows={3}
              placeholder="Deskripsi tambahan untuk showcase ini..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
          </div>

          {/* Publish */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input {...register('is_published')} type="checkbox" className="w-4 h-4 rounded text-blue-600" />
            <span className="text-sm text-gray-700">Publish sekarang (akan tampil sesuai jadwal)</span>
          </label>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              Batal
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60">
              {isLoading ? 'Menyimpan...' : isEdit ? 'Simpan' : 'Tambah Showcase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
