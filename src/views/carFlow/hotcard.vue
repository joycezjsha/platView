<template>
  <div>
    <div id="map" style=' width: 100%; height: 100%;'></div>
    <div class="hotcard">
        <div class="top">
          <div class="title" v-if="showback==true" >全部车辆监控</div>
            <div class="back" v-else @click="goback()" >&lt;&lt; 返回全省
              <span> {{city}}</span>
          </div>
        </div>
        <div class="hotroad" style="height:41.29vh;">
          <m-title class="titletext"  label='热点道路排名' ></m-title>
          <div class="padding">
            <div class="table">
              <el-table :data="indexDatas"
            style="width: 100%" height="100%" :default-sort = "{prop: 'inNum', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
                  <el-table-column show-overflow-tooltip fixed type="index" label="No" width="60"></el-table-column>
                  <el-table-column show-overflow-tooltip prop="road"   label="道路"></el-table-column>
                  <el-table-column show-overflow-tooltip prop="inNum" label="进入两次" sortable></el-table-column>
                  <el-table-column show-overflow-tooltip prop="outNum" label="流出两次" sortable></el-table-column>
              </el-table>
            </div> 
          </div>
        </div>
        <div  class="hotroad" style="margin-top:2vh">
          <m-title class="titletext"  label='热点卡口排名' ></m-title>
          <div  class="padding"> 
            <div  class="table">
              <el-table :data="indexDatas1"
            style="width: 100%" height="100%" :default-sort = "{prop: 'NUM', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
                  <el-table-column show-overflow-tooltip fixed type="index" label="No" width="60"></el-table-column>
                  <el-table-column show-overflow-tooltip prop="KKMC"   label="卡口名称"></el-table-column>
                  <el-table-column show-overflow-tooltip prop="NUM" label="过车辆" sortable></el-table-column>     
              </el-table>
            </div>
          </div>       
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
          showback:true, //是否显示返回按钮
          city:'',
          stime:'1',
          xzqh:'',
          timeRange:'', //自定义时间
          showhotcard:false,
          map_cover:{
          sourceList:[],
          lineList:[],
          popups:[],
          markers:[]
          },
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
      this.map=this.$store.state.map;
      this.map.setCenter([108.967368, 34.302634]);
      this.map.setZoom(11);
       let that = this;
       that.$store.commit("setRight", '26.5vw');
      //  that.getIndexDatas(that.stime) 
      //  that.gettimeDatas()
      //  that.gettimesDatas()
       that.getData()
       that.gethotcardDatas(that.stime)
     
    },
    watch:{
      stime(newValue, oldValue){
        return newValue;
      }
    },
    methods:{
      /**
       * 点击返回按钮
       */
      goback(){
        let that=this;
        that.showback=true;
        that.gethotcardDatas('1')
      },
      /**
       * 接收table传过来的数据 
       */
      getData(){
        let that=this;
        /**
        *gettime  传入对应的时间 1  2  3  4
        *paramcity 对应城市
        *determine 定义时间
        */
        blur.$on("paramxzqh",xzqh=>{
          that.xzqh=xzqh;
          if(that.stime!='4'){
            that.gethotcardDatas(that.stime,that.xzqh)
          }
          if(that.xzqh!=undefined && that.stime=='4'){
            that.gethotcardDatas(that.timeRange[0],that.xzqh,that.timeRange[1])
          }
         
        })
        blur.$on('determine',times=>{
          that.timeRange=times;
          console.log(that.timeRange)
          if(that.xzqh!=undefined){
            that.gethotcardDatas(that.timeRange[0],that.xzqh,that.timeRange[1])
          }
          // that.getprovinceData(that.timeRange[0],that.xzqh,that.timeRange[1]);
         
          // that.gethotcardDatas(that.stime,that.xzqh)
        })  
         blur.$on('gettime',time=>{
          that.stime=time;
          that.gethotcardDatas(that.stime);
        }) 
        blur.$on("paramcity",city=>{
          that.city=city;
          // console.log(that.city)
          if(city!==undefined){
            that.showback=false;
          }
        })
        // console.log(that.xzqh, that.city,that.timeRange,that.stime)
      },
      /**
       * 热点卡口地图
       */     
       
      getcardMapData(item){
        let itemlist=[];
        itemlist.push(item.KKJD,item.KKWD)
        console.log(itemlist)
        // let lnglat = {item.KKJD,item.KKWD]; ,item.DLMC,item.KKBH,item.KKMC,item.NUM
      //    let rightDiv=document.createElement('div');
        let lnglat = [itemlist[0],itemlist[1]];
        let el = document.createElement('div');
        el.style.border='1px solid rgba(42, 76, 162, 1)';
        el.style.borderRadius='2px';
        el.style.background='rgba(3,12,32,0.74)';
        el.style.width='218px';
        el.style.height='130px';
        el.style["padding"] = "10px 10px";
        // el.className = 'custom-popup-class'; //custom-popup-class为自定义的css类名
        let d1 = document.createElement('div');
        d1.innerHTML = item.KKMC;
        d1.style.color = "rgba(255,255,255,1)";
        d1.fontFamily='Source Han Sans CN';
        el.appendChild(d1);
        
        let d2 = document.createElement('div');
        let span1= document.createElement('span'); 
        let span2= document.createElement('span'); 
        span1.innerHTML='设备ID: ';
        span2.innerHTML=item.KKBH;
        d2.fontFamily='Source Han Sans CN';
        d2.style.color = "rgba(255,255,255,1)";
        d2.appendChild(span1)
        d2.appendChild(span2)
        el.appendChild(d2);

        let d3 = document.createElement('div');
        let span3= document.createElement('span'); 
        let span4= document.createElement('span'); 
        span3.innerHTML='地点: ';
        // span4.innerHTML=item.KKBH;
        d3.fontFamily='Source Han Sans CN';
        d3.style.color = "rgba(255,255,255,1)";
        d3.appendChild(span3)
        d3.appendChild(span4)
        el.appendChild(d3);

        let d4= document.createElement('div');
        let span5= document.createElement('span'); 
        let span6= document.createElement('span'); 
        span5.innerHTML='方向: ';
        // span5.innerHTML=item.KKBH;
        d4.fontFamily='Source Han Sans CN';
        d4.style.color = "rgba(255,255,255,1)";
        d4.appendChild(span5)
        d4.appendChild(span6)
        el.appendChild(d4);
        
        let d5= document.createElement('div');
        let span7= document.createElement('span'); 
        let span8= document.createElement('span'); 
        span7.innerHTML='过车辆: ';
        span8.innerHTML=item.NUM;
        d5.fontFamily='Source Han Sans CN';
        d5.style.color = "rgba(0,198,255,1)";
        d5.appendChild(span7)
        d5.appendChild(span8)
        el.appendChild(d5);
        var popup3 = new minemap.Popup({closeOnClick: false, closeButton: false, offset: [0, 0]})
        .setLngLat(lnglat)
        .setDOMContent(el)
        .addTo(this.map);
       
      },
      /**
       *车辆流动页面热点道路
       *车辆流动页面热点卡口
      */
      gethotcardDatas(stime,xzqh,etime){
        console.log(stime,xzqh,etime)
        let that=this;
        // 热点道路数据  如果有1个参数, 没有xzqh和etime参数
        if(stime!='4' && xzqh===undefined){
          interf.GET_HOT_ROAD_API({
          id: "",
          stime:stime
          })
          .then(response=>{
            if (response && response.status == 200){
              var data = response.data;
               console.log(data)
                that.indexDatas=data.data;
                if (data.errcode == 0) {
                  
                  
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
        }
        // 热点道路数据  如果有xzqh参数,没有etime参数
         if(xzqh!=undefined && etime===undefined  && stime!='4'){
          interf.GET_HOT_ROAD_API({
          id: "",
          stime:stime,
          xzqh:xzqh
          })
          .then(response=>{
            if (response && response.status == 200){
              var data = response.data;
               console.log(data)
                that.indexDatas=data.data;
                if (data.errcode == 0) {
                  // blur.$emit('getroadtimes',data)
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
        }
        // 热点道路数据 如果有3个参数
         if(xzqh!=undefined && etime!=undefined){
          interf.GET_HOT_ROAD_API({
          id: "",
          stime:stime,
          xzqh:xzqh,
          etime:etime
          })
          .then(response=>{
            if (response && response.status == 200){
              var data = response.data;
               console.log(data)
                that.indexDatas=data.data;
                if (data.errcode == 0) {
                  // blur.$emit('getroadtimes',data)
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
        }
        // 热点卡口，如果有1个参数,如果没有xzqh和etime参数
        if(stime!='4' && xzqh===undefined){  
          interf.GET_HOT_RANK_API({
          id: "",
          stime:stime
        })
        .then(response=>{
          if (response && response.status == 200){
            var data = response.data;
            that.indexDatas1=data.data;
             console.log(data)           
            if (data.errcode == 0) {
              if(that.indexDatas1.length>0){
                // // 调用卡口地图方法
                that.indexDatas1.forEach(element => {
                  that.getcardMapData(element)
                //   // element.KKJD
                  console.log(element)
                });
              }
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
        }
        //热点卡口, 如果有2个参数 stime和 xzqh,  没有etime参数
         if(xzqh!=undefined && etime===undefined  && stime!='4'){  
          interf.GET_HOT_RANK_API({
          id: "",
          stime:stime,
          xzqh:xzqh
        })
        .then(response=>{
          if (response && response.status == 200){
            var data = response.data;
            that.indexDatas1=data.data;
             console.log(data)
            // blur.$emit('getbaytimes',data)
            if (data.errcode == 0) {
              if(that.indexDatas1.length>0){
                // // 调用卡口地图方法
                that.indexDatas1.forEach(element => {
                  that.getcardMapData(element)
                //   // element.KKJD
                  console.log(element)
                });
              }
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
        }
        //  热点卡口,如果有三个参数参数
         if(xzqh!=undefined && etime!=undefined){  
          interf.GET_HOT_RANK_API({
          id: "",
          stime:stime,
          xzqh:xzqh,
          etime:etime
        })
        .then(response=>{
          if (response && response.status == 200){
            var data = response.data;
            that.indexDatas1=data.data;
             console.log(data)
            // blur.$emit('getbaytimes',data)
            if (data.errcode == 0) {
              if(that.indexDatas1.length>0){
                // // 调用卡口地图方法
                that.indexDatas1.forEach(element => {
                  that.getcardMapData(element)
                //   // element.KKJD
                  console.log(element)
                });
              }
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
        }
      },
      // 今天，昨天，实时的数据
      gettimesDatas(stime){
        let that = this;
        //  blur.$on('getroadtimes',data=>{
        //   // console.log(data)
        //   that.indexDatas=data.data;
        // })
        // 热点道路排名的数据
        // blur.$on('getbaytimes',data=>{
        //   // console.log(data)
        //   // that.indexDatas1=data.data;
        // })
      },
      // 获取日历选择的数据
      gettimeDatas(){
        let that = this;
        // blur.$on('determine',times=>{
        //   that.timeRange=times;
        //   console.log(that.timeRange)
        // })   
        // 热点道路排名的数据
        // blur.$on('getroadData',data=>{
        //   // console.log(data)
        //   that.indexDatas=data.data;
        // })
        // 热点道路排名的数据
        // blur.$on('getbayData',data=>{
        //   // console.log(data)
        //   that.indexDatas1=data.data;
        // })
        
      },
      /**
       * 1 最近的时间 2 今天 3昨天 对应的数据
      */      
      getIndexDatas(stime){
        let that = this;
      // 车辆流动页面热点道路 
      
      // 车辆流动页面热点卡口 Vehicle/getHotspotBayonetRanking  GET_HOT_RANK_API
      // interf.GET_HOT_RANK_API({
      //   id:"",
      //   stime:stime
      // })
      // .then(response=>{
      //   if (response && response.status == 200){
      //       var data = response.data;
      //       // console.log(data)
      //       if (data.errcode == 0) {
      //           // that.indexDatas1=data.data;
      //           // console.log(that.indexDatas1)
      //         } else{
      //           that.$message({
      //             message: data.errmsg,
      //             type: "error",
      //             duration: 1500
      //           });
      //       } 
      //     }
      // })
      // .catch(err=>{
      //     console.log(err);
      //   })
      //   .finally(() => {
      //     that.tableLoading = false;
      //   });
      // 车辆流动页面热点道路 Vehicle/getHotspotRoadRanking   GET_HOT_ROAD_API
      //   interf.GET_HOT_ROAD_API({
      //   id:"",
      //   stime:stime
      // })
      // .then(response=>{
      //   if (response && response.status == 200){
      //       var data = response.data;
      //       // console.log(data)
      //       if (data.errcode == 0) {
      //           that.indexDatas=data.data;   
      //         } else{
      //           that.$message({
      //             message: data.errmsg,
      //             type: "error",
      //             duration: 1500
      //           });
      //       } 
      //     }
      // })
      // .catch(err=>{
      //     console.log(err);
      //   })
      //   .finally(() => {
      //     that.tableLoading = false;
      //   });
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
    top: 9.388vh;
    right:13px;
    width:24.6875vw;
    height: 100%;
    .top{
      width: 100%;
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
    .titletext{
      width: 8vw;
      height:31px;
    }
    .hotroad{
      height: 41.29vh;
      background-color: $color-bg-1;
      border:1px solid;
      border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
      .padding{
        padding:0 1.5vw;
        .table{
          height: 41vh;
        }
      }
      
    }
}
</style>