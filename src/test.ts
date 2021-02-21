import Server from './server'
import { MockOptions } from '../types/index'
const options: MockOptions = {
  apiDomain: 'https://abc.com',
  apiBaseUrl: '/api',
  headerConfig: ['auth-token'],
  port: 3001,
  rightDataTemplate: {
    code: '0'
  }
}
const mockServer = new Server(options)
console.log(mockServer)
