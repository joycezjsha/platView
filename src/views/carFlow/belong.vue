<template>
    <div class="belong" >
        <div>
            <m-tab label='全部车辆监控' ></m-tab>
            <m-title class="analysis"  label='车辆归属地分析' ></m-title>
        </div>
        <span class="inouttext">
            <span>进入</span>
            <span>流出</span>
        </span>
        <div class="protext">
            <div>
               <span>省内{{belongData.provinceWithin}}</span>
               <span>{{belongData.provinceWithinProportion}}</span>
            </div>
            <div>
              <span>省外{{belongData.provinceExternal}}</span>  
               <span>{{belongData.provinceExternalProportion}}</span>
            </div>   
        </div>
        <div class="qiehuan">
            <div class="provinces" style=""></div>
            <div class="city" style=" "></div>
        </div>
       <div>
            <el-table :data="indexDatas"
           style="width: 100%" height="100%" :default-sort = "{prop: 'week_radio', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
                <el-table-column fixed type="index" label="No" width="90"></el-table-column>
                <el-table-column prop="city"   label="省份"></el-table-column>
                <el-table-column prop="week_radio" label="辆次" sortable></el-table-column>
                <el-table-column prop="his_radio" label="比例" sortable></el-table-column>
          </el-table>
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
    name:'belong',
    data(){
        return{
            belongData:{
                provinceWithin:null,
                provinceWithinProportion:null,
                provinceExternal:null,
                provinceExternalProportion:null,
            },
            indexDatas: [
                {"city":"西安","index":"2.1","week_radio":"+0.3%","his_radio":"-0.1%"},
                {"city":"渭南","index":"1.1","week_radio":"+0.3%","his_radio":"-0.1%"}
            ],
        }
    },
    mounted(){
       
        this.getIndexData()
    },
    components:{
        mTitle,
        mTab,
        blur
    },
    methods:{
      getIndexData() {
        let that = this;
        // 车辆流动页面  归属地分析  Vehicle/getVehicleOwnership   GET_BELONG_API
        interf.GET_BELONG_API({
        id:"",
        fxlx:'1',
        provinceInorOut:'1'
      })
      .then(response=>{
        if (response && response.status == 200){
          var data= response.data;
          console.log(data)
          if (data.errcode == 0) {
            // that.belongData=data.data;
            that.belongData.provinceWithin=data.data.provinceWithin;
            that.belongData.provinceExternal=data.data.provinceExternal;
            that.belongData.provinceWithinProportion=data.data.provinceWithinProportion;
            that.belongData.provinceExternalProportion=data.data.provinceExternalProportion;
            that.indexDatas=data.data.dataList;

            // console.log(that.belongData)
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

<style scope lang='scss'>
.belong{
    position: fixed;
    top:6.388vh;
    right:13px;
    width:24.6875vw;
    height: 100%;
    .analysis{
        width:8.5vw;
        height:3vh;        
    }
    .inouttext{
        width:33px;
        height:14px;
        font-size:16px;
        font-family:Source Han Sans CN;
        font-weight:400;
        color:rgba(0,198,255,1);
        line-height:60px;
        span{
            margin-left: 6vw;
        }
    } 
    .protext{
        width:159px;
        height:1vh;
        font-size:16px;
        font-family:Source Han Sans CN;
        font-weight:400;
        color:rgba(255,255,255,1);
        display: flex;
        div{
            justify-content: space-around;
        }
    }
    .qiehuan{
        display: flex;
        margin-top: 2vh;
        .provinces{
            width:213px;height:32px;background:rgba(0,198,255,1);
        }
        .city{
            width:207px;height:32px;background:rgba(38,94,69,1);
        }
    }
}

</style>