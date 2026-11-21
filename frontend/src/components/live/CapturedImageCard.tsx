import type { SaltRecord } from '../../types/saltfine'
import { formatTime } from '../../utils/format'
import SaltImage from '../SaltImage'
import Card from '../ui/Card'

export interface CapturedImageCardProps {
  record: SaltRecord
}

export default function CapturedImageCard({ record }: CapturedImageCardProps) {
  return (
    <Card title="Captured image">
      <figure>
        <SaltImage record={record} />
        <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-sm text-ink-500">
          <span className="text-xs font-medium text-ink-600">
            Real-Time Optical Vision Capture
          </span>
          <span className="whitespace-nowrap text-xs">
            Captured at{' '}
            <span className="font-mono text-ink-700">{formatTime(record.captured_at)}</span>
          </span>
        </figcaption>
      </figure>
    </Card>
  )
}
