import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	const hasTable = await knex.schema.hasTable('carts')
	if (!hasTable) {
		await knex.schema.createTable('carts', (table) => {
			table.increments()
			table.integer('user_id').notNullable
			table.integer('product_id').notNullable
			table.integer('product_volume').unsigned().notNullable
			table.timestamps(false, true)
			table.foreign('user_id').references('users.id')
			table.foreign('product_id').references('products.id')
		})
	}
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('carts')
}
