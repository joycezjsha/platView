<template>
  <div class="ranking boxstyle">
      <!-- <div class="rank" style="border:#0A94FF">汽车保有量排名</div> -->
      <div  class="rank"  style="border:#0A94FF">
        <m-title label='汽车保有量排名' style='width:10vw;'></m-title>
      </div>
      <div class='ranking--table'>
        <el-table ref='cityTable' :data="tableDatas" style="width: 100%" highlight-current-row @row-click='handle' :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass" >
          <el-table-column type="index" label="No." width="50"></el-table-column>
          <el-table-column prop="name" label="管理部门"  width="90"></el-table-column>
          <el-table-column prop="num" label="汽车保有量"  sortable></el-table-column>
          <el-table-column prop="khcnum" label="客货车数量"  sortable></el-table-column>
        </el-table>
      </div>
    </div>
</template>

<script>
import blur from "@/blur";
import {interf} from './config'
import mTitle from '@/components/UI_el/title_com.vue'
export default {
    name:"ranking",
    data(){
      return{
        tableDatas:[]
      }
    },
    components:{
        mTitle
    },
    mounted(){
      setTimeout(()=>{this.getCityOrderData();},1000);
    },
    methods:{
      /**
       * 表格点击事件
       */
      handle(row, event, column){
        let data={};
        data.name=row.name;
        data.value=row.xzqh;
        blur.$emit('initVehicleStatics',data);
        // blur.$emit('changeSelect',data.value);
      },
      /**
      * 获取车辆保有量，排名数据
      * VehiclePopulation/getVehiclePopulation  GET_CITY_ORDER_API
      */
      getCityOrderData() {
        let that = this;
        interf.GET_CITY_ORDER_API({}).then(response=>{
          if (response && response.status == 200){
            var data = response.data;
              if (data.errcode == 0) {
                that.tableDatas=data.data;
              }else{
                that.$message({
                  message: data.errmsg,
                  type: "error",
                  duration: 1500
                });
              }
          }
        })
        .catch(err=>{
          that.$message({
                  message: '服务请求失败！',
                  type: "error",
                  duration: 1500
                });
        })
        .finally(() => {
          that.tableLoading = false;
          blur.$on('setCurrentCityRow',(city)=>{
            let index=null;
            if(city){
              
              that.tableDatas.forEach((e,i)=>{
                if(city.indexOf(e.name)!=-1){
                  index=i;
                }
              })
            }
          
          that.$refs.cityTable.setCurrentRow(that.tableDatas[index]);
        })
        });
        // interf.GET_CITY_ORDER_API({},function(data){
        //   if (data.errcode == 0) {
        //         that.tableDatas=data.data;
        //       } else{
        //         that.$message({
        //           message: data.errmsg,
        //           type: "error",
        //           duration: 1500
        //         });
        //       }
        // },function(err){})
      },
      /**
       * 设置表格样式
       */
      getRowClass({ row, column, rowIndex, columnIndex }) {
        return "background:transparent;cursor:pointer;";
      },
    }
}
</script>

<style scoped lang="scss">
.ranking{
  position: absolute;;
  top: 11px;
  left: 10px;
  width: 474px;
  height: 977px;
  .rank{
    width:120px;
    height:39px;
    font-size:16px;
    font-family:Source Han Sans CN;
    font-weight:400;
    padding-top: 9px;
    padding-bottom: 6px;
    color:rgba(255,255,255,1);
    margin-bottom: 36px;
    border-bottom: 1px solid #fff;
  }
  &--table{
    width:90%;
    margin:0 auto;
  }
}
</style>
