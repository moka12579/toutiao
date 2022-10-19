<template>
  <van-popup v-model="$store.state.showReplyComment" position="bottom" :style="{ height: '70%' }" style="padding: 3.2vw;box-sizing: border-box" closeable>
    <div style="width: 100%;display: flex;justify-content: normal">
      <img :src="info.avatar" alt="" style="width: 30px;height: 30px;border-radius: 50%;margin-right: 10px">
      <div style="display: flex;flex-direction: column;">
        <span style="font-size: 14px;line-height: 30px">{{info.nickname}}</span>
        <span style="padding-right: 5.33vw">{{commentObj.content}}</span>
      </div>
    </div>
    <hr>
    <van-list
        v-model="$store.state.reply.replyLoading"
        :finished="$store.state.reply.replyFinished"
        finished-text="没有更多了"
        @load="onLoad"
        :error="$store.state.reply.replyErr"
        error-text="加载出错，点击重新加载"
        :immediate-check="false"
    >
      <van-cell v-for="(item,index) in list" :key="item._id">
        <div style="display: flex;justify-content: normal">
          <img :src="item.info.avatar" alt="" style="width: 30px;height: 30px;border-radius: 50%;margin-right: 10px">
          <div style="display: flex;flex-direction: column;">
            <span style="font-size: 14px;line-height: 30px">{{item.info.nickname}}</span>
            <span>{{item.content}}</span>
          </div>
        </div>
      </van-cell>
    </van-list>
  </van-popup>

</template>

<script>
import {Cell, Icon, List, Popup} from "vant";
import store from "@/store";

export default {
  name: "ReplyComment",
  components:{
    [List.name]:List,
    [Popup.name]:Popup,
    [Icon.name]:Icon,
    [Cell.name]:Cell
  },
  props:{
    commentObj:{
      type:Object,
      required:true
    },
    commentThumbs:{
      type:Function,
      required: true
    },
    onLoad:{
      type:Function,
      required:true
    },
    list:{
      type:Array,
      required:true
    },
    info:{
      type: Object,
      required:true
    }
  },
  data(){
    return{
      replyLoading:store.state.reply.replyLoading,
      replyErr:store.state.reply.replyErr,
      replyFinished:store.state.reply.replyFinished
    }
  }
}
</script>

<style scoped>

</style>