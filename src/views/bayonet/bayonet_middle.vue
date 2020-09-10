<template>
  <div class="bayonet-middle">
    <div @click="change(1)">
      <m-title label="卡口热力分布" :img_type="tableIndex==1?'1':'0'" class="car"></m-title>
    </div>
    <div @click="change(2)">
      <m-title label="活跃卡口点位" :img_type="tableIndex==2?'1':'0'" class="car"></m-title>
    </div>
    <!-- <t-area :indexData='areaIndexs' :isShowArea='showArea'></t-area> -->
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import mTitle from "@/components/UI_el/map_title_com.vue";
import mTab from "@/components/UI_el/tab.vue";
import blur from "../../blur.js";
export default {
  name: "middle",
  data() {
    return {
      tableIndex: 1,
      indexDataList: [],
      none: "",
      xzqh: "",
      visible: "",
      map_cover: {
        sourceList: [],
        lineList1: [], //热力图
        lineList2: [], //聚合图
        markers: [],
        popups: []
      },
      showArea: false,
      areaIndexs: []
    };
  },
  components: {
    mTitle,
    blur,
    mTab
  },
  mounted() {
    this.map = this.$store.state.map;
    this.map.setCenter(mapConfig.DEFAULT_CENTER);
    this.map.setZoom(mapConfig.DEFAULT_ZOOM);
    this.getBayonetHeatMap();
    this.getDatas();
    this.map.on('click',this.setZoom);
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
    this.map.off('click',this.setZoom);
  },
  methods: {
    /**
     * 接收道路统计表格传过来的数据
     */
    getDatas() {
      let that = this;
      blur.$on("getXZQH", data => {
        that.clearMap();
        that.map.setCenter([108.967368, 34.302634]);
        that.map.setZoom(6);
        that.xzqh='';
        if (that.tableIndex == '1') {
          that.clearMap();
          that.getBayonetHeatMap();
        } else {
          that.clearMap();
          that.getBayonetActiveDatas();
        }
      });
      
      //    blur.$on('initCityOrRoadStatics',data=>{

      //    });
    },
    // 切换卡口热力分布--1  与   活跃卡口点位--2
    change(i) {
      let that = this;
      that.clearMap();
      that.tableIndex = i;
      blur.$emit('clearMapRoad');
      if (that.tableIndex == '1') {
        that.onHideLayer('2');  //隐藏聚合图
        that.onShowLayer();    //隐藏热力图
      } else {
        that.onHideLayer('1'); 
        that.onShowLayer();    //隐藏热力图
      }
      // blur.$emit('initCityOrRoadStatics',null,null,false);
    },
    /*
     * 显示地图聚合图
     */
    onShowLayer() {
      let that = this;
      if (that.map) {
        switch(this.tableIndex){
          case 1:case '1':{
            if (this.map_cover.lineList1.length > 0) {
              this.map_cover.lineList1.forEach(e => {
                if (this.map.getLayer(e) != undefined) {
                  that.map.setLayoutProperty(e, "visibility", "visible");
                }
              });
            }else{
              that.getBayonetHeatMap();    //显示热力图
            }
            break;
          }
          case 2:case '2':{
            if (this.map_cover.lineList2.length > 0) {
              this.map_cover.lineList2.forEach(e => {
                if (this.map.getLayer(e) != undefined) {
                  that.map.setLayoutProperty(e, "visibility", "visible");
                }
              });
            }else{
              that.getBayonetActiveDatas(); //显示聚合图 
            }
            break;
          }
        }
        
      }
    },
    /*
     * num == 2  隐藏地图聚合图
     * num == 1  隐藏热力图
     */
    onHideLayer(num) {
      let that = this;
      if (num == '1') {
        if (this.map_cover.lineList1.length > 0) {
          this.map_cover.lineList1.forEach(e => {
            if (this.map.getLayer(e) != undefined) {
              that.map.setLayoutProperty(e, "visibility", "none");
            }
          });
        }
      }
      if (num == '2') {
        if (this.map_cover.lineList2.length > 0) {
          this.map_cover.lineList2.forEach(e => {
            if (this.map.getLayer(e) != undefined) {
              that.map.setLayoutProperty(e, "visibility", "none");
            }
          });
        }
      }

      // if(this.map_cover.lineList.length>0){
      //     this.map_cover.lineList.forEach(e=>{
      //         if(this.map.getLayer(e)!=undefined){
      //             that.map.setLayoutProperty(e, 'visibility', 'none');
      //         }
      //     })
      // }
    },
    /*
     *  活跃卡口点位聚合图
     */
    getBayonetMap(item) {
      let that = this;
      that.map = that.$store.state.map;
      if (that.map.getLayer("data-point") != undefined) {
        that.map.setLayoutProperty("data-point", "visibility", "visible");
        // that.map.getLayer("data-point").setData(jsonData);
      } else {
        let jsonData = {
          type: "FeatureCollection",
          features: []
        };
        item.forEach(e => {
          if (e.JWD) {
            for (let i = 0; i < e.ACTIVENUM; i++) {
              jsonData.features.push({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: e.JWD.split(" ")
                }
              });
            }
          }
        });
        that.map.addSource("data-point", {
          type: "geojson",
          data: jsonData, //"//117.157.231.168:80/minemapapi/demo/assets/poi_suzhou.json",
          cluster: true,
          clusterMaxZoom: 15,
          clusterRadius: 50,
          enableQueryChildren: false /*是否显示聚合详细信息，默认为false，如果为true，则开启显示详细信息功能，备注（如果开启显示详细信息功能，会引发性能问题，建议数据量较少（1000点以内）时使用）*/
        });
        that.map_cover.sourceList.push("data-point");

        //添加非聚合图层
        that.map.addLayer({
          id: "unclustered-points",
          type: "circle",
          source: "data-point",
          filter: ["!has", "point_count"],
          // layout: {
          //   "icon-image": "bank-15"
          // },
          "paint": {
            "circle-color": 'green',
            "circle-radius": 15,
          }
        });
        that.map_cover.lineList2.push("unclustered-points");

        //添加聚合图层
        var layers = [
          [3, "#D20606"],
          [5, "#D25C06"],
          [1, "#6C9B06"]
        ];
        layers.forEach(function(layer, i) {
          let clusterId = "cluster" + i;
          that.map.addLayer({
            id: clusterId, //+ i,
            type: "circle",
            source: "data-point",
            paint: {
              "circle-color": layer[1],
              "circle-radius": 18
            },
            filter:
              i === 0
                ? [">=", "point_count", layer[0]]
                : [
                    "all",
                    [">=", "point_count", layer[0]],
                    ["<", "point_count", layers[i - 1][0]]
                  ]
          });
          that.map_cover.lineList2.push(clusterId);
        });
        //添加数量图层
        that.map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "data-point",
          layout: {
            "text-field": "{point_count}",
            "text-size": 14
          },
          paint: {
            "text-color": "#ffffff"
          },
          filter: ["has", "point_count"]
        });

        that.map_cover.lineList2.push("cluster-count");
      }
    },
    /*
     * 卡口热力分布地图显示  Bayonet/getBayonetHeat   GET_BAY_HEAT_API
     */
    getBayonetHeatMap(xzqh) {
      let _this = this;
      this.map = this.$store.state.map;
      let param = {};
      if (xzqh != undefined) {
        param.xzqh = xzqh;
      }
      interf.GET_BAY_HEAT_API(param).then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              data.data.features.map(e => {
                e.geometry.coordinates = e.geometry.coordinates[0].split(",");
                return e;
              });
              if (this.map.getSource("heatmapSource") != undefined) {
                this.map.getSource("heatmapSource").setData(data.data);
                this.map.setLayoutProperty(
                  "heatmapLayer",
                  "visibility",
                  "visible"
                );
              } else {
                this.map.addSource("heatmapSource", {
                  type: "geojson",
                  data: data.data //"./static/json/heat.json"/*可以是具体的服务*/
                });
                this.map.addLayer({
                  id: "heatmapLayer",
                  type: "heatmap",
                  source: "heatmapSource",
                  layout: {
                    visibility: "visible"
                  },
                  paint: {
                    // 一个热力图数据点的模糊范围，单位是像素，默认值30；要求：值大于等于1，可根据zoom level进行插值设置
                    "heatmap-radius": 15,
                    //一个热力图单个数据点的热力程度，默认值为1；要求：值大于等于0，支持使用property中某个的热力值
                    "heatmap-weight": {
                      property: "mag",
                      stops: [
                        [0, 0],
                        [10, 1]
                      ]
                    },
                    // 用于统一控制热力值的强度，默认值1；要求：值大于等于0，可根据zoom level进行插值设置
                    "heatmap-intensity": 1,
                    // 表示热力图颜色阶梯，阶梯的值域范围为0-1，默认值为["interpolate",["linear"],["heatmap-density"],0,"rgba(0, 0, 255, 0)",0.1,"royalblue",0.3,"cyan",0.5,"lime",0.7,"yellow",1,"red"]
                    "heatmap-color": [
                      "interpolate",
                      ["linear"],
                      ["heatmap-density"],
                      0,
                      "rgba(0, 0, 255, 0)",
                      0.1,
                      "royalblue",
                      0.3,
                      "cyan",
                      0.5,
                      "lime",
                      0.7,
                      "yellow",
                      1,
                      "red"
                    ],
                    // 表示热力图的不透明度，默认值1；值域范围0-1，可根据zoom level进行插值设置
                    "heatmap-opacity": 1
                  }
                });
                this.map_cover.sourceList.push("heatmapSource");
                this.map_cover.lineList1.push("heatmapLayer");
              }
            }
          }
        })
        .catch(err => {
          // this.$message({
          //   message: "卡口热力分布请求服务失败",
          //   type: "error",
          //   duration: 1500
          // });
        })
        .finally(() => {});
    },
    /*
     * 活跃卡口点位  Bayonet/getBayonetActive   GET_BAY_ACTIVE_API
     */
    getBayonetActiveDatas(xzqh) {
      let that = this;
      debugger
      let param = {};
      if (xzqh != undefined) {
        param.xzqh = xzqh;
      }
      // var data=[
      //         {KKBH:'6082328493',JWD:"108.9104 34.2382",ACTIVENUM:292},
      //         {KKBH:'6082328493',JWD:"108.917743 34.275248",ACTIVENUM:92}
      //       ]
      // that.getBayonetMap(data)
      interf.GET_BAY_ACTIVE_API(param).then(response => {
          if (response && response.status == 200) {
            var data = response.data;
           
            if (data.errcode == 0) {
            
              that.getBayonetMap(data.data);
            } else {
              that.$message({
                message: '活跃卡口点位请求服务失败',
                type: "error",
                duration: 1500
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          that.tableLoading = false;
        });
    },
    /**
      * 点击聚合图-离散效果
      */
    setZoom(e){
      let bbox = [
      [e.point.x - 5, e.point.y - 5],
      [e.point.x + 5, e.point.y + 5]
      ];
      let features0 = this.map.queryRenderedFeatures(bbox, {
        layers: ["cluster0"]
      });
      let features1 = this.map.queryRenderedFeatures(bbox, {
        layers: ["cluster1"]
      });
      let features2 = this.map.queryRenderedFeatures(bbox, {
        layers: ["cluster2"]
      });
      let features3 = this.map.queryRenderedFeatures(bbox, {
        layers: ["cluster3"]
      });
      if(features0.length>0 || features1.length>0 || features2.length>0){
        this.map.setZoom(this.map.getZoom()+1);
        this.map.setCenter([e.lngLat.lng,e.lngLat.lat]);
      }
      // console.log(JSON.stringify(features0));
    },
    /*##清除地图加载点、线、面、弹框*/
    clearMap() {
      //清除source
      if (this.map_cover.sourceList.length > 0) {
        this.map_cover.sourceList.forEach(e => {
          if (this.map.getSource(e) != undefined) {
            this.map.removeSource(e);
          }
        });
      }
      this.map_cover.sourceList=[];
      //清除layer
      if (this.map_cover.lineList1.length > 0) {
        this.map_cover.lineList1.forEach(e => {
          if (this.map.getLayer(e) != undefined) {
            this.map.removeLayer(e);
          }
        });
      }
      this.map_cover.lineList1=[];
      //清除layer
      if (this.map_cover.lineList2.length > 0) {
        this.map_cover.lineList2.forEach(e => {
          if (this.map.getLayer(e) != undefined) {
            this.map.removeLayer(e);
          }
        });
      }
      this.map_cover.lineList2=[];
      //清除marker
      if(this.map_cover.markers.length>0){
        this.map_cover.markers.forEach(e=>{
          e.remove();
        })
        this.map_cover.markers=[];
      }
       //清除popup框
      if(this.map_cover.popups.length>0){
        this.map_cover.popups.forEach(e=>{
          e.remove();
        })
        this.map_cover.popups=[];
      }
    }
    
  }
}
</script>

<style scoped  lang='scss'>
.bayonet-middle {
  position: fixed;
  top:93.5vh;
  left: 756px;
  width: 38.85vw;
  display: flex;
  .car {
    width: 199px;
    height: 39px;
    justify-content: space-around;
    line-height: 39px;
    cursor: pointer;
  }
}
</style>
