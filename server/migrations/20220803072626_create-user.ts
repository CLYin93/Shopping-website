import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	const hasTable = await knex.schema.hasTable('users')
	if (!hasTable) {
		await knex.schema.createTable('users', (table) => {
			table.increments()
			table.string('account').notNullable
			table.string('password').notNullable
			table.string('user_email').notNullable
			table.string('user_name').notNullable
			table.integer('phone_number').notNullable
			table.string('user_gender')
			table.boolean('active').defaultTo(true)
			table.timestamps(false, true)
		})
	}
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('users')
}
