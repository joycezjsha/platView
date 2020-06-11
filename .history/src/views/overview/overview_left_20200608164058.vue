<template>
  <div class="overview-left-div">
    <div class='overview-left-div--top'>
      <div class="flip">
        <div class="front">
          <el-card class="box-card boxstyle">
            <div slot="header" class="clearfix">
              <!-- <span class='span_title'>过车数据</span> -->
              <m-title label='过车数据' img_type=1 style='width:6vw'></m-title>
              <el-button style="float: right; padding: 3px 0;position:absolute;top:3%;right:2%;" type="text" icon="iconfont icon-xiangxiqingkuang" @click='showOrder(0)' >详细情况</el-button>
              <el-dialog title :visible.sync="drawer" append-to-body>
                <data-order :order_value="order_value"></data-order>
              </el-dialog>
              <!-- <data></data> -->
            </div>
            <div class="top-container">
              <div class='top-container-row'>
                <el-col :span='5' style='width:8vw'>历史过车数据：</el-col>
                <el-col :span='19' class="row_value">{{passCarCount.count}}</el-col>
              </div>
              <div class='top-container-row-'>
                <div>今日上传<br/><span class="row_value_">{{passCarCount.todayCount}}</span></div>
                <div>昨日上传<br/><span class="row_value_">{{passCarCount.yesterdayCount}}</span></div>
              </div>
            </div>
          </el-card>
        </div>
        <div class="back">
          <el-card class="box-card boxstyle">
            <div slot="header" class="clearfix">
              <m-title label='轨迹查询' img_type=1 style='width:6vw'></m-title>
              <el-button style="float: right; padding: 3px 0;position:absolute;top:3%;right:2%;" type="text" icon="iconfont icon-xiangxiqingkuang" @click='showOrder(1)'>详细情况</el-button>
            </div>
            <div class="top-container">
              <div class='top-container-row'>
                <el-col :span='5'>轨迹接口调用次数：</el-col>
                <el-col :span='19' class="row_value">{{trailCallCount.count}}</el-col>
              </div>
              <div class='top-container-row-'>
                <div>今日调用<br/><span class="row_value_">{{trailCallCount.todayCount}}</span></div>
                <div>昨日调用<br/><span class="row_value_">{{trailCallCount.yesterdayCount}}</span></div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div class='overview-left-div--center boxstyle'>
       <!-- <span class='span_title'>交通动态监测</span> -->
       <m-title label='交通动态监测' img_type=1  style='width:7vw'></m-title>
       <div class='center_txt'>实时统计上一个小时（15:00-16:00）的流动情况</div>
       <div class='center_statics'>
         <div class='center_statics--count'>陕西省<br/>
         <span class="center_statics_">{{centerstatics.addIn}}</span></div>
         <div class='center_statics--inout'>
             <span style="color:#FFB005" >进入:
              <span class="row_value_">{{centerstatics.incount}}</span>
            </span>       
            <span style="color:#00DFC7" >流出:
              <span   class="row_value_">{{centerstatics.outcount}}</span>
            </span>
         </div>
         <div class='center_statics--radio'>进出比<br/>
         <span class="">{{centerstatics.inoutProportion | number}}</span></div>
       </div>
       <div class='center_table' >
         <!-- style="width: 100%"  max-height="250" -->
         <el-table 
          v-for="item in indexDatas" :key="item.key" 
          :data="indexDatas" style="width:100%"
           height="100%" :default-sort = "{prop: 'week_radio', order: 'descending'}" 
           :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
           <el-table-column fixed type="index" label="No" width="60" ></el-table-column>   
           <el-table-column prop="city" label="城市"  ></el-table-column>
            <el-table-column prop="inNum" label="进入车辆"  sortable></el-table-column>
            <el-table-column prop="outNum" label="流出车辆"   sortable></el-table-column>
            <el-table-column prop="proportion" label="进出比" sortable>
              <template slot-scope="scope">
                <span>{{scope.row.proportion | number}}</span>
              </template>
            </el-table-column>
          </el-table>
       </div>
    </div>
    <div class='overview-left-div--bottom  boxstyle'>
      <m-title label='境内路况监测' img_type=1  style='width:7vw'></m-title>
       <ul class="traffic-index_content_table">
          <li class="index-item" v-for="(item,i) in trafficDatas" :key="i" :id="item.id">
            <p>{{i+1}}<span>{{item.road}}</span>
            <span class="address-name">{{item.startRoad}}--->{{item.endRoad}}</span>
            </p>
            <span>平均速度:<span class="text">{{item.averageSpeed}}</span></span>
            <span>路长:<span class="address-name text">{{item.length}}</span></span>
          </li>
        </ul>
    </div>
    <!-- <el-dialog title="" :visible.sync="drawer">
      <data-order :value='order_value'></data-order>
    </el-dialog> -->
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import dataOrder from "./dataOrder.vue";
import mTitle from "@/components/UI_el/title_com.vue";
export default {
  name: "overview_left",
    data() {
    return {
      stime:"",
      etime:"",
      map: {},
      indexDatascar:[

      ],
      passCarCount:{
        count:"",
        todayCount:'',
        yesterdayCount:''
      },
      trailCallCount:{
        count:"",
        todayCount:'',
        yesterdayCount:''
      },
      centerstatics:{
        incount:'',
        outcount:'',
        addIn:'',
        proportion:'',
        // indexDatas:[]
      },
      indexDatas: [
        // {
       
        // }
      ],
      indexDatastr:'',
      // indexDatas: [
      //   {"city":"西安",
      //   "index":"2.1",
      //   "inNum":"+0.3%",
      //   "outNum":"-0.1%",
      //   "proportion":"22"},
      //   {"city":"渭南","index":"1.1","week_radio":"+0.3%","his_radio":"-0.1%","proportion":"52"}],
      trafficDatas: [
        {"road":"西安","index":"2.1","averageSpeed":"33.2","length":"1.5","startRoad":"西兰高速公路","endRoad":"空工立交"},
      {"road":"西安","index":"2.1","averageSpeed":"24","length":"2.2","startRoad":"西兰高速公路","endRoad":"空工立交"}],
      selectItem:{"road":"西安",order:8},
      order_value:'',
      drawer:false
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
  components: {
    dataOrder,
    mTitle
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
       //获取轨迹数据
    getIndexData() {
      let that = this;
      //ajax调用
      // interf.GET_HIS_CAR_API({id: ""},function(data){

      // }),
      //axios调用
      //  //获取历史过车数据  GET_HIS_CAR_API
      interf.GET_HIS_CAR_API({
        id:""
      })
      .then(response=>{
        if (response && response.status == 200){
          var data= response.data;
          // console.log(data)
          if (data.errcode == 0){
            //  console.log(data.data.count)
            that.passCarCount.count=data.data.count;
            //  console.log(that.passCarCount.count)
            that.passCarCount.todayCount=data.data.todayCount;
            that.passCarCount.yesterdayCount=data.data.yesterdayCount;
          }
        }

      })
      // 获取交通动态检测数据  GET_TRA_API
      // format( this.startLimit, 'YYYY-MM-DD HH:mm:ss')
      interf.GET_TRA_API({
        id:"",
        stime:"new Date(new Date().getTime() - 1 * 60 * 60 * 1000)",
        etime:"new Date()"
      })
      .then(response=>{
        if (response && response.status == 200){
          var data= response.data;
          if (data.errcode == 0) {
            that.centerstatics.incount=data.data.incount;
            that.centerstatics.addIn=data.data.addIn;
            that.centerstatics.outcount=data.data.outcount;
            that.centerstatics.inoutProportion=data.data.inoutProportion;
      
            var obj=data.data.data;
           for(var key in obj){
            that.indexDatas.push(obj[key])
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
      //获取轨迹查询数据  GET_TRAIL_API
      interf.GET_TRAIL_API({
         id: ""
      })
      .then(response=>{
        if (response && response.status == 200){
          //  console.log(response.data)
           var data = response.data;
          //  console.log(data)
            if (data.errcode == 0) {
              that.trailCallCount.count=data.data.count;
              that.trailCallCount.todayCount=data.data.todayCount;
              that.trailCallCount.yesterdayCount=data.data.yesterdayCount;
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
  //显示数据排名
   showOrder(f){
     this.drawer=true;
     this.order_value=f;
     let that=this;
    //  发送请求 获取历史过车列表 GET_HIS_CAR_LIST_API
    interf.GET_HIS_CAR_LIST_API({
          id: ""
        })
        .then(response => {
          if (response && response.status == 200) {
            var data = response.data.data;
            console.log(data)
            if (data.errcode == 0) {
              that.indexDatascar=data.data;
              // that.indexDatascar['TODAYNUM']=data.data[0].TODAYNUM;
              // that.indexDatascar['YJDFZJG']=data.data[0].YJDFZJG;
              // that.indexDatascar['YESTERDAYNUM']=data.data[0].YESTERDAYNUM;
              // that.indexDatascar['TODAYPROPORTION']=data.data[0].TODAYPROPORTION;
            } else {
              that.$message({
                message: data.errmsg,
                type: "error",
                duration: 1500
              });
            }
          }
        })
        .catch(e => {
          console.error(err);
        })
        .finally(() => {
          that.tableLoading = false;
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
    height:25%;
    perspective:1000;transform-style:preserve-3d;
    // background: url('./image/left_top_bg.png')no-repeat;
    // background-size: 100% 100%;
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
        background:url('./image/left_bg.png') no-repeat;
        background-size:100% 100%;
        >div{
          @include flex(column, center,start);
          width:50%;
        }
        >div:nth-child(1){
          align-items: center;
        }
        .row_value{
          // border: 1px solid $color-info;
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
    clear:both;
    width:100%;
    height:35vh;
    overflow:hidden;
    // overflow:scroll;
    padding:0 10px 10px 10px;
    .center_txt{
      width:100%;
      height:4vh;
      line-height:4vh;
      padding-left:5%;
      color:$color-info;     
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
      // width:474px;
      // height:407px;
      width:100%;
      
    }
  }
  &--bottom{
    width:100%;
    height:30%;
    padding:0 10px 10px 10px;
    ul{
      margin:0;
      display: block;
      width: 80%;
      li{
        border-bottom: 1px solid $color-info;
      }
    }
  }
}
.overview-left-div--bottom span{
  margin: 0 1vw;
  
}
.overview-left-div--bottom .text{
  color: #0CA6FF;
}
</style>