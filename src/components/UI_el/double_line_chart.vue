<template>
  <div :id="c_id"></div>
</template>
<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      option: {
          color:['#8ec6add6','#d68262bf'],
          grid:{
            top:'35%',
            left:'15%',
            right:'15%',
            bottom:'15%'
          },
          tooltip: {
            trigger: 'axis'
        },
          legend: {
            top:'6%',
            data: [],
            right:'5%',
            textStyle:{color:'white'}
          },
          xAxis: [
              {
                  type: 'category',
                  show:true,
                  axisLabel:{
                      show:true,
                      color:'white',
                      fontSize :10  
                  },
                  data:[],
                  splitLine:{show:false},
                  axisLine:{lineStyle:{color:'white'}},
                  // axisPointer: {
                  //     type: 'shadow'
                  // }
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  name: '',
                  min: 0,
                  splitLine:{show:false},
                  axisLine:{lineStyle:{color:'white'}},
                  axisLabel: {
                      formatter: '{value}',
                      color:'white',
                       fontSize :10  
                  },
                  nameTextStyle:{
                    color:'white'
                  }
              },
              {
                  type: 'value',
                  name: '',
                  min: 0,
                  axisLine:{lineStyle:{color:'white'}},
                  splitLine:{show:false},
                  axisLabel: {
                      formatter: '{value}',
                      color:'white',
                      fontSize :10  
                  },
                  nameTextStyle:{
                    color:'white'
                  }
              }
          ],
          series: [
              {
                  name: '',
                  smooth:true,
                  type: 'line',
                  data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                  areaStyle: {
                   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          { offset: 0, color: "#030b29" },
                          { offset: 0.5, color: "#002651" },
                          { offset: 1, color: "#f0f0f0" }
                        ])
                  }
              },
              {
                  name: '',
                  type: 'line',
                  smooth:true,
                  yAxisIndex: 1,
                  data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
                  areaStyle: {
                   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "#030b29" },
                        { offset: 0.5, color: "#2a4869" },
                        { offset: 1, color: "#00527b" }
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
          y1data: ['204','201','198','189','192','182','177', '177','184'],
          y2data:[34,33,33,37,39,30,27,18,18]
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
      this.option.xAxis[0].data = this.chart_data.xdata;
      this.option.yAxis[0].name=this.chart_data.legend[0];
      this.option.yAxis[1].name=this.chart_data.legend[1];
      this.option.series[0].name=this.chart_data.legend[0];
      this.option.series[1].name=this.chart_data.legend[1];
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
#chart_id{
  width: 100%;
  height:100%;
}
</style>