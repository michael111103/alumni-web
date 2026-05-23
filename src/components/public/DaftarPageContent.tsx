'use client'
import { useState } from 'react'
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

const STEPS = ['Identitas', 'Profesi', 'UMKM', 'Persetujuan']

export default function DaftarPageContent() {
 const [step, setStep] = useState(0)

 // Form state manual tanpa react-hook-form
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
 const [namaUsaha, setNamaUsaha] = useState('')
 const [kategoriUsahaId, setKategoriUsahaId] = useState('')
 const [deskripsiUsaha, setDeskripsiUsaha] = useState('')
 const [skalaUsaha, setSkalaUsaha] = useState('')
 const [provinsiUsaha, setProvinsiUsaha] = useState('')
 const [kotaUsaha, setKotaUsaha] = useState('')
 const [jangkauan, setJangkauan] = useState('')
 const [whatsappBisnis, setWhatsappBisnis] = useState('')
 const [instagramUsaha, setInstagramUsaha] = useState('')
 const [tokoOnline, setTokoOnline] = useState('')
 const [websiteUsaha, setWebsiteUsaha] = useState('')
 const [benefitIds, setBenefitIds] = useState<string[]>([])

 const [setujuData, setSetujuData] = useState(false)
 const [setujuTampil, setSetujuTampil] = useState(false)
 const [setujuVerifikasi, setSetujuVerifikasi] = useState(true)

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

 const kotaDomisiliList = provinsiDomisili ? getKotaByProvinsi(provinsiDomisili) : []
 const kotaUsahaList = provinsiUsaha ? getKotaByProvinsi(provinsiUsaha) : []

 const toggleBenefit = (id: string) => {
   setBenefitIds(prev =>
     prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
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

 const handleKirim = async () => {
   setError('')

   if (!setujuData || !setujuTampil) {
     setError('Harap centang semua pernyataan persetujuan')
     return
   }
   if (!namaLengkap || namaLengkap.length < 2) {
     setError('Nama lengkap belum diisi'); setStep(0); return
   }
   if (!angkatan) {
     setError('Angkatan belum diisi'); setStep(0); return
   }
   if (!jurusan) {
     setError('Jurusan belum diisi'); setStep(0); return
   }
   if (!whatsapp || whatsapp.length < 10) {
     setError('Nomor WhatsApp belum diisi'); setStep(0); return
   }
   if (!email || !email.includes('@')) {
     setError('Email belum diisi'); setStep(0); return
   }

   setSubmitting(true)
   try {
     const { data: alumni, error: alumniErr } = await supabase
       .from('alumni')
       .insert({
         nama_lengkap: namaLengkap,
         angkatan: parseInt(angkatan),
         jurusan: jurusan,
         whatsapp: whatsapp,
         email: email,
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

     if (punyaUmkm && namaUsaha && alumni) {
       const { data: umkm, error: umkmErr } = await supabase
         .from('umkm')
         .insert({
           alumni_id: alumni.id,
           nama_usaha: namaUsaha,
           kategori_usaha_id: kategoriUsahaId || null,
           deskripsi: deskripsiUsaha || null,
           skala_usaha: skalaUsaha || null,
           jangkauan: jangkauan || null,
           whatsapp_bisnis: whatsappBisnis || null,
           instagram_usaha: instagramUsaha || null,
           toko_online: tokoOnline || null,
           website: websiteUsaha || null,
           is_active: false,
         })
         .select()
         .single()

       if (!umkmErr && umkm) {
         if (fotoProduk.length > 0) {
           try {
             const urls = await Promise.all(fotoProduk.map((f, i) => uploadFotoUMKM(f, umkm.id, i)))
             await supabase.from('umkm').update({ foto_produk_urls: urls }).eq('id', umkm.id)
           } catch {}
         }
         if (logoFile) {
           try {
             const logoUrl = await uploadLogo(logoFile, umkm.id)
             await supabase.from('umkm').update({ logo_url: logoUrl }).eq('id', umkm.id)
           } catch {}
         }
         if (benefitIds.length > 0) {
           await supabase.from('umkm_benefits').insert(
             benefitIds.map(bid => ({ umkm_id: umkm.id, benefit_id: bid }))
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
         <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
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

       {/* STEP 0: IDENTITAS */}
       {step === 0 && (
         <div className="space-y-5">
           <SectionCard title="A. Identitas Alumni" icon={<User className="w-4 h-4" />}>
             <div>
               <Label>Foto Alumni</Label>
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
                 <p className="text-xs text-gray-400 mt-1">Tidak ditampilkan ke publik</p>
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

       {/* STEP 1: PROFESI */}
       {step === 1 && (
         <div className="space-y-5">
           <SectionCard title="B. Profil Profesi" icon={<Briefcase className="w-4 h-4" />}>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                 <Label>Profesi / Pekerjaan</Label>
                 <Input value={profesi} onChange={e => setProfesi(e.target.value)}
                   placeholder="cth: Software Engineer" icon={<Briefcase className="w-4 h-4" />} />
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
                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                   <select value={provinsiDomisili}
                     onChange={e => { setProvinsiDomisili(e.target.value); setKotaDomisili('') }}
                     className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
                     <option value="">Pilih provinsi...</option>
                     {PROVINSI.map(p => <option key={p} value={p}>{p}</option>)}
                   </select>
                 </div>
               </div>

               <div>
                 <Label>Kota / Kabupaten</Label>
                 <div className="relative">
                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                   <select value={kotaDomisili} onChange={e => setKotaDomisili(e.target.value)}
                     disabled={!provinsiDomisili}
                     className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white disabled:bg-gray-50 disabled:text-gray-400">
                     <option value="">{provinsiDomisili ? 'Pilih kota...' : 'Pilih provinsi dulu'}</option>
                     {kotaDomisiliList.map(k => <option key={k} value={k}>{k}</option>)}
                   </select>
                 </div>
               </div>

               <div className="sm:col-span-2">
                 <Label>Bio Singkat</Label>
                 <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                   placeholder="Ceritakan sedikit tentang dirimu..."
                   className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
               </div>
             </div>
           </SectionCard>
           <StepNav onPrev={() => setStep(0)} onNext={() => setStep(2)} />
         </div>
       )}

       {/* STEP 2: UMKM */}
       {step === 2 && (
         <div className="space-y-5">
           <SectionCard title="C. Usaha UMKM" icon={<ShoppingBag className="w-4 h-4" />}>
             <div
               onClick={() => setPunyaUmkm(!punyaUmkm)}
               className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                 punyaUmkm ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
               }`}
             >
               <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                 punyaUmkm ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
               }`}>
                 {punyaUmkm && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
               </div>
               <span className={`text-sm font-medium ${punyaUmkm ? 'text-blue-700' : 'text-gray-700'}`}>
                 Saya memiliki usaha / UMKM yang ingin ditampilkan
               </span>
             </div>

             {punyaUmkm && (
               <div className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <Label>Nama Usaha / Brand</Label>
                     <Input value={namaUsaha} onChange={e => setNamaUsaha(e.target.value)}
                       placeholder="cth: Batik Nusantara" icon={<ShoppingBag className="w-4 h-4" />} />
                   </div>
                   <div>
                     <Label>Kategori Usaha</Label>
                     <select value={kategoriUsahaId} onChange={e => setKategoriUsahaId(e.target.value)}
                       className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
                       <option value="">Pilih kategori...</option>
                       {kategoris?.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                     </select>
                   </div>
                 </div>

                 <div>
                   <Label>Deskripsi Usaha</Label>
                   <textarea value={deskripsiUsaha} onChange={e => setDeskripsiUsaha(e.target.value)} rows={3}
                     placeholder="Ceritakan produk/jasa kamu..."
                     className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
                 </div>

                 <div>
                   <Label>Skala Usaha</Label>
                   <div className="grid grid-cols-2 gap-2">
                     {[
                       { value: 'hobby', label: 'Usaha Sampingan / Hobby' },
                       { value: 'kecil', label: 'Usaha Aktif (< karyawan)' },
                       { value: 'menengah', label: 'Usaha Aktif (1-5 karyawan)' },
                       { value: 'besar', label: 'Usaha Aktif (> 5 karyawan)' },
                     ].map(opt => (
                       <div key={opt.value} onClick={() => setSkalaUsaha(opt.value)}
                         className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer text-xs transition ${
                           skalaUsaha === opt.value ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                         }`}>
                         <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${skalaUsaha === opt.value ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`} />
                         {opt.label}
                       </div>
                     ))}
                   </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <Label>Provinsi Domisili Usaha</Label>
                     <div className="relative">
                       <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                       <select value={provinsiUsaha}
                         onChange={e => { setProvinsiUsaha(e.target.value); setKotaUsaha('') }}
                         className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
                         <option value="">Pilih provinsi...</option>
                         {PROVINSI.map(p => <option key={p} value={p}>{p}</option>)}
                       </select>
                     </div>
                   </div>
                   <div>
                     <Label>Kota / Kabupaten Usaha</Label>
                     <div className="relative">
                       <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                       <select value={kotaUsaha} onChange={e => setKotaUsaha(e.target.value)}
                         disabled={!provinsiUsaha}
                         className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white disabled:bg-gray-50 disabled:text-gray-400">
                         <option value="">{provinsiUsaha ? 'Pilih kota...' : 'Pilih provinsi dulu'}</option>
                         {kotaUsahaList.map(k => <option key={k} value={k}>{k}</option>)}
                       </select>
                     </div>
                   </div>
                   <div className="sm:col-span-2">
                     <Label>Jangkauan Pengiriman</Label>
                     <select value={jangkauan} onChange={e => setJangkauan(e.target.value)}
                       className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
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
                     <Input value={whatsappBisnis} onChange={e => setWhatsappBisnis(e.target.value)}
                       placeholder="08xxxxxxxxxx" icon={<Phone className="w-4 h-4" />} />
                   </div>
                   <div>
                     <Label>Instagram Usaha</Label>
                     <Input value={instagramUsaha} onChange={e => setInstagramUsaha(e.target.value)}
                       placeholder="@namaakun" icon={<Instagram className="w-4 h-4" />} />
                   </div>
                   <div>
                     <Label>Toko Online / Marketplace</Label>
                     <Input value={tokoOnline} onChange={e => setTokoOnline(e.target.value)}
                       placeholder="tokopedia.com/namatoko" icon={<Package className="w-4 h-4" />} />
                   </div>
                   <div>
                     <Label>Website</Label>
                     <Input value={websiteUsaha} onChange={e => setWebsiteUsaha(e.target.value)}
                       placeholder="https://namawebsite.com" icon={<Globe className="w-4 h-4" />} />
                   </div>
                 </div>

                 <div>
                   <Label>Benefit untuk Sesama Alumni</Label>
                   <p className="text-xs text-gray-400 mb-3">Pilih semua yang berlaku</p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                     {benefits?.map(b => (
                       <div key={b.id} onClick={() => toggleBenefit(b.id)}
                         className={`flex items-center gap-2.5 p-3 border rounded-xl cursor-pointer text-sm transition ${
                           benefitIds.includes(b.id) ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                         }`}>
                         <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${benefitIds.includes(b.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                           {benefitIds.includes(b.id) && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                         </div>
                         <Gift className="w-3.5 h-3.5 flex-shrink-0" />
                         {b.nama}
                       </div>
                     ))}
                   </div>
                 </div>

                 <div>
                   <Label>Foto Produk (1-3 foto)</Label>
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

                 <div>
                   <Label>Logo Usaha (opsional)</Label>
                   <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200 flex-shrink-0">
                       {logoPreview ? <img src={logoPreview} alt="" className="w-full h-full object-contain" /> : <Tag className="w-6 h-6 text-gray-300" />}
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
                   className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition ${
                     item.value ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                   }`}>
                   <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                     item.value ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                   }`}>
                     {item.value && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                   </div>
                   <span className="text-sm text-gray-700">{item.label}</span>
                 </div>
               ))}
             </div>

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
             <button type="button" disabled={submitting} onClick={handleKirim}
               className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60 text-sm">
               {submitting ? (
                 <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim data...</>
               ) : (
                 <><CheckCircle className="w-4 h-4" /> Kirim Pendaftaran</>
               )}
             </button>
           </div>
         </div>
       )}
     </div>
   </div>
 )
}

// Helper Components
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

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
 return (
   <label className="text-sm font-medium text-gray-700 block mb-1.5">
     {children}{required && <span className="text-red-500 ml-0.5">*</span>}
   </label>
 )
}

function Input({ icon, error, ...props }: { icon?: React.ReactNode; error?: string; [key: string]: any }) {
 return (
   <div>
     <div className="relative">
       {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">{icon}</span>}
       <input {...props} className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition ${icon ? 'pl-9' : ''} ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
     </div>
     {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
   </div>
 )
}

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
