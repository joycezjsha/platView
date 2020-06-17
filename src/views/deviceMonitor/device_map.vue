<template>
  <div class="device-map">
    <div @click='changeTable(0)'><m-title label='设备分布热力' :img_type='!tableIndex?"1":"0"' style='width:8vw;'></m-title></div>
    <div @click='changeTable(1)'><m-title label='设备数量区域填充' :img_type='tableIndex?"1":"0"' style='width:10vw;'></m-title></div>
    <t-area v-show='showArea'></t-area>
  </div>
</template>

<script>
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
        lineList:[]
      },
      showArea:false
    };
  },
  mounted() {
    this.map = this.$store.state.map;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    setTimeout(this.addHeatMap,3000);
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
     * 切换显示设备分布热力/区域填充
     * @param 0->设备分布热力，1->区域填充
     */
    changeTable(t){
      this.tableIndex=t;
      if(t){
        this.showArea=true;
      }else{
        this.showArea=false;
        this.addHeatMap();
      }
    },
    /**
     * 显示设备分布热力图
     */
    addHeatMap() {
      this.map = this.$store.state.map;
      if(this.map.getSource('heatmapSource')!=undefined){
        // this.map.getLayer('heatmapLayer').set
      }else{
        this.map.addSource("heatmapSource", {
            type: "geojson",
            data: "./static/json/heat.json"/*可以是具体的服务*/
        });
        this.map.addLayer({
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
        this.map_cover.sourceList.push('heatmapSource');
        this.map_cover.lineList.push('heatmapLayer');
      }
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