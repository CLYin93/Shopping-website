import { CartService } from '../model/cart/cartService'
import { knex } from '../db'

describe('test CartService ', () => {
	beforeAll(
		async () =>
			await knex.migrate
				.rollback({}, true)
				.then(() => knex.migrate.latest().then(() => knex.seed.run()))
	)

	let cartService = new CartService(knex)

	it('add cart increment item ', async () => {
		let product_id = 1
		let user_id = 1
		let result:any = await cartService.addCart(product_id, user_id)
		expect(result.totalVolume).toBe(5)
		expect(result.thisProductVolume).toBe(2)
	})

	it('add cart with other iteam ', async () => {
		let product_id = 2
		let user_id = 1

		let result:any = await cartService.addCart(product_id, user_id)

		expect(result.totalVolume).toBe(6)
		expect(result.thisProductVolume).toBe(4)
		
	})

	it('add cart with new iteam ', async () => {
		let product_id = 3
		let user_id = 1

		let result:any = await cartService.addCart(product_id, user_id)

		expect(result.totalVolume).toBe(7)
		expect(result.thisProductVolume).toBe(1)
		
	})

	it('add cart with the product do not exist ', async () => {
		let product_id = 999
		let user_id = 1

		let result:any = await cartService.addCart(product_id, user_id)

		expect(result).toBe("the product do not exist")
		
		
	})

	it('show This Product Volume ', async () => {
		let product_id = 3
		let user_id = 1

		let result = await cartService.showThisProductVolume(product_id, user_id)

		expect(result).toBe(1)
	})

	it('show This Product Volume with product do not exist', async () => {
		let product_id = 999
		let user_id = 1

		let result = await cartService.showThisProductVolume(product_id, user_id)

		expect(result).toBe(0)
	})

	it('show This Product Volume with user do not exist', async () => {
		let product_id = 1
		let user_id = 999

		let result = await cartService.showThisProductVolume(product_id, user_id)

		expect(result).toBe(0)
	})

	it('show all Product for cart ', async () => {
		let user_id = 1

		let result = await cartService.viewCart(user_id)

		expect(result.length).toBe(3)
	})

	it('show all Product for cart with user do not exist ', async () => {
		let user_id = 999

		let result = await cartService.viewCart(user_id)

		expect(result).toBe("You do not have product in cart")
	})


	it('This Product Price Count ', async () => {
		let user_id = 1
		let product_id = 1

		expect(await cartService.thisProductPriceCount(product_id,user_id)).toBe(10000)
	})

	it('This Product Price Count with product do not exist', async () => {
		let user_id = 1
		let product_id = 999

		expect(await cartService.thisProductPriceCount(product_id,user_id)).toBe(0)
	})

	it('This Product Price Count with user do not exist', async () => {
		let user_id = 999
		let product_id = 1

		expect(await cartService.thisProductPriceCount(product_id,user_id)).toBe(0)
	})
	



	it('show totalCost ', async () => {
		let user_id = 1

		expect(await cartService.totalCost(user_id)).toBe(30050)
	})

	it('create Invoice', async () => {
		let user_id = 1
		let totalOrder = 3050
		let deliveryFeeDiscount = true
		//2 4 1

		expect(await cartService.createInvoice(user_id,totalOrder,deliveryFeeDiscount)).toStrictEqual({
			"deliveryFeeDiscount": true,
			"id": 1,
			"user_id": 1,
			"user_delivery_address": "hk",
			"total_order": 3050,
			"products": [
				{
					"product_name": "book",
					"product_paymentID": "price_1LV8ELJ1L0gHuQn091SpB8UH",
					"product_volume": 1,
				},
				{
					"product_name": "computerB",
					"product_volume": 4,
					"product_paymentID": "price_1LV8DsJ1L0gHuQn0kOK9VSZY"
				},
				{
					"product_name": "computerA",
					"product_volume": 2,
					"product_paymentID": "price_1LV8CxJ1L0gHuQn049YPWPoa"
				}
			]
		})
	})

	it('get Invoice Products For Pay', async () => {
		let user_id = 1
		let invoice_id = 1
		

		expect(await cartService.getInvoiceProductsForPay(user_id,invoice_id)).toStrictEqual([[
			{"product_name":"book","product_volume":1,"product_paymentID":"price_1LV8ELJ1L0gHuQn091SpB8UH"},
			{"product_name":"computerB","product_volume":4,"product_paymentID":"price_1LV8DsJ1L0gHuQn0kOK9VSZY"},
			{"product_name":"computerA","product_volume":2,"product_paymentID":"price_1LV8CxJ1L0gHuQn049YPWPoa"}
		  ],true,1])
	})








	it('decrement iteam on cart ', async () => {
		let user_id = 1
		let product_id = 1

		expect(await cartService.decrement(product_id,user_id)).toStrictEqual({"thisProductVolume": 1, "totalVolume": 6})
	})

	it('decrement iteam with not on cart ', async () => {
		let user_id = 1
		let product_id = 1

		expect(await cartService.decrement(product_id,user_id)).toStrictEqual( {"thisProductVolume": 0, "totalVolume": 5})
	})

	it('remove iteam with on cart ', async () => {
		let user_id = 1
		let product_id = 1

		expect(await cartService.removeCart(product_id,user_id)).toBe(true)
	})

	it('remove iteam with not on cart ', async () => {
		let user_id = 1
		let product_id = 1

		expect(await cartService.removeCart(product_id,user_id)).toBe(true)
	})

	


	afterAll((done) => {
		knex.destroy()
		done()
	})
})
