import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	const hasTable = await knex.schema.hasTable('invoice')
	if (!hasTable) {
		await knex.schema.createTable('invoice', (table) => {
			table.increments()
			table.integer('user_id').notNullable
			table.specificType('products', 'text ARRAY');
			// table.specificType('product').notNullable //[{product_name,productVolume}] in cart
			table.string('user_delivery_address').notNullable
			table.integer('total_order').notNullable
			table.boolean('deliveryFeeDiscount').notNullable
			
			table.string('invoice_status').defaultTo('unpaid').notNullable
			table.timestamps(false, true)
			table.foreign('user_id').references('users.id')
			
		
			
		})
	}
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('invoice')
}
