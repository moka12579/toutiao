import {get, post} from "@/utils/request";

//获取token
export const getToken = (options) => {
  return get(options.url)
}

//上传文件
export const upload = (options) => {
  return post(options.url,options.data)
}