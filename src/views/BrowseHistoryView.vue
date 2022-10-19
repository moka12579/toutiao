<template>
  <div>
    <van-nav-bar
        title="浏览历史"
        left-arrow
        class="navBar"
        @click-left="$router.back()"
    />
    <van-pull-refresh v-model="isLoading"  @refresh="onRefresh">
      <van-list
          v-model="loading"
          :finished="finish"
          finished-text="没有更多了"
          @load="onLoad"
          :error="err"
          error-text="加载出错，点击重新加载"
          :immediate-check="false"
      >
        <van-cell v-for="item1 in list" :key="item1._id" @click="$router.push(`/detail/${item1._id}`)">
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

    </van-pull-refresh>
  </div>
</template>

<script>
import {Cell, List, PullRefresh, Image, NavBar} from "vant";
import {publishHistory} from "@/api/user";
import store from "@/store";
export default {
  name: "BrowseHistoryView",
  components:{
    [PullRefresh.name]:PullRefresh,
    [List.name]:List,
    [Cell.name]:Cell,
    [Image.name]:Image,
    [NavBar.name]:NavBar
  },
  data(){
    return{
      isLoading:false,
      loading:false,
      finish:false,
      err:false,
      skip:0,
      list:[]
    }
  },
  methods:{
    onRefresh(){
      this.data1(this.active,true)
      this.articleList = []
      this.loading = true
      this.err = false
    },
    data1(first){
      let uid=JSON.parse(store.getters.user).uid
      if (first) this.skip = 0
      else this.skip+=11
      publishHistory({
        url:"/api/get_history_list",
        data:{
          uid,
          skip:this.skip
        }
      }).then(res => {
        this.loading=false
        if (res.data.data.length <= 10) this.finish=true
        if (res.data.code === 0){
          this.list = res.data.data
        }else{
          this.list = [...this.list,...res.data.data]

        }
      }).catch(err => {
        this.loading=false
        this.err=true
      })
    },
    onLoad(){
      this.data1(false)
    }
  },
  mounted() {
    this.loading=false
    this.data1(true)
  }
}
</script>

<style lang="scss" scoped>
.jus{
  justify-content: space-between;
}
.flex{
  flex-direction: column;
}
</style>