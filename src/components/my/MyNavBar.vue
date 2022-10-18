<template>
  <div>
    <van-nav-bar
        title="我的"
    >
      <template #right>
        <van-icon name="chat-o" style="margin-right: 10px"/>
        <van-icon name="setting-o" />
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
import {Icon, NavBar} from "vant";

export default {
  name: "MyNavBar",
  components:{
    [NavBar.name]:NavBar,
    [Icon.name]:Icon
  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-icon{
  font-size: 20px;
  color: #000;
}
</style>