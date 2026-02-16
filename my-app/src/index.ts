import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { blogRouter } from './modules/blogs/router.js'


const app = new Hono()
.route("/blogs", blogRouter)

serve({
  fetch: app.fetch,
  port: 8000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
