<template>
  <div class="city-accident-div boxstyle">
    <div class="city-accident_container">
      <div class="city-accident_header">
        <div @click="changeTable(0)">
          <m-title label="城市统计" :img_type="!tableIndex?'1':'0'" style="width:6vw;"></m-title>
        </div>
        <div @click="changeTable(1)">
          <m-title label="道路统计" :img_type="tableIndex?'1':'0'" style="width:6vw;"></m-title>
        </div>
      </div>
      <div class="city-accident-query">
        <span class="city-accident-query--label">时间：</span>
        <span class="city-accident-query--time">
          <el-date-picker
            width="100%"
            v-model="timeRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </span>
        <span class="city-accident-query--btn">
          <el-button type="primary">确定</el-button>
        </span>
      </div>
      <div class="city-accident_content">
        <el-table
          :data="indexDatas"
          style="width: 100%"
          height="55vh"
          :default-sort="{prop: 'week_radio', order: 'descending'}"
          :row-style="getRowClass"
          :header-row-style="getRowClass"
          :header-cell-style="getRowClass"
        >
          <el-table-column fixed type="index" label="No" width="50"></el-table-column>
          <el-table-column prop="city" label="城市"></el-table-column>
          <el-table-column prop="index" label="事故数量" sortable></el-table-column>
          <el-table-column prop="week_radio" label="重大事故" sortable></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import mTitle from "@/components/UI_el/title_com.vue";
export default {
  name: "TCruise",
  data() {
    return {
      map: {},
      indexDatas: [
        { city: "西安", index: "2.1", week_radio: "+0.3%", his_radio: "-0.1%" },
        { city: "渭南", index: "1.1", week_radio: "+0.3%", his_radio: "-0.1%" }
      ],
      selectItem: { city: "西安", order: 8 },
      areaColors: [
        "#556B2F",
        "#00FFFF",
        "#0000EE",
        "#8A2BE2",
        "#c48f58",
        "#9fcac4",
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
      timeRange: "",
      tableIndex: 0,
      mapAddItems: {
        polygons: [],
        sourceList: [],
        lineList: [],
        popups: []
      }
    };
  },
  components: { mTitle },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.map.repaint = true;
    that.getIndexData();
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
  },
  methods: {
    /**
     * 切换显示table类型
     * @param 0->城市统计，1->道路统计
     */
    changeTable(t) {
      this.tableIndex = t;
    },
    //获取巡航数据
    getIndexData() {
      let that = this;
      //  interf.getCityIndexData({index:1},(data) => {
      //     console.log(data);
      //       },(e)=>{

      //       })
      $.ajax({
        url: "./static/json/city_accident_data.json", //globals.CRUISE_ALL_INFO_URL,
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
            that.addArea(data.data);
            // that.addAreaIdentify(data.data);
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          debugger;
        }
      });
    },
    /**
     * 地图添加辖区面
     * careated by ..
     */
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
          that.drawTeamIndexCharts(item);
        });
      });
    },
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
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
    },
    //取括号内数据
    getLonlats(str) {
      let regex = /[^\(\)]+(?=\))/g;
      return str.match(regex);
    },
    //清除地图加载点、线、面、弹框
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
    }
  }
};
</script>
<style scope lang='scss'>
@import "@/assets/css/color.scss";
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.city-accident-div {
  position: absolute;
  z-index: 10;
  left: 1vw;
  width: 23vw;
  height: 68vh;
  top: 9vh;
}
.city-accident_container {
  width: 100%;
  height: 100%;
  .tab_line {
    width: 96%;
    height: 2px;
    background: #fff;
    position: absolute;
    margin: 5% 2% 0 2%;
  }
  .city-accident_header {
    width: 80%;
    height: 4vh;
    margin-top: 1px;
    > div {
      float: left;
      cursor: pointer;
    }
    > div:nth-child(2) {
      margin-left: -1vw;
    }
  }
  .city-accident-query {
    color: $color-white;
    width: 100%;
    height: 3vh;
    line-height: 3vh;
    text-align: center;
    font-size: 0.8vw;
    margin: 2% 0;
    @include flex(row, center);
    &--label {
      width: 15%;
      color: $color-label;
      display: inline-block;
      @include flex(row, center);
    }
    &--time {
      width: 60%;
      display: inline-block;
      @include flex(row, center);
    }
    &--btn {
      width: 25%;
      display: inline-block;
      @include flex(row, center);
    }
  }
  .city-accident_content {
    width: 98%;
    height: 85%;
    background-color: $color-bg-1;
    margin: 1%;

    &_table {
      overflow-y: auto;
    }
  }
}
</style>
<style>
.el-table,
.el-table__expanded-cell,
.el-table th,
.el-table tr {
  background-color: transparent;
  color: white;
}
.el-table--enable-row-hover .el-table__body tr:hover > td,
.el-table__body tr.hover-row > td {
  background-color: rgb(14, 182, 233);
  color: white;
}
.el-input__inner {
}
.el-input__inner,
.el-range-editor .el-range-input {
  background: transparent;
  color: white;
}
.el-date-editor .el-range-separator {
  color: white;
}
.el-picker-panel {
  color: white;
  background-color: #282d27eb;
}
.el-range-editor.el-input__inner {
  height: 3vh;
  line-height: 3vh;
}
.el-date-editor .el-range__icon {
  line-height: 2vh;
}
.el-date-editor .el-range-separator {
  line-height: 2vh;
}
.el-button {
  height: 3vh;
  line-height: 0.5;
}
</style>