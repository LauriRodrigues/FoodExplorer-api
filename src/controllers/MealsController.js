import { connection as knex } from '../database/knex/index.js'
import { DiskStorage } from '../providers/DiskStorage.js'

export class MealsController {
  async create(request, response) {
    const { title, description, category, price, ingredients } = request.body

    const mealImage = request.file

    try {
      let filename = null
  
      if (mealImage) {
        const diskStorage = new DiskStorage()
        filename = await diskStorage.saveFile(mealImage.filename)
      }

      const [meal_id] = await knex('meals').insert({
        image: filename,
        title,
        description,
        category,
        price
      })

      const hasOnlyOneIngredient = typeof(ingredients) === "string";

      let ingredientsInsert

      if (hasOnlyOneIngredient) {
        ingredientsInsert = {
          name: ingredients,
          meal_id
        }
      } else if (ingredients.length > 1) {
        ingredientsInsert = ingredients.map(ingredient => {
          return {
            name : ingredient,
            meal_id
          }
        })
      } else {
        return 
      }

      await knex("ingredients").insert(ingredientsInsert)

      return response.status(201).json()
    } catch (error) {
      console.log('Ocorreu um erro ao processar a imagem', error)
    }
  }

  async update(request, response) {
    const { title, description, category, price, ingredients } = request.body
    const { id } = request.params
  
    const mealImage = request.file
  
    try {
      let filename = null
  
      if (mealImage) {
        const diskStorage = new DiskStorage()
        filename = await diskStorage.saveFile(mealImage.filename)
      }
  
      if (!filename && !title && !description && !category && !price) {
        return response.status(200).json()
      }

      const updateData = {}
  
      if (filename) {
        updateData.image = filename
      }
  
      if (title) {
        updateData.title = title
      }
  
      if (description) {
        updateData.description = description
      }
  
      if (category) {
        updateData.category = category
      }
  
      if (price) {
        updateData.price = price
      }
  
      await knex('meals')
        .where('id', id)
        .update(updateData)

      await knex('ingredients')
        .where('meal_id', id)
        .del()
  
      const hasOnlyOneIngredient = typeof ingredients === 'string'
  
      let ingredientsInsert
  
      if (hasOnlyOneIngredient) {
        ingredientsInsert = {
          name: ingredients,
          meal_id: id
        }
      } else if (ingredients.length > 1) {
        ingredientsInsert = ingredients.map(ingredient => {
          return {
            name: ingredient,
            meal_id: id
          }
        })
      } else {
        return
      }

      await knex('ingredients').insert(ingredientsInsert)
  
      return response.status(200).json()
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao atualizar o prato' })
    }
  }
  
  async delete(request, response) {
    const { id } = request.params

    await knex('meals').where({ id }).delete()

    return response.json()
  }

  async show(request, response) {
    const { id } = request.params

    const meal = await knex('meals').where({ id }).first()
    const ingredients = await knex('ingredients')
      .where({ meal_id: id })
      .orderBy('name')

    return response.json({
      ...meal,
      ingredients
    })
  }

  async index(request, response) {
    const { title, ingredients } = request.query

    let meals

    if (ingredients) {
      const filterIngredients = ingredients
        .split(',')
        .map(ingredient => ingredient.trim())

      meals = await knex('ingredients')
        .select([
          'meals.id',
          'meals.title',
          'meals.description',
          'meals.category',
          'meals.price'
        ])
        .whereLike('meals.title', `%${title}%`)
        .whereIn('name', filterIngredients)
        .innerJoin('meals', 'meals.id', 'ingredients.meal_id')
        .groupBy('meals.id')
        .orderBy('meals.title')
    } else {
      meals = await knex('meals')
        .whereLike('title', `%${title}%`)
        .orderBy('title')
    }

    const mealsIngredients = await knex('ingredients')

    const mealsWithIngredients = meals.map(meal => {
      const mealIngredients = mealsIngredients.filter(
        ingredient => ingredient.meal_id === meal.id
      )

      return {
        ...meal,
        ingredients: mealIngredients
      }
    })

    return response.json(mealsWithIngredients)
  }
}
