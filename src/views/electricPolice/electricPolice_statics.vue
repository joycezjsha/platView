<template>
  <div class="electricPolice-statics">
    <div class="electricPolice-statics_container">
      <div class="electricPolice-statics_title">
        <div class="top borstyle" >
          <div class="title" v-if="showback">全省统计</div>
          <div class="back "  v-else @click="goback()">
            &lt;&lt; 返回全省
            <span v-if="dldm=='' && city!=''"  class="city">{{city}}</span>
            <span style="width:17vw;height:100%;position:absolute;left:30%;color:#fff;white-space:nowrap;" v-if="dldm!=''">{{name}}</span>
          </div>
        </div>
        <!-- <div>
          <i class="el-icon-collection-tag">全省统计</i>
        </div> -->
      </div>
      <div class="electricPolice-statics_content">
        <div>
          <m-tab style="margin-bottom:1.2vh" label='设备总数' icon="icon-shebei1" :value='numcount'></m-tab>
          <m-tab style="margin-bottom:1.2vh" label='近30天活跃电警'  icon="icon-dianjing" :value='thirtyActive'></m-tab>
          <m-tab style="margin-bottom:1.2vh" label='近30天抓拍违法数量' icon="icon-weifaguanli" :value='thirtyAlarm'></m-tab>
        </div>
        <div class="table_right boxstyle">
           <div class="electricPolice-statics_title">
            <div>
              <m-title style="width:12vw;margin-left:0.5vw" label='近30天违法抓拍量排名'></m-title>
              <!-- <i class="el-icon-collection-tag"></i> -->
            </div>
          </div>
          <div class="electricPolice-statics_data " style="padding:0 1vw;height:66vh">
            <el-table 
            :data="tableDatas" 
             v-loading='tableLoading'
            highlight-current-row
            style="width: 100%" height="100%" :default-sort = "{prop: 'NUM', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
              <el-table-column type="index" label="No" width="50"></el-table-column>
              <el-table-column show-overflow-tooltip  prop="city,ROADNAME" width="190" label="电警名称">
                <template slot-scope="scope">
                   [{{scope.row.city}}]{{scope.row.ROADNAME}}
                </template>
              </el-table-column>
              <el-table-column prop="NUM" label="抓拍量" sortable></el-table-column>
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
import echarts from 'echarts';
import m_tab from '@/components/UI_el/tab.vue';
import m_list from '@/components/UI_el/list.vue';
import blur from '../../blur.js';
import mTitle from "@/components/UI_el/title_com.vue";
export default {
  name: "TIndex",
  data() {
    return {
      map: {},
      city:'',
      dldm:'',
      name:'',
      XZQH:'',
      numcount:'',
      thirtyActive:'',
      thirtyAlarm:'',
      showback:true,
      tableLoading:false,
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
      tableDatas:[]
    }
  },
  components:{mTab:m_tab,mList:m_list,mTitle},
  mounted() {
    this.map = this.$store.state.map;
    this.getData();
    let that = this;
    that.getDevCountDatas();
    that.getThirtyAlarm();
  },
  destroyed() {
    this.flyRoutes = [];
    this.map.stop();
    let that = this;
    that.map.setPitch(0); //设置地图的俯仰角
  },
  methods: {
    /**
     * 点击返回按钮
    */ 
    goback() {
      let that = this;
      that.showback = true;
      that.XZQH='';
      that.dldm='';
      that.getDevCountDatas();
      that.getThirtyAlarm();
      blur.$emit("sendxzqu",'',''); //点击返回，传给地图数据
      blur.$emit("getelectricPolice",'')
      // blur.$emit("getelectricPoliceRoad",'')
    },
    /**
     * 接受传过来的数据
    */ 
    getData(){

      blur.$on("getDLDM",data=>{
        this.showback=false;
        this.dldm=data.DLDM;
        this.name=data.NAME;
        this.getDevCountDatas();
        this.getThirtyAlarm();
      })
      blur.$on("sendXZQHele",(data,city)=>{
        this.XZQH=data;
        this.city=city;
        this.getDevCountDatas();
        this.getThirtyAlarm();
        if(this.XZQH!=''){
          this.showback=false;
        }
      });
    },
    /**
     * 近30天违法抓拍排名 Electronic/getThirtyAlarm   GET_THIRTY_ALARM_API
    */
    getThirtyAlarm(){
      let that = this;
      let ThirtyData={}
      that.tableLoading = true;
      // 如果没有传入参数，默认显示
      if(that.XZQH!=''){
        ThirtyData.xzqh=that.XZQH;
      }
      if(that.dldm!=''){
        ThirtyData.dldm=that.dldm;
      }
        interf.GET_THIRTY_ALARM_API(ThirtyData)
        .then(response=>{
          that.tableLoading = false;
          if (response && response.status == 200){
            var data = response.data;
            if (data.errcode == 0) {
              that.tableDatas=data.data;
            }else{
              that.$message({
                message:  '近30天违法抓拍排名请求服务失败',
                type: "error",
                duration: 1500
                });
                that.tableLoading = false;
              }
            }
          })
          .catch(err=>{
            console.log(err);
          })
          .finally(() => {
            that.tableLoading = false;
          });
    },
    /**
     * 全省统计 Electronic/getDevCount  GET_PRO_STATIS_API
    */
    getDevCountDatas(){
      let that = this;
      let DevCountData={};
      // 如果没有传入参数，默认显示
      if(that.XZQH!=''){
        DevCountData.xzqh=that.XZQH;
      }
      if(that.dldm!=''){
        DevCountData.dldm=that.dldm;
      }
        interf.GET_PRO_STATIS_API(DevCountData)
        .then(response=>{
          if (response && response.status == 200){
            var data = response.data;
            if (data.errcode == 0) {
              that.numcount=data.data.numcount;
              that.thirtyActive=data.data.thirtyActive;
              that.thirtyAlarm=data.data.thirtyAlarm;
            }else{
              that.$message({
                message: '全省统计请求服务失败',
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
            that.tableLoading = false;
          });
    },
    
    
    /**
     * 获取统计数据
    */
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
    },
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
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
.electricPolice-statics {
  position: fixed;
  z-index: 10;
  right: 13px;
  width: 474px;
  height: 85vh;
  top: 9vh;
  color: white;
}
.electricPolice-statics_container {
  // width: 100%;
  // height: 100%;
  // background-color: $color-bg-1;
  // border: 1px solid $color-border-1;
  .electricPolice-statics_title {
    position: relative;
    width: 100%;
    // border-bottom: 0.1rem solid $color-border-1;
    font-family: Microsoft YaHei;
    font-size: 1vw;
    color: $color-white;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    // padding: 0.6rem 2%;
    font-weight: bolder;
  }
  .electricPolice-statics--tab {
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
  .electricPolice-statics_content {
    width: 98%;
    height: 85%;
    // background-color: $color-bg-1;
    margin: 1%;
    .electricPolice-statics_sort_list{
      width:50%;
      height:10vh;
      margin-top:2vh;
      float:right;
    }
    #electricPolice-statics_sort {
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

.electricPolice-statics .top {
  margin-top: 3px;
  overflow: hidden;
    width: 100%;
    .back {
      height: 34px;
      font-size: 16px;
      padding-top: 5px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(0, 198, 255, 1);
      background-color: $color-bg-1;
      border:1px solid;
      padding-left: 17px;
      cursor: pointer;
      overflow: hidden;
      border-image: linear-gradient(
          182deg,
          rgba(10, 148, 255, 1),
          rgba(255, 255, 255, 0)
        )
        1 1;
      .city{
        // width: 53px;
        height: 18px;
        position: absolute ;
        left: 45%;
        white-space:nowrap;
        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(254, 254, 254, 1);
        // padding-left: 108px;
        // text-align:center;
        // display:inline-block;
        cursor: pointer;
      }
    }
    .title {
      height: 34px;
      font-size: 18px;
      padding-top: 5px;
      text-align: center;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(254, 254, 254, 1);
      background-color: $color-bg-1;
      border: 1px solid;
      cursor: pointer;
      border-image: linear-gradient(
          182deg,
          rgba(10, 148, 255, 1),
          rgba(255, 255, 255, 0)
        )
        1 1;
    }
  }
  .bottom{
    margin-top: 3vh;
    height:771px;
  }
  .number{
    width:458px;
    height:37px;
    background:rgba(3,7,30,0.6);
    border:1px solid rgba(139,142,164,1);
    line-height: 37px;
    i{
      margin-left: 14px;
      margin-right: 12px;
    }
    .x1{
      float: right;
      margin-right: 16px;
    }
  }
.table_right{
  width:474px;
  height:771px;
}
</style>