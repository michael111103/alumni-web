'use client'

function MomenBersamaSection({ fotos }: { fotos: any[] }) {
  const [activeTab, setActiveTab] = useState<'reuni' | 'seminar' | 'workshop'>('reuni')

  const tabs = [
    { key: 'reuni' as const, label: 'Reuni 2024', bg: '#DDD8D0' },
    { key: 'seminar' as const, label: 'Seminar', bg: '#E0CBCB' },
    { key: 'workshop' as const, label: 'Workshop', bg: '#DCDCDA' },
  ]

  const filtered = fotos.filter(f => f.kategori === activeTab)

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex gap-2 mb-3">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="text-xs px-3 py-1.5 rounded-full border transition font-medium"
            style={{
              background: activeTab === tab.key ? '#2A2A2A' : 'white',
              color: activeTab === tab.key ? 'white' : '#6B6B6B',
              borderColor: activeTab === tab.key ? '#2A2A2A' : '#E0DDD8',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        // Placeholder kalau belum ada foto
        <div className="grid grid-cols-3 gap-2">
          {tabs.map(tab => (
            <div key={tab.key}
              className="relative h-28 rounded-xl flex items-center justify-center overflow-hidden"
              style={{ background: tab.bg }}>
              <ImageIcon className="w-6 h-6 opacity-25" style={{ color: '#888' }} />
              <div className="absolute bottom-2 left-2.5">
                <span className="text-white/85 text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,0,0,0.35)' }}>
                  {tab.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {filtered.slice(0, 3).map((foto, i) => (
            <div key={foto.id}
              className="relative h-28 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition">
              <img src={foto.foto_url} alt={foto.keterangan || ''} className="w-full h-full object-cover" />
              {foto.keterangan && (
                <div className="absolute bottom-2 left-2.5">
                  <span className="text-white/85 text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.45)' }}>
                    {foto.keterangan}
                  </span>
                </div>
              )}
            </div>
          ))}
          {filtered.length < 3 && Array.from({ length: 3 - filtered.length }).map((_, i) => {
            const tab = tabs.find(t => t.key === activeTab)!
            return (
              <div key={`empty-${i}`}
                className="relative h-28 rounded-xl flex items-center justify-center overflow-hidden"
                style={{ background: tab.bg }}>
                <ImageIcon className="w-6 h-6 opacity-25" style={{ color: '#888' }} />
              </div>
            )
          })}
        </div>
      )}
      <p className="text-center text-xs mt-2" style={{ color: '#6B6B6B' }}>
        {filtered.length === 0
          ? 'Placeholder — akan diisi foto kegiatan alumni yang sebenarnya'
          : `${filtered.length} foto ${tabs.find(t => t.key === activeTab)?.label}`}
      </p>
    </div>
  )
}
