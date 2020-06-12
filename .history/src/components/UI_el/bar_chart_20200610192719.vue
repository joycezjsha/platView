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
            top:'15%',
            left:'15%',
            right:'15%',
            bottom:'15%'
          },
          tooltip: {
            trigger: 'axis'
        },
          xAxis: [
              {
                  type: 'category',
                  show:true,
                  axisLabel:{
                      show:true,
                      color:'white'
                  },
                  data:[],
                  axisTick:{show:false},
                  splitLine:{show:false},
                  axisLine:{show:false,lineStyle:{color:'white'}},
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
                  axisTick:{show:false},
                  axisLine:{show:false,lineStyle:{color:'white'}},
                  axisLabel: {
                      formatter: '{value}',
                      color:'white'
                  },
                  nameTextStyle:{
                    color:'white'
                  }
              }
          ],
          series: [
              {
                  name: '',
                  type: 'bar',
                  data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                  itemStyle: {
                    color: '#2f498a'
                  },
                  barWidth:18
              }
          ]
      },
      chart: null
    };
  },
  props: {
    chart_data: {
      type: Object,
      default: () => {
        return { 
          legend: [], 
          xdata:["2016-10-4",
              "2016-10-5",
              "2016-10-6",
              "2016-10-7",
              "2016-10-8",
              "2016-10-9",
              "2016-10-10",
              "2016-10-11",
              "2016-10-12"],
          ydata: ['204','201','198','189','192','182','177', '177','184']
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
  　　　　return this.chart_data.ydata
  　　}
  },
  components: {},
  mounted() {
      this.$nextTick(() => {
        this.initAccidentStaticsChart()
      })
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
      this.option.xAxis[0].data = this.chart_data.xdata;
      this.option.xAxis[0].name=this.chart_data.legend[1];
      this.option.yAxis[0].name=this.chart_data.legend[0];
      this.option.series[0].name=this.chart_data.legend[0];
      this.option.series[0].data =this.chart_data.ydata;
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