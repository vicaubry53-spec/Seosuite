'use client'
const NAV = [
  { id: 'positions', label: 'Évolution & positions', section: 'Positions' },
  { id: 'trafic', label: 'Sessions & canaux', section: 'Trafic GA4' },
  { id: 'opportunites', label: 'Mots-clés à couvrir', section: 'Opportunités' },
  { id: 'optimiser', label: 'Mots-clés à optimiser', section: null },
]

export default function Sidebar({ activePage, setActivePage }) {
  let lastSection = null
  return (
    <div className="w-48 min-w-[192px] bg-gray-100 border-r border-gray-200 flex flex-col overflow-y-auto">
      <div className="px-4 py-4 text-[15px] font-medium border-b border-gray-200">
        SEO<span className="text-blue-500">Suite</span>
      </div>
      <nav className="flex-1 py-2">
        {NAV.map(item => {
          const showSection = item.section && item.section !== lastSection
          if (item.section) lastSection = item.section
          return (
            <div key={item.id}>
              {showSection && (
                <div className="px-4 pt-3 pb-1 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                  {item.section}
                </div>
              )}
              <button
                onClick={() => setActivePage(item.id)}
                className={`w-full text-left px-4 py-2 text-[13px] border-l-2 transition-colors ${
                  activePage === item.id
                    ? 'border-blue-500 text-blue-600 bg-white font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-white'
                }`}
              >
                {item.label}
              </button>
            </div>
          )
        })}
      </nav>
    </div>
  )
}
