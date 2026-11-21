import React, { useId } from 'react'
import { GRADES } from '../../config'
import type { FinenessGrade } from '../../types/saltfine'

export const inputClass =
  'h-10 w-full rounded-md border border-line bg-panel px-3 text-sm text-ink-900 placeholder:text-ink-400 hover:border-navy-300 focus-visible:border-brine-600'

export interface FieldProps {
  label: string
  className?: string
  children: (id: string) => React.ReactNode
}

// Label + control wrapper. `children` receives the generated id.
export function Field({ label, className = '', children }: FieldProps) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[0.8rem] font-medium text-ink-700">
        {label}
      </label>
      {children(id)}
    </div>
  )
}

export interface DateFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  min?: string
  max?: string
  className?: string
}

export function DateField({ label, value, onChange, min, max, className }: DateFieldProps) {
  return (
    <Field label={label} className={className}>
      {(id) => (
        <input
          id={id}
          type="date"
          value={value}
          min={min || undefined}
          max={max || undefined}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} tabular-nums`}
        />
      )}
    </Field>
  )
}

export interface GradeSelectProps {
  label?: string
  value: FinenessGrade | 'All'
  onChange: (value: FinenessGrade | 'All') => void
  className?: string
}

export function GradeSelect({ label = 'Purity quality grade', value, onChange, className }: GradeSelectProps) {
  return (
    <Field label={label} className={className}>
      {(id) => (
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as FinenessGrade | 'All')}
          className={inputClass}
        >
          <option value="All">All quality tiers</option>
          {GRADES.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
      )}
    </Field>
  )
}
