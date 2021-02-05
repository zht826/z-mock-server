interface AnyObj {
  [propsName: string]: any;
}

export interface MockOptions {
  /**
   * 接口地址
   * eg: https://test.abc.com
   */
  apiDomain: string;
  /**
   * 统一api前置，同webpack server的api拦截字段
   * eg: /api
   */
  apiBaseUrl: string;
  /**
   * 代理服务器端口，定义后项目中的webpack server请求该端口地址
   * eg: 3000
   */
  port: number;
  /**
   * 需要传递的header中的选项key
   * eg: ['Auth-Token']
   */
  headerConfig?: string[];
  /**
   * 正确的报文格式，用于判断返回数据是否正确
   * eg: { code: 200 }
   */
  rightDataTemplate: AnyObj,
  /**
   * 排除的报文格式
   * eg: { code: 402 }
   */
  excludeDataTemplate?: AnyObj,
  /**
   * 超时时间，目标服务器接口超过该时间未响应则认为报错，返回缓存数据
   * 默认：3000
   */
  timeout?: number;
}
