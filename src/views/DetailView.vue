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
    <div v-for="(item,index) in article.imageSrc" :key="index">
      <van-image
          fit="contain"
          :src="item"
          class="image"
      />
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
              <div style="background: #f0f0f0;height: 25px;border-radius: 5px;padding: 0 10px;font-size: 12px" @click="showPopover=true" >
                回复
                <van-icon name="arrow" style="display: inline-block;font-size: 12px"/>
              </div>
              <div style="margin-left: 8px">{{new Date(item.create_time).toLocaleDateString()}}</div>
            </div>
            <van-popover
                v-model="showPopover"
                trigger="click"
                placement="bottom-start"
            >
              <template #default>
                <van-field
                    v-model="text"
                    type="textarea"
                    maxlength="1000"
                    show-word-limit
                    rows="5"
                    placeholder="留下你的评论..."
                    autosize
                />
                <van-button
                    type="primary"
                    style="width: 100%;margin-top: 8px"
                    @click="sendComment(false,item._id)"
                >
                  发送评论
                </van-button>
              </template>
            </van-popover>
          </div>
        </div>
        <div>
          <van-icon ref="commentGood" name="good-job-o" @click="commentThumbs(item._id)" />
        </div>
      </van-cell>
    </van-list>
    <div class="footer">
      <div style="position: relative" @click="show=true">
        <i class="iconfont icon">&#xec7c;</i>
        <input type="text" placeholder="写评论..." class="xie" disabled="">
      </div>
      <div class="icons">
        <van-icon name="star-o" size="24" ref="collect" @click="collection"/>
        <van-icon name="good-job-o" size="24" ref="good" @click="thumbs"/>
        <van-icon name="share-o" size="24" @click="showShare=true"/>
      </div>
    </div>
    <van-popup v-model="show" position="bottom" :style="{ height: '30%' }">
      <van-field
          v-model="text"
          type="textarea"
          maxlength="1000"
          show-word-limit
          rows="5"
          placeholder="留下你的评论..."
          autosize
      />
      <van-button type="primary" style="width: 100%;margin-top: 8px" @click="sendComment(true)">发送评论</van-button>
    </van-popup>
    <van-share-sheet
        v-model="showShare"
        title="立即分享给好友"
        :options="options"
    />
  </div>
</template>

<script>
import {collectionUp, comment, commentList, getDetail, thumbsUp} from "@/api/article";
import {Button, Cell, Field, Icon, List, NavBar, Popup, Toast, Image, ShareSheet, Popover} from "vant";
import store from "@/store";

export default {
  name: "DetailView",
  components:{
    [NavBar.name]:NavBar,
    [Button.name]:Button,
    [List.name]:List,
    [Cell.name]:Cell,
    [Icon.name]:Icon,
    [Popup.name]:Popup,
    [Field.name]:Field,
    [Button.name]:Button,
    [Image.name]:Image,
    [ShareSheet.name]:ShareSheet,
    [Popover.name]:Popover
  },
  data(){
    return{
      title:"",
      article:{},
      list:[],
      arr:[],
      loading:false,
      finished:false,
      err:false,
      skip:0,
      article_id:"",
      comment:"",
      show:false,
      text:"",
      user_id:JSON.parse(store.state.user).userInfo._id,
      showShare:false,
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '微博', icon: 'weibo' },
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' },
      ],
      showPopover:false
    }
  },
  methods:{
    data1(first){
      if (first) this.skip=0
      else this.skip+=11
      commentList({
        url:"/api/get_comment_list",
        data:{
          article_id:this.article_id,
          skip:this.skip
        }
      }).then(response => {
        this.loading=false
        if (response.data.code === 0){
          if (response.data.count < 10)this.finished=true
          if (first){
            this.list = response.data.data
          }else{
            this.list = [...this.list,...response.data.data]
            this.$forceUpdate()
          }
        }
      }).catch(error => {
        this.err=true
      })
    },
    onLoad() {
      this.loading=true
      this.data1(false)
    },
    thumbs(){
      let url="/api/unlike"
      let good = this.$refs.good
      if (good.classList[1].indexOf("-o") !== -1)url="/api/like"
      thumbsUp({
        url,
        data:{
          user_id:this.user_id,
          article_id:this.article_id
        }
      }).then(res => {
        if (res.data.code === 0){
          Toast.success(res.data.msg)
          if (good.classList[1].indexOf("-o") !== -1)
            good.classList.replace("van-icon-good-job-o","van-icon-good-job")
          else
            good.classList.replace("van-icon-good-job","van-icon-good-job-o")
        }else{
          Toast.fail(res.data.msg)
        }
      })
    },
    collection(){
      let url="/api/remove_fav"
      let coll = this.$refs.collect
      if (coll.classList[1].indexOf("-o") !== -1)
        url = "/api/add_fav"
      collectionUp({
        url,
        data:{
          user_id:this.user_id,
          article_id:this.article_id
        }
      }).then(res => {
        if (res.data.code === 0){
          Toast.success(res.data.msg)
          if (coll.classList[1].indexOf("-o") !== -1)
            coll.classList.replace("van-icon-star-o","van-icon-star")
          else
            coll.classList.replace("van-icon-star","van-icon-star-o")
        }else{
          Toast.fail(res.data.msg)
        }
      })
    },
    sendComment(isArticle,id){
      this.show=false
      this.showPopover=false
      let data={
        user_id:this.user_id,
        article_id:this.article_id,
        content:this.text
      }
      if (isArticle) data.comment_type = 0
      else {
        data.comment_type = 1
        data.reply_comment_id = id
      }
      comment({
        url: "/api/add_comment",
        data
      }).then(res => {
        if (res.data.code === 0){
          Toast.success(res.data.msg)
        }else{
          Toast.fail(res.data.msg)
        }
      })

    },
    commentThumbs(id){
      let comment = this.$refs.commentGood[0]
      let url="/api/comment_unlike"
      if (comment.classList[1].indexOf("-o") !== -1) url="/api/comment_like"
      thumbsUp({
        url,
        data:{
          user_id:this.user_id,
          comment_id:id
        }
      }).then(res => {
        if (res.data.code === 0){
          Toast.success(res.data.msg)
          if (comment.classList[1].indexOf("-o") !== -1)
            comment.classList.replace("van-icon-good-job-o","van-icon-good-job")
          else
            comment.classList.replace("van-icon-good-job","van-icon-good-job-o")
        }else{
          Toast.fail(res.data.msg)
        }
      })
    }
  },
  mounted() {
    this.loading=true
    this.arr = location.pathname.split("/")
    this.article_id = this.arr[this.arr.length-1]
    getDetail({
      url:"/api/get_article_detail",
      data:{
        article_id:this.article_id
      }
    }).then(response => {
      if (response.data.code === 0){
        this.title = response.data.data.title
        this.article = {...response.data.data}
        console.log(response)
      }
    })
    this.data1(true)
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
  top: 9.5px;
  left: 10px;
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
.icons{
  display: flex;
  justify-content: space-between;
  width: 200px;
  margin-left: 10px;
}
::v-deep .van-field__word-limit{
  position: absolute;
  right: 0;
  bottom: 0;
}
::v-deep .van-field__body{
  width: 100%;
}
</style>