<template>
  <div class="device-statics">
    <div class="device-statics_container">
      <div class="device-statics_title">
        <div>
          <i class="el-icon-collection-tag">全省统计</i>
        </div>
      </div>
      <div class="device-statics_content">
        <div>
          <m-tab label='设备总数' value='2328'></m-tab>
          <m-tab label='近30天活跃电警' value='2328'></m-tab>
            <m-tab label='近30天抓拍违法数量' value='5316'></m-tab>
        </div>
        <div>
           <div class="device-statics_title">
            <div>
              <i class="el-icon-collection-tag">近30天违法抓拍量排名:</i>
            </div>
          </div>
          <div class="device-statics_data">
            <el-table :data="tableDatas" style="width: 100%" height="100%" :default-sort = "{prop: 'week_radio', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
              <el-table-column fixed type="index" label="No" width="50"></el-table-column>
              <el-table-column prop="name" label="电警名称"></el-table-column>
              <el-table-column prop="value" label="抓拍量" sortable></el-table-column>
            </el-table>
          </div>
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
import m_list from '@/components/UI_el/list.vue'
export default {
  name: "TIndex",
  data() {
    return {
      map: {},
      staticsData: {sum: 10,mainCount:0},
      staticsSort:[],
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
      ]
    }
  },
  components:{mTab:m_tab,mList:m_list},
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
    .device-statics_sort_list{
      width:50%;
      height:10vh;
      margin-top:2vh;
      float:right;
    }
    #device-statics_sort {
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
}

</style>