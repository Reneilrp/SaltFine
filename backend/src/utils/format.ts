// Formatting helpers. Timestamps are stored as ISO text (SQLite TEXT columns)
// and shown in the viewer's local time as YYYY-MM-DD HH:mm:ss.

const pad = (value: number | string, length = 2): string => String(value).padStart(length, '0')

const toDate = (value: Date | string | number): Date => (value instanceof Date ? value : new Date(value))

export function formatDate(value: Date | string | number): string {
  const d = toDate(value)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function formatTime(value: Date | string | number, { seconds = true }: { seconds?: boolean } = {}): string {
  const d = toDate(value)
  const base = `${pad(d.getHours())}:${pad(d.getMinutes())}`
  return seconds ? `${base}:${pad(d.getSeconds())}` : base
}

export function formatDateTime(value: Date | string | number, options?: { seconds?: boolean }): string {
  return `${formatDate(value)} ${formatTime(value, options)}`
}

// "12 s ago", "4 min ago", "3 h ago", "2 d ago"
export function formatRelative(value: Date | string | number, now = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - toDate(value).getTime()) / 1000))
  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds} s ago`
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  return `${Math.round(hours / 24)} d ago`
}

export const formatRecordId = (id: number | string): string => pad(id, 4)
export const formatBatchId = (id: number | string): string => `B-${pad(id, 4)}`

export function formatNumber(value: number | string, digits = 0): string {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

// Confidence is stored as a 0–1 fraction; fractions and shares as 0–100.
export const formatConfidence = (fraction: number, digits = 1): string => `${(fraction * 100).toFixed(digits)} %`
export const formatPercent = (percent: number, digits = 1): string => `${Number(percent).toFixed(digits)} %`

export const gramsToKg = (grams: number): number => grams / 1000
