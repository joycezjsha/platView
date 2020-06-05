<template>
  <div class="hotcard" v-show="showhotcard">
      <div>
        <m-tab label='全部车辆监控' ></m-tab>
      </div>
      <div>
        <m-title class="title"  label='热点道路排名' ></m-title>
        <div>
             <el-table :data="indexDatas"
         
           style="width: 100%" height="100%" :default-sort = "{prop: 'Num', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
                <el-table-column fixed type="index" label="No" width="90"></el-table-column>
                <el-table-column prop="city"   label="道路"></el-table-column>
                <el-table-column prop="week_radio" label="进入两次" sortable></el-table-column>
                <el-table-column prop="his_radio" label="流出两次" sortable></el-table-column>
          </el-table>
        </div>
      </div>
      <div style="margin-top:1vh">
        <m-title class="title"  label='热点卡口排名' ></m-title>
        <div>
             <el-table :data="indexDatas"
           
           style="width: 100%" height="100%" :default-sort = "{prop: 'week_radio', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
                <el-table-column fixed type="index" label="No" width="90"></el-table-column>
                <el-table-column prop="city"   label="卡口名称"></el-table-column>
                <el-table-column prop="week_radio" label="过车辆" sortable></el-table-column>     
          </el-table>
        </div>
      </div>
  </div>
</template>

<script>
import mTitle from "@/components/UI_el/title_com.vue";
import mTab from '@/components/UI_el/tab.vue';
import blur from '../../blur.js'
export default {
    name:'hotcard',
    data(){
        return{
          showhotcard:false,
            indexDatas: [
                {"city":"西安","index":"2.1","week_radio":"+0.3%","his_radio":"-0.1%"},
                {"city":"渭南","index":"1.1","week_radio":"+0.3%","his_radio":"-0.1%"}
            ],
        }
    },
    components:{
        mTitle,
        mTab,
        blur
    },
    methods:{
        //设置表格样式
        getRowClass({ row, column, rowIndex, columnIndex }) {
            return "background:transparent;";
        },
    }
}
</script>

<style  scope lang='scss'>
.hotcard{
    position: fixed;
    top:6.388vh;
    right:13px;
    width:24.6875vw;
    height: 100%;
    .title{
        width: 8vw;
    }
}
   
</style>