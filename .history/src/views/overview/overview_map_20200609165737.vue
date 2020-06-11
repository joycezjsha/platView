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
      map: {},
      areaList:[],
      map_cover:{
        markers:[]
      }
    };
  },
  mounted() {
    this.map = this.$store.state.map;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.getCityCarFlowData();
  },
  components: {
  },
  destroyed() {
    this.map.setPitch(0);
  },
  methods: {
    /**
     * 获取获取地图城市流动数据
     */
    getCityCarFlowData() {
      let that = this;
      interf.GET_MAP_CITY_FLOW_API({})
      .then(response=>{
        if (response && response.status == 200){
          var data= response.data;
          console.log(data)
          if (data.errcode == 0){
           if(data.data.length>0){
             data.data.forEach(e=>{
               that.addCityMarker(e);
             })
           }
          }
        }

      })
     
      
    },
    addCityMarker(item){
      debugger;
      var el = document.createElement('div');
      el.id = 'marker';
      el.style["border"] = "solid 1px #333333";
      el.style["backgroundColor"] = "white";
      el.style["padding"] = "4px 6px";

      var span1 = document.createElement('span');
      span1.innerHTML = item.city;
      el.appendChild(span1);
      //添加marker
      var lnglat = [item.longitude,item.latitude];
      var marker = new minemap.Marker(el, {offset: [-25, -25]}).setLngLat(lnglat).addTo(this.map);
      this.map_cover.markers.push(marker);

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
  width: 78px;
  height: 245px;
  bottom: 13px;
  padding:20px 15px;
  color:$color-white;
  // @include flex(column, center,center);
  &--legend{
    width:100%;
    height:150px;
    ul{
      padding:0;
      display: inline-block;
      width:50px;
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
    margin-top:20px;
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

</style>