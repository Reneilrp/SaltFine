// In-memory stand-in for the SQLite database + vision module.

import { SIMULATION_FIRST_CYCLE_MS, SIMULATION_INTERVAL_MS } from '../config'
import type { FilterState, SaltRecord } from '../types/saltfine'
import { matchesFilters } from '../utils/filters'
import { createRecordFactory, seedHistory } from './generateRecords'

const makeRecord = createRecordFactory()

// Oldest first; the newest record is always last.
let records: SaltRecord[] = seedHistory(makeRecord)

let running = false
let timer: ReturnType<typeof setTimeout> | null = null
const listeners = new Set<() => void>()

const notify = () => listeners.forEach((listener) => listener())

function schedule(delay: number): void {
  timer = setTimeout(() => {
    records = [...records, makeRecord(new Date())]
    notify()
    schedule(SIMULATION_INTERVAL_MS)
  }, delay)
}

export const simulation = {
  start(): void {
    if (running) return
    running = true
    schedule(SIMULATION_FIRST_CYCLE_MS)
    notify()
  },
  stop(): void {
    if (!running) return
    running = false
    if (timer) clearTimeout(timer)
    notify()
  },
  toggle(): void {
    if (running) simulation.stop()
    else simulation.start()
  },
  isRunning: (): boolean => running,
  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  // Manual trigger capability for instant batch simulation
  triggerNow(): SaltRecord {
    const newRecord = makeRecord(new Date())
    records = [...records, newRecord]
    notify()
    return newRecord
  },
  // Add a custom analyzed record (from image upload / lab analysis)
  addCustomRecord(record: SaltRecord): void {
    records = [...records, record]
    notify()
  },
}

export const mockDb = {
  latest(): SaltRecord | null {
    return records.length ? records[records.length - 1] : null
  },
  // Newest first. `limit` caps the number of rows returned.
  query(filters: FilterState, { limit }: { limit?: number } = {}): SaltRecord[] {
    const rows = records.filter((record) => matchesFilters(record, filters)).reverse()
    return limit ? rows.slice(0, limit) : rows
  },
}

// Stop the timer when Vite hot-reloads this module during development.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (timer) clearTimeout(timer)
  })
}
