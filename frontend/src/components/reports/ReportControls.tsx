import React from 'react'
import { Download } from 'lucide-react'
import type { FilterState } from '../../types/saltfine'
import { formatDate } from '../../utils/format'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { DateField, GradeSelect } from '../ui/Field'

const DAY_MS = 24 * 60 * 60 * 1000

interface Preset {
  id: string
  label: string
  days: number | null
}

const PRESETS: Preset[] = [
  { id: 'all', label: 'All records', days: null },
  { id: 'today', label: 'Today', days: 1 },
  { id: '7d', label: 'Last 7 days', days: 7 },
  { id: '30d', label: 'Last 30 days', days: 30 },
]

function presetRange(days: number | null): { from: string; to: string } {
  if (!days) return { from: '', to: '' }
  const today = new Date()
  return {
    from: formatDate(new Date(today.getTime() - (days - 1) * DAY_MS)),
    to: formatDate(today),
  }
}

export interface ReportControlsProps {
  value: FilterState
  onChange: (value: FilterState) => void
  onGenerate: () => void
  onPreset: (range: { from: string; to: string }) => void
  onDownloadCsv: () => void
  onDownloadPdf: () => void
  canDownload: boolean
  exporting: boolean
}

export default function ReportControls({
  value,
  onChange,
  onGenerate,
  onPreset,
  onDownloadCsv,
  onDownloadPdf,
  canDownload,
  exporting,
}: ReportControlsProps) {
  const set = <K extends keyof FilterState>(key: K) => (next: FilterState[K]) =>
    onChange({ ...value, [key]: next })

  return (
    <Card title="Report period">
      <form
        className="flex flex-wrap items-end gap-x-4 gap-y-3"
        onSubmit={(event: React.FormEvent) => {
          event.preventDefault()
          onGenerate()
        }}
      >
        <DateField
          label="Date from"
          value={value.from}
          max={value.to}
          onChange={set('from')}
          className="w-[calc(50%-0.5rem)] sm:w-40"
        />
        <DateField
          label="Date to"
          value={value.to}
          min={value.from}
          onChange={set('to')}
          className="w-[calc(50%-0.5rem)] sm:w-40"
        />
        <GradeSelect value={value.grade} onChange={set('grade')} className="w-full sm:w-40" />
        <Button type="submit" variant="primary">
          Generate Report
        </Button>

        <div className="flex gap-3 sm:ml-auto">
          <Button icon={Download} onClick={onDownloadCsv} disabled={!canDownload || exporting}>
            Download CSV
          </Button>
          <Button icon={Download} onClick={onDownloadPdf} disabled={!canDownload || exporting}>
            Download PDF
          </Button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line-soft pt-3.5">
        <span className="mr-1 text-[0.8rem] text-ink-500">Quick range</span>
        {PRESETS.map((preset) => (
          <Button
            key={preset.id}
            size="sm"
            onClick={() => onPreset(presetRange(preset.days))}
            className="font-medium"
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </Card>
  )
}
