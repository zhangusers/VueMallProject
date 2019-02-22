<template>
  <el-card class="box">
    <cus-bread level1="数据统计" level2="数据报表"></cus-bread>
    <div id="main" style="width: 600px;height:400px;"></div>
  </el-card>
</template>

<script>
import MyCharts from 'echarts'
export default {
  name: 'reports',
  mounted () {
    this.loadData()
  },
  methods: {
    async loadData () {
      const resArr = await this.$http.get(`reports/type/1`)
      // console.log(resArr)
      const option1 = resArr.data.data
      const myChart = MyCharts.init(document.getElementById('main'))
      const option2 = {
        title: {
          text: '数据统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      }
      const option = {...option1, ...option2}
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
.box {
  height: 100%;
}
#main {
  margin-top: 20px;
}
</style>
