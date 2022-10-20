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

//发布历史
export const publishHistory = (options) => {
  return post(options.url,options.data)
}

//收藏列表
export const startList = (options) => {
  return post(options.url,options.data)
}

//忘记密码
export const forget = (options) => {
  return post(options.url,options.data)
}

//修改密码
export const updatePwd = (options) => {
  return post(options.url,options.data)
}

//修改个人信息
export const updateInfos = (options) => {
  return post(options.url,options.data)
}
