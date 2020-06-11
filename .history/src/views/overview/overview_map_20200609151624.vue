<template>
  <div class="overview-map">
    <div class='overview-map--legend'>
      <ul>
        <li></li>
        <li></li>
      </ul>
      <div class='lengend'></div>
    </div>
    <div class='overview-map--icon'>
      <ul>
        <li>警情<i class='iconfont icon-jingqing'></i></li>
        <li>事故<i class='iconfont icon-shigu'></i></li>
      </ul>
    </div>
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
      map: {}
    };
  },
  mounted() {
    this.map = this.$store.state.map;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.getIndexData();
  },
  components: {
  },
  destroyed() {
    this.map.setPitch(0);
  },
  methods: {
    /**
     * 获取数据
     */
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
/*##清除地图加载点、线、面、弹框*/
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
/** */
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
  width: 450px;
  height: 90vh;
  top: 9vh;
  color:$color-white;
  @include flex(column, center,center);
  &--top{
    width:100%;
    height:22%;
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
    height:50%;
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
      // width:474px;
      height:65%;
      width:100%;
      
    }
  }
  &--bottom{
    width:100%;
    height:30%;
    margin-top:8%;
    padding:0 10px;
    ul{
      margin:3% 0 0 0;
      display: block;
      padding: 0 15px;
      width: 90%;
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
            width: 15%;
          }
          .address-name{
            width:68%;
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