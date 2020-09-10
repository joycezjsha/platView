<template>
  <div class="device-map">
    <div @click='changeTable(0)'>
      <m-title label='设备分布热力' :img_type='tableIndex==0?"1":"0"' style='width:8vw;'></m-title>
    </div>
    <div @click='changeTable(1)' style='margin-left:15px;'>
      <m-title label='设备数量区域填充' :img_type='tableIndex==1?"1":"0"' style='width:11vw;'></m-title>
    </div>
    <div @click='changeTable(2)' style='margin-left:15px;'>
      <m-title label='测速执法设备' :img_type='tableIndex==2?"1":"0"' style='width:11vw;'></m-title>
    </div>
    <t-area :indexData='areaIndexs' :isShowArea='showArea' :isShowTxt='isShowTxt' :method='clickAreaEvent' ref='areaModule'></t-area>
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
          popups:[],
          sourceList:[],
          lineList:[]
        },
        showArea:false,
        isShowTxt:false,
        areaIndexs:[]
      };
  },
  mounted() {
    let _this=this;
    this.map = this.$store.state.map;
    this.getAreaData();
    this.map.setCenter([109.278987,35.747334]);
    setTimeout(this.addHeatMap,1000);
    this.map.loadImage('./static/images/speed.png', function(error, image) {
      if (error) throw error;
      _this.map.addImage('speed-device', image);
    });
    this.map.loadImage('./static/images/speed_red.png', function(error, image) {
      if (error) throw error;
      _this.map.addImage('speed-device-', image);
    });
    blur.$on('cancelCityLayerStatus',function(){
      _this.cancelCityLayerStatus();
      _this.clearMap();
    });
    blur.$on('changeCitySelect',function(data){
      if(_this.tableIndex==1){
         _this.addCityToMap(data);
      }
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
     * 切换显示设备分布热力/区域填充
     * @param 0->设备分布热力，1->区域填充，2->测速执法设备
     */
    changeTable(t){
      this.tableIndex=t;
      //清除popup
      if(this.map_cover.popups.length>0){
        this.map_cover.popups.forEach(e=>{
          e.remove();
        })
        this.map_cover.popups=[];
      }
      if(t==1){
        this.showArea=true;
        // this.addCityToMap();
        this.hideHeatMap();
        this.hideOrShowDeviceLayer(false);
      }else if(t==0){
        this.showArea=false;
        this.clearMap();
        this.addHeatMap();
        this.hideOrShowDeviceLayer(false);
      }else{
        this.showArea=false;
        // this.clearMap();
        this.hideHeatMap();
        this.hideOrShowDeviceLayer(true);
        this.map.on('click',this.clickSpeedDevice);
      };
       blur.$emit('initCityOrRoadStatics',null,null,false);
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
              that.$store.state.map.addSource("heatmapSource", {
                  type: "geojson",
                  data: data.data//"./static/json/heat.json"/*可以是具体的服务*/
              });
              that.$store.state.map.addLayer({
                  "id": "heatmapLayer",
                  "type": "heatmap",
                  "source": "heatmapSource",
                  "layout": {
                      "visibility": "visible"
                  },
                  "paint": {
                      // 一个热力图数据点的模糊范围，单位是像素，默认值30；要求：值大于等于1，可根据zoom level进行插值设置
                      "heatmap-radius": 15,
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
          // that.$message({
          //     message: '请求服务失败',
          //     type: "error",
          //     duration: 1500
          //   });
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
      interf.GET_DEVICE_AREA_API({}).then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
              data.data.map(e=>{
                e.Num=e.NUM;
                return e;
              });
              that.areaIndexs=data.data;
          } else{
            
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
    addCityToMap(xzqh){
      // let that=this;
      // that.areaIndexs.forEach(e=>{
      //   that.addCityPopup(e);
      // })
      let _this=this;
      if(!xzqh) return;
      let data=this.areaIndexs;
      _this.map_cover.popups.forEach(e=>{
          e.remove();
        });
      for(let i=0;i<data.length;i++){
        if(data[i].XZQH==xzqh || xzqh.indexOf(data[i].XZQH)!=-1){
          _this.addCityPopup(data[i]);
        }
      }
    },
    addCityPopup(e){
      let that=this;
      let lnglat=e.jwd.split(' ');
      let mainDiv=document.createElement('div');
      mainDiv.style.width='6vw';
      mainDiv.style.fontSize='0.7vw';
      mainDiv.style.color='white';
      // mainDiv.style.backgroundColor='rgba(3, 12, 32, 0.74)';
      // mainDiv.style.border='1px solid rgb(42, 76, 162)';
      mainDiv.style.fontFamily='SourceHanSansCN';
      mainDiv.style.padding='4px 13px';
      // mainDiv.className='dev_popup';

      let title=document.createElement('p');
      title.innerHTML=e.city;
      title.className='title';
      title.style.margin='5px 0';

      let closeimgDiv = document.createElement("div");
      closeimgDiv.className = "closeImgDiv";
      let closeimg = document.createElement("img");
      closeimg.src = IMG.CLOSE_IMG;
      closeimg.className = "closeImg";
      closeimgDiv.appendChild(closeimg);
      title.appendChild(closeimgDiv);
      closeimg.addEventListener("click", function() {
        that.map_cover.popups.forEach(e=>{
          e.remove();
        });
        that.cancelCityLayerStatus();
      });
      closeimg.addEventListener("mouseover", function() {
        this.setAttribute("src", IMG.CLOSE_HOVER_IMG);
      });
      closeimg.addEventListener("mouseout", function() {
        this.setAttribute("src", IMG.CLOSE_IMG);
      });

      mainDiv.appendChild(title);

      let p1="<p style='color:#00C6FF;margin:5px 0;'><span>设备数量：</span><span>"+e.NUM+"</span></p>";
      mainDiv.appendChild($(p1)[0]);
      
      let popup=new minemap.Popup({closeOnClick: false, closeButton: true, offset: [-8, -13]});
      popup.setLngLat(lnglat).setDOMContent(mainDiv).addTo(this.map);
      this.map_cover.popups.push(popup);
    },
    /**
     * 获取测速设备数据
     */
    showMeasurementDevice(){
      let that=this;
      interf.GET_DEVICE_SPEED_API({}).then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
             that.addMeasureDeviceMarker(data.data);
          } else{
            that.$message({
              message: '请求服务失败',
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
     * 地图添加测速设备点位图层
     */
    addMeasureDeviceMarker(data){
      let that=this;
      let jsonData = {
          "type": "FeatureCollection",
          "features": []
      };
      data.forEach(e=>{
        if(e.JD!='' && e.WD!=''){
          jsonData.features.push({
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [e.JD,e.WD]
          },
          "properties": {
            "SBBH": e.SBBH,
            "SBMC": e.SBMC,
            "CITY":e.CITY,
            "TYPE":e.TYPE==0?'-':''
          }
          });
        }
      })
        this.map.addSource("speedDeviceSource", {
            "type": "geojson",
            "data": jsonData
        });
        this.map_cover.sourceList.push('speedDeviceSource');
        this.map.addLayer({
            "id": "deviceLayer",
            "type": "symbol",
            "source": "speedDeviceSource",
            "layout": {
                "visibility": "visible",
                "icon-image": "speed-device{TYPE}",
                // "text-field": "{title}",
                // "text-offset": [0, 0.6],
                // "text-anchor": "top",
                // "text-size": 14,
                "icon-allow-overlap": false,  //图标允许压盖
                // "text-allow-overlap": true,   //图标覆盖文字允许压盖
            },
            "paint": {
                "icon-color": {
                    "type": "categorical",
                    "property": "kind",
                    "stops": [["school", "#ff0000"], ["park", "#00ff00"], ["hospital", "#0000ff"]],
                    "default": "#ff0000"
                },
                "text-color": {
                    "type": "categorical",
                    "property": "kind",
                    "stops": [["school", "#ff0000"], ["park", "#00ff00"], ["hospital", "#0000ff"]],
                    "default": "#ff0000"
                },
                "text-halo-color": "#000000",
                "text-halo-width": 0.5,
            },
            "minzoom": 3,
            "maxzoom": 17.5
        });
        this.map_cover.lineList.push('deviceLayer');
    },
    /**
     * 隐藏或者显示测速设备图层
     */
    hideOrShowDeviceLayer(f){
      let val='visible';
      if(!f){
        val='none';
      };
      if(this.map.getLayer('deviceLayer')!=undefined){
        this.map.setLayoutProperty('deviceLayer', 'visibility', val);
        
      }else{
        this.showMeasurementDevice();
      }
    },
    /**
     * 地图点击测速设备图层回调
     */
    clickSpeedDevice(event){
      let renderLayerIds = ["deviceLayer"];
      let features = this.map.queryRenderedFeatures(event.point, {
        layers: renderLayerIds
      });
      if(features && features.length > 0) {
        let e=features[0].properties;
        let lnglat=[event.lngLat.lng,event.lngLat.lat];
        let mainDiv=document.createElement('div');
        mainDiv.style.width='8vw';
        mainDiv.style.fontSize='0.7vw';
        mainDiv.style.color='white';
        // mainDiv.style.backgroundColor='rgba(3, 12, 32, 0.74)';
        // mainDiv.style.border='1px solid rgb(42, 76, 162)';
        mainDiv.style.fontFamily='SourceHanSansCN';
        mainDiv.style.padding='4px 13px';

        let title=document.createElement('p');
        title.innerHTML='设备编号['+e.SBBH+']';
        title.className='title';
        title.style.margin='5px 0';

        mainDiv.appendChild(title);

        // let p1="<p style='color:#00C6FF;margin:5px 0;'><span>设备编号：</span><span>"+e.SBBH+"</span></p>";
        // mainDiv.appendChild($(p1)[0]);

        let p2="<p style='color:#00C6FF;margin:5px 0;'><span>设备名称：</span><span>"+e.SBMC+"</span></p>";
        mainDiv.appendChild($(p2)[0]);

        let p3="<p style='color:#00C6FF;margin:5px 0;'><span>管理部门：</span><span>"+e.CITY+"</span></p>";
        mainDiv.appendChild($(p3)[0]);

        // let marker = new minemap.Marker(mainDiv, { offset: [-25, -25] })
        //   .setLngLat(lnglat)
        //   .addTo(this.map);
        // this.map_cover.markers.push(marker);
        
        let popup=new minemap.Popup({closeOnClick: true, closeButton: true, offset: [-8, -13]});
        popup.setLngLat(lnglat).setDOMContent(mainDiv).addTo(this.map);
        this.map_cover.popups.push(popup);
      }
    },
/*##清除地图加载点、线、面、弹框*/
  clearMap(){
    //清除popup
    if(this.map_cover.popups.length>0){
      this.map_cover.popups.forEach(e=>{
        e.remove();
      })
      this.map_cover.popups=[];
    }
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
    /**
     * 地图点击事件，回调绑定事件
     */
    clickAreaEvent(data){
      blur.$emit('initCityOrRoadStatics',0,data,true);
      blur.$emit('setCurrentRow',data.name);
      this.addCityToMap(data.value);
    },
    /**
     * 是否取消地图区域选中
     */
    cancelCityLayerStatus(){
      this.$refs['areaModule'].resumeLayer();
      this.map.setPitch(0);
    }
    
  },
  beforeDestroy(){
    this.map.setPitch(0);
    this.clearMap();
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
  left: 750px;
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