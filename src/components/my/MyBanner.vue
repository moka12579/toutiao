<template>
  <div class="banner">
    <div class="up">
      <div style="display: flex;align-items: center">
        <img src="http://toutiao.longxiaokj.com/1635908337872_9r24h3e9vq4.image/svg+xml" alt="">
        <div style="font-size: 4.27vw;margin-left: 2.13vw">
          {{JSON.parse($store.state.user).userInfo.username}}
        </div>
      </div>
      <div style="color: #908d8d">
        个人主页
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="down">
      <ul>
        <li>
          <span>{{JSON.parse($store.state.user).publish_num}}</span>
          <span>已发布</span>
        </li>
        <li>
          <span>{{JSON.parse($store.state.user).liked_num}}</span>
          <span>已点赞</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {Icon} from "vant";

export default {
  name: "MyBanner",
  components:{
    [Icon.name]:Icon
  }
}
</script>

<style lang="scss" scoped>
.banner{
  padding: 30px 15px;
  .up{
    display: flex;
    align-items: center;
    justify-content: space-between;
    img{
      width: 65px;
      height: 65px;
    }
    div{
      font-size: 12px;
    }
  }
  .down{
    margin-top: 16px;
    ul{
      display: flex;
      justify-content: space-around;
    }
    li{
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>