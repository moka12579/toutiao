import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store";


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import("../views/HomeView.vue")
  },
  {
    path: '/publishArticle',
    name: 'publishArticle',
    component: () => import( '../views/PublishArticleView.vue')
  },
  {
    path: '/my',
    name: 'my',
    component: () => import( '../views/MyView.vue')
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
  },{
    path: '/result/:value',
    name: "result",
    component: () => import("../views/ResultView.vue")
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,form,next) => {
  const whiteList = ["/login","/register","/"]
  if (whiteList.findIndex(v => v === to.path) !== -1) return next()
  const t = store.state.token
  if(!t){
    next("/login")
  }
  next()
})

export default router
