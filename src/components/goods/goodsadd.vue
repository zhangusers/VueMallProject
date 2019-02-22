<template>
    <el-card class="box" style="height: 100%">
      <!-- 面包屑 -->
      <cus-Bread level1="商品管理" level2="商品列表"></cus-Bread>
      <!-- 提示 -->
      <el-alert
        class="alert"
        title="添加商品信息"
        type="info"
        center
        show-icon>
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="active*1" align-center class="steps" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <!-- Tab 导航条 -->
      <el-form class="form" tab-position="top" label-width="80px" :model="goodList">
        <el-tabs v-model="active" tab-position="left" @tab-click="tabChange()">
          <el-tab-pane label="基本信息" name="1">
            <el-form-item label="商品名称">
              <el-input v-model="goodList.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="goodList.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="goodList.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="goodList.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                expand-trigger="hover"
                :options="options"
                v-model="selectedOptions"
                clearable
                :props="defaultOptions">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="2" >
            <el-form-item :label="item.attr_name" v-for="item in arrDy" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  v-for="(item1,i) in item.attr_vals"
                  :key="i"
                  border>
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="3">
            <el-form-item :label="item.attr_name" v-for="item in arrStatic" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="4">
            <el-form-item label="添加图片">
              <el-upload
                :headers="headers"
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="5">
            <el-form-item>
              <el-button @click="addGoods()">添加商品</el-button>
              <quill-editor id="editor" v-model="goodList.goods_introduce" ></quill-editor>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'goodsadd',
  components: {
    quillEditor
  },
  data () {
    return {
      active: '1',
      // 表单数据
      goodList: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      // 级联数据配置
      options: [],
      selectedOptions: [],
      defaultOptions: {
        value: 'cat_id',
        label: 'cat_name'
      },
      // 动态参数的数组
      arrDy: [],
      // 静态参数的数组
      arrStatic: [],
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  created () {
    this.getGoodsCate()
  },
  methods: {
    // 添加商品
    async addGoods () {
      // goods_cat 以为 ',' 分割的分类列表[1,3,6]不能为空
      this.goodList.goods_cat = this.selectedOptions.join(',')

      const arr1 = this.arrDy.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals }
      })
      const arr2 = this.arrStatic.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals }
      })
      this.goodList.attrs = [...arr1, ...arr2]

      const res = await this.$http.post(`goods`, this.goodList)
      // console.log(res)
      const {
        meta: { msg, status }
      } = res.data
      if (status === 201) {
        // 列表
        this.$router.push({
          name: 'goods'
        })
      } else {
        this.$message.error(msg)
      }
    },

    // 移除图片
    handleRemove (file, fileList) {
      // console.log(file)
      this.goodList.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path
      })
    },
    // 图片假上传成功
    handleSuccess (response, file, fileList) {
      // console.log(response)
      const tmpPath = response.data.tmp_path
      this.goodList.pics.push({
        pic: tmpPath
      })
    },

    // 点击 tab 触发
    async tabChange () {
      // 判断商品分类是否选择
      if (this.active === '2' || this.active === '3') {
        if (this.selectedOptions.length !== 3) {
          this.$message.error('请选择三级分类')
          if (this.active === '2') {
            this.arrDy = []
          } else {
            this.arrStatic = []
          }
          return
        }
        if (this.active === '2') {
          // 获取商品动态分类参数
          const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
          // console.log(res)
          const {data: {data, meta: { status }}} = res
          if (status === 200) {
            this.arrDy = data
            // console.log(this.arrDy)
            this.arrDy.forEach((item) => {
              item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
            })
          }
        }
        if (this.active === '3') {
          // 获取商品的静态分类参数
          const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
          // console.log(res)
          const {data: {data, meta: { status }}} = res
          if (status === 200) {
            this.arrStatic = data
            // console.log(this.arrStatic)
          }
        }
      }
    },

    // 获取商品分类列表
    async getGoodsCate () {
      const res = await this.$http.get(`categories?type=3`)
      // console.log(res)
      const {data: {data, meta: { status }}} = res
      if (status === 200) {
        this.options = data
      }
    }
  }
}
</script>

<style scoped>
.box {
  height: 100%;
}
.form {
  height: 400px;
  overflow: auto;
}
.alert {
  margin: 15px 0;
}
.steps {
  margin-bottom: 20px;
}
.quill-editor{
  min-height:200px;
}
</style>
