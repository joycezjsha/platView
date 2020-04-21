<template>
  <div class="overview-left-div">
    <div class='overview-left-div-top'>
      <div class='top-title'>轨迹查询</div>
       <div class='top-statics'>历史过车数据</div>
        <div class='top-title'>轨迹查询</div>
    </div>
    <div class='overview-left-div-center'></div>
    <div class='overview-left-div-bottom'></div>
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
#cruise_table::-webkit-scrollbar {
  width: 1rem;
  height: 1rem;
  background-color:$color-bg;
}

/*定义滚动条轨道 内阴影+圆角*/
#cruise_table::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px  $box-shadow;
  border-radius: 5px;
  background-color: $color-bg;
}

/*定义滑块 内阴影+圆角*/
#cruise_table::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px $box-shadow;
  background-color: $color-white;
}
.city-accident-div {
  position: absolute;
  z-index: 10;
  left: 1vw;
  width: 23vw;
  height: 80vh;
  top: 9vh;
}
.city-accident_container {
  width: 100%;
  height: 100%;
  background-color: $color-bg-1;
  border: 1px solid $color-border-1;
  .tab_line{
    width: 96%;
    height: 2px;
    background: #fff;
    position: absolute;
    margin: 5% 2% 0 2%;
    }
  .city-accident_title{
      position: relative;
    width: 96%;
    border-bottom: 0.1rem solid $color-border-1;
    font-family: Microsoft YaHei;
    font-size: 1vw;
    color: $color-white;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 0.6rem 2%;
    font-weight: bolder;
    &--tab{
      width:100%;
      height:100%;
      @include flex(row,center);
    }
    .d4_one,.d4_two{
        float: left;
        width: 0;
        height: 0;
        border-width: 1.5vh;
        border-style: solid;
        border-color: transparent #fff transparent transparent; 
        transform: rotate(0deg);
        @include flex(row,center);
      }
      .d5_one,.d5_two{
        float: right;
        width: 0; 
        height: 0;
        border-width: 1.5vh;
        border-style: solid;
        border-color: transparent #fff transparent transparent;
        -webkit-transform: rotate(180deg);
        @include flex(row,center);
      }
     .tab_one,.tab_two{
        @include flex(row,center);
        width: 65%;
        background: #fff;
        color:black;
        cursor:pointer;
        height:3vh;
      }
    &--tab.active,&--tab:hover{
      .d4_one,.d4_two{
        border-color: transparent #09c transparent transparent; 
      }
      .d5_one,.d5_two{
        border-color: transparent #09c transparent transparent;
      }
     .tab_one,.tab_two{
        background: #09c;
        color:white;
      }
    }
    
    }
    .city-accident-query{
      color: $color-white;
    width: 100%;
    height: 3vh;
    line-height: 3vh;
    text-align: center;
    font-size: 0.8vw;
    margin: 2% 0;
    @include flex(row,center);
    &--label{
      width:15%;
      color:$color-label;
      display:inline-block;
      @include flex(row,center);
    }
    &--time{
      width:60%;
      display:inline-block;
      @include flex(row,center);
    }
    &--btn{
      width:25%;
      display:inline-block;
      @include flex(row,center);
    }
    }
  .city-accident_content {
    width: 98%;
    height: 87%;
    background-color: $color-bg-1;
    margin: 1%;
    
    &_table {
      overflow-y: auto;
    }
    
  }
}
</style>
<style>
.el-table, .el-table__expanded-cell,.el-table th, .el-table tr {
    background-color: transparent;color:white;
}
.el-table--enable-row-hover .el-table__body tr:hover>td, .el-table__body tr.hover-row>td{
  background-color: rgb(14, 182, 233);
  color:white;
}
.el-input__inner{
}
.el-input__inner,.el-range-editor .el-range-input {
    background: transparent;
    color:white;
}
.el-date-editor .el-range-separator{
  color:white;
}
.el-picker-panel{
    color: white;
    background-color: #282d27eb;
}
.el-range-editor.el-input__inner{
  height:3vh;
  line-height:3vh
}
.el-date-editor .el-range__icon{
  line-height:2vh;
}
.el-date-editor .el-range-separator{
  line-height:2vh;
}
.el-button{
  height:3vh;
  line-height:0.5;
}
</style>