import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'
import Users from '@/components/users'
import Rights from '@/components/rights'
import Roles from '@/components/roles'
import Goods from '@/components/goods/goods'
import GoodsAdd from '@/components/goods/goodsadd'
import Params from '@/components/goods/params'
import Categories from '@/components/goods/categories'
import Orders from '@/components/orders'
import Reports from '@/components/reports'

import { Message } from 'element-ui'

Vue.use(Router)

const router = new Router({
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
