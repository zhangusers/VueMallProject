<template>
  <el-card>
    <!-- 面包屑 -->
    <cus-bread level1="权限管理" level2="权限列表"></cus-bread>
    <!-- Table 列表 -->
    <el-table :data="list" height="450" border style="width: 100%" class="table">
      <el-table-column type="index" label="#" width="180"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level==='0'">一级</span>
          <span v-if="scope.row.level==='1'">二级</span>
          <span v-if="scope.row.level==='2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: 'rights',
  data () {
    return {
      list: []
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      const res = await this.$http.get(`rights/list`)
      // console.log(res)
      const {data: {data, meta: { status }}} = res
      if (status === 200) {
        this.list = data
      }
    }
  }
}
</script>

<style scoped>
.table {
  margin-top: 20px;
}
</style>
