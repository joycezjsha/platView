<template>
  <div></div>
</template>

<script>
import conf from "./config";
export default {
  name: "area",
  data() {
    return {
      map: "",
      areaColors: [
        [6,143,230,0.82],
        [246,197,0,0.82],
        [255,127,64,0.82]
      ],
      mapAddItems: {
        polygons: [],
        sourceList: [],
        lineList: [],
        popups: []
      }
    };
  },
  props:{
    isShowArea: {
      type: Boolean,
      default: true
    },
    isShowTxt:{
       type: Boolean,
      default: true
    },
    indexData:{
      type:Array,
      default: () => {
        return []
      }
    }
  },
  watch:{
    isShowArea:{
      immediate: false,
      handler: function(cVAL, oVAL) {
        if(cVAL){
          this.initArea();
        }else{
          this.hideArea();
        }
      }
    }
  },
  computed: {},
  mounted() {
    this.map = this.$store.state.map;
    if(this.isShowArea) this.initArea();
  },
  methods: {
    hideArea(){
      this.mapAddItems.polygons.forEach(e => {
        if (this.map.getLayer(e) != undefined) {
          this.map.setLayoutProperty(e, 'visibility', 'none');
        }
      });
    },
    /**
     *获取区域数据
     */
    initArea() {
      let that = this;
      if(this.mapAddItems.polygons && this.mapAddItems.polygons.length>0){
        this.mapAddItems.polygons.forEach(e => {
          if (this.map.getLayer(e) != undefined) {
            this.map.setLayoutProperty(e, 'visibility', 'visible');
          }
        });
      }else{
      $.ajax({
        url: "./static/json/cropsAreaJson.json", //globals.CRUISE_ALL_INFO_URL,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        responseType: "json",
        method: "get",
        dataType: "json",
        data: {
          // token: window.localStorage.getItem("loginUserToken")
        },
        success: function(data) {
          if (data.errorcode == "0" && data.data.length > 0) {
            let datas = [];
            data.data.map(e => {
              datas.push({
                city: e.Name,
                adcode:e.AdminCode,
                areaGeometry:e.geometry,
                color:e.color
              });
            });
            datas=that.sortArea(datas);
            that.clearMap();
            that.addArea(datas);
            // that.addAreaIdentify(data.data);
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
        }
      });
      }
    },
    addArea(data) { 
      let _this = this;
      data.forEach((e, i) => {
        if(e.color=='#aN') return;
        let lonlats = _this.getLonlats(e.areaGeometry)[0].split(",");
        lonlats = lonlats.map(e => {
          if (e.split(" ")[0] != "") {
            return [e.split(" ")[0], e.split(" ")[1]];
          } else {
            return [e.split(" ")[1], e.split(" ")[2]];
          }
        });
        let jsonData = {
          type: "FeatureCollection",
          features: [{
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [lonlats]
              },
              "properties": {
                  "title": e.city
              }
            }]
        };
         _this.map.addSource('area_polygonSource_'+i, {
            'type': 'geojson',
            'data': jsonData
        });
        //面的显示
        _this.map.addLayer({
            "id": "area_polygon_"+i,
            "type": "fill",
            "source": "area_polygonSource_"+i,
            "layout": {
                "visibility": "visible",
            },
            "paint": {
                "fill-color": e.color,
                "fill-opacity": 0.3,
                "fill-outline-color": '#00b3ff'
            },
            "minzoom": 4,
            "maxzoom": 17.5
        });
        //面的名称显示
        if(_this.isShowTxt){
          _this.map.addLayer({
            "id": "area_polygon_txt_"+i,
            "type": "symbol",
            "source": "area_polygonSource_"+i,
            "layout": {
                // "icon-image": "{icon}-15",
                "text-field": "{title}",
                // "text-offset": [0, 0.6],
                // "text-anchor": "top"
            },
            "paint": {
                "icon-color": "#696d79",
                 "text-color": {
                    "type": "categorical",
                    "property": "kind",
                    "stops": [["school", "#ff0000"], ["park", "#00ff00"], ["hospital", "#0000ff"]],
                    "default": "#FFF"
                }
            }
        });
        _this.mapAddItems.polygons.push("area_polygon_txt_"+i);
        };
        
        _this.mapAddItems.sourceList.push("area_polygonSource_"+i);
        _this.mapAddItems.polygons.push("area_polygon_"+i);
        
      });
    },
    /**
     * 根据一定权重给区域排序
     */
    sortArea(data){
      let _this=this;
      let max,min;
      //返回数组合并、并排序的结果
      if(this.indexData.length<data.length){
        return [];
      }
       this.indexData.forEach(e=>{
        if(!max){
          max=e.Num;
        }else{
          max=max<e.Num?e.Num:max;
        }
        if(!min){
          min=e.Num;
        }else{
          min=min>e.Num?e.Num:min;
        }
      })
      this.indexData.forEach(e=>{
        for(var j=0;j<data.length;j++){
            if(data[j].adcode.indexOf(e.XZQH)!=-1){
                data[j].Num=e.Num;
                break;
            }
        }
      })
      data=data.sort((a,b)=>{return a.Num -b.Num});
      data.map(e=>{
        e.color=_this.multiply(max,min,e.Num);
        return e;
      });
      console.log(data);
      return data;
    },
    /**
     * 计算颜色叠加值
     */
    multiply(max,min,value) {
      let result = [],position,item=(max-min)/2;
      if(item>value){
        position=0;
      }else{
        position=1;
      };
      switch(position){
        case 0:{
          for( let i = 0; i < this.areaColors[0].length; i++ ) {
              let f=(value-min)/item;
              result.push(Math.floor( this.areaColors[0][i]+f*( this.areaColors[1][i] -  this.areaColors[0][i])));
          };
          break;
        }
        case 1:{
          for( let i = 0; i < this.areaColors[1].length; i++ ) {
              let f=(value-item)/item;
              result.push(Math.floor( this.areaColors[1][i]+f*( this.areaColors[2][i] -  this.areaColors[1][i])));
          };
          break;
        }
        default:break;
      }
      return 'rgba('+result[0]+','+result[1]+','+result[2]+',0.82)';
      // return this.colorRGBtoHex('rgba('+result[0]+','+result[1]+','+result[2]+',0.82)');
    },
     /**
     * rgb转16进制
     */
    colorRGBtoHex(color) {
      var rgb = color.split(',');
      var r = parseInt(rgb[0].split('(')[1]);
      var g = parseInt(rgb[1]);
      var b = parseInt(rgb[2].split(')')[0]);
      var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      return hex;
    },
    /**
     * 添加指数悬浮框
     * careated by ..
     */
    addAreaIdentify(data) {
      let that = this;
      data.forEach((item, i) => {
        let newTpi = item.areaTpi;
        let newTpis = newTpi.toFixed(0);
        newTpi = (newTpi / 10).toFixed(1);
        let curTpiColor = that.getTpiColor(newTpis);
        let w = 145;
        let h = 30;
        let tw = 113;
        if (item.areaName.length > 6) {
          h = 60;
        }
        //在地图上显示指数和道路名称
        let mainDiv = $(
          "<div style='border:1px solid #9A9A9A;height: " +
            h +
            "px;width: " +
            w +
            "'></div>"
        );
        let tpiDiv = $(
          "<div class='tpi' style='width:30px;text-align: center;float:left;background:" +
            curTpiColor +
            ";color:#2c3453;height: " +
            h +
            "px'></div>"
        );
        let tpiSpan = $(
          "<span style='line-height:" +
            h +
            'px;font-weight: bold;font-size: 16px;margin-bottom: 8px;font-family: "Microsoft YaHei";\'>' +
            newTpi +
            "</span>"
        );
        tpiDiv.append(tpiSpan);
        mainDiv.append(tpiDiv);
        let nameDiv = $(
          "<div style='width:" +
            tw +
            "px;float:left;background:#2c3453;color:#ffffff;height: " +
            h +
            "px;text-align: center;'></div>"
        );
        let nameSpan = $(
          "<span style='line-height:30px;font-weight: bold;font-size: 16px;margin-bottom: 8px;font-family: \"Microsoft YaHei\";'>" +
            item.areaName +
            "</span>"
        );
        nameDiv.append(nameSpan);
        mainDiv.append(nameDiv);

        let pointPopup = new minemap.Popup({
          closeOnClick: false,
          offset: [0, 0],
          closeButton: false
        });
        pointPopup
          .setLngLat(item.areaCentry.split(" "))
          .setDOMContent(mainDiv[0]);
        pointPopup.addTo(that.map);
        this.mapAddItems.popups.push(pointPopup);
        $(".minemap-popup-content").css("padding", "0");
        $(".minemap-popup-tip").css("border-top-color", "#2c3453");
        //鼠标滚动改变地图层级
        mainDiv.on("mousewheel DOMMouseScroll", function(e) {
          let delta =
            (e.originalEvent.wheelDelta &&
              (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
            (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1)); // firefox
          if (delta > 0) {
            // 向上滚
            commonVariable.CURRENT_MAP.zoomIn();
          } else if (delta < 0) {
            // 向下滚
            commonVariable.CURRENT_MAP.zoomOut();
          }
        });
        mainDiv.click(function() {
          // that.drawTeamIndexCharts(item);
        });
      });
    },
    //取括号内数据
    getLonlats(str) {
      let regex = /[^\(\)]+(?=\))/g;
      return str.match(regex);
    },
    /**
     * 清除地图加载点、线、面、弹框
     */
    clearMap() {
      let _this=this;
      //清除source
      if (this.mapAddItems.sourceList.length > 0) {
        this.mapAddItems.sourceList.forEach(e => {
          if (_this.map.getSource(e) != undefined) {
            _this.map.removeSource(e);
          }
        });
      }
      //清除layer
      if (this.mapAddItems.lineList.length > 0) {
        this.mapAddItems.lineList.forEach(e => {
          if (_this.map.getLayer(e) != undefined) {
            _this.map.removeLayer(e);
          }
        });
      }
      //清除popup
      if (this.mapAddItems.popups.length > 0) {
        this.mapAddItems.popups.forEach(e => {
          e.remove();
        });
      }
      //清除polygons
      if(this.mapAddItems.polygons && this.mapAddItems.polygons.length>0){
         this.mapAddItems.polygons.forEach(e => {
         if (_this.map.getLayer(e) != undefined) {
            _this.map.removeLayer(e);
          }
        });
      this.mapAddItems={
          polygons: [],
          sourceList: [],
          lineList: [],
          popups: []
        }
      }
    },
    /**
     * 根据tpi匹配区域颜色
     * @param newTpi 指数
     */
    getTpiColor(newTpi) {
      let tpiColor = ["#01bd58", "#91c955", "#f6f954", "#efbf1f", "#f00100"];
      let curTpiColor;
      if (newTpi < 20) {
        curTpiColor = tpiColor[0];
      } else if (newTpi >= 20 && newTpi < 40) {
        curTpiColor = tpiColor[1];
      } else if (newTpi >= 40 && newTpi < 60) {
        curTpiColor = tpiColor[2];
      } else if (newTpi >= 60 && newTpi < 80) {
        curTpiColor = tpiColor[3];
      } else if (newTpi >= 80) {
        curTpiColor = tpiColor[4];
      }
      return curTpiColor;
    }
  },
  destroyed: function() {
    this.clearMap();
  },
  beforeDestroy(){
    this.clearMap();
  }
};
</script>
<style scoped lang="scss">
</style>
