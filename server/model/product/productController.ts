import express from 'express'
import { ProductService } from './productService'

export class ProductController {
	constructor(private productService: ProductService) {}

	productPage = async (req: express.Request, res: express.Response) => {
		try {
			let categoriesId = parseInt(req.params.categoriesId)

			let product = await this.productService.productPage(categoriesId)
			res.json(product)
		} catch (e) {
			console.log(e)
			res.json('Internal Server Error')
		}
	}

	heatSellProduct = async (req: express.Request, res: express.Response) => {
		try {
			let product = await this.productService.heatSellProduct()
			res.json(product)
		} catch (e) {
			console.log(e)
			res.json('Internal Server Error')
		}
	}

	searchProduct = async (req: express.Request, res: express.Response) => {
		if (req.query.keyWord) {
			let keyWord = req.query.keyWord

			try {
				let result = await this.productService.searchProduct(
					keyWord.toString()
				)
				res.json(result)
			} catch (e) {
				console.log(e)
				res.json('Internal Server Error')
			}
		} else {
			res.json('Internal Server Error')
		}
	}

	productDetailInfo = async (req: express.Request, res: express.Response) => {
		let productId = parseInt(req.params.id)
		try {
			let result = await this.productService.productDetailInfo(productId)
			res.json(result)
		} catch (e) {
			console.log(e)
		}
	}
}
