import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import recordsRouter from './routes/records'
import analyzeRouter from './routes/analyze'
import cycleRouter from './routes/cycle'

const app = express()
const PORT = Number(process.env.PORT) || 5000

// Middleware: allow Vite dev server on port 5173 / 5180
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5180', 'http://127.0.0.1:5180'],
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static image serving from uploads folder
const uploadDir = path.join(process.cwd(), 'uploads')
app.use('/api/images', express.static(uploadDir))

// API routes
app.use('/api/records', recordsRouter)
app.use('/api/analyze', analyzeRouter)
app.use('/api/cycle', cycleRouter)

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'SALTFINE Automated Sea Salt Fineness Sorter',
    version: '1.0.0-ts',
    timestamp: new Date().toISOString(),
  })
})

app.listen(PORT, () => {
  console.log(`🚀 SALTFINE PERN Server is running on http://localhost:${PORT}`)
  console.log(`📁 Static image endpoint: http://localhost:${PORT}/api/images`)
})
