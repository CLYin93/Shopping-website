import express from 'express'
import { knex } from '../db'
import { CartController } from '../model/cart/cartController'
import { CartService } from '../model/cart/cartService'

export const cartRoutes = express.Router()

const cartServices = new CartService(knex)
const cartControllers = new CartController(cartServices)

cartRoutes.post('/addCart', cartControllers.addCart)
cartRoutes.get('/showThisProductVolume/:productId', cartControllers.showThisProductVolume)
cartRoutes.get('/viewCart', cartControllers.viewCart)
cartRoutes.get('/thisProductPriceCount/:productId', cartControllers.thisProductPriceCount)
cartRoutes.get('/totalCost', cartControllers.totalCost)


cartRoutes.patch ('/decrementCart', cartControllers.decrementCart)
cartRoutes.delete ('/removeCart', cartControllers.removeCart)

cartRoutes.get('/checkOut', cartControllers.checkOut)
cartRoutes.post('/pay', cartControllers.pay)
// cartRoutes.post('/webhook', express.raw({type: 'application/json'}),cartControllers.webhook)

cartRoutes.get('/showInvoice', cartControllers.showInvoice)
cartRoutes.delete('/removeInvoice', cartControllers.removeInvoice)
// cartRoutes.post('/delivery', cartControllers.delivery) //default :Store pick up
