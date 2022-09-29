import express from 'express'
import { knex } from '../db'

import { ProductController } from '../model/product/productController'
import { ProductService } from '../model/product/productService'

export const productRoutes = express.Router()

// for product information   rename: page routes?
const productServices = new ProductService(knex)
const productControllers = new ProductController(productServices)

productRoutes.get('/productPage/:categoriesId', productControllers.productPage)
productRoutes.get('/heatSellProduct', productControllers.heatSellProduct)
productRoutes.get('/SearchProduct', productControllers.searchProduct)
productRoutes.get(
	'/productDetailInfo/:id',
	productControllers.productDetailInfo
)
// routes.get('/aboutUS', )
