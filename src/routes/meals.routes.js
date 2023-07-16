import { Router } from "express"
import multer from 'multer'
import uploadConfig from '../configs/upload.js'
import { MealsController } from "../controllers/MealsController.js"
import { MealsImageController } from "../controllers/MealsImageController.js"
import { ensureAuthenticatedAdmin } from "../middleware/ensureAuthenticatedAdmin.js"
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js"

export const mealsRoutes = Router()
const upload = multer(uploadConfig.MULTER)

mealsRoutes.use(ensureAuthenticated)

const mealsController = new MealsController()
const mealsImageController = new MealsImageController()

mealsRoutes.post("/", ensureAuthenticatedAdmin, upload.single("image"),mealsController.create)
mealsRoutes.put("/:id", ensureAuthenticatedAdmin, upload.single("image"), mealsController.update)
mealsRoutes.delete("/:id", ensureAuthenticatedAdmin, mealsController.delete)
mealsRoutes.get("/:id", mealsController.show)
mealsRoutes.get("/", mealsController.index)
