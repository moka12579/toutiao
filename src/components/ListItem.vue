<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-tab :title="item.name" v-for="item in list" :key="item._id" ref="tab">
        <van-list
            v-model="loading"
            :finished="finish"
            finished-text="没有更多了"
            @load="onLoad"
            :error="err"
            error-text="加载出错，点击重新加载"
            :immediate-check="false"

        >
          <van-cell v-for="item1 in articleList" :key="item1._id" @click="$router.push(`/detail/${item1._id}`)">
            <div style="display: flex;" :class="[{'jus':item1.imageSrc.length === 1},{'flex':item1.imageSrc.length === 3}]">
              <div >{{item1.title}}</div>
              <div v-if="item1.imageSrc.length === 3" style="display: flex">
                <div v-for="(item2,index2) in item1.imageSrc" :key="index2">
                  <van-image
                      width="112"
                      height="70"
                      lazy-load
                      :src="item2"
                      referer="mokacui.work"
                  />
                </div>
              </div>
              <div v-else-if="item1.imageSrc.length === 1">
                <van-image
                    width="112"
                    height="70"
                    lazy-load
                    :src="item1.imageSrc[0]"
                    referer="mokacui.work"
                />
              </div>
            </div>
            <div style="display: flex;justify-content: space-between;font-size: 12px;text-align: left" >
              <span style="width: 100px;overflow: hidden;text-overflow:ellipsis;white-space:nowrap;">作者：{{item1.author}}</span>
              <span>{{item1.comment}}评论</span>
              <span>发布日期：{{new Date(item1.time).toLocaleDateString()}}</span>
            </div>
          </van-cell>
        </van-list>
      </van-tab>
    </van-pull-refresh>
  </div>
</template>

<script>
import {Search, Tabs, Tab, List, Cell, PullRefresh, Image} from "vant"
import {articleList, cateList, commentTotal} from "@/api/home";
import store from "@/store";
export default {
  name: "List",
  components:{
    [Search.name]:Search,
    [Tabs.name]:Tabs,
    [Tab.name]:Tab,
    [List.name]:List,
    [Cell.name]:Cell,
    [PullRefresh.name]:PullRefresh,
    [Image.name]:Image,
  },
  data(){
    return{
      list:[],
      articleList:[],
      loading:false,
      skip:0,
      finish:false,
      err: false,
      isLoading:false
    }
  },
  props:{
    active:{
      type:Number,
      default:0
    }
  },
  methods:{
    onLoad(){
      this.skip+=11
      this.data1(this.active,false)
    },
    data1(val,first){
      if (first)this.skip=0
      articleList({
        url:"/api/get_article_list",
        data:{
          cate_id:this.list[val]._id,
          skip:this.skip
        }
      }).then(response => {
        if (response.data.code === 0) {
          this.loading = false
          this.isLoading = false
          if (first) {
            this.articleList = response.data.data
          } else {
            if (response.data.data.length < 10) this.finish=true
            this.articleList=[...this.articleList,...response.data.data]
            this.$forceUpdate()
          }
        }
      }).catch(error => {
        this.err = true
        this.loading = false
      })
    },
    onRefresh(){
      this.data1(this.active,true)
      this.articleList = []
      this.loading = true
      this.err = false
    }
  },
  mounted() {
    cateList({
      url:"/api/get_cate_list"
    }).then(response => {
      if (response.data.code === 0){
        this.list = response.data.data
      }
    })
    store.state.done=true
  },
  watch:{
    active:{
      handler(val){
        this.err = false
        this.articleList = []
        this.loading=true
        this.finish=false
        let a=setInterval(() => {
          if (store.state.done){
            clearInterval(a)
            this.data1(val,true)
          }
        },1000)
      },
      immediate:true
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-cell{
  flex-direction: column;
  .van-cell__title{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
}
.jus{
  justify-content: space-between;
}
.flex{
  flex-direction: column;
}
</style>