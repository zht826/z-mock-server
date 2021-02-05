import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

export default (separator?: string) => new JsonDB(new Config('./.db/myDataBase', true, false, separator || '/'))
