<template>
  <div class="city-index-div carflow">
    <div class="city-index_container boxstyle">
      <div class="city-index_title">
        <div>
          <!-- <i class="el-icon-collection-tag">全省流动情况</i> -->
          <m-title label='全省流动情况' img_type=1 style='width:100%;height:4vh;line-height:4vh;'></m-title>
        </div>
        
      </div>
      <div class="car-flow_content " >
        <el-tabs v-model="activeName" @tab-click="handleClick" style="padding:0 15px;" >
          <el-tab-pane label="实时" name="1"></el-tab-pane>
          <el-tab-pane label="今天" name="2"></el-tab-pane>
          <el-tab-pane label="昨天" name="3"></el-tab-pane>
          <el-tab-pane label="自定义" name="4"></el-tab-pane>
        </el-tabs>
        <div class='car-table-query' v-if="activeName=='4'">
          <span class='car-table-query--label'>时间：</span><span class="car-table-query--time">
          <el-date-picker width="100%"
           value-format="yyyyMMdd"
            v-model="timeRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            :picker-options="pickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            >
          </el-date-picker>
          </span>
          <span class="car-table-query--btn">
            <el-button type="primary" @click="determine">确定</el-button>
          </span>
        </div>
        <!-- <div class='car-table-query' v-else>{{tipTxt[activeName]}}</div>  item.xzqh.toString() -->
        <m-tiptxt :text='tipTxt[activeName]' v-else></m-tiptxt>
        <div class='all_statics'>
          <div><span>陕西省</span><span>{{allStatics.addIn}}</span></div>
          <div style="font-family:Source Han Sans CN;"><span>进入：+{{allStatics.incount}}</span>
          <span >流出：-{{allStatics.outcount}}</span></div>
          <div style="font-family:Source Han Sans CN;"><span>进出比</span><span>{{allStatics.inoutProportion.toFixed(2)}}</span></div>
        </div>
        <div class="sort">
          <div class="text">排序方式 ：</div>
          <div style="width:120px;margin-left:3px;display:flex" class="dropdown">
              <select v-model="orderType" style="background:#000916;color:rgba(255,255,255,1);padding-bottom:3px;font-size:14px; border-radius:4px; line-height:14px" id="sortdata" @change='orderChange'>
                  <option value="0">进入辆次</option>
                  <option value="1">流出辆次</option>
                  <option value="2">进出比</option>
                  <option value="3">保有量</option>
                  <option value="4">流动变化</option>
              </select>
            <!-- <el-dropdown>
                <el-button type="primary">
                  流出车辆<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>进入辆次</el-dropdown-item>
                  <el-dropdown-item>流出辆次</el-dropdown-item>
                  <el-dropdown-item>进出比</el-dropdown-item>
                  <el-dropdown-item>保有量</el-dropdown-item>
                  <el-dropdown-item>流动变化</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
              <span @click="sort" style="width:30px;height:26px;color:rgba(29,153,171,1);margin-left:15px;">              
                  <i style="font-size:20px;" v-show="downIcon" class='iconfont icon-paixu3'></i>
                  <i  style="font-size:20px;"  v-show="!downIcon" class='iconfont icon-paixu1'></i>
              </span>
         
          </div>
        
        </div>
        <ul v-if="flowDatas" :class="activeName=='4'?'car-flow_content_table car-flow_content_table-':'car-flow_content_table'">
          <li @click="showData(item.xzqh.toString(),item.city)" class="item" v-for="(item,index) in flowDatas" :key="item.id">
            <p style="padding-top:4px">
              <span>{{index+1}}</span>
              <span  class="address-name">{{item.city}}</span>
              <span style="margin-left:20px">进：{{item.inNum}}</span>
              <span>出：{{item.outNum}}</span>
              <span>进出比：{{item.proportion.toFixed(2)}}%</span>
            </p>
            <p style="padding-bottom:0px">
              <span></span>
              <span  class="address-name">保有量：<span style="color:#00a6fb" class='value'>{{item.inventory}}</span></span>
              <span>流动变化：<span style="color:#d38c08" :class="item.flowChange>0?'up_value':'down_value'">{{item.addIn}}辆</span></span>
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
import blur from '../../blur.js';
import mTitle from "@/components/UI_el/title_com.vue";
import mTiptxt from '@/components/UI_el/tiptxt.vue'
export default {
  name: "car_table",
  data() {
    return {
      orderType:0,
      downIcon: true,  //排序切换
      showCity:false,
      xzqh:'',
      fxlx:'1',
      stime:'1',
      map: {},
      flowDatas: [

      ],
      activeName:'1',
      selectItem:{"city":"西安",order:8},
      areaColors:["#556B2F","#00FFFF","#0000EE","#8A2BE2","#c48f58","#9fcac4","#5ad2a0","#f18a52","#656bd4","#7ca0cd","#88b7dc","#a08bd3","#be7fcd","#30a2c4","#c0ccd7","#dbddab","#9cd076","#69b38b","#437fb9","rgb(255, 143, 109)"],
      mapAddItems:{
        polygons:[],
        sourceList:[],
        lineList:[],
        popups:[]
      },
      timeRange:'',
      tipTxt:{1:'实时：统计上一个小时(15:00-16:00)的流动情况',2:'今天：统计上今天(00:00-16:00)的流动情况',3:'昨天：统计上昨天全天的流动情况'},
      allStatics:{
        incount:'',
        outcount:'',
        addIn:'',
        inoutProportion:0
      }
    };
  },
  components:{mTitle,mTiptxt},
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([109.278987,35.747334]);
    // this.map.setZoom(11);
    this.map.repaint = true;
    that.getIndexData();
    that.realtimeData(that.stime)
  
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
  },
  methods: {
    /**
     * 切换排序方式
     */
    orderChange(e,val){
      switch(this.orderType){
        case '0':this.flowDatas=this.flowDatas.sort((a,b)=>{return b.inNum -a.inNum});break;
        case '1':this.flowDatas=this.flowDatas.sort((a,b)=>{return b.outNum -a.outNum});break;
        case '2':this.flowDatas=this.flowDatas.sort((a,b)=>{return b.proportion -a.proportion});break;
        case '3':this.flowDatas=this.flowDatas.sort((a,b)=>{return b.inventory -a.inventory});break;
        case '4':this.flowDatas=this.flowDatas.sort((a,b)=>{return b.flowChange -a.flowChange});break;
        default:break;
      }
    },
   /**
    *  切换正序和倒序
    */  
    sort() {
     this.downIcon = !this.downIcon;
     this.flowDatas.reverse();
    }, 
    /**
    *   showData() 列表中的每一项
    */
    showData(xzqh,city){
      let that = this;
      // 车辆类型分析
      blur.$emit("paramxzqh",xzqh);
      blur.$emit("paramcity",city);
      that.xzqh=xzqh;
      that.city=city;
    },
    /*
    *  全省流动情况  默认显示实时的数据   
    */  
    realtimeData(type){
      let that = this;
      let param={};
      if(type!='4'){
        param.stime=type;
      }
      if(type=='4'){
         param.stime=that.timeRange[0],
         param.etime=that.timeRange[1]
      }
       interf.GET_VEH_FLOW_API(param)
      .then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
             that.allStatics.incount=data.data.incount;
             that.allStatics.outcount=data.data.outcount;
             that.allStatics.addIn=data.data.addIn;
             that.allStatics.inoutProportion=data.data.inoutProportion;
             var obj=data.data.data;
             if((JSON.stringify(obj)=='{}')==false){
                for(var key in obj){
                  obj[key].city=key
                  that.flowDatas.push(obj[key])
                }
              }else{
                  that.flowDatas=[];
              }
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
    },
    /*
    * 日期选择获取的数据
    */ 
    determine(){
       let that = this;
       blur.$emit("determine",that.timeRange) //发送时间格式20200505
       that.realtimeData(that.activeName)
        let time1=(that.timeRange[0].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"))+' '+'00:00:00'
        let time2=(that.timeRange[1].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"))+' '+'23:59:59'
        let timeData={
          time1,
          time2
        }
        blur.$emit("sendTime",timeData) //发送时间格式  2020-06-10 23:59:59
    },
    getIndexData(){
     let that = this;
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
    *  点击左上角的时间选择对应的时间
    */
    handleClick(item){
     let that = this;
     that.activeName=item.name;  //对应的时间1  2  3  4

     blur.$emit('gettime',that.activeName)   //传入对应的时间 1  2  3  4
     if(that.activeName!='4'){
       that.realtimeData(that.activeName)
     }
  }

  }
};
</script>
<style scoped lang='scss'>
@import '@/assets/css/color.scss';
@mixin flex($direction, $justify, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.city-index-div {
  position: absolute;
  z-index: 10;
  left: 12px;
  width:474px;
  height:977px;
  top: 9vh;
}
.city-index-div .city-index_container {
  width: 100%;
  height: 100%;
  .city-index_title{
    position: relative;
    width: 96%;
    font-family: Microsoft YaHei;
    font-size: 1vw;
    color: $color-white;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 2px 2% 0.6rem 2%;
    font-weight: bolder;
    }
    .all_statics{
      color:$color-white;
      width: 100%;
      height: 7vh;
      line-height: 3vh;
      text-align: center;
     
     @include flex(row,center);
     >div{
       width:30%;
       @include flex(column,center);
       font-family:Source Han Sans CN;
       font-style:italic;
     }
     >div:nth-child(2){
       span:nth-child(1){
         color: $color-yellow;
          font-family:Source Han Sans CN;
          font-style:italic;
       }
       span:nth-child(2){
         color: #00b8a8;
          font-family:Source Han Sans CN;
          font-style:italic;
       }
     }
    }
  .car-flow_content {
    width: 98%;
    height: 73%;
    background-color: $color-bg-1;
    margin: 1%;
    .car-table-query{
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
    &_table {
      overflow-y: auto;
      color:white;
      padding: 1px 7px;
      height: 86%;
      .item{
        // border-bottom: 1px solid $color-white;
        box-sizing: border-box;
        line-height: 1em;
        margin: 0 2%;
        // padding:2px 0;
        cursor: pointer;
        height:6.8vh;
        >p:nth-child(1){
          @include flex(row,center,center);
          >span{
            @include flex(row,center,center);
          }
          >span:nth-child(1){
            width:8%;
          }
          >span:nth-child(2){
            width:15%;
          }
          >span:nth-child(3){
            width:20%;
            color: $color-info;
            
          }
          >span:nth-child(4){
            width:20%;
            color: $color-info;
          }
          >span:nth-child(5){
            width:35%;
            color: $color-info;
            padding-right:3px;
            @include flex(row,flex-end,center);
          }
        }
        >p:nth-child(2){
          color: $color-info;
          font-size:0.8vw;
          @include flex(row,center,center);
          >span{
            @include flex(row,flex-end,center);
          }
          >span:nth-child(1){
            width:8%;
          }
          >span:nth-child(2){
            width:50%;
            @include flex(row,flex-start,center);
            // margin-left:-7.39583vw
          }
          >span:nth-child(3){
            width:40%;
          }
          span.value{
            color: $color-primary;
          }
          span.up_value{
            color: $color-yellow;
          }
          span.down_value{
            color: $color-active;
          }
        }
      }
      .item:hover{
        background-color: $color-list_bg;
      }
    }
    &_table- {
      height: 77%;
    }
  }
}
.carflow .sort{
  height:32px;
  width: 100%;
  position: relative;
  margin-top: 1.5vh;
  .text{
    position: absolute;
    top:0;
    left: 37px;
    width:6vw;
    height:16px;
    font-size:16px;
    font-family:Source Han Sans CN;
    font-weight:400;
    color:rgba(166,175,205,1);
    margin-top: 2px;
  }
  .dropdown{
    position: absolute;
    top:0;
    left:120px;
    height: 4vh;
   
  }
}
.carflow li:nth-of-type(odd){ 
  background:rgba(72,84,108,0.2);
}
</style>
