import { Router } from "express"
import { usersRoutes } from "./users.routes.js"
import { mealsRoutes } from "./meals.routes.js"
import { ingredientsRoutes } from "./ingredients.routes.js"

export const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/meals", mealsRoutes)
routes.use("/ingredients", ingredientsRoutes)