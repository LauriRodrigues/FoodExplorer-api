import { connection as knex } from '../database/knex/index.js'
import { AppError } from '../utils/AppError.js'
import { DiskStorage } from '../providers/DiskStorage.js'
export class MealsImageController {
  async update(request, response) {
    const user = request.user
    const { id } = request.params
    const imageFilename = request.file.filename

    const diskStorage = new DiskStorage()

    const meal = await knex("meals").where({ id }).first()

    if(!user) {
      throw new AppError("Somente administrador pode editar um prato", 401)
    }

    if (meal.image) {
      await diskStorage.deleteFile(meal.image)
    }

    const filename = await diskStorage.saveFile(imageFilename)

    meal.image = filename

    await knex("meals").update(meal).where({ id })

    return response.json(meal)
  }
}