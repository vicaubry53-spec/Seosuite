'use client'
export default function Topbar({
  sites, activeSite, setActiveSite,
  properties, activeProperty, setActiveProperty,
  days, setDays, session, onSignOut, onRefresh
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 h-12 flex items-center gap-3 flex-shrink-0">
      {/* Site GSC selector */}
      {sites.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 font-medium">GSC</span>
          <select
            value={activeSite || ''}
            onChange={e => setActiveSite(e.target.value)}
            className="text-[12px] border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 text-gray-700 max-w-[200px]"
          >
            {sites.map(s => (
              <option key={s.url} value={s.url}>{s.url.replace(/^https?:\/\//, '')}</option>
            ))}
          </select>
        </div>
      )}

      {/* GA4 property selector */}
      {properties.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 font-medium">GA4</span>
          <select
            value={activeProperty || ''}
            onChange={e => setActiveProperty(e.target.value)}
            className="text-[12px] border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 text-gray-700 max-w-[200px]"
          >
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.displayName}</option>
            ))}
          </select>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        {/* Période */}
        <select
          value={days}
          onChange={e => setDays(Number(e.target.value))}
          className="text-[12px] border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 text-gray-700"
        >
          <option value={7}>7 jours</option>
          <option value={30}>30 jours</option>
          <option value={90}>90 jours</option>
          <option value={180}>6 mois</option>
        </select>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="text-[12px] border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-gray-600"
        >
          ↺ Actualiser
        </button>

        {/* User */}
        {session?.user && (
          <div className="flex items-center gap-2 ml-1">
            {session.user.image && (
              <img src={session.user.image} className="w-6 h-6 rounded-full" alt="" />
            )}
            <button
              onClick={onSignOut}
              className="text-[11px] text-gray-400 hover:text-gray-700"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
