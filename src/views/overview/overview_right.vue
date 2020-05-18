<template>
  <div class="overview-info">
    <div class="overview-info_container">
      <div class="boxstyle">
        <div>
          <m-title label='省内车辆运行态势' img_type=1 style='width:10vw;'></m-title>
        </div>
        <div class="overview-info_sort">
          <div>
            <m-list-o :list='listItems'></m-list-o>
          </div>
          <div id="overview-info_sort">
            
          </div>
        </div>
        <!-- <div class="overview-info_content">
          <div class="overview-info--tab">
            <div>
              超速检测次数
            </div>
            <div>
              平均行驶速度/限速
            </div>
          </div>
          <div id="overview-info_sort">
            
          </div>
        </div> -->
      </div>
      <div class="boxstyle">
        <m-title label='进出陕车辆趋势' img_type=1 style='width:12vw;'></m-title>
        <!-- <div id="sumCountChange"></div> -->
        <m-line-chart c_id='overViewsumCountChange' style='width:100%;height:18vh'></m-line-chart>
      </div>
      <div class="boxstyle">
        <m-title label='车辆保有量' img_type=1  style='width:7vw;'></m-title>
        <div id="accurCreateChange"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import echarts from 'echarts'
import mTitle from "@/components/UI_el/title_com.vue";
import m_list from '@/components/UI_el/list_o.vue'
import mLineChart from "@/components/UI_el/double_line_chart.vue";
export default {
  name: "overview_right",
  data() {
    return {
      map: {},
      listItems:[{'label':'超速次数',value:'12'},{'label':'总检测数',value:'12345'}],
      staticsData: {sum: 10,mainCount:0},
      accident_option: {
        color:['#02FDF4','#4D76F9','#01D647'],
          tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: [
              {
                  name: '车辆运行态势',
                  type: 'pie',
                  radius: ['30%', '50%'],
                  avoidLabelOverlap: false,
                  label: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      label: {
                          show: true,
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  },
                  labelLine: {
                      show: false
                  },
                  data: [
                     
                  ]
              }
          ]
      },
      accident_chart:null,
      sg_sort_data: [
        { name: "机动车与机动车", value: "12", radio: "32%" },
        { name: "机动车与非机动车", value: "122", radio: "32%" },
        { name: "行人", value: "2", radio: "32%" }
      ],
      countChangeOption:{
        title: {
            text: '特性示例：渐变色 阴影 点击缩放',
            subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
        },
        xAxis: {
            data:['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'],
            axisLabel: {
                inside: true,
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            z: 10
        },
        yAxis: {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#999'
                }
            }
        },
        dataZoom: [
            {
                type: 'inside'
            }
        ],
        series: [
          //   { // For shadow
          //     type: 'bar',
          //     itemStyle: {
          //         color: 'rgba(0,0,0,0.05)'
          //     },
          //     barGap: '-100%',
          //     barCategoryGap: '40%',
          //     data: dataShadow,
          //     animation: false
          // },
          {
              type: 'bar',
              itemStyle: {
                  color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                          {offset: 0, color: '#83bff6'},
                          {offset: 0.5, color: '#188df0'},
                          {offset: 1, color: '#188df0'}
                      ]
                  )
              },
              emphasis: {
                  itemStyle: {
                      color: new echarts.graphic.LinearGradient(
                          0, 0, 0, 1,
                          [
                              {offset: 0, color: '#2378f7'},
                              {offset: 0.7, color: '#2378f7'},
                              {offset: 1, color: '#83bff6'}
                          ]
                      )
                  }
              },
              data: [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220]
          }
        ]
      },
      countChart:null,
      accurChangeOption:{
        title: {
            text: '特性示例：渐变色 阴影 点击缩放',
            subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
        },
        xAxis: {
            data:['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'],
            axisLabel: {
                inside: true,
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            z: 10
        },
        yAxis: {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#999'
                }
            }
        },
        dataZoom: [
            {
                type: 'inside'
            }
        ],
        series: [
          //   { // For shadow
          //     type: 'bar',
          //     itemStyle: {
          //         color: 'rgba(0,0,0,0.05)'
          //     },
          //     barGap: '-100%',
          //     barCategoryGap: '40%',
          //     data: dataShadow,
          //     animation: false
          // },
          {
              type: 'bar',
              itemStyle: {
                  color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                          {offset: 0, color: '#83bff6'},
                          {offset: 0.5, color: '#188df0'},
                          {offset: 1, color: '#188df0'}
                      ]
                  )
              },
              emphasis: {
                  itemStyle: {
                      color: new echarts.graphic.LinearGradient(
                          0, 0, 0, 1,
                          [
                              {offset: 0, color: '#2378f7'},
                              {offset: 0.7, color: '#2378f7'},
                              {offset: 1, color: '#83bff6'}
                          ]
                      )
                  }
              },
              data: [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220]
          }
        ]
      },
      accurChart:null
    }
  },
  components: {
    mTitle,
    mLineChart,
    mListO:m_list
  },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.getIndexData();
    this.initAccidentStaticsChart();
    // setTimeout(()=>{
        // that.initSumCharts();
        that.initAccurCharts();
    // },1000);
  },
  destroyed() {
    this.flyRoutes = [];
    this.map.stop();
    let that = this;
    that.map.setPitch(0); //设置地图的俯仰角
  },
  methods: {
    //获取统计数据
    getIndexData() {
      let that = this;
    },
    /**
     * 生成警情分别类统计echarts
     */
    initAccidentStaticsChart(){
       if(!this.accident_chart){
        this.accident_chart = echarts.init(document.getElementById('overview-info_sort'));
      };
      this.accident_option.series[0].data=[{name:'超速次数',value:120},{name:'总检测数',value:1200}]
      this.accident_chart.setOption(this.accident_option);
    },
    /**
     * 生成发生数量趋势echarts
     */
    initSumCharts(){
      if(!this.countChart){
        this.countChart = echarts.init(document.getElementById('sumCountChange'));
      };
      this.countChart.setOption(this.accurChangeOption);
    },
    /**
     * 生成重大事故发生趋势echarts
     */
    initAccurCharts(){
      if(!this.accurChart){
        this.accurChart = echarts.init(document.getElementById('accurCreateChange'));
      };
      this.accurChart.setOption(this.accurChangeOption);
    }
  }
};
</script>
<style scope='true' lang='scss'>
@import "@/assets/css/color.scss";
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.overview-info {
  position: fixed;
  z-index: 10;
  right: 1vw;
  width: 17vw;
  height: 80vh;
  top: 9vh;
  color: white;
}
.overview-info_container {
  width: 100%;
  height: 100%;
  background-color: $color-bg-1;
  // border: 1px solid $color-border-1;
  .overview-info_title {
    position: relative;
    width: 96%;
    border-bottom: 0.1rem solid $color-border-1;
    font-family: Microsoft YaHei;
    font-size: 1vw;
    color: $color-white;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 0.6rem 2%;
    font-weight: bolder;
  }
  .overview-info--tab {
    width: 100%;
    height: 5vh;
   @include flex(row, center);

    > div {
      width: 100%;
      height: 5vh;
      font-size: 0.8vw;
      @include flex(row, center);
      border: 1px solid $color-text-normal;
      margin: 2%;

      .--tab-title {
        font-size: 0.9vw;
        width: 40%;
        @include flex(row, center);
      }
      .statics--tab--value {
        width: 60%;
        @include flex(row, center);
        .statics_value {
          color: $color-active;
        }
        .statics_value.sum {
          font-size: 1.4vw;
        }
      }
      .--tab-title {
        .el-icon-bell:before {
          font-size: 1.5vw;
          color: #e70101;
          font-weight: 600;
        }
      }
    }
}
  .overview-info_content {
    width: 98%;
    height: 85%;
    background-color: $color-bg-1;
    margin: 1%;

    #overview-info_sort {
      width:100%;
      height:15vh;
    }
  }
  .overview-info_sort {
  width:90%;
  height:8vh;
  margin:2vh auto;
  @include flex(row, center,center);
  >div{
    @include flex(row, center,center);
    width:50%;
  }
  >div:nth-child(2){
    height: 100%;
    width: 40%;
  }
}
  >div{
    width:100%;}
  >div:nth-child(2),>div:nth-child(3){
    margin-top:5%;
  }
  #accurCreateChange{
    width:100%;
    height:25vh;
  }
}

</style>