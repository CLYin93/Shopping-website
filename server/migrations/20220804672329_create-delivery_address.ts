import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	const hasTable = await knex.schema.hasTable('delivery_address')
	if (!hasTable) {
		await knex.schema.createTable('delivery_address', (table) => {
			table.increments()
			table.integer('user_id').notNullable
			table.string('user_delivery_address').notNullable
			table.timestamps(false, true)
			table.foreign('user_id').references('users.id')
		})
	}
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('delivery_address')
}
