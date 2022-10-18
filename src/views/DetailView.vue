<template>
  <div>
    <van-nav-bar
        :title="title"
        left-arrow
        @click-left="$router.back()"
    />
    <h1 style="padding: 10px;word-break:break-all;">{{article.title}}</h1>
    <div style="padding: 10px;display: flex;justify-content: space-between">
      <div style="display: flex">
        <img :src="article.avatar" alt="" style="width: 37px;border-radius: 50%;margin-right: 8px">
        <div style="display: flex;flex-direction: column">
          <h4 style="margin: 0">{{article.nickname}}</h4>
          <span>{{new Date(article.time).toLocaleDateString()}}</span>
        </div>
      </div>
      <van-button type="default">关注</van-button>
    </div>
    <div style="padding: 10px;overflow: hidden;text-overflow:ellipsis;height: fit-content;white-space:pre-wrap;word-break:break-all;">
      {{article.content}}
    </div>
    <hr>
    <div style="display: flex;align-items: center;justify-content: space-between;padding: 10px">
      <h3>精彩评论</h3>
      <div style="color: #a19e9e;font-size: 14px">
        <span>{{article.fav}} 赞</span> | <span>{{article.like}} 收藏</span>
      </div>
    </div>
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error="err"
        error-text="加载出错，点击重新加载"
    >
      <van-cell v-for="item in list" :key="item._id">
        <div style="width: 160px;display: flex;justify-content: normal">
          <img :src="item.info.avatar" alt="" style="width: 30px;height: 30px;border-radius: 50%;margin-right: 10px">
          <div style="display: flex;flex-direction: column;">
            <span style="font-size: 14px;line-height: 30px">{{item.info.nickname}}</span>
            <span>{{item.content}}</span>
            <div style="display: flex">
              <div style="background: #f0f0f0;height: 25px;border-radius: 5px;padding: 0 10px;font-size: 12px">
                回复
                <van-icon name="arrow" style="display: inline-block;font-size: 12px"/>
              </div>
              <div style="margin-left: 8px">{{new Date(Date.now() - item.create_time).getDay()}} 天前</div>
            </div>
          </div>
        </div>
        <div>
          <van-icon name="thumb-circle-o" />
        </div>
      </van-cell>
    </van-list>
    <div class="footer">
      <div>
        <i class="iconfont icon">&#xec7c;</i>
        <input type="text" placeholder="写评论..." class="xie">
      </div>
      <div style="display: flex;justify-content: space-between;width: 205px">
        <van-icon name="chat-o" size="24"/>
        <van-icon name="star" size="24"/>
        <van-icon name="good-job" size="24"/>
        <van-icon name="share" size="24"/>
      </div>
    </div>
  </div>
</template>

<script>
import {commentList, getDetail} from "@/api/article";
import {Button, Cell, GoodsAction, Icon, List, NavBar} from "vant";

export default {
  name: "DetailView",
  components:{
    [NavBar.name]:NavBar,
    [Button.name]:Button,
    [List.name]:List,
    [Cell.name]:Cell,
    [Icon.name]:Icon,
  },
  data(){
    return{
      title:"",
      article:{},
      list:[],
      arr:[],
      loading:false,
      finished:false,
      err:false
    }
  },
  methods:{
    data1(){
      commentList({
        url:"/api/get_comment_list",
        data:{
          article_id:this.arr[this.arr.length-1]
        }
      }).then(response => {
        this.loading=false
        if (response.data.code === 0){
          if (response.data.count < 10)this.finished=true
          this.list = response.data.data
        }
      }).catch(error => {
        this.err=true
        this.loading=false
      })
    },
    onLoad() {

    }
  },
  mounted() {
    this.loading=true
    this.arr = location.pathname.split("/")
    getDetail({
      url:"/api/get_article_detail",
      data:{
        article_id:this.arr[this.arr.length-1]
      }
    })
        .then(response => {
      if (response.data.code === 0){
        this.title = response.data.data.title
        this.article = {...response.data.data}
        console.log(response)
      }
    })
    this.data1()
  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-cell__value{
  display: flex;
  justify-content: space-between;
}
.footer{
  position: fixed;
  height: 35px;
  border-top: 1px solid #f4f4f4;
  width: 100vw;
  bottom: -1px;
  padding: 16px;
  background: white;
  display: flex;
  align-items: center;
}
.icon{
  position: absolute;
  top: 24.5px;
  left: 25px;
}
.xie{
  border-radius: 10px;
  background: #f3f3f3;
  outline: none;
  border: none;
  height: 35px;
  padding-left: 32px;
  width: 102px;
}
</style>