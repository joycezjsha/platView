<template>
  <div class="city_index_chart">
    <!-- <m-tile  label="过车数据回传排行"></m-tile> -->
    <m-tile  :label="order_value==1 ? '今日轨迹接口调用情况':'过车数据回传排行'"></m-tile>
    <!-- <m-tile  label="今日轨迹接口调用情况" ></m-tile> -->
    <div>
      <el-table
          v-show="order_value==0"
          :data="indexDatascar"
          style="width: 100%"
          highlight-current-row
          height="55vh"
          :default-sort="{prop: 'TODAYNUM', order: 'descending'}"
          :row-style="getRowClass"
          :header-row-style="getRowClass"
          :header-cell-style="getRowClass"
    >
          <el-table-column fixed type="index" label="No" width="60"></el-table-column>
          <el-table-column prop="YJDFZJG" label="城市"  ></el-table-column>
          <el-table-column prop="TODAYNUM" label="今日上传" ></el-table-column>
          <el-table-column prop="YESTERDAYNUM" label="昨日上传"  sortable></el-table-column>
          <el-table-column prop="TODAYPROPORTION" label="今日上传占比"  sortable></el-table-column>
      </el-table>
    </div>
    <div>
      <el-table
          v-show="order_value==1"
          :data="indexDatas"
          style="width: 100%"
          highlight-current-row
          height="55vh"
          :default-sort="{prop: 'YESTERDAYNUM', order: 'descending'}"
          :row-style="getRowClass"
          :header-row-style="getRowClass"
          :header-cell-style="getRowClass"
        >
          <el-table-column fixed type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="city" label="城市" ></el-table-column>
          <el-table-column prop="反恐怖" label="反恐怖" sortable></el-table-column>
          <el-table-column prop="公安部" label="公安部" sortable></el-table-column>
          <el-table-column prop="行动技术" label="行动技术" sortable></el-table-column>
          <el-table-column prop="刑侦" label="刑侦"  sortable></el-table-column>
          <el-table-column prop="TODAYPROPORTION" label="总计"  sortable></el-table-column>
        </el-table>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import echarts from "echarts";
import title from "@/components/UI_el/title.vue";
export default {
  name: "cityIndexChart",
  props: {
    order_value: {
      type: String,
      default: ""
    },
    // indexDatascar,
  },
  data() {
    return {
      indexDatascar: [
        {
          //  'YJDFZJG': "", 
          // //  'index': "2.1", 
          //  'TODAYNUM': "",
          //  'YESTERDAYNUM': "",
          //  'TODAYPROPORTION':"" 
          },
        { city: "渭南", index: "1.1", TODAYNUM: "+0.3%", YESTERDAYNUM: "-0.1%",TODAYPROPORTION:"8.4" }
      ],
      indexDatas: [
        {
          //  'YJDFZJG': "", 
          // //  'index': "2.1", 
          //  'TODAYNUM': "",
          //  'YESTERDAYNUM': "",
          //  'TODAYPROPORTION':"" 
          },
        { city: "渭南", index: "1.1", TODAYNUM: "+0.3%", YESTERDAYNUM: "-0.1%",TODAYPROPORTION:"8.4" }
      ],
    
    };
  },
  components: {
    mTile: title
  },
  mounted() {

  },
  methods: {
    //  getIndexData() {
    //   let that = this;
    //   //获取历史过车数据列表  GET_HIS_CAR_LIST_API
    //   interf.GET_HIS_CAR_LIST_API({
    //     id:""
    //   })
    //   .then(response=>{
    //     if (response && response.status == 200){
    //       var data=response.data;
    //       console.log(data)
    //       if(data.errcode==0){
    //         that.indexDatascar=data.data;
    //         console.log(that.indexDatas)
    //       }
    //     }
    //   })
    // },
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
    },
  },
  destroyed() {}
};
</script>

<style scoped='true' lang='scss'>
.city_index_chart {
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
