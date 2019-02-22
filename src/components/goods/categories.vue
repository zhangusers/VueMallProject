<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <cus-bread level1="商品管理" level2="商品分类"></cus-bread>
    <!-- 搜索框 -->
    <el-row class="search">
      <el-col :span="24">
        <el-button type="success" @click="addGoodsCate()">添加分类</el-button>
      </el-col>
    </el-row>
    <el-table height="450" :data="list" style="width: 100%">
      <el-tree-grid
        prop="cat_name"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
        label="商品分类"
        width="140"
      ></el-tree-grid>
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level===0">一级</span>
          <span v-else-if="scope.row.cat_level===1">二级</span>
          <span v-else-if="scope.row.cat_level===2">三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted===false">有效</span>
          <span v-else-if="scope.row.cat_deleted===true">无效</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="page"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagenum"
    :page-sizes="[5, 10, 15,20]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    ></el-pagination>
    <!-- 添加对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form" >
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 级联选择器 (表单元素) -->
        <el-form-item label="分类" :label-width="formLabelWidth">
          {{selectedOptions}}
          <el-cascader
            expand-trigger="hover"
            change-on-select
            clearable
            :options="caslist"
            v-model="selectedOptions"
            :props="defaultProp"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import ElTreeGrid from 'element-tree-grid'

export default {
  name: 'categories',
  components: {
    ElTreeGrid
  },
  data () {
    return {
      list: [],
      pagenum: 1,
      pagesize: 10,
      total: 1,
      dialogFormVisibleAdd: false,
      formLabelWidth: '140px',
      form: {
        cat_pid: -1,
        cat_name: '',
        cat_level: -1
      },
      // 级联数据配置
      caslist: [],
      selectedOptions: [],
      defaultProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created () {
    this.getGoodsCate()
  },
  methods: {
    async addCate () {
      // 如果没选择分类 -> 添加一级分类
      if (this.selectedOptions.length === 0) {
        this.form.cat_pid = 0
        this.form.cat_level = 0
      }
      // 如果选了一个分类 -> 添加的是二级分类
      if (this.selectedOptions.length === 1) {
        this.form.cat_pid = this.selectedOptions[0]
        this.form.cat_level = 1
      }
      // 如果选了两个分类,->添加三级分类
      if (this.selectedOptions.length === 2) {
        this.form.cat_pid = this.selectedOptions[1]
        this.form.cat_level = 2
      }
      const res = await this.$http.post(`categories`, this.form)
      console.log(res)
      const {
        meta: { status }
      } = res.data
      if (status === 201) {
        this.dialogFormVisibleAdd = false
        this.getGoodsCate()
      }
    },
    // 添加分类-展示对话框
    async addGoodsCate () {
      const res = await this.$http.get(`categories?type=2`)
      console.log(res)
      const {data, meta: { status }} = res.data
      if (status === 200) {
        this.caslist = data
      }
      this.dialogFormVisibleAdd = true
    },
    // 分页的相关方法
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getGoodsCate()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getGoodsCate()
    },

    // 获取分类数据
    async getGoodsCate () {
      const res = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      // console.log(res)
      const {data: { total, result }, meta: { status }} = res.data
      if (status === 200) {
        this.list = result
        this.total = total
      }
    }
  }
}
</script>

<style scoped>
.page {
  margin-top: 20px;
}
.search {
  margin-top: 20px;
}
</style>
