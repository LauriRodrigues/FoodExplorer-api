import { Router } from "express"
import { usersRoutes } from "./users.routes.js"

export const routes = Router()

routes.use("/users", usersRoutes)