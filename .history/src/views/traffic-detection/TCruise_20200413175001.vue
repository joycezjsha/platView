<template>
  <div id="cruise-div" class="cover-div">
    <div id="cruise_container">
      <div id="cruise_title">
        <div>
          <i class="el-icon-collection-tag">巡航地点</i>
        </div>
        <div>
          <el-select v-model="value" placeholder="请选择" class="fangan">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <div @click="addPlan">
            <i class="el-icon-circle-plus-outline"></i>
          </div>
        </div>
      </div>
      <div id="cruise_content">
        <ul id="cruise_table">
          <li class="cruise-item" v-for="item in flyRoutes" :id="item.id" :key="item.id">
            <span>{{item.address}}</span>
            <span class="address-name">{{item.name}}</span>
            <span v-show="showDelIcon" class="delIcon"><i class="el-icon-delete"></i></span>
          </li>
        </ul>
      </div>
      <!-- <div class="cruise-edit">
        <el-button type="text" @click="editPlanName">修改名称</el-button>
        <div class="editBtn" @click="editPlanLocation">
          <i class="el-icon-edit"></i>编辑地点
        </div>
        <el-button type="text" style="color: red;" @click="delPlan">删除方案</el-button>
      </div> -->
      <div class="cruise-play-stop">
        <img class="cruise-play-stop-img" :src="playImgUrl" @click="playOrStop()" />
      </div>
    </div>
    <!--<div style="position: fixed;bottom: 2rem;font-size: 16px;width: 40%;max-width: 600px;height: 30px;left: 30%;line-height: 30px;color: white;text-align: center;font-family: 'Microsoft YaHei';"><p class="scroll">人民日报、CCTV等媒体发布西安交警向公众提供3D粒子地图。</p></div>-->
    <!--div style="background-image: url(./static/img/icon/tab-traffic-icon.png);background-size: cover;position: fixed;top: 10rem;font-size: 16px;width: 200px;height: 30px;right: 5%;line-height: 30px;color: white;text-align: center;font-family: 'Microsoft YaHei';">路况巡航</div-->
  </div>
</template>

<script>
import { IMG } from "./config";
export default {
  name: "TCruise",
  data() {
    return {
      map: {},
      flyRoutes: [],
      i: 0,
      buildingmore: [],
      playImgUrl: IMG.CRUISE_IMG_PLAY,
      isPlay: false,
      isShowContainer: true,
      options: [{ value: 1, label: "方案1" }],
      value:1,
      showDelIcon:true
    };
  },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.map.repaint = true;
    this.$store.commit("setRight", '2vw');
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
    //显示地图右下角飞行图标
    // eventBridge.$emit('map_showFlyIcon');
    // eventBridge.$emit('showLayerBtn');
    /*$('#traffiCtrlFly').css('background','url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAWCAQAAABwdJQDAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfhCgwJFS+CHyVcAAABeklEQVQ4y43Tz0tUYRTG8c8dB9y3mEVEPzAQjKAaF4WLchYtyhBcBLWIiKJFoH9Gu1ZuCqVaRAaNgWISFIygROaNIKKi7IdGCyFsI1Q4TIu593a93FGf1fucc7/vOe973hss3HbHjJYqZ3xBQ80zPbapghoqZj1xdHtA3M5Jz03p3hr45mviTpk34dDmgKTGOgJnvFJ1cDOgFq3r5kFgwGsPdG1VoV3JsEYUP+uNezrzgC+WIrdXl6vWk9x5b8O74f4sIDW4igP6rSW+zQXvwtFwXyuAISW9VlKRokvehzfDPRAsQIdPqQ/+OO6naRtawV8jrjcrLPqeSrR7aE2Plxngtx0OFyKz8fntUvVLr8eRXzHitFL5XHmy2RJX3MrsN+qyohvqHpkr1/8fqKmarI7osGgw+7xj4KMfdoKGF8ZVfRa0mnRco27GoN2OGXbCuLE8ID4DnVaT2w88VTGlL++Pi/UhNayGi1blqpAftuxafqKole5rywv/A+tnYeND+tXrAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTEwLTEyVDA5OjIxOjQ3KzA4OjAwzqN0ZQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMC0xMlQwOToyMTo0NyswODowML/+zNkAAAAASUVORK5CYII=\') no-repeat 50% center');*/
    // eventBridge.$on('flyShowContainer', function () {
    //   that.isShowContainer = !that.isShowContainer;
    //   if(that.isShowContainer){
    //     $('#cruise_container').show();
    //     $('#traffiCtrlFly').css('background','url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAWCAMAAADto6y6AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABC1BMVEWjtO////+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO////+KC4gAAAAAV3RSTlMAAJ8/nr07Xrk4H7U03/6yMKD7rS1g+Mn9qSohk6Un4WX8oSSikEr0nWM16fmZIzfblRzjGRbK8adNpMYGC5sHnASSjz4DJc7lx3UiAcBtCWKutB3uWVzSmX8cAAAAAWJLR0QB/wIt3gAAAAd0SU1FB+EKDAoBO7QtmC0AAADoSURBVCjPY2BiZkABjFDAwBLOyoZVgj08PJyDE4sEVzgIcPNgSDDwgmX4+AXQJQSBwkIgKWERVAlRoKCYOEiXhKQUsoQ0SIxXhg8sJSuHkGCQBwmxKgiB7VJUUoZLqIBFVNXUwXS4kIY0VEITIiCqpQ1hhOvocoEl9CBcMX1lg3CYlKERyIXGEJ6xiakZVMLcwhIkYQXlWtvYcgMpbTs1e7BRDAowExwYHJ2cXVxhrmJwg0m46yF7EAg8QCHi6eXN4IMmIavo62fE4B8QKIkmIWcKIn1Yw4PQJKAgOASHBEMoLgmGMIQEABPwPWhIBaSaAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTEwLTEyVDEwOjAxOjU5KzA4OjAwEMBd+QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMC0xMlQxMDowMTo1OSswODowMGGd5UUAAAAASUVORK5CYII=\') no-repeat 50% center');
    //   }else{
    //     $('#cruise_container').hide();
    //     $('#traffiCtrlFly').css('background','url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAWCAQAAABwdJQDAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfhCgwJFS+CHyVcAAABeklEQVQ4y43Tz0tUYRTG8c8dB9y3mEVEPzAQjKAaF4WLchYtyhBcBLWIiKJFoH9Gu1ZuCqVaRAaNgWISFIygROaNIKKi7IdGCyFsI1Q4TIu593a93FGf1fucc7/vOe973hss3HbHjJYqZ3xBQ80zPbapghoqZj1xdHtA3M5Jz03p3hr45mviTpk34dDmgKTGOgJnvFJ1cDOgFq3r5kFgwGsPdG1VoV3JsEYUP+uNezrzgC+WIrdXl6vWk9x5b8O74f4sIDW4igP6rSW+zQXvwtFwXyuAISW9VlKRokvehzfDPRAsQIdPqQ/+OO6naRtawV8jrjcrLPqeSrR7aE2Plxngtx0OFyKz8fntUvVLr8eRXzHitFL5XHmy2RJX3MrsN+qyohvqHpkr1/8fqKmarI7osGgw+7xj4KMfdoKGF8ZVfRa0mnRco27GoN2OGXbCuLE8ID4DnVaT2w88VTGlL++Pi/UhNayGi1blqpAftuxafqKole5rywv/A+tnYeND+tXrAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTEwLTEyVDA5OjIxOjQ3KzA4OjAwzqN0ZQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMC0xMlQwOToyMTo0NyswODowML/+zNkAAAAASUVORK5CYII=\') no-repeat 50% center');
    //     that.isPlay = false;
    //     that.playImgUrl=globals.CRUISE_IMG_PLAY;
    //     clearInterval(that.fly);
    //   }
    // })
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
    //显示飞行效果
    fly() {
      let that = this;
      if (that.flyRoutes.length < 1 || !that.isPlay) return;
      let i = that.i;
      //console.log(that.flyRoutes[i])

      if (i > 0) {
        let preid = that.flyRoutes[i - 1].id;
        $("#" + preid).css("background-color", "transparent");
      }
      let options = that.getCurRouteOptions(that.flyRoutes[i]);
      that.map.flyTo(options);
      if (i === 0) {
        let preid = that.flyRoutes[that.flyRoutes.length - 1].id;
        $("#" + preid).css("background-color", "transparent");
      }
      let cid = that.flyRoutes[i].id;
      $("#" + cid).css("background-color", "#4176f3");

      if (
        $("#cruise_table").scrollTop() ||
        $("#cruise_table").scrollTop() == 0
      ) {
        let scrottl =
          $("#" + cid).offset().top -
          $("#cruise_table").offset().top +
          $("#cruise_table").scrollTop();
        //console.log(scrottl)
        $("#cruise_table").animate({ scrollTop: scrottl }, 10);
      }
      if (i === that.flyRoutes.length - 1) {
        that.i = 0;
      } else {
        that.i++;
      }
    },
    getCurRouteOptions(route) {
      let center = route.geometry;
      let time = route.time;
      let zoom = route.zoom;
      let bearing = route.bearing;
      let pitch = route.pitch;
      if (center && zoom && time) {
        zoom = parseFloat(zoom);
        bearing = parseFloat(bearing || "0");
        pitch = parseFloat(pitch || "0");
        time = parseFloat(time);
        let options = {
          center: center,
          zoom: zoom,
          maxZoom: zoom,
          minZoom: zoom,
          bearing: bearing,
          pitch: pitch,
          speed: 0.8,
          duration: time * 1000
        };
        return options;
      }
      return null;
    },
    resizeContainer() {
      let h = $("#cruise_container").outerHeight(true);
      let tH = $("#cruise_title").outerHeight(true);
      $("#cruise_table").css("height", h - tH + "px");
    },
    //显示楼的3D图层
    /*getLayerData(){
        let that = this;
        $.ajax({
          url: globals.MAP_TRAFFIC_URL + globals.MAP_SOLUTION +'?token=' + globals.MAP_ACCESS_TOKEN,
          dataType: "json",
          async: false,
          success: function (data) {
            if(data.data.rows[0].layers){
              let arr = data.data.rows[0].layers
              for (let i = 0; i < arr.length; i++) {
                let content = JSON.parse(arr[i].content || '{}')
                if ((content['source'] == 'Buildingmore' && content['source-layer'] == 'Buildingmore')) {
                  that.buildingmore.push(arr[i].id);
                  if(that.map.getLayer(arr[i].id)) that.map.setLayoutProperty(arr[i].id, 'visibility', 'visible');
                }
              }
            }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest)
            console.log(textStatus)
            console.log(errorThrown)
          }
        });
      },*/
    //获取巡航数据
    getFlyData() {
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
    },
    //开始或停止
    playOrStop() {
      let that = this;
      if (that.isPlay) {
        that.isPlay = false;
        that.playImgUrl = IMG.CRUISE_IMG_PLAY;
        clearInterval(that.fly);
      } else {
        that.isPlay = true;
        that.playImgUrl = IMG.CRUISE_IMG_STOP;
        setInterval(that.fly, 1000 * 10);
        that.fly();
      }
    },
    //添加方案
    addPlan() {
      this.$prompt("方案名称", "新建方案", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          this.$message({
            type: "success",
            message: "方案名称: " + value
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    editPlanName() {
      this.$prompt("方案名称", "修改名称", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          this.$message({
            type: "success",
            message: "方案名称: " + value
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    editPlanLocation() {
      this.$prompt("方案名称", "修改名称", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          this.$message({
            type: "success",
            message: "方案名称: " + value
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    delPlan() {
      this.$confirm("确认删除方案?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
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
#cruise-div {
  position: absolute;
  z-index: 10;
  left: 1vw;
  width: 17vw;
  height: 68vh;
  top: 9vh;
}
#cruise_container {
  width: 100%;
  height: 100%;
  background-color: #1a1a2373;
  border: 1px solid #6d6262;
}
#cruise_content {
  width: 85%;
  height: 85%;
  background-color: #444d61;
  margin: 1% 5%;
}
#cruise_title {
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
  > div {
    display: flex;
    align-items: center;
  }
  > div:nth-child(1) {
    width: 60%;
  }
  > div:nth-child(2) {
    width: 40%;
    > div:nth-child(2) {
      width: 1.5vw;
      height: 2.3vh;
      line-height: 2.3vh;
      background-color: #02082f;
      text-align: center;
      border-radius: 3px;
      margin-left: 0.5vh;
    }
  }
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
    .delIcon{
      float: right;
      margin-right: 2vw;
      cursor:pointer;
      .el-icon-delete{color:red;}
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
.fangan .el-input__inner{
      height: 2.5vh;
      border-radius: 0;
      background-color: transparent;
      border-color: #f6f3f3;
      color: #fff;
    }
.el-select .el-input .el-select__caret{
   line-height:2vh;
 }
</style>