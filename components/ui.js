'use client'

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-4 mb-3 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children }) {
  return <div className="text-[13px] font-medium text-gray-800 mb-3">{children}</div>
}

export function MetricGrid({ metrics }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mb-3">
      {metrics.map((m, i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-3">
          <div className="text-[11px] text-gray-400 mb-1">{m.label}</div>
          <div className="text-xl font-medium text-gray-900">{m.value}</div>
          {m.delta && (
            <div className={`text-[11px] mt-0.5 ${m.up ? 'text-green-700' : 'text-red-600'}`}>
              {m.delta}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export function Badge({ children, color = 'blue' }) {
  const colors = {
    green: 'bg-green-50 text-green-800',
    blue: 'bg-blue-50 text-blue-800',
    amber: 'bg-amber-50 text-amber-800',
    red: 'bg-red-50 text-red-800',
    gray: 'bg-gray-100 text-gray-600',
  }
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}

export function Table({ headers, rows, colWidths }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[12px] border-collapse" style={{ tableLayout: 'fixed' }}>
        <colgroup>
          {colWidths?.map((w, i) => <col key={i} style={{ width: w }} />)}
        </colgroup>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="text-left p-2 text-[10px] font-medium text-gray-400 border-b border-gray-100">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="p-2 text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function EmptyState({ message }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-[13px] text-gray-400">
      {message}
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-[13px] text-gray-400 animate-pulse">
      Chargement des données…
    </div>
  )
}

export function ErrorState({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-[13px] text-red-700">
      Erreur : {message}
    </div>
  )
}

export function posBadgeColor(pos) {
  if (pos <= 3) return 'green'
  if (pos <= 10) return 'blue'
  if (pos <= 20) return 'amber'
  return 'red'
}
