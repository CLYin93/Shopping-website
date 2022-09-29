import express from 'express'
import { AdminService } from './adminService'
import { stripe } from '../stripe'

export class AdminController {
	constructor(private adminService: AdminService) {}

	//manage all product
	adminViewAllProduct = async (
		req: express.Request,
		res: express.Response
	) => {
		let product = await this.adminService.ViewAllProduct()
		res.json(product)
	}
	adminAddProduct = async (req: express.Request, res: express.Response) => {
		if (Object.keys(req.body).length < 7) {
			console.log(req.body)
			res.json('please enter product info')
			return
		}
		let productName = req.body.productName
		let unitAmount = parseInt(req.body.productUnitAmount)
		let categoryId = parseInt(req.body.categoryId)
		let productStatusId = parseInt(req.body.productStatusId)
		let productImage = req.body.productImage
		let productContent = req.body.productContent
		let productCompany = req.body.productCompany

		const productcreate = await stripe.products.create({
			name: productName,
			default_price_data: { unit_amount: unitAmount, currency: 'hkd' }
		})
		let product_Id = productcreate.id as string
		let product_paymentID = productcreate.default_price as string

		let result = await this.adminService.adminAddProduct(
			productName,
			unitAmount,
			product_Id,
			product_paymentID,
			categoryId,
			productStatusId,
			productImage,
			productContent,
			productCompany
		)
		res.json(result)
	}

	adminEditProduct = async (req: express.Request, res: express.Response) => {
		if (Object.keys(req.body).length < 4) {
			res.json('please enter product info')
			return
		}

		let product_stripeID = req.body.product_stripeID

		let productName = req.body.productName
		let unitAmount = parseInt(req.body.productUnitAmount)
		let categoryId = parseInt(req.body.categoryId)
		let productStatusId = parseInt(req.body.productStatusId)
		let productImage = req.body.productImage
		let productContent = req.body.productContent
		let productCompany = req.body.productCompany

		await stripe.products.update(product_stripeID, {
			metadata: { name: productName, unit_amount: unitAmount }
		})

		let result = await this.adminService.adminEditProduct(
			productName,
			unitAmount,
			product_stripeID,
			categoryId,
			productStatusId,
			productImage,
			productContent,
			productCompany
		)
		res.json(result)
	}
	adminDeleteProduct = async (
		req: express.Request,
		res: express.Response
	) => {}

	//manage all invoice
	adminViewAllInvoice = async (
		req: express.Request,
		res: express.Response
	) => {}
	adminEditInvoice = async (req: express.Request, res: express.Response) => {}
	adminDeleteInvoice = async (
		req: express.Request,
		res: express.Response
	) => {}

	//manage all user
	adminViewAllUser = async (req: express.Request, res: express.Response) => {}
	adminEditUser = async (req: express.Request, res: express.Response) => {}
	adminDeleteUser = async (req: express.Request, res: express.Response) => {}
}
