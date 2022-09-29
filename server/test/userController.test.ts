import { UserService } from '../model/user/userService'
import { knex } from '../db'
import { checkPassword } from '../hash'
describe('userServe', () => {
	beforeAll(
		async () =>
			await knex.migrate
				.rollback()
				.then(() => knex.migrate.latest().then(() => knex.seed.run()))
	)
	// afterEach(() =>
	// 	knex.migrate
	// 		.rollback()
	// 		.then(() => knex.migrate.latest().then(() => knex.seed.run()))
	// )

	// login test----------------------------------------------------------------------------
	it('can login', async () => {
		//Arrange
		const userServices = new UserService(knex)
		let account = 'admin1'
		let password = '123'

		//Act
		const user: any = await userServices.login(account, password)
		console.log(user[0].password)

		//Assert

		expect(user[0].account).toBe('admin1')
		expect(await checkPassword('123', `${user[0].password}`)).toBe(true)
	})

	it("can't login", async () => {
		//Arrange
		const userServices = new UserService(knex)
		let account = 'admain1'
		let password = 'asd'

		//Act
		const user: any = await userServices.login(account, password)

		//Assert
		expect(user).toBe(null)
	})

	it('empty login', async () => {
		//Arrange
		const userServices = new UserService(knex)
		let account = ''
		let password = ''

		//Act
		const user: any = await userServices.login(account, password)

		//Assert
		expect(user).toBe(null)
	})

	// register test----------------------------------------------------------------------------
	it('can register', async () => {
		//Arrange
		const userServices = new UserService(knex)
		let account = 'admin4'
		let password = '123'

		//Act
		const user = await userServices.register(account, password)

		//Assert
		expect(user).toBe(true)
	})

	it("can't register", async () => {
		//Arrange
		const userServices = new UserService(knex)
		let account = 'admin3'
		let password = '123'

		//Act
		const user = await userServices.register(account, password)

		//Assert
		expect(user).toBe(false)
	})

	it('empty register', async () => {
		//Arrange
		const userServices = new UserService(knex)
		let account = ''
		let password = ''

		//Act
		const user = await userServices.register(account, password)

		//Assert
		expect(user).toBe(false)
	})

	it('can show', async () => {
		//Arrange
		const userServices = new UserService(knex)
		let userId = 1

		//Act
		const user = await userServices.showUserInfo(userId)

		if (user[0]) {
			//Assert
			expect(user[0][0].id).toBe(1)
		}
	})

	it(`can't show`, async () => {
		//Arrange
		const userServices = new UserService(knex)
		let userId = 0

		//Act
		const user = await userServices.showUserInfo(userId)

		if (user[0]) {
			//Assert
			expect(user[0][0].id).toBe(null)
		}
	})

	it(`can edit`, async () => {
		//Arrange
		const userServices = new UserService(knex)
		let userId = 1
		let email = 'asd'
		let userName = 'user2'
		let phoneNumber = 12345679
		let gender = 'F'

		//Act
		const isEdit = await userServices.editUserInfo(
			userId,
			email,
			userName,
			phoneNumber,
			gender
		)

		//Assert
		expect(isEdit).toBe(true)
	})

	it(`can add collection`, async () => {
		//Arrange
		const userServices = new UserService(knex)
		let userId = 1
		let productId = 1

		//Act
		const result = await userServices.addCollection(userId, productId)

		//Assert
		expect(result).toBe(true)
	})

	it(`can't add collection`, async () => {
		//Arrange
		const userServices = new UserService(knex)
		let userId = 0
		let productId = 1

		//Act
		const result = await userServices.addCollection(userId, productId)

		//Assert
		expect(result).toBe(false)
	})

	it(`can get collection`, async () => {
		//Arrange
		const userServices = new UserService(knex)
		let userId = 1

		//Act
		const result: any = await userServices.getCollection(userId)

		//Assert
		expect(result[0].id).toBe(1)
	})

	it(`can't get collection`, async () => {
		//Arrange
		const userServices = new UserService(knex)
		let userId = 2

		//Act
		const result = await userServices.getCollection(userId)

		//Assert
		expect(typeof result).toBe('string')
	})

	it(`can delete collection`, async () => {
		//Arrange
		const userServices = new UserService(knex)
		let userId = 1
		let productId = 1
		//Act
		const result = await userServices.removeCollection(productId, userId)

		//Assert
		expect(result).toBe(true)
	})

	afterAll(async () => {
		await knex.destroy()
	})
})
