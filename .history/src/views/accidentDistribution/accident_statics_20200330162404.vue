<template>
  <div class="accident-statics">
    <div class="accident-statics_container">
      <div class="accident-statics_title">
        <div>
          <i class="el-icon-collection-tag">全省统计</i>
        </div>
        
      </div>
      <div class='accident-statics--tab'>
        <el-row><span class="--tab-title"><i class='el-icon-bell'></i>事故总数:</span><span class="statics--tab--value"><span class="statics_value">{{staticsData.sum}}</span>(其中重大事故:{{staticsData.esplish}})</span></el-row>
         <el-row>受伤:<span class="statics--tab--value">{{staticsData.injury}}人</span>&nbsp;&nbsp;|&nbsp;&nbsp;死亡:<span class="statics--tab--value">{{staticsData.died}}人</span></el-row>
      </div>
      <div class="accident-statics_content">
        <div>事故类型：
          <ul>
            <li v-for="(item,index) in sg_sort_data" :key="index"><el-col :span="8"></el-col></li>
          </ul>
        </div>
        <div>事故发生数量变化：
         <div id="accurCountChange"></div>
        </div>
        <div>重大事故发生趋势：
         <div id="accurCountChange"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
export default {
  name: "TIndex",
  data() {
    return {
      map: {},
      staticsData: {sum:10,esplish:2,injury:4,died:2},
      sg_sort_data:[{},{}]
    };
  },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.getIndexData();
  },
  destroyed() {
    this.flyRoutes = [];
    this.map.stop();
    let that = this;
    that.map.setPitch(0); //设置地图的俯仰角
    /*for (let i = 0; i < that.buildingmore.length; i++) {
        if(that.map.getLayer(that.buildingmore[i])) that.map.setLayoutProperty(that.buildingmore[i], 'visibility', 'none');
      }*/
    //显示地图右下角飞行图标
    // eventBridge.$emit('map_hideFlyIcon');
    // eventBridge.$emit('map_hideBuildingmore');
    // eventBridge.$emit('hideLayerBtn');
    // $("#traffiCtrlFly").css(
    //   "background",
    //   "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAWCAMAAADto6y6AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABC1BMVEWjtO////+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO////+KC4gAAAAAV3RSTlMAAJ8/nr07Xrk4H7U03/6yMKD7rS1g+Mn9qSohk6Un4WX8oSSikEr0nWM16fmZIzfblRzjGRbK8adNpMYGC5sHnASSjz4DJc7lx3UiAcBtCWKutB3uWVzSmX8cAAAAAWJLR0QB/wIt3gAAAAd0SU1FB+EKDAoBO7QtmC0AAADoSURBVCjPY2BiZkABjFDAwBLOyoZVgj08PJyDE4sEVzgIcPNgSDDwgmX4+AXQJQSBwkIgKWERVAlRoKCYOEiXhKQUsoQ0SIxXhg8sJSuHkGCQBwmxKgiB7VJUUoZLqIBFVNXUwXS4kIY0VEITIiCqpQ1hhOvocoEl9CBcMX1lg3CYlKERyIXGEJ6xiakZVMLcwhIkYQXlWtvYcgMpbTs1e7BRDAowExwYHJ2cXVxhrmJwg0m46yF7EAg8QCHi6eXN4IMmIavo62fE4B8QKIkmIWcKIn1Yw4PQJKAgOASHBEMoLgmGMIQEABPwPWhIBaSaAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTEwLTEyVDEwOjAxOjU5KzA4OjAwEMBd+QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMC0xMlQxMDowMTo1OSswODowMGGd5UUAAAAASUVORK5CYII=') no-repeat 50% center"
    // );
    // commonVariable.CURRENT_MAP.repaint = false;
  },
  methods: {
    //获取巡航数据
    getIndexData() {
      let that = this;
    }
  }
}
</script>
<style scope lang='scss'>
@import '@/assets/css/color.scss';
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.accident-statics {
position: fixed;
    z-index: 10;
    right: 4vw;
    width: 17vw;
    height: 68vh;
    top: 9vh;
    color: white;
}
.accident-statics_container {
  width: 100%;
  height: 100%;
  background-color: $color-bg-1;
  border: 1px solid $color-border-1;
  .accident-statics_title{
      position: relative;
    width: 96%;
    border-bottom: 0.1rem solid $color-border-1;
    font-family: Microsoft YaHei;
    font-size: 1vw;
    color: $color-white;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 0.6rem 2%;
    font-weight: bolder;
    }
    .xian_order{
      color: $color-white;
    width: 100%;
    height: 3vh;
    line-height: 3vh;
    text-align: center;
    font-size: 1.2vw;
    &--city{
      color:$color-active;
    }
    }
  .accident-statics_content {
    width: 98%;
    height: 85%;
    background-color: $color-bg-1;
    margin: 1%;
    
    &_table {
      color: white;
    margin: 0;
    padding: 10px;
    width: 95%;
    height: 90%;
    }
    
  }
   .accident-statics--tab{
      width:100%;
      height:5vh;
      @include flex(raw,center);
      .--tab-title{
        font-size:0.9vw;
        width:50%;
        @include flex(raw,center);
      }
      .statics--tab--value{
        color:$color-active;
        @include flex(raw,center);
      }
    }
}
</style>