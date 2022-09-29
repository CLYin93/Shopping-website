import { Knex } from 'knex'

export class AdminService {
	constructor(private knex: Knex) {}

	ViewAllProduct = async () => {
		let result = await this.knex.select('*').from('products')
		return result
	}

	adminAddProduct = async (
		product_name: string,
		product_price: number,
		product_Id: string,
		product_paymentID: string,
		product_category_id: number,
		productStatusId: number,
		product_image: string,
		product_content: string,
		product_company: string
	) => {
		let findProduct = await this.knex
			.select('id')
			.from('products')
			.where('product_name', product_name)
			.andWhere('product_paymentID', product_paymentID)
		// console.log(findProductOnUsersCart);

		if (findProduct.length == 0) {
			await this.knex('products').insert({
				product_name: product_name,
				product_price: product_price,
				product_paymentID: product_paymentID,
				product_stripeID: product_Id,
				product_category_id: product_category_id,
				product_status_id: productStatusId,
				product_image: product_image,
				product_content: product_content,
				product_company: product_company
			})

			return true
		} else {
			return false
		}
	}

	adminEditProduct = async (
		product_name: string,
		product_price: number,
		product_stripeID: string,
		product_category_id: number,
		productStatusId: number,
		product_image: string,
		product_content: string,
		product_company: string
	) => {
		await this.knex('products')
			.where('product_stripeID', product_stripeID)
			.update({
				product_name: product_name,
				product_price: product_price,
				product_category_id: product_category_id,
				product_status_id: productStatusId,
				product_image: product_image,
				product_content: product_content,
				product_company: product_company
			})

		return true
	}
}
