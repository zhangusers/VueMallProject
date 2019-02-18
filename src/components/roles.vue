<template>
  <el-card>
    <!-- 面包屑 -->
    <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
    <!-- 添加按钮 -->
    <el-button @click.prevent="showDiaAddRole()" type="primary" plain class="add">添加角色</el-button>
    <el-table :data="list" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline >
            <!-- 一级权限-->
            <el-row class="level1" v-for="item in scope.row.children" :key="item.id">
              <el-col :span="4">
                <el-tag closable @close="deleteRight(scope.row,item)">
                  {{item.authName}}
                </el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="20">
                <el-row class="level2" v-for="item1 in item.children" :key="item1.id">
                  <el-col :span="4">
                    <el-tag closable type="success" @close="deleteRight(scope.row,item1)">
                      {{item1.authName}}
                    </el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="20" class="level3">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item2 in item1.children" :key="item2.id"
                      @close="deleteRight(scope.row,item2)">
                      {{item2.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row v-if="scope.row.children.length===0">暂未分配权限</el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="#" type="index" width="120"></el-table-column>
      <el-table-column label="角色名称" prop="roleName" width="200"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc" width="200"></el-table-column>
      <el-table-column prop="date" label="操作" width="400">
        <template slot-scope="scope">
          <el-row>
            <el-button
              @click="showDiaEditRole(scope.row)"
              type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            <el-button
              @click.prevent="deleteRole(scope.row)"
              type="danger" icon="el-icon-delete" circle size="mini"></el-button>
            <el-button
              @click="showDiaSetRole(scope.row)"
              type="success" icon="el-icon-check" circle size="mini"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框-添加角色 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleRoleAdd">
      <el-form label-position="right" ref="roleData" :rules="rules" label-width="80px" :model="roleData">
        <el-form-item label="角色名称" prop="roleName">
          <el-input type="text" v-model="roleData.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="password" v-model="roleData.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRoleAdd = false">取 消</el-button>
        <el-button type="primary" @click="createRole('roleData')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框-编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleRoleEdit">
      <el-form label-position="right" label-width="80px" :model="roleData">
        <el-form-item label="角色名称">
          <el-input type="text" disabled v-model="roleData.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="text" v-model="roleData.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRoleEdit = false">取 消</el-button>
        <el-button type="primary" @click="EditRole()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRoleSet">
      <el-tree ref="treeDom"
               :data="treeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedArr"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRoleSet = false">取 消</el-button>
        <el-button type="primary" @click="SetRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'roles',
  data () {
    return {
      dialogFormVisibleRoleAdd: false,
      dialogFormVisibleRoleEdit: false,
      dialogFormVisibleRoleSet: false,
      list: [],
      rules: {
        roleName: [
          {required: true, message: '这是必填项', trigger: 'blur'}
        ]
      },
      roleData: {
        roleName: '',
        roleDesc: ''
      },
      treeData: [],
      // 默认选中的数据[被选中节点的id]
      checkedArr: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      currentRoleId: -1
    }
  },
  created () {
    this.getRoleData()
  },
  methods: {
    // 分配权限-设置权限
    async SetRole () {
      // 获取当前角色选中的节点id
      const arr1 = this.$refs.treeDom.getCheckedKeys()
      // 获取树形结构中的半选id
      const arr2 = this.$refs.treeDom.getHalfCheckedKeys()
      // ES6 展开剩余参数
      const arr = [...arr1, ...arr2]
      const res = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids: arr.join(',')
      })
      console.log(res)
      const {data: {meta: { msg, status }}} = res
      if (status === 200) {
        this.$message.success(msg)
        this.dialogFormVisibleRoleSet = false
        this.getRoleData()
      }
    },

    // 分配权限-展示对话框
    async showDiaSetRole (role) {
      console.log(role.id)
      // 获取当前用户的的角色 id
      this.currentRoleId = role.id
      // 获取所有权限
      const res = await this.$http.get(`rights/tree`)
      // console.log(res)
      const {data: {data, meta: { status }}} = res
      if (status === 200) {
        this.treeData = data
      }
      // 获取当前角色现有权限
      const temp = []
      role.children.forEach((item) => {
        item.children.forEach((item1) => {
          item1.children.forEach((item2) => {
            temp.push(item2.id)
          })
        })
      })
      // console.log(temp)
      this.checkedArr = temp
      this.dialogFormVisibleRoleSet = true
    },

    // 删除角色指定的权限
    async deleteRight (role, rights) {
      // console.log(role.id, rights.id)
      const res = await this.$http.delete(`roles/${role.id}/rights/${rights.id}`)
      // console.log(res)
      const {data: {data, meta: {msg, status}}} = res
      if (status === 200) {
        // this.list = data
        this.$message.success(msg)
        role.children = data
      }
    },

    // 编辑角色-发送请求
    async EditRole () {
      console.log(this.roleData.roleDesc)
      const res = await this.$http.put(`roles/${this.roleData.id}`, {
        roleName: this.roleData.roleName,
        roleDesc: this.roleData.roleDesc
      })
      // console.log(res)
      const {data: {meta: {msg, status}}} = res
      if (status === 200) {
        this.dialogFormVisibleRoleEdit = false
        this.$message.success(msg)
        this.getRoleData()
      }
    },

    // 编辑角色-展示对话框
    showDiaEditRole (role) {
      // this.roleData = role
      this.dialogFormVisibleRoleEdit = true
      this.roleData.roleName = role.roleName
      this.roleData.id = role.id
      this.roleData.roleDesc = role.roleDesc
    },

    // 删除角色
    deleteRole (role) {
      // console.log(role)
      this.$confirm('是否删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`roles/${role.id}`)
        // console.log(res)
        const {data: {meta: {status, msg}}} = res
        if (status === 200) {
          this.$message.success(msg)
          this.getRoleData()
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },

    // 创建角色-发送请求
    createRole (formName) {
      // this.$refs[formName].validate(async (valid) => {
      this.$refs[formName].validate(async (valid) => {
        const res = await this.$http.post(`roles`, this.roleData)
        console.log(res)
        const {data: {meta: {status, msg}}} = res
        if (status === 201) {
          this.dialogFormVisibleAddRole = false
          this.$message.success(msg)
          this.getRoleData()
        }
      })
    },

    // 创建角色-展示对话框
    showDiaAddRole () {
      this.dialogFormVisibleRoleAdd = true
      this.roleData = {}
    },

    // 获取首屏数据
    async getRoleData () {
      const res = await this.$http.get(`roles`)
      const {data: {data, meta: {status}}} = res
      // console.log(data)
      if (status === 200) {
        this.list = data
      }
    }
  }
}
</script>

<style scoped>
  .add {
    margin-top: 20px;
  }
  .level1, .level2 {
    margin-bottom: 10px;
  }
  .level3 {
    margin-bottom: 5px;
  }
</style>
