import Vue from 'vue'
import VueRouter from 'vue-router'

import { Message } from 'element-ui'

const Login = () => import('@/components/login')
const Home = () => import('@/components/home')
const Users = () => import('@/components/users')
const Rights = () => import('@/components/rights')
const Roles = () => import('@/components/roles')
const Goods = () => import('@/components/goods/goods')
const GoodsAdd = () => import('@/components/goods/goodsadd')
const Params = () => import('@/components/goods/params')
const Categories = () => import('@/components/goods/categories')
const Orders = () => import('@/components/orders')
const Reports = () => import('@/components/reports')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [{
        path: '/users',
        name: 'users',
        component: Users
      },
      {
        path: '/rights',
        name: 'rights',
        component: Rights
      },
      {
        path: '/roles',
        name: 'roles',
        component: Roles
      },
      {
        path: '/goods',
        name: 'goods',
        component: Goods
      },
      {
        path: '/goodsadd',
        name: 'goodsadd',
        component: GoodsAdd
      },
      {
        path: '/params',
        name: 'params',
        component: Params
      },
      {
        path: '/categories',
        name: 'categories',
        component: Categories
      },
      {
        path: '/orders',
        name: 'orders',
        component: Orders
      },
      {
        path: '/reports',
        name: 'reports',
        component: Reports
      }
      ]
    }
  ]
})

router.beforeEach((to, form, next) => {
  // console.log('导航守卫')
  if (to.name === 'login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push({
        name: 'login'
      })
      Message.warning('请先登录')
      return
    }
  }
  next()
})

export default router
