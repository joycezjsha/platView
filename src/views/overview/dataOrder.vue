<template>
  <div class="city_index_chart">
    <m-tile label="过车数据回传排行"></m-tile>
    <el-table
          :data="indexDatas"
          style="width: 100%"
          highlight-current-row
          height="55vh"
          :default-sort="{prop: 'week_radio', order: 'descending'}"
          :row-style="getRowClass"
          :header-row-style="getRowClass"
          :header-cell-style="getRowClass"
        >
          <el-table-column fixed type="index" label="No" width="50"></el-table-column>
          <el-table-column prop="city" label="城市" width="60"></el-table-column>
          <el-table-column prop="index" label="拥堵指数"></el-table-column>
          <el-table-column prop="week_radio" label="同比上周" sortable></el-table-column>
          <el-table-column prop="his_radio" label="历史均值" sortable></el-table-column>
        </el-table>
  </div>
</template>

<script>
import echarts from "echarts";
import title from "@/components/UI_el/title.vue";
export default {
  name: "cityIndexChart",
  props: {
    order_value: {
      type: String,
      default: "1"
    }
  },
  data() {
    return {
      indexDatas: [
        { city: "西安", index: "2.1", week_radio: "+0.3%", his_radio: "-0.1%" },
        { city: "渭南", index: "1.1", week_radio: "+0.3%", his_radio: "-0.1%" }
      ]
    };
  },
  components: {
    mTile: title
  },
  mounted() {
  },
  methods: {
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
