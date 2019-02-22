<template>
  <el-card>
    <cus-Bread level1="商品管理" level2="商品列表"></cus-Bread>
    <!-- 搜索框 -->
    <el-row>
      <el-input @clear="getAllUsers()" placeholder="请输入内容" v-model="query" class="searchVal" clearable>
        <el-button slot="append" icon="el-icon-search" @click.prevent="searchGood()"></el-button>
      </el-input>
      <el-button @click.prevent="$router.push({name: 'goodsadd'})" type="primary" plain>添加商品</el-button>
    </el-row>
    <!-- 产品列表 -->
    <el-table :data="goodList" border height="450" style="width: 100%; margin-bottom: 10px;">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="500"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="80"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
      <el-table-column label="创建日期" width="140">
        <template slot-scope="scope">
          {{scope.row.add_time | fmtDate}}
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" width="160">
        <template slot-scope="scope">
          <el-row>
            <el-button
              @click="showDiaEditGood(scope.row)"
              type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            <el-button
              @click.prevent="deleteGood(scope.row)"
              type="danger" icon="el-icon-delete" circle size="mini"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="page"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pagenum"
                   :page-sizes="[10, 20, 30, 40]"
                   :page-size="pagesize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: 'goods',
  data () {
    return {
      query: '',
      goodList: [],
      // goodData: {
      //   goods_name: '',
      //   goods_price: '',
      //   goods_weight: '',
      //   add_time: ''
      // },
      total: -1,
      pagenum: 1,
      pagesize: 10
    }
  },
  created () {
    this.getGoodsData()
  },
  methods: {
    // 分页相关功能
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagenum = 1
      this.pagesize = val
      this.getGoodsData()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getGoodsData()
    },
    // 获取首屏数据
    async getGoodsData () {
      const res = await this.$http.get(`goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      // console.log(res)
      const {data: {data: { goods, total }, meta: { status }}} = res
      if (status === 200) {
        this.goodList = goods
        this.total = total
      }
    }
  }
}
</script>

<style scoped>
.searchVal {
  margin-top: 20px;
  margin-bottom: 10px;
  width: 400px;
}
</style>
