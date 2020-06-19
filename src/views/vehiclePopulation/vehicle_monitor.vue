<template>
  <div class="vehicle_monitor-div ">
    <div class='vehicle_monitor-div--top boxstyle '>
      <div class='title'>
        <m-title label='车辆监测' style='width:6vw;'></m-title>
        <span style="margin-right:1.5vw;margin-top:1vh">
          <i class="iconfont icon-shijian" style='margin-right:1vw;'></i>{{time}}
        </span>
      </div>
      <m-tiptxt class="tiptxt" text='“活跃”是指：30分钟内有被卡口监测到车辆'></m-tiptxt>
      <!-- <div class='right-time'><i class="iconfont icon-shijian" style='margin-right:1vw;'></i>{{time}}</div> -->
      <m-tab label='实时监控车辆活跃数：' :value=countnum></m-tab>
      <div class='center_table'>
         <el-table @row-click="showCity"
          :data="indexDatas" style="width: 100%" height="32.5vh" :default-sort = "{prop: 'proportion', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
            <el-table-column fixed type="index" label="No" width="50"></el-table-column>
            <el-table-column prop="NAME" label="类型"></el-table-column>
            <el-table-column prop="NUM" label="数量"  sortable></el-table-column>
            <el-table-column prop="proportion" label="比例"  sortable></el-table-column>
            <el-table-column prop="CODE" v-if='isShowCity'></el-table-column>
          </el-table>
      </div>
    </div>
    <div class='vehicle_monitor-div--bottom boxstyle'>
      <m-title label='超速预警' style='width:8vw;'></m-title>
       <ul class="traffic-index_content_table">
          <li class="index-item" v-for="item in trafficDatas" :id="item.id" :key="item.id">
            <div style="margin-bottom:3px">
               <span class="car-name">{{item.HPZL}}</span>
               <span class="">{{item.HPHM}}</span>
               <span class="per-hour">时速/限速:{{item.SJ}}</span>
            </div>
            <p  style="margin-bottom:3px">
            <span class="address-name">{{item.WFDZ}}</span>
            </p>         
            <div class="address-name time">{{item.WFSJ}}</div>          
          </li>
        </ul>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import m_tab from '@/components/UI_el/tab.vue';
import m_tiptxt from '@/components/UI_el/tiptxt.vue';
import mTitle from '@/components/UI_el/title_com.vue';
import blur from '../../blur.js';
export default {
  name: "overview_left",
  data() {
    return {
      map: {},
      isShowCity:false,
      map_cover:{
        sourceList:[],
        markers:[],
        lineList:[],
        popups:[]
      },
      time:'5:00',
      countnum:'',
      centerstatics:{
        Count:'',
        comein:'',
        goout:'',
        radio:'25%'
      },
      indexDatas: [
        {"index":"","proportion":"+0.3%","NUM":"-0.1%","NAME":"","CODE":""}
        ],
      trafficDatas: [
      //   {"road":"西安","index":"2.1","averageSpeed":"33.2","length":"1.5","startRoad":"西兰高速公路","endRoad":"空工立交"},
      // {"road":"西安","index":"2.1","averageSpeed":"24","length":"2.2","startRoad":"西兰高速公路","endRoad":"空工立交"}
      ],
      selectItem:{"road":"西安",order:8}
    };
  },
  components:{mTab:m_tab,mTiptxt:m_tiptxt,mTitle},
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.map.repaint = true;
    that.getIndexData();
    that.getKeyVehicleDatas()
  },
  destroyed() {
    this.map.setPitch(0);
    // this.clearMap();
  },
  methods: {
    // 传递city参数
    showCity(row){
      blur.$emit('getCity',row.CODE);
      console.log(row.CODE)
      console.log(row.CODE)
    },
    //重点车辆监测  KeyVehicle/getKeyVehicle   GET_KEY_VEHICLE_API
    getKeyVehicleDatas(){
     let that = this;
    interf.GET_KEY_VEHICLE_API({})
    .then(response=>{
        if (response && response.status == 200){
          var data= response.data;
          if (data.errcode == 0) {
           that.countnum=data.data.countnum;
           that.indexDatas=data.data.list;
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
    //获取巡航数据
    getIndexData() {
      let that = this;
    //重点车辆监测超速预警 KeyVehicle/getSpeeding   GET_OVER_WARN_FLOW_API
    interf.GET_OVER_WARN_FLOW_API({
      id:''
    })
    .then(response=>{
        if (response && response.status == 200){
          var data= response.data;
          console.log(data)
          if (data.errcode == 0) {
            that.trafficDatas=data.data;
            // console.log(that.trafficDatas)
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
    // $.ajax({
    //     url: "./static/json/city_accident_data.json", //globals.CRUISE_ALL_INFO_URL,
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded"
    //     },
    //     responseType: "json",
    //     method: "get",
    //     dataType: "json",
    //     data: {
    //       // token: window.localStorage.getItem("loginUserToken")
    //     },
    //     success: function(data) {
    //       if (data.errcode == -2) {
    //         that.$router.push({ name: "/login" });
    //       }
    //       if (data.errmsg == "success" && data.data.length > 0) {
    //         let datas=[];
    //         data.data.map(e=>{
    //           datas.push(
    //             {"city":e.areaName,"index":Math.round(e.areaTpi)*10/100,"week_radio":"+0.3%","his_radio":"-0.1%"}
    //           )
    //         });
    //         that.indexDatas=datas;
    //       }
    //     },
    //     error: function(XMLHttpRequest, textStatus, errorThrown) {
    //       debugger
    //     }
    //   });
    },
   
  //清除地图加载点、线、面、弹框
  clearMap(){
    //清除source
    // if(this.mapAddItems.sourceList.length>0){
    //   this.mapAddItems.sourceList.forEach(e=>{
    //     if(this.map.getSource(e)!=undefined){
    //       this.map.removeSource(e);
    //     }
    //   })
    // }
    //清除layer
    if(this.mapAddItems.lineList.length>0){
      this.mapAddItems.lineList.forEach(e=>{
        if(this.map.getLayer(e)!=undefined){
          this.map.removeLayer(e);
        }
      })
    }
    //清除popup
    if(this.mapAddItems.popups.length>0){
      this.mapAddItems.popups.forEach(e=>{
        e.remove();
      })
    }
  },
  /**
   * 点击标签页
   */
  handleClick(){
    
  }
  }
};
</script>
<style scope lang='scss'>
@import '@/assets/css/color.scss';
@mixin flex($direction,$justify,$align) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.vehicle_monitor-div ul,li{
  margin: 0;
  padding:0;
}
 .vehicle_monitor-div {
    position: absolute;
    z-index: 10;
    left: 12px;
    width: 100%;
    top: 1.5vh;
    color:$color-white;
    margin-bottom: 20px;
    .center_table{
      width: 100%;
      padding:0 20px;
      box-sizing: border-box;
    }
  }
.vehicle_monitor-div--top{
  width: 474px;
  height:450px;
  .title{
    display: flex;
    justify-content:space-between;
  }
}
.vehicle_monitor-div--bottom{
    width:474px;
    height:459px;
    margin-top: 17px;
}
.traffic-index_content_table{
  .index-item{
    width:418px;
    // height: 54px;
    padding:0 20px;
    margin-top: 13px;
    margin-left: 8px;
  }
}
.vehicle_monitor-div li:nth-of-type(odd){ 
  background:rgba(72,84,108,0.2);
}
.vehicle_monitor-div li:hover{
  background:rgba(4,104,166,0.6);
}
.vehicle_monitor-div .car-name{
  width:38px;
  height:22px;
  background:rgba(89,26,26,1);
  border-radius:2px;
  border: 1px solid #631415;
  margin-left: 12px;
  font-size:14px;
  font-family:Source Han Sans CN;
  font-weight:400;
  color:rgba(255,255,255,1);
  margin-right: 45px;
  padding:1.5px;
}
.vehicle_monitor-div .per-hour{
  margin-left: 35px;
  font-size:14px;
  font-family:Source Han Sans CN;
  color:rgba(166,176,205,1);
}
.vehicle_monitor-div .address-name{
  margin-left: 15px;
  font-size:14px;
  font-family:Source Han Sans CN;
  color:rgba(166,176,205,1);
}


//   @include flex(column, center,center);
//   font-family: Microsoft YaHei;
//   &--top{
//     width: 100%;
//     height:30%;
//     color: #fff;
//     .tiptxt{
//       position: absolute;
//       top:30px;
//       left: 30px;
//     }
//     @include flex(column, start,start);
//     .title{
//       font-size: 1vw;
//       padding: 2px 2% 0.6rem 2%;
//       font-weight: bolder;
//       position: absolute;
//       top:0;
//       left: 0;
//       // border-bottom: 0.1rem solid #DCDFE6;
//       width: 96%;
//     }
//     .time{
//       position: absolute;
//       right: 3%;
//       top: 1%;
//     }
//   }
//   &--center{
//     position: absolute;
//     top:133px;
//     left: 0;
//     // width:100%;
//     // height:40%;
//     @include flex(column, center,start);
//     .center_txt{
//       width:100%;
//       height:3vh;
//       // background: $color-text-sub;
//     }
//     .center_statics{
//       width:100%;
//       height:4vh;
//       @include flex(row, center,center);
//       &--count{
//         width:30%;
//         @include flex(column, center,center);
//       }
//       &--inout{
//         width:30%;
//         @include flex(column, center,center);
//       }
//       &--radio{
//         width:30%;
//         @include flex(column, center,center);
//       }
//     }
//     .center_table{
//       width:100%;
//     }
//   }
//   &--bottom{
//     width:100%;
//     height:40%;
//     margin-top: 5vh;
//     @include flex(column, center,start);
//     ul{
//       margin:0;
//       display: block;
//       width: 96%;
//       padding: 10px 4%;
//       li{
//         border-bottom: 1px solid $color-info;
//       }
//     }
//   }
// }
// </style>
// <style lang='scss'>
// @import '@/assets/css/color.scss';
// .el-card{
//     background-color: $color-bg-3;
//     color: $color-white;
//     border: 1px solid $color-info;
// }
// .traffic-index_content_table{
//   overflow: hidden;
// }
// .time{
//   // position: absolute;
//   margin-left: 10vw;
//   margin-bottom: 2px;
//   // text-align: right;
//   // display: inline-block;

// }

</style>