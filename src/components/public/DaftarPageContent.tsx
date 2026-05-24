'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useMasterKategoriUsaha, useMasterBenefit, useMasterProfesi } from '@/hooks/useAlumni'
import { uploadFotoAlumni, uploadFotoUMKM, uploadLogo, validateImageFile } from '@/lib/upload'
import Navbar from '@/components/public/Navbar'
import Link from 'next/link'
import { PROVINSI, getKotaByProvinsi } from '@/lib/wilayah'
import {
  User, GraduationCap, MapPin, Phone, Mail, Instagram,
  Briefcase, Building2, ShoppingBag, Tag,
  Upload, CheckCircle, ChevronRight, ChevronLeft,
  Globe, Package, Gift, FileText, Camera, Plus, Trash2
} from 'lucide-react'

const STEPS = ['Identitas', 'Profesi', 'UMKM', 'Persetujuan']

interface UMKMForm {
  namaUsaha: string
  kategoriUsahaId: string
  deskripsiUsaha: string
  skalaUsaha: string
  provinsiUsaha: string
  kotaUsaha: string
  jangkauan: string
  whatsappBisnis: string
  instagramUsaha: string
  tokoOnline: string
  websiteUsaha: string
  benefitIds: string[]
  fotoProduk: File[]
  fotoProdukPreview: string[]
  logoFile: File | null
  logoPreview: string | null
}

const emptyUMKM = (): UMKMForm => ({
  namaUsaha: '', kategoriUsahaId: '', deskripsiUsaha: '', skalaUsaha: '',
  provinsiUsaha: '', kotaUsaha: '', jangkauan: '', whatsappBisnis: '',
  instagramUsaha: '', tokoOnline: '', websiteUsaha: '', benefitIds: [],
  fotoProduk: [], fotoProdukPreview: [], logoFile: null, logoPreview: null,
})

export default function DaftarPageContent() {
  const [step, setStep] = useState(0)
  const [namaLengkap, setNamaLengkap] = useState('')
  const [angkatan, setAngkatan] = useState('')
  const [jurusan, setJurusan] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [profesi, setProfesi] = useState('')
  const [jabatan, setJabatan] = useState('')
  const [perusahaan, setPerusahaan] = useState('')
  const [provinsiDomisili, setProvinsiDomisili] = useState('')
  const [kotaDomisili, setKotaDomisili] = useState('')
  const [bio, setBio] = useState('')

  const [punyaUmkm, setPunyaUmkm] = useState(false)
  const [umkmForms, setUmkmForms] = useState<UMKMForm[]>([emptyUMKM()])

  const [setujuData, setSetujuData] = useState(false)
  const [setujuTampil, setSetujuTampil] = useState(false)
  const [setujuVerifikasi, setSetujuVerifikasi] = useState(true)

  const [fotoAlumni, setFotoAlumni] = useState<File | null>(null)
  const [fotoAlumniPreview, setFotoAlumniPreview] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const { data: kategoris } = useMasterKategoriUsaha()
  const { data: benefits } = useMasterBenefit()
  const { data: profesiList } = useMasterProfesi()
  const supabase = createClient()

  const kotaDomisiliList = provinsiDomisili ? getKotaByProvinsi(provinsiDomisili) : []

  const updateUMKM = (idx: number, field: keyof UMKMForm, value: any) => {
    setUmkmForms(prev => prev.map((u, i) => i === idx ? { ...u, [field]: value } : u))
  }

  const addUMKM = () => setUmkmForms(prev => [...prev, emptyUMKM()])
  const removeUMKM = (idx: number) => setUmkmForms(prev => prev.filter((_, i) => i !== idx))

  const handleFotoAlumni = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const err = validateImageFile(file)
    if (err) { setError(err); return }
    setFotoAlumni(file)
    setFotoAlumniPreview(URL.createObjectURL(file))
  }

  const handleFotoProduk = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3)
    updateUMKM(idx, 'fotoProduk', files)
    updateUMKM(idx, 'fotoProdukPreview', files.map(f => URL.createObjectURL(f)))
  }

  const handleLogo = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    updateUMKM(idx, 'logoFile', file)
    updateUMKM(idx, 'logoPreview', URL.createObjectURL(file))
  }

  const toggleBenefit = (idx: number, id: string) => {
    const u = umkmForms[idx]
    const newIds = u.benefitIds.includes(id)
      ? u.benefitIds.filter(b => b !== id)
      : [...u.benefitIds, id]
    updateUMKM(idx, 'benefitIds', newIds)
  }

  const handleKirim = async () => {
    setError('')
    if (!setujuData || !setujuTampil) { setError('Harap centang semua pernyataan persetujuan'); return }
    if (!namaLengkap || namaLengkap.length < 2) { setError('Nama lengkap belum diisi'); setStep(0); return }
    if (!angkatan) { setError('Angkatan belum diisi'); setStep(0); return }
    if (!jurusan) { setError('Jurusan belum diisi'); setStep(0); return }
    if (!whatsapp || whatsapp.length < 10) { setError('Nomor WhatsApp belum diisi'); setStep(0); return }
    if (!email || !email.includes('@')) { setError('Email belum diisi'); setStep(0); return }

    setSubmitting(true)
    try {
      const { data: alumni, error: alumniErr } = await supabase
        .from('alumni')
        .insert({
          nama_lengkap: namaLengkap,
          angkatan: parseInt(angkatan),
          jurusan,
          whatsapp,
          email,
          jabatan: profesi || jabatan || null,
          perusahaan: perusahaan || null,
          bio: bio || null,
          is_active: false,
        })
        .select()
        .single()

      if (alumniErr) throw new Error(alumniErr.message)

      if (fotoAlumni && alumni) {
        try {
          const fotoUrl = await uploadFotoAlumni(fotoAlumni, alumni.id)
          await supabase.from('alumni').update({ foto_url: fotoUrl }).eq('id', alumni.id)
        } catch {}
      }

      if (punyaUmkm && alumni) {
        for (const u of umkmForms) {
          if (!u.namaUsaha) continue
          const { data: umkm, error: umkmErr } = await supabase
            .from('umkm')
            .insert({
              alumni_id: alumni.id,
              nama_usaha: u.namaUsaha,
              kategori_usaha_id: u.kategoriUsahaId || null,
              deskripsi: u.deskripsiUsaha || null,
              skala_usaha: u.skalaUsaha || null,
              jangkauan: u.jangkauan || null,
              whatsapp_bisnis: u.whatsappBisnis || null,
              instagram_usaha: u.instagramUsaha || null,
              toko_online: u.tokoOnline || null,
              website: u.websiteUsaha || null,
              is_active: false,
            })
            .select()
            .single()

          if (!umkmErr && umkm) {
            if (u.fotoProduk.length > 0) {
              try {
                const urls = await Promise.all(u.fotoProduk.map((f, i) => uploadFotoUMKM(f, umkm.id, i)))
                await supabase.from('umkm').update({ foto_produk_urls: urls }).eq('id', umkm.id)
              } catch {}
            }
            if (u.logoFile) {
              try {
                const logoUrl = await uploadLogo(u.logoFile, umkm.id)
                await supabase.from('umkm').update({ logo_url: logoUrl }).eq('id', umkm.id)
              } catch {}
            }
            if (u.benefitIds.length > 0) {
              await supabase.from('umkm_benefits').insert(
                u.benefitIds.map(bid => ({ umkm_id: umkm.id, benefit_id: bid }))
              )
            }
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
      <div className="min-h-screen" style={{ background: '#FAF8F4', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <div className="flex h-1 pt-14">
          <div className="flex-[3]" style={{ background: '#C0272D' }} />
          <div className="flex-[1]" style={{ background: '#2A2A2A' }} />
          <div className="flex-[2]" style={{ background: '#6B6B6B' }} />
          <div className="flex-[1]" style={{ background: '#C0272D' }} />
          <div className="flex-[3]" style={{ background: '#2A2A2A' }} />
        </div>
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="bg-white rounded-3xl border p-10 max-w-sm w-full text-center" style={{ borderColor: '#E0DDD8' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#F9ECEC' }}>
              <CheckCircle className="w-8 h-8" style={{ color: '#C0272D' }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#1A1A1A' }}>
              Pendaftaran Berhasil!
            </h2>
            <p className="text-sm mb-2" style={{ color: '#6B6B6B' }}>Data kamu sudah kami terima dan sedang menunggu verifikasi admin.</p>
            <p className="text-xs mb-8" style={{ color: '#9B9B9B' }}>Setelah diverifikasi, profil kamu akan tampil di website.</p>
            <Link href="/" className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold transition hover:opacity-90"
              style={{ background: '#C0272D' }}>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <div className="flex h-1 pt-14">
        <div className="flex-[3]" style={{ background: '#C0272D' }} />
        <div className="flex-[1]" style={{ background: '#2A2A2A' }} />
        <div className="flex-[2]" style={{ background: '#6B6B6B' }} />
        <div className="flex-[1]" style={{ background: '#C0272D' }} />
        <div className="flex-[3]" style={{ background: '#2A2A2A' }} />
      </div>

      {/* Header dark */}
      <div style={{ background: '#2A2A2A' }}>
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(192,39,45,0.3)' }}>
              <User className="w-5 h-5" style={{ color: '#E8857A' }} />
            </div>
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Daftar Alumni</h1>
          </div>
          <p className="text-xs ml-12" style={{ color: 'rgba(255,255,255,0.4)' }}>Lengkapi data dirimu untuk tampil di direktori alumni</p>
        </div>
        <div className="h-6 rounded-t-[28px]" style={{ background: '#FAF8F4' }} />
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-12" style={{ marginTop: '-4px' }}>
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: i <= step ? '#C0272D' : '#E0DDD8',
                    color: i <= step ? 'white' : '#9B9B9B',
                    boxShadow: i === step ? '0 0 0 4px rgba(192,39,45,0.15)' : 'none',
                  }}>
                  {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <span className="text-xs mt-1.5 font-medium hidden sm:block"
                  style={{ color: i === step ? '#C0272D' : '#9B9B9B' }}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 transition-all"
                  style={{ background: i < step ? '#C0272D' : '#E0DDD8' }} />
              )}
            </div>
          ))}
        </div>

        {/* STEP 0: IDENTITAS */}
        {step === 0 && (
          <div className="space-y-5">
            <SectionCard title="A. Identitas Alumni" icon={<User className="w-4 h-4" />}>
              <div>
                <Label>Foto Alumni</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed flex-shrink-0"
                    style={{ background: '#F0EDEA', borderColor: '#E0DDD8' }}>
                    {fotoAlumniPreview
                      ? <img src={fotoAlumniPreview} alt="" className="w-full h-full object-cover" />
                      : <Camera className="w-6 h-6" style={{ color: '#C0C0C0' }} />}
                  </div>
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-xl text-sm transition hover:opacity-80"
                    style={{ borderColor: '#E0DDD8', color: '#6B6B6B', background: 'white' }}>
                    <Upload className="w-4 h-4" />
                    {fotoAlumniPreview ? 'Ganti Foto' : 'Upload Foto'}
                    <input type="file" accept="image/*" onChange={handleFotoAlumni} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label required>Nama Lengkap</Label>
                  <Input value={namaLengkap} onChange={e => setNamaLengkap(e.target.value)}
                    placeholder="Nama sesuai KTP" icon={<User className="w-4 h-4" />} />
                </div>
                <div>
                  <Label required>Angkatan / Tahun Lulus</Label>
                  <Input value={angkatan} onChange={e => setAngkatan(e.target.value)}
                    placeholder="cth: 2015" icon={<GraduationCap className="w-4 h-4" />} />
                </div>
                <div>
                  <Label required>Jurusan / Program Studi</Label>
                  <Input value={jurusan} onChange={e => setJurusan(e.target.value)}
                    placeholder="cth: Teknik Informatika" icon={<GraduationCap className="w-4 h-4" />} />
                </div>
                <div>
                  <Label required>Nomor WhatsApp</Label>
                  <Input value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
                    placeholder="08xxxxxxxxxx" icon={<Phone className="w-4 h-4" />} />
                  <p className="text-xs mt-1" style={{ color: '#9B9B9B' }}>Tidak ditampilkan ke publik</p>
                </div>
                <div>
                  <Label required>Email Aktif</Label>
                  <Input value={email} onChange={e => setEmail(e.target.value)}
                    type="email" placeholder="email@contoh.com" icon={<Mail className="w-4 h-4" />} />
                </div>
              </div>
            </SectionCard>
            <StepNav onNext={() => setStep(1)} isFirst />
          </div>
        )}

        {/* STEP 1: PROFESI — dropdown dari Supabase */}
        {step === 1 && (
          <div className="space-y-5">
            <SectionCard title="B. Profil Profesi (Opsional)" icon={<Briefcase className="w-4 h-4" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Profesi / Pekerjaan</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#C0C0C0' }} />
                    <select value={profesi} onChange={e => setProfesi(e.target.value)}
                      className="w-full border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none transition appearance-none"
                      style={{ borderColor: '#E0DDD8', background: 'white', color: profesi ? '#1A1A1A' : '#9B9B9B' }}>
                      <option value="">Pilih profesi...</option>
                      {profesiList?.map(p => (
                        <option key={p.id} value={p.nama}>{p.nama}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Jabatan</Label>
                  <Input value={jabatan} onChange={e => setJabatan(e.target.value)}
                    placeholder="cth: Senior Developer" icon={<Briefcase className="w-4 h-4" />} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Perusahaan / Instansi</Label>
                  <Input value={perusahaan} onChange={e => setPerusahaan(e.target.value)}
                    placeholder="cth: PT Contoh Jaya" icon={<Building2 className="w-4 h-4" />} />
                </div>
                <div>
                  <Label>Provinsi Domisili</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#C0C0C0' }} />
                    <select value={provinsiDomisili}
                      onChange={e => { setProvinsiDomisili(e.target.value); setKotaDomisili('') }}
                      className="w-full border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none transition"
                      style={{ borderColor: '#E0DDD8', background: 'white', color: '#1A1A1A' }}>
                      <option value="">Pilih provinsi...</option>
                      {PROVINSI.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Kota / Kabupaten</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#C0C0C0' }} />
                    <select value={kotaDomisili} onChange={e => setKotaDomisili(e.target.value)}
                      disabled={!provinsiDomisili}
                      className="w-full border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none transition disabled:opacity-50"
                      style={{ borderColor: '#E0DDD8', background: 'white', color: '#1A1A1A' }}>
                      <option value="">{provinsiDomisili ? 'Pilih kota...' : 'Pilih provinsi dulu'}</option>
                      {kotaDomisiliList.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Label>Bio Singkat</Label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                    placeholder="Ceritakan sedikit tentang dirimu..."
                    className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none resize-none transition"
                    style={{ borderColor: '#E0DDD8', background: 'white', color: '#1A1A1A' }} />
                </div>
              </div>
            </SectionCard>
            <StepNav onPrev={() => setStep(0)} onNext={() => setStep(2)} />
          </div>
        )}

        {/* STEP 2: UMKM — multi UMKM */}
        {step === 2 && (
          <div className="space-y-5">
            <SectionCard title="C. Usaha UMKM" icon={<ShoppingBag className="w-4 h-4" />}>
              <div
                onClick={() => setPunyaUmkm(!punyaUmkm)}
                className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition"
                style={{
                  background: punyaUmkm ? '#F9ECEC' : '#FAFAFA',
                  borderColor: punyaUmkm ? '#C0272D' : '#E0DDD8',
                }}>
                <div className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition"
                  style={{ background: punyaUmkm ? '#C0272D' : 'white', borderColor: punyaUmkm ? '#C0272D' : '#D0CCC8' }}>
                  {punyaUmkm && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-sm font-medium" style={{ color: punyaUmkm ? '#C0272D' : '#3A3A3A' }}>
                  Saya memiliki usaha / UMKM yang ingin ditampilkan
                </span>
              </div>

              {punyaUmkm && (
                <div className="space-y-4">
                  {umkmForms.map((u, idx) => (
                    <UMKMFormBlock
                      key={idx}
                      idx={idx}
                      u={u}
                      kategoris={kategoris}
                      benefits={benefits}
                      onUpdate={updateUMKM}
                      onRemove={umkmForms.length > 1 ? () => removeUMKM(idx) : undefined}
                      onFotoProduk={(e) => handleFotoProduk(idx, e)}
                      onLogo={(e) => handleLogo(idx, e)}
                      onToggleBenefit={(id) => toggleBenefit(idx, id)}
                    />
                  ))}

                  <button type="button" onClick={addUMKM}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-semibold transition hover:opacity-80"
                    style={{ borderColor: '#C0272D', color: '#C0272D', background: '#F9ECEC' }}>
                    <Plus className="w-4 h-4" /> Tambah UMKM Lain
                  </button>
                </div>
              )}
            </SectionCard>
            <StepNav onPrev={() => setStep(1)} onNext={() => setStep(3)} />
          </div>
        )}

        {/* STEP 3: PERSETUJUAN */}
        {step === 3 && (
          <div className="space-y-5">
            <SectionCard title="D. Persetujuan" icon={<FileText className="w-4 h-4" />}>
              <div className="space-y-3">
                {[
                  { value: setujuData, setter: setSetujuData, label: 'Data yang saya isi adalah benar dan merupakan usaha/profil milik saya sendiri' },
                  { value: setujuTampil, setter: setSetujuTampil, label: 'Saya menyetujui data dan foto saya ditampilkan di website alumni' },
                  { value: setujuVerifikasi, setter: setSetujuVerifikasi, label: 'Saya bersedia dihubungi admin untuk verifikasi jika diperlukan' },
                ].map((item, i) => (
                  <div key={i} onClick={() => item.setter(!item.value)}
                    className="flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition"
                    style={{ borderColor: item.value ? '#C0272D' : '#E0DDD8', background: item.value ? '#F9ECEC' : 'white' }}>
                    <div className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition"
                      style={{ background: item.value ? '#C0272D' : 'white', borderColor: item.value ? '#C0272D' : '#D0CCC8' }}>
                      {item.value && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-sm" style={{ color: '#3A3A3A' }}>{item.label}</span>
                  </div>
                ))}
              </div>
              {error && (
                <div className="border text-sm px-4 py-3 rounded-xl mt-3"
                  style={{ background: '#F9ECEC', borderColor: '#EDCACA', color: '#C0272D' }}>
                  {error}
                </div>
              )}
              <div className="border rounded-xl p-4 mt-3" style={{ background: '#FFFBF0', borderColor: '#F0E0A0' }}>
                <p className="text-xs" style={{ color: '#8B6914' }}>
                  ⏳ <strong>Catatan:</strong> Pendaftaran kamu akan diverifikasi admin terlebih dahulu. Proses verifikasi biasanya 1-2 hari kerja.
                </p>
              </div>
            </SectionCard>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-3 border rounded-xl text-sm font-medium transition hover:opacity-80"
                style={{ borderColor: '#E0DDD8', color: '#6B6B6B', background: 'white' }}>
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </button>
              <button type="button" disabled={submitting} onClick={handleKirim}
                className="flex-1 flex items-center justify-center gap-2 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 text-sm hover:opacity-90"
                style={{ background: '#C0272D' }}>
                {submitting
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim...</>
                  : <><CheckCircle className="w-4 h-4" /> Kirim Pendaftaran</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── UMKM Form Block ──
function UMKMFormBlock({ idx, u, kategoris, benefits, onUpdate, onRemove, onFotoProduk, onLogo, onToggleBenefit }: {
  idx: number
  u: UMKMForm
  kategoris: any
  benefits: any
  onUpdate: (idx: number, field: any, value: any) => void
  onRemove?: () => void
  onFotoProduk: (e: React.ChangeEvent<HTMLInputElement>) => void
  onLogo: (e: React.ChangeEvent<HTMLInputElement>) => void
  onToggleBenefit: (id: string) => void
}) {
  const kotaUsahaList = u.provinsiUsaha ? getKotaByProvinsi(u.provinsiUsaha) : []

  return (
    <div className="border rounded-2xl p-4 space-y-4 relative" style={{ borderColor: '#E0DDD8', background: '#FAFAFA' }}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: '#C0272D' }}>Usaha {idx + 1}</span>
        {onRemove && (
          <button type="button" onClick={onRemove}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition hover:opacity-80"
            style={{ borderColor: '#EDCACA', color: '#C0272D', background: '#F9ECEC' }}>
            <Trash2 className="w-3.5 h-3.5" /> Hapus
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Nama Usaha / Brand</Label>
          <Input value={u.namaUsaha} onChange={e => onUpdate(idx, 'namaUsaha', e.target.value)}
            placeholder="cth: Batik Nusantara" icon={<ShoppingBag className="w-4 h-4" />} />
        </div>
        <div>
          <Label>Kategori Usaha</Label>
          <select value={u.kategoriUsahaId} onChange={e => onUpdate(idx, 'kategoriUsahaId', e.target.value)}
            className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none transition"
            style={{ borderColor: '#E0DDD8', background: 'white', color: '#1A1A1A' }}>
            <option value="">Pilih kategori...</option>
            {kategoris?.map((k: any) => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
        </div>
      </div>

      <div>
        <Label>Deskripsi Usaha</Label>
        <textarea value={u.deskripsiUsaha} onChange={e => onUpdate(idx, 'deskripsiUsaha', e.target.value)} rows={3}
          placeholder="Ceritakan produk/jasa kamu..."
          className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none resize-none transition"
          style={{ borderColor: '#E0DDD8', background: 'white', color: '#1A1A1A' }} />
      </div>

      <div>
        <Label>Skala Usaha</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'hobby', label: 'Usaha Sampingan / Hobby' },
            { value: 'kecil', label: 'Usaha Aktif (single fighter)' },
            { value: 'menengah', label: 'Usaha Aktif (1-10 karyawan)' },
            { value: 'besar', label: 'Usaha Aktif (>10 karyawan)' },
          ].map(opt => (
            <div key={opt.value} onClick={() => onUpdate(idx, 'skalaUsaha', opt.value)}
              className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer text-xs transition"
              style={{
                borderColor: u.skalaUsaha === opt.value ? '#C0272D' : '#E0DDD8',
                background: u.skalaUsaha === opt.value ? '#F9ECEC' : 'white',
                color: u.skalaUsaha === opt.value ? '#C0272D' : '#6B6B6B',
              }}>
              <div className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition"
                style={{ background: u.skalaUsaha === opt.value ? '#C0272D' : 'white', borderColor: u.skalaUsaha === opt.value ? '#C0272D' : '#D0CCC8' }} />
              {opt.label}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Provinsi Domisili Usaha</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#C0C0C0' }} />
            <select value={u.provinsiUsaha}
              onChange={e => { onUpdate(idx, 'provinsiUsaha', e.target.value); onUpdate(idx, 'kotaUsaha', '') }}
              className="w-full border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none transition"
              style={{ borderColor: '#E0DDD8', background: 'white', color: '#1A1A1A' }}>
              <option value="">Pilih provinsi...</option>
              {PROVINSI.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div>
          <Label>Kota / Kabupaten</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#C0C0C0' }} />
            <select value={u.kotaUsaha} onChange={e => onUpdate(idx, 'kotaUsaha', e.target.value)}
              disabled={!u.provinsiUsaha}
              className="w-full border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none transition disabled:opacity-50"
              style={{ borderColor: '#E0DDD8', background: 'white', color: '#1A1A1A' }}>
              <option value="">{u.provinsiUsaha ? 'Pilih kota...' : 'Pilih provinsi dulu'}</option>
              {kotaUsahaList.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        </div>
        <div className="sm:col-span-2">
          <Label>Jangkauan Pengiriman</Label>
          <select value={u.jangkauan} onChange={e => onUpdate(idx, 'jangkauan', e.target.value)}
            className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none transition"
            style={{ borderColor: '#E0DDD8', background: 'white', color: '#1A1A1A' }}>
            <option value="">Pilih jangkauan...</option>
            <option value="lokal">Lokal (satu kota)</option>
            <option value="regional">Regional (antar kota/provinsi)</option>
            <option value="nasional">Nasional (seluruh Indonesia)</option>
            <option value="internasional">Internasional</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>WhatsApp Bisnis</Label>
          <Input value={u.whatsappBisnis} onChange={e => onUpdate(idx, 'whatsappBisnis', e.target.value)}
            placeholder="08xxxxxxxxxx" icon={<Phone className="w-4 h-4" />} />
        </div>
        <div>
          <Label>Instagram Usaha</Label>
          <Input value={u.instagramUsaha} onChange={e => onUpdate(idx, 'instagramUsaha', e.target.value)}
            placeholder="@namaakun" icon={<Instagram className="w-4 h-4" />} />
        </div>
        <div>
          <Label>Toko Online</Label>
          <Input value={u.tokoOnline} onChange={e => onUpdate(idx, 'tokoOnline', e.target.value)}
            placeholder="tokopedia.com/namatoko" icon={<Package className="w-4 h-4" />} />
        </div>
        <div>
          <Label>Website</Label>
          <Input value={u.websiteUsaha} onChange={e => onUpdate(idx, 'websiteUsaha', e.target.value)}
            placeholder="https://namawebsite.com" icon={<Globe className="w-4 h-4" />} />
        </div>
      </div>

      {benefits?.length > 0 && (
        <div>
          <Label>Benefit untuk Sesama Alumni</Label>
          <p className="text-xs mb-3" style={{ color: '#9B9B9B' }}>Pilih semua yang berlaku</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {benefits.map((b: any) => (
              <div key={b.id} onClick={() => onToggleBenefit(b.id)}
                className="flex items-center gap-2.5 p-3 border rounded-xl cursor-pointer text-sm transition"
                style={{
                  borderColor: u.benefitIds.includes(b.id) ? '#C0272D' : '#E0DDD8',
                  background: u.benefitIds.includes(b.id) ? '#F9ECEC' : 'white',
                  color: u.benefitIds.includes(b.id) ? '#C0272D' : '#6B6B6B',
                }}>
                <div className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition"
                  style={{ background: u.benefitIds.includes(b.id) ? '#C0272D' : 'white', borderColor: u.benefitIds.includes(b.id) ? '#C0272D' : '#D0CCC8' }}>
                  {u.benefitIds.includes(b.id) && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-base">{(b as any).emoji || '🎁'}</span>
                {b.nama}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label>Foto Produk (1-3 foto)</Label>
        <p className="text-xs mb-2" style={{ color: '#9B9B9B' }}>Format JPG/PNG, maks. 5MB</p>
        <div className="flex gap-3 flex-wrap">
          {u.fotoProdukPreview.map((src, i) => (
            <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border" style={{ borderColor: '#E0DDD8' }}>
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {u.fotoProdukPreview.length < 3 && (
            <label className="w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition hover:opacity-70"
              style={{ borderColor: '#E0DDD8' }}>
              <Camera className="w-6 h-6" style={{ color: '#C0C0C0' }} />
              <input type="file" accept="image/*" multiple onChange={onFotoProduk} className="hidden" />
            </label>
          )}
        </div>
      </div>

      <div>
        <Label>Logo Usaha (opsional)</Label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center border flex-shrink-0"
            style={{ background: '#F0EDEA', borderColor: '#E0DDD8' }}>
            {u.logoPreview
              ? <img src={u.logoPreview} alt="" className="w-full h-full object-contain" />
              : <Tag className="w-6 h-6" style={{ color: '#C0C0C0' }} />}
          </div>
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-xl text-sm transition hover:opacity-80"
            style={{ borderColor: '#E0DDD8', color: '#6B6B6B', background: 'white' }}>
            <Upload className="w-4 h-4" />
            {u.logoPreview ? 'Ganti Logo' : 'Upload Logo'}
            <input type="file" accept="image/*" onChange={onLogo} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  )
}

// ── Helpers ──
function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border rounded-2xl p-5" style={{ borderColor: '#E0DDD8' }}>
      <h2 className="flex items-center gap-2 font-bold mb-5 pb-3 border-b" style={{ color: '#1A1A1A', borderColor: '#F0EDEA' }}>
        <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#F9ECEC', color: '#C0272D' }}>
          {icon}
        </span>
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-sm font-medium block mb-1.5" style={{ color: '#3A3A3A' }}>
      {children}{required && <span className="ml-0.5" style={{ color: '#C0272D' }}>*</span>}
    </label>
  )
}

function Input({ icon, error, ...props }: { icon?: React.ReactNode; error?: string; [key: string]: any }) {
  return (
    <div>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#C0C0C0' }}>{icon}</span>}
        <input {...props}
          className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none transition ${icon ? 'pl-9' : ''}`}
          style={{ borderColor: error ? '#EDCACA' : '#E0DDD8', background: error ? '#F9ECEC' : 'white', color: '#1A1A1A' }} />
      </div>
      {error && <p className="text-xs mt-1" style={{ color: '#C0272D' }}>{error}</p>}
    </div>
  )
}

function StepNav({ onPrev, onNext, isFirst }: { onPrev?: () => void; onNext?: () => void; isFirst?: boolean }) {
  return (
    <div className="flex gap-3">
      {!isFirst && onPrev && (
        <button type="button" onClick={onPrev}
          className="flex items-center gap-2 px-5 py-3 border rounded-xl text-sm font-medium transition hover:opacity-80"
          style={{ borderColor: '#E0DDD8', color: '#6B6B6B', background: 'white' }}>
          <ChevronLeft className="w-4 h-4" /> Sebelumnya
        </button>
      )}
      {onNext && (
        <button type="button" onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 text-white py-3 rounded-xl font-semibold transition hover:opacity-90 text-sm"
          style={{ background: '#C0272D' }}>
          Selanjutnya <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
