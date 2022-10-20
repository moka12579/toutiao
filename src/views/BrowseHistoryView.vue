<template>
  <div>
    <van-nav-bar
        title="浏览历史"
        left-arrow
        class="navBar"
        @click-left="$router.back()"
    />
    <van-pull-refresh v-model="isLoading"  @refresh="onRefresh">
      <ListItem
        :article-list="list"
        :finish="finish"
        :err="err"
        :on-load="onLoad"
      />
    </van-pull-refresh>
  </div>
</template>

<script>
import {Cell, List, PullRefresh, Image, NavBar} from "vant";
import {publishHistory} from "@/api/user";
import store from "@/store";
import ListItem from "@/components/ListItem";
export default {
  name: "BrowseHistoryView",
  components:{
    [PullRefresh.name]:PullRefresh,
    [List.name]:List,
    [Cell.name]:Cell,
    [Image.name]:Image,
    [NavBar.name]:NavBar,
    ListItem
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
        store.state.loading=false
        if (res.data.data.length <= 10) this.finish=true
        if (res.data.code === 0){
          this.list = res.data.data
        }else{
          this.list = [...this.list,...res.data.data]

        }
      }).catch(err => {
        store.state.loading=false
        this.err=true
      })
    },
    onLoad(){
      this.data1(false)
    }
  },
  mounted() {
    store.state.loading=true
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