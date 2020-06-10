<template>
    <div class="belong" >
        <div class="top">
          <div class="title" v-if="showback==true"  >全部车辆监控</div>
          <div class="back" v-else @click="goback()" >&lt;&lt; 返回全省
            <span> {{city}}</span>
          </div>
        </div>
        <div class="main">
          <div>
              <m-title class="analysis"  label='车辆归属地分析' ></m-title>
          </div>
          <div class="inout">
              <div class="left ">
                <div style="padding-left:4.89vw" @click="changeIn(1)" class="inouttext">进入</div>
                    <!-- style="padding-left:1.4583vw" -->
                <div  style=""  :class="fxlx==1? 'showline':'line'" ></div>             
                <div class="protext"> 
                  <span style="padding-left:1.5vw">省内: {{belongData.provinceWithin}}
                    <span>{{belongData.provinceWithinProportion}}</span>
                  </span>
                  
                </div>
              </div>
             
              <div class="right ">
                <div style="padding-left:4.89vw" @click="changeIn(2)" class="inouttext">流出</div>
                <div  style=""  :class="fxlx==2? 'showline':'line'"></div>              
                <div class="protext"> 
                  <span>省外: {{belongData.provinceExternal}}
                    <span>{{belongData.provinceExternalProportion}}</span>
                  </span>
                  
                </div>
              
              </div>
              <!-- 切换省内省外的div -->
              <div class="change">
                <div  @click="province(1)" class="provinces"></div>
                <div  @click="province(2)" class="city" ></div>
              </div>    
          </div>
           <div style="padding:0 27px">
            <el-table :data="indexDatas"
              style="width: 100%" height="747" :default-sort = "{prop: 'week_radio', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
              <el-table-column fixed type="index" label="No" width="60"></el-table-column>
              <el-table-column prop="YJDFZJG"  show-overflow-tooltip  :label="provinceInorOut=='1'? '省份':'城市'"></el-table-column>
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
          city:'',
          stime:'1',
          xzqh:'',
          provinceInorOut:'1',  //省份 1  城市2 
          fxlx:'1', //进入1  流出2  
          showback:true, //是否显示返回按钮
          timeRange:'', //自定义时间
          belongData:{
                provinceWithin:null,
                provinceWithinProportion:null,
                provinceExternal:null,
                provinceExternalProportion:null,
            },
            indexDatas: [
                // {"YJDFZJG":"西安","index":"2.1","proportion":"+0.3%","NUM":"-0.1%"},
                // {"city":"渭南","index":"1.1","week_radio":"+0.3%","his_radio":"-0.1%"}
            ],
        }
    },
    mounted(){
        let that = this;
        that.$store.commit("setRight", '26.5vw');
        // this.gettimeDatas()
        that.getData()
        // that.qqq()
        console.log(that.stime,that.fxlx,that.provinceInorOut)
        that.getBelongData(that.stime,that.fxlx,that.provinceInorOut);
       
    },
    components:{
        mTitle,
        mTab,
        blur
    },
     watch:{
      stime(newValue, oldValue){
        return newValue;
      }
    },
    methods:{
      /**
       * 接收table传过来的数据 
       */
      getData(){
        let that=this;
        blur.$on('sendTime',data=>{
          // console.log(data)
          that.getBelongData(data.time1,that.fxlx,that.provinceInorOut,that.xzqh,data.time2)
        })
        /**  接收table传过来的数据 gettime  传入对应的时间 1  2  3  4  时间格式为 timer1 2020-06-10 timer2  2020-06-10
        * determine：自定义时间  paramcity ：某个城市 paramxzqh 行政区划 
        */  
      //  blur.$emit("timer2",time2) blur.$emit("timer1",time1)
        blur.$on("paramxzqh",xzqh=>{
          that.xzqh=xzqh;
         if(that.stime!='4') that.getBelongData(that.stime,that.fxlx,that.provinceInorOut,that.xzqh);
        })
        blur.$on('gettime',time=>{
          that.stime=time;
          // if(that.stime!='4'){

          // }
        }) 
        blur.$on('determine',times=>{
          console.log(times)
          that.timeRange=times;
          console.log(that.timeRange)
          // let time1=that.timeRange[0].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
          // let time2=that.timeRange[1].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
          // console.log(timer1,timer2)
          console.log(that.timeRange[0],that.timeRange[1])
          //
          // console.log(that.timeRange)
        })  
        // 
        blur.$on("paramcity",city=>{
          that.city=city;
          // console.log(that.city)
          if(city!==undefined){
            that.showback=false;
          }
        })
      },
      // 是否显示返回
      goback(){
        let that=this;
        that.showback=true;
         that.getBelongData('1','1','2');
      },
      getBelongData(stime,fxlx,provinceInorOut,xzqh,etime){
        let that=this;
        // 如果传入的是自定义是时间参数有fxlx, provinceInorOut,stime，xzqh，etime
        if(xzqh!=undefined && etime!=undefined ){
          interf.GET_BELONG_API({
             id:"",
             stime:stime,
             fxlx:fxlx,
             provinceInorOut:provinceInorOut,
             xzqh:xzqh,
             etime:etime
            })
            .then(response=>{
              if (response && response.status == 200){
                var data= response.data;
                 console.log(data)
                if (data.errcode == 0) {
                  // that.belongData=data.data;
                  that.belongData.provinceWithin=data.data.provinceWithin;
                  that.belongData.provinceExternal=data.data.provinceExternal;
                  that.belongData.provinceWithinProportion=data.data.provinceWithinProportion;
                  that.belongData.provinceExternalProportion=data.data.provinceExternalProportion;
                  that.indexDatas=data.data.dataList;
                  // console.log(that.belongData)
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
        }
        // 如果传入xzqh参数，参数有fxlx, provinceInorOut,stime，xzqh
         if(xzqh!=undefined && etime===undefined  && stime!='4'){
           interf.GET_BELONG_API({
             id:"",
             stime:stime,
             fxlx:fxlx,
             provinceInorOut:provinceInorOut,
             xzqh:xzqh
            })
            .then(response=>{
              if (response && response.status == 200){
                var data= response.data;
                 console.log(data)
                if (data.errcode == 0) {
                  // that.belongData=data.data;
                  that.belongData.provinceWithin=data.data.provinceWithin;
                  that.belongData.provinceExternal=data.data.provinceExternal;
                  that.belongData.provinceWithinProportion=data.data.provinceWithinProportion;
                  that.belongData.provinceExternalProportion=data.data.provinceExternalProportion;
                  that.indexDatas=data.data.dataList;
                  // console.log(that.belongData)
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
        }
        //首次进入显示进入，省内的实时的数据 参数有fxlx, provinceInorOut,stime
        if(xzqh===undefined && etime===undefined  && stime!='4'){
           interf.GET_BELONG_API({
             id:"",
             stime:stime,
             fxlx:fxlx,
             provinceInorOut:provinceInorOut
            })
            .then(response=>{
              if (response && response.status == 200){
                var data= response.data;
                 console.log(data)
                if (data.errcode == 0) {
                  // that.belongData=data.data;
                  that.belongData.provinceWithin=data.data.provinceWithin;
                  that.belongData.provinceExternal=data.data.provinceExternal;
                  that.belongData.provinceWithinProportion=data.data.provinceWithinProportion;
                  that.belongData.provinceExternalProportion=data.data.provinceExternalProportion;
                  that.indexDatas=data.data.dataList;
                  // console.log(that.belongData)
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
        }
      },
      // 车辆归属地分析，根据进入 流出 和 省内，省外获取对应的 数据
      province(provinceInorOut){
        let that = this;
        that.provinceInorOut=provinceInorOut;
        console.log(that.stime,that.fxlx,that.provinceInorOut)
        that.getBelongData(that.stime,that.fxlx,that.provinceInorOut);
      },
      // 车辆流动页面  归属地分析  Vehicle/getVehicleOwnership  // 进入 流出数据
      changeIn(fxlx){
        let that = this;
        that.fxlx=fxlx;
        that.getBelongData(that.stime,that.fxlx,that.provinceInorOut);
        console.log(that.fxlx,that.provinceInorOut)

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
    box-sizing: border-box;
    .top{
      .back{
        height:34px;
        font-size:16px;
        padding-top: 5px;
        font-family:Source Han Sans CN;
        font-weight:400;
        color:rgba(0,198,255,1);
        // background-color: $color-bg-1;
        // border:1px solid;
        padding-left: 17px;
        cursor:pointer;
        border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
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
        height:34px;
        font-size:18px;
        padding-top: 5px;
        text-align: center;
        font-family:Source Han Sans CN;
        font-weight:400;
        color:rgba(254,254,254,1);
        background-color: $color-bg-1;
        border:1px solid;
        cursor:pointer;
        border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
      }
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
      width: 100%;
      height: 120px;
      position: relative;
      .left,.right{
        height: 60px;
        .inouttext{
          width:160px;
          height:14px;
          font-size:16px;
          font-family:Source Han Sans CN;
          font-weight:400;
          color:rgba(0,198,255,1);
          line-height:60px;
          margin-bottom: 4.5vh;
          cursor:pointer;
        }
        .protext{
          width:9.68vw;
          height:1vh;
          font-size:16px;
          font-family:Source Han Sans CN;
          font-weight:400;
          color:rgba(255,255,255,1);
          margin-bottom: 3vh;
          margin-top: 1vh;
        }
        .showline{
          width:160px;
          height: 2px;
          background:#00C6FF;
          margin-left:1.4583vw
        }
        .line{
          width:160px;
          height: 2px;
          margin-left:1.4583vw
          // background: chartreuse;
        }
      }
      }
    }
}
.change{
  position: absolute;
  top:60px;
  left:0;
  display: flex;
  padding: 0 30px;
}
 .provinces{
   width:213px;
   height:32px;
   background:rgba(0,198,255,1);
   margin-top: 4vh;
   cursor:pointer;
   flex: 1;
   margin-right: 2px;
  }
  .city{
    width:207px;
    height:32px;
    background:rgba(38,94,69,1);
    margin-top: 4vh;
    cursor:pointer;
    flex: 1;
  }
</style>