<template>
  <div class="overview-map">
    <div class='overview-map--legend'>
      <ul>
        <li v-for='(item,index) in areaList' :key='index'>{{item}}</li>
        <li></li>
      </ul>
      <div class='legend'></div>
    </div>
    <div class='overview-map--icon'>
      <ul>
        <li><span>警情</span><span><i class='iconfont icon-jingqing'></i></span></li>
        <li><span>事故</span><span><i class='iconfont icon-shigu'></i></span></li>
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

.overview-map {
  position: fixed;
  z-index: 10;
  left: 482px;
  width: 68px;
  height: 245px;
  bottom: 13px;
  padding:20px;
  color:$color-white;
  // @include flex(column, center,center);
  &--legend{
    width:100%;
    height:150px;
    ul{
      padding:0;
      display: inline-block;
      width:40px;
      height:100%;
      text-align:center;
    }
   .legend{
     display: inline-block;
     width:12px;
     height:140px;
     opacity: 0.82;
    background-image: linear-gradient(#FF7F40, #F6C500, #068FE6);
   }
  }
  &--icon{
    width:100%;
    height:110px;
    margin-top:25px;
    ul{
      padding:0;
      li{
        line-height:45px;
        span{
          display:inline-block;
          width:50%;
          text-align:center;
          font-size: 14px;
          .icon-jingqing:before{
            color:$color-red;
            font-size:24px;
          }
          .icon-shigu:before{
            color:$color-red;
            font-size:25px;
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