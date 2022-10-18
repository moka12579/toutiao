import Vue from 'vue'
import Vuex from 'vuex'
import {selectUser} from "@/api/user";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    done:false,
    token:localStorage.getItem("token"),
    user:localStorage.getItem("user")
  },
  getters: {
  },
  mutations: {
    increment(){
      selectUser({
        url: "/user/getuserInfo",
        data: {
          token: localStorage.getItem("token")
        }
      }).then(res => {
        localStorage.setItem("user",JSON.stringify(res.data))
      })
    }
  },
  actions: {
  },
  modules: {
  }
})
