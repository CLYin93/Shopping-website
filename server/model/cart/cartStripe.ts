// domain = d
import express from 'express'
import Stripe from 'stripe'
// import { Knex } from 'knex'
import { knex } from '../../db'
export const cartStripe = express.Router()

const stripe = new Stripe(
	'sk_test_51LV88HJ1L0gHuQn0k46v9Y46MlaEx4HvjUqfnHn0vYeyg8tbqon96E5rUtLYYj9X0LSH6ZzpmFMqlQ657dW5rqYz00sqVvWJo4',
	{
		apiVersion: '2022-08-01'
	}
)

cartStripe.post(
	'/webhook',
	express.raw({ type: 'application/json' }),
	async (req, res) => {
		// console.log(req.body)

		const payload = req.body
		const endpointSecret =
			'whsec_FpzEkjsxJqQEiDe3XOeVof7pTNyKJkXW'
		const sig = req.headers['stripe-signature'] as string

		let event

		try {
			event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)

			if (event.type === 'checkout.session.completed') {
				//@ts-ignore
				console.log(event.data.object.metadata)
				//@ts-ignore
				console.log(event.data.object.payment_status)
				//@ts-ignore
				if (event.data.object.payment_status === 'paid') {
					//@ts-ignore
					let paidId = event.data.object.metadata.paymentInvoiceID
					//@ts-ignore
					let user_id = event.data.object.metadata.user_id

					await knex('invoice').where('id', paidId).update({
						invoice_status: 'paid'
					})

					await knex('carts').where('user_id', user_id).del()

					console.log('paided')
				}
			}
		} catch (err) {
			console.log(err)
			res.status(400).send(`Webhook Error: ${err.message}`)
			return
		}
		res.status(200)
	}
)
