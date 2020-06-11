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
        <li><div>警情</div><div><img :src='jqImg' /></div></li>
        <li><div>事故</div><div><img :src='sgImg' /></div></li>
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
      },
      jqImg:IMG.jqImg,
      sgImg:IMG.sgImg
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
     interf.GET_MAP_CAR_FLOW_API({})
      .then(response=>{
        if (response && response.status == 200){
          let data= response.data;
          console.log(data)
          if (data.errcode == 0){
           if(data.data.length>0){
             data.data.forEach(e=>{
              //  that.addCityMarker(e);
             })
           }
          }
        }

      })
      
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
  left: 500px;
  width: 78px;
  height: 245px;
  bottom: 13px;
  padding:20px 15px;
  background-color:#010416;
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
    //  opacity: 0.82;
     border-radius: 8px;
     background-image: linear-gradient(#402720, #2c3224, #05284b);

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
        div{
          display:inline-block;
          width:50%;
          text-align:center;
          font-size: 14px;
        }
        div:nth-child(2){
          img{
            vertical-align: middle;
            margin-bottom: 8px;
          }
        }
      }
    }
  }
}

</style>
<style lang='scss'>

</style>