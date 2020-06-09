<template>
  <div class="hotcard">
      <div>
        <m-tab label='全部车辆监控' ></m-tab>
      </div>
      <div class="hotroad" style="height:41.29vh;">
        <m-title class="title"  label='热点道路排名' ></m-title>
        <div >
             <el-table :data="indexDatas"
           style="width: 100%" height="41.29vh" :default-sort = "{prop: 'inNum', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
                <el-table-column fixed type="index" label="No" width="60"></el-table-column>
                <el-table-column prop="road"   label="道路"></el-table-column>
                <el-table-column prop="inNum" label="进入两次" sortable></el-table-column>
                <el-table-column prop="outNum" label="流出两次" sortable></el-table-column>
          </el-table>
        </div>
      </div>
      <div  class="hotroad" style="margin-top:2vh">
        <m-title class="title"  label='热点卡口排名' ></m-title>
        <div >
             <el-table :data="indexDatas1"
           style="width: 100%" height="41.29vh" :default-sort = "{prop: 'NUM', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
                <el-table-column fixed type="index" label="No" width="60"></el-table-column>
                <el-table-column prop="KKMC"   label="卡口名称"></el-table-column>
                <el-table-column prop="NUM" label="过车辆" sortable></el-table-column>     
          </el-table>
        </div>
      </div>
  </div>
</template>

<script>
import mTitle from "@/components/UI_el/title_com.vue";
import mTab from '@/components/UI_el/tab.vue';
import blur from '../../blur.js';
import { IMG } from "./config";
import { interf } from "./config";
export default {
    name:'hotcard',
    data(){
        return{
          showhotcard:false,
            indexDatas: [
                {"road":"","index":"","inNum":"","outNum":""}
                
                // {"city":"渭南","index":"1.1","week_radio":"+0.3%","his_radio":"-0.1%"}
            ],
            indexDatas1: [
                {"KKMC":"","index":"","NUM":""}
            ],
          
        }
    },
    components:{
        mTitle,
        mTab,
        blur
    },
    mounted(){
      
       let that = this;
        that.$store.commit("setRight", '26.5vw');
       that.getIndexDatas() 
       that.gettimeDatas()
       that.gettimesDatas()
    },
    methods:{
      // 今天，昨天，实时的数据
      gettimesDatas(){
        let that = this;
         blur.$on('getroadtimes',data=>{
          // console.log(data)
          that.indexDatas=data.data;
        })
        // 热点道路排名的数据
        blur.$on('getbaytimes',data=>{
          // console.log(data)
          that.indexDatas1=data.data;
        })
      },
      // 获取日历选择的数据
      gettimeDatas(){
        let that = this;
        // 热点道路排名的数据
        blur.$on('getroadData',data=>{
          // console.log(data)
          that.indexDatas=data.data;
        })
        // 热点道路排名的数据
        blur.$on('getbayData',data=>{
          // console.log(data)
          that.indexDatas1=data.data;
        })
        
      },
      getIndexDatas(){
        let that = this;
      // 车辆流动页面热点卡口 Vehicle/getHotspotBayonetRanking  GET_HOT_RANK_API
      interf.GET_HOT_RANK_API({
        id:"",
        stime:'1'
      })
      .then(response=>{
        if (response && response.status == 200){
            var data = response.data;
            // console.log(data)
            if (data.errcode == 0) {
                that.indexDatas1=data.data;
                // console.log(that.indexDatas1)
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
      // 车辆流动页面热点道路 Vehicle/getHotspotRoadRanking   GET_HOT_ROAD_API
        interf.GET_HOT_ROAD_API({
        id:"",
        stime:'1'
      })
      .then(response=>{
        if (response && response.status == 200){
            var data = response.data;
            // console.log(data)
            if (data.errcode == 0) {
                that.indexDatas=data.data;   
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
      //设置表格样式
      getRowClass({ row, column, rowIndex, columnIndex }) {
        return "background:transparent;";
      },
    }
}
</script>

<style  scope lang='scss'>
@import "@/assets/css/color.scss";
.hotcard{
    position: fixed;
    top:6.388vh;
    right:13px;
    width:24.6875vw;
    height: 100%;
    .title{
        width: 8vw;
    }
    .hotroad{
      height: 41.29vh;
      background-color: $color-bg-1;
      border:1px solid;
      border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
      
    }
}
   
</style>