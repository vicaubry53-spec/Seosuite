'use client'
import { Card, CardTitle, Table, Badge, EmptyState, LoadingState, ErrorState } from './ui'

export default function OptimiserPage({ data, loading, error }) {
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!data?.queries?.length) return <EmptyState message="Sélectionnez un site GSC pour détecter les mots-clés à optimiser." />

  const { queries } = data

  const opti = [...queries]
    .filter(r => r.position > 10 && r.position <= 30 && r.impressions >= 50)
    .sort((a, b) => {
      // Score de priorité : impressions élevées + position proche de 10
      const scoreA = a.impressions * (1 / a.position)
      const scoreB = b.impressions * (1 / b.position)
      return scoreB - scoreA
    })
    .slice(0, 50)

  function priority(r) {
    const score = r.impressions * (1 / r.position)
    if (score > 50) return <Badge color="red">Haute</Badge>
    if (score > 15) return <Badge color="amber">Moyenne</Badge>
    return <Badge color="gray">Faible</Badge>
  }

  function posBadge(pos) {
    if (pos <= 15) return <Badge color="amber">{pos.toFixed(1)}</Badge>
    return <Badge color="red">{pos.toFixed(1)}</Badge>
  }

  // Potentiel de clics si passage en top 3 (CTR estimé ~15%)
  function potentialClicks(r) {
    return Math.round(r.impressions * 0.15)
  }

  return (
    <div>
      <div className="text-[17px] font-medium text-gray-900 mb-1">Mots-clés à optimiser</div>
      <div className="text-[13px] text-gray-400 mb-4">Requêtes en positions 11–30 — quick wins si vous remontez en top 10</div>

      <div className="grid grid-cols-3 gap-2.5 mb-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-[11px] text-gray-400 mb-1">Mots-clés identifiés</div>
          <div className="text-xl font-medium text-gray-900">{opti.length}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-[11px] text-gray-400 mb-1">Impressions cumulées</div>
          <div className="text-xl font-medium text-gray-900">{opti.reduce((a, r) => a + r.impressions, 0).toLocaleString('fr')}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-[11px] text-gray-400 mb-1">Clics potentiels en top 3</div>
          <div className="text-xl font-medium text-gray-900">+{opti.reduce((a, r) => a + potentialClicks(r), 0).toLocaleString('fr')}</div>
        </div>
      </div>

      <Card>
        <CardTitle>Requêtes à travailler en priorité</CardTitle>
        <Table
          headers={['Requête', 'Position actuelle', 'Impressions', 'Clics actuels', 'Clics potentiels (top 3)', 'Priorité']}
          colWidths={['28%', '14%', '13%', '12%', '18%', '10%']}
          rows={opti.map(r => [
            r.query,
            posBadge(r.position),
            r.impressions.toLocaleString('fr'),
            r.clicks.toLocaleString('fr'),
            <span key={r.query} className="text-green-700 font-medium">~{potentialClicks(r).toLocaleString('fr')}</span>,
            priority(r),
          ])}
        />
      </Card>
    </div>
  )
}
