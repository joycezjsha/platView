<template>
  <div :id="c_id"></div>
</template>
<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      option: {
        animation: false,
        grid:{
          left:40,
          right:40
        },
        legend: {
          right: '6%',
          data: ["模拟数据","温度"]
        },
        tooltip: {
          triggerOn: "none",
          position: function(pt) {
            return [pt[0], 130];
          }
        },
        xAxis: {
          type: "time",
          splitLine: {
            show: false
          },
          axisLabel: {
                inside: false,
                textStyle: {
                    color: '#fff'
                }
            }
        },
        yAxis: [
          {
            name: "模拟数据",
            type: "value",
            axisTick: {
              inside: true
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              inside: false,
              textStyle: {
                    color: '#fff'
                },
              formatter: "{value}\n"
            },
            z: 10
          },
          {
            type: "value",
            name: "温度",
            min: 0,
            max: 25,
            interval: 5,
            splitLine: {
              show: false
            },
            axisLabel: {
              textStyle: {
                    color: '#fff'
                },
              formatter: "{value} °C"
            }
          }
        ],
        grid: {
          top: 30,
          left: 30,
          right: 30,
          height: 160
        },
        dataZoom: [
          {
            type: "inside",
            throttle: 50
          }
        ],
        series: [
          {
            name: "模拟数据",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            sampling: "average",
            itemStyle: {
              color: "#8ec6ad"
            },
            stack: "a",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#8ec6ad"
                },
                {
                  offset: 1,
                  color: "#ffe"
                }
              ])
            },
            data: []
          },
          {
            name: "模拟数据",
            type: "line",
            smooth: true,
            stack: "a",
            symbol: "circle",
            symbolSize: 5,
            sampling: "average",
            itemStyle: {
              color: "#d68262"
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#d68262"
                },
                {
                  offset: 1,
                  color: "#ffe"
                }
              ])
            },
            data: []
          }
        ]
      },
      chart: null
    };
  },
  props: {
    flowchartsData:{
       type: Object,
       default: () =>{
         return{
            // legend: ["超速次数", "总检测数"], 
         }
       }
    },
    chart_data: {
      type: Object,
      default: () => {
        // return {
        //   //  legend: ["超速次数", "总检测数"], 
        //   legend:[],
        //    timelist:[],
        //    inlist: [],
        //    outlist:[] 
        //   };
        return { 
          legend: ["超速次数", "总检测数"], 
          y1data: [
              ["2016-10-4", 204],
              ["2016-10-5", 201],
              ["2016-10-6", 198],
              ["2016-10-7", 189],
              ["2016-10-8", 192],
              ["2016-10-9", 182],
              ["2016-10-10", 177],
              ["2016-10-11", 177],
              ["2016-10-12", 184]
            ], y2data:[
              ["2016-10-4", 34],
              ["2016-10-5", 33],
              ["2016-10-6", 33],
              ["2016-10-7", 37],
              ["2016-10-8", 39],
              ["2016-10-9", 30],
              ["2016-10-10", 27],
              ["2016-10-11", 18],
              ["2016-10-12", 18]
            ]
            };
      }
    },
    width:{
       type: String,
      default:'400px'
    },
    height:{
       type: String,
      default:'300px'
    },
    c_id:{
      type: String,
      default:'chart_id'
    }
  },
  watch:{
    newValue: {
      immediate: false,
      handler: function(cVAL, oVAL) {
        debugger;
        this.initAccidentStaticsChart();
      }
    }
  },
  computed: {
  　　newValue() {
  　　　　return this.chart_data.y1data
  　　}
  },
  components: {},
  mounted() {
      // this.$nextTick(() => {
      //   this.initAccidentStaticsChart()
      // })
  },
  destroyed(){
    // 清空echarts
    if(this.initAccidentStaticsChart){
          // this.initAccidentStaticsChart.dispose();
    }
  },
  methods: {
    /**
     * 生成警情分别类统计echarts
     */
    initAccidentStaticsChart() {
      if (!this.chart) {
        this.chart = echarts.init(document.getElementById(this.c_id));
      }
      this.option.legend.data = this.chart_data.legend;
      this.option.yAxis[0].name=this.chart_data.legend[0];
      this.option.yAxis[1].name=this.chart_data.legend[1];
      this.option.series[0].data =this.chart_data.y1data;
      this.option.series[1].data =this.chart_data.y2data;
      this.chart.setOption(this.option);
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/css/color.scss";
@mixin flex($direction, $justify, $align) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
#chart_id {
  width: 100%;
  height:100%;
}
</style>