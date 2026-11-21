import React from 'react'
import type { SaltRecord } from '../../types/saltfine'
import {
  formatBatchId,
  formatConfidence,
  formatDateTime,
  formatNumber,
  formatRecordId,
} from '../../utils/format'
import SaltImage from '../SaltImage'
import DataRow from '../ui/DataRow'
import GradeBadge from '../ui/GradeBadge'
import Modal from '../ui/Modal'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink-500">{title}</h3>
      <dl className="mt-1 divide-y divide-line-soft">{children}</dl>
    </section>
  )
}

export interface RecordDetailModalProps {
  record: SaltRecord | null
  onClose: () => void
}

// Image preview and full details of one record from the log.
export default function RecordDetailModal({ record, onClose }: RecordDetailModalProps) {
  return (
    <Modal
      open={Boolean(record)}
      onClose={onClose}
      title={record ? `Record ${formatRecordId(record.record_id)}` : ''}
      subtitle={
        record
          ? `Batch ${formatBatchId(record.batch_id)} · Sample ${record.sample_code} · ${formatDateTime(record.classified_at)}`
          : ''
      }
    >
      {record && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <figure>
            <SaltImage record={record} />
            <figcaption className="mt-2.5 break-all font-mono text-[0.8rem] text-ink-500">
              {record.file_path}
            </figcaption>
          </figure>

          <div className="space-y-5">
            <Section title="Classification">
              <DataRow label="Predicted grade">
                <GradeBadge grade={record.predicted_grade} />
              </DataRow>
              <DataRow label="Confidence">{formatConfidence(record.confidence)}</DataRow>
              <DataRow label="Fine / Medium / Coarse">
                {record.est_fine_pct.toFixed(1)} / {record.est_medium_pct.toFixed(1)} /{' '}
                {record.est_coarse_pct.toFixed(1)} %
              </DataRow>
            </Section>

            <Section title="Particle characteristics">
              <DataRow label="Particle count">{formatNumber(record.particle_count)}</DataRow>
              <DataRow label="Mean equivalent diameter">{record.mean_ecd_mm.toFixed(2)} mm</DataRow>
              <DataRow label="Median equivalent diameter">{record.median_ecd_mm.toFixed(2)} mm</DataRow>
            </Section>

            <Section title="Sorting and mass">
              <DataRow label="Container">{record.container_grade}</DataRow>
              <DataRow label="Mass">{formatNumber(record.mass_g, 1)} g</DataRow>
              <DataRow label="Processing time">{record.processing_time_s.toFixed(1)} s</DataRow>
            </Section>

            {record.sieve_ground_truth && (
              <Section title="Ground-Truth Sieve Comparison">
                <DataRow label="Dominant Grade">
                  <GradeBadge grade={record.sieve_ground_truth.dominant_grade} />
                </DataRow>
                <DataRow label="Match Status">
                  <span className={record.sieve_ground_truth.is_match ? 'font-bold text-teal-600' : 'font-bold text-amber-600'}>
                    {record.sieve_ground_truth.is_match ? 'MATCH' : 'MISMATCH'}
                  </span>
                </DataRow>
                <DataRow label="Sieve Masses (F / M / C)">
                  {record.sieve_ground_truth.fine_g}g / {record.sieve_ground_truth.medium_g}g / {record.sieve_ground_truth.coarse_g}g
                </DataRow>
              </Section>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}
