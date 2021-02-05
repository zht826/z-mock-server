import Server from './server'
import { MockOptions } from '../types'

exports.MockServer = (options: MockOptions) => new Server(options)
