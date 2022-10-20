<template>
  <div>
    <van-nav-bar
        title="修改个人信息"
        class="navBar"
        left-arrow
        @click-left="$router.back()"
    />
    <van-form @submit="onSubmit">
      <van-cell-group>
        <van-cell>
          <van-field
              v-model="username"
              name="用户名"
              label="用户名"
              placeholder="用户名"
              :rules="[{ required: true, message: '请填写用户名' }]"
              style="padding: 0"
          />
        </van-cell>
        <van-cell>
          <div>头像</div>
          <van-uploader v-model="fileList" :max-count="1" ref="uploader" :after-read="afterRead" v-show="false"/>
          <van-image
              width="40"
              height="40"
              :src="avatar"
              style="border-radius: 50%"
              @click="updateAvatar"
          ></van-image>

        </van-cell>
        <van-cell>
          <div>生日</div>
          <div @click="show=true">{{birthday}}</div>
          <van-popup
              v-model="show"
              position="bottom"
              round
              :style="{ height: '50%' }"
          >
            <van-datetime-picker
                v-model="currentDate"
                type="date"
                title="选择年月"
                :max-date="maxDate"
                :min-date="minDate"
                @confirm="changeBirthday"
                :swipe-duration="500"
                @cancel="show=false"
            />
          </van-popup>
        </van-cell>
        <van-cell>
          <div>性别</div>
          <van-radio-group v-model="sex" direction="horizontal" @change="changeSex">
            <van-radio name="1">男</van-radio>
            <van-radio name="2">女</van-radio>
          </van-radio-group>
        </van-cell>
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import {
  Button,
  Cell,
  CellGroup,
  Field,
  Form,
  NavBar,
  Image,
  Uploader,
  Toast,
  Popup,
  DatetimePicker,
  RadioGroup, Radio
} from "vant";
import store from "@/store";
import * as qiniu from "qiniu-js";
import {getToken} from "@/api/uploader";
import {updateInfos} from "@/api/user";

export default {
  name: "UpdateInfo",
  components:{
    [NavBar.name]:NavBar,
    [CellGroup.name]:CellGroup,
    [Cell.name]:Cell,
    [Button.name]:Button,
    [Form.name]:Form,
    [Field.name]:Field,
    [Image.name]:Image,
    [Uploader.name]:Uploader,
    [Popup.name]:Popup,
    [DatetimePicker.name]:DatetimePicker,
    [RadioGroup.name]:RadioGroup,
    [Radio.name]:Radio
  },
  data(){
    return{
      username:"",
      avatar:"",
      fileList:[],
      currentDate:"",
      birthday:"",
      show:false,
      maxDate:new Date(),
      minDate:new Date(1970,0,1),
      sex:"1",
      uid:JSON.parse(store.getters.user).uid
    }
  },
  methods:{
    onSubmit(){
      updateInfos({
        url:"/user/editUserInfo",
        data:{
          uid:this.uid,
          avatar:this.avatar,
          nickname:this.username,
          birthday:this.birthday,
          sex:this.sex1
        }
      }).then(res => {
        if (res.data.code === 0){
          Toast({
            type:"success",
            message:res.data.msg,
            onClose:() => {
              this.$router.back()
            }
          })
        }else{
          Toast.fail(res.data.msg)
        }
      })
    },
    updateAvatar(){
      this.$refs.uploader.chooseFile()
    },
    afterRead(file){
      Toast.loading({
        message: '上传中...',
        forbidClick: true,
      });
      const observable = qiniu.upload(file.file, new Date().getTime()+"-"+file.file.name, this.uploadToken)
      observable.subscribe(res => {
      },error => {
        Toast.fail("上传失败")
      },res => {
        Toast.success("上传完成")
        this.avatar = `http://toutiao.longxiaokj.com/${res.key}`
      })
    },
    changeBirthday(value){
      this.birthday = new Date(value).toLocaleDateString()
      this.show=false
    },
    changeSex(event){
      console.log(event)
    }
  },
  mounted() {
    const {username,avatar,birthday,sex} = JSON.parse(store.getters.user).userInfo
    this.username = username
    this.avatar = avatar
    this.birthday = !birthday&&new Date().toLocaleDateString()
    this.sex = sex === "男" ? 1 : 2
    getToken({
      url:"/upload/token"
    }).then(response => {
      if (response.data.code === 0){
        this.uploadToken = response.data.token
      }
    })
  },
  computed:{
    sex1(){
      return this.sex === 1 ? "男" : "女"
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-cell__value{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  .van-cell__title{
    line-height: 44px;
  }
}

</style>