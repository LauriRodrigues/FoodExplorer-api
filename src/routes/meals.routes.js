import { Router } from "express"
import { MealsController } from "../controllers/MealsController.js"

export const mealsRoutes = Router()

const mealsController = new MealsController()

mealsRoutes.post("/", mealsController.create)
mealsRoutes.put("/:id", mealsController.update)
mealsRoutes.delete("/:id", mealsController.delete)
mealsRoutes.get("/:id", mealsController.show)
mealsRoutes.get("/", mealsController.index)
