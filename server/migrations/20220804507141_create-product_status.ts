import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	const hasTable = await knex.schema.hasTable('product_status')
	if (!hasTable) {
		await knex.schema.createTable('product_status', (table) => {
			table.increments()
			table.string('status').notNullable
		})
	}
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('product_status')
}
