<template>
  <div class="footer">
    <div style="position: relative" @click="$store.state.showPopup=true">
      <i class="iconfont icon">&#xec7c;</i>
      <input type="text" placeholder="写评论..." class="xie" disabled="">
    </div>
    <div class="icons">
      <van-icon name="star-o" size="24" ref="collect" @click="collection($refs.collect)"/>
      <van-icon name="good-job-o" size="24" ref="good" @click="thumbs($refs.good)"/>
      <van-icon name="share-o" size="24" @click="$store.state.showShare=true"/>
    </div>
  </div>
</template>

<script>
import {Icon} from "vant";
import {startList} from "@/api/user";
import store from "@/store";

export default {
  name: "Footer",
  components:{
    [Icon.name]:Icon
  },
  props:{
    collection:{
      type:Function,
      required:true
    },
    thumbs:{
      type:Function,
      required:true
    }
  },
  mounted() {
    startList({
      url:'/api/get_fav_list',
      data:{
        user_id:JSON.parse(store.getters.user).userInfo._id
      }
    }).then(res => {
      let art = store.state.articleObj
      if (res.data.code === 0){
        let index = res.data.data.findIndex(v => v._id === art._id)
        if (index !== -1){
          this.$refs.collect.classList.replace("van-icon-star-o","van-icon-star")
        }
      }
    })

  }
}
</script>

<style lang="scss" scoped>
.footer{
  position: fixed;
  height: 35px;
  border-top: 1px solid #f4f4f4;
  width: 100vw;
  bottom: -1px;
  padding: 16px;
  background: white;
  display: flex;
  align-items: center;
}
.icon{
  position: absolute;
  top: 9.5px;
  left: 10px;
}
.xie{
  border-radius: 10px;
  background: #f3f3f3;
  outline: none;
  border: none;
  height: 35px;
  padding-left: 32px;
  width: 102px;
}
.icons{
  display: flex;
  justify-content: space-between;
  width: 200px;
  margin-left: 10px;
}
::v-deep .van-field__word-limit{
  position: absolute;
  right: 0;
  bottom: 0;
}
::v-deep .van-field__body{
  width: 100%;
}

</style>