import express from 'express'
const router = express.Router()

router.get('/health-check', (req, res) => res.send('api server is running!'))

export default router
