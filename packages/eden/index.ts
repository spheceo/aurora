import { treaty } from '@elysiajs/eden'
import type { App } from '../../apps/api/index'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

const api = treaty<App>(apiUrl)

export { api }