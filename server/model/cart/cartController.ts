import express from 'express'
import { CartService } from './cartService'
import { stripe } from '../stripe'

export class CartController {
	constructor(private cartService: CartService) {}

	deliveryFeeDiscount: number = 200
	deliveryFee: number = 40

	addCart = async (req: express.Request, res: express.Response) => {
		
		if (typeof(req.session['userInfo']) == 'undefined') {
			res.json('please login')
			return
		}
		let product_id = req.body.product_id
		let user_id = req.session['userInfo'].id
		let result = await this.cartService.addCart(product_id, user_id)

		res.json(result)
	}

	showThisProductVolume = async (
		req: express.Request,
		res: express.Response
	) => {
		let product_id = parseInt(req.params.productId)
		let user_id = req.session['userInfo'].id
		if (typeof (user_id) == 'undefined') {
			res.json('please login')
			return
		} else if (typeof (product_id) == 'undefined') {
			res.json('product do not exist')
			return
		}
		let result = await this.cartService.showThisProductVolume(
			product_id,
			user_id
		)
		res.json(result)
	}

	viewCart = async (req: express.Request, res: express.Response) => {

		if (typeof(req.session['userInfo']) == 'undefined') {
			res.json('please login')
			return
		}
		let user_id = req.session['userInfo'].id
		let result = await this.cartService.viewCart(user_id)

		res.json(result)
		
	}

	thisProductPriceCount = async (
		req: express.Request,
		res: express.Response
	) => {

		
		if (typeof(req.session['userInfo']) == 'undefined') {
			res.json('please login')
			return
		}else if (typeof (req.params.productId) == 'undefined') {
			res.json('product do not exist')
			return
		}
		let product_id = parseInt(req.params.productId)
		let user_id = req.session['userInfo'].id
		let result = await this.cartService.thisProductPriceCount(
			product_id,
			user_id
		)

		res.json(result)
	}

	totalCost = async (req: express.Request, res: express.Response) => {
		let gap: number = 0
		let totalOrder: number = 0
		
		if (typeof(req.session['userInfo']) == 'undefined') {
			res.json('please login')
			return
		}
		let user_id = req.session['userInfo'].id
		let totalCostrseult = await this.cartService.totalCost(user_id)
		if (totalCostrseult == 'Do not have product in cart') {
			res.json(totalCostrseult)
		} else {
			let totalCost = totalCostrseult as number
			if (totalCost >= this.deliveryFeeDiscount) {
				gap = 0
				totalOrder = totalCost 
				this.deliveryFee = 0
			} else {
				gap = this.deliveryFeeDiscount - totalCost
				totalOrder = totalCost + this.deliveryFee
			}

			let result = {
				totalCost: totalCost,
				gap: gap,
				deliveryFee: this.deliveryFee,
				totalOrder: totalOrder
			}

			res.json(result)
		}
	}

	decrementCart = async (req: express.Request, res: express.Response) => {
		if (typeof(req.session['userInfo']) == 'undefined') {
			res.json('please login')
			return
		}
		let product_id = req.body.product_id
		let user_id = req.session['userInfo'].id
		
		let result = await this.cartService.decrement(product_id, user_id)

		res.json(result) //cart product volume
	}

	removeCart = async (req: express.Request, res: express.Response) => {
		if (typeof(req.session['userInfo']) == 'undefined') {
			res.json('please login')
			return
		}
		let product_id = req.body.product_id
		let user_id = req.session['userInfo'].id
		
		let result = await this.cartService.removeCart(product_id, user_id)

		res.json(result) //return true
	}

	checkOut = async (req: express.Request, res: express.Response) => {
		if (typeof(req.session['userInfo']) == 'undefined') {
			res.json('please login')
			return
		}
		let totalOrder: number = 0
		let user_id = req.session['userInfo'].id
		
		

		let result = await this.cartService.totalCost(user_id)
		if (result == 'Do not have product in cart') {
			res.json(result)
		} else {
			let deliveryFeeDiscount
			
			let totalCost = result as number
			if (totalCost >= this.deliveryFeeDiscount) {
				// totalOrder = totalCost - this.deliveryFee
				deliveryFeeDiscount = true
			} else {
				totalOrder = totalCost + this.deliveryFee
				deliveryFeeDiscount = false
			}
			let createdInvoice = await this.cartService.createInvoice(
				user_id,
				totalOrder,
				deliveryFeeDiscount
			)
			
			console.log(createdInvoice)

			// {
			//	"deliveryFeeDiscount" true,
			// 	"id": 1,
			// 	"user_id": 1,
			// 	"user_delivery_address": "hk",
			// 	"total_order": 19960,
			// 	"products": [
			// 		{
			// 			"product_name": "computerB",
			// 			"product_volume": 3,
			// 			"product_paymentID": "price_1LV8DsJ1L0gHuQn0kOK9VSZY"
			// 		},
			// 		{
			// 			"product_name": "computerA",
			// 			"product_volume": 1,
			// 			"product_paymentID": "price_1LV8CxJ1L0gHuQn049YPWPoa"
			// 		}
			// 	]
			// }

			res.json(createdInvoice)
		}
	}

	pay = async (req: express.Request, res: express.Response) => {

		if (typeof(req.session['userInfo']) == 'undefined') {
			res.json('please login')
			return
		}

		if (typeof(req.body.invoiceId) == 'undefined') {
			res.json('please send Invoice Id')
			return
		}
		let invoice_id = parseInt(req.body.invoiceId)
		// let invoice_id = req.body.invoiceId
		let user_id = req.session['userInfo'].id
		

		let paymentProducts = await this.cartService.getInvoiceProductsForPay(
			user_id,
			invoice_id
		)
		if (paymentProducts == 'user do not have Invoice'){
			res.json('user do not have Invoice')
			return
		}
		
			// [
			// 	{"product_name":"book","product_volume":1,"product_paymentID":"price_1LV8ELJ1L0gHuQn091SpB8UH"},
			// 	{"product_name":"computerB","product_volume":4,"product_paymentID":"price_1LV8DsJ1L0gHuQn0kOK9VSZY"},
			// 	{"product_name":"computerA","product_volume":2,"product_paymentID":"price_1LV8CxJ1L0gHuQn049YPWPoa"}
			//   ]

		let forPayLineItems = []
		// console.log(!paymentProducts[1])
		// console.log(typeof paymentProducts[1])

		if(!paymentProducts[1]){
			forPayLineItems.push({
				price: 'price_1LVacbJ1L0gHuQn09qnJUWDA',
				quantity: 1
			})
		}
		
		for (let i = 0; i < paymentProducts[0].length; i++) {
			forPayLineItems.push({
				price: paymentProducts[0][i].product_paymentID,
				quantity: paymentProducts[0][i].product_volume
			})
		}
		
		// console.log(paymentProducts[2]);
		// console.log(typeof(paymentProducts[1]))
		const session = await stripe.checkout.sessions.create({
			
			line_items: forPayLineItems,
			// metadata:{paymentProducts:1},
			metadata:{paymentInvoiceID:paymentProducts[2],
				user_id:user_id},
			
			// 	{
			// 		// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
			// 		price: '',
			// 		quantity: 1
			// 	}
			// ]
			mode: 'payment',
			success_url: `http://hnchan.me/`,
			cancel_url: `http://hnchan.me/?error=paymentfaile`
		})
		// console.log(session);
		let url:any = session.url
		
		res.redirect(url);

		// if (session.url != null) {
		// 	res.json('paySuccess')
		// } else {
		// 	res.json('payFaile')
		// }
	}

	

	showInvoice = async (req: express.Request, res: express.Response) => {
		if (typeof(req.session['userInfo']) == 'undefined') {
			res.json('please login')
			return
		}
		let user_id = req.session['userInfo'].id
		let result = await this.cartService.showInvoice(user_id)
		res.json(result)
	
	}
	removeInvoice = async (req: express.Request, res: express.Response) => {
		if (typeof(req.session['userInfo']) == 'undefined') {
			res.json('please login')
			return
		}
		let invoice_id = req.body.invoice_id
		let user_id = req.session['userInfo'].id
		
		let result = await this.cartService.removeInvoice(invoice_id, user_id)

		res.json(result) //return true
	}
	

}
