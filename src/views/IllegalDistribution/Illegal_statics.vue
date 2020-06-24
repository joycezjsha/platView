<template>
  <div class="accident-statics">
    <div class="accident-statics_container">
      <div class="accident-statics_title top boxstyle">
        <div class="title" v-if="showback==true" >全省统计</div>
          <div class="back" v-else @click="goback()" >&lt;&lt; 返回全省
            <span> {{city}}</span>
          </div>
      </div>
      <!-- 点击中间的三个按钮，切换对应的template -->
      <div v-show="isShow=='1'">
        <div class="accident-statics--tab">
          <div>
            <span class="--tab-title">
              <i class="el-icon-bell"></i>全部违法数量总计
            </span>
            <span class="statics--tab--value">
              <span class="statics_value sum">{{staticsData.sum}}</span>
            </span>
          </div>
          <div>
            <span>超速行驶：{{staticsData.over}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>尾号限行：{{staticsData.lastNumberLimit}}</span>
          </div>
        </div>
        <div class="accident-statics_content Top5">
          <m-title label='违法类别Top5' style='width:7vw;margin-left:1vw'></m-title>
          <div id="accident-statics_sort"></div>
        </div>
      </div>
      <!-- 点击中间的三个按钮，切换对应的div style="paddin:1vh 1vw" style="paddin:1vh 1vw" -->
        <div v-show="isShow=='2'">
          <div class="speed">
            <m-tab label='超速违法数量总计' :value=speed.NUM></m-tab>
          </div>
          <div class="speedecharts" >
            <m-title  label='超速违法分类' style='width:9vw;margin-left:1vw'></m-title>
          </div>
        </div>
      <!-- 点击中间的三个按钮，切换对应的div -->
         <div v-show="isShow=='3'">
            <div class="speed" >
              <m-tab  label='违法限行数量总计' :value=countnum></m-tab>
            </div>
            <div class="speedecharts">
              <m-title label='限行日期分布' style='width:9vw;margin-left:1vw'></m-title>
            </div>
         </div>
         
      <!-- 高发道路排名 -->
      <div class='accident-statics_table'>
          <div class="accident-statics_title">
            <m-title label='高发道路排名' style='width:9vw;'></m-title>
          </div>
          <div style="padding:0 1vw">
            <el-table :data="indexDatas" style="width: 100%" height="80%" :default-sort = "{prop: 'NUM', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
              <el-table-column fixed type="index" label="No" width="50"></el-table-column>
              <el-table-column prop="roadName" label="道路名称"></el-table-column>
              <el-table-column prop="NUM" label="违法数量" sortable></el-table-column>
            </el-table>
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
import blur from '../../blur.js';
import mTitle from '@/components/UI_el/title_com.vue';
import mLineChart from "@/components/UI_el/double_line_chart.vue";
export default {
  name: "TIndex",
  data() {
    return {
      showback:true, //是否显示返回按钮
      map: {},
      speed:{
        NUM:''
      },
      illegal:{
        NUM:''
      },
      isShow:'1',  //默认显示全部违法 2--超速  3--限行
      staticsData: {
        sum:'',
        over:'',
        lastNumberLimit:''
      },
      accident_option: {
        color:['#02FDF4','#4D76F9','#01D647'],
          tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
              orient: 'vertical',
              right: 20,
              top:50,
              data: [],
              textStyle:{color:'white'}
          },
          series: [
              {
                  name: '违法类别',
                  type: 'pie',
                  radius: ['50%', '70%'],
                  center: ['40%', '50%'],  
                  avoidLabelOverlap: false,
                  label: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      label: {
                          show: true,
                          fontSize: '15',
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
      indexDatas: [
        {"roadName":"","index":"","NUM":""}
        // ,{"city":"渭南","index":"1.1","week_radio":"+0.3%","his_radio":"-0.1%"}
      ]
    }
  },
  components: { mTitle,mLineChart,mTab:m_tab },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.getIndexData();
    this.initAccidentStaticsChart();
    this.getData()
    this.getAllProvinceIllegalStatisticsDatas();
    this.getIllegalAnalysisDatas();

  },
  destroyed() {
    this.flyRoutes = [];
    this.map.stop();
    let that = this;
    that.map.setPitch(0); //设置地图的俯仰角
  },
  methods: {
    /**
     * blur.$emit('getIndex',this.tableIndex)
     */
    getData(){
      blur.$on('getIndex',data=>{
        this.isShow=data;
        if(this.isShow==2){
          this.getSpeedingViolationDatas()
        }
        if(this.isShow==3){
          this.getlastTrafficRestrictionDatas()
        }
      })
      blur.$on('getxzqh',data=>{
        this.xzqh=xzqh;
        if(this.isShow==1){
          this.getAllProvinceIllegalStatisticsDatas(this.xzqh);
          this.getIllegalAnalysisDatas(xzqh);
        }
        if(this.isShow==2){
          this.getSpeedingViolationDatas(this.xzqh);
        }
        if(this.isShow==3){
          this.getlastTrafficRestrictionDatas(this.xzqh)
        }
        
      })
    },
    /**
     * 尾号限行 IllegalAnalysis/getlastTrafficRestriction  GET_LAST_TRAFF_API
    */
   getlastTrafficRestrictionDatas(){
     let that = this;
      let param={};
      if(xzqh!=undefined){
        param.xzqh=xzqh;
      }
      interf.GET_LAST_TRAFF_API(param)
     .then(response=>{
        if(response && response.status==200){
          var data = response.data;
          if(data.errcode == 0){
            that.illegal.NUM=data.data.NUM;
          }else{
            that.$message({ 
              message: data.errmsg,
              type: "error",
              duration: 1500
              });
          }
        }
      })
      .catch(err=>{
        console.log(err);
      })
      .finally(() => { 
        that.tableLoading = false; 
      });
   },
    /**
    * 超速违法 IllegalAnalysis/getSpeedingViolation   GET_SPEED_VIOLA_API
    */
    getSpeedingViolationDatas(){
       let that = this;
      let param={};
      if(xzqh!=undefined){
        param.xzqh=xzqh;
      }
      interf.GET_SPEED_VIOLA_API(param)
     .then(response=>{
        if(response && response.status==200){
          var data = response.data;
          if(data.errcode == 0){
            that.speed.NUM=data.data.NUM;
          }else{
            that.$message({ 
              message: data.errmsg,
              type: "error",
              duration: 1500
              });
          }
        }
      })
      .catch(err=>{
        console.log(err);
      })
      .finally(() => { 
        that.tableLoading = false; 
      });
    },
    /**
     * 高发道路排名  IllegalAnalysis/getIllegalAnalysis   GET_ILL_ANALYSIS_API
    */
   getIllegalAnalysisDatas(xzqh){
     let that = this;
      let param={};
      if(xzqh!=undefined){
        param.xzqh=xzqh;
      }
      interf.GET_ILL_ANALYSIS_API(param)
     .then(response=>{
        if(response && response.status==200){
          var data = response.data;
          if(data.errcode == 0){
            that.indexDatas=data.data;
          }else{
            that.$message({ 
              message: data.errmsg,
              type: "error",
              duration: 1500
              });
          }
        }
      })
      .catch(err=>{
        console.log(err);
      })
      .finally(() => { 
        that.tableLoading = false; 
      });
   },
    /**
     * 全省统计  IllegalAnalysis/getAllProvinceIllegalStatistics  GET_ILL_PRO_STATIS_API
    */
    getAllProvinceIllegalStatisticsDatas(xzqh){
      let that = this;
      let param={};
      if(xzqh!=undefined){
        param.xzqh=xzqh;
      }
      interf.GET_ILL_PRO_STATIS_API(param)
     .then(response=>{
        if(response && response.status==200){
          var data = response.data;
          if(data.errcode == 0){
            that.staticsData.sum=data.data.COUNTNUM;
            that.staticsData.over=data.data.SNUM;
            that.staticsData.lastNumberLimit=data.data.TRNUM;
          }else{
            that.$message({ 
              message: data.errmsg,
              type: "error",
              duration: 1500
              });
          }
        }
      })
      .catch(err=>{
        console.log(err);
      })
      .finally(() => { 
        that.tableLoading = false; 
      });
    },
    //获取统计数据
    getIndexData() {
      let that = this;
    },
    /**
     * 生成警情分别类统计echarts
     */
    initAccidentStaticsChart(){
       if(!this.accident_chart){
        this.accident_chart = echarts.init(document.getElementById('accident-statics_sort'));
      };
      this.accident_option.legend.data=['122','互联网','视频巡查'];
      this.accident_option.series[0].data=[{name:'122',value:120},{name:'互联网',value:120},{name:'视频巡查',value:10}]
      this.accident_chart.setOption(this.accident_option);
    },
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
                return "background:transparent;";
   },
    /**
     * 获取高发道路排名
     */
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
.accident-statics {
  position: fixed;
  z-index: 10;
  right: 1vw;
  width: 474px;
  top: 9vh;
  color: white;
}
.accident-statics_container {
  width: 100%;
  height: 100%;
  .accident-statics_title {
    position: relative;
    width: 100%;
    font-family: Microsoft YaHei;
    font-size: 1vw;
    color: $color-white;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    font-weight: bolder;
  }
  .accident-statics--tab {
  width: 100%;
  height:153px;
  margin-bottom: 19px;
  background:rgba(2,6,31,0);
  border:1px solid;
  border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;

    > div {
      width: 100%;
      height: 5vh;
      font-size: 0.8vw;
      @include flex(row, center);

      .--tab-title {
        font-size: 0.9vw;
        width: 60%;
        @include flex(row, center);
      }
      .statics--tab--value {
        width: 40%;
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
  .accident-statics_content {
    width:474px;
    height:299px;
    background-color: $color-bg-1;
    margin-bottom: 10px;
    border:1px solid;
    border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
    #accident-statics_sort {
      width:100%;
      height:80%;
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
.accident-statics .top{
  width: 100%;
  height:34px;
  background-color: $color-bg-1;
  border:1px solid;
  border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
  margin-bottom: 1vh;
  .back{
        height:34px;
        font-size:16px;
        padding-top: 5px;
        font-family:Source Han Sans CN;
        font-weight:400;
        color:rgba(0,198,255,1);
        padding-left: 17px;
        cursor:pointer;
        span{
          width:53px;
          height:18px;
          font-size:18px;
          font-family:Source Han Sans CN;
          font-weight:400;
          color:rgba(254,254,254,1);
          padding-left: 108px;
          cursor:pointer;
        }
      }
     .title{
        width: 100%;
        height:34px;
        font-size:18px;
        padding-top: 5px;
        text-align: center;
        font-family:Source Han Sans CN;
        font-weight:400;
        color:rgba(254,254,254,1);
        cursor:pointer;
      }
}
.accident-statics_table{
  width:474px;
  height:299px;
  background:rgba(2,6,31,0);
  border:1px solid;
  border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
}
.accident-statics .speed{  
  width:474px;
  height:69px;
  padding:5px;
  background:rgba(2,6,31,0);
  border:1px solid;
  border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
}
.accident-statics .speedecharts{
  width:474px;
  height:299px;
  margin-top: 29px;
  margin-bottom: 29px;
  background:rgba(2,6,31,0);
  border:1px solid;
  border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
}
</style>