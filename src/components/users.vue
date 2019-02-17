<template>
  <el-card>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row>
      <el-input @clear="getAllUsers()" placeholder="请输入内容" v-model="query" class="searchVal" clearable>
        <el-button slot="append" icon="el-icon-search" @click.prevent="searchUser()"></el-button>
      </el-input>
      <el-button @click.prevent="showDiaAddUser()" type="primary" plain>添加用户</el-button>
    </el-row>
    <!-- 列表显示 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>
      <el-table-column label="创建日期" width="140">
        <template slot-scope="scope">
          {{scope.row.create_time | fmtDate}}
        </template>
      </el-table-column>
      <el-table-column prop="date" label="用户状态" width="90">
        <template slot-scope="scope">
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" width="200">
        <template slot-scope="scope">
          <el-row>
            <el-button
              @click="showDiaEditUser(scope.row)"
              type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            <el-button
              @click.prevent="deleteUser(scope.row)"
              type="danger" icon="el-icon-delete" circle size="mini"></el-button>
            <el-button
              @click="showDiaSetRole(scope.row)"
              type="success" icon="el-icon-check" circle size="mini"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="page"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pagenum"
                   :page-sizes="[2, 4, 6, 8]"
                   :page-size="pagesize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
    <!-- 对话框-添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form label-position="right" ref="formData" :rules="rules" label-width="80px" :model="formData">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="formData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="formData.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input type="text" v-model="formData.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input type="text" v-model="formData.mobile" placeholder="请输入电话"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="createUser('formData')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框-编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="right" label-width="80px" :model="formData">
        <el-form-item label="用户名">
          <el-input type="text" disabled v-model="formData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input type="text" v-model="formData.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input type="text" v-model="formData.mobile" placeholder="请输入电话"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="EditUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框-分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="用户名">
          {{currentUserName}}
        </el-form-item>
        <el-form-item label="角色">{{this.searchVal}}
          <el-select v-model="searchVal" placeholder="请选择角色名称">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option
              :label="item.roleName"
              :value="item.id"
              v-for="(item) in roles"
              :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'users',
  data () {
    return {
      list: [],
      query: '',
      // 当前页码
      pagenum: 1,
      // 每页显示条数
      pagesize: 2,
      total: -1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '这是必填项', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '这是必填项', trigger: 'blur' },
          { min: 6, max: 9, message: '长度在 6 到 9 个字符', trigger: 'blur' }
        ]
      },
      searchVal: -1,
      currentUserId: -1,
      currentUserName: '',
      roles: [],
      msg_status: false
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 设置用户状态
    async changeState (user) {
      const res = await this.$http.put(`users/${user.id}/state/{user.mg_state}`)
      // console.log(res)
      const {data: {meta: { msg, status }}} = res
      if (status === 200) {
        this.$message.success(msg)
      }
    },

    // 分配角色-发送数据
    async setRole () {
      const res = await this.$http.put(`users/${this.currentUserId}/role`, {
        rid: this.searchVal
      })
      const {data: {meta: { msg, status }}} = res
      console.log(res)
      if (status === 200) {
        this.dialogFormVisibleRole = false
        this.$message.success(msg)
      }
    },

    // 分配角色-展示对话框
    async showDiaSetRole (user) {
      this.currentUserId = user.id
      this.currentUserName = user.username
      this.dialogFormVisibleRole = true
      // 获取角色
      const res = await this.$http.get(`roles`)
      const {data: {data, meta: { status }}} = res
      if (status === 200) {
        this.roles = data
      }
      // 获取当前用户的角色id
      const res2 = await this.$http.get(`users/${user.id}`)
      // console.log(res2)
      this.searchVal = res2.data.data.rid
    },

    // 编辑用户-发送请求
    async EditUser () {
      // console.log(this.formData)
      const res = await this.$http.put(`users/${this.formData.id}`, {
        email: this.formData.email,
        mobile: this.formData.mobile
      })
      console.log(res)
      const {data: {meta: {status, msg}}} = res
      if (status === 200) {
        this.dialogFormVisibleEdit = false
        this.$message.success(msg)
        this.getTableData()
      } else {
        this.$message.error(msg)
      }
    },

    // 编辑用户-展示对话框
    showDiaEditUser (user) {
      this.formData = user
      this.dialogFormVisibleEdit = true
    },

    // 删除用户 - 提示并发送请求
    deleteUser (user) {
      this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`users/${user.id}`)
        // console.log(res)
        const {data: {meta: { status, msg }}} = res
        if (status === 200) {
          this.pagenum = 1
          this.$message.success(msg)
          this.getTableData()
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },

    // 添加用户 - 发送请求
    createUser (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false
        }
        const res = await this.$http.post(`users`, this.formData)
        console.log(res)
        const {data: {meta: {status}}} = res
        console.log(status)
        if (status === 201) {
          console.log(1)
          this.dialogFormVisibleAdd = false
          this.getTableData()
        }
      })
    },

    // 添加用户 - 展示对话框
    showDiaAddUser () {
      this.dialogFormVisibleAdd = true
      this.formData = {}
    },

    // 搜索功能
    getAllUsers () {
      this.getTableData()
    },
    searchUser () {
      this.getTableData()
    },

    // 分页相关功能
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagenum = 1
      this.pagesize = val
      this.getTableData()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getTableData()
    },

    // 获取首屏数据
    async getTableData () {
      // 授权
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      // console.log(res)
      const {data: {data: { total, users }, meta: { status }}} = res
      if (status === 200) {
        this.list = users
        this.total = total
      }
    }
  }
}
</script>

<style scoped>
.box-card {
  height: 100%;
}
.searchVal {
  margin-top: 20px;
  margin-bottom: 10px;
  width: 400px;
}
.page {
  margin-top: 20px;
}
</style>
