<template>
  <div class="car-flow">
    <!-- 左侧列表 -->
    <car-table></car-table>
    <!-- 中间地图 -->
    <middle  ref='mapModule'></middle>
    <!-- 右侧统计区 -->
    <car-info ref='staticsModule' />
  </div>
</template>

<script>
import { IMG } from "./config";
import table from "./car_table";
import blur from '../../blur.js'
import middle from "./middle";
import car_info from "./car_info";
export default {
  name: "carFlow",
  data() {
    return {
      map: {},
      i:1,
      xzqh:'',
      city:'',
      stime:'', //时间  1-实时  2-今天  3-昨天  
      timeRange:'', //自定义时间
      isShow:1, //显示对应的组件
      map_cover:{
        sourceList:[],
        lineList:[],
        markers:[],
        popups:[]
      },
    };
  },
  components:{
    carTable:table,
    carInfo:car_info,
    middle
  },
  mounted() {
    let that = this;
    that.$store.commit("setRight", '25.5vw'); 
    this.map = this.$store.state.map;
    this.map.repaint = true;
    $(window).resize(function() {
    });
    // blur.$on("determineIndex",data=>{ //接受自定义时间
    //   that.timeRange=data;
    // }) 
    // blur.$on('gettimeIndex',data=>{ //接受时间  1-实时  2-今天  3-昨天  
    //   that.stime=data;
    // }) 
    // blur.$on('getStatics',data=>{  //接受传过来的城市，行政区号
    //   that.xzqh=data.xzqh;
    //   that.city=data.city;
    // });
    blur.$on('getinitAccidentStatics',data=>{
      console.log(data)
      // that.$refs.staticsModule.getprovinceData(that.stime);
      // that.$refs.staticsModule.initSumCharts(that.stime);
      // that.$refs.staticsModule.getCarTypeDatas(that.stime) ;
    });
    // blur.$on('initAccidentMapdata',function(data){
    //   console.log(data)
    //   // that.$refs.mapModule.initAccidentMap(data);
    // });
  },
  destroyed() {
    this.flyRoutes = [];
    this.map.stop();
    let that = this;
    clearInterval(that.fly);
    that.map.setPitch(0); //设置地图的俯仰角
    that.clearMap();
  },
  methods: {
    /*##清除地图加载点、线、面、弹框*/
  clearMap(){
    //清除source
    if(this.map_cover.sourceList.length>0){
      this.map_cover.sourceList.forEach(e=>{
        if(this.map.getSource(e)!=undefined){
          this.map.removeSource(e);
        }
      })
    }
    //清除layer
    if(this.map_cover.lineList.length>0){
      this.map_cover.lineList.forEach(e=>{
        if(this.map.getLayer(e)!=undefined){
          this.map.removeLayer(e);
        }
      })
    }
    //清除popup
    if(this.map_cover.popups.length>0){
      this.map_cover.popups.forEach(e=>{
        e.remove();
      })
    }
    //清除marker
    if(this.map_cover.markers.length>0){
      this.map_cover.markers.forEach(e=>{
        e.remove();
      })
    }
  },
  }
};
</script>
<style scoped lang='scss'>
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
#cruise_table::-webkit-scrollbar {
  width: 1rem;
  height: 1rem;
  background-color: #9c9fad;
}

/*定义滚动条轨道 内阴影+圆角*/
#cruise_table::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background-color: #9c9fad;
}

/*定义滑块 内阴影+圆角*/
#cruise_table::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #ffffff;
}
.car-flow {
  
}


</style>