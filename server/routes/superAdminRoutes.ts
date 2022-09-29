import express from 'express'
import { knex } from '../db'
import { AdminController } from '../model/superAdmin/adminController'
import { AdminService } from '../model/superAdmin/adminService'

export const superAdminRoutes = express.Router()

//superAdmin for manage all invoice and product
const adminService = new AdminService(knex)
const adminController = new AdminController(adminService)
//CRUD

//manage all product

superAdminRoutes.get('/adminViewAllProduct', adminController.adminViewAllProduct) //by list
superAdminRoutes.post('/adminAddProduct', adminController.adminAddProduct)
superAdminRoutes.patch('/adminEditProduct', adminController.adminEditProduct)
superAdminRoutes.delete('/adminDeleteProduct', adminController.adminDeleteProduct)

//manage all invoice
superAdminRoutes.get('/adminViewAllInvoice', adminController.adminViewAllInvoice) //by list
superAdminRoutes.patch('/adminEditInvoice', adminController.adminEditInvoice)
superAdminRoutes.delete('/adminDeleteInvoice', adminController.adminDeleteInvoice)

//manage all user
superAdminRoutes.get('/adminViewAllUser', adminController.adminViewAllUser) //by list
superAdminRoutes.patch('/adminEditUser', adminController.adminEditUser)
superAdminRoutes.delete('/adminDeleteUser', adminController.adminDeleteUser)
