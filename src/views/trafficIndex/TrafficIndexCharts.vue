<template>
  <div class="city_index_chart">
    <m-tile label="西安市拥堵指数分析"></m-tile>
    <div class='section'><i class='el-icon-alarm-clock'>历史最堵时段：7点、12点</i></div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="分时段分析" name="1"></el-tab-pane>
      <el-tab-pane label="近30天分析" name="2"></el-tab-pane>
    </el-tabs>
    <div id="exponentChart"></div>
    <div class='txt'>说明：指数越高，代表拥堵程度越严重</div>
  </div>
</template>

<script>
import echarts from "echarts";
import title from "@/components/UI_el/title.vue";
export default {
  name: "cityIndexChart",
  props: {
    data: {
      type: String,
      default: "1"
    }
  },
  data() {
    return {
      activeName: "1",
      option: {
        title: {
          text: "折线图堆叠"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          textStyle:{color:'white'},
          data: ["当天", "前一天", "上周同期"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel:{color:'white'},
          axisLine:{lineStyle:{color:'white'}},
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          type: "value",
          axisLine:{lineStyle:{color:'white'}},
          axisLabel:{color:'white'},
        },
        series: [
          {
            name: "当天",
            type: "line",
            stack: "总量",
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "前一天",
            type: "line",
            stack: "总量",
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "上周同期",
            type: "line",
            stack: "总量",
            data: [150, 232, 201, 154, 190, 330, 410]
          }
        ]
      },
      myChart:null
    };
  },
  components: {
    mTile: title
  },
  mounted() {
    if(!this.myChart){
      this.myChart = echarts.init(document.getElementById("exponentChart"));
    }
    this.myChart.setOption(this.option);
  },
  methods: {
    handleClick() {}
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
