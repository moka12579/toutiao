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
          :rules="[{ required: true, message: '请填写文章内容，最少10个字', pattern:/^\w{10,}/ }]"
      />
      <van-field name="uploader" label="文件上传">
        <template #input>
          <van-uploader
              v-model="uploader"
              :after-read="afterRead"
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
import axios from "axios";
const baseURL = process.env.NODE_ENV === "development" ? "/cos" : "http://43.138.56.64"
import cos from "cos-js-sdk-v5"

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
        author:JSON.parse(store.state.user).userInfo._id,
        author_id:JSON.parse(store.state.user).uid
      },
      SecretId:'',
      SecretKey:""
    }
  },
  mounted() {
    axios.get("http://43.138.56.64").then(res => {
      this.SecretId=res.data.SecretId
      this.SecretKey=res.data.SecretKey
    })
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
    afterRead(file){
      let oss = new cos({
        SecretId:this.SecretId,
        SecretKey:this.SecretKey
      })
      let index = this.uploader.findIndex(v => v.content === file.content)
      this.$set(this.uploader,index,{...this.uploader[index],status:"uploading",message:"上传中"})
      let body = this.dataURLtoBlob(file.content);
      let config = {
        Bucket: 'toutiao-1300475487', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-nanjing',  /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: file.file.name,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: body,
        Origin: "http://mokacui.work",
        AccessControlRequestMethod:"PUT"
      }
      oss.putObject(config, (err, data) => {
        if (data.statusCode === 200){
          this.$set(this.uploader,index,{...this.uploader[index],status:"done",message:"上传完成"})
          this.publish.imageSrc.push("https://"+data.Location)
        }else {
          this.$set(this.uploader,index,{...this.uploader[index],status:"failed",message:"上传失败"})
        }
      });
      /*upload({
        url: "https://upload-z1.qiniup.com",
        data:{
          file:file.content,
          key:file.file.name,
          token:this.uploadToken
        }
      }).then(response => {
        console.log(response)
        this.$set(this.uploader,index,{...this.uploader[index],status:"done",message:"上传完成"})
        this.publish.imageSrc.push("http://toutiao.longxiaokj.com/"+response.data.key)
      }).catch(error => {
        this.$set(this.uploader,index,{...this.uploader[index],status:"failed",message:"上传失败"})
      })*/
    },
    publish1(){
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
    dataURLtoBlob (dataurl) {
      let arr = dataurl.split(',');
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
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