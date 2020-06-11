<template>
  <div class="traffic-index-div">
    <div class="traffic-index_container boxstyle">
      <div class="traffic-index_title">
        <m-title label='境内高速路及主干道路况' img_type=1 class='title'></m-title>
      </div>
      <m-tab label='当前选择范围' :value='selectItem.road'></m-tab>
      <div class="traffic-index_content">
        <ul class="traffic-index_content_table">
          <li class="index-item" v-for="(item,index) in indexDatas" :id="item.id" :key="item.id">
            <p><span>{{++index}}</span><span>{{item.roadname}}</span>
            <span class="address-name">{{item.stratname}}--->{{item.endname}}</span>
            </p>
            <p><span>平均速度：<span class='value'>{{item.sd}}km/h</span></span>
            <span>路长<span class='value'>{{item.cd}}km</span></span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import mTitle from "@/components/UI_el/title_com.vue";
import mTab from '@/components/UI_el/tab.vue'
export default {
  name: "TIndex",
  data() {
    return {
      map: {},
      indexDatas: [],
      selectItem:{"road":"全省",order:8}
    };
  },
  components: {
    mTitle,mTab
  },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    that.$store.commit("setRight", '25vw');
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.getTrafficData();
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
    getTrafficData() {
      let that = this;
    },
    setSelectItems(name,id){
      this.selectItem.road=name;
    },
        /**
     * 初始化城市拥堵排名列表
     */
    getCityIndexData(){
      let that=this;
      interf.GET_ROAD_TAFFIC_ORDER_API({})
      .then(response=>{
        if (response && response.status == 200){
          var data= response.data;
          if (data.errcode == 0) {
            that.indexDatas=data.data;
          }else{
            that.$message({
              message: data.errmsg,
              type: "error",
              duration: 1500
            });
          }
        }
      })
      .catch(err=>{
        console.log(err);
      })
      .finally(() => {
        that.tableLoading = false;
      });
    },
  }
}
</script>
<style scope lang='scss'>
@import '@/assets/css/color.scss';
@mixin flex($direction, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.traffic-index-div {
  position: fixed;
  z-index: 10;
  right: 13px;
  width: 474px;
  height: 1026px;
  top: 9vh;
  .traffic-index_container {
    width: 100%;
    height: 100%;
    .traffic-index_title{
      position: relative;
      width: 100%;
      font-family: Microsoft YaHei;
      font-size: 1vw;
      color: $color-white;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      padding: 2px 2% 0.6rem 2%;
      font-weight: bolder;
      .title{
        width:244px;
        height:4vh;
        line-height: 4vh;
      }
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
  .traffic-index_content {
    width: 98%;
    height: 85%;
    background-color: $color-bg-1;
    margin: 1%;
    
    &_table {
      color: $color-white;
      margin: 0;
      padding: 5%;
      width: 90%;
      height: 90%;
      .index-item{
        >p:nth-child(1){
          @include flex(row,center,center);
          >span{
            @include flex(row,center,center)
          }
          >span:nth-child(1){
            width:8%;
          }
          >span:nth-child(2){
            width:15%;
          }
          >span:nth-child(3){
            width:75%;
            @include flex(row,flex-end,center);
          }
        }
        >p:nth-child(2){
          color: $color-text-label;
          font-size: 0.8vw;
          @include flex(row,center,center);
          >span{
            @include flex(row,center,center)
          }
          >span:nth-child(1){
            width:60%;
          }
          >span:nth-child(2){
            width:40%;
            @include flex(row,flex-end,center);
          }
        }
        span.address-name{
          color:$color-info;
        }
        span.value{
          color:$color-text-value;
        }
      }
    }
    
  }
}
}

</style>