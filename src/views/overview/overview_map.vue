<template>
  <div class="overview-map">
    <div class="overview-map--legend">
      <ul>
        <li v-for="(item,index) in areaList" :key="index">{{item}}</li>
      </ul>
      <div class="legend"></div>
    </div>
    <div class="overview-map--icon">
      <ul>
        <li>
          <div>警情</div>
          <div>
            <img :src="jqImg" />
          </div>
        </li>
        <li>
          <div>事故</div>
          <div>
            <img :src="sgImg" />
          </div>
        </li>
      </ul>
    </div>
    <t-area :indexData="areaIndexs" :isShowTxt="isShowTxt" :isShowArea="showArea"></t-area>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import tArea from "@/components/area/area.vue";
export default {
  name: "overview_left",
  data() {
    return {
      map: {},
      areaList: [],
      map_cover: {
        sourceList: [],
        lineList: [],
        popups: [],
        markers: []
      },
      jqImg: IMG.jqImg,
      sgImg: IMG.sgImg,
      showArea: false,
      isShowTxt: false,
      areaIndexs: [],
      interval: null
    };
  },
  mounted() {
    let _this = this;
    this.map = this.$store.state.map;
    this.getCityCarFlowData();
    this.initDeviceMap();
    this.interval = setInterval(() => {
      _this.clearMap();
      _this.getCityCarFlowData();
      _this.initDeviceMap();
    }, 1000 * 60 * 5);
  },
  components: {
    tArea
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    /**
     * 获取获取地图城市流动数据
     */
    getCityCarFlowData() {
      let that = this;
      that.areaList = [];
      interf.GET_MAP_CITY_FLOW_API({}).then(response => {
        if (response && response.status == 200) {
          let data = response.data;
          if (data.errcode == 0) {
            let max,
              min,
              item = 0;
            that.areaIndexs = data.data.map(e => {
              e.Num = e.addIn;
              if (!max) {
                max = e.Num;
              } else {
                max = max < e.Num ? e.Num : max;
              }
              if (!min) {
                min = e.Num;
              } else {
                min = min > e.Num ? e.Num : min;
              }

              return e;
            });
            that.areaList.push(max, (max - min) / 2 + min, min);
            that.showArea = true;
            if (data.data.length > 0) {
              data.data.forEach(e => {
                that.addCityMarker(e);
              });
            }
          }
        }
      });
      //  interf.GET_MAP_CAR_FLOW_API({stime:'1'})
      //   .then(response=>{
      //     if (response && response.status == 200){
      //       let data= response.data;
      //       console.log(data)
      //       if (data.errcode == 0){
      //        if(data.data.length>0){
      //          data.data.forEach(e=>{
      //           //  that.addCityMarker(e);
      //          })
      //        }
      //       }
      //     }

      //   })
    },
    addCityMarker(item) {
      let el = document.createElement("div");
      el.id = "marker";
      // el.style["border"] = "solid 1px #333333";
      // el.style["backgroundColor"] = "#333";
      el.style["padding"] = "4px 6px";
      el.style.color = "white";

      let leftImgDiv = document.createElement("div");
      leftImgDiv.style.float = "left";
      leftImgDiv.style.width = "15px";
      leftImgDiv.style.height = "40px";
      leftImgDiv.style.lineHeight = "30px";
      let img_i = document.createElement("i");
      img_i.className = "iconfont icon-shangsheng";
      img_i.style.color = "#FFAF05";

      if (item.addIn < 0) {
        img_i.style.color = "#00DFC7";
        leftImgDiv.style.transform = "rotate(180deg)";
        leftImgDiv.style.lineHeight = "50px";
      }
      leftImgDiv.appendChild(img_i);
      el.appendChild(leftImgDiv);

      let rightDiv = document.createElement("div");
      rightDiv.style.float = "right";
      rightDiv.style.width = "40px";
      rightDiv.style.height = "30px";
      let span1 = document.createElement("p");
      span1.innerHTML = item.city;
      span1.style.margin = "0";
      rightDiv.appendChild(span1);
      let span2 = document.createElement("p");
      span2.innerHTML = item.addIn;
      span2.style.margin = "0";
      span2.style.color = "#FFAF05";
      if (item.addIn < 0) span2.style.color = "#00DEC7";
      rightDiv.appendChild(span2);
      el.appendChild(rightDiv);
      //添加marker
      let lnglat = [item.longitude, item.latitude];
      let marker = new minemap.Marker(el, { offset: [-25, -25] })
        .setLngLat(lnglat)
        .addTo(this.map);
      this.map_cover.markers.push(marker);
    },
    /**
     * 获取卡口设备数据
     */
    initDeviceMap() {
      let that = this;
      interf.GET_DEVICE_MAP_API({}).then(response => {
        if (response && response.status == 200) {
          let data = response.data;
          if (data.errcode == 0) {
            //   data.data=[{
            //     "XZQH": "6107",
            //     "FX": "陕川界入陕",
            //     "KKBH": "610700100366",
            //     "KKMC": "汉中市南郑县S211211省道K61喜神坝中队西陕川界省际卡口",
            //     "city": "汉中市",
            //     "JWD": "106.865033 32.736208",
            //     "TXCLZS": 1,
            //     "DLMC": "南郑211省道61公里350米"
            // }];
            if (data.data && data.data.length > 0) {
              data.data.forEach(e => {
                that.addDeviceMarker(e);
              });
            }
          }
        }
      });
    },
    /**
     * 打设备信息点
     */
    addDeviceMarker(e) {
      let lnglat = e.JWD.split(" ");
      let mainDiv = document.createElement("div");
      mainDiv.style.width = "16vw";
      mainDiv.style.color = "white";
      mainDiv.style.fontSize = "10px";
      // mainDiv.className='overview_popup';
      let title = document.createElement("p");
      title.innerHTML = "[" + e.city + "]-" + e.KKMC;
      title.style.fontSize = "10px";
      title.style.margin = "10px 0";
      mainDiv.appendChild(title);

      let p1 =
        "<p style='margin:5px 0;'><span>设备ID：</span><span>" +
        e.KKBH +
        "</span></p>";
      mainDiv.appendChild($(p1)[0]);

      let p2 =
        "<p style='margin:5px 0;'><span>地点：</span><span>" +
        e.DLMC +
        "</span></p>";
      mainDiv.appendChild($(p2)[0]);

      let p3 =
        "<p style='margin:5px 0;'><span>方向：</span><span>" +
        e.FX +
        "</span></p>";
      mainDiv.appendChild($(p3)[0]);

      let p4 =
        "<p style='color:#00C6FF;margin:5px 0;'><span>过车量：</span><span>" +
        e.TXCLZS +
        "</span></p>";
      mainDiv.appendChild($(p4)[0]);

      let popup = new minemap.Popup({
        closeOnClick: true,
        closeButton: true,
        offset: [-13, -30]
      });
      popup.setLngLat(lnglat).setDOMContent(mainDiv);

      let el = document.createElement("div");
      el.className = "container";
      let type='green';
      if(e.TXCLZS>20){
        type='red';
      }else if(e.TXCLZS>15){
        type='orange';
      }else if(e.TXCLZS>10){
        type='yellow';
      };
      // el.style.width = "14px";
      // el.style.height = "14px";
      el.style.borderRadius = "50%";
      el.style["border-radius"] = "50%";
      let dot = document.createElement("div");
      dot.className = "dot dot_"+type;
      el.appendChild(dot);
      let pulse = document.createElement("div");
      pulse.className = "pulse pulse_"+type;
      el.appendChild(pulse);
      //  let pulse1 = document.createElement("div");
      // pulse1.className = "pulse1 pulse1_"+type;
      // el.appendChild(pulse1);
      let marker = new minemap.Marker(el, { offset: [-26, -20] })
        .setLngLat(lnglat)
        .addTo(this.map)
        .setPopup(popup);
      this.map_cover.markers.push(marker);
      this.map_cover.popups.push(popup);
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
      //清除layer
      if (this.map_cover.lineList.length > 0) {
        this.map_cover.lineList.forEach(e => {
          if (this.map.getLayer(e) != undefined) {
            this.map.removeLayer(e);
          }
        });
      }
      //清除popup
      if (this.map_cover.popups.length > 0) {
        this.map_cover.popups.forEach(e => {
          e.remove();
        });
      }
      //清除marker
      if (this.map_cover.markers.length > 0) {
        this.map_cover.markers.forEach(e => {
          e.remove();
        });
      }
    }
    /** */
  }
};
</script>
<style scope lang='scss'>
@import "@/assets/css/color.scss";
@mixin flex($direction, $justify, $align) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}

.overview-map {
  position: fixed;
  z-index: 10;
  left: 500px;
  width: 108px;
  height: 285px;
  bottom: 13px;
  padding: 20px 15px;
  background-color: #010416;
  color: $color-white;
  // @include flex(column, center,center);
  &--legend {
    width: 100%;
    height: 180px;
    ul {
      padding: 0 20px 0 0;
      // display: inline-block;
      width: 55px;
      height: 100%;
      text-align: center;
      float: left;
      @include flex(column, center, center);
      li {
        width: 100%;
        height: 33%;
        @include flex(column, center, center);
        align-items: flex-end;
      }
      > li:nth-child(1) {
        justify-content: end;
      }
      > li:nth-child(2) {
        padding-bottom: 13px;
      }
    }
    .legend {
      display: inline-block;
      width: 12px;
      height: 180px;
      //  opacity: 0.82;
      border-radius: 8px;
      background-image: linear-gradient(
        0deg,
        rgba(6, 143, 230, 0.82),
        rgba(246, 197, 0, 0.82),
        rgba(255, 127, 64, 0.82)
      );
      opacity: 0.5;
    }
  }
  &--icon {
    width: 100%;
    height: 110px;
    margin-top: 20px;
    ul {
      padding: 0;
      li {
        line-height: 45px;
        div {
          display: inline-block;
          width: 50%;
          text-align: center;
          font-size: 14px;
        }
        div:nth-child(2) {
          img {
            vertical-align: middle;
            margin-bottom: 8px;
          }
        }
      }
    }
  }
}
</style>
<style lang='scss'>
</style>
