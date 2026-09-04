import { Router } from 'express'
import { query } from '../db/pool.js'
import { seedServices } from '../data/seedServices.js'
import { ApiError } from '../middleware/errorHandler.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const servicesRouter = Router()

/**
 * Falls back to in-memory demo data if the DB isn't reachable yet, so the
 * frontend can be developed against this route from day one. Once Postgres
 * is set up and seeded (see src/db/migrations/001_init.sql), this reads
 * from gov_services instead.
 */
servicesRouter.get('/', asyncHandler(async (req, res) => {
  const category = req.query.category as string | undefined
  try {
    const rows = await query(
      category && category !== 'all'
        ? 'SELECT * FROM gov_services WHERE category = $1 ORDER BY name_en'
        : 'SELECT * FROM gov_services ORDER BY name_en',
      category && category !== 'all' ? [category] : [],
    )
    return res.json({ services: rows, source: 'database' })
  } catch {
    const filtered = category && category !== 'all' ? seedServices.filter((s) => s.category === category) : seedServices
    return res.json({ services: filtered, source: 'demo-fallback' })
  }
}))

servicesRouter.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  try {
    const [row] = await query('SELECT * FROM gov_services WHERE id = $1', [id])
    if (row) return res.json({ service: row, source: 'database' })
  } catch {
    // fall through to demo data below
  }
  const service = seedServices.find((s) => s.id === id)
  if (!service) throw new ApiError(404, 'Service not found')
  res.json({ service, source: 'demo-fallback' })
}))
