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
            </div>
            <div class="top-container">
              <div class='top-container-row'>
                <el-col :span='5' style='width:50%'>历史过车数据：</el-col>
                <el-col :span='19' class="row_value">{{passCarCount.count}}</el-col>
              </div>
              <div class='top-container-row-'>
                <div>今日上传<br/><span class="row_value_">{{passCarCount.todayCount}}<span>次</span></span></div>
                <div>昨日上传<br/><span class="row_value_">{{passCarCount.yesterdayCount}}<span>次</span></span></div>
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
                <div>今日调用<br/><span class="row_value_">{{trailCallCount.todayCount}}<span>次</span></span></div>
                <div>昨日调用<br/><span class="row_value_">{{trailCallCount.yesterdayCount}}<span>次</span></span></div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div class='overview-left-div--center boxstyle'>
       <!-- <span class='span_title'>交通动态监测</span> -->
       <m-title label='交通动态监测' img_type=1  class='title'></m-title>
       <div class='center_txt'>实时统计上一个小时（{{center_time}}）的流动情况</div>
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
         <span class="">{{centerstatics.inoutProportion | number}}%</span></div>
       </div>
       <div class='center_table'>
         <!-- style="width: 100%"  max-height="250" -->
         <el-table :data="centerstatics.tableDatas" style="width:94%;margin:0 3%;"
           height="100%" :default-sort = "{prop: 'week_radio', order: 'descending'}" 
           :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass" v-loading='tableLoading'>
           <el-table-column fixed type="index" label="No" width="50"></el-table-column> 
           <el-table-column prop="city" label="城市" width="70"></el-table-column>
            <el-table-column prop="inNum" label="进入车辆"  sortable></el-table-column>
            <el-table-column prop="outNum" label="流出车辆"   sortable></el-table-column>
            <el-table-column prop="proportion" label="进出比" sortable>
             
            </el-table-column>
          </el-table>
       </div>
    </div>
    <div class='overview-left-div--bottom  boxstyle'>
      <m-title label='境内路况监测' img_type=1  class='title'></m-title>
       <ul class="traffic-index_content_table">
          <li class="index-item" v-for="(item,i) in trafficDatas" :key="i" :id="item.id">
            <p><span class='number'>{{i+1}}</span><span class='road'>{{item.roadname}}</span>
              <span class="address-name">{{item.stratname}}--->{{item.endname}}</span>
            </p>
            <p>
              <span class='road'>平均速度:<span class="text">{{item.sd}}km/h</span></span>
              <span class="address-name">路长:<span class="text">{{item.cd}}km</span></span>
            </p>
          </li>
        </ul>
    </div>
    <el-dialog :title="order_value==1 ? '今日轨迹接口调用情况':'过车数据回传排行'" :visible.sync="drawer" append-to-body class='data-order'>
      <data-order :order_value="order_value"></data-order>
    </el-dialog>
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
      center_time:(new Date().getHours()-1)+'：00-'+new Date().getHours()+':00',
      map: {},
      indexDatascar:[],
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
        tableDatas:[]
      },
      indexDatastr:'',
      trafficDatas: [],
      selectItem:{"road":"西安",order:8},
      order_value:'',
      drawer:false,
      tableLoading:false
    };
  },
  computed:{},
  mounted() {
    this.map = this.$store.state.map;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(6);
    this.getIndexData();
    this.getTrafficMonitorData();
    this.getTrafficorder();
  },
  components: {
    dataOrder,
    mTitle
  },
  destroyed() {
    this.map.setPitch(0);
  },
  methods: {
  /**
   * 展示详情
   */
  showOrder(t){
    this.drawer=true;
    this.order_value=t;
  },
  //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
   },
  /**
   * 获取过车/轨迹数据
  */
    getIndexData() {
      let that = this;
      interf.GET_HIS_CAR_API({})
      .then(response=>{
        if (response && response.status == 200){
          var data= response.data;
          if (data.errcode == 0){
            that.passCarCount=data.data;
          }
        }

      });

      interf.GET_TRAIL_API({})
      .then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
              that.trailCallCount=data.data;
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
        //  console.log(err);
      })
      .finally(() => {
        that.tableLoading = false;
      });
    },
  /**
   * 获取交通动态监测数据
   */
  getTrafficMonitorData(){
    let that=this;
    interf.GET_TRA_API({
      stime:new Date(new Date().getTime() - 1 * 60 * 60 * 1000),
      etime:new Date()
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
            obj[key].city=key;
            that.centerstatics.tableDatas.push(obj[key]);
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
      // console.log(err);
    })
    .finally(() => {
      that.tableLoading = false;
    });
  },
  /**
   * 点击标签页
   */
  getTrafficorder(){
    let that=this;
    interf.GET_TAFFIC_ORDER_API({})
    .then(response=>{
      if (response && response.status == 200){
        var data= response.data;
        if (data.errcode == 0) {
          that.trafficDatas=data.data;
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
      // console.log(err);
    })
    .finally(() => {
      that.tableLoading = false;
    });
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
  left: 12px;
  width: 474px;
  height: auto;
  top: 87px;
  color:$color-white;
  @include flex(column, center,center);
  &--top{
    width:100%;
    height:186px;
    perspective:1000;transform-style:preserve-3d;
    margin-top:2px;
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
          font-size:0.7vw;
          span{
            color:$color-text-label;
            font-size:0.7vw;
          }
        }
      }
    }
  }
  &--center{
    clear:both;
    width:100%;
    height:400px;
    margin-top:2px;
    overflow:hidden;
    // overflow:scroll;
    padding:0 10px;
    .center_txt{
      width:100%;
      height:4vh;
      line-height:4vh;
      padding-left:5%;
      color:$color-info;     
    }
    .center_statics{
      width:100%;
      height:7vh;
      font-style: italic;
      @include flex(row, center,center);
      &--count{
        width:30%;
        @include flex(column, center,center);
      }
      &--inout{
        width:30%;
        @include flex(column, center,center);
        .row_value_{
          font-size:0.7vw;
        }
      }
      &--radio{
        width:30%;
        @include flex(column, center,center);
      }
    }
    .center_table{
      height:240px;
      width:100%;
      
    }
  }
  &--bottom{
    width:100%;
    height:377px;
    margin-top:2px;
    padding:0 10px;
    ul{
      margin:3% 0 0 0;
      display: block;
      padding: 0 15px;
      width: 90%;
      height: 150px;
      overflow-y: scroll;
      li{
        // border-bottom: 1px solid $color-info;
        margin-bottom: 20px;
        >p{
          margin:2% 0;
          >span{
            display: inline-block;
            font-size: 0.8vw;
            
            .text{
              // color:$color-text-label;
              color: $color-text-value;
            }
          }
        }
        >p:nth-child(1){
          .number{
            width:15%;
            text-align:center;
          }
          .road{
            width: 40%;
          }
          .address-name{
            width:43%;
            text-align:right;
          }
        }
        >p:nth-child(2){
          margin-left:15%;
          .road{
            width: 40%;
            color:$color-text-label;
             .text{
              color: $color-text-value;
            }
          }
          .address-name{
            width:58%;
            text-align:right;
            color:$color-text-label;
            .text{
              color: $color-text-value;
            }
          }
        }
      }
    }
  }
  .title{
    width:160px;
  }
}

</style>
<style lang='scss'>
.data-order {
  .el-dialog{
      background: url(./image/dialog_bg.png) no-repeat;
      background-size:100% 100%;
    }
  .el-dialog__title{
    color:white;
    font-size:20px;
  }
}
</style>