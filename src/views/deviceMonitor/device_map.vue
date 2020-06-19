<template>
  <div class="device-map">
    <div @click='changeTable(0)'>
      <m-title label='设备分布热力' :img_type='!tableIndex?"1":"0"' style='width:8vw;'></m-title>
    </div>
    <div @click='changeTable(1)'><m-title label='设备数量区域填充' :img_type='tableIndex?"1":"0"' style='width:8vw;'></m-title></div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import mTitle from "@/components/UI_el/map_title_com.vue";
export default {
  name: "overview_left",
    data() {
    return {
      map: {},
      tableIndex:0,
      map_cover:{
        sourceList:[],
        lineList:[],
        popups:[],
        markers:[]
      }
    };
  },
  mounted() {
    this.map = this.$store.state.map;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);

  },
  components: {
    mTitle
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
  },
  methods: {
    /**
     * 切换显示设备分布热力/区域填充
     * @param 0->城市统计，1->道路统计
     */
    changeTable(t){
      this.tableIndex=t;
    },
    /**
     * 获取获取地图城市流动数据
     */
    getCityCarFlowData() {
      let that = this;
      interf.GET_MAP_CITY_FLOW_API({})
      .then(response=>{
        if (response && response.status == 200){
          let data= response.data;
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
    //   })
      
    },
    addCityMarker(item){
      let el = document.createElement('div');
      el.id = 'marker';
      // el.style["border"] = "solid 1px #333333";
      // el.style["backgroundColor"] = "#333";
      el.style["padding"] = "4px 6px";
      el.style.color='white';
      
      let leftImgDiv=document.createElement('div');
      leftImgDiv.style.float='left';
      leftImgDiv.style.width='20px';
      leftImgDiv.style.height='40px';
      leftImgDiv.style.lineHeight='30px';
      let img_i = document.createElement('i');
      img_i.className='iconfont icon-shangsheng';
      img_i.style.color='#FFAF05';
     
      if(item.addIn<0){
        img_i.style.color='#00DFC7';
        leftImgDiv.style.transform='rotate(180deg)';
        leftImgDiv.style.lineHeight='50px';  
      }
      leftImgDiv.appendChild(img_i);
      el.appendChild(leftImgDiv);

      let rightDiv=document.createElement('div');
      rightDiv.style.float='right';
      rightDiv.style.width='40px';
      rightDiv.style.height='30px';
      let span1 = document.createElement('p');
      span1.innerHTML = item.city;
      span1.style.margin='0';
      rightDiv.appendChild(span1);
      let span2 = document.createElement('p');
      span2.innerHTML = item.addIn;
      span2.style.margin='0';
      span2.style.color='#FFAF05';
      if(item.addIn<0) span2.style.color='#00DEC7';
      rightDiv.appendChild(span2);
      el.appendChild(rightDiv);
      //添加marker
      let lnglat = [item.longitude,item.latitude];
      let marker = new minemap.Marker(el, {offset: [-25, -25]}).setLngLat(lnglat).addTo(this.map);
      this.map_cover.markers.push(marker);

    },
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

.device-map {
  position: fixed;
  z-index: 10;
  left: 691px;
  width: 340px;
  height: 39px;
  bottom: 15px;
  color:$color-white;
  @include flex(row,center,center);
  >div{
    @include flex(column,center,center);
    width:50%;
    height:100%;
    cursor:pointer;
  }
}

</style>
<style lang='scss'>

</style>