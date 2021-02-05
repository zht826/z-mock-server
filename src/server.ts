import Koa from 'koa'
import axios from 'axios'
import db from './db'
import bodyParser from 'koa-bodyparser'
import { JsonDB } from 'node-json-db'
import { AnyObj, MockOptions } from '../types'

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
    app.use(async ({ request, response }, next) => {
      await next()
      if (request.method !== 'POST') {
        response.body = '暂时仅支持POST请求方式'
        return
      }
      if (request.path.includes(options.apiBaseUrl)) {
        let body = { data: { code: '0', msg: '', ...options.rightDataTemplate } }
        const headersConfig: AnyObj = {}
        options.headerConfig?.forEach(c => {
          request.header[c] && (headersConfig[c] = request.header[c])
        })
        try {
          body = await axios.request({
            url: options.apiDomain + request.path,
            method: 'POST',
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
              msg: '服务器出错了，我是代理返回的'
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

  checkBodyRight (data: AnyObj, rightData: AnyObj): boolean {
    return Object.keys(rightData).every(key => {
      return rightData[key] === data[key]
    })
  }
}

export default Server
