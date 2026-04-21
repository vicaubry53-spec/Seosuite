'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Card, CardTitle, Table, EmptyState, LoadingState, ErrorState } from './ui'

const CHANNEL_COLORS = {
  'organic search': '#378ADD',
  'direct': '#639922',
  'paid search': '#EF9F27',
  'email': '#7F77DD',
  'organic social': '#D4537E',
  'referral': '#1D9E75',
  'unassigned': '#888780',
}

const CHANNEL_ICONS = {
  'organic search': '🔍', 'direct': '🔗', 'paid search': '💰',
  'email': '📧', 'organic social': '📱', 'referral': '🌐', 'unassigned': '❓',
}

export default function TraficPage({ data, loading, error }) {
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!data?.channels?.length) return <EmptyState message="Sélectionnez une propriété GA4 dans la barre du haut." />

  const { channels, timeSeries } = data
  const total = channels.reduce((a, c) => a + c.sessions, 0)

  const chartData = channels.map(c => ({
    name: c.canal.replace(' Search', '').replace('Organic ', 'Org. '),
    sessions: c.sessions,
    fill: CHANNEL_COLORS[c.canal.toLowerCase()] || '#888780',
  }))

  // Regrouper le time series par semaine si > 60 jours
  const tsData = timeSeries?.slice(-60).map(d => ({
    date: d.date.replace(/(\d{4})(\d{2})(\d{2})/, '$3/$2'),
    sessions: d.sessions,
    users: d.users,
  })) || []

  return (
    <div>
      <div className="text-[17px] font-medium text-gray-900 mb-1">Sessions & canaux</div>
      <div className="text-[13px] text-gray-400 mb-4">Source : Google Analytics 4</div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mb-3">
        {channels.slice(0, 4).map((c, i) => {
          const key = c.canal.toLowerCase()
          const pct = total > 0 ? Math.round(c.sessions / total * 100) : 0
          return (
            <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-lg mb-1">{CHANNEL_ICONS[key] || '🌐'}</div>
              <div className="text-[11px] text-gray-400 mb-1 truncate">{c.canal}</div>
              <div className="text-xl font-medium text-gray-900">{c.sessions.toLocaleString('fr')}</div>
              <div className="text-[11px] text-gray-400">{pct}% du total</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Card>
          <CardTitle>Sessions par canal</CardTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={v => [v.toLocaleString('fr'), 'Sessions']} />
              <Bar dataKey="sessions" radius={[0, 3, 3, 0]}>
                {chartData.map((d, i) => (
                  <rect key={i} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {tsData.length > 0 && (
          <Card>
            <CardTitle>Évolution quotidienne</CardTitle>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={tsData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={Math.floor(tsData.length / 6)} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#378ADD" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="users" name="Utilisateurs" stroke="#1D9E75" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      <Card>
        <CardTitle>Détail par canal</CardTitle>
        <Table
          headers={['Canal', 'Sessions', 'Utilisateurs', 'Taux engagement', 'Taux rebond']}
          colWidths={['30%', '17%', '18%', '18%', '17%']}
          rows={channels.map(c => [
            c.canal,
            c.sessions.toLocaleString('fr'),
            c.users.toLocaleString('fr'),
            c.engagementRate?.toFixed(1) + '%',
            c.bounceRate?.toFixed(1) + '%',
          ])}
        />
      </Card>
    </div>
  )
}
