import { Router, Request, Response } from 'express'
import { dbService } from '../db'
import type { FilterState, FinenessGrade } from '../types/saltfine'

const router = Router()

// GET /api/records/latest -> record | null
router.get('/latest', async (_req: Request, res: Response) => {
  try {
    const record = await dbService.getLatestRecord()
    res.json(record)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// GET /api/records?from=&to=&grade=&q=&limit=
router.get('/', async (req: Request, res: Response) => {
  try {
    const filters: FilterState = {
      from: (req.query.from as string) || '',
      to: (req.query.to as string) || '',
      grade: (req.query.grade as FinenessGrade | 'All') || 'All',
      query: (req.query.q as string) || '',
    }
    const limit = req.query.limit ? Number(req.query.limit) : undefined
    const records = await dbService.queryRecords(filters, limit)
    res.json(records)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// POST /api/records (insert a newly processed sorting cycle or lab test)
router.post('/', async (req: Request, res: Response) => {
  try {
    const record = req.body
    const saved = await dbService.insertRecord(record)
    res.status(201).json(saved)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// DELETE /api/records/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    await dbService.deleteRecord(id)
    res.json({ success: true, deleted_id: id })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// POST /api/records/reset-test-data (clean test/upload artifacts)
router.post('/reset-test-data', async (_req: Request, res: Response) => {
  try {
    await dbService.clearTestRecords()
    res.json({ success: true, message: 'Test records cleared' })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

export default router
