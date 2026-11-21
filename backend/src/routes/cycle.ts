import { Router, Request, Response } from 'express'
import { dbService } from '../db'

const router = Router()

// POST /api/cycle/trigger -> runs one simulated cycle, writes to PostgreSQL/memory, returns record
router.post('/trigger', async (_req: Request, res: Response) => {
  try {
    const newRecord = await dbService.triggerNewCycle()
    res.json(newRecord)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

export default router
