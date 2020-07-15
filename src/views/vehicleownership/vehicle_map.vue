<template>
  <div class="device-map">
    <!-- <div @click='changeTable(0)'><m-title label='城市' :img_type='!tableIndex?"1":"0"' style='width:8vw;'></m-title></div>
    <div @click='changeTable(1)'><m-title label='区县' :img_type='tableIndex?"1":"0"' style='width:10vw;'></m-title></div> -->
    <t-area :indexData='areaIndexs' :isShowArea='showArea' :isShowTxt='isShowTxt'  :method='clickAreaEvent' :isResumeHight='isReturn'></t-area>
  </div>
</template>

<script>
import blur from "@/blur";
import { IMG } from "./config";
import { interf } from "./config";
import mTitle from "@/components/UI_el/map_title_com.vue";
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
        markers:[]
      },
      showArea:false,
      isShowTxt:false,
      areaIndexs:[],
      isReturn:false
    };
  },
  mounted() {
    let _this=this;
    this.map = this.$store.state.map;
    this.getAreaData();
    blur.$on('clearRoadAndMaker',function(){
      _this.cancelCityLayerStatus();
    });
  },
  components: {
    mTitle,tArea
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
  },
  methods: {
    /**
     * 切换显示城市/区县
     * @param 0->设备分布热力，1->区域填充
     */
    changeTable(t){
      // this.tableIndex=t;
      // if(t){
      //   this.showArea=true;
      //   this.hideHeatMap();
      // }else{
      //   this.showArea=false;
      //   this.addHeatMap();
      // }
      //  blur.$emit('initCityOrRoadStatics',null,null,false);
    },
    /**
     * 显示设备分布热力图
     */
    addHeatMap() {
      let that=this;
      this.map = this.$store.state.map;
      if(this.map.getSource('heatmapSource')!=undefined){
        this.map.setLayoutProperty('heatmapLayer', 'visibility', 'visible');
      }else{
        interf.GET_DEVICE_HEAT_API({}).then(response=>{
          if (response && response.status == 200){
            var data = response.data;
            if (data.errcode == 0) {
              data.data.features.map(e=>{
                e.geometry.coordinates=e.geometry.coordinates[0].split(',');
                return e;
              });
              that.map.addSource("heatmapSource", {
                  type: "geojson",
                  data: data.data//"./static/json/heat.json"/*可以是具体的服务*/
              });
              that.map.addLayer({
                  "id": "heatmapLayer",
                  "type": "heatmap",
                  "source": "heatmapSource",
                  "layout": {
                      "visibility": "visible"
                  },
                  "paint": {
                      // 一个热力图数据点的模糊范围，单位是像素，默认值30；要求：值大于等于1，可根据zoom level进行插值设置
                      "heatmap-radius": 30,
                      //一个热力图单个数据点的热力程度，默认值为1；要求：值大于等于0，支持使用property中某个的热力值
                      "heatmap-weight": {
                          "property": "mag",
                          "stops": [[0, 0], [10, 1]]
                      },
                      // 用于统一控制热力值的强度，默认值1；要求：值大于等于0，可根据zoom level进行插值设置
                      "heatmap-intensity": 1,
                      // 表示热力图颜色阶梯，阶梯的值域范围为0-1，默认值为["interpolate",["linear"],["heatmap-density"],0,"rgba(0, 0, 255, 0)",0.1,"royalblue",0.3,"cyan",0.5,"lime",0.7,"yellow",1,"red"]
                      "heatmap-color": [
                          "interpolate",
                          ["linear"],
                          ["heatmap-density"],
                          0, "rgba(0, 0, 255, 0)", 0.1, "royalblue", 0.3, "cyan", 0.5, "lime", 0.7, "yellow", 1, "red"
                      ],
                      // 表示热力图的不透明度，默认值1；值域范围0-1，可根据zoom level进行插值设置
                      "heatmap-opacity": 1,
                  }
              });
              that.map_cover.sourceList.push('heatmapSource');
              that.map_cover.lineList.push('heatmapLayer');
            }
          }
        }).catch(err=>{
          that.$message({
              message: '请求服务失败',
              type: "error",
              duration: 1500
            });
        })
        .finally(() => {
        });
      }
    },
    /**
     * 显示区域填充数据
     */
    getAreaData(){
      let that=this;
      interf.GET_MAP_AREA_API({}).then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
              that.areaIndexs=data.data;
              data.data.map(e=>{
                that.addCityPopup(e)
              });
              data.data.map(e=>{
                e.Num=e.num;
                return e;
              });
              that.areaIndexs=data.data;
              that.showArea=true;
          } else{
            that.$message({
            message: e.message,
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
    /**
     * 不显示设备分布热力图
     */
    hideHeatMap(){
      if(this.map.getLayer('heatmapLayer')!=undefined){
        this.map.setLayoutProperty('heatmapLayer', 'visibility', 'none');
      };
    },
    addCityPopup(e){
      let lnglat=e.jwd.split(' ');
      let mainDiv=document.createElement('div');
      mainDiv.style.width='8vw';
      mainDiv.style.fontSize='0.7vw';
      mainDiv.style.color='white';
      mainDiv.style.backgroundColor='rgba(3, 12, 32, 0.74)';
      mainDiv.style.border='1px solid rgb(42, 76, 162)';
      mainDiv.style.fontFamily='SourceHanSansCN';
      mainDiv.style.padding='4px 13px';
      // mainDiv.className='dev_popup';

      let title=document.createElement('p');
      title.innerHTML=e.name;
      title.className='title';
      title.style.margin='5px 0';
      mainDiv.appendChild(title);

      let p1="<p style='color:#00C6FF;margin:5px 0;'><span>汽车保有量：</span><span>"+e.num+"</span></p>";
      mainDiv.appendChild($(p1)[0]);
      
      let marker = new minemap.Marker(mainDiv, {offset: [-100, -50]}).setLngLat(lnglat).addTo(this.map);
      this.map_cover.markers.push(marker);
    },
    /**
     * 地图点击事件，回调绑定事件
     */
    clickAreaEvent(data){
      blur.$emit('initVehicleStatics',data);
      blur.$emit('setCurrentCityRow',data.name);
    },
    /**
     * 是否取消地图区域选中
     */
    cancelCityLayerStatus(){
      this.isReturn=true;
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
       this.map_cover.sourceList=[];
    }
    //清除layer
    if(this.map_cover.lineList.length>0){
      this.map_cover.lineList.forEach(e=>{
        if(this.map.getLayer(e)!=undefined){
          this.map.removeLayer(e);
        }
      });
      this.map_cover.lineList=[];
    }
    //清除popup
    if(this.map_cover.markers.length>0){
      this.map_cover.markers.forEach(e=>{
        e.remove();
      })
      this.map_cover.markers=[];
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