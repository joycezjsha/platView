<template>
  <div class="city-accident-div boxstyle">
    <div class="city-accident_container">
      <div class='city-accident_header'>
        <div @click='changeRange(0)'><m-title label='城市警情统计' :img_type='range_type?"0":"1"' style='width:8vw;height:4vh;line-height:4vh;'></m-title></div>
        <div @click='changeRange(1)'><m-title label='大队警情统计' :img_type='range_type?"1":"0"' style='width:8vw;height:4vh;line-height:4vh;'></m-title></div>
      </div>
      <div class='city-accident-query'>
        <span class="city-accident-query--label">时间：</span><span class="city-accident-query--time">
          <el-date-picker width="100%"
            v-model="timeRange"
            type="daterange"
            :default-time="defaultTime"
            value-format='yyyy-MM-dd HH:mm:ss'
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            >
          </el-date-picker>
          </span><span class="city-accident-query--btn"><el-button type="primary" v-loading='queryLoading'>确定</el-button></span></div>
      <div class="city-accident_content">
         <!-- <el-tabs v-model="activeName" @tab-click="handleClick" style="padding:0 15px;">
          <el-tab-pane label="全部" name="first"></el-tab-pane>
          <el-tab-pane label="122" name="second"></el-tab-pane>
          <el-tab-pane label="互联网" name="third"></el-tab-pane>
          <el-tab-pane label="视频巡查" name="fourth"></el-tab-pane>
        </el-tabs> -->
        <el-table v-if='range_type==0' :data="indexDatas" style="width: 100%" height="80%" :default-sort = "{prop: 'week_radio', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass" @row-click='handle'>
          <el-table-column fixed type="index" label="No" width="50"></el-table-column>
          <el-table-column prop="NAME" label="城市"></el-table-column>
          <el-table-column prop="NUM" label="警情数量" sortable></el-table-column>
          <!-- <el-table-column prop="week_radio" label="重大警情" sortable></el-table-column> -->
        </el-table>
        <el-table v-else :data="groupDatas" style="width: 100%" height="80%" :default-sort = "{prop: 'week_radio', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass" @row-click='handle'>
          <el-table-column fixed type="index" label="No" width="50"></el-table-column>
          <el-table-column prop="NAME" label="大队"></el-table-column>
          <el-table-column prop="NUM" label="警情数量" sortable></el-table-column>
        </el-table>
      </div>
    </div>
    <t-area :indexData='indexDatas' :isShowArea='showArea'></t-area>
  </div>
</template>

<script>
import blur from "@/blur";
import { IMG } from "./config";
import { interf } from "./config";
import mTitle from "@/components/UI_el/title_com.vue";
import tArea from "@/components/area/area.vue";
export default {
  name: "TCruise",
  data() {
    return {
      map: {},
      showArea:true,
      indexDatas: [],
      groupDatas:[],
      selectItem:{"city":"西安",order:8},
      areaColors:["#556B2F","#00FFFF","#0000EE","#8A2BE2","#c48f58","#9fcac4","#5ad2a0","#f18a52","#656bd4","#7ca0cd","#88b7dc","#a08bd3","#be7fcd","#30a2c4","#c0ccd7","#dbddab","#9cd076","#69b38b","#437fb9","rgb(255, 143, 109)"],
      timeRange:'',
      mapAddItems:{
        polygons:[],
        sourceList:[],
        lineList:[],
        popups:[]
      },
      activeName:'first',
      range_type:0,
      defaultTime:['00:00:00','23:59:59'],
      tableLoading:false,
      queryLoading:false
    };
  },
  components:{
    mTitle,tArea
  },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(6);
    this.map.repaint = true;
    that.getAccidentCityData();
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
  },
  methods: {
     /**
     * 切换：城市警情统计、大队警情统计
     */
    changeRange(t){
      let _this=this;
      if(t!=undefined) {if(this.range_type==t) return; else this.range_type = t;}
      else{
        this.queryLoading=true;
        if(this.timeRange!='') blur.$emit('initAccidentMap',{time:this.timeRange});
        setTimeout(()=>{_this.queryLoading=false;},500);
      }
      if(this.range_type){
        this.getAccidentAreaData();
      }else{
        this.getAccidentCityData();
      }
    },
    /**
     * 获取城市-警情统计数据，并初始化城市警情列表
     */
    getAccidentCityData(){
      let _this=this;
      let param={stime:1};
      if(this.timeRange!=''){
        param.stime=this.timeRange[0];
        param.etime=this.timeRange[1];
      };
      interf.GET_ACCI_CITY_STA_API(param).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
              _this.indexDatas=data.data;
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
        _this.tableLoading = false;
      });
    },
   
    /**
     * 获取城市-警情统计数据，并初始化大队警情列表
     */
    getAccidentAreaData(){
      let _this=this;
      let param={stime:1};
      if(this.timeRange!=''){
        param.stime=this.timeRange[0];
        param.etime=this.timeRange[1];
      };
      interf.GET_ACCI_AREA_STA_API(param).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
              _this.groupDatas=data.data;
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
        _this.tableLoading = false;
      });
    },
  /**
   * 点击标签页
   */
  handle(row, event, column){
    let data={};
    data.time=this.timeRange;
    if(this.range_type){
      data.name=row.NAME;
      data.value=row.AREAID;
    }else{
      data.name=row.NAME;
      data.value=row.XZQH;
    }
    blur.$emit('initAccidentStatics',this.range_type,data);
  },
  //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
                return "background:transparent;border:none;";
   },
  //取括号内数据
  getLonlats(str){
    let regex = /[^\(\)]+(?=\))/g;
    return str.match(regex);
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
.city-accident-div {
  position: absolute;
  z-index: 10;
  left: 12px;
  width: 474px;
  height: 977px;
  top: 11px;
}
.city-accident_container {
  width: 100%;
  height: 100%;
  // background-color: $color-bg-1;
  // border: 1px solid $color-border-1;
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
    // border-bottom: 0.1rem solid $color-border-1;
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
    .city-accident_header{
      width:80%;
      height: 4vh;
      margin-top: 1px;
      >div{
        float:left;
        cursor:pointer;
      }
      >div:nth-child(2){
        margin-left:-1vw;
      }
    }
    .city-accident-query{
      color: $color-white;
      width: 95%;
      height: 3vh;
      line-height: 3vh;
      text-align: center;
      font-size: 0.8vw;
      margin: 3% auto;
      @include flex(row,center);
      &--label{
        width:15%;
        color:$color-text-label;
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
    width: 94%;
    height: 87%;
    margin: 2% 3%;
    
    &_table {
      overflow-y: auto;
    }
    
  }
}
</style>