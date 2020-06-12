<template>
  <div :id="c_id"></div>
</template>
<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      option: {
          color:['#1ef0f0','#FFDF05'],
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross',
                  crossStyle: {
                      color: '#999'
                  }
              }
          },
          toolbox: {
              feature: {
                  dataView: {show: true, readOnly: false},
                  magicType: {show: true, type: ['line', 'bar']},
                  restore: {show: true},
                  saveAsImage: {show: true}
              }
          },
          legend: {
              data: ['蒸发量', '降水量', '平均温度']
          },
          xAxis: [
              {
                  type: 'category',
                  data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                  axisLabel:{
                      show:true,
                      color:'white'
                  },
                  splitLine:{show:false},
                  axisPointer: {
                      type: 'shadow'
                  }
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  name: '水量',
                  min: 0,
                  max: 250,
                  interval: 50,
                  splitLine:{show:false},
                  axisLabel: {
                      formatter: '{value}',
                      color:'white'
                  }
              },
              {
                  type: 'value',
                  name: '温度',
                  min: 0,
                  max: 25,
                  interval: 5,
                  splitLine:{show:false},
                  axisLabel: {
                      formatter: '{value}',
                      color:'white'
                  }
              }
          ],
          series: [
              {
                  name: '蒸发量',
                  type: 'line',
                  data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
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
                  }
              },
              {
                  name: '平均温度',
                  type: 'line',
                  yAxisIndex: 1,
                  data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
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
                  }
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
          xdata:["2016-10-4",
              "2016-10-5",
              "2016-10-6",
              "2016-10-7",
              "2016-10-8",
              "2016-10-9",
              "2016-10-10",
              "2016-10-11",
              "2016-10-12"],
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
       this.option.xAxis.data = this.chart_data.xdata;
      this.option.yAxis[0].name=this.chart_data.legend[0];
      this.option.yAxis[1].name=this.chart_data.legend[1];
      this.option.series[0].name=this.chart_data.legend[0];
      this.option.series[1].name=this.chart_data.legend[1];
      this.option.series[0].data =this.chart_data.y1data;
      this.option.series[1].data =this.chart_data.y1data;
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