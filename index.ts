import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

const port = 3000

app.get('/', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})