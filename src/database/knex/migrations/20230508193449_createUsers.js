export function up(knex) {
  return knex.schema.createTable("users", table => {
    table.increments("id")
    table.boolean("is_admin")
    table.text("name")
    table.text("email")
    table.text("password")
    table.timestamp("created_at").default(knex.fn.now())
    table.timestamp("updated_at").default(knex.fn.now())
  })
}

export function down(knex) {
  return knex.schema.dropTable("users")
}
