<template>
  <div class="speed-measurement-statics">
      <div class="speed-measurement_title">
        <m-title :label='title' img_type=1></m-title>
        <div v-show='isShowReturn' class='return' @click='returnAll'><<返回全省</div>
        <m-tab label='设备总数' value='2328'></m-tab>
        <m-tab label='活跃龙门架设备数' value='2328'></m-tab>
        <m-tab label='今日回传过车数据' value='5316'></m-tab>
      </div>
      <div class="speed-measurement_content boxstyle">
          <div class="vehicle-statics--tab">
            <m-item :tabList='tabItems'></m-item>
          </div>
          <div class="vehicle-statics_sort">
            <div>
              <m-list-o :list='listItems'></m-list-o>
            </div>
            <div id='vehicle-statics_circle'></div>
          </div>
      </div>
      <div class="speed-measurement_order boxstyle">
        <m-title-com label='今日卡口数据回传排名:' img_type=1 style='width:12vw;'></m-title-com>
        <div class="speed-measurement_data">
          <el-table :data="tableDatas" style="width: 100%" height="100%" :default-sort = "{prop: 'week_radio', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
            <el-table-column fixed type="index" label="No" width="50"></el-table-column>
            <el-table-column prop="name" label="电警名称"></el-table-column>
            <el-table-column prop="value" label="过车辆" sortable></el-table-column>
          </el-table>
        </div>
      </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import echarts from 'echarts'
import m_item from '@/components/UI_el/tab_item.vue'
import m_tab from '@/components/UI_el/tab.vue'
import m_list from '@/components/UI_el/list.vue'
import m_list_o from '@/components/UI_el/list_o.vue'
import mTitleCom from "@/components/UI_el/title_com.vue";
import mTitle from "@/components/UI_el/title.vue";
export default {
  name: "TIndex",
  data() {
    return {
      map: {},
      title:'全省统计',
      isShowReturn:false,
      staticsData: {sum: 10,mainCount:0},
      staticsSort:[],
      statics_sort_option: {
        color: ["#2D55C3", "#333C73"],
        tooltip: {
          show: false,
          showContent: false
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["70%", "90%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "10",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [],
            label: {
              normal: {
                show: true,
                position: "center",
                formatter: function(argument) {
                  var html;
                  html = "本月业绩\r\n\r\n" + "50单";
                  return html;
                },
                textStyle: {
                  fontSize: 10,
                  color: "#39CCCC"
                }
              }
            }
          }
        ]
      },
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
      tableDatas:[
        {name:'十字路口002电警',value:'1222'},
        {name:'十字路口002电警',value:'1222'},
        {name:'十字路口002电警',value:'1222'}
      ],
      tabItems:['超速检测次数','平均行驶速度/限速'],
      listItems:[{'label':'超速次数',value:'12'},{'label':'总检测数',value:'12345'}]
    }
  },
  components:{mTab:m_tab,mList:m_list,mListO:m_list,mItem:m_item,mTitle,mTitleCom},
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(6);
    that.initMainStaticsChart();
    // this.initdeviceStaticsChart();
    // setTimeout(()=>{
        // that.initAccurCharts();
    // },1000);
  },
  destroyed() {
    this.flyRoutes = [];
    this.map.stop();
    let that = this;
    that.map.setPitch(0); //设置地图的俯仰角
  },
  methods: {
    /**
     * 生成警情分别类统计echarts
     */
    initdeviceStaticsChart(){
       if(!this.device_chart){
        this.device_chart = echarts.init(document.getElementById('speed-measurement_sort'));
      };
      // this.device_option.legend.data=['视频设备','电警','其他'];
      this.staticsSort=[{color:'#02FDF4',label:'视频设备',value:2328},{color:'#4D76F9',label:'电警',value:1232},{color:'#01D647',label:'其他',value:24}];
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
    },
     /**
     * 生成超速占比饼图echarts
     */
    initMainStaticsChart(){
       if(!this.sort_chart){
        this.sort_chart = echarts.init(document.getElementById('vehicle-statics_circle'));
      };
      this.statics_sort_option.series[0].data=[{name:'超速次数',value:120},{name:'总检测数',value:1200}];
      this.statics_sort_option.series[0].label.normal.formatter=function(c){
        return '10%';
      }
      this.sort_chart.setOption(this.statics_sort_option);
    },
    /**
     * 返回全省
     */
    returnAll(){
      this.isShowMainDev=true;
      this.isShowReturn=false;
      this.title='全省统计';
      this.getSumDev();
      this.initdeviceAnalysisChart();
      this.initAccurCharts();
    },
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;cursor:pointer;";
    }
  }
};
</script>
<style scoped='true' lang='scss'>
@import "@/assets/css/color.scss";
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.speed-measurement-statics {
  position: fixed;
  z-index: 10;
  right: 13px;
  width: 474px;
  height: 977px;
  top: 99px;
  color: white;
  .speed-measurement_title {
    position: relative;
    width: 96%;
    margin:0 auto;
    .return{
      position: absolute;
      left: 5%;
      cursor: pointer;
      color:$color-primary;
    }
    .return:hover{
      color:$color-primary;
    }
  }

  .speed-measurement_content {
    width:100%;
    height:237px;
    margin-top:44px;
    .vehicle-statics--tab {
      width: 100%;
      height: 5vh;
      @include flex(row, center);
      .vehicle-statics_sort {
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
    }
    #vehicle-statics_circle{
      width:50%;
      height:15vh;
      float:right;
    }
    #speed-measurement_sort {
      width:50%;
      height:15vh;
      float:left;
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

  .speed-measurement_order{
    width:100%;
    height:494px;
    margin-top:30px;
  }
}

</style>