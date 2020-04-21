<template>
  <div class="device-statics">
    <div class="device-statics_container">
      <div class="device-statics_title">
        <div>
          <i class="el-icon-collection-tag">全省统计</i>
        </div>
      </div>
      <m-tab></m-tab>
      <div class="device-statics--tab">
        <div>
          <span class="--tab-title">
            <i class="el-icon-bell"></i>警情总计
          </span>
          <span class="statics--tab--value">
            <span class="statics_value sum">{{staticsData.sum}}</span>
          </span>
        </div>
      </div>
      <div class="device-statics_content">
        <div class="device-statics_title">
          <div>
            <i class="el-icon-collection-tag">设备类型分析</i>
          </div>
        </div>
        <div id="device-statics_sort">
          
        </div>
        <div>
          <m-tab label='近30天活跃电警' value='2328'></m-tab>
          <m-tab label='联通卡口设备' value='2328'></m-tab>
            <m-tab label='联通视频设备' value='2328'></m-tab>
              <m-tab label='连通龙门架设备' value='2328'></m-tab>
               <m-tab label='连通区间测速设备' value='2328'></m-tab>
        </div>
        <div>
          重点设备监测：
          <div id="accurCreateChange"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import echarts from 'echarts'
import m_tab from '@/components/UI_el/tab.vue'
export default {
  name: "TIndex",
  data() {
    return {
      map: {},
      staticsData: {sum: 10,mainCount:0},
      device_option: {
        color:['#02FDF4','#4D76F9','#01D647'],
          tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
              orient: 'vertical',
              right: 10,
              top:10,
              data: [],
              textStyle:{color:'white'}
          },
          series: [
              {
                  name: '警情统计',
                  type: 'pie',
                  radius: ['40%', '60%'],
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
      device_chart:null,
      sg_sort_data: [
        { name: "机动车与机动车", value: "12", radio: "32%" },
        { name: "机动车与非机动车", value: "122", radio: "32%" },
        { name: "行人", value: "2", radio: "32%" }
      ],
      accurChangeOption:{
        grid:{top:'2%'},
        xAxis: {
            // data:['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'],
            // axisLabel: {
            //     inside: true,
            //     textStyle: {
            //         color: '#fff'
            //     }
            // },
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
  components:{mTab:m_tab},
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.getIndexData();
    this.initdeviceStaticsChart();
    // setTimeout(()=>{
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
    initdeviceStaticsChart(){
       if(!this.device_chart){
        this.device_chart = echarts.init(document.getElementById('device-statics_sort'));
      };
      this.device_option.legend.data=['视频设备','电警','其他'];
      this.device_option.series[0].data=[{name:'视频设备',value:2328},{name:'电警',value:1232},{name:'其他',value:24}]
      this.device_chart.setOption(this.device_option);
    },
    /**
     * 生成设备重点监测趋势echarts
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
.device-statics {
  position: fixed;
  z-index: 10;
  right: 1vw;
  width: 17vw;
  height: 85vh;
  top: 9vh;
  color: white;
}
.device-statics_container {
  width: 100%;
  height: 100%;
  background-color: $color-bg-1;
  border: 1px solid $color-border-1;
  .device-statics_title {
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
  .device-statics--tab {
  width: 100%;
  height: 5vh;

    > div {
      width: 100%;
      height: 5vh;
      font-size: 0.8vw;
      @include flex(row, center);

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
  .device-statics_content {
    width: 98%;
    height: 85%;
    background-color: $color-bg-1;
    margin: 1%;

    #device-statics_sort {
      width:100%;
      height:15vh;
    }
    #sumCountChange{
      width:100%;
      height:25vh;
    }
    #accurCreateChange{
      width:100%;
      height:25vh;
    }
  }
}

</style>