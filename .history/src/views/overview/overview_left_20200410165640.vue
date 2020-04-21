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
                <el-col :span='10'>历史过车数据：</el-col>
                <el-col :span='14'>{{passCarCount.count}}</el-col>
              </div>
              <div class='top-container-row'>
                <div>今日上传<br/><span>{{passCarCount.todayCount}}</span></div>
                <div>昨日上传<br/><span>{{passCarCount.yestodayCount}}</span></div>
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
                <el-col :span='10'>轨迹接口调用次数：</el-col>
                <el-col :span='14'>{{trailCallCount.count}}</el-col>
              </div>
              <div class='top-container-row'>
                <div>今日调用<br/><span>{{trailCallCount.todayCount}}</span></div>
                <div>昨日调用<br/><span>{{trailCallCount.yestodayCount}}</span></div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div class='overview-left-div--center'></div>
    <div class='overview-left-div--bottom'></div>
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
      }

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
@mixin flex($direction: column, $justify: center, $align: center) {
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
  color:white;
  @include flex(column, center,center);
  &--top{
    width:100%;
    height:25vh;
    perspective:1000;transform-style:preserve-3d;
    @include flex(column, center,center);
    .front,.back{width:100%;height:100%;}
    .flip{width:100%;height:100%;position:relative;transition:1s;transform-style:preserve-3d;}
    .front,.back{position:absolute;top: 0px;left: 0px;backface-visibility:hidden;}
    .front{z-index:2;}
    .top-container{
      @include flex(column, center,center);
      &-row{
        @include flex(column, center,center);
        >div{
          @include flex(column, center,center);
        }
      }
    }
  }
  &--center{
    width:100%;
    height:25vh;
    @include flex(column, center,center);
  }
  &--bottom{
    width:100%;
    height:25vh;
    @include flex(column, center,center);
  }
}
</style>