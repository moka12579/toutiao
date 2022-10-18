import {post} from "@/utils/request";

//获取文档详情
export const getDetail = (options) => {
  return post(options.url,options.data)
}

//获取评论列表
export const commentList = (options) => {
  return post(options.url,options.data)
}

//发布文章
export const publish = (options) => {
  return post(options.url,options.data)
}

//文章点赞和取消点赞
export const thumbsUp = (options) => {
  return post(options.url,options.data)
}

//文章收藏和取消收藏
export const collectionUp = (options) => {
  return post(options.url,options.data)
}

//评论文章或回复评论
export const comment = (options) => {
  return post(options.url,options.data)
}