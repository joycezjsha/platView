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
        "#556B2F",
        "#00FFFF",
        "#0000EE",
        "#8A2BE2",
        "#c48f58",
        "#6bac91",
        "#5ad2a0",
        "#f18a52",
        "#656bd4",
        "#7ca0cd",
        "#88b7dc",
        "#a08bd3",
        "#be7fcd",
        "#30a2c4",
        "#c0ccd7",
        "#dbddab",
        "#9cd076",
        "#69b38b",
        "#437fb9",
        "rgb(255, 143, 109)"
      ],
      mapAddItems: {
        polygons: [],
        sourceList: [],
        lineList: [],
        popups: []
      }
    };
  },
  computed: {},
  mounted() {
    this.map = this.$store.state.map;
    this.initArea();
  },
  methods: {
    /**
     *获取区域数据
     */
    initArea() {
      let that = this;
      $.ajax({
        url: "./static/json/index_data.json", //globals.CRUISE_ALL_INFO_URL,
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
          if (data.errcode == -2) {
            that.$router.push({ name: "/login" });
          }
          if (data.errmsg == "success" && data.data.length > 0) {
            let datas = [];
            data.data.map(e => {
              datas.push({
                city: e.areaName,
                index: (Math.round(e.areaTpi) * 10) / 100,
                week_radio: "+0.3%",
                his_radio: "-0.1%"
              });
            });
            that.indexDatas = datas;
            // that.addArea(data.data);
            // that.addAreaIdentify(data.data);
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          debugger;
        }
      });
    },
    addArea(data) {
      let _this = this;
      data.forEach((e, i) => {
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
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [lonlats]
              }
            }
          ]
        };
        _this.areaColors[i];
        _this.mapAddItems.lineList.push("arealayerId_" + i);
        _this.mapAddItems.sourceList.push("areaSourceId_" + i);
        this.map.addPolygons(
          jsonData,
          this.map,
          "areaSourceId_" + i,
          "arealayerId_" + i,
          _this.areaColors[i]
        );
      });
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
      //清除source
      if (this.mapAddItems.sourceList.length > 0) {
        this.mapAddItems.sourceList.forEach(e => {
          if (this.map.getSource(e) != undefined) {
            this.map.removeSource(e);
          }
        });
      }
      //清除layer
      if (this.mapAddItems.lineList.length > 0) {
        this.mapAddItems.lineList.forEach(e => {
          if (this.map.getLayer(e) != undefined) {
            this.map.removeLayer(e);
          }
        });
      }
      //清除popup
      if (this.mapAddItems.popups.length > 0) {
        this.mapAddItems.popups.forEach(e => {
          e.remove();
        });
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
  destroyed: function() {}
};
</script>
<style scoped lang="scss">
</style>
