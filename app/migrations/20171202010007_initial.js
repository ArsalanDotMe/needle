
exports.up = function (knex, Promise) {
  return knex.schema.createTable('tunnel', (table) => {
    table.increments()
    table.string('slug').unique()
    table.string('socket_id').unique()
    table.timestamps()
  }) 
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('tunnel')
}
