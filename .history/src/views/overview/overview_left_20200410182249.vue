<template>
  <div class="overview-left-div">
    <div class='overview-left-div--top'>
      <div class="flip">
        <div class="front">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>过车数据</span>
              <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-menu">详细情况</el-button>
            </div>
            <div class="top-container">
              <div class='top-container-row'>
                <el-col :span='5'>历史过车数据：</el-col>
                <el-col :span='19' class="row_value">{{passCarCount.count}}</el-col>
              </div>
              <div class='top-container-row-'>
                <div>今日上传<br/><span class="row_value_">{{passCarCount.todayCount}}</span></div>
                <div>昨日上传<br/><span class="row_value_">{{passCarCount.yestodayCount}}</span></div>
              </div>
            </div>
          </el-card>
        </div>
        <div class="back">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>轨迹查询</span>
              <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-menu">详细情况</el-button>
            </div>
            <div class="top-container">
              <div class='top-container-row'>
                <el-col :span='5'>轨迹接口调用次数：</el-col>
                <el-col :span='19' class="row_value">{{trailCallCount.count}}</el-col>
              </div>
              <div class='top-container-row-'>
                <div>今日调用<br/><span class="row_value_">{{trailCallCount.todayCount}}</span></div>
                <div>昨日调用<br/><span class="row_value_">{{trailCallCount.yestodayCount}}</span></div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div class='overview-left-div--center'>
       <el-divider content-position="left">交通动态监测</el-divider>
       <div class='center_txt'>实时统计上一个小时（15:00-16:00）的流动情况</div>
       <div class='center_statics'>
         <div class='center_statics--count'>陕西省<br/><span class="center_statics_">{{centerstatics.Count}}</span></div>
         <div class='center_statics--inout'>
            <div>进入<br/><span class="row_value_">{{centerstatics.comein}}</span></div>
            <div>流出<br/><span class="row_value_">{{centerstatics.goout}}</span></div>
         </div>
         <div class='center_statics--radio'>进出比<br/><span class="">{{centerstatics.radio}}</span></div>
       </div>
       <div class='center_table'>
         <el-table :data="indexDatas" style="width: 100%" height="100%" :default-sort = "{prop: 'week_radio', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass"><el-table-column fixed type="index" label="No" width="50"></el-table-column>
              <el-table-column prop="city" label="城市"></el-table-column>
              <el-table-column prop="index" label="警情数量" sortable></el-table-column>
              <el-table-column prop="week_radio" label="重大警情" sortable></el-table-column>
            </el-table>
       </div>
    </div>
    <div class='overview-left-div--bottom'>
       <ul class="traffic-index_content_table">
          <li class="index-item" v-for="item in indexDatas" :id="item.id" :key="item.id">
            <p><span>{{item.road}}</span>
            <span class="address-name">{{item.startRoad}}--->{{item.endRoad}}</span>
            </p>
            <p><span>平均速度：{{item.averageSpeed}}</span>
            <span class="address-name">路长{{item.length}}</span>
            </p>
          </li>
        </ul>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
export default {
  name: "overview_left",
  data() {
    return {
      map: {},
      passCarCount:{
        count:66666,
        todayCount:'222',
        yestodayCount:'345'
      },
      trailCallCount:{
        count:66666,
        todayCount:'222',
        yestodayCount:'345'
      },
      centerstatics:{
        Count:'',
        comein:'',
        goout:'',
        radio:'25%'
      },
      indexDatas: [{"city":"西安","index":"2.1","week_radio":"+0.3%","his_radio":"-0.1%"},{"city":"渭南","index":"1.1","week_radio":"+0.3%","his_radio":"-0.1%"}],
 indexDatas: [
        {"road":"西安","index":"2.1","averageSpeed":"33.2","length":"1.5","startRoad":"西兰高速公路","endRoad":"空工立交"},
      {"road":"西安","index":"2.1","averageSpeed":"24","length":"2.2","startRoad":"西兰高速公路","endRoad":"空工立交"}],
      selectItem:{"road":"西安",order:8}
    };
  },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.map.repaint = true;
    that.getIndexData();
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
  },
  methods: {
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
                return "background:transparent;";
   },
    //获取巡航数据
    getIndexData() {
      let that = this;
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
    if(this.mapAddItems.sourceList.length>0){
      this.mapAddItems.sourceList.forEach(e=>{
        if(this.map.getSource(e)!=undefined){
          this.map.removeSource(e);
        }
      })
    }
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

.overview-left-div {
  position: absolute;
  z-index: 10;
  left: 1vw;
  width: 23vw;
  height: 80vh;
  top: 9vh;
  color:$color-white;
  @include flex(column, center,center);
  &--top{
    width:100%;
    height:25vh;
    perspective:1000;transform-style:preserve-3d;
    @include flex(column, center,center);
    @keyframes toback {
        0% {transform: rotateY(0deg);}
        50% {transform: rotateY(180deg);}
        100% {transform: rotateY(360deg);}
    }
    @keyframes tofront {
        0% {transform: rotateY(-180deg);}
        50% {transform: rotateY(0deg);}
        100% {transform: rotateY(180deg)}
    }
    .front,.back{width:100%;height:100%;}
    .flip{width:100%;height:100%;position:relative;transition:1s;transform-style:preserve-3d;}
    .front,.back{position:absolute;top: 0px;left: 0px;backface-visibility:hidden;}
    .front{z-index:2;}
    .front {
        animation: toback 8s infinite;
      }
      .back {
        animation: tofront 8s infinite;
      }
    .top-container{
      @include flex(column, center,center);
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      &-row{
        @include flex(row, center,start);
        width:100%;
        >div{
          @include flex(column, center,start);
          width:50%;
        }
        >div:nth-child(1){
          align-items: center;
        }
        .row_value{
          border: 1px solid $color-info;
        }
      }
      &-row-{
        margin-top:12px;
        @include flex(row, center,start);
        width:100%;
        >div{
          @include flex(column, center,center);
          width:50%;
        }
        >div:nth-child(1){
            border-right: 1px solid $color-info
        }
        .row_value_{
          text-align:center;
          color:$color-active;
          font-size:1vw;
        }
      }
    }
  }
  &--center{
    width:100%;
    height:25vh;
    @include flex(column, center,center);
    .center_txt{
      width:100%;
      height:3vh;
      // background: $color-text-sub;
    }
    .center_statics{
      width:100%;
      height:4vh;
      @include flex(row, center,center);
      &--count{
        width:30%;
        @include flex(column, center,center);
      }
      &--inout{
        width:30%;
        @include flex(column, center,center);
      }
      &--radio{
        width:30%;
        @include flex(column, center,center);
      }
    }
    .center_table{
      width:100%;
      
    }
  }
  &--bottom{
    width:100%;
    height:25vh;
    @include flex(column, center,center);
  }
}
</style>
<style lang='scss'>
@import '@/assets/css/color.scss';
.el-card{
    background-color: $color-bg-3;
    color: $color-white;
    border: 1px solid $color-info;
}
</style>