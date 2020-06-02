<template>
  <div class="city-index-div">
    <div class="city-index_container boxstyle">
      <div class="city-index_title">
        <div>
          <!-- <i class="el-icon-collection-tag">全省流动情况</i> -->
          <m-title label='全省流动情况' img_type=1 style='width:100%;height:4vh;line-height:4vh;'></m-title>
        </div>
        
      </div>
      <div class="car-flow_content ">
        <el-tabs v-model="activeName" @tab-click="handleClick" style="padding:0 15px;">
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
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            >
          </el-date-picker>
          </span>
          <span class="car-table-query--btn">
            <el-button type="primary" @click="determine">确定</el-button>
          </span>
        </div>
        <!-- <div class='car-table-query' v-else>{{tipTxt[activeName]}}</div> -->
        <m-tiptxt :text='tipTxt[activeName]' v-else></m-tiptxt>
        <div class='all_statics'>
          <div><span>陕西省</span><span>{{allStatics.addIn}}</span></div>
          <div><span>进入：+{{allStatics.incount}}</span><span>流出：-{{allStatics.outcount}}</span></div>
          <div><span>进出比</span><span>{{allStatics.inoutProportion.toFixed(2)}}</span></div>
        </div>
        <ul v-if="flowDatas" :class="activeName=='4'?'car-flow_content_table car-flow_content_table-':'car-flow_content_table'">
          <li @click="showData(item.xzqh)" class="item" v-for="(item,index) in flowDatas" :key="item.id">
            <p>
              <span>{{index+1}}</span>
              <span class="address-name">{{item.city}}</span>
              <span>进：{{item.inNum}}</span>
              <span>出：{{item.outNum}}</span>
              <span>进出比：{{item.proportion.toFixed(2)}}</span>
            </p>
            <p>
              <span></span>
              <span class="address-name">保有量<span class='value'>{{item.holdCount}}</span></span>
              <span>流动变化：<span :class="item.flowChange>0?'up_value':'down_value'">{{item.addIn}}</span></span>
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
import mTitle from "@/components/UI_el/title_com.vue";
import mTiptxt from '@/components/UI_el/tiptxt.vue'
export default {
  name: "car_table",
  data() {
    return {
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
      tipTxt:{1:'实时：统计上一个小时（15:00-16:00）的流动情况',2:'今天：统计上今天（00:00-16:00的流动情况',3:'昨天：统计上昨天全天的流动情况'},
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
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.map.repaint = true;
    // that.getFlowData();
    that.getIndexData();
    that.realtimeData()
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
  },
  methods: {
    // showData() 点击城市获取对应城市  总计进入车辆辆次的数据 
    showData(xzqh){
      let that = this;
      // let xzqh=xzqh.toString()
      // console.log(xzqh,typeof(xzqh))
       interf.GET_VEH_PRO_API({
      id:"",
      stime:'1',
      xzqh:'xzqh'
    })
    .then(response=>{
       if (response && response.status == 200){
           var data = response.data;
           console.log(that.data)
           if (data.errcode == 0) {
            //  that.provinceData.addIn=data.data.addIn.toString();
            //  that.provinceData.incount=data.data.incount.toString();
            //  that.provinceData.outcount=data.data.outcount.toString();            
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

    //  全省流动情况  默认显示实时的数据   
    realtimeData(){
      let that = this;
       interf.GET_VEH_FLOW_API({
         id: "",
         stime:'1'
      })
      .then(response=>{
        if (response && response.status == 200){
           var data = response.data;
          //  console.log(data)
            if (data.errcode == 0) {
             that.allStatics.incount=data.data.incount;
             that.allStatics.outcount=data.data.outcount;
             that.allStatics.addIn=data.data.addIn;
             that.allStatics.inoutProportion=data.data.inoutProportion;
             var obj=data.data.data
            //  console.log(obj)
            for(var key in obj){
              obj[key].city=key
              that.flowDatas.push(obj[key])
            }
           console.log(that.flowDatas[0])
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
    // 日期选择获取的数据
    determine(){
       let that = this;
      console.log(this.timeRange)
      console.log(this.timeRange[0],this.timeRange[1])
       interf.GET_VEH_FLOW_API({
         id: "",
        //  timeRange:that.timeRange
         stime:this.timeRange[0],
         etime:this.timeRange[1]
       })
       .then(response=>{
        if (response && response.status == 200){
           var data = response.data;
           console.log(data)
            if (data.errcode == 0) {
             that.allStatics.incount=data.data.incount;
             that.allStatics.outcount=data.data.outcount;
             that.allStatics.addIn=data.data.addIn;
             that.allStatics.inoutProportion=data.data.inoutProportion;
             var obj=data.data.data
            //  console.log(obj)
            for(var key in obj){
              obj[key].city=key
              that.flowDatas.push(obj[key])
            }
          //  console.log(that.flowDatas)
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
    getIndexData(){
      let that = this;

     //车辆流动页面全省车辆统计 GET_VEH_PRO_API
     interf.GET_VEH_PRO_API({
       id:"",
       etime:'',
       stime:''
     })
     .then(response=>{
       if (response && response.status == 200){
           var data = response.data;
          //  console.log(data)
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
      
      
    },
    //获取车辆流动数据
    // getFlowData() {
    //   let that = this;
    //   $.ajax({
    //     url: "./static/json/carFlow.json", //globals.CRUISE_ALL_INFO_URL,
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
            
    //         that.flowDatas = data.data;
    //         //that.fly();
    //       }
    //     },
    //     error: function(XMLHttpRequest, textStatus, errorThrown) {
    //       console.log(XMLHttpRequest);
    //       console.log(textStatus);
    //       console.log(errorThrown);
    //     }
    //   });
    // },
    
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
    handleClick(item){
     this.activeName=item.name;
    //  console.log(this.activeName)
     let that = this;
    //  console.log(this.activeName)
     // 获取车辆流动页面全省流动情况数据  GET_VEH_FLOW_API
      // 如果选择的是的实时，今天，昨天  
      if(this.activeName!='4'){
         interf.GET_VEH_FLOW_API({
         id: "",
         stime:that.activeName
      })
      .then(response=>{
        if (response && response.status == 200){
           var data = response.data;
          //  console.log(data)
            if (data.errcode == 0) {
             that.allStatics.incount=data.data.incount;
             that.allStatics.outcount=data.data.outcount;
             that.allStatics.addIn=data.data.addIn;
             that.allStatics.inoutProportion=data.data.inoutProportion;
             var obj=data.data.data
            //  console.log(obj)
            for(var key in obj){

              obj[key].city=key
              that.flowDatas.push(obj[key])
            }
          //  console.log(that.flowDatas)
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
    
  }


  }
};
</script>
<style scope lang='scss'>
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
  left: 1vw;
  width: 23vw;
  height: 80vh;
  top: 9vh;
}
.city-index_container {
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
     }
     >div:nth-child(2){
       span:nth-child(1){
         color: $color-yellow;
       }
       span:nth-child(2){
         color: $color-primary;
       }
     }
    }
  .car-flow_content {
    width: 98%;
    height: 85%;
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
      padding: 0 10px;
      height: 86%;
      .item{
        // border-bottom: 1px solid $color-white;
        line-height: 1em;
        margin: 0 2%;
        cursor: pointer;
        height: 6vh;
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
            width:13%;
          }
          >span:nth-child(2){
            width:46%;
            @include flex(row,flex-start,center);
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