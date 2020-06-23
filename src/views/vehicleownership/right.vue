<template>
  <div class="vehicle-right">
    <div class="vehicle-right_title">
      <m-title :label='title' img_type=1></m-title>
      <div v-show='isShowReturn' class='return' @click='returnAll'>&lt;&lt;返回全省</div>
      <m-tab label='注册车辆总数' :value='vehicle.submit' icon='icon-dianjing' icon_style='color:#FFFFFF' class='item'></m-tab>
      <m-tab label='客货车' :value='vehicle.khcount' icon='icon-kakou' icon_style='color:#FFFFFF' class='item'></m-tab>
    </div>
    <div class='boxstyle'>
      <m-title-com label='保有量变化趋势' img_type=1></m-title-com>
      <m-line-chart :chart_data="chart_data" c_id='v-changechart' style='width:100%;height:28vh'></m-line-chart>
    </div>
    <div class='boxstyle'>
      <m-title-com label='区县排名' style='width:6vw;height:1vh;'></m-title-com>
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
        isShowReturn:false,
        chart_data:{},
        vehicle:{submit:12,khcount:15}
      }
    },
    components:{
      mTab:m_tab,
      mTitle,
      mTitleCom,
      mLineChart
    },
    mounted(){

    },
    methods:{
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
 height:900px;
 &_title{
   position: relative;
    width: 100%;
    margin-bottom: 9px;
    color: $color-white;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    .return{
      position: absolute;
      left: 5%;
      cursor: pointer;
    }
    .return:hover{
      color:$color-primary;
    }
    .item{width:90%;margin:0 auto;}
    .item>:nth-child(1){

      margin-bottom:10px;
    }
 }
 >div:nth-child(2){
   margin-top:45px;
   width:474px;
   height:344px;
 }
 >div:nth-child(3){
   margin-top:45px;
   width:474px;
   height:422px;
 }
}
</style>