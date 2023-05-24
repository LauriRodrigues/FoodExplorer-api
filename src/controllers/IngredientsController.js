import { connection as knex } from '../database/knex/index.js'

export class IngredientsController {
  async index(request, response) {
    const ingredients = await knex("ingredients")
    .groupBy("name")

    return response.json(ingredients)
  }
}