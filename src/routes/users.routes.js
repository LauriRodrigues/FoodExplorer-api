import { Router } from "express"
import { UsersController } from "../controllers/UsersController.js"

export const usersRoutes = Router()

const usersController = new UsersController()

usersRoutes.post("/", usersController.create)