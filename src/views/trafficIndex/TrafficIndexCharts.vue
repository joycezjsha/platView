<template>
  <div class="city_index_chart">
    <div class='section'><i class='el-icon-alarm-clock'>历史最堵时段：7点、12点</i></div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="分时段分析" name="1"></el-tab-pane>
      <el-tab-pane label="近30天分析" name="2"></el-tab-pane>
    </el-tabs>
    <div id="exponentChart" v-loading='tableLoading'></div>
    <div class='txt'>说明：指数越高，代表拥堵程度越严重</div>
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
    adcode: {
      type: String,
      default: "1"
    }
  },
  data() {
    return {
      activeName: "1",
      option: {
        
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
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
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
      zs_option: {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          textStyle:{color:'white'},
          data: ["指数"]
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
            name: "指数",
            type: "line",
            stack: "总量",
            data: [120, 132, 101, 134, 90, 230, 210]
          }
        ]
      },
      myChart:null,
      tableLoading:false
    };
  },
  watch:{
    adcode: {
      immediate: false,
      handler: function(cVAL, oVAL) {
        this.activeName='1';
        this.getCityRoadData();
      }
    }
  },
  components: {
    mTile: title
  },
  mounted() {
    this.getCityRoadData();
    this.map = this.$store.state.map;
  },
  methods: {
    handleClick(tab) {
      this.activeName=tab.name;
      this.getCityRoadData();
    },
    /**
     * 获取城市30天拥堵指数分析数据
     */
    getCityRoadData(){
      let _this=this;
      _this.tableLoading=true;
      _this.option.xAxis.data=[];
      _this.option.series[0].data=[];
      _this.option.series[1].data=[];
      _this.option.series[2].data=[];

      _this.zs_option.xAxis.data=[];
      _this.zs_option.series[0].data=[];

      if(this.activeName<2){
        interf.GET_ROAD_TAFFIC_RANGE_ANALYSIS_API({xzqh:_this.adcode}).then(response=>{
          if (response && response.status == 200){
            var data= response.data;
            if (data.errcode == 0) {
              _this.tableLoading=false;
              if(data.data.today && data.data.today.length>0){
                data.data.today.map(e=>{
                  _this.option.xAxis.data.push(e.time);
                  _this.option.series[0].data.push(e.zs);
                });
                data.data.yesterday.map(e=>{
                  _this.option.series[1].data.push(e.zs);
                });
                data.data.week.map(e=>{
                  _this.option.series[1].data.push(e.zs);
                });
              };
              if(!_this.myChart){
                _this.myChart = echarts.init(document.getElementById("exponentChart"));
              }
              _this.myChart.setOption(_this.option);
            }else{
              _this.tableLoading=false;
              _this.$message({
                message: data.errmsg,
                type: "error",
                duration: 1500
              });
            }
          }
        })
        .catch(err=>{
          console.log(err);
          _this.$message({
                message: data.errmsg,
                type: "error",
                duration: 1500
              });
        })
        .finally(() => {
          _this.tableLoading = false;
        });
      }else{
        interf.GET_ROAD_TAFFIC_ANALYSIS_API({xzqh:_this.adcode}).then(response=>{
          if (response && response.status == 200){
            var data= response.data;
            if (data.errcode == 0) {
              data.data.map(e=>{
                _this.zs_option.xAxis.data.push(e.date);
                _this.zs_option.series[0].data.push(e.zs);
              });
              if(!_this.myChart){
                _this.myChart = echarts.init(document.getElementById("exponentChart"));
              }
              _this.myChart.setOption(_this.zs_option);
            }else{
              _this.$message({
                message: data.errmsg,
                type: "error",
                duration: 1500
              });
            }
          }
        })
        .catch(err=>{
          console.log(err);
        })
        .finally(() => {
          _this.tableLoading = false;
        });
      }
      
    }
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
