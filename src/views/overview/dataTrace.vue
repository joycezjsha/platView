<template>
  <div class="trace_index_chart">
    <m-tile label="今日轨迹接口调用情况"></m-tile>
    <el-table
          :data="indexDatas"
          style="width: 100%"
          highlight-current-row
          height="55vh"
          :default-sort="{prop: 'YESTERDAYNUM', order: 'descending'}"
          :row-style="getRowClass"
          :header-row-style="getRowClass"
          :header-cell-style="getRowClass"
        >
          <el-table-column fixed type="index" label="序号" width="150"></el-table-column>
          <el-table-column prop="city" label="城市" width="250"></el-table-column>
          <el-table-column prop="TODAYNUM" label="交警" width="500"></el-table-column>
          <el-table-column prop="YESTERDAYNUM" label="公安" width="500" sortable></el-table-column>
          <el-table-column prop="TODAYPROPORTION" label="总计" width="500" sortable></el-table-column>
        </el-table>
  </div>
</template>

<script>
import echarts from "echarts";
import title from "@/components/UI_el/title.vue";
import { interf } from './config';
export default {
  name: "traceindexchart",
  props: {
    // order_value: {
    //   type: String,
    //   default: "1"
    // }
  },
  data() {
    return {
      indexDatas: [
        {index: "2.1", city: "西安",  TODAYNUM: "+0.3%", YESTERDAYNUM: "-0.1%",TODAYNUM:"0.8%" },
       { index: "1.1", city: "渭南",  TODAYNUM: "+0.3%", YESTERDAYNUM: "-0.1%" ,TODAYNUM:"2.8"}
      ]
    };
  },
  components: {
    mTile: title
  },
  mounted() {
  },
  methods: {
    getIndexData() {
      let that = this;
      //获取历史过车数据列表  GET_HIS_CAR_LIST_API
      interf.GET_HIS_CAR_LIST_API({
        id:""
      })
      .then(response=>{
        if (response && response.status == 200){
          var data=response.data;
          if(data.errcode==0){
            that.indexDatas=data.data;
            console.log(that.indexDatas)
            console.log("历史过车数据列表")
          }
        }
      })


    },
   
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
    },
  },
  destroyed() {}
};
</script>

<style scoped='true' lang='scss'>
.trace_index_chart {
  width: 100%;
  height: 45vh;
  .section{
    position:absolute;
    right:2vw;
    top:6vh;
    color: white;
    font-size: 0.9vw;
  }
  #exponentChart {
    width: 100%;
    height: 30vh;
    border:1px solid white;
  }
  .txt{
    height: 5vh;
    width: 100%;
    color: #cecece;
    line-height: 5vh;
  }
  
}
</style>
