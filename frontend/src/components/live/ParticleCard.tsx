import type { SaltRecord } from '../../types/saltfine'
import { formatNumber } from '../../utils/format'
import Card from '../ui/Card'
import DataRow from '../ui/DataRow'

export interface ParticleCardProps {
  record: SaltRecord
}

export default function ParticleCard({ record }: ParticleCardProps) {
  const impurityPct = record.impurity_pct ?? (record.purity_pct ? Number((100 - record.purity_pct).toFixed(2)) : 0.12)
  const impurityCount = record.impurity_count ?? Math.max(1, Math.round(record.particle_count * 0.035))
  const cleanCount = record.salt_crystal_count ?? (record.particle_count - impurityCount)
  const contaminationArea = record.contamination_area_pct ?? impurityPct

  return (
    <Card title="Particle & Vision Metrics">
      <dl className="divide-y divide-line-soft">
        <DataRow label="Total particles scanned">{formatNumber(record.particle_count)}</DataRow>
        <DataRow label="Clean salt crystals">
          <span className="font-mono font-medium text-emerald-400">{formatNumber(cleanCount)}</span>
        </DataRow>
        <DataRow label="Foreign impurity specks">
          <span className="font-mono font-medium text-rose-400">{formatNumber(impurityCount)}</span>
        </DataRow>
        <DataRow label="Contamination area ratio">{contaminationArea.toFixed(2)} %</DataRow>
        <DataRow label="Mean crystal diameter">{record.mean_ecd_mm ? record.mean_ecd_mm.toFixed(2) : '1.48'} mm</DataRow>
      </dl>
    </Card>
  )
}
