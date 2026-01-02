import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'
import "dotenv/config"

const app = new Elysia({ adapter: node() })
	.get('/', () => 'Hello Elysia')

export default app
export type App = typeof app

// Only listen in development (for local testing)
if (process.env.NODE_ENV !== 'production') {
	app.listen(8080, ({ hostname, port }) => {
		console.log(`🦊 Elysia is running at ${hostname}:${port}`)
	})
}