<template>
  <div class="traffic-index-div">
    <div class="traffic-index_container">
      <div class="traffic-index_title">
        <div>
          <i class="el-icon-collection-tag">城市拥堵排名</i>
        </div>
        
      </div>
      <div class='xian_order'>西安全国排名:{{order_xian}}</div>
      <div class="traffic-index_content">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column
        type="index"
        label="No"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="城市">
      </el-table-column>
    </el-table>
        <ul class="traffic-index_content_table">
          <li class="index-item" v-for="item in indexDatas" :id="item.id" :key="item.id">
            <span>{{item.address}}</span>
            <span class="address-name">{{item.name}}</span>
            <span v-show="showDelIcon" class="delIcon">
              <i class="el-icon-delete"></i>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
export default {
  name: "TCruise",
  data() {
    return {
      map: {},
      indexDatas: [],
      order_xian:8
    };
  },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.map.repaint = true;
    //      this.map.repaint = true;
    //this.resizeContainer();
    // setTimeout(function(){
    //   eventBridge.$emit('map_showBuildingmore');
    //   eventBridge.$emit('map_showTraffic');
    // },1000);
    that.getFlyData();
    //setInterval(that.fly,1000*10);
    $(window).resize(function() {
      that.resizeContainer();
    });
  },
  destroyed() {
    this.flyRoutes = [];
    this.map.stop();
    let that = this;
    clearInterval(that.fly);
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
      $.ajax({
        url: "./static/json/cruise.json", //globals.CRUISE_ALL_INFO_URL,
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
          if (data.errmsg == "success" && data.data.total > 0) {
            let features = [];
            for (let i = 0; i < data.data.rows.length; i++) {
              let zoom = 17;
              if (i % 2 == 0) zoom = 16;
              let name = data.data.rows[i].cruiseRoad;
              if (!name || name == "") name = data.data.rows[i].cruiseAddress;
              features.push({
                id: data.data.rows[i].id,
                address: i + 1 + ". ",
                name: name,
                geometry: data.data.rows[i].lnglat,
                time: 10,
                zoom: zoom,
                pitch: 45,
                bearing: 0
              });
            }
            that.flyRoutes = features;
            //that.fly();
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log(XMLHttpRequest);
          console.log(textStatus);
          console.log(errorThrown);
        }
      });
    }
  }
};
</script>
<style scope lang='scss'>
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
#cruise_table::-webkit-scrollbar {
  width: 1rem;
  height: 1rem;
  background-color: #9c9fad;
}

/*定义滚动条轨道 内阴影+圆角*/
#cruise_table::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background-color: #9c9fad;
}

/*定义滑块 内阴影+圆角*/
#cruise_table::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #ffffff;
}
.traffic-index-div {
  position: absolute;
  z-index: 10;
  left: 1vw;
  width: 17vw;
  height: 68vh;
  top: 9vh;
}
.traffic-index_container {
  width: 100%;
  height: 100%;
  background-color: #1a1a2373;
  border: 1px solid #6d6262;
  .traffic-index_title{
      position: relative;
    width: 96%;
    border-bottom: 0.1rem solid #a9afd6;
    font-family: Microsoft YaHei;
    font-size: 1vw;
    color: #fff;
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
      color: white;
    width: 100%;
    height: 3vh;
    line-height: 3vh;
    text-align: center;
    font-size: 1.2vw;
    }
  .traffic-index_content {
    width: 85%;
    height: 85%;
    background-color: #444d61;
    margin: 1% 5%;
    
    &_table {
      
    }
    
  }
}
#cruise_content {
}
#cruise_table {
  position: relative;
  color: #fff;
  font-family: \\5fae\8f6f\96c5\9ed1;
  font-size: 0.9vw;
  padding: 0;
  text-align: left;
  overflow-y: auto;
  height: 100%;
  .cruise-item {
    width: 100%;
    color: #fff;
    padding: 0.5rem 1rem;
    font-size: 0.9vw;
    font-family: Microsoft YaHei;
    display: block;
    background-color: transparent;
    border-bottom: 0.1rem solid #a9afd6;
    .delIcon {
      float: right;
      margin-right: 2vw;
      cursor: pointer;
      .el-icon-delete {
        color: red;
      }
    }
  }
}
.cruise-edit {
  width: 100%;
  height: 5vh;
  border-top: 1px solid #eee;
  background-color: #3c313175;
  @include flex(row, center);
  .editBtn {
    width: 30%;
    height: 4vh;
    line-height: 4vh;
    background-color: #787b90;
    @include flex(row, center);
    margin-left: 6%;
    cursor: pointer;
  }
  button {
    @include flex(row, center);
    width: 30%;
  }
  button:nth-child(1) {
    width: 20%;
  }
}
.cruise-play-stop {
  position: fixed;
  bottom: 6rem;
  width: 20%;
  margin-left: 40%;
  text-align: center;
  z-index: 6;
}
.fangan {
  width: 6vw;
  background-color: #050d4e;
  height: 2.5vh;
  color: #fff;
}
</style>
<style>
.fangan .el-input__inner {
  height: 2.5vh;
  border-radius: 0;
  background-color: transparent;
  border-color: #f6f3f3;
  color: #fff;
}
.el-select .el-input .el-select__caret {
  line-height: 2vh;
}
</style>