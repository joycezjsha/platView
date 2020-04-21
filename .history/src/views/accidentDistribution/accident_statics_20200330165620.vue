<template>
  <div class="accident-statics">
    <div class="accident-statics_container">
      <div class="accident-statics_title">
        <div>
          <i class="el-icon-collection-tag">全省统计</i>
        </div>
        
      </div>
      <div class='accident-statics--tab'>
        <div><span class="--tab-title"><i class='el-icon-bell'></i>事故总数</span><span class="statics--tab--value">
          <span class="statics_value sum">{{staticsData.sum}}</span>(其中重大事故:
          <span class="statics_value">{{staticsData.esplish}}</span>)</span></div>
         <div>受伤:<span class="statics_value">{{staticsData.injury}}人</span>&nbsp;&nbsp;|&nbsp;&nbsp;死亡:<span class="statics_value">{{staticsData.died}}人</span></div>
      </div>
      <div class="accident-statics_content">
        <div class="accident-statics_sort"> <i class="el-icon-collection-tag">事故类型：</i>
            <div class="accident-statics_sort--div">
              <el-row v-for="(item,index) in sg_sort_data" :key="index" style='text-align:center;'><el-col :span="12">{{item.name}}</el-col><el-col :span="6">{{item.value}}起</el-col><el-col :span="6">{{item.radio}}</el-col></el-row>
            </div>
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
      sg_sort_data:[{name:'机动车与机动车',value:'12',radio:'32%'},{name:'机动车与非机动车',value:'122',radio:'32%'},{name:'行人',value:'2',radio:'32%'}]
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
    
      .statics_sort{
        .accident-statics_sort--div{
          width:85%;
          height:15vh;
          margin:2vh auto;
          border:1px solid $color-border-4;
        }
      }
    }
    
  }
   .accident-statics--tab{
      width:100%;
      height:10vh;
      
      >div{
        width:100%;
        height:5vh;
        font-size: 0.8vw;
        @include flex(row,center);

        .--tab-title{
        font-size:0.9vw;
        width:40%;
        @include flex(row,center);
      }
      .statics--tab--value{
        width:60%;
        @include flex(row,center);
        .statics_value{
          color:$color-active;
        }
        .statics_value.sum{
          font-size:1.4vw;
        }
      }
      .--tab-title{
        .el-icon-bell:before {
            font-size: 1.5vw;
            color: #e70101;
            font-weight: 600;
        }
      }
      }
      
    }
}
</style>