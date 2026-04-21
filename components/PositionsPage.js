'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts'
import { Card, CardTitle, MetricGrid, Table, Badge, EmptyState, LoadingState, ErrorState, posBadgeColor } from './ui'

export default function PositionsPage({ data, loading, error }) {
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!data?.queries?.length) return <EmptyState message="Sélectionnez un site GSC dans la barre du haut pour charger vos données." />

  const { queries, evolution } = data

  const totalClics = queries.reduce((a, r) => a + r.clicks, 0)
  const totalImps = queries.reduce((a, r) => a + r.impressions, 0)
  const avgPos = (queries.reduce((a, r) => a + r.position, 0) / queries.length).toFixed(1)
  const avgCtr = (queries.reduce((a, r) => a + r.ctr, 0) / queries.length).toFixed(2)
  const top3 = queries.filter(r => r.position <= 3).length
  const top10 = queries.filter(r => r.position <= 10).length

  const bands = [
    { name: 'Top 3', count: queries.filter(r => r.position <= 3).length, fill: '#639922' },
    { name: '4–10', count: queries.filter(r => r.position > 3 && r.position <= 10).length, fill: '#378ADD' },
    { name: '11–20', count: queries.filter(r => r.position > 10 && r.position <= 20).length, fill: '#EF9F27' },
    { name: '21–50', count: queries.filter(r => r.position > 20 && r.position <= 50).length, fill: '#E24B4A' },
    { name: '50+', count: queries.filter(r => r.position > 50).length, fill: '#888780' },
  ]

  const topQueries = [...queries].sort((a, b) => b.clicks - a.clicks).slice(0, 20)

  const metrics = [
    { label: 'Clics totaux', value: totalClics.toLocaleString('fr') },
    { label: 'Impressions', value: totalImps.toLocaleString('fr') },
    { label: 'Position moy.', value: avgPos },
    { label: 'CTR moyen', value: avgCtr + '%' },
    { label: 'Top 3', value: top3 },
    { label: 'Top 10', value: top10 },
  ]

  return (
    <div>
      <div className="text-[17px] font-medium text-gray-900 mb-1">Évolution & positions</div>
      <div className="text-[13px] text-gray-400 mb-4">{queries.length} requêtes analysées</div>

      <MetricGrid metrics={metrics} />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Card>
          <CardTitle>Mots-clés par tranche de position</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bands} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => [v, 'Mots-clés']} />
              <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                {bands.map((b, i) => (
                  <rect key={i} fill={b.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {evolution?.length > 0 && (
          <Card>
            <CardTitle>Évolution mensuelle</CardTitle>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={evolution} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="top3" name="Top 3" stroke="#639922" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="top10" name="Top 10" stroke="#378ADD" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="top20" name="Top 20" stroke="#EF9F27" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      <Card>
        <CardTitle>Top requêtes par clics</CardTitle>
        <Table
          headers={['Requête', 'Clics', 'Impressions', 'CTR', 'Position']}
          colWidths={['40%', '15%', '18%', '12%', '15%']}
          rows={topQueries.map(r => [
            r.query,
            r.clicks.toLocaleString('fr'),
            r.impressions.toLocaleString('fr'),
            r.ctr.toFixed(1) + '%',
            <Badge key={r.query} color={posBadgeColor(r.position)}>{r.position.toFixed(1)}</Badge>
          ])}
        />
      </Card>
    </div>
  )
}
