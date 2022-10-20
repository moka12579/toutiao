<template>
  <div>
    <van-nav-bar
        title="发布"
        class="navBar"
    />
    <van-form @submit="publish1">
      <van-field
          v-model="publish.title"
          name="文章标题"
          label="文章标题"
          placeholder="文章标题"
          maxlength="10"
          :rules="[{ required: true, message: '请填写文章标题' }]"
      />
      <van-field
          readonly
          clickable
          @click="showPicker=true"
          :value="cate"
          label="分类"
          placeholder="选择分类"
      />
      <van-popup v-model="showPicker" round position="bottom">
        <van-picker
            title="选择分类"
            show-toolbar
            :columns="columns"
            @confirm="changeCate"
            @cancel="showPicker=false"
        />
      </van-popup>
      <van-field
          v-model="publish.content"
          type="textarea"
          name="文章内容"
          label="内容"
          placeholder="请输入内容"
          rows="5"
          autosize
          maxlength="1000"
          show-word-limit
          :rules="[{ required: true, message: '请填写文章内容，最少10个字' }]"
      />
      <van-field name="uploader" label="文件上传">
        <template #input>
          <van-uploader
              v-model="uploader"
              :after-read="afterRead"
              :before-delete="beforeDelete"
          />
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import {Button, Field, Form, NavBar, Picker, Popup, Toast, Uploader} from "vant";
import {cateList} from "@/api/home";
import {getToken, upload} from "@/api/uploader";
import store from "@/store";
import {publish} from "@/api/article";
import router from "@/router";
import * as qiniu from 'qiniu-js'

export default {
  name: "PublishArticle",
  components:{
    [NavBar.name]:NavBar,
    [Form.name]:Form,
    [Field.name]:Field,
    [Picker.name]:Picker,
    [Popup.name]:Popup,
    [Button.name]:Button,
    [Uploader.name]:Uploader
  },
  data(){
    return{
      columns:[],
      showPicker:false,
      cate:"",
      uploader:[],
      uploadToken:"",
      cate_list:[],
      publish:{
        title:"",
        imageSrc:[],
        content:"",
        cate_id:"",
        cate_name:"",
        author:JSON.parse(store.getters.user).userInfo._id,
        author_id:JSON.parse(store.getters.user).uid
      },
    }
  },
  mounted() {
    cateList({
      url:"/api/get_cate_list"
    }).then(response => {
      if (response.data.code === 0){
        this.cate_list = response.data.data
        this.columns = response.data.data.map(v=>v.name)
      }
    })
    getToken({
      url:"/upload/token"
    }).then(response => {
      if (response.data.code === 0){
        this.uploadToken = response.data.token
      }
    })
  },
  methods:{
    changeCate(value,index){
      this.publish.cate_id = this.cate_list[index]._id
      this.publish.cate_name = this.cate_list[index].name
      this.cate=value
      this.showPicker=false
    },
    afterRead(file) {
      console.log(file)
      let index = this.uploader.findIndex(v => v.content === file.content)
      this.$set(this.uploader, index, {...this.uploader[index], status: "uploading", message: "上传中"})
      const observable = qiniu.upload(file.file, new Date().getTime()+"-"+file.file.name, this.uploadToken)
      observable.subscribe(res => {
      },error => {
        this.$set(this.uploader,index,{...this.uploader[index],status:"failed",message:"上传失败"})
      },res => {
        this.$set(this.uploader,index,{...this.uploader[index],status:"done",message:"上传完成"})
        this.publish.imageSrc.push(`${res.key}`)
      })
    },
    publish1(){
      if (this.publish.imageSrc.length===2||this.publish.imageSrc.length>3){
        Toast.fail("请上传一张或三张照片")
        return
      }
      this.publish.imageSrc=this.publish.imageSrc.map(v => `http://toutiao.longxiaokj.com/${v}`)
      publish({
        url:"/api/add_article",
        data:{
          ...this.publish
        }
      }).then(res => {
        if (res.data.code === 0){
          Toast({
            type:"success",
            message:"发布成功",
            onClose:() => {
              router.push("/")
            }
          })
        }else{
          Toast.fail(res.data.msg)
        }
      })
    },
    beforeDelete(file){
      let index = this.publish.imageSrc.findIndex(v => v === file.file.name)
      if (index !== -1){
        this.publish.imageSrc.splice(index,1)
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.navBar{
  background: #e54b43;
  color: white;
  ::v-deep .van-nav-bar__title,::v-deep .van-icon-arrow-left{
    color: white;
  }
}
</style>