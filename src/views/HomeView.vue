<template>
  <div>
    <van-search disabled background="#8fc92a" placeholder="搜索你想看到的" @click="$router.push('/search')"/>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-tabs v-model="$store.state.active" animated>
        <van-tab :title="item.name" v-for="item in list" :key="item._id">
          <ListItem
              :err="err"
              :articleList="articleList"
              :finish="finish"
              :on-load="onLoad"
          />
        </van-tab>
      </van-tabs>
    </van-pull-refresh>
    <TabBar :active="0"/>
  </div>
</template>

<script>
import TabBar from "@/components/TabBar";
import ListItem from "@/components/ListItem";
import {PullRefresh, Search, Tab, Tabs} from "vant";
import {articleList, cateList} from "@/api/home";
import store from "@/store";

export default {
  name: "HomeViews",
  components:{
    TabBar,
    ListItem,
    [Tabs.name]:Tabs,
    [Search.name]:Search,
    [PullRefresh.name]:PullRefresh,
    [Tab.name]:Tab
  },
  data(){
    return{
      searchValue:"",
      active:0,
      list:[],
      loading:false,
      err:false,
      finish:false,
      isLoading:false,
      articleList:[],
      skip:0
    }
  },
  mounted() {
    cateList({
      url:"/api/get_cate_list"
    }).then(response => {
      if (response.data.code === 0){
        this.list = response.data.data
        this.$forceUpdate()
        this.data1(true)
      }
    })
    store.state.done=true
  },
  methods:{
    onLoad(){
      this.data1(false)
    },
    data1(first){
      let val = store.state.active
      if (first)this.skip=0
      else this.skip+=11
      articleList({
        url:"/api/get_article_list",
        data:{
          cate_id:this.list[val]._id,
          skip:this.skip
        }
      }).then(response => {
        store.state.loading = false
        if (response.data.code === 0) {
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
        store.state.loading = false
      })
    },
    onRefresh(){
      this.data1(this.active,true)
      this.articleList = []
      store.state.loading = true
      this.finish = false
    }
  },
  watch:{
    '$store.state.active'(){
      this.skip=0
      this.articleList=[]
      this.data1(true)
      store.state.loading=true
      this.finish=false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-search__content{
  border-radius: 10px;
}
::v-deep .van-field__control::-webkit-input-placeholder{
  text-align: center;
}
::v-deep .van-icon-search{
  display: none;
}
</style>