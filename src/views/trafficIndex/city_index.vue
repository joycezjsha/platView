<template>
  <div class="city-index-div">
    <div class="city-index_container boxstyle">
      <div class="city-index_title">
        <m-title label='城市拥堵排名' img_type=1 style='width:10vw;height:4vh;line-height: 4vh;'></m-title>
      </div>
      <m-tab :label="selectItem.city+'在全国排名'" :value='selectItem.order'></m-tab>
      <div class="city-index_content">
        <el-table
          :data="indexDatas"
          style="width: 100%"
          highlight-current-row
          @current-change="handleCurrentChange"
          height="55vh"
          :default-sort="{prop: 'week_radio', order: 'descending'}"
          :row-style="getRowClass"
          :header-row-style="getRowClass"
          :header-cell-style="getRowClass"
          @row-click="clickHandle"
        >
          <el-table-column fixed type="index" label="No" width="50"></el-table-column>
          <el-table-column prop="city" label="城市" width="60"></el-table-column>
          <el-table-column prop="index" label="拥堵指数"></el-table-column>
          <el-table-column prop="week_radio" label="同比上周" sortable></el-table-column>
          <el-table-column prop="his_radio" label="历史均值" sortable></el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="" :visible.sync="drawer" append-to-body>
      <traffic-inde-charts></traffic-inde-charts>
    </el-dialog>
    <module-area></module-area>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import blur from "@/blur";
import TrafficIndeCharts from "./TrafficIndexCharts.vue";
import moduleArea from "@/components/area/area.vue";
import mTitle from "@/components/UI_el/title_com.vue";
import mTab from '@/components/UI_el/tab.vue'
export default {
  name: "TCruise",
  data() {
    return {
      map: {},
      indexDatas: [
        { city: "西安", index: "2.1", week_radio: "+0.3%", his_radio: "-0.1%" },
        { city: "渭南", index: "1.1", week_radio: "+0.3%", his_radio: "-0.1%" }
      ],
      selectItem: { city: "西安", order: 8 },
      areaColors: [
        "#556B2F",
        "#00FFFF",
        "#0000EE",
        "#8A2BE2",
        "#c48f58",
        "#6bac91",
        "#5ad2a0",
        "#f18a52",
        "#656bd4",
        "#7ca0cd",
        "#88b7dc",
        "#a08bd3",
        "#be7fcd",
        "#30a2c4",
        "#c0ccd7",
        "#dbddab",
        "#9cd076",
        "#69b38b",
        "#437fb9",
        "rgb(255, 143, 109)"
      ],
      mapAddItems: {
        polygons: [],
        sourceList: [],
        lineList: [],
        popups: []
      },
      currentRow: null,
      drawer: false
    };
  },
  components: {
    TrafficIndeCharts,
    moduleArea,
    mTitle,
    mTab
  },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.map.repaint = true;
  },
  destroyed() {
    this.map.setPitch(0);
  },
  methods: {
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
    },
    clickHandle(item) {
      blur.$emit("setSelectItems", item.city, item.index);
      this.drawer = true;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    }
  }
};
</script>
<style scope lang='scss'>
@import "@/assets/css/color.scss";
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.city-index-div {
  position: fixed;
  z-index: 10;
  left: 1vw;
  width: 23vw;
  height: 68vh;
  top: 9vh;
  .city-index_container {
  width: 100%;
  height: 100%;
  .city-index_title {
    position: relative;
    width: 100%;
    font-family: Microsoft YaHei;
    font-size: 1vw;
    color: $color-white;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 2px 2% 0.6rem 2%;
    font-weight: bolder;
  }
  .xian_order {
    color: $color-white;
    width: 100%;
    height: 3vh;
    line-height: 3vh;
    text-align: center;
    font-size: 1.2vw;
    &--city {
      color: $color-active;
    }
  }
  .city-index_content {
    width: 98%;
    height: 85%;
    background-color: $color-bg-1;
    margin: 1%;

    &_table {
      overflow-y: auto;
    }
  }
}
}

</style>
