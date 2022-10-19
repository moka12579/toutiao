<template>
  <div>
    <Article :title="title" :articleObj="article"/>
    <ArticleComment
        :article_id="article_id"
        :user_id="user_id"
        :send-comment="sendComment"
        :comment-thumbs="commentThumbs"
        :comment-list1="commentList1"
        :list="$store.state.list"
        :on-load="onLoad"/>
    <Footer
      :collection="collection"
      :thumbs="thumbs"
    />
    <Comment :send-comment="sendComment"/>
    <van-share-sheet
        v-model="$store.state.showShare"
        title="立即分享给好友"
        :options="options"
    />
    <ReplyComment
        :comment-obj="commentObj"
        :comment-thumbs="commentThumbs"
        :on-load="onLoad"
        :list="list1"
        :info="info"
    />
  </div>
</template>

<script>
import {collectionUp, comment, commentList, getDetail, thumbsUp} from "@/api/article";
import {Toast, ShareSheet} from "vant";
import store from "@/store";
import Article from "@/components/detail/Article";
import ArticleComment from "@/components/detail/ArticleComment";
import Comment from "@/components/detail/Comment";
import Footer from "@/components/detail/Footer";
import ReplyComment from "@/components/detail/ReplyComment";

export default {
  name: "DetailView",
  components:{
    [ShareSheet.name]:ShareSheet,
    Article,
    ArticleComment,
    Comment,
    Footer,
    ReplyComment
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
      skip1:0,
      show1:false,
      commentObj:{},
      info:{},
      list1:[]
    }
  },
  methods:{
    data1(first){
      if (first) this.skip=0
      else this.skip+=10
      commentList({
        url:"/api/get_comment_list",
        data:{
          article_id:this.article_id,
          skip:this.skip
        }
      }).then(response => {
        if (response.data.code === 0){
          store.state.comment.commentLoading=false
          if (response.data.data.length <= 10)
            store.state.comment.commentFinished=true
          if (first){
            this.list = response.data.data
            store.state.list = this.list
          }else{
            this.list = [...this.list,...response.data.data]
            store.state.list = this.list
            this.$forceUpdate()
          }
          this.list.forEach(item => item.showPopover=false)
        }
      }).catch(error => {
        store.state.comment.commentErr=true
      })
    },
    onLoad() {
      store.state.comment.commentLoading=true
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
    sendComment(content,isArticle,item){

      this.show=false
      if(!isArticle){
        let index = store.state.list.findIndex(v => v._id === item._id)
        if (index !== -1) store.state.list[index].showPopover=false
        store.state.showPopup=false
      }
      let data={
        user_id:this.user_id,
        article_id:this.article_id,
        content
      }
      if (isArticle) data.comment_type = 0
      else {
        data.comment_type = 1
        data.reply_comment_id = item._id
      }
      comment({
        url: "/api/add_comment",
        data
      }).then(res => {
        store.state.showPopup=false
        if (res.data.code === 0){
          Toast({
            type:"success",
            message:res.data.msg,
            onClose:() => {
              store.state.comment.commentLoading=true
              store.state.comment.commentFinished=false
              store.state.list=[]
              this.data1(true)
            }
          })
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
    },
    commentList1(item,first){
      this.commentObj=item
      this.info = item.info
      this.show1=true
      this.list1=[]
      store.state.reply.replyLoading=true
      store.state.showReplyComment=true
      store.state.reply.replyFinished=false
      if (first) this.skip1=0
      else this.skip1+=11
      commentList({
        url: "/api/get_reply_list",
        data:{
          skip:this.skip1,
          reply_comment_id:item._id,
        }
      }).then(res => {
        store.state.reply.replyLoading=false
        if (res.data.code === 0){
          if (res.data.data.length <= 10) store.state.reply.replyFinished=true
          if (first){
            this.list1 = res.data.data
          }
          else{
            this.list1 = [...this.list1,...res.data.data]
          }
        }
      }).catch(err => {
        store.state.replyErr=true
      })
    }
  },
  mounted() {
    store.state.comment.commentLoading=true
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
      }
    })
    this.data1(true)
  }
}
</script>

<style lang="scss" scoped>

</style>