import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex('users').del()
	await knex('categories').del()
	await knex('product_status').del()
	await knex('delivery_address').del()
	await knex('products').del()
	await knex('users_collection').del()
	await knex('carts').del()
	await knex('invoice').del()

	// Inserts seed entries
	await knex('users').insert([
		{
			account: 'admin1',
			password:
				'$2a$10$2i5uF0OCOQruC7QiTu1JM.lg1OGc5Iy0jC6usrYtzytiQBPx7eHlm',
			user_email: 'admin1@gmail.com',
			user_name: 'admin1_name',
			phone_number: 12345678,
			user_gender: 'M'
		}, //passWord = 123
		{
			account: 'admin2',
			password:
				'$2a$10$2i5uF0OCOQruC7QiTu1JM.lg1OGc5Iy0jC6usrYtzytiQBPx7eHlm',
			user_email: 'admin2@gmail.com',
			user_name: 'admin2_name',
			phone_number: 12345678,
			user_gender: 'F'
		},
		{
			account: 'admin3',
			password:
				'$2a$10$2i5uF0OCOQruC7QiTu1JM.lg1OGc5Iy0jC6usrYtzytiQBPx7eHlm',
			user_email: 'admin3@gmail.com',
			user_name: 'admin3_name',
			phone_number: 12345678,
			user_gender: 'F'
		}
	])

	await knex('categories').insert([
		{
			category_name: 'superMarket'
		},
		{
			category_name: 'healthCare'
		},
		{
			category_name: 'skinCareAndMakeUp'
		},
		{
			category_name: 'motherAndBaby'
		},
		{
			category_name: 'pets'
		},
		{
			category_name: 'gadgetsAndElectronics'
		}
	])

	await knex('product_status').insert([
		{
			status: 'online'
		},
		{
			status: 'offline'
		},
		{
			status: 'pending'
		}
	])

	await knex('delivery_address').insert([
		{
			user_id: 1,
			user_delivery_address: 'hk'
		},
		{
			user_id: 2,
			user_delivery_address: 'uk'
		},
		{
			user_id: 1,
			user_delivery_address: 'JP'
		}
	])

	await knex('products').insert([
		{
			product_category_id: 6,
			product_status_id: 1,
			product_name: 'computerA',
			product_image: 'computer1.png',
			product_price: 5000,
			product_content: 'this is a computerA',
			product_company: 'company',
			product_stock: 1000,
			product_stripeID: 'prod_MDZL9eq8f1mMXX',
			product_paymentID:'price_1LV8CxJ1L0gHuQn049YPWPoa',
		},
		{
			product_category_id: 6,
			product_status_id: 1,//use
			product_name: 'computerB',
			product_image: 'computer1.png',
			product_price: 5000,
			product_content: 'this is a computerB',
			product_company: 'company',
			product_stock: 1000,//nouse
			product_stripeID: 'prod_MDZMeseNqP6ExR',
			product_paymentID:'price_1LV8DsJ1L0gHuQn0kOK9VSZY',
		},
		{
			product_category_id: 6,
			product_status_id: 1,
			product_name: 'book',
			product_image: 'computer1.png',
			product_price: 50,
			product_content: 'this is a book',
			product_company: 'company',
			product_stock: 1000,
			product_stripeID: 'prod_MDZN0PLM0QBR3i',
			product_paymentID:'price_1LV8ELJ1L0gHuQn091SpB8UH',
		},
		{
			product_category_id: 6,
			product_status_id: 1,
			product_name: 'Alex',
			product_image: 'computer1.png',
			product_price: 100,
			product_content: 'this is Alex',
			product_company: 'Alex',
			product_stock: 1000,
			product_stripeID: 'prod_MDZN0cdjplp5wT',
			product_paymentID:'price_1LV8EkJ1L0gHuQn02juMJNUN',
		}
	])



	await knex('users_collection').insert([
		{
			user_id: 1,
			product_id: 1
		}
	])

	await knex('carts').insert([
		{
			user_id: 1,
			product_id: 1,
			product_volume: 1
		},
		{
			user_id: 1,
			product_id: 2,
			product_volume: 3
		}
		
	])


	// await knex('invoice').insert([
	// 	{
	// 		user_id: 1,
	// 		product: [{product_name:,product_volume:1}],
	// 		delivery_address_user_id: 1,
	// 		invoice_status:'non-unpaid'
	// 	}
	// ])
}
