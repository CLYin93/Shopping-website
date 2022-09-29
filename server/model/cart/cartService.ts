import { Knex } from 'knex'


export class CartService {
	constructor(private knex: Knex) {}

	addCart = async (product_id: number, user_id: number) => {
		let findProduct = await this.knex
			.select('id')
			.from('products')
			.where('id', product_id)
		if (findProduct.length == 0) {
			return 'the product do not exist'
		}

		let findProductOnUsersCart = await this.knex
			.select('id')
			.from('carts')
			.where('product_id', product_id)
			.andWhere('user_id', user_id)
		// console.log(findProductOnUsersCart);

		if (findProductOnUsersCart.length == 0) {
			await this.knex('carts').insert({
				user_id: user_id,
				product_id: product_id,
				product_volume: 1
			})
		} else {
			await this.knex('carts')
				.increment('product_volume')
				.where('id', findProductOnUsersCart[0].id)
		}

		let totalVolume = await this.knex('carts')
			.sum('product_volume')
			.where('user_id', user_id)

		let thisProductVolume = await this.knex('carts')
			.select('product_volume')
			.where('product_id', product_id)
			.andWhere('user_id', user_id)

		let result = {
			totalVolume: parseInt(totalVolume[0].sum),
			thisProductVolume: parseInt(thisProductVolume[0].product_volume)
		}

		// console.log(result)

		return result
	}
	showThisProductVolume = async (product_id: number, user_id: number) => {
		let showThisProductVolume = await this.knex('carts')
			.select('product_volume')
			.where('product_id', product_id)
			.andWhere('user_id', user_id)
		if (showThisProductVolume.length == 0) {
			return 0
		} else {
			return parseInt(showThisProductVolume[0].product_volume)
		}
	}

	viewCart = async (user_id: number) => {
		let UsersCartHaveProduct = await this.knex
			.select('id')
			.from('carts')
			.where('user_id', user_id)
		if (UsersCartHaveProduct.length == 0) {
			return 'You do not have product in cart'
		}

		let findAllProductOnUserCart = await this.knex
			.join('carts', 'products.id', '=', 'carts.product_id')
			.select(
				'carts.id',
				'products.id',
				'carts.user_id',
				'product_name', //
				'product_image', //圖片
				'product_content', //介紹
				'product_company', //公司
				'product_price', //價格
				'product_volume' //數量
			)
			.from('products')
			.where('user_id', user_id)
		return findAllProductOnUserCart
	}

	thisProductPriceCount = async (product_id: number, user_id: number) => {
		let showThisProductVolume = await this.knex('carts')
			.select('product_volume')
			.where('product_id', product_id)
			.andWhere('user_id', user_id)
		if (showThisProductVolume.length == 0) {
			return 0
		}
		let thisProductPriceCount = await this.knex.raw(
			`select  (product_volume*product_price) as corst from products join carts on products.id = carts.product_id where user_id= ${user_id} and product_id =${product_id}`
		)

		let result = parseInt(thisProductPriceCount.rows[0].corst)

		// console.log(result)

		return result
	}

	totalCost = async (user_id: number) => {
		let showThisProductVolume = await this.knex('carts')
			.select('product_volume')
			.where('user_id', user_id)
		if (showThisProductVolume.length == 0) {
			return 'Do not have product in cart'
		}
		let totalCost = await this.knex.raw(
			`with totalcorst as (select  (product_volume*product_price) as corst from products join carts on products.id = carts.product_id where user_id=${user_id} )select sum(corst) from totalcorst`
		)
		// console.log(totalCost.rows[0].sum)

		return parseInt(totalCost.rows[0].sum)
	}

	decrement = async (product_id: number, user_id: number) => {
		let findProductOnUsersCart = await this.knex
			.select('id', 'product_volume')
			.from('carts')
			.where('product_id', product_id)
			.andWhere('user_id', user_id)
		if (findProductOnUsersCart.length != 0) {
			if (parseInt(findProductOnUsersCart[0].product_volume) > 0) {
				let decrementid = await this.knex('carts')
					.decrement('product_volume')
					.where('id', findProductOnUsersCart[0].id)
					.returning('id')
				let id = parseInt(decrementid[0].id)

				let ProductVolume = await this.knex('carts')
					.select('product_volume')
					.where('id', id)
				if (parseInt(ProductVolume[0].product_volume) == 0) {
					await this.knex('carts').where('id', id).del()
				}
			}
		}

		let totalVolume = await this.knex('carts')
			.sum('product_volume')
			.where('user_id', user_id)

		let thisProductVolumes = await this.knex('carts')
			.select('product_volume')
			.where('product_id', product_id)
			.andWhere('user_id', user_id)
		let volume
		if (thisProductVolumes.length == 0) {
			volume = 0
		} else {
			volume = parseInt(thisProductVolumes[0].product_volume)
		}

		let result = {
			totalVolume: parseInt(totalVolume[0].sum),
			thisProductVolume: volume
		}
		return result
	}

	removeCart = async (product_id: number, user_id: number) => {
		let findProductOnUsersCart = await this.knex
			.select('id')
			.from('carts')
			.where('product_id', product_id)
			.andWhere('user_id', user_id)
		// console.log(findProductOnUsersCart);

		if (findProductOnUsersCart.length == 0) {
			return true
		} else {
			await this.knex('carts')
				.where('product_id', product_id)
				.andWhere('user_id', user_id)
				.del()
			return true
		}
	}

	createInvoice = async (user_id: number, totalOrder: number,deliveryFeeDiscount:boolean) => {
		let user_delivery_address = await this.knex
			.select('user_delivery_address')
			.from('delivery_address')
			.where('user_id', user_id)
		if (user_delivery_address.length == 0) {
			return 'no address'
		}

		let findAllProductOnUserCart = await this.knex
			.join('carts', 'products.id', '=', 'carts.product_id')
			.select('product_name', 'product_volume', 'product_paymentID')
			.from('products')
			.where('user_id', user_id)

		// console.log(findAllProductOnUserCart)

		let newInvoiceId = await this.knex('invoice')
			.insert({
				user_id: user_id,
				products: findAllProductOnUserCart,
				user_delivery_address:
				user_delivery_address[0].user_delivery_address,
				total_order: totalOrder,
				deliveryFeeDiscount,
			})
			.returning('id')
		let InvoiceId = parseInt(newInvoiceId[0].id)
		// console.log(InvoiceId)
		{
		let result = await this.knex
			.select(
				'id',
				'user_id',
				'products',
				'user_delivery_address',
				'total_order',
				'deliveryFeeDiscount'
			)
			.from('invoice')
			.where('id', InvoiceId)

		let id = result[0].id 
		let user_id= result[0].user_id
		let user_delivery_address= result[0].user_delivery_address
		let total_order= result[0].total_order
		let deliveryFeeDiscounts = result[0].deliveryFeeDiscount
		let product= result[0].products

		let products = []
		let productCount =  product.length
		// console.log(productCount);
		
		for(let i = productCount-1;i >=0;i--){
	
			products.push(JSON.parse(product[i]))
		}
		let results = {}
		results['id'] = id
		results['user_id'] = user_id
		results['user_delivery_address'] = user_delivery_address
		results['total_order'] = total_order
		results['products'] = products
		results['deliveryFeeDiscount'] = deliveryFeeDiscounts
		
		return results
		}
		
		

		
	}

	getInvoiceProductsForPay = async (user_id: number, invoice_id: number) => {
		let result = await this.knex
			.select('products','deliveryFeeDiscount','id')
			.from('invoice')
			.where('id', invoice_id)
			.andWhere('user_id', user_id)
			.andWhere('invoice_status', 'unpaid')
		// console.log(result);
		if (result.length ==0){
			return 'user do not have Invoice'
		}

		let resultCount = result[0].products.length
		
		 let newResult = []
		for(let i = resultCount-1; i >= 0; i--){
			newResult.push(JSON.parse(result[0].products[i]))
		}
		// [[
		// 	{"product_name":"book","product_volume":1,"product_paymentID":"price_1LV8ELJ1L0gHuQn091SpB8UH"},
		// 	{"product_name":"computerB","product_volume":4,"product_paymentID":"price_1LV8DsJ1L0gHuQn0kOK9VSZY"},
		// 	{"product_name":"computerA","product_volume":2,"product_paymentID":"price_1LV8CxJ1L0gHuQn049YPWPoa"}
		//   ],true,1]
		let results = [newResult,result[0].deliveryFeeDiscount,result[0].id]
		return results
	}




	showInvoice= async (user_id: number) => {
		let allInvoice:any = []
		let result = await this.knex
			.select(
				'id',
				'user_id',
				'products',
				'user_delivery_address',
				'total_order',
				'invoice_status',
				'deliveryFeeDiscount'
			)
			.from('invoice')
			.where('user_id', user_id)

		for (let i =  result.length-1; i >= 0; i--) {
		
		let id = result[i].id 
		let user_delivery_address= result[i].user_delivery_address
		let total_order= result[i].total_order
		let invoice_status = result[i].invoice_status
		let product= result[i].products
		let deliveryFeeDiscount = result[i].deliveryFeeDiscount
		let products = []
		let productCount =  product.length
		// console.log(productCount);
		
		for(let i = productCount-1;i >=0;i--){
	
			products.push(JSON.parse(product[i]))
		}
		let results = {}
		results['id'] = id
		results['user_delivery_address'] = user_delivery_address
		results['total_order'] = total_order
		results['products'] = products
		results['invoice_status'] = invoice_status
		results['deliveryFeeDiscount'] =deliveryFeeDiscount
		allInvoice.push(results)
		}
		
		
		return allInvoice
	}

	removeInvoice = async (invoice_id: number, user_id: number) => {
		let findProductOnUsersCart = await this.knex
			.select('id')
			.from('invoice')
			.where('id', invoice_id)
			.andWhere('user_id', user_id)
		// console.log(findProductOnUsersCart);

		if (findProductOnUsersCart.length == 0) {
			return "user do not have invoice"
		} else {
			await this.knex('invoice')
			.where('id', invoice_id)
			.andWhere('user_id', user_id)
				.del()
			return true
		}
	}
}

