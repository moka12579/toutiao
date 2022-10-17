<template>
  <van-tabbar v-model="active1" route active-color="#e54b43" placeholder>
    <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item to="/publishArticle" icon="add-o">发布</van-tabbar-item>
    <van-tabbar-item to="/my" icon="user-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script>
import {Tabbar,TabbarItem} from "vant"
export default {
  name: "TabBar",
  components:{
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  props:["active"],
  data(){
    return{
      active1:this.active
    }
  }
}
</script>

<style scoped>

</style>