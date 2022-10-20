<template>
  <div>
    <van-nav-bar
        :title="title"
        left-arrow
        class="navBar"
        @click-left="$router.back()"
    />
    <van-pull-refresh v-model="isLoading"  @refresh="onRefresh">
      <ListItem
       :article-list="list"
       :finish="finish"
       :is-loading="isLoading"
       :err="err"
       :delete-article="deleteArticle"
       :on-load="onLoad"/>
    </van-pull-refresh>
  </div>
</template>

<script>
import {Cell, List, PullRefresh, Image, NavBar, Toast, Dialog} from "vant";
import {deleteArt, publishHistory} from "@/api/user";
import store from "@/store";
import ListItem from "@/components/ListItem";

export default {
  name: "PublishHistoryView",
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
      list:[],
      uid:JSON.parse(store.getters.user).uid,
      title:this.$route.path === "/browseHistory" ? "浏览历史" : "已发布"
    }
  },
  methods:{
    onRefresh(){
      this.data1(true)
      this.list = []
      store.state.loading = true
      this.err = false
    },
    data1(first){
      if (first) this.skip = 0
      else this.skip+=11
      let url=this.$route.path === "/browseHistory" ? "/api/get_history_list" : "/api/get_user_article_list"
      publishHistory({
        url,
        data:{
          uid:this.uid,
          skip:this.skip
        }
      }).then(res => {
        this.isLoading=false
        store.state.loading=false
        if (res.data.data.length <= 10) this.finish=true
        if (res.data.code === 0){
          this.list = res.data.data
        }else{
          this.list = [...this.list,...res.data.data]
        }
      }).catch(err => {
        this.isLoading=false
        this.loading=false
        this.err=true
      })
    },
    deleteArticle(item){
      Dialog.confirm({
        title: '确定要删除吗？',
      }).then(() => {
        deleteArt({
          url:"/api/del_user_article",
          data:{
            _id:item._id,
            uid:this.uid
          }
        }).then(res => {
          if (res.data.code === 0){
            Toast.success(res.data.msg)
            this.list=[]
            store.state.loading=true
            this.finish=false
            this.data1(true)
          }else{
            Toast.fail(res.data.msg)
          }
        })
      }).catch(() => {
        // on cancel
      });
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