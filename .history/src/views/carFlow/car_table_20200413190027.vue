<template>
  <div class="city-index-div">
    <div class="city-index_container">
      <div class="city-index_title">
        <div>
          <i class="el-icon-collection-tag">全省流动情况</i>
        </div>
        
      </div>
      <div class='xian_order'><span class="xian_order--city">{{selectItem.city}}</span>在全国排名:<span class="xian_order--city">{{selectItem.order}}</span></div>
      <div class="city-index_content">
        <el-tabs v-model="activeName" @tab-click="handleClick" style="padding:0 15px;">
          <el-tab-pane label="实时" name="first"></el-tab-pane>
          <el-tab-pane label="今天" name="second"></el-tab-pane>
          <el-tab-pane label="昨天" name="third"></el-tab-pane>
          <el-tab-pane label="自定义" name="fourth"></el-tab-pane>
        </el-tabs>
        <div class='car-table-query' v-show='activeName==自定义'>
          <span class="city-accident-query--label">时间：</span><span class="city-accident-query--time">
          <el-date-picker width="100%"
            v-model="timeRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            >
          </el-date-picker>
          </span><span class="city-accident-query--btn"><el-button type="primary">确定</el-button></span>
        </div>
        <ul class="car-flow_content_table">
          <li class="item" v-for="(item,index) in flowDatas" :key="item.id">
            <p>
              <span>{{index+1}}</span>
              <span class="address-name">{{item.city}}</span>
              <span>进：{{item.in}}</span>
              <span>出：{{item.out}}</span>
              <span>进出比：{{item.in_out_radio}}</span>
              </p>
              <p>
              <span class="address-name">保有量{{item.holdCount}}</span>
              <span>流动变化：{{item.flowChange}}</span>
              </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import blur from "@/blur";
export default {
  name: "TCruise",
  data() {
    return {
      map: {},
      flowDatas: [],
      selectItem:{"city":"西安",order:8},
      areaColors:["#556B2F","#00FFFF","#0000EE","#8A2BE2","#c48f58","#9fcac4","#5ad2a0","#f18a52","#656bd4","#7ca0cd","#88b7dc","#a08bd3","#be7fcd","#30a2c4","#c0ccd7","#dbddab","#9cd076","#69b38b","#437fb9","rgb(255, 143, 109)"],
      mapAddItems:{
        polygons:[],
        sourceList:[],
        lineList:[],
        popups:[]
      }

    };
  },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.map.repaint = true;
    that.getFlowData();
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
  },
  methods: {
    //获取车辆流动数据
    getFlowData() {
      let that = this;
      $.ajax({
        url: "./static/json/carFlow.json", //globals.CRUISE_ALL_INFO_URL,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        responseType: "json",
        method: "get",
        dataType: "json",
        data: {
          // token: window.localStorage.getItem("loginUserToken")
        },
        success: function(data) {
          if (data.errcode == -2) {
            that.$router.push({ name: "/login" });
          }
          if (data.errmsg == "success" && data.data.length > 0) {
            
            that.flowDatas = data.data;
            //that.fly();
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log(XMLHttpRequest);
          console.log(textStatus);
          console.log(errorThrown);
        }
      });
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
  clickHandle(item){
    blur.$emit('setSelectItems',item.city,item.index)
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
.city-index-div {
  position: absolute;
  z-index: 10;
  left: 1vw;
  width: 23vw;
  height: 68vh;
  top: 9vh;
}
.city-index_container {
  width: 100%;
  height: 100%;
  background-color: $color-bg-1;
  border: 1px solid $color-border-1;
  .city-index_title{
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
    }
    .xian_order{
      color: $color-white;
    width: 100%;
    height: 3vh;
    line-height: 3vh;
    text-align: center;
    font-size: 1.2vw;
    &--city{
      color:$color-active;
    }
    }
  .city-index_content {
    width: 98%;
    height: 85%;
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
</style>