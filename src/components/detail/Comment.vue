<template>
  <div>
    <van-popup v-model="$store.state.showPopup" position="bottom" :style="{ height: '30%' }">
      <van-field
          v-model="text"
          type="textarea"
          maxlength="1000"
          show-word-limit
          rows="5"
          placeholder="留下你的评论..."
          autosize
      />
      <van-button type="primary" style="width: 100%;margin-top: 8px" @click="sendComment(text,true)">发送评论</van-button>
    </van-popup>
  </div>
</template>

<script>
import {Button, Field, Popup} from "vant";

export default {
  name: "Comment",
  components:{
    [Field.name]:Field,
    [Popup.name]:Popup,
    [Button.name]:Button
  },
  data(){
    return{
      text:""
    }
  },
  props:{
    sendComment:{
      type:Function,
      required:true
    }
  }
}
</script>

<style scoped>

</style>