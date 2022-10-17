import Vue from 'vue'
import VueRouter from 'vue-router'


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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
