import express from 'express'
import { cartRoutes } from './routes/cartRoutes'
import { productRoutes } from './routes/productRoutes'
import { superAdminRoutes } from './routes/superAdminRoutes'
import { userRoutes } from './routes/userRoutes'

export const routes = express.Router()

routes.use('/user', userRoutes)

routes.use('/cart', cartRoutes)

routes.use('/superAdmin', superAdminRoutes)

routes.use('/product', productRoutes)
