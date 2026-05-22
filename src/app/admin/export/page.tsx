'use client'
// src/app/admin/export/page.tsx
import { useState } from 'react'
import { Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react'
import { exportAlumniToExcel, parseAlumniFromExcel, downloadTemplate } from '@/lib/export'
import { getAllAlumniForExport } from '@/lib/queries/alumni'
import { createClient } from '@/lib/supabase/client'

export default function ExportImportPage() {
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null)
  const [exporting, setExporting] = useState(false)

  const supabase = createClient()

  const handleExport = async () => {
    setExporting(true)
    try {
      const data = await getAllAlumniForExport()
      exportAlumniToExcel(data as any)
    } catch (e) {
      alert('Gagal export data')
    } finally {
      setExporting(false)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    setImportResult(null)

    try {
      const rows = await parseAlumniFromExcel(file)
      let success = 0
      const errors: string[] = []

      for (const row of rows) {
        if (!row.nama_lengkap) {
          errors.push(`Baris dilewati: nama kosong`)
          continue
        }

        const { error } = await supabase
          .from('alumni')
          .insert({
            nama_lengkap: row.nama_lengkap,
            angkatan: row.angkatan,
            jurusan: row.jurusan,
            whatsapp: row.whatsapp,
            email: row.email,
            instagram: row.instagram,
            jabatan: row.jabatan,
            perusahaan: row.perusahaan,
            bio: row.bio,
            is_active: true,
          })

        if (error) {
          errors.push(`${row.nama_lengkap}: ${error.message}`)
        } else {
          success++
        }
      }

      setImportResult({ success, errors })
    } catch (err: any) {
      alert(err.message || 'Gagal import')
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Export / Import Data</h1>
      <p className="text-gray-400 mb-8">Kelola data alumni dalam format Excel/CSV</p>

      {/* Export */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Download className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900 mb-1">Export Data Alumni</h2>
            <p className="text-sm text-gray-400 mb-4">
              Download semua data alumni dalam format Excel (.xlsx)
            </p>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition disabled:opacity-60"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {exporting ? 'Mengunduh...' : 'Download Excel'}
            </button>
          </div>
        </div>
      </div>

      {/* Template */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900 mb-1">Template Import</h2>
            <p className="text-sm text-gray-400 mb-4">
              Download template Excel untuk mengisi data alumni massal
            </p>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
            >
              <Download className="w-4 h-4" />
              Download Template
            </button>
          </div>
        </div>
      </div>

      {/* Import */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Upload className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900 mb-1">Import Data Alumni</h2>
            <p className="text-sm text-gray-400 mb-2">
              Upload file Excel (.xlsx) sesuai template untuk import massal
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 text-xs text-yellow-700">
              ⚠️ Pastikan format file sesuai template. Kota & Profesi harus diisi manual di edit setelah import.
            </div>

            <label className={`flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer w-fit ${importing ? 'opacity-60 pointer-events-none' : ''}`}>
              <Upload className="w-4 h-4" />
              {importing ? 'Mengimport...' : 'Pilih File Excel'}
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleImport}
                disabled={importing}
                className="hidden"
              />
            </label>

            {/* Result */}
            {importResult && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-xl">
                  <CheckCircle className="w-4 h-4" />
                  {importResult.success} alumni berhasil diimport
                </div>
                {importResult.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-sm text-red-700 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      {importResult.errors.length} baris gagal:
                    </div>
                    <ul className="text-xs text-red-600 space-y-0.5 max-h-32 overflow-y-auto">
                      {importResult.errors.map((e, i) => <li key={i}>• {e}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
