import express from 'express'
import { router } from './routes/router'
import dotenv from "dotenv"
import { errorHandler } from './middleware/errorHandler';
import cors from 'cors'
import morgan from 'morgan'
dotenv.config();

export const app = express()

app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('dev'))

app.use(router)
app.use(errorHandler)

app.listen(5000, () => {
   console.log(`Server running at port 5000`)
})
