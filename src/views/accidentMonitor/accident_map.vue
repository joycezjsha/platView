<template>
  <div class="device-map">
    <t-area :indexData='areaIndexs' :isShowArea='showArea' :isShowTxt='isShowTxt'></t-area>
  </div>
</template>

<script>
import blur from "@/blur";
import { interf } from "./config";
import { IMG } from "./config";
import tArea from "@/components/area/area.vue";
export default {
  name: "overview_left",
    data() {
    return {
      map: {},
      isShowTxt:false,
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
    setTimeout(()=>{this.getAreaData();this.getConstructionData()},1000);
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
     * 左侧选择时间范围，地图标注时间范围内的重大警情、
     */
    initDistributionMap(data){
      this.clearMap();
      this.getAreaData(data);
      this.getConstructionData(data);
    },
    /**
     * 显示各城市填充数据
     */
    getAreaData(data){
      let that=this;
      let params={stime:1};
      if(data){
        params.stime=data.time[0];
        params.etime=data.time[1];
      }
      interf.GET_MAP_CITY_ACCI_API(params).then(response=>{
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
      mainDiv.style.backgroundColor='rgba(3, 12, 32, 0.74)';
      mainDiv.style.border='1px solid rgb(42, 76, 162)';
      mainDiv.style.fontFamily='SourceHanSansCN';
      mainDiv.style.padding='4px 13px';
      // mainDiv.className='dev_popup';

      let title=document.createElement('p');
      title.innerHTML=e.NAME;
      title.className='title';
      title.style.margin='5px 0';
      mainDiv.appendChild(title);

      let p1="<p style='color:#00C6FF;margin:5px 0;'><span>事故：</span><span>"+e.NUM+"</span></p>";
      mainDiv.appendChild($(p1)[0]);
      
      // let popup=new minemap.Popup({closeOnClick: false, closeButton: true, offset: [-8, -13]});
      // popup.setLngLat(lnglat).setDOMContent(mainDiv).addTo(this.map);

      // let el = document.createElement('div');
      // // el.style["background-image"] = "url(./static/images/"+(e.KKZT>1?"kakou":"kakou_")+".png)";
      // // el.style["background-size"] = "100% 100%";
      // el.style.width = "8px";
      // el.style.height = "8px";
      // el.style["border-radius"] = "50%";
      // el.style.backgroundColor='red';
      let marker = new minemap.Marker(mainDiv, {offset: [-8, -8]}).setLngLat(lnglat).addTo(this.map);
      this.map_cover.markers.push(marker);
      // this.map_cover.popups.push(popup);
    },
    /**
     * 获取重大事故数据
     */
    getConstructionData(){
      let that=this;
      
      interf.GET_MAP_CONSTRUCTION_API({}).then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
              that.addConstruction(data.data);
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
    addConstruction(data){
      let _this=this;
      data.map(e=>{
        _this.addMainAccidentPopup(e);
      })
    },
    /**
     * 地图显示施工图层
     */
    addMainAccidentPopup(e){

      let lnglat=e.EventCoordinate.split(' ');
      let mainDiv=document.createElement('div');
      mainDiv.style.width='13vw';
      mainDiv.style.fontSize='0.7vw';
      mainDiv.style.color='white';
      // mainDiv.className='dev_popup';

      let title=document.createElement('p');
      title.innerHTML='道路施工';
      title.className='title';
      title.style.fontSize='0.7vw';
      mainDiv.appendChild(title);

      let p1="<p style='margin:5px 0;'><span>所属城市：</span><span>"+e.nameCN+"</span></p>";
      mainDiv.appendChild($(p1)[0]);
       let p2="<p style='margin:5px 0;'><span>描述：</span><span>"+e.EventDescription+"</span></p>";
      mainDiv.appendChild($(p2)[0]);

      let popup=new minemap.Popup({closeOnClick: true, closeButton: true, offset: [5, -5]});
      popup.setLngLat(lnglat).setDOMContent(mainDiv);

      let el = document.createElement('div');
      el.style["background-image"] = "url("+IMG.SG_IMG+")";
      el.style["background-size"] = "100% 100%";
      el.style.width = "32px";
      el.style.height = "32px";
      let marker = new minemap.Marker(el, {offset: [-8, -8]}).setLngLat(lnglat).addTo(this.map).setPopup(popup);
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