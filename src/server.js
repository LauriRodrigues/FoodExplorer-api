import dotenv from 'dotenv'
import express from "express"
import 'express-async-errors'
import { routes } from "./routes/index.js"
import { AppError } from "./utils/AppError.js"
import uploadConfig from './configs/upload.js'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(express.json())

app.use(cors())

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes)

app.use(( error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.StatusCode).json({
      status: "error",
      message: error.message,
    })
  }

  console.error(error)

  return response.status(500).json({
    status: "error",
    message: "Internal Server Error",
  })
})

const PORT = process.env.PORT || 3333
app.listen(PORT, () => console.log(`Server is running at ${PORT}`))
