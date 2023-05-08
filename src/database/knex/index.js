import config from "../../../knexfile.js"
import knex from "knex"

export const connection = knex(config.development)