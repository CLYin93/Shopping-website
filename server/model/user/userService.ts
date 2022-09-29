import { Knex } from 'knex'
import { checkPassword, hashPassword } from '../../hash'
import fetch from 'cross-fetch'

export class UserService {
	constructor(private knex: Knex) {}

	login = async (account: string, passWord: string) => {
		let result = await this.knex
			.select('*')
			.from('users')
			.where('account', account)

		if (result.length == 0) {
			return null
		}

		if (await checkPassword(passWord, result[0].password)) {
			return result
		} else {
			return null
		}
	}

	register = async (account: string, passWord: string) => {
		if (account == '' || passWord == '') {
			return false
		}
		let result = await this.knex
			.select('*')
			.from('users')
			.where('account', account)

		if (result.length != 0) {
			return false
		} else {
			await this.knex('users').insert({
				account: account,
				password: await hashPassword(passWord)
			})
			return true
		}
	}

	loginGoogle = async (accessToken: string) => {
		const fetchRes = await fetch(
			'https://www.googleapis.com/oauth2/v2/userinfo',
			{
				method: 'get',
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		)
		const result = await fetchRes.json()
		const users = await this.knex
			.select('*')
			.from('users')
			.where('userName', result.email)

		let user = users
		let account = result.name || result.email

		if (!users) {
			user = await this.knex('users').insert({
				account: account,
				passWord: await hashPassword(account)
			})
		}

		return [user, account]
	}

	showUserInfo = async (id: number) => {
		let userInfo_result: any[] | null = await this.knex
			.select('*')
			.from('users')
			.where('id', id)

		let delivery_address_result: any[] | null = await this.knex
			.select('*')
			.from('delivery_address')
			.where('user_id', id)

		let invoice_result: any[] | null = await this.knex
			.select('*')
			.from('invoice')
			.where('user_id', id)

		if (userInfo_result.length == 0) {
			userInfo_result = null
		}

		if (delivery_address_result.length == 0) {
			delivery_address_result = null
		}
		if (invoice_result.length == 0) {
			invoice_result = null
		}
		return [userInfo_result, delivery_address_result, invoice_result]
	}

	editUserInfo = async (
		id: number,
		email: string,
		username: string,
		phoneNumber: number,
		gender: string
	) => {
		try {
			await this.knex('users').where('id', id).update({
				user_email: email,
				user_name: username,
				phone_number: phoneNumber,
				user_gender: gender
			})
			return true
		} catch (error) {
			console.log(error)
			return false
		}
	}

	addCollection = async (productId: number, userId: number) => {
		try {
			await this.knex('users_collection').insert({
				user_id: userId,
				product_id: productId
			})
			return true
		} catch (e) {
			console.log(e)
			return false
		}
	}

	getCollection = async (userId: number) => {
		let userCollection = await this.knex
			.select('*')
			.from('users_collection')
			.where('user_id', userId)
		if (userCollection.length === 0) {
			return 'no collection'
		}

		let result = await this.knex
			.join(
				'users_collection',
				'products.id',
				'=',
				'users_collection.product_id'
			)
			.select(
				'products.id',
				'product_name',
				'product_image',
				'product_company',
				'product_price'
			)
			.from('products')
			.where('user_id', userId)

		return result
	}

	removeCollection = async (productId: number, userId: number) => {
		try {
			await this.knex
				.select('*')
				.from('users_collection')
				.where('user_id', userId)
				.andWhere('product_id', productId)
				.del()
			return true
		} catch (e) {
			console.log(e)
			return false
		}
	}
}
