import { Knex } from 'knex'

export class ProductService {
	constructor(private knex: Knex) {}

	productPage = async (categoriesId: number) => {
		let result = await this.knex
			.select('*')
			.from('products')
			.where('product_category_id', categoriesId)
		return result
	}

	heatSellProduct = async () =>{
		let result = await this.knex
			.select('*')
			.from('products')
			.orderBy("product_sell", 'asc')
			.limit(9)
		return result
	}

	searchProduct = async (keyWord: string) => {
		let result = await this.knex
			.select('*')
			.from('products')
			.where('product_name', 'ilike', `%${keyWord}%`)
			.orWhere('product_content', 'ilike', `%${keyWord}%`)
			.orWhere('product_company', 'ilike', `%${keyWord}%`)

		return result
	}

	productDetailInfo = async (productId: number) => {
		let result = await this.knex
			.select('*')
			.from('products')
			.where('id', productId)
		return result
	}
}
