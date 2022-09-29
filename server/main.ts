import express from 'express'
import expressSession from 'express-session'
import { AIroutes } from './model/AI'
import { cartStripe } from './model/cart/cartStripe'
import { routes } from './routes'

const app = express()

app.use(
	expressSession({
		secret: 'secret',
		saveUninitialized: true,
		resave: true
	})
)

app.use('/stripeWebhook', cartStripe)


app.use((req, res, next) => {
	console.log(req.url)
	next()
})

app.use(express.static('../frontend/public'))
app.use(express.static('../frontend/private'))

app.use(express.urlencoded())
app.use(express.json())

app.use('/', routes)
app.use('/ai', AIroutes)


app.listen(8000, function () {
	console.log('Listening on port 8000')
})
