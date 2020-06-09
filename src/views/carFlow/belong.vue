<template>
    <div class="belong" >
        <div class="top">
            <div>全部车辆监控</div>  
        </div>
        <div class="main">
          <div>
              <m-title class="analysis"  label='车辆归属地分析' ></m-title>
          </div>
          <div class="inout">
              <div class="left " style="">
                <div @click="changeIn(1)" class="inouttext">进入</div>
                <!-- v-show="isShowin==1"  v-show="isShowin==-1"-->
                <div :class="isShowin==1? 'showline':'line'" ></div>
                <div class="protext"> 
                  <span>省内: {{belongData.provinceWithin}}</span>
                  <span>{{belongData.provinceWithinProportion}}</span>
                </div>
                <div  @click="province(1)" class="provinces" style=""></div>
              </div>
              <div class="right ">
                <div @click="changeIn(2)" class="inouttext">流出</div>
                <div :class="isShowin==2? 'showline':'line'"></div>
                <div class="protext"> 
                  <span>省外: {{belongData.provinceExternal}}</span>
                  <span>{{belongData.provinceExternalProportion}}</span>
                </div>
                <div  @click="province(2)" class="city" style=""></div>
              </div>
          </div>
           <div>
            <el-table :data="indexDatas"
              style="width: 100%" height="42vh" :default-sort = "{prop: 'week_radio', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
              <el-table-column fixed type="index" label="No" width="60"></el-table-column>
              <el-table-column prop="YJDFZJG"   :label="num=='1'? '省份':'城市'"></el-table-column>
              <el-table-column prop="NUM" label="辆次" sortable></el-table-column>
              <el-table-column prop="proportion" label="比例" sortable></el-table-column>
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
    name:'belong',
    data(){
        return{
          num:'1',  //省份 1  城市2 
          isShowin:'1', //进入1  流出2  
          belongData:{
                provinceWithin:null,
                provinceWithinProportion:null,
                provinceExternal:null,
                provinceExternalProportion:null,
            },
            indexDatas: [
                {"YJDFZJG":"西安","index":"2.1","proportion":"+0.3%","NUM":"-0.1%"},
                {"city":"渭南","index":"1.1","week_radio":"+0.3%","his_radio":"-0.1%"}
            ],
        }
    },
    mounted(){
        this.getIndexData();
        let that = this;
        that.$store.commit("setRight", '26.5vw');
        // this.gettimeDatas()
       
    },
    components:{
        mTitle,
        mTab,
        blur
    },
    methods:{
      // 车辆归属地分析  默认显示进入 省内的数据
      getIndexData(){
        let that=this;
        // interf.GET_BELONG_API({
        // id:"",
        // fxlx:'1',
        // provinceInorOut:'1'
        // })
        // .then(response=>{
        //   if (response && response.status == 200){
        //     var data= response.data;
        //     console.log(data)
        //     if (data.errcode == 0) {
        //       // that.belongData=data.data;
        //       that.belongData.provinceWithin=data.data.provinceWithin;
        //       that.belongData.provinceExternal=data.data.provinceExternal;
        //       that.belongData.provinceWithinProportion=data.data.provinceWithinProportion;
        //       that.belongData.provinceExternalProportion=data.data.provinceExternalProportion;
        //       that.indexDatas=data.data.dataList;

        //       // console.log(that.belongData)
        //     }else{
        //       that.$message({
        //         message: data.errmsg,
        //         type: "error",
        //         duration: 1500
        //       });
        //     }
        //   }
        // })
        // .catch(err=>{
        //   console.log(err);
        // })
        // .finally(() => {
        //   that.tableLoading = false;
        // });
      },
      // 车辆归属地分析，根据进入 流出 和 省内，省外获取对应的 数据
      province(num){
        let that = this;
        that.num=num;
        // console.log("fxlx"+that.isShowin,"provinceInorOut"+that.num)
        interf.GET_BELONG_API({
        id:"",
        fxlx:that.isShowin, //1 进 2出
        provinceInorOut:that.num //1 省外  2省内
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
        // 
      },
      // 车辆流动页面  归属地分析  Vehicle/getVehicleOwnership  // 进入 流出数据
      changeIn(isShowin){
        let that = this;
        that.isShowin=isShowin;
        console.log(that.isShowin, that.num)
        interf.GET_BELONG_API({
        id:"",
        fxlx:that.isShowin, // 1 进 2出
        provinceInorOut:that.num  //1 省外  2省内
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
          // console.log(data)
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
@import "@/assets/css/color.scss";
.belong{
    position: fixed;
    top:6.388vh;
    right:13px;
    width:24.6875vw;
    height: 100%;
    .top{
      width:474px;
      height:34px;
      font-size:18px;
      padding-top: 5px;
      text-align: center;
      font-family:Source Han Sans CN;
      font-weight:400;
      color:rgba(254,254,254,1);
      background-color: $color-bg-1;
      border:1px solid;
      border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
    }
    .main{
        height:951px;
        background-color: $color-bg-1;
        border:1px solid;
        border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
       .analysis{
        width:8.5vw;
        height:3vh; 
    
      }
       
    .inout{
      display: flex;
    
      .left,.right{
        .inouttext{
          width:160px;
          height:14px;
          font-size:16px;
          font-family:Source Han Sans CN;
          font-weight:400;
          color:rgba(0,198,255,1);
          line-height:60px;
          margin-bottom: 4.5vh;
          margin-left: 3vw;
          cursor:pointer;
          // padding-left: 3vw;
        }
        .protext{
          width:159px;
          height:1vh;
          font-size:16px;
          font-family:Source Han Sans CN;
          font-weight:400;
          color:rgba(255,255,255,1);
          margin-bottom: 3vh;
          margin-top: 1vh;
        }
        .showline{
          width: 100%;
          height: 2px;
          background: chartreuse;
        }
        .line{
          width: 100%;
          height: 2px;
          // background: chartreuse;
        }
      }
      }
    }
  
    // .qiehuan{
    //     display: flex;
    //     margin-top: 2vh;
        
    // }
}
 .provinces{
   width:213px;height:32px;background:rgba(0,198,255,1);
   margin-top: 1vh;
  }
  .city{
    width:207px;height:32px;background:rgba(38,94,69,1);
    margin-top: 1vh;
  }
</style>