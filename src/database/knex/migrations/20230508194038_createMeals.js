export function up(knex) {
  return knex.schema.createTable("meals", table => {
    table.increments("id")
    table.text("title")
    table.text("description")
    table.text("category")
    table.text("image")
    table.float("price")
    table.timestamp("created_at").default(knex.fn.now())
    table.timestamp("updated_at").default(knex.fn.now())
  })
}

export function down(knex) {
  return knex.schema.dropTable("meals")
}