<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formData">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input type="text" v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="formData.password"></el-input>
      </el-form-item>
      <el-button @click="handleLogin()" class="login-button" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin () {
      const res = await this.$http.post('login', this.formData)
      // console.log(res)
      const {
        data: {
          data, meta: { status, msg }
        }
      } = res
      if (status === 200) {
        localStorage.setItem('token', data.token)
        this.$router.push({
          name: 'home'
        })
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style scoped>
  .login-wrap {
    background: #324152;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-wrap .login-form {
    background-color: #fff;
    width: 400px;
    padding: 30px;
    border-radius: 5px;
  }

  .login-wrap .login-form .login-button {
    width: 100%;
  }
</style>
