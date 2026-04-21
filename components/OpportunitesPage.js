'use client'
import { Card, CardTitle, MetricGrid, Table, Badge, EmptyState, LoadingState, ErrorState } from './ui'

export default function OpportunitesPage({ data, loading, error }) {
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!data?.queries?.length) return <EmptyState message="Sélectionnez un site GSC pour détecter vos opportunités." />

  const { queries } = data

  // Opportunités = beaucoup d'impressions, CTR faible, position ≤ 30
  const opps = [...queries]
    .filter(r => r.impressions >= 100 && r.ctr < 3 && r.position <= 30)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 50)

  // Non couverts = position > 20 mais impressions significatives
  const notCovered = [...queries]
    .filter(r => r.position > 20 && r.impressions >= 200)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20)

  const totalMissedClicks = opps.reduce((a, r) => {
    const potential = Math.round(r.impressions * 0.1) // CTR cible 10% pos1
    return a + Math.max(0, potential - r.clicks)
  }, 0)

  const metrics = [
    { label: 'Opportunités détectées', value: opps.length },
    { label: 'Impressions manquées', value: opps.reduce((a, r) => a + r.impressions, 0).toLocaleString('fr') },
    { label: 'Clics potentiels', value: '+' + totalMissedClicks.toLocaleString('fr') },
  ]

  function ctrBadge(ctr) {
    if (ctr < 0.5) return <Badge color="red">{ctr.toFixed(2)}%</Badge>
    if (ctr < 1.5) return <Badge color="amber">{ctr.toFixed(2)}%</Badge>
    return <Badge color="blue">{ctr.toFixed(2)}%</Badge>
  }

  function posBadge(pos) {
    if (pos <= 10) return <Badge color="blue">{pos.toFixed(1)}</Badge>
    if (pos <= 20) return <Badge color="amber">{pos.toFixed(1)}</Badge>
    return <Badge color="red">{pos.toFixed(1)}</Badge>
  }

  return (
    <div>
      <div className="text-[17px] font-medium text-gray-900 mb-1">Mots-clés à couvrir / optimiser</div>
      <div className="text-[13px] text-gray-400 mb-4">Requêtes avec impressions mais CTR insuffisant — données GSC réelles</div>

      <MetricGrid metrics={metrics} />

      <Card>
        <CardTitle>Opportunités prioritaires (CTR &lt; 3%, impressions élevées)</CardTitle>
        <Table
          headers={['Requête', 'Impressions', 'Clics actuels', 'CTR', 'Position']}
          colWidths={['38%', '16%', '15%', '13%', '13%']}
          rows={opps.map(r => [
            r.query,
            r.impressions.toLocaleString('fr'),
            r.clicks.toLocaleString('fr'),
            ctrBadge(r.ctr),
            posBadge(r.position),
          ])}
        />
      </Card>

      {notCovered.length > 0 && (
        <Card>
          <CardTitle>Requêtes en zone grise (positions 21–50) — créer une page dédiée</CardTitle>
          <Table
            headers={['Requête', 'Impressions', 'Position', 'Clics']}
            colWidths={['45%', '20%', '18%', '17%']}
            rows={notCovered.map(r => [
              r.query,
              r.impressions.toLocaleString('fr'),
              <Badge key={r.query} color="red">{r.position.toFixed(1)}</Badge>,
              r.clicks.toLocaleString('fr'),
            ])}
          />
        </Card>
      )}
    </div>
  )
}
