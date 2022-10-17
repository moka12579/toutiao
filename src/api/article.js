import {post} from "@/utils/request";

//获取文档详情
export const getDetail = (options) => {
  return post(options.url,options.data)
}

//获取评论列表
export const commentList = (options) => {
  return post(options.url,options.data)
}