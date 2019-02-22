<template>
    <el-card>
      <!-- 面包屑 -->
      <cus-bread level1="商品管理" level2="分类参数"></cus-bread>
      <!-- 提示 -->
      <el-alert
        class="alert"
        type="warning"
        :closable="false"
        title="注意: 只允许为三级分类设置参数"
        center
        show-icon
      ></el-alert>
      <el-form :model="form" label-position="left" label-width="160px">
        <!-- 级联选择 -->
        <el-form-item label="请选择商品分类">
          <el-cascader
            expand-trigger="hover"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange"
            clearable
            :props="defaultOptions">
          </el-cascader>
        </el-form-item>
        <!-- tab 选项 -->
        <el-tabs v-model="active" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="1">
            <el-button type="primary" disabled>设置动态参数</el-button>
            <el-table :data="arrDy" style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag
                    :key="i"
                    v-for="(attr,i) in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(scope.row, attr)">
                    {{attr}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput()">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column label="#" type="index" width="120"></el-table-column>
              <el-table-column label="属性名称" prop="attr_name" width="200"></el-table-column>
              <el-table-column label="操作" width="400">
                <template slot-scope="scope">
                  <el-row>
                    <el-button
                      @click="showDiaEditRole(scope.row)"
                      type="primary" icon="el-icon-edit" circle size="mini"></el-button>
                    <el-button
                      @click.prevent="deleteRole(scope.row)"
                      type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态参数" name="2">
            <el-button type="primary" disabled>设置静态参数</el-button>
            <el-table :data="arrStatic" style="width: 100%">
              <el-table-column label="#" type="index" width="120"></el-table-column>
              <el-table-column label="属性名称" prop="attr_name" width="200"></el-table-column>
              <el-table-column label="属性值" prop="attr_vals" width="200"></el-table-column>
              <el-table-column label="操作" width="400">
                <template slot-scope="scope">
                  <el-row>
                    <el-button
                      @click="showDiaEditRole(scope.row)"
                      type="primary" icon="el-icon-edit" circle size="mini"></el-button>
                    <el-button
                      @click.prevent="deleteRole(scope.row)"
                      type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>

      </el-form>
    </el-card>
</template>

<script>
export default {
  name: 'params',
  data () {
    return {
      active: '1',
      form: {},
      // 级联数据配置
      options: [],
      selectedOptions: [],
      defaultOptions: {
        label: 'cat_name',
        value: 'cat_id'
      },
      list: [],
      arrDy: [],
      arrStatic: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async handleClose (item, attr) {
      item.attr_vals.splice(item.attr_vals.indexOf(attr), 1)
      await this.$http.put(
        // 参数 attr_sel 类型必须为 only 或 many"  -> 接口文档更新了!->接口文档->不对X
        `categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`,
        {
          attr_name: item.attr_name,
          attr_sel: 'many',
          attr_vals: item.attr_vals.join(',')
        }
      )
    },

    showInput () {
      // console.log(this)
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    async handleInputConfirm (item) {
      let inputValue = this.inputValue
      if (inputValue) {
        item.attr_vals.push(inputValue)
        await this.$http.put(
          `categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`,
          {
            attr_name: item.attr_name,
            attr_sel: 'many',
            attr_vals: item.attr_vals.join(',')
          }
        )
      }
      this.inputVisible = false
      this.inputValue = ''
    },

    // tab 切换
    handleClick () {
      this.getDyOrStatic()
    },

    // 级联选择
    handleChange () {
      this.getDyOrStatic()
    },

    // 获取动态或者静态参数
    async getDyOrStatic () {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning('请先选择三级分类')
        if (this.active === '1') {
          this.arrDy = []
        }
        if (this.active === '2') {
          this.arrStatic = []
        }
        return
      }
      if (this.active === '1') {
        // 获取商品动态分类参数
        const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
        // console.log(res)
        const {data: {data, meta: {status}}} = res
        if (status === 200) {
          this.arrDy = data
          // console.log(this.arrDy)
          this.arrDy.forEach((item) => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
          })
        }
      }
      if (this.active === '2') {
        // 获取商品的静态分类参数
        const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
        // console.log(res)
        const {data: {data, meta: {status}}} = res
        if (status === 200) {
          this.arrStatic = data
          // console.log(this.arrStatic)
        }
      }
    },

    // 获取商品分类
    async getTableData () {
      const {data: {data, meta: { status }}} = await this.$http.get(`categories?type=3`)
      if (status === 200) {
        this.options = data
        // console.log(this.options)
      }
    }
  }
}
</script>

<style scoped>
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
