import { Router } from "express"
import { usersRoutes } from "./users.routes.js"
import { mealsRoutes } from "./meals.routes.js"

export const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/meals", mealsRoutes)