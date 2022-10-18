import {post} from "@/utils/request";

//登录请求
export const login = (options) => {
  return post(options.url,options.data)
}

//发送验证码
export const sendSMS = (options) => {
  return post(options.url,options.data)
}

//注册
export const register = (options) => {
  return post(options.url,options.data)
}

//查询用户
export const selectUser = (options) => {
  return post(options.url,options.data)
}