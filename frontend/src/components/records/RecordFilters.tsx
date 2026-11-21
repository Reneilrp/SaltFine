import React from 'react'
import { RotateCcw, Search } from 'lucide-react'
import type { FilterState } from '../../types/saltfine'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { DateField, Field, GradeSelect, inputClass } from '../ui/Field'

export interface RecordFiltersProps {
  value: FilterState
  onChange: (value: FilterState) => void
  onApply: () => void
  onReset: () => void
  canReset: boolean
}

// Search and filter controls for the Salt-Record Log.
export default function RecordFilters({ value, onChange, onApply, onReset, canReset }: RecordFiltersProps) {
  const set = <K extends keyof FilterState>(key: K) => (next: FilterState[K]) =>
    onChange({ ...value, [key]: next })

  return (
    <Card title="Search and filter">
      <form
        className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-6 min-[1400px]:flex min-[1400px]:items-end"
        onSubmit={(event: React.FormEvent) => {
          event.preventDefault()
          onApply()
        }}
      >
        <DateField
          label="Date from"
          value={value.from}
          max={value.to}
          onChange={set('from')}
          className="md:col-span-2 min-[1400px]:w-40"
        />
        <DateField
          label="Date to"
          value={value.to}
          min={value.from}
          onChange={set('to')}
          className="md:col-span-2 min-[1400px]:w-40"
        />
        <GradeSelect
          value={value.grade}
          onChange={set('grade')}
          className="col-span-2 md:col-span-2 min-[1400px]:w-40"
        />
        <Field label="Sample / Batch ID" className="col-span-2 md:col-span-4 min-[1400px]:min-w-0 min-[1400px]:flex-1">
          {(id) => (
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
                aria-hidden="true"
              />
              <input
                id={id}
                type="search"
                value={value.query}
                onChange={(event) => set('query')(event.target.value)}
                placeholder="Search sample or batch ID…"
                autoComplete="off"
                className={`${inputClass} pl-9`}
              />
            </div>
          )}
        </Field>
        <div className="col-span-2 flex items-end gap-3 md:col-span-2">
          <Button type="submit" variant="primary" className="flex-1 min-[1400px]:flex-none">
            Apply Filter
          </Button>
          {canReset && (
            <Button
              type="button"
              variant="secondary"
              onClick={onReset}
              icon={RotateCcw}
              aria-label="Reset filters"
              className="px-3"
            >
              Reset
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
