// src/lib/export.ts
import * as XLSX from 'xlsx'
import type { Alumni } from '@/types'

export function exportAlumniToExcel(data: Alumni[]) {
  const rows = data.map((a, i) => ({
    'No': i + 1,
    'Nama Lengkap': a.nama_lengkap,
    'Angkatan': a.angkatan || '',
    'Jurusan': a.jurusan || '',
    'Kota': (a.master_kota as any)?.nama || '',
    'Profesi': (a.master_profesi as any)?.nama || '',
    'Jabatan': a.jabatan || '',
    'Perusahaan': a.perusahaan || '',
    'WhatsApp': a.whatsapp || '',
    'Email': a.email || '',
    'Instagram': a.instagram || '',
    'UMKM': (a.umkm as any)?.map((u: any) => u.nama_usaha).join(', ') || '',
    'Status': a.is_active ? 'Aktif' : 'Nonaktif',
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Alumni')

  // Auto column width
  const colWidths = Object.keys(rows[0] || {}).map(key => ({
    wch: Math.max(key.length, 15)
  }))
  ws['!cols'] = colWidths

  XLSX.writeFile(wb, `alumni-export-${new Date().toISOString().split('T')[0]}.xlsx`)
}

export function parseAlumniFromExcel(file: File): Promise<Partial<Alumni>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet) as any[]

        const alumni = rows.map(row => ({
          nama_lengkap: row['Nama Lengkap'] || row['nama_lengkap'] || '',
          angkatan: row['Angkatan'] || row['angkatan'] || undefined,
          jurusan: row['Jurusan'] || row['jurusan'] || '',
          whatsapp: row['WhatsApp'] || row['whatsapp'] || '',
          email: row['Email'] || row['email'] || '',
          instagram: row['Instagram'] || row['instagram'] || '',
          jabatan: row['Jabatan'] || row['jabatan'] || '',
          perusahaan: row['Perusahaan'] || row['perusahaan'] || '',
          bio: row['Bio'] || row['bio'] || '',
          is_active: true,
        }))

        resolve(alumni)
      } catch (err) {
        reject(new Error('Format file tidak valid'))
      }
    }
    reader.onerror = () => reject(new Error('Gagal membaca file'))
    reader.readAsArrayBuffer(file)
  })
}

export function downloadTemplate() {
  const template = [{
    'Nama Lengkap': 'Contoh: Budi Santoso',
    'Angkatan': 2015,
    'Jurusan': 'Teknik Informatika',
    'WhatsApp': '081234567890',
    'Email': 'budi@email.com',
    'Instagram': '@budisantoso',
    'Jabatan': 'Software Engineer',
    'Perusahaan': 'PT Contoh Jaya',
    'Bio': 'Bio singkat alumni',
  }]

  const ws = XLSX.utils.json_to_sheet(template)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Template Alumni')
  XLSX.writeFile(wb, 'template-import-alumni.xlsx')
}
