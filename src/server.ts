import Koa from 'koa'
import axios, { Method } from 'axios'
import db from './db'
import bodyParser from 'koa-bodyparser'
import { JsonDB } from 'node-json-db'
import { AnyObj, MockOptions } from '../types'
import KoaStatic from 'koa-static'
class Server {
  app: Koa;
  options: MockOptions;
  db: JsonDB;
  constructor (options: MockOptions) {
    const app = new Koa()
    this.app = app
    this.options = options
    this.db = db(options.apiBaseUrl)
    app.use(bodyParser())
    app.use(KoaStatic('static'))
    app.use(async ({ request, response }, next) => {
      await next()
      if (request.path.includes(options.apiBaseUrl)) {
        let body = { data: { code: '0', msg: '', ...options.rightDataTemplate } }
        const headersConfig: AnyObj = {}
        options.headerConfig?.forEach(c => {
          request.header[c] && (headersConfig[c] = request.header[c])
        })
        try {
          body = await axios.request({
            url: options.apiDomain + request.url,
            method: request.method as Method,
            timeout: options.timeout || 3000,
            headers: {
              cookie: request.header.cookie,
              ...headersConfig
            },
            data: {
              ...request.body
            }
          })
        } catch (e) {
          console.log(e)
          body = {
            data: {
              code: '99999',
              msg: e
            }
          }
        }
        let rspData = body.data
        const sourceData = body.data
        if (this.checkBodyRight(body.data, options.rightDataTemplate)) {
          this.db.push(request.path, body.data)
        } else {
          try {
            rspData = this.db.getData(request.path) || sourceData
          } catch {
            rspData = sourceData
          }
        }
        response.body = {
          ...rspData,
          sourceData
        }
      } else {
        response.body = '接口不支持，请确认接口url'
      }
    })

    app.listen(options.port || 3000)
  }

  checkBodyRight (data: AnyObj, rightData: AnyObj | AnyObj[]): boolean {
    if (Array.isArray(rightData)) {
      return rightData.some(r => {
        return Object.keys(r).every(key => {
          return r[key] === data[key]
        })
      })
    } else {
      return Object.keys(rightData).every(key => {
        return rightData[key] === data[key]
      })
    }
  }
}

export default Server
