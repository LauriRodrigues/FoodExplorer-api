import bcrypt from 'bcryptjs'
import { AppError } from '../utils/AppError.js'
import { connection as knex } from '../database/knex/index.js'

export class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body

    if (!name) {
      throw new AppError('Nome é obrigatório.')
    }

    const checkUserExists = await knex('users').where('email', email)

    if (checkUserExists.length !== 0) {
      throw new AppError('Este e-mail já está em uso.')
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    await knex('users').insert({
      name,
      email,
      password: hashedPassword
    })

    return response.status(201).json()
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body
    const { id } = request.params
    
    const userList = await knex('users').where('id', id)
    const user = userList[0]

    if(!user) {
      throw new AppError("Usuário não encontrado!")
    }

    const userWithUpdatedEmailList = await knex('users').where('email', email)
    const userWithUpdatedEmail = userWithUpdatedEmailList[0]
  
    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso.")
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if(password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha")
    }
    
    if (password && old_password) {
      const checkOldPassword = await bcrypt.compare(old_password, user.password)

      if(!checkOldPassword) {
        throw new AppError("Senha antiga não confere.")
      }

      user.password = await bcrypt.hash(password, 8)
    }

    await knex('users').where('id', id).update({
      name,
      email,
      password: user.password,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    })

    return response.status(200).json()
  }
}