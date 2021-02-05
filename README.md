# z-mock-server

## 缓存数据服务
### 缓存

``` typescript
// import MockServer from './src/index'
import MockServer from 'z-mock-server'
import { MockOptions } from './types'
const options: MockOptions = {
  apiDomain: 'https://abc.com',
  apiBaseUrl: '/api',
  headerConfig: ['auth-token'],
  port: 3000,
  rightDataTemplate: {
    code: '0'
  }
}
MockServer(options)
```
