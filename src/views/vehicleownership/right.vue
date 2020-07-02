<template>
  <div class="vehicle-right">
    <div class="vehicle-right_title">
      <m-title :label='title' img_type=1></m-title>
      <div v-show='isCity' class='return' @click='returnAll'>&lt;&lt;返回全省</div>
      <m-tab label='注册车辆总数' :value='vehicle.count' icon='icon-dianjing' icon_style='color:#FFFFFF' class='item'></m-tab>
      <m-tab label='客货车' :value='vehicle.khcnum' icon='icon-kakou' icon_style='color:#FFFFFF' class='item'></m-tab>
    </div>
    <div class='boxstyle'>
      <m-title-com label='保有量变化趋势' img_type=1 style='width:8vw;'></m-title-com>
      <m-line-chart :chart_data="chart_data" c_id='v-changechart' style='width:100%;height:28vh'></m-line-chart>
    </div>
    <div class='boxstyle' v-show='isCity'>
      <m-title-com label='区县排名' style='width:6vw;'></m-title-com>
      <div class='statics-table'>
         <el-table :data="tableDatas" style="width: 100%" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
          <el-table-column fixed type="index" label="No." width="50"></el-table-column>
          <el-table-column prop="name" label="区县"></el-table-column>
          <el-table-column prop="num" label="汽车保有量" sortable></el-table-column>
          <el-table-column prop="khcnum" label="占比" sortable></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {interf} from "./config";
import blur from "@/blur";
import mTitle from "@/components/UI_el/title.vue";
import m_tab from '@/components/UI_el/tab.vue'
import mTitleCom from "@/components/UI_el/title_com.vue";
import mLineChart from "@/components/UI_el/double_line_chart.vue";
export default {
    name:'right',
    data(){
      return{
        title:'全省统计',
        chart_data:{ 
          legend: ["注册车辆数", "同比上月(%)"], 
          xdata:[],
          y1data: [],
          y2data:[]},
        vehicle:{count:'',khcnum:''},
        tableDatas:[],
        isCity:false
      }
    },
    components:{
      mTab:m_tab,
      mTitle,
      mTitleCom,
      mLineChart
    },
    mounted(){
      this.getStatics();
      this.getVehicleTrend();
    },
    methods:{
    /*
     * 根据参数刷新界面
     * value：参数值 -行政区划
     */
    initStatics(data){
      this.title=data.name;
      this.getStatics(data.value);
      this.getVehicleTrend(data.value);
      this.isCity=true;
    },
     /**
     * 获取全省/各市汽车保有量统计数据
     */
    getStatics(code){
      let that=this;
      let params={};
      if(code) params.xzqh=code;
      interf.GET_CITY_STATICS_API(params).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
              that.vehicle=data.data;
            } else{
              that.$message({
                message: data.errmsg,
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
     * 获取汽车保有量变化趋势数据
     */
    getVehicleTrend(code){
      let that=this;
      let params={};
      if(code) params.xzqh=code;
      interf.GET_CITY_TREND_API(params).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
              let _data=that.chart_data;
              if(data.data && data.data.length>0){
                data.data.forEach(e=>{
                  _data.xdata.push(e.rq);
                  _data.y1data.push(e.num);
                  _data.y2data.push(e.ratio.split('%')[0]);
                });
                that.chart_data=_data;
              }else{
                that.chart_data={ 
                legend: ["注册车辆数", "同比上月(%)"], 
                xdata:[],
                y1data: [],
                y2data:[]}
              }
              
            } else{
              that.$message({
                message: data.errmsg,
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
     * 获取区县数据，并填充
     */
    getAreaTableData(){
      // let that=this;
      // let params={};
      // if(code) params.xzqh=code;
      // interf.GET_CITY_TABLE_API(params).then(response=>{
      //   if (response && response.status == 200){
      //      var data = response.data;
      //       if (data.errcode == 0) {
      //         let _data=that.chart_data;
      //         if(data.data && data.data.length>0){
      //           data.data.forEach(e=>{
      //             _data.xdata.push(e.rq);
      //             _data.y1data.push(e.num);
      //             _data.y2data.push(e.ratio.split('%')[0]);
      //           })
      //         }
      //         that.chart_data=_data;
      //       } else{
      //         that.$message({
      //           message: data.errmsg,
      //           type: "error",
      //           duration: 1500
      //         });
      //       }
      //   }
      // })
      // .catch(err=>{
      //    console.log(err);
      // })
      // .finally(() => {
      //   that.tableLoading = false;
      // });
    },
    /**
     * 设置表格样式
     */
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;cursor:pointer;";
    },
    /**
     * 返回全省
     */
    returnAll(){
      this.isCity=false;
      this.title='全省统计';
      this.getStatics();
      this.getVehicleTrend();
    },
    }
}
</script>

<style scoped lang="scss">
@import "@/assets/css/color.scss";
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.vehicle-right{
 position: fixed;
 right: 0px;
 top: 99px;
 width: 474px;
 height:977px;
 &_title{
   position: relative;
    width: 100%;
    color: $color-white;
    .return{
      position: absolute;
      left: 5%;
      top: 5%;
      cursor: pointer;
    }
    .return:hover{
      color:$color-primary;
    }
    .item{width:95%;margin:0 auto;margin-top:10px;
      margin-bottom:10px;}
 }
 >div:nth-child(2){
   margin-top:35px;
   width:474px;
   height:344px;
 }
 >div:nth-child(3){
   margin-top:45px;
   width:474px;
   height:422px;
   .statics-table{
      width: 90%;
      margin: 0 auto;
   }
 }
}
</style>