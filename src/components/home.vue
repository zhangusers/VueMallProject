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
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              用户列表
            </el-menu-item>
          </el-submenu>
          <!-- 权限管理 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              权限列表
            </el-menu-item>
          </el-submenu>
          <!-- 商品管理 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              分类列表
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              商品分类
            </el-menu-item>
          </el-submenu>
          <!-- 订单管理 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              订单列表
            </el-menu-item>
          </el-submenu>
          <!-- 数据管理 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              数据报表
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
    beforeMount () {
      if (!localStorage.getItem('token')) {
        this.$router.push({
          name: 'login'
        })
      }
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
    background: gray;
  }
  .loginout {
    line-height: 60px;
    text-decoration: none;
  }
</style>

