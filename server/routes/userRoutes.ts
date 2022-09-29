import express from 'express'
import { knex } from '../db'
import { UserController } from '../model/user/userController'
import { UserService } from '../model/user/userService'

export const userRoutes = express.Router()

//for user login and register
const userServices = new UserService(knex)
const userControllers = new UserController(userServices)

//基本用戶行為
userRoutes.post('/login', userControllers.login) //Done except session setting
userRoutes.get('/login/google', userControllers.loginGoogle)
userRoutes.post('/register', userControllers.register) //Done except userService knex try catch?
userRoutes.post('/logout', userControllers.logout)
userRoutes.get('/isLogin', userControllers.isLogin)

//用戶資料編輯
userRoutes.get('/userInfo', userControllers.showUserInfo) // user address,invoice,
userRoutes.put('/userInfo', userControllers.editUserInfo) // edit user address

//加入收藏
userRoutes.post('/collection', userControllers.addCollection)
userRoutes.get('/collection', userControllers.getCollection)
userRoutes.delete('/collection', userControllers.removeCollection)
