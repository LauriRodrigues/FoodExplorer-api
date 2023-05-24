import { AppError } from '../utils/AppError.js'
import { connection as knex } from '../database/knex/index.js'

export class MealsController {
  async create(request, response) {
    const { title, description, category, price, ingredients } = request.body

    const [meal_id] = await knex("meals").insert({
      title,
      description,
      category,
      price
    })

    const ingredientsInsert = ingredients.map(name => {
      return {
        meal_id,
        name
      }
    })

    await knex("ingredients").insert(ingredientsInsert)

    return response.status(201).json()
  }

  async update(request, response) {
    const { title, description, category, price, ingredients } = request.body

    const { id } = request.params

    const mealsList = await knex('meals').where('id', id)
    const meal = mealsList[0]

    if(!meal) {
      throw new AppError("Prato não encontrado!")
    }

    meal.title = title ?? meal.title
    meal.description = description ?? meal.description
    meal.category = category ?? meal.category
    meal.price = price ?? meal.price

    await knex('meals').where('id', id).update({
      title,
      description,
      category,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    })

    const ingredientsUpdate = ingredients.map(name => ({
      name,
      meal_id: meal.id
    }))

    await knex("ingredients").where({meal_id: id}).delete();
    await knex("ingredients").insert(ingredientsUpdate);

    return response.status(200).json()

  }

  async delete(request, response) {
    const { id } = request.params

    await knex("meals").where({ id }).delete()

    return response.json()
  }

  async show(request, response) {
    const { id } = request.params;

    const meal = await knex("meals").where({ id }).first();
    const ingredients = await knex("ingredients").where({ meal_id: id}).orderBy("name");

    return response.json({
      ...meal,
      ingredients
    });
  }

  async index(request, response) {
    const { title, ingredients } = request.query

    let meals

    if(ingredients) {
      const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim())

      meals = await knex("ingredients")
        .select([
          "meals.id",
          "meals.title",
          "meals.description",
          "meals.category",
          "meals.price"
        ])
        .whereLike("meals.title", `%${title}%`)
        .whereIn("name", filterIngredients)
        .innerJoin("meals", "meals.id", "ingredients.meal_id")
        .groupBy("meals.id")
        .orderBy("meals.title")

    } else {
        meals = await knex("meals")
          .whereLike("title", `%${title}%`)
          .orderBy("title")	
    }
    
    const mealsIngredients = await knex("ingredients")

    const mealsWithIngredients = meals.map(meal => {
      const mealIngredients = mealsIngredients.filter(ingredient => ingredient.meal_id === meal.id)

      return {
        ...meal,
       ingredients: mealIngredients
      }
    })

    return response.json(mealsWithIngredients)
  }

}