<template>
  <div id="cruise-div" class="cover-div boxstyle">
    <div id="cruise_container">
      <div id="cruise_title">
        <div>
          <m-title label='巡航地点' style='width:7vw;'></m-title>
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
        </div>
      </div>
      <div id="cruise_content">
        <ul id="cruise_table">
          <li class="cruise-item" v-for="item in flyRoutes" :id="item.id" :key="item.id">
            <span>{{item.address}}</span>
            <span class="address-name">{{item.name}}</span>
            <!-- <span v-show="showDelIcon" class="delIcon"><i class="el-icon-delete"></i></span> -->
          </li>
        </ul>
      </div>
      <div class="cruise-play-stop">
        <i :class="isPlay?'iconfont icon-zanting':'iconfont icon-video-control'" @click="playOrStop()"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import mTitle from '@/components/UI_el/title_com.vue'
export default {
  name: "TCruise",
  data() {
    return {
      map: {},
      flyRoutes: [],
      i: 0,
      buildingmore: [],
      url:'',
      playImgUrl: IMG.CRUISE_IMG_PLAY,
      isPlay: false,
      isShowContainer: true,
      options: [
        { value: 1, label: "西安" },
        { value: 2, label: "咸阳" },
        { value: 3, label: "延安" },
        { value: 4, label: "铜川" },
        { value: 5, label: "宝鸡" },
        { value: 6, label: "榆林" },
        { value: 7, label: "商洛" },
        { value: 8, label: "渭南" },
        { value: 9, label: "安康" },
        { value: 10, label: "汉中" },
      ],
      value:1,
      showDelIcon:true
    };
  },
  watch:{
    value:function(newValue,oldValue){
      this.getFlyData();
    }
  },
  components:{mTitle},
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter(mapConfig.DEFAULT_CENTER);
    this.map.setZoom(6);
    this.map.repaint = true;
    this.$store.commit("setRight", '1vw');
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
      $("#" + cid).css("background-color", "#034172");

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
      console.log(that.value)
      if(that.value==1){
        that.url='./static/json/xian.json';
      }else if(that.value==2){
        that.url='./static/json/xianyang.json';
        console.log(that.url)
      }else if(that.value==3){
        that.url='./static/json/yanan.json';
      }else if(that.value==4){
        that.url='./static/json/tongchuan.json';
        console.log(that.url)
      }else if(that.value==5){
        that.url='./static/json/baoji.json';
      }else if(that.value==6){
        that.url='./static/json/yulin.json';
      }else if(that.value==7){
        that.url='./static/json/shangluo.json';
        console.log(that.url)
      }else if(that.value==8){
        that.url='./static/json/weinan.json';
      }else if(that.value==9){
        that.url='./static/json/ankang.json';
        console.log(that.url)
      }else if(that.value==10){
        that.url='./static/json/hanzhong.json';
      }
        $.ajax({
        
        url:that.url,
        // url: "./static/json/xian.json", //globals.CRUISE_ALL_INFO_URL,
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
          // && data.data.total > 0
          // errormsg
          if (data.errmsg == "success" ||  data.errormsg=="success") {
            let features = [];
            for (let i = 0; i < data.data.rows.length; i++) {
              console.log(data.data.rows)
              let zoom = 17;
              if (i % 2 == 0) zoom = 16;
              let name = data.data.rows[i].cruiseRoad;
              if (!name || name == "") name = data.data.rows[i].cruiseAddress;
              features.push({
                id: data.data.rows[i].id,
                address: i + 1 ,
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
      // $.ajax({
      //   url: "./static/json/xian.json", //globals.CRUISE_ALL_INFO_URL,
      //   headers: {
      //     "Content-Type": "application/x-www-form-urlencoded"
      //   },
      //   responseType: "json",
      //   method: "get",
      //   dataType: "json",
      //   data: {
      //     // token: window.localStorage.getItem("loginUserToken")
      //   },
      //   success: function(data) {
      //     if (data.errcode == -2) {
      //       that.$router.push({ name: "/login" });
      //     }
      //     if (data.errmsg == "success" && data.data.total > 0) {
      //       let features = [];
      //       for (let i = 0; i < data.data.rows.length; i++) {
      //         let zoom = 17;
      //         if (i % 2 == 0) zoom = 16;
      //         let name = data.data.rows[i].cruiseRoad;
      //         if (!name || name == "") name = data.data.rows[i].cruiseAddress;
      //         features.push({
      //           id: data.data.rows[i].id,
      //           address: i + 1 ,
      //           name: name,
      //           geometry: data.data.rows[i].lnglat,
      //           time: 10,
      //           zoom: zoom,
      //           pitch: 45,
      //           bearing: 0
      //         });
      //       }
      //       that.flyRoutes = features;
      //       //that.fly();
      //     }
      //   },
      //   error: function(XMLHttpRequest, textStatus, errorThrown) {
      //     console.log(XMLHttpRequest);
      //     console.log(textStatus);
      //     console.log(errorThrown);
      //   }
      // });
    },
    //开始或停止
    playOrStop() {
      let that = this;
      if (that.isPlay) {
        that.isPlay = false;
        // that.playImgUrl = IMG.CRUISE_IMG_PLAY;
        clearInterval(that.fly);
      } else {
        that.isPlay = true;
        // that.playImgUrl = IMG.CRUISE_IMG_STOP;
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
  width: 298px;
  height: 977px;
  top: 99px;
}
#cruise_container {
  width: 100%;
  height: 100%;
}
#cruise_content {
  width: 100%;
  height: 93%;
}
#cruise_title {
  position: relative;
  width: 96%;
  font-family: Microsoft YaHei;
  font-size: 1vw;
  color: #fff;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 2px 2% 0.6rem 2%;
  font-weight: bolder;
  > div {
    display: flex;
    align-items: center;
  }
  > div:nth-child(1) {
    width: 53%;
  }
  > div:nth-child(2) {
    width: 40%;
    margin-top: 10px;
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
  font-size: 0.9vw;
  padding: 0 5%;
  text-align: left;
  overflow-y: auto;
  height: 90%;
  margin-top:10px;
  .cruise-item {
    width: 85%;
    color: #fff;
    padding: 0 22px;
    margin: 15px auto;
    font-size: 0.9vw;
    font-family: Microsoft YaHei;
    display: block;
    background-color: transparent;
    // border-bottom: 0.1rem solid #a9afd6;
    >span{
      width:40%;
      text-align:left;
      display: inline-block;
      font-size: 14px;
    }
    >span:nth-child(1){
      padding-left:30px;
    }
  }
  .cruise-item:nth-child(odd){
    background-color: #111633;
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
  bottom: 50px;
  width: 20%;
  margin-left: 40%;
  text-align: center;
  z-index: 6;
}
.fangan {
  width:120px;
  background-color: #050d4e;
  height: 32px;
  color: #fff;
}
</style>
<style>
.fangan .el-input .el-input__inner{
      height: 32px;
      width:124px;
      border-radius: 2px;
      background-color: transparent;
      border-color: #27438B;
      color: #fff;
    }
.el-select .el-input .el-select__caret{
   line-height:2vh;
 }
</style>