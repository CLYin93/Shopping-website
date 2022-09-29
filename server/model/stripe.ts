import  Stripe  from 'stripe'

export const stripe = new Stripe(
	'sk_test_51LV88HJ1L0gHuQn0k46v9Y46MlaEx4HvjUqfnHn0vYeyg8tbqon96E5rUtLYYj9X0LSH6ZzpmFMqlQ657dW5rqYz00sqVvWJo4',
	{
		apiVersion: '2022-08-01'
	}
)

// stripe listen --forward-to localhost:8000/stripeWebhook/webhook