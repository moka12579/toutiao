import {get, post} from "@/utils/request"
//获取全部数据

export const cateList = (options) => {
  return get(options.url)
}

//获取分类的文章
export const articleList = (options) => {
  return post(options.url,options.data)
}

//获取文章评论总数
export const commentTotal = (options) => {
  return post(options.url,options.data)
}