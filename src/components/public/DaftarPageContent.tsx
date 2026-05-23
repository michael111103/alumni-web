'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { useMasterKategoriUsaha, useMasterBenefit } from '@/hooks/useAlumni'
import { uploadFotoAlumni, uploadFotoUMKM, uploadLogo, validateImageFile } from '@/lib/upload'
import Navbar from '@/components/public/Navbar'
import Link from 'next/link'
import { PROVINSI, getKotaByProvinsi } from '@/lib/wilayah'
import {
  User, GraduationCap, MapPin, Phone, Mail, Instagram,
  Briefcase, Building2, ShoppingBag, Tag,
  Upload, CheckCircle, ChevronRight, ChevronLeft,
  Globe, Package, Gift, FileText, Camera
} from 'lucide-react'

const daftarSchema = z.object({
  nama_lengkap: z.string().min(2, 'Nama minimal 2 karakter'),
  angkatan: z.string().min(4, 'Angkatan harus diisi'),
  jurusan: z.string().min(2, 'Jurusan harus diisi'),
  whatsapp: z.string().min(10, 'Nomor WA tidak valid'),
  email: z.string().email('Email tidak valid'),
  profesi: z.string().optional(),
  jabatan: z.string().optional(),
  perusahaan: z.string().optional(),
  provinsi_domisili: z.string().optional(),
  kota_domisili: z.string().optional(),
  bio: z.string().optional(),
  punya_umkm: z.boolean().default(false),
  nama_usaha: z.string().optional(),
  kategori_usaha_id: z.string().optional(),
  deskripsi_usaha: z.string().optional(),
  skala_usaha: z.string().optional(),
  provinsi_usaha: z.string().optional(),
  kota_usaha: z.string().optional(),
  jangkauan: z.string().optional(),
  whatsapp_bisnis: z.string().optional(),
  instagram_usaha: z.string().optional(),
  toko_online: z.string().optional(),
  website_usaha: z.string().optional(),
  benefit_ids: z.array(z.string()).default([]),
  setuju_data: z.boolean().refine(v => v === true, 'Harus disetujui'),
  setuju_tampil: z.boolean().refine(v => v === true, 'Harus disetujui'),
  setuju_verifikasi: z.boolean().default(true),
})

type DaftarFormValues = z.infer<typeof daftarSchema>

const STEPS = ['Identitas', 'Profesi', 'UMKM', 'Persetujuan']

export default function DaftarPageContent() {
  const [step, setStep] = useState(0)
  const [fotoAlumni, setFotoAlumni] = useState<File | null>(null)
  const [fotoAlumniPreview, setFotoAlumniPreview] = useState<string | null>(null)
  const [fotoProduk, setFotoProduk] = useState<File[]>([])
  const [fotoProdukPreview, setFotoProdukPreview] = useState<string[]>([])
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const { data: kategoris } = useMasterKategoriUsaha()
  const { data: benefits } = useMasterBenefit()
  const supabase = createClient()

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<DaftarFormValues>({
    resolver: zodResolver(daftarSchema),
    defaultValues: { punya_umkm: false, benefit_ids: [], setuju_verifikasi: true },
  })

  const punya_umkm = watch('punya_umkm')
  const benefit_ids = watch('benefit_ids')
  const provinsi_domisili = watch('provinsi_domisili')
  const provinsi_usaha = watch('provinsi_usaha')

  const kotaDomisiliList = provinsi_domisili ? getKotaByProvinsi(provinsi_domisili) : []
  const kotaUsahaList = provinsi_usaha ? getKotaByProvinsi(provinsi_usaha) : []

  const toggleBenefit = (id: string) => {
    const current = benefit_ids || []
    setValue('benefit_ids', current.includes(id)
      ? current.filter(b => b !== id)
      : [...current, id]
    )
  }

  const handleFotoAlumni = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const err = validateImageFile(file)
    if (err) { setError(err); return }
    setFotoAlumni(file)
    setFotoAlumniPreview(URL.createObjectURL(file))
  }

  const handleFotoProduk = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3)
    setFotoProduk(files)
    setFotoProdukPreview(files.map(f => URL.createObjectURL(f)))
  }

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (values: DaftarFormValues) => {
    setSubmitting(true)
    setError('')
    try {
      // Insert alumni - tanpa foreign key kota/profesi, simpan sebagai text
      const { data: alumni, error: alumniErr } = await supabase
        .from('alumni')
        .insert({
          nama_lengkap: values.nama_lengkap,
          angkatan: parseInt(values.angkatan),
          jurusan: values.jurusan,
          whatsapp: values.whatsapp,
          email: values.email,
          jabatan: values.profesi || values.jabatan || null,
          perusahaan: values.perusahaan || null,
          bio: values.bio || null,
          is_active: false,
        })
        .select()
        .single()

      if (alumniErr) throw new Error(alumniErr.message)

      // Upload foto alumni
      if (fotoAlumni && alumni) {
        try {
          const fotoUrl = await uploadFotoAlumni(fotoAlumni, alumni.id)
          await supabase.from('alumni').update({ foto_url: fotoUrl }).eq('id', alumni.id)
        } catch {}
      }

      // Insert UMKM
      if (values.punya_umkm && values.nama_usaha && alumni) {
        const { data: umkm, error: umkmErr } = await supabase
          .from('umkm')
          .insert({
            alumni_id: alumni.id,
            nama_usaha: values.nama_usaha,
            kategori_usaha_id: values.kategori_usaha_id || null,
            deskripsi: values.deskripsi_usaha || null,
            skala_usaha: values.skala_usaha || null,
            jangkauan: values.jangkauan || null,
            whatsapp_bisnis: values.whatsapp_bisnis || null,
            instagram_usaha: values.instagram_usaha || null,
            toko_online: values.toko_online || null,
            website: values.website_usaha || null,
            is_active: false,
          })
          .select()
          .single()

        if (!umkmErr && umkm) {
          // Upload foto produk
          if (fotoProduk.length > 0) {
            try {
              const urls = await Promise.all(fotoProduk.map((f, i) => uploadFotoUMKM(f, umkm.id, i)))
              await supabase.from('umkm').update({ foto_produk_urls: urls }).eq('id', umkm.id)
            } catch {}
          }

          // Upload logo
          if (logoFile) {
            try {
              const logoUrl = await uploadLogo(logoFile, umkm.id)
              await supabase.from('umkm').update({ logo_url: logoUrl }).eq('id', umkm.id)
            } catch {}
          }

          // Insert benefits
          if (values.benefit_ids.length > 0) {
            await supabase.from('umkm_benefits').insert(
              values.benefit_ids.map(bid => ({ umkm_id: umkm.id, benefit_id: bid }))
            )
          }
        }
      }

      setSubmitted(true)
    } catch (e: any) {
      setError(e.message || 'Terjadi kesalahan, coba lagi')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center animate-fade-up">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
            <p className="text-gray-500 mb-2">Data kamu sudah kami terima dan sedang menunggu verifikasi admin.</p>
            <p className="text-sm text-gray-400 mb-8">Setelah diverifikasi, profil kamu akan tampil di website.</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-white border-b border-gray-100 pt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Daftar Alumni</h1>
          </div>
          <p className="text-gray-400 text-sm ml-12">Lengkapi data dirimu untuk tampil di direktori alumni</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                  i < step ? 'bg-blue-600 text-white' :
                  i === step ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`text-xs mt-1.5 font-medium hidden sm:block ${i === step ? 'text-blue-600' : 'text-gray-400'}`}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-all ${i < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* ===== STEP 0: IDENTITAS ===== */}
          {step === 0 && (
            <div className="space-y-5 animate-fade-up">
              <SectionCard title="A. Identitas Alumni" icon={<User className="w-4 h-4" />}>
                {/* Foto */}
                <div>
                  <FormLabel>Foto Alumni</FormLabel>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-200 flex-shrink-0">
                      {fotoAlumniPreview
                        ? <img src={fotoAlumniPreview} alt="" className="w-full h-full object-cover" />
                        : <Camera className="w-6 h-6 text-gray-300" />}
                    </div>
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
                      <Upload className="w-4 h-4" />
                      {fotoAlumniPreview ? 'Ganti Foto' : 'Upload Foto'}
                      <input type="file" accept="image/*" onChange={handleFotoAlumni} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <FormLabel required>Nama Lengkap</FormLabel>
                    <FormInput {...register('nama_lengkap')} placeholder="Nama sesuai KTP"
                      icon={<User className="w-4 h-4" />} error={errors.nama_lengkap?.message} />
                  </div>
                  <div>
                    <FormLabel required>Angkatan / Tahun Lulus</FormLabel>
                    <FormInput {...register('angkatan')} placeholder="cth: 2015"
                      icon={<GraduationCap className="w-4 h-4" />} error={errors.angkatan?.message} />
                  </div>
                  <div>
                    <FormLabel required>Jurusan / Program Studi</FormLabel>
                    <FormInput {...register('jurusan')} placeholder="cth: Teknik Informatika"
                      icon={<GraduationCap className="w-4 h-4" />} error={errors.jurusan?.message} />
                  </div>
                  <div>
                    <FormLabel required>Nomor WhatsApp</FormLabel>
                    <FormInput {...register('whatsapp')} placeholder="08xxxxxxxxxx"
                      icon={<Phone className="w-4 h-4" />} error={errors.whatsapp?.message} />
                    <p className="text-xs text-gray-400 mt-1">Tidak ditampilkan ke publik</p>
                  </div>
                  <div>
                    <FormLabel required>Email Aktif</FormLabel>
                    <FormInput {...register('email')} type="email" placeholder="email@contoh.com"
                      icon={<Mail className="w-4 h-4" />} error={errors.email?.message} />
                  </div>
                </div>
              </SectionCard>
              <StepNav onNext={() => setStep(1)} isFirst />
            </div>
          )}

          {/* ===== STEP 1: PROFESI ===== */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-up">
              <SectionCard title="B. Profil Profesi" icon={<Briefcase className="w-4 h-4" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FormLabel>Profesi / Pekerjaan</FormLabel>
                    <FormInput {...register('profesi')} placeholder="cth: Software Engineer"
                      icon={<Briefcase className="w-4 h-4" />} />
                  </div>
                  <div>
                    <FormLabel>Jabatan</FormLabel>
                    <FormInput {...register('jabatan')} placeholder="cth: Senior Developer"
                      icon={<Briefcase className="w-4 h-4" />} />
                  </div>
                  <div className="sm:col-span-2">
                    <FormLabel>Perusahaan / Instansi</FormLabel>
                    <FormInput {...register('perusahaan')} placeholder="cth: PT Contoh Jaya"
                      icon={<Building2 className="w-4 h-4" />} />
                  </div>

                  {/* Provinsi Domisili */}
                  <div>
                    <FormLabel>Provinsi Domisili</FormLabel>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                      <select
                        {...register('provinsi_domisili')}
                        onChange={e => {
                          setValue('provinsi_domisili', e.target.value)
                          setValue('kota_domisili', '')
                        }}
                        className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                      >
                        <option value="">Pilih provinsi...</option>
                        {PROVINSI.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Kota Domisili */}
                  <div>
                    <FormLabel>Kota / Kabupaten</FormLabel>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                      <select
                        {...register('kota_domisili')}
                        disabled={!provinsi_domisili}
                        className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                      >
                        <option value="">{provinsi_domisili ? 'Pilih kota...' : 'Pilih provinsi dulu'}</option>
                        {kotaDomisiliList.map(k => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <FormLabel>Bio Singkat</FormLabel>
                    <textarea {...register('bio')} rows={3}
                      placeholder="Ceritakan sedikit tentang dirimu..."
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
                  </div>
                </div>
              </SectionCard>
              <StepNav onPrev={() => setStep(0)} onNext={() => setStep(2)} />
            </div>
          )}

          {/* ===== STEP 2: UMKM ===== */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-up">
              <SectionCard title="C. Usaha UMKM" icon={<ShoppingBag className="w-4 h-4" />}>
                <label className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 cursor-pointer">
                  <input type="checkbox" {...register('punya_umkm')} className="w-4 h-4 rounded text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    Saya memiliki usaha / UMKM yang ingin ditampilkan
                  </span>
                </label>

                {punya_umkm && (
                  <div className="space-y-4 animate-fade-up">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <FormLabel>Nama Usaha / Brand</FormLabel>
                        <FormInput {...register('nama_usaha')} placeholder="cth: Batik Nusantara"
                          icon={<ShoppingBag className="w-4 h-4" />} />
                      </div>
                      <div>
                        <FormLabel>Kategori Usaha</FormLabel>
                        <select {...register('kategori_usaha_id')}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
                          <option value="">Pilih kategori...</option>
                          {kategoris?.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <FormLabel>Deskripsi Usaha</FormLabel>
                      <textarea {...register('deskripsi_usaha')} rows={3}
                        placeholder="Ceritakan produk/jasa kamu..."
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
                    </div>

                    {/* Skala Usaha */}
                    <div>
                      <FormLabel>Skala Usaha</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'hobby', label: 'Usaha Sampingan / Hobby' },
                          { value: 'kecil', label: 'Usaha Aktif (< karyawan)' },
                          { value: 'menengah', label: 'Usaha Aktif (1-5 karyawan)' },
                          { value: 'besar', label: 'Usaha Aktif (> 5 karyawan)' },
                        ].map(opt => (
                          <label key={opt.value}
                            className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer text-xs transition ${
                              watch('skala_usaha') === opt.value
                                ? 'border-blue-400 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}>
                            <input type="radio" {...register('skala_usaha')} value={opt.value} className="hidden" />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Provinsi & Kota Usaha */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <FormLabel>Provinsi Domisili Usaha</FormLabel>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                          <select
                            {...register('provinsi_usaha')}
                            onChange={e => {
                              setValue('provinsi_usaha', e.target.value)
                              setValue('kota_usaha', '')
                            }}
                            className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                          >
                            <option value="">Pilih provinsi...</option>
                            {PROVINSI.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <FormLabel>Kota / Kabupaten Usaha</FormLabel>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                          <select
                            {...register('kota_usaha')}
                            disabled={!provinsi_usaha}
                            className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                          >
                            <option value="">{provinsi_usaha ? 'Pilih kota...' : 'Pilih provinsi dulu'}</option>
                            {kotaUsahaList.map(k => <option key={k} value={k}>{k}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <FormLabel>Jangkauan Pengiriman</FormLabel>
                        <select {...register('jangkauan')}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
                          <option value="">Pilih jangkauan...</option>
                          <option value="lokal">Lokal (satu kota)</option>
                          <option value="regional">Regional (antar kota/provinsi)</option>
                          <option value="nasional">Nasional (seluruh Indonesia)</option>
                          <option value="internasional">Internasional</option>
                        </select>
                      </div>
                    </div>

                    {/* Kontak Usaha */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <FormLabel>WhatsApp Bisnis</FormLabel>
                        <FormInput {...register('whatsapp_bisnis')} placeholder="08xxxxxxxxxx"
                          icon={<Phone className="w-4 h-4" />} />
                      </div>
                      <div>
                        <FormLabel>Instagram Usaha</FormLabel>
                        <FormInput {...register('instagram_usaha')} placeholder="@namaakun"
                          icon={<Instagram className="w-4 h-4" />} />
                      </div>
                      <div>
                        <FormLabel>Toko Online / Marketplace</FormLabel>
                        <FormInput {...register('toko_online')} placeholder="tokopedia.com/namatoko"
                          icon={<Package className="w-4 h-4" />} />
                      </div>
                      <div>
                        <FormLabel>Website</FormLabel>
                        <FormInput {...register('website_usaha')} placeholder="https://namawebsite.com"
                          icon={<Globe className="w-4 h-4" />} />
                      </div>
                    </div>

                    {/* Benefit */}
                    <div>
                      <FormLabel>Benefit untuk Sesama Alumni</FormLabel>
                      <p className="text-xs text-gray-400 mb-3">Pilih semua yang berlaku</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {benefits?.map(b => (
                          <label key={b.id}
                            className={`flex items-center gap-2.5 p-3 border rounded-xl cursor-pointer text-sm transition ${
                              benefit_ids?.includes(b.id)
                                ? 'border-blue-400 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}
                            onClick={() => toggleBenefit(b.id)}
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${
                              benefit_ids?.includes(b.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                            }`}>
                              {benefit_ids?.includes(b.id) && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <Gift className="w-3.5 h-3.5 flex-shrink-0" />
                            {b.nama}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Foto Produk */}
                    <div>
                      <FormLabel>Foto Produk (1-3 foto)</FormLabel>
                      <p className="text-xs text-gray-400 mb-2">Format JPG/PNG, maks. 5MB per foto</p>
                      <div className="flex gap-3 flex-wrap">
                        {fotoProdukPreview.map((src, i) => (
                          <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {fotoProdukPreview.length < 3 && (
                          <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-blue-300 transition">
                            <Camera className="w-6 h-6 text-gray-300" />
                            <input type="file" accept="image/*" multiple onChange={handleFotoProduk} className="hidden" />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Logo */}
                    <div>
                      <FormLabel>Logo Usaha (opsional)</FormLabel>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200 flex-shrink-0">
                          {logoPreview
                            ? <img src={logoPreview} alt="" className="w-full h-full object-contain" />
                            : <Tag className="w-6 h-6 text-gray-300" />}
                        </div>
                        <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
                          <Upload className="w-4 h-4" />
                          {logoPreview ? 'Ganti Logo' : 'Upload Logo'}
                          <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </SectionCard>
              <StepNav onPrev={() => setStep(1)} onNext={() => setStep(3)} />
            </div>
          )}

          {/* ===== STEP 3: PERSETUJUAN ===== */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-up">
              <SectionCard title="D. Persetujuan" icon={<FileText className="w-4 h-4" />}>
                <div className="space-y-3">
                  {[
                    { name: 'setuju_data' as const, label: 'Data yang saya isi adalah benar dan merupakan usaha/profil milik saya sendiri' },
                    { name: 'setuju_tampil' as const, label: 'Saya menyetujui data dan foto saya ditampilkan di website alumni' },
                    { name: 'setuju_verifikasi' as const, label: 'Saya bersedia dihubungi admin untuk verifikasi jika diperlukan' },
                  ].map(item => (
                    <label key={item.name}
                      className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition ${
                        watch(item.name) ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <input type="checkbox" {...register(item.name)}
                        className="mt-0.5 w-4 h-4 rounded text-blue-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>

                {(errors.setuju_data || errors.setuju_tampil) && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mt-3">
                    Harap centang semua pernyataan persetujuan
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mt-3">
                    {error}
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-3">
                  <p className="text-xs text-yellow-700">
                    ⏳ <strong>Catatan:</strong> Pendaftaran kamu akan diverifikasi admin terlebih dahulu sebelum tampil di website. Proses verifikasi biasanya 1-2 hari kerja.
                  </p>
                </div>
              </SectionCard>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                  <ChevronLeft className="w-4 h-4" /> Sebelumnya
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60 text-sm"
                >
                  {submitting ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim data...</>
                  ) : (
                    <><CheckCircle className="w-4 h-4" /> Kirim Pendaftaran</>
                  )}
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  )
}

// ===== Helper Components =====

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-5 pb-3 border-b border-gray-50">
        <span className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">{icon}</span>
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-sm font-medium text-gray-700 block mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

const FormInput = ({ icon, error, ...props }: any) => (
  <div>
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">{icon}</span>}
      <input {...props}
        className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition ${
          icon ? 'pl-9' : ''
        } ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
)

function StepNav({ onPrev, onNext, isFirst }: { onPrev?: () => void; onNext?: () => void; isFirst?: boolean }) {
  return (
    <div className="flex gap-3">
      {!isFirst && onPrev && (
        <button type="button" onClick={onPrev}
          className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
          <ChevronLeft className="w-4 h-4" /> Sebelumnya
        </button>
      )}
      {onNext && (
        <button type="button" onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-sm">
          Selanjutnya <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
