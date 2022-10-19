import {post} from "@/utils/request";

//搜索
export const search = (options) => {
  return post(options.url,options.data)
}