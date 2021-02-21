
import Koa from 'koa'
export const pages: Koa.Middleware = async ({ request, response }, next) => {
  await next()
  if (request.path === '/manage') {
    response.body = 1
  }
}
