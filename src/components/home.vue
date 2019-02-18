<template>
  <el-container class="container">
    <el-header>
      <el-row>
        <el-col :span="23" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href="#" class="loginout" @click.prevent="logout">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="container">
      <el-aside width="200px" class="aside">
        <el-menu default-active="2" :router="true" :unique-opened="true" class="menu">
          <!-- 用户管理 -->
          <el-submenu :index="item.order+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item1.path+''" v-for="item1 in item.children" :key="item1.id">
              <i class="el-icon-menu"></i>
              {{item1.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      menuList: []
    }
  },
  beforeMount () {
    // if (!localStorage.getItem('token')) {
    //   this.$router.push({
    //     name: 'login'
    //   })
    // }
  },
  created () {
    this.getMenus()
  },
  methods: {
    logout () {
      // 清除 token 值
      localStorage.clear('token')
      // 跳转页面
      this.$router.push({
        name: 'login'
      })
      // 消息提示
      this.$message.warning('退出成功')
    },
    // 获取菜单
    async getMenus () {
      const res = await this.$http.get(`menus`)
      // console.log(res)
      const {data: {data, meta: { status }}} = res
      if (status === 200) {
        this.menuList = data
      }
    }
  }
}
</script>

<style scoped>
  .container {
    height: 100%;
    background: #b3c0d1;
  }
  .middle {
    text-align: center;
    line-height: 60px;
  }
  .menu {
    height: 100%;
  }
  .main {
    background: #e9eef3;
  }
  .loginout {
    line-height: 60px;
    text-decoration: none;
  }
</style>
