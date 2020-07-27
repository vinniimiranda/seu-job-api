import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Addresses extends BaseSchema {
  protected tableName = 'addresses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('cep', 8).notNullable()
      table.string('street', 255).notNullable()
      table.string('number', 20).notNullable()
      table.string('neighborhood', 255).notNullable()
      table.string('city', 50).notNullable()
      table.string('state', 2).notNullable()
      table.integer('candidate_id')
        .unsigned()
        .references('id')
        .inTable('candidates')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
