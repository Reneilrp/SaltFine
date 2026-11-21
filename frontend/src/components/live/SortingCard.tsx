import { ArrowDown } from 'lucide-react'
import { BIN_DISPLAY_CAPACITY_G, GRADE_META, PURITY_GRADES } from '../../config'
import type { FinenessGrade, PurityGrade, SaltRecord } from '../../types/saltfine'
import { formatNumber, gramsToKg } from '../../utils/format'
import Card from '../ui/Card'
import DataRow from '../ui/DataRow'

// The three automated destination bins under the servo-actuated tipping plate
function BinDiagram({ container, massG, purityPct }: { container: string; massG: number; purityPct: number }) {
  const fillPercent = Math.min(100, Math.max(15, (massG / BIN_DISPLAY_CAPACITY_G) * 100))

  let activeTier: PurityGrade = 'Preprocessed Food Goods'
  if (container === 'Preprocessed Food Goods' || purityPct >= 95.0) {
    activeTier = 'Preprocessed Food Goods'
  } else if (container === 'Industrial Goods' || (purityPct >= 90.0 && purityPct < 95.0)) {
    activeTier = 'Industrial Goods'
  } else {
    activeTier = 'Sub-Standard'
  }

  return (
    <div
      className="grid grid-cols-3 gap-3"
      role="img"
      aria-label={`Salt routed to the ${activeTier} container: ${massG.toFixed(1)} grams`}
    >
      {PURITY_GRADES.map((grade) => {
        const active = grade === activeTier
        const meta = GRADE_META[grade]
        const shortName = grade === 'Preprocessed Food Goods' ? 'Food Bin' : grade === 'Industrial Goods' ? 'Industrial Bin' : 'Re-wash Bin'
        return (
          <div key={grade} className="text-center">
            <div className="grid h-5 place-items-center">
              {active && <ArrowDown className={`size-4 ${meta.ink}`} aria-hidden="true" />}
            </div>
            <div
              className={`relative h-[4.5rem] overflow-hidden rounded-b-lg border-x-2 border-b-2 ${
                active ? meta.border : 'border-line'
              }`}
            >
              {active && (
                <div
                  className={`absolute inset-x-0 bottom-0 ${meta.track} transition-[height] duration-500`}
                  style={{ height: `${fillPercent}%` }}
                />
              )}
              <div
                className={`absolute inset-0 grid place-items-center text-sm tabular-nums ${
                  active ? 'font-semibold text-ink-900' : 'text-ink-400'
                }`}
              >
                {active ? `${massG.toFixed(1)} g` : '—'}
              </div>
            </div>
            <div className={`mt-1.5 text-[0.75rem] ${active ? 'font-semibold text-ink-900' : 'text-ink-500'}`}>
              {shortName}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export interface SortingCardProps {
  record: SaltRecord
}

export default function SortingCard({ record }: SortingCardProps) {
  const purityPct = record.purity_pct ?? 96.5
  const destination =
    purityPct >= 95.0
      ? 'Bin 1: Preprocessed Food Goods (≥95%)'
      : purityPct >= 90.0
      ? 'Bin 2: Industrial Goods (90–95%)'
      : 'Bin 3: Sub-Standard / Re-wash (<90%)'

  return (
    <Card title="Automated Sorter Actuation">
      <BinDiagram
        container={String(record.container_grade)}
        massG={record.mass_g}
        purityPct={purityPct}
      />

      <dl className="mt-3 divide-y divide-line-soft">
        <DataRow label="Target Destination">
          <span className="font-semibold text-ink-900">{destination}</span>
        </DataRow>
        <DataRow label="Batch Net Mass">
          {formatNumber(record.mass_g, 1)} g
          <span className="ml-2 text-sm font-normal text-ink-500">
            ({gramsToKg(record.mass_g).toFixed(3)} kg)
          </span>
        </DataRow>
        <DataRow label="Actuation Cycle Time">{record.processing_time_s.toFixed(1)} s</DataRow>
      </dl>
    </Card>
  )
}
