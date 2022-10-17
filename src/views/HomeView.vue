<template>
  <div>
    <van-search disabled background="#8fc92a" placeholder="搜索你想看到的" />
    <van-tabs v-model="active">
      <ListItem :active="active"/>
    </van-tabs>
    <TabBar :active="0"/>
  </div>
</template>

<script>
import TabBar from "@/components/TabBar";
import ListItem from "@/components/ListItem";
import {Search, Tabs} from "vant";

export default {
  name: "HomeViews",
  components:{
    TabBar,
    ListItem,
    [Tabs.name]:Tabs,
    [Search.name]:Search
  },
  data(){
    return{
      searchValue:"",
      active:0
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