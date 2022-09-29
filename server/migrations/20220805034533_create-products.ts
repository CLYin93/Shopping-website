import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	const hasTable = await knex.schema.hasTable('products')
	if (!hasTable) {
		await knex.schema.createTable('products', (table) => {
			table.increments()
			table.integer('product_category_id').notNullable
			table.integer('product_status_id').notNullable
			table.string('product_name').notNullable
			table.string('product_image')
			table.integer('product_price').notNullable
			table.string('product_content')
			table.string('product_company')
			table.integer('product_stock')
			table.string('product_paymentID').notNullable
			table.string('product_stripeID').notNullable
			table.integer('product_search_count').defaultTo(0)
			table.integer('product_sell').defaultTo(0)
			table.timestamps(false, true)
			table.foreign('product_category_id').references('categories.id')
			table.foreign('product_status_id').references('product_status.id')
		})
	}
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('products')
}
