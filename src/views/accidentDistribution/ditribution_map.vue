<template>
  <div class="device-map">
    <t-area :indexData='areaIndexs' :isShowArea='showArea'></t-area>
  </div>
</template>

<script>
import blur from "@/blur";
import { interf } from "./config";
import tArea from "@/components/area/area.vue";
export default {
  name: "overview_left",
    data() {
    return {
      map: {},
      tableIndex:0,
      map_cover:{
        sourceList:[],
        lineList:[],
        markers:[],
        popups:[]
      },
      showArea:true,
      areaIndexs:[]
    };
  },
  mounted() {
    this.map = this.$store.state.map;
    setTimeout(()=>{this.getAreaData();},1000);
  },
  components: {
    tArea
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
  },
  methods: {
    
    /**
     * 切换显示设备分布热力/区域填充
     * @param 0->设备分布热力，1->区域填充
     */
    changeTable(t){
      this.tableIndex=t;
      if(t){
        this.showArea=true;
        this.hideHeatMap();
      }else{
        this.showArea=false;
        this.addHeatMap();
      }
       blur.$emit('initCityOrRoadStatics',null,null,false);
    },
    /**
     * 显示区域填充数据
     */
    getAreaData(){
      let that=this;
      interf.GET_CITY_MAP_API({stime:1}).then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
              that.areaIndexs=data.data;
              that.addCityAccident(data.data);
          }else{
            that.$message({
            message: response.errmsg,
            type: "error",
            duration: 1500
          });
          }
        }
      })
      .catch(err=>{
         that.$message({
            message: '请求服务失败',
            type: "error",
            duration: 1500
          });
      })
      .finally(() => {
      });
    },
    addCityAccident(data){
      let _this=this;
      _this.clearMap();
      data.map(e=>{
        _this.addCityPopup(e);
      })
    },
    /**
     * 地图显示各市重大事故数量
     */
    addCityPopup(e){
      let lnglat=e.JWD.split(' ');
      let mainDiv=document.createElement('div');
      mainDiv.style.width='6vw';
      mainDiv.style.fontSize='0.7vw';
      mainDiv.style.color='white';
      // mainDiv.className='dev_popup';

      let title=document.createElement('p');
      title.innerHTML=e.CITY;
      title.className='title';
      title.style.margin='5px 0';
      mainDiv.appendChild(title);

      let p1="<p style='color:#00C6FF;margin:5px 0;'><span>事故：</span><span>"+e.ACCIDENTNUM+"</span></p>";
      mainDiv.appendChild($(p1)[0]);
      
      let popup=new minemap.Popup({closeOnClick: false, closeButton: true, offset: [-8, -20]});
      popup.setLngLat(lnglat).setDOMContent(mainDiv).addTo(this.map);

      let el = document.createElement('div');
      // el.style["background-image"] = "url(./static/images/"+(e.KKZT>1?"kakou":"kakou_")+".png)";
      // el.style["background-size"] = "100% 100%";
      el.style.width = "15px";
      el.style.height = "15px";
      el.style["border-radius"] = "50%";
      el.style.backgroundColor='red';
      let marker = new minemap.Marker(el, {offset: [-15, -15]}).setLngLat(lnglat).addTo(this.map).setPopup(popup);
      this.map_cover.markers.push(marker);
      this.map_cover.popups.push(popup);
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
      //清除marker
      if(this.map_cover.markers.length>0){
        this.map_cover.markers.forEach(e=>{
          e.remove();
        })
      }
      //清除popup框
      if(this.map_cover.popups.length>0){
        this.map_cover.popups.forEach(e=>{
          e.remove();
        })
      }
      this. map_cover={
          sourceList:[],
          lineList:[],
          markers:[],
          popups:[]
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