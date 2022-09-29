import express from 'express'
import { UserService } from './userService'

export class UserController {
	constructor(private userService: UserService) {}

	login = async (req: express.Request, res: express.Response) => {
		try {
			let account = req.body.account.trim()
			let passWord = req.body.password.trim()

			let user = await this.userService.login(account, passWord)

			if (user != null) {
				req.session['isUser'] = true
				req.session['userInfo'] = user[0]
				res.json({ result: 'successful login' })
			} else {
				res.json({ result: 'incorrect account or password' })
			}
		} catch (e) {
			console.log(e)
			res.json({ result: 'Internal Server Error' })
		}
	}

	register = async (req: express.Request, res: express.Response) => {
		try {
			let account = req.body.account.trim()
			let passWord = req.body.password.trim()
			if (account == '' || passWord == '') {
				res.json('enter account and passWord')
			}
			let isRegister: boolean = await this.userService.register(
				account,
				passWord
			)
			if (isRegister) {
				res.json({ result: 'successful register' })
			} else {
				res.json({ result: 'repeated username' })
			}
		} catch (e) {
			console.log(e)
			res.status(500).send({ result: 'Internal Server Error' })
		}
	}
	async loginGoogle(req: express.Request, res: express.Response) {
		const accessToken = req.session?.['grant'].response.access_token
		const [user, userName] = await this.userService.loginGoogle(accessToken)

		if (req.session) {
			req.session['isUser'] = true
			req.session['userInfo'] = user
			res.redirect('/index.html')
			console.log(userName)
			return
		}
		return res.redirect('/')
	}

	logout = async (req: express.Request, res: express.Response) => {
		req.session['isUser'] = false
		req.session['user'] = null
		res.json({ result: 'loggedOut' })
	}

	isLogin = async (req: express.Request, res: express.Response) => {
		if (req.session['isUser']) {
			res.json(req.session['isUser'])
		} else {
			req.session['isUser'] = false
			res.json(req.session['isUser'])
		}
	}

	showUserInfo = async (req: express.Request, res: express.Response) => {
		// user address,invoice,
		if (req.session['userInfo']) {
			let userId = parseInt(req.session['userInfo'].id)
			let user = await this.userService.showUserInfo(userId)

			res.json(user)
		} else {
			res.json('邊條7頭未登入就沖入黎!!!')
		}
	}
	editUserInfo = async (req: express.Request, res: express.Response) => {
		// edit user address
		if (req.session['userInfo']) {
			let userId = parseInt(req.session['userInfo'].id)
			let email = req.body.email.trim()
			let userName = req.body.userName.trim()
			let phoneNumber = req.body.phoneNumber.trim()
			let gender = req.body.gender

			let isInsert: boolean = await this.userService.editUserInfo(
				userId,
				email,
				userName,
				phoneNumber,
				gender
			)
			res.json({ isUpdate: isInsert })
		} else {
			res.json('邊條7頭未登入就沖入黎!!!')
		}
	}

	addCollection = async (req: express.Request, res: express.Response) => {
		if (req.session['userInfo']) {
			let productId = parseInt(req.body.productId)
			let userId = parseInt(req.session['userInfo'].id)

			let isAdded = await this.userService.addCollection(
				productId,
				userId
			)
			res.json({ isAdded: isAdded })
		} else {
			res.json('邊條7頭未登入就沖入黎!!!')
		}
	}

	getCollection = async (req: express.Request, res: express.Response) => {
		if (req.session['userInfo']) {
			let userId = parseInt(req.session['userInfo'].id)

			let result = await this.userService.getCollection(userId)
			res.json(result)
		} else {
			res.json('邊條7頭未登入就沖入黎!!!')
		}
	}

	removeCollection = async (req: express.Request, res: express.Response) => {
		if (req.session['userInfo']) {
			let productId = parseInt(req.body.productId)
			let userId = parseInt(req.session['userInfo'].id)

			let isDelete = await this.userService.removeCollection(
				productId,
				userId
			)
			res.json({ isDelete: isDelete })
		} else {
			res.json('邊條7頭未登入就沖入黎!!!')
		}
	}
}
