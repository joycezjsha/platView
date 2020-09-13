<template>
  <div></div>
</template>

<script>
import conf from "./config";
export default {
  name: "areaComponent",
  data() {
    return {
      map: "",
      max:'',
      min:'',
      areaColorArray: [
        "rgba(6,143,230,0.82)",
        "rgba(246,197,0,0.82)",
        "rgba(255,127,64,0.82)"
      ],
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
      },
      changeHightLayer:[]
    };
  },
  props:{
    isShowArea: {
      type: Boolean,
      default: false
    },
    isResumeHight: {
      type: Boolean,
      default: false
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
    },
    method:{
      type:Function
    }

  },
  watch:{
    isShowArea:{
      immediate: false,
      handler: function(cVAL, oVAL) {
        if(cVAL){
          this.initArea();
          if(this.method) this.map.on('click',this.clickArea);
        }else{
          ;
          this.hideArea();
        }
      }
    },
    isResumeHight:{
      immediate:false,
      handler:function(cVAL, oVAL){
        if(cVAL){
          this.resumeLayer();
        }
        
      }
    }
  },
  computed: {},
  mounted() {
    let _this=this;
    this.map = this.$store.state.map;
    // if(this.isShowArea) this.initArea();
    if(this.method) this.map.on('click',this.clickArea);
  },
  methods: {
    /**
     * 隐藏区划面
     */
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
    /**
     * 添加区域面
     */
    addArea(data) { 
        let _this = this;
        ;
        data.forEach((e, i) => {
          let lonlats = _this.getLonlats(e.areaGeometry)[0].split(",");
          lonlats = lonlats.map(s => {
            if (s.split(" ")[0] != "") {
              return [s.split(" ")[0], s.split(" ")[1]];
            } else {
              return [s.split(" ")[1], s.split(" ")[2]];
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
                    "title": e.city,
                    "code":e.adcode,
                    "num":e.Num,
                    "color":e.color
                }
              }]
          };
          if(_this.map.getSource('area_polygonSource_'+i)!=undefined){
            _this.map.getSource('area_polygonSource_'+i).setData(jsonData);
          }else{
            _this.map.addSource('area_polygonSource_'+i, {
              'type': 'geojson',
              'data': jsonData
            });
          };
          
          //面的显示
          _this.map.addLayer({"id": "area_polygon_"+i,
              "type": "fill",
              "source": "area_polygonSource_"+i,
              "layout": {
                  "visibility": "visible",
              },
              "paint": {
                  "fill-color": e.color,
                  "fill-opacity": 0.5,
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
     * 添加区域面
     */
  // addArea(data) { 
    //   let _this = this;
    //   data.forEach((e, i) => {
    //     let lonlats = _this.getLonlats(e.areaGeometry)[0].split(",");
    //     lonlats = lonlats.map(s => {
    //       if (s.split(" ")[0] != "") {
    //         return [s.split(" ")[0], s.split(" ")[1]];
    //       } else {
    //         return [s.split(" ")[1], s.split(" ")[2]];
    //       }
    //     });
    //     let jsonData = {
    //       type: "FeatureCollection",
    //       features: [{
    //         "geometry": {
    //           "type": "MultiPolygon",
    //           "coordinates": [
    //               [lonlats]
    //             ]
    //           },
    //           "type": "Feature",
    //           "properties": {
    //             "code": e.adcode,
    //             "title": e.city,
    //             "level": "province",
    //             "subFeatureIndex": 0,
    //             "levels": e.Num
    //           }
    //         }]
    //     };
    //     if(_this.map.getSource('area_polygonSource_'+i)!=undefined){
    //       _this.map.getSource('area_polygonSource_'+i).setData(jsonData);
    //     }else{
    //       _this.map.addSource('area_polygonSource_'+i, {
    //         'type': 'geojson',
    //         'data': jsonData//'./static/json/geojson-level.json'//
    //       });
    //     };
        
    //     //面的显示
    //     _this.map.addLayer({
    //       "id": "area_polygon_"+i,
    //       "type": "extrusion",    // 建筑物图层
    //       "source": "area_polygonSource_"+i,
    //       "layout": {
    //         // "histogram-max-height-render": true  // 是否开启柱状图极大高度控制
    //       },
    //       "paint": {
    //         'extrusion-color': {    // 建筑物的填充颜色，默认值为"#000000"
    //             "property": "levels",
    //             "stops": [
    //                 [_this.min, _this.areaColorArray[0]],
    //                 [_this.min+((_this.max-_this.min)/2), _this.areaColorArray[1]],
    //                 [_this.max, _this.areaColorArray[2]]
    //             ]
    //           },
    //           'extrusion-height':100,
    //           // {   // 建筑物的高度
    //           //     'property': 'levels',
    //           //     "stops": [
    //           //         [_this.min, 10000],
    //           //         [_this.min+((_this.max-_this.min)/2), 30000],
    //           //         [_this.max, 45000]                  ]
    //           // },
    //           'extrusion-base': 0,    // 建筑物的底部高度，必须小于或等于柱状图的高度
    //           'extrusion-opacity':0.5
    //           // {  // 建筑物的透明度，值为数值，默认为1
    //           //     "base": 0.3,
    //           //     "stops": [[3, 0.8], [8, 0.5]]
    //           // }
    //         }
    //     });
    //     //面的名称显示
    //     if(_this.isShowTxt){
    //       _this.map.addLayer({
    //         "id": "area_polygon_txt_"+i,
    //         "type": "symbol",
    //         "source": "area_polygonSource_"+i,
    //         "layout": {
    //             // "icon-image": "{icon}-15",
    //             "text-field": "{title}",
    //             // "text-offset": [0, 0.6],
    //             // "text-anchor": "top"
    //         },
    //         "paint": {
    //             "icon-color": "#696d79",
    //              "text-color": {
    //                 "type": "categorical",
    //                 "property": "kind",
    //                 "stops": [["school", "#ff0000"], ["park", "#00ff00"], ["hospital", "#0000ff"]],
    //                 "default": "#FFF"
    //             }
    //         }
    //     });
    //     _this.mapAddItems.polygons.push("area_polygon_txt_"+i);
    //     };
    //     _this.mapAddItems.sourceList.push("area_polygonSource_"+i);
    //     _this.mapAddItems.polygons.push("area_polygon_"+i);
    //   });
      
  // },
    /**
     * 根据一定权重给区域排序
     */
    sortArea(data){
      let _this=this;
      _this.max=null;
      _this.min=null;
      // let max,min;
      //返回数组合并、并排序的结果
      // if(this.indexData.length<data.length){
      //   return [];
      // }
       this.indexData.forEach(e=>{
        if(!_this.max){
          _this.max=e.Num;
        }else{
          _this.max=_this.max<e.Num?e.Num:_this.max;
        }
        if(! _this.min){
           _this.min=e.Num;
        }else{
           _this.min= _this.min>e.Num?e.Num: _this.min;
        }
      })
      this.indexData.forEach(e=>{
        let f=false;
        for(var j=0;j<data.length;j++){
            if(data[j].adcode.indexOf(e.XZQH)!=-1){
                data[j].Num=e.Num;
                f=true;
                break;
            }
        }
        if(!f){
          // data[j].Num='--';
        }
      })
      data=data.sort((a,b)=>{return a.Num -b.Num});
      data.map(e=>{
        if(e.Num!=undefined && e.Num!='--') {e.color=_this.multiply(_this.max,_this.min,e.Num);}
        else{
          e.color='rgba(6,143,230,0)';
        };
        return e;
      });
      return data;
    },
    /**
     * 计算颜色叠加值
     */
    multiply(max,min,value) {
      if(max==min){
        if(max=0){
          return this.areaColors[0];
        }else{
          return this.areaColors[1];
        }
      }
      let result = [],position,item=(max-min)/2;
      if(min>0) item=min+item;
      if(item>value){
        position=0;
      }else{
        position=1;
      };
      switch(position){
        case 0:{
          if(value==min){
            result=this.areaColors[0];
          }else{
             let f=(value-min)/item;
             for( let i = 0; i < this.areaColors[0].length; i++ ) {
              let b=Math.floor(this.areaColors[0][i]+f*(this.areaColors[1][i] - this.areaColors[0][i]));
              result.push(b);
            };
          }
          break;
        }
        case 1:{
          if(value==max){
            result=this.areaColors[2];
          }else if(value==item){
            result=this.areaColors[1];
          }else{
            let f=(value-item)/item;
            for( let i = 0; i < this.areaColors[1].length; i++ ) {
              let b=Math.floor(this.areaColors[1][i]+f*(this.areaColors[2][i] -  this.areaColors[1][i]));
              result.push(b);
            };
          }
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
    },
    /**
     * 点击地图，绑定事件
     */
    clickArea(e){
      for(let i=0;i<this.mapAddItems.polygons.length;i++){
        let renderLayerIds = [this.mapAddItems.polygons[i]];
        let features = this.map.queryRenderedFeatures(e.point, {
          layers: renderLayerIds
        });
        if (features && features.length > 0) {
          if(this.map.getLayer(features[0].layer.id)!=undefined){
            this.resumeLayer();
            this.map.removeLayer(features[0].layer.id);
            this.changeHightLayer.push({id:features[0].layer.id,source:features[0].layer.source});
            let jsonData = {
              type: "FeatureCollection",
              features: [{
                "geometry": {
                  "type": "MultiPolygon",
                  "coordinates": [
                      features[0].geometry.coordinates
                    ]
                  },
                  "type": "Feature",
                  "properties": {
                    "code": features[0].properties.code,
                    "title": features[0].properties.title,
                    "color":features[0].properties.color,
                    "level": "province",
                    "subFeatureIndex": 0,
                    "levels": features[0].properties.num
                  }
                }]
            };
            this.map.getSource(features[0].layer.source).setData(jsonData);
            this.map.addLayer({
              "id": features[0].layer.id,
              "type": "extrusion",    // 建筑物图层
              "source": features[0].layer.source,
              "layout": {
                // "histogram-max-height-render": true  // 是否开启柱状图极大高度控制
              },
              "paint": {
                'extrusion-color':features[0].properties.color,
                //  {    // 建筑物的填充颜色，默认值为"#000000"
                //     "property": "levels",
                //     "stops": [
                //         [this.min, this.areaColorArray[0]],
                //         [this.min+((this.max-this.min)/2), this.areaColorArray[1]],
                //         [this.max, this.areaColorArray[2]]
                //     ]
                //   },
                  'extrusion-height':30000,
                  'extrusion-base': 0,    // 建筑物的底部高度，必须小于或等于柱状图的高度
                  'extrusion-opacity':0.9
                }
            });
             this.fitBox(features[0].geometry.coordinates[0]);
          }
          let data={};
          data.name=features[0].properties.title;
          data.value=features[0].properties.code;
          this.method(data);
          break;
        }
      }
    },
    /**
     * 放大显示区域
     */
    fitBox(points){
      let bbox = [Infinity, Infinity, -Infinity, -Infinity];
      points.forEach(e=>{
        if (bbox[0] > e[0]) bbox[0] = e[0];
        if (bbox[1] > e[1]) bbox[1] = e[1];
        if (bbox[2] < e[0]) bbox[2] = e[0];
        if (bbox[3] < e[1]) bbox[3] = e[1];
      });
      this.map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {padding: 300});
      this.map.setPitch(60);
    },
    /**
     * 恢复拔高区面
     */
    resumeLayer(){
      let _this=this;
      if(this.changeHightLayer.length>0){
        _this.changeHightLayer.forEach(e=>{
          let source=_this.map.getSource(e.source);
          let jsonData = {
            type: "FeatureCollection",
            features: [{
                type: "Feature",
                geometry: {
                  type: "Polygon",
                  coordinates: source._options.data.features[0].geometry.coordinates
                },
                "properties":source._options.data.features[0].properties
              }]
          };
          source.setData(jsonData);
          this.map.removeLayer(e.id);
          _this.map.addLayer({"id": e.id,
            "type": "fill",
            "source": e.source,
            "layout": {
                "visibility": "visible",
            },
            "paint": {
                "fill-color": source._options.data.features[0].properties.color,
                "fill-opacity": 0.5,
                "fill-outline-color": '#00b3ff'
            },
            "minzoom": 4,
            "maxzoom": 17.5
        });
        })
        this.changeHightLayer=[];
      }
    }
  },
  destroyed: function() {
    this.clearMap();
    this.map.off('click',this.clickArea);
    this.map.on('click',function(){
      return;
    });
  },
  beforeDestroy(){
    // this.clearMap();
  }
};
</script>
<style scoped lang="scss">
</style>
