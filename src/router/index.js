import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store";


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import("../views/HomeView.vue"),
    meta:{
      keepAlive:true
    }
  },
  {
    path: '/publishArticle',
    name: 'publishArticle',
    component: () => import( '../views/PublishArticleView.vue'),
    meta:{
      keepAlive:true
    }
  },
  {
    path: '/my',
    name: 'my',
    component: () => import( '../views/MyView.vue'),
    meta:{
      keepAlive:true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import( '../views/LoginView.vue')
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/RegisterView.vue")
  },
  {
    path: "/detail/:articleId",
    name: "detail",
    component: () => import("../views/DetailView.vue")
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../views/SearchView.vue"),
  },
  {
    path: '/result/:value',
    name: "result",
    component: () => import("../views/ResultView.vue")
  },
  {
    path: '/publishHistory',
    name: "publishHistory",
    component: () => import("../views/PublishHistoryView.vue")
  },
  {
    path: '/browseHistory',
    name: "browseHistory",
    component: () => import("../views/PublishHistoryView.vue")
  },
  {
    path: "/setup",
    name: "setup",
    component: () => import("../views/SetupView.vue")
  },
  {
    path: "/forget/:smsType",
    name: "forget",
    component: () => import("../views/RegisterView.vue")
  },
  {
    path: "/updatePwd",
    name: "updatePwd",
    component: () => import("../views/UpdatePwd.vue")
  },
  {
    path: "/updateInfo",
    name: "updateInfo",
    component: () => import("../views/UpdateInfo.vue")
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,form,next) => {
  const whiteList = ["/login","/register","/","/forget"]
  if (whiteList.findIndex(v => v === to.path) !== -1) return next()
  const t = store.state.token
  if(!t){
    next("/login")
  }
  next()
})

export default router
