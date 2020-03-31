<template>
  <div id="map-ctrl" class="warp-main">
    <!--<my-map></my-map>-->
    <!--<bread-crumb :currentPath="this.$route.path"></bread-crumb>-->
    <div id="map">
      <div style="cursor: pointer; position: fixed;bottom: 10vh;right: 1vw;z-index: 999;display: flex;flex-direction: column">
        <!--<img class="control_size" @click="setPitch('click')" :src="iconPitch">-->
        <!--<img class="control_size" style="margin-top: 1vh" @click="setZoomOut" :src="iconZoomOut">-->
        <!--<img class="control_size" @click="setZoomIn" :src="iconZoomIn">-->
        <div class="control_size" @click="setPitch('click')">{{show3D?"3D":"2D"}}</div>
        <div class="control_size" @click="setZoomOut" style="font-size: 1.5vw;margin-top:9px;">+</div>
        <div class="control_size" @click="setZoomIn" style="font-size: 2vw;line-height: 3.5vh;">-</div>
        <div style="display: flex;align-items: center;justify-content: center;" class="control_size icon_map_compass_bg" @click="setCompassRotate">
          <img class="map-ctrl-compass" style="width: 8px;height: 22px" @click="setCompassRotate" :src="iconCompass">
        </div>
      </div>
    </div>
    <div class="title">地图服务 <i class="el-breadcrumb__separator el-icon-arrow-right"></i> "一张图"</div>
    <div id="layer-list">
      <!--<div id="layer-title" class="layer-title"><span>图层列表</span></div>-->
      <!--<div class="layer-item" v-for="layer in layerOptions" :key="layer.id" :data-id="layer.id" @click="showLayers(layer.id)">-->
        <!--{{layer.layer_name}}图层-->
      <!--</div>-->
      <!--:key="layer.id"-->
      <el-select v-model="id" placeholder="请选择图层" @change="showLayers(id)">
        <el-option
          v-for="layer in layerOptions"
          multiple="100"
          :label="layer.layer_name"
          :key="layer.id"
          :value="layer.id">
          <div style="display: block;float: left;margin-top: 5px;margin-right:5px;"><img :src="uncheckPng" type="0" @click="layerClick($event)"></div><div>{{layer.layer_name}}</div>
        </el-option>
      </el-select>
    </div>
    <div id="map-style-button">
      <!--<img :src="mapIcon.icon[mapIcon.index]" @click="changeMapStyle()" />-->
      <ul>
        <li class="active" index="0" :style="'background:url('+map_light+');background-size:100% 100%;'" @click="changeMapStyle(0,$event)"></li>
        <li class="" index="1" :style="'background:url('+map_dark+');background-size:100% 100%'" @click="changeMapStyle(1,$event)"></li>
      </ul>
    </div>
    <div id="layer-search-div" style="/*border: 1px solid #02a3d2f2;*/border-radius: 17px;">
      <el-input v-show="!isMileage" v-model="POISearch.road" @input="changeInput" placeholder="请输入关键字搜索" size="mini"  class="input-with-select" style="float:left;" clearable>
        <el-button slot="prepend" icon="el-icon-search" class="searchBtn"></el-button>
      </el-input>
      <el-row v-show="isMileage" class="searchMileageDiv">
        <el-input placeholder="道路名称" size="mini" v-model="POISearch.road" @input="changeRoad" class="input-with-select searchInput" clearable>
          <el-button slot="prepend" type="primary" class="searchBtn" icon="el-icon-search"></el-button>
        </el-input>
        <!--<el-button icon="el-icon-search" class="searchBtn" @click="mileageSearch()"></el-button>-->
        <!--<input placeholder="道路名称" size="mini" v-model="Mileage.road" class="input-with-select" @change="changeRoad" clearable />-->
        <el-select v-model="POISearch.dir" placeholder="请选择方向" @change="changeDir(val)" style="width:30%;">
          <el-option label="全部" value="全部"></el-option>
          <el-option label="上行" value="1"></el-option>
          <el-option label="下行" value="2"></el-option>
          <el-option label="双向" value="3"></el-option>
        </el-select>
        <el-input placeholder="桩号" size="mini" v-model="POISearch.num" class="input-with-select mileageDir" @input="changeNum" clearable style="width: 25%;"></el-input>
      </el-row>
      <div class="space"></div>
      <el-button @click="exportQueryExcel()" round v-show="isQuery"  class='exportQuery'>导出</el-button>
    </div>
    <div id="layer-search-list" class="el-scrollbar">
      <!--<el-row v-for="(item,index) in searchList" @click.native="startSearch(item)" class="rowCls" :key="index">-->
        <!--&lt;!&ndash;<el-col :style="'width:'+item.width+''">{{parseInt(index+1)}}</el-col>&ndash;&gt;-->
        <!--<el-col :style="';white-space:nowrap;overflow: hidden;width:'+item.width+''">{{item.name}}</el-col>-->
        <!--<el-col :style="'width:'+item.width+''" v-show="item.length">{{parseFloat(item.length).toFixed(2)}}km</el-col>-->
        <!--<el-col :style="'width:'+item.width+''" v-show="item.city">{{item.city}}</el-col>-->
        <!--<el-col :style="'width:'+item.width+''" v-show="item.dir">{{item.dir}}</el-col>-->
        <!--<el-col :style="'width:'+item.width+''" v-show="item.mileagenum">{{item.mileagenum}}</el-col>-->
        <!--<el-col style="width:50%;color:#0089ff;text-align: left;" @click.stop="">{{searchList[0].msg}}</el-col>-->
      <!--</el-row>-->
      <el-row v-for="(item,index) in searchList" @click.native="startSearch(item)" class="rowCls" :key="index">
        <!--<el-col :style="'width:'+item.width+''">{{parseInt(index+1)}}</el-col>-->
        <span style="padding-left: 4px;">{{item.name}}</span>
        <span style="margin-left:6px;" v-show="item.roadno">{{item.roadno}}</span>
        <span style="margin-left:4px;color: #A5B4CD;font-size: 0.73vw;" v-show="item.length">{{parseFloat(item.length).toFixed(2)}}km</span>
        <span style="margin-left:8px;color: #A5B4CD;font-size: 0.73vw;" v-show="item.city">{{item.city}}</span>
        <span style="margin-left:5px;" v-show="item.dir">{{item.dir}}</span>
        <span style="margin-left:5px;" v-show="item.mileagenum">{{item.mileagenum}}</span>
        <span style="margin-left:5px;color:#0089ff;text-align: left;" @click.stop="">{{searchList[0].msg}}</span>
      </el-row>
    </div>
    <tool ref="tool" :checkedTable="checkedTableName" :checkedType="checkedType"></tool>
    <div id="minemap_popup" v-show="isShowPopup"></div>
    <statics ref="statics" :checkedTable="checkedTableName" :checkedType="checkedType" :checkedLayerName="checkedLayerName"></statics>
  </div>
</template>

<script>
  /*地图页面*/
  import utils from '../js/utils'
  import {conf} from './config.js'
  import tool from "./tool.vue";
  import statics from "./statics.vue";
    export default {
      components: {
        tool,statics},
      name: "MapCtrl",
      data() {
        return {
//          input: "",
          layerKeyword: "请输入关键字搜索",
          map: this.$store.state.map,
          mapStyle: "LIGHT",
          layerOptions: [],
          visibleId: "",
          checkedType: "",//当前图层点线面区分1->点，2->线，3->面
          checkedTableName: "",
          checkedLayerName: "",
          iconList: [],
          searchList: [],
          token: sessionStorage.getItem("token"),
          id: '',//this.$store.state.layerId,//选中的图层
          layerIds:[],//this.$store.state.layerId,//选中的图层
          icon: '',//选中图层的icon
          line_color: '',//选中图层的line_color
          mapIcon: {index: 0, icon: [conf.IMG.mapLightIcon, conf.IMG.mapDarkIcon]},
          exportIcon: conf.IMG.exportIcon,
          covers: {
            markers: [], lines: [], polygons: [], popups: [],closePopups:null,
            popup: new minemap.Popup({closeOnClick: true, offset: [0, -25], closeButton: false})
          },
          mileagedata: [],
          dataStatics: [
            {name: '', count: '', kind: ''}
          ],
          POISearch: {
            road: '',
            dir: '',
            num: ''
          },
          iconZoomOut: './static/images/mapCtr/zoom_out.png',
          iconZoomIn: './static/images/mapCtr/zoom_in.png',
          iconCompassBG: './static/images/mapCtr/compass_bg.png',
          iconCompass: './static/images/mapCtr/compass.png',
          iconPitch2d: './static/images/mapCtr/pitch_2d.png',
          iconPitch3d: './static/images/mapCtr/pitch_3d.png',
          map_light:conf.IMG.map_light,
          map_dark:conf.IMG.map_dark,
          show3D: false,
          closeImg: conf.IMG.CLOSE_IMG,
          tableLoading: false,
          isMileage: true,
          _offset: [-1, -15],
          size: 8,
          cancel: null,
          searchParams:{page:1,limit:10},
          isShowPopup:false,
          isQuery:false,
          trafficArr:[],
          trafficParticleIds:[],
          checkPng:conf.IMG.check_png,
          uncheckPng:conf.IMG.uncheck_png
        }
      },
      mounted() {
//        this.getMileage();
        let that = this;
        this.prepareLayerOptions();
        let dom = document.getElementById('layer-search-list');
        this.search_list_page = [0, this.size];
        dom.addEventListener('scroll', () => {
          // 滚动距离
          let scrollTop = dom.scrollTop;
          // 变量windowHeight是可视区的高度
          let windowHeight = dom.clientHeight || dom.clientHeight;
          // 变量scrollHeight是滚动条的总高度
          let scrollHeight = dom.scrollHeight || dom.scrollHeight;
          if (scrollTop + windowHeight >= scrollHeight-3) {
            // 获取到的不是全部数据 当滚动到底部 继续获取新的数据
//            if (that.searchList.length < that.search_list_page[1] + this.size) {
//              return;
//            }
//            let page = [that.search_list_page[0], parseInt(that.search_list_page[1]) + this.size];
//            that.search_list_page = page;
            that.searchParams.page++;
            if(that.isMileage){
              that.mileageSearch();
            }else{
              that.getSearchList();
            }
          }
        });
//        that.$refs.getHightSpeedSorts();
        this.getTrafficLayer();
      },
      computed: {
        iconPitch: function () {
          return this.show3D ? this.iconPitch3d : this.iconPitch2d;
        }
      },
      methods: {
        _initMap: function () {
          minemap.domainUrl = mapConfig.BASE_URL;
          minemap.dataDomainUrl = mapConfig.DOMAIN_URL;
          minemap.spriteUrl = mapConfig.sprite;//mapConfig.BASE_URL + '/minemapapi/v2.0.0/sprite/sprite';
          minemap.serviceUrl = mapConfig.BASE_URL + '/service';
          minemap.accessToken = mapConfig[this.mapStyle].ACCESS_TOKEN;
          minemap.solution = mapConfig[this.mapStyle].SOLUTION;
//          minemap.domainUrl = 'http://117.157.231.168';
//          minemap.dataDomainUrl = '//datahive.minedata.cn';
//          minemap.spriteUrl = 'http://117.157.231.168/minemapapi/v2.0.0/sprite/sprite';
//          minemap.serviceUrl = 'http://117.157.231.168/service';
//          minemap.accessToken = 'f4d09d9c13824644af0ec21619253d5d';
//          minemap.solution = 4637;
          this.map = new minemap.Map({
            container: 'map',
            style: mapConfig.BASE_URL + "/service/solu/style/id/" + mapConfig[this.mapStyle].SOLUTION,
            center: mapConfig.DEFAULT_CENTER,
            zoom: mapConfig.DEFAULT_ZOOM,
            pitch: mapConfig.DEFAULT_PITCH,
            maxZoom: mapConfig.MAX_ZOOM,
            minZoom: mapConfig.MIN_ZOOM
          });
//          this.map.addControl(new minemap.Navigation(), "bottom-right");
          this.map.addControl(new minemap.Scale(),"bottom-left");
          this.map.resize();
          this.$store.state.map = this.map;
          this.mapLoading();
          this.map.on('zoom', this.setMileage);
          this.map.on("move", this.setCompassRotateIcon);
        },
        _removeMap: function () {
          this.map.remove()
          this.map = null
        },
        addImages: function () {
          // this.$axios.get(urlConf.BASE_URL + "/icons").then(response => {
          // }).catch(e => {
          // })
          let that = this;
          that.iconList = [];
          that.layerOptions.forEach(function (e) {
            if (e.data_type == 1) {
//                if(e.data_name=='里程桩'){
//                  that.iconList.push({id:'icon_1001',data:"data:image/png;base64,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"});
//                  that.iconList.push({id:'icon_1002',data:"data:image/png;base64,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"});
//                  that.iconList.push({id:'icon_1003',data:"data:image/png;base64,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"});
//                  that.iconList.push({id:'icon1_1_'+e.id,data:"data:image/png;base64,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"});
//                  that.iconList.push({id:'icon1_2_'+e.id,data:"data:image/png;base64,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"});
//                  that.iconList.push({id:'icon1_3_'+e.id,data:"data:image/png;base64,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"});
//                  //                  that.iconList.push({id:'icon_transparent',data:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAC4jAAAuIwF4pT92AAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA0LTI5VDE3OjE3OjA3KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTA0LTI5VDE3OjE3OjA3KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wNC0yOVQxNzoxNzowNyswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpkNWMwZGI0My0yYWQ2LTUzNGItOTBlYS01MTg3NDYyOGViYTAiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiYjRhY2M0Ni0yZWNhLTllNDctYjVkMS02NWJhNGZjNTM5MGUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4NmUzM2I2ZS1kOGI5LTViNGUtYmFmNS01MjMwYmI2NmJhMjEiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjg2ZTMzYjZlLWQ4YjktNWI0ZS1iYWY1LTUyMzBiYjY2YmEyMSIgc3RFdnQ6d2hlbj0iMjAxOS0wNC0yOVQxNzoxNzowNyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkNWMwZGI0My0yYWQ2LTUzNGItOTBlYS01MTg3NDYyOGViYTAiIHN0RXZ0OndoZW49IjIwMTktMDQtMjlUMTc6MTc6MDcrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6mtWS8AAAARElEQVRYhe3OMQHAIBAAsVL/nh8JDDfAkCjImpnvZf/twIlgJVgJVoKVYCVYCVaClWAlWAlWgpVgJVgJVoKVYCVYCVYbMpcDTXjbxtcAAAAASUVORK5CYII="});
//                }else{
//                  that.iconList.push({id:'icon_'+e.id,data:e.point_icon});
//                  that.iconList.push({id:'icon1_'+e.id,data:e.point_icon1});
//                };
//              if (e.data_name == '里程桩') {
//                that.iconList.push({
//                  id: 'icon_1001',
//                  data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAuCAYAAABEbmvDAAADh0lEQVRYhe2Yz4sURxTHP696dnd2zaqJbkIgoiCKsiDklkNy8GAuAQ/eNH+AEE8B8ZLF0wjiyYP4Cw8iXhSSnHI2ERLJxZDAeFByUUFWRJMVd9fZmS6pntdrbU310K0ODDhfKKq7purVp96rqq4asdYyO4dlCNRsII5CRDDDABTTQMA++xD27h5CsMlxOPMtnD4IWz56Mxu1shV3fVre6LbN3XzfLHyxHS7dhCt/QKs9ALAfj5Q36mu6Dt9/Dfs/h8OX4dH/7xjsl3/K1bMWNkzCVztfl92bh3M34OmLsr1VADt2vbzRrZu6YM+Xu2G8eguWV8q3rwRWRRM1+Pk2XPwV7j99MxsDAbs7D3M/vZ2N92uDfRcagVXVCKyqRmBVNQKrqhFYVY3Aqmrowf71ytwBuMK14a3kn2ufx8B+AP7T5wl3xA8aDUKLAcyZHrBmg2sKt6Sn2m+A3wbouZc68PzWeRE42QOmOgecAlKF+xL4fQBQLfXUBn13h/DjzQYLUbBmI/tjxVFf0KI6sAcoeXErLXc90SsxN4GjzQbzYePs3x5fs3OsB84DB7XYGforHIinvcH7jUgdq57aAWzXsr+BQ80Gd3qgRHrB6MLNAGeBAwPaUm4D3zUb/Bn7sRCsqHLBINYU3jkhkjfRPNpBv35L/z8m2lc2kkCR6okm0WS85zzltgr77Hvh9Rr6Xog9+xpTL1nPW+F7Lpv3EXowChYA+SDGy03B/JtUgDSS8vJQNpwqa8D6eMhoeIy2STSPDWwj0NHU9lLHS2ngTQm9uWq4AMp4MC65MI0HKdRm3dVXdIt4qXlLIcUDzGW7CG4t2tdgJaDG9Bta11BN6XM9AjbjAS3pN3HJs52HOLZqVz1X6xM+8UI2rkDrgA80TYFM9nLJJmAZ7KIOzHphXSG+aIpDGakYg6tnQCIKJ+t6W8q01rdY2/K2DryVmXrvQfNuVVOw0dn4c7b5JCBjiKkjptdjJplATKJ1Q2/liyH1FkBsG4l6zF8l6ZrVJS6XNiIdMr4kiYClpGkrm1c2XewePLOwLuvc6wRQUdUiQATulq5BcRM4QaTmvCKSTGFqUz2hMLUl6CzY1B087bPsiGPdArD5GSztB7Rqx4Uy8mnwF4J+YmQckTommcYkG8XUZshS8jEm+cTNKGznIWn7AZ32Y5u2n2A7C6Sp81gLa53Xi0LX97s6PAJeAT3BHa50DdE0AAAAAElFTkSuQmCC"
//                });
//                that.iconList.push({
//                  id: 'icon_1002',
//                  data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAuCAYAAABEbmvDAAADhUlEQVRYhe2Yz4scRRTHP696dnZ2N2t+mE0I6CnkEBa8KyLuOTcvEhXxIIKec8viaUJCIOBhE93gP5CLtxwUQkhCDl4UJRNU8OAPEEU3yUp2srMzXaF6Xs/W1lQP02FnGcJ84dHV1fXjU+9VVVe3WGtZXMYyBmrUEUchIphxAIrpmcCWTsJLB8cI7OVD8NlpWHkXZqqjg3KqDFOoWoH3X4MP34D5Wjfv+BFISgzrp792GezYflj9AI4v7My/9Ha5jhaXdxls7TFcvgEfL8GJo9v5d36BR023gsp1uGtgm234+h7c+hnee3U7nOevw2//jQZqKLBcT7bgy9vwzT346E2YHrrmiMFy/b4Gy1+NjKen52uD3QtNwMpqAlZWE7CymoCV1QSsrCZgZTX2YL96eY+B9h71v+Wl//cf5GBngYeangauB5VGoY0AZqUPrFHnmsI19VR7Crg1Qs9t6sAP6f1V4EIfmOpz4CKQKtzrwN0RQLXUU/v13h3UP23UWY+CNerZjxVHvapZ7tP2FeDHXQZbAw5r+jZwplHn77BQ9rfH1+IyLwBfAKe9hr4PB+JpKbi/GSlj1VMn3Ee85v0AvNOoc78PSqQfjC6c++6+Arw1oi3lO+CTRp1vYw8LwYoKFwxiR+b9c71v8/wa7WBQv0P/HxPtKxtJoEjxRE3UjJfOLW+rsM+BH7xeRd8LsbSvKfWS9bwV3ueyeR+hB6NgAZAPYryrKZh/MwqQRizPD2XDqbIDbICHjIbHaJ1Er7GBHQA6am3POp6lgTcl9Gav4QIo48E4c2GqBhbqsO7qW7pFbOq1pZDiAeayXQS3Fu022BBQU/oOrWmoZjVdi4AteEBNfSc2vbbzEMdWbc9zlQHhEy9kVQWaA/apzYLM9HPJi+6vFdgNHZj1wrpFfNEUhzJSMAZXy4BEFE7m+mvKvJa3WNvytg68lZl690H1blFTsNHZeDrbfBKQKcTUENPvMZNMIybRsqG38sWQegsgto1EPeavknTH6hJ3lTYiHTK+JImApaRpK5tXNt3oHjyzsD7RudcJoKKqRIAI3C3dBsVN4ASRivOKSDKLqcz2hcJUmtBZt6k7eNoH2RHHugVg8zNYOgio144LZeTV4C8EfcVIFZEaJpnHJAfEVBbILDmCSY66GYXt/Ena/oNO+x+btv/FdtZJU+exFtY6rxeFbuB7dXwEPAWYnBlQD/XRxwAAAABJRU5ErkJggg=="
//                });
//                that.iconList.push({
//                  id: 'icon_1003',
//                  data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAuCAYAAABEbmvDAAADzklEQVRYhe2YTYgcRRTHf696dnZ245posgmCIrhEkAXPKiruwZM3b1ERD6Lo2ZvB00jEk4d8mOAhBC9e9JSDgsREVLxElExAJYKJIDEadYP7MTvTJdX9eremprp3GjKwh/lD0dU19ap+9V5VddWItZbFw1h2gDptxFGICGYnAMVUC2zpIbj3rnoduPrObixg990N7x2Co8/DTLNeB66+s3P2rp1R1aiq12zAi4/By0/CXCsvW9ifJxmhA3/iPr0IjyzABxfgzNfQ7VXblk7+e3bDyZdgYX70UY6qKzfg1dPw+7+DBv7kL/XYzf/g2Ofw2hIcPLBV/uVP8MC8M96ewlr45QY88eBW2c/X4cS5vP0qlYKt9+DTS3D+R3jh0a1wHjkLv/41unfu35uD3VrLw/jhN7C2sb1d5Rxzco24Bj+7BK88BdPbWgzK1f/kIpz6Aq7eHN1ussHW1QSsriZgdTUBq6sJWF1NwOpqAlZXE7C6KsCueHbu0LvNVeG2yT/L3vIbLcDeBP7R/DRwNjAah1YCmKNDYJ02Hyncqh63nwHOj9Fz6zrw4qZ5CnhnCEx1AngXSBXuceCrMUB11VO79f1j4K1Om+UoWKednfsd9Uktclfch4EfbjOYu5Ls0/wF4I1Om+thpewy4mvxMHcC7wOHvIa+CwfiaSl4PxepY9VTB91lXsu+B57rtLk8BCUyDEYO5+7fx4Fnx7SlXARe77T5NvZjKVhZ5ZJBDBRefnvzjl48ox1U9Tvy9U20r2wkgSLVE02iyXj5IhVtlfZZea/2DH0vxPK+ptRL1vNW+F7IFn2EHoyCBUA+iPGepmT+zShAGklFeSgbTpUBsAoPGQ2PUZtEn7GB7QH6mnpe6nspDbwpoTc3Gy6BMh6MSy5MzSCF2qe7+oZuEev67CqkeICFbI7g1qLdAhsBakq/oS0N1azmWxGweQ9oVb+Jq17bRYhjq3bTc42K8IkXsqYC7QLu0DQLMjPMJXvdv1dgV3Rg1gvrBvFFUx7KSMUYXCsDElE42TVsKXNa32Jt19s68FZm6r0H5nlVU7LR2Xg+23wSkCnEtBAz7DGTTCMm0bqht4rFkHoLILaNRD3mr5J0YHWJe0oPkT4ZX5JEwFLStJvNK5uu5AfPLKxrOvf6AVRUjQgQgbslb1DcBE4QaTiviCSzmMbsUChMYxX6yzZ1B0/7d3bEsW4B2OIMllYBbbbjQhn5NPgLQT8x0kSkhUnmMMkeMY15spTsxyQH3IzC9n8j7V2j3/vDpr0/sf1l0tR5rIu1zutloav8ru4cAf8DcKFAeb8sQVAAAAAASUVORK5CYII="
//                });
//                that.iconList.push({
//                  id: 'icon1_1_' + e.id,
//                  data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAuCAYAAABEbmvDAAADn0lEQVRYhe2YuW8TQRTGvzfrOE5ihxASQCggEKEwBX8B4mjSIAGiA5mGDmo6JGoOQQXhaAlFKOhoQSAQogFxhIQiCClBCMgdJ44d7w6a9VszGc9a64CRJfxJTzM7nnnzmzfXrklKidGhpEQDKJ3JkqIgIohGALKpLmAtyZ1IbT/SeGAi1o6+g8PoO3Af8dSudfmIRa2Y6N4X2Wk81e+nqR3H0LH1EKZGrmFm7Cakm4/sI/LiT2eykZ3alJ8fw8Tj41hdmqzWR3nxR47YwpcHkeqpgTqtG5HcNlAuy8+NYOr9ZRRXfkYeSGSwr8/PRHYa7+xH8ugA3MI8pkeuY+bTIGQxF7l9TWC1iJxWzI3fw/SHqygsfl6Xj7qA5WdH8O3l2T/y8X8dsH9DTbBa1QSrVU2wWtUEq1VNsFrVBKtVDQ82rpUtASj+o/5Xtfyi/kMAdgHAHOdbATwyGtVDywbMjQqwdCY7zHA5fqtVX6tP6xi5PA+8m5/vArhUAca6BeAKAI/h9gN4UQeoAkdqAz8/BHAxnckuWMHSmaxk6jtclACgvnLf/WWwGQA9nH8G4Hw6k/1uVvI/eHWNDiU7AdwGcFJz9MYciKbDxvMTSx3JkdoDYDeXvQVwKp3JfqyAIqoEQwmuF8AggBN1OlJeAziXzmRf2X4MBQurHDKINYV7Ty9R0IRTawfV+o38/5iqGKRkyFLdYSM2oeUDC3yF9ln1g1drqEfBltfVwlGSWrTM50Ay6MOMoBXMANJBhJaKkPXXxgCexYJyU9JcKmvAqkRI8PQIbuNwahtYFwCXraiZq5lnRJPMaJYdh0AJDUaZmqa4YaZ6+FRf5SMiz2mBIUkDDCRLCGovyt9gEaBa+A5N8FS1cz5hAevVgHJ8J+Y038EU23ZtOXKxKtNH2pTFGagDQJKtHaC2Si7aBGAFkMs8MKlN6yrsmyZ8Ki0VbXAJH4iI4aijsiWluL6ElAXt6IC2Mz3t2WheqipCDjppz/uHjwNQC0gkQKIyYsJpBQmH65rRCjaDp20A2zFijZi+S7w1u4tUSkUQufD5HMcC5sHzCv66kt5y6cXTn9YVXnuuAWVVzAIEI9xUckhqATsgiqmoEDnt/h/6xrFEIpYD3AXpqRdPOeu/4ki1AWTwDuZVAyr7UVNpuRr0jcBXDMVBlIBwUhBOF4lYL3xzNkM4W9SKgnQn4RUn4BZ/SK84BekuwPNUxAqQUkU9bOqq3quNIwC/ANEaP+J4y6zxAAAAAElFTkSuQmCC"
//                });
//                that.iconList.push({
//                  id: 'icon1_2_' + e.id,
//                  data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAuCAYAAABEbmvDAAADp0lEQVRYhe2Yy2sTQRzHv7/ZJE3b1JY+9GALioiNVf8CH+i1N29K/AOsN58HwaOI4E18HaUeeqleRPAiCiKCKBa0FxV8U62tpGnTptkdmc1v63Qym2ZLt/SQL/zY2dl5fOY385udXZJSYnw4I7EBlM0VSFEQEcRGALJpVWBtfYNIZrZtHLBU23b0HryH3kMjEImW+KgAJOopRE4TOvtPoXvgDESq3c9rau8Hibqq+5qfGltbsGRrL/qOPPBBdG09cDdSR+PDmbUFK8//xuTYZXTvvYCmjoGl/MKPx3AXpv0IikMrgkl3AfnPo5j5/gidu4bQNXAaTqodE6/Oo5T/EAsU6l1jPmC5iD/vrmHmy3107Tnnr7s4Vf/qZZVmPuHni5OxQmG1+9h6qAEWVQ2wqGqARVUDLKoaYFHVAIuqBlhUBWAftXqz6kS9Tv0vaukZ/UEAdhHAX06ro+lDo1IcmjNgrleBZXOFEYYr8ql2EMDTGD23wAPv5Ps7AK5UgbFuArgKwGO4/QCexwBVYk+18/0ogEvZXCFvBcvmCpKpb3NWGsA+ANG+VFfWFIBuLvUMwNlsrjBh1vL/9ugaH85sAnALwDHOVg29MQei6bBx/8RSRrKndgLYwXlvARzP5grvq6CIqsFQgesBcAPA0Zi2lNcAhrK5wkvbw1CwsMIhg1iWufvEbPBpHlytHdTqt+7/Y8FvAH8khizFHTZiE1o6sKCt0D5rfvBqFXUv2NK6kuwlqXnLvA8kgz5MD1rBDCAdRGhXEbL+mhnAs1iQb0qaS2UZWA0PCZ4ewXUcvtoG1gHAZStr5mrmGd4k05tLDYdACQ1GmZqmlGGmunlXX+QtYoGvJYYkDTCQrCCoWJT/weqASvI7NM1T1cLptAWsRwMq8juxqLUdTLEtapc8l6gxfaRNWYqBWgFk2FoAaq7moi71ZxOQczwwqU3rIuxBEz6VloI2uLQPRMRw1Fpdk9q4vISUJW3rgBaZnnZvVK8UFSEbnbSn/c3HASgJEmmQqPaYcJpAwuGypreCYPC0ALBtI1aP6VHiLYsuUlcqg8iFz+c4FjAPnlfy15X05ioHT39a53ntuQaUVQkLEAx3U6VBUgvYAVFCeYXIaan87F++LZFIFAE3Lz118JTT/hFHqgCQwRnMqwW01I6aSsurQQ8EfsVQCkRpCKcNwukgkeiBb85mCGeLWlGQ7jd45a9wy7+kV56EdPPwPOWxEqRUXg+buprv1Y0jAP8AFFAvCIIg4OYAAAAASUVORK5CYII="
//                });
//                that.iconList.push({
//                  id: 'icon1_3_' + e.id,
//                  data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAuCAYAAABEbmvDAAAD/0lEQVRYhe2Yy28TRxzHv79Zv3DsJMoDEApVq4LABPoXIF4HLkhQ9Vbk/gP01gcckDgiHoIThMe14cAFeqmQOIBA4oBUFQFNAakgtdBKtEkaHCeOHe8OmvVvzXg8u3glXOXgrzTa2dnfb+Yzv3ns7JKUEk8mcxIrQIVimRQFEUGsBCCbYoHl1+9DMvdxrAaUvfLrClgq/wnGdlzB2M6rEIlsvAYSWd9P+at6OlUiyo6cNIY2f42R8W8hUgN+WXpgM9KDhc7JZGP65j86gL61uzA9dQazT89DutVIt9DJn+wbw/o9P/ogH1rVN0/x8tbnWF541VKzPvlDI1Zf+hfTj45jZNsRpAfHm+Xlv28i3b9JeXcUrWrpGXLr9jaLqnNTmH580q8/SqFgKtSlP65h/q8bGNp0CMPj38BJDeD1z4dRK/3ecQxT/RuQ278Xbu0NZqbOYvbZBGS98l6/yDnmA9YrmJk6g/k/r2N46/f+vIsjZT/3/AfM/HoatfkXHXv2Nti46oHFVQ8srnpgcdUDi6seWFz1wOKqBxZXAdhzzW9Bnaz/p/aXtfy8/iAAOwpgjvPqiPqT4dQNLRow59rACsXyVYar8HFbfaHe6WLkqtzxIb6/DOBEGxjrAoBTADyG2w7gXhegahypAb6/BuBYoVguWcEKxbJk6ktclAHwGYBHHxhsFsAI5+8C+K5QLL82jfyPEV1PJnP9AC4C+FKr6IHZEU27jfvbFhvJkdoI4FMuewjgYKFY/q0NiqgdDA24UQATAL7o0pbyC4BDhWL5vu1hKFiYcUgnWgq3fLUQfKIHV2sDUe12/PlG/DvA74khi7nDiTgJLR+koK7QNqP/9rxz1KNgy+tKcpSkFi3zPpAM2jAjaAUzgHQQoV1FyPxbxQCeJQXlpqQ5VVrAIiIkeHgE+zh8tXVsEIDLqa4lV0ueEU0yo9msOARKaDAqqWFKGcnUCO/qy7xFVPlaY0jSAAPJBoJai/IdWAdQSX6HZniospzPWMBGNaAKvxMrWt3BENtWbTNyiYjhI23IUgzUByDHKQvQqnYuGgawBMhF7pjUhnUZ9kUTPpQWQxtcxgciYjjqa/ekPNtLSFnTtg5oK9PT7g33hqkI2eikPe9vPg5ASZDIgER7xISTBgmHbc1oBYvB0xaAbRuxRkxfJV7L6iJ1pTqIXPh8jmMB8+B5NX9eSW+xcfD0h3WJ555rQFmVsADBCDc1KiQ1gR0QJVRUiJxs46d/67ZEIlEB3JL01MFT/ucfcaRaADI4g3lRQM161FBaXg36QuBXDKVAlIFw8hDOIInEKPzkrIZw1qgZBem+gld/Cbf+j/Tq05BuCZ6nIlaDlCrqYUMX+V5dOQLwFri2ZWeOvNLBAAAAAElFTkSuQmCC"
//                });
//                that.iconList.push({id:'icon_transparent',data:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAC4jAAAuIwF4pT92AAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA0LTI5VDE3OjE3OjA3KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTA0LTI5VDE3OjE3OjA3KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wNC0yOVQxNzoxNzowNyswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpkNWMwZGI0My0yYWQ2LTUzNGItOTBlYS01MTg3NDYyOGViYTAiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiYjRhY2M0Ni0yZWNhLTllNDctYjVkMS02NWJhNGZjNTM5MGUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4NmUzM2I2ZS1kOGI5LTViNGUtYmFmNS01MjMwYmI2NmJhMjEiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjg2ZTMzYjZlLWQ4YjktNWI0ZS1iYWY1LTUyMzBiYjY2YmEyMSIgc3RFdnQ6d2hlbj0iMjAxOS0wNC0yOVQxNzoxNzowNyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkNWMwZGI0My0yYWQ2LTUzNGItOTBlYS01MTg3NDYyOGViYTAiIHN0RXZ0OndoZW49IjIwMTktMDQtMjlUMTc6MTc6MDcrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6mtWS8AAAARElEQVRYhe3OMQHAIBAAsVL/nh8JDDfAkCjImpnvZf/twIlgJVgJVoKVYCVYCVaClWAlWAlWgpVgJVgJVoKVYCVYCVYbMpcDTXjbxtcAAAAASUVORK5CYII="});
//              } else {
                that.iconList.push({id: 'icon_' + e.id, data: e.point_icon});
                that.iconList.push({id: 'icon1_' + e.id, data: e.point_icon1});
//              };
            } else {
              that.addLineImage(e.data_name);
            }
          });
//          this.iconList = [
//            {id: "mileage_1",data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAACi1BMVEUAAAAAAADq04S/l0X////hyYCSWAGaZBCugCfBmkmxhDHLql++l0l/PgCSWAAAAACWXwucaBGKTgDXunf57LHq15u7kkXTtG21iDL//+rjyIK+lkvx3Iz/7n3+7IzbvXWSWAGgbBeWXwuWXwukcRyYYg/dvGr+5XD/52L/52Xz2HnBmEn//rZcFAAAAAByMQD//+zDmkf11WX93UvuzkX/4FjfvWGgbByodiOWXwuWXwuqeSWicCLgvFf/3kDy0zH/4TX21VTHnkkAAACGSwAAAAAAAACKUAAAAADJn0T30UD/3Bz/4x3/2ijmwFCseyu0hjCbZRKaZBGzhC2reyrkvEH+0hP+2Qn+1gn4zi3No0FpKgCUXQsAAACUXAxrLADKnjrzxCH5ygD50AH5yAbmuzeygy7EmDyqdyXAkzSwgCnhsC7xuATywADyvQDvuRbPoTWQWhKdZxaOWRDKmSznqhLpqwDpqQHhqiS4iCn//5WueyDWmxvflwHgmwDfmgjNmCSfaxmrcBfKfgfXjQLcnQPfpAPgqQPirQTksw3ksQnhrAPgqAPeogPbmQPViALGgA6kcBiaYAuuaQnCgxfMlyHOnCLOniLPnyLPnyHPnyHPnyLOnSLNmyLKkyC+fRSpZgiRXQ6YWgC4AADW5f/o6f/q6P/p5v/o5f/o5P/o5f/p5f/p5//q6f/m6f/M5/+pIQCXYxXbvD+OaxjCoin12B+UchrIqh/63g6lhRnVuRP/4gn61AH73AK8nhjgww782wD0yQD10ADdvRjsygn2zwD0xwDstADvvQDnvAKceAy9lwnwwgDtugDrsQDhnwDjpwDlrgDjsAW1jijJnhvnsgDlqwDjpAD///8RM0CAAAAAsnRSTlMAAAAAAAAAAAAAIYFZBgAAAAANrP/xTQAAAABd+f//vhIAAAAAF8f////7aAAAAAAAcf3////SIAAAAAAl2f////+EAAAAAAABiP/////jMwAAAAA05P////+iBwAAAAej//////JMAAAAS/L/////vRMAFLr////8bwBi+P///9kreP/////////////////vRR6Cqq6urq6urq6urq2nZwoAAAYLDAwMDAwMDAwKBQAAIOM0/QAAAAFiS0dE2AANR64AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfaBBoAAAC1VYTSAAABAklEQVQY02NgAAJGJmYWVjZ2Bjjg4OTi5uHl44fxBQSFhEVExcQlYAKSUtIysnLyCopKEL6yiqqauoamlraOLpivp29gaGS8ycTUzNzCEiRgZW1ja2e/eYuDo5OziysDg5u7h6eX99Zt2318/fwDAhkYgoJDQsPCd+zctTsiMio6JpYhLj4hMWnP3n37DySnpKalZzBkZmXn5B48dPjI0WN5+QWFRQzFJaVlx0+cPHX6zNlz5RWVVQzVNbXnL1y8dPnK1WvX6+obGhmamlta29o7Oru6e3r7+idMZJg0ecrUadNnzJw1e87cefMXLGRYtHjJ0mXLV6xctXrN2nXrN2wEAOgfWrUQl5aCAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTA0LTA5VDEwOjAwOjM5KzA4OjAwtIXxWgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0wNC0yNlQwMDowMDowMCswODowMKBVO10AAABDdEVYdHNvZnR3YXJlAC91c3IvbG9jYWwvaW1hZ2VtYWdpY2svc2hhcmUvZG9jL0ltYWdlTWFnaWNrLTcvL2luZGV4Lmh0bWy9tXkKAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA0OIdghy0AAAAWdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANDh/z0egAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADEyNzIyMTEyMDAJKQ3vAAAAEXRFWHRUaHVtYjo6U2l6ZQA1NDMzQs1NEM0AAABXdEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL3d3d3Jvb3Qvc2l0ZS93d3cuZWFzeWljb24ubmV0L2Nkbi1pbWcuZWFzeWljb24uY24vc3JjLzEvMTYxLnBuZ4TDksIAAAAASUVORK5CYII="},
//            {id: "mileage_2",data:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk2QkI4RkE3NjE2MTFFNUE4NEU4RkIxNjQ5MTYyRDgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk2QkI4Rjk3NjE2MTFFNUE4NEU4RkIxNjQ5MTYyRDgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjU2QTEyNzk3NjkyMTFFMzkxODk4RDkwQkY4Q0U0NzYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjU2QTEyN0E3NjkyMTFFMzkxODk4RDkwQkY4Q0U0NzYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5WHowqAAAXNElEQVR42uxda4xd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"},
//            {id: "mileage_3",data:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAuCAYAAABEbmvDAAADzklEQVRYhe2YTYgcRRTHf696dnZ245posgmCIrhEkAXPKiruwZM3b1ERD6Lo2ZvB00jEk4d8mOAhBC9e9JSDgsREVLxElExAJYKJIDEadYP7MTvTJdX9eremprp3GjKwh/lD0dU19ap+9V5VddWItZbFw1h2gDptxFGICGYnAMVUC2zpIbj3rnoduPrObixg990N7x2Co8/DTLNeB66+s3P2rp1R1aiq12zAi4/By0/CXCsvW9ifJxmhA3/iPr0IjyzABxfgzNfQ7VXblk7+e3bDyZdgYX70UY6qKzfg1dPw+7+DBv7kL/XYzf/g2Ofw2hIcPLBV/uVP8MC8M96ewlr45QY88eBW2c/X4cS5vP0qlYKt9+DTS3D+R3jh0a1wHjkLv/41unfu35uD3VrLw/jhN7C2sb1d5Rxzco24Bj+7BK88BdPbWgzK1f/kIpz6Aq7eHN1ussHW1QSsriZgdTUBq6sJWF1NwOpqAlZXE7C6KsCueHbu0LvNVeG2yT/L3vIbLcDeBP7R/DRwNjAah1YCmKNDYJ02Hyncqh63nwHOj9Fz6zrw4qZ5CnhnCEx1AngXSBXuceCrMUB11VO79f1j4K1Om+UoWKednfsd9Uktclfch4EfbjOYu5Ls0/wF4I1Om+thpewy4mvxMHcC7wOHvIa+CwfiaSl4PxepY9VTB91lXsu+B57rtLk8BCUyDEYO5+7fx4Fnx7SlXARe77T5NvZjKVhZ5ZJBDBRefnvzjl48ox1U9Tvy9U20r2wkgSLVE02iyXj5IhVtlfZZea/2DH0vxPK+ptRL1vNW+F7IFn2EHoyCBUA+iPGepmT+zShAGklFeSgbTpUBsAoPGQ2PUZtEn7GB7QH6mnpe6nspDbwpoTc3Gy6BMh6MSy5MzSCF2qe7+oZuEev67CqkeICFbI7g1qLdAhsBakq/oS0N1azmWxGweQ9oVb+Jq17bRYhjq3bTc42K8IkXsqYC7QLu0DQLMjPMJXvdv1dgV3Rg1gvrBvFFUx7KSMUYXCsDElE42TVsKXNa32Jt19s68FZm6r0H5nlVU7LR2Xg+23wSkCnEtBAz7DGTTCMm0bqht4rFkHoLILaNRD3mr5J0YHWJe0oPkT4ZX5JEwFLStJvNK5uu5AfPLKxrOvf6AVRUjQgQgbslb1DcBE4QaTiviCSzmMbsUChMYxX6yzZ1B0/7d3bEsW4B2OIMllYBbbbjQhn5NPgLQT8x0kSkhUnmMMkeMY15spTsxyQH3IzC9n8j7V2j3/vDpr0/sf1l0tR5rIu1zutloav8ru4cAf8DcKFAeb8sQVAAAAAASUVORK5CYII="}
//            ];
          this.iconList.forEach(icon => {
            this.map.loadImage(icon.data, function (error, image) {
              if (error) throw error;
              that.map.addImage(icon.id, image);
            });
          })
        },
        addLineImage(data_name){
          if (data_name.indexOf('隧道') != -1) {
            this.iconList.push({
              id: 'suidao',
              data: "data:image/png;base64,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"
            });
//                    that.iconList.push({id:'suidao',data:""}:
          };
          if (data_name.indexOf('桥梁') != -1) {
            this.iconList.push({
              id: 'qiaoliang',
              data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAFu0lEQVRYhdWYe1MTVxjGnyzZ3BPQICRCImChWKeOGautcQCnFpTepjPtONPLd9BvIH4D+x06dsbpH53ewHqpSptSOzXa6QhKFUzCnSAXQ0h2k+08pyyFsAioMPRlMuzZc/Z9fuc9l333mDRNw1osHIUTQAOA9wEcBRAA4Frh0ScA4gCuAfgGQGckhNSahACYTCasChaOQgJwMq8oX07HEpi414vpR3Fkp2eQy2YNnymyWGDxuOHZFcD2l2vhCVZCkuWPAVyIhJB/brBwFI3QtOvJnvsYvnkLM/EE1hrhxSLuQAV8hw7AW1/HG02REG48M1g4ilOZyalzsas3kLzbs24gIzHvK/UIvtkIa0nx6UgIn68bLBxF2+SDvjP9F68gnZx4LqBCs3u3o+r4MZTsrj4bCaFtzWDhKM4ku++39f3wI5TZ2RcKpZvscKD67RZ499S1RUI4awQmFUCdmnzY39bXfmnDoGj0TQ1qUdOozQJYOIqmzNTUuf6Oy1BSa17Zzw6XSoFa1KS2IVg4ClnL56/Frlx/4XPqaUYtalKbDMvAAHzE/SnZfX/ToHSjJrXJsAQsHIUtr6rnh3/7g+SbDkZNapOBLPp9M18v3MlnBgaXPfTup+/BF/BDtpi5VKBkFeFItlhgkkxQMlmxv1msFnBtZ+eykCQJslUW7dieZbNFFu1YHo4N4fvz3y3RoTYZSnZX81XXgfmh/GCip9cwWpm5LNKpWTjcTjjdTrGM6dxV7BLlXI7iKpweF1weF1RFgablRZ3T7UI2o0AqkkTZ4XIgnUojM5cxjBoZ1Lm59nAU2/SINU7H4oZhvvbtVdHjhtZGlFeWo7O9E8nhcRxuDqOsogwdFzoATUPjO01QFBW/dHSK6DV/2IKB/kHcvNoFX9Av2g88TODXyxHkV5guZEgNj6K4KrgfwE+M2K7M1LRhY0aHv1wuB1VRRURYzmayAoRDSSFeq1kF+Vxe1LFtNpOBoigLz6mquuDPyMjwZHCINYf0iNnzinHjmvoalPp3IPhSEK5iN15rPIj0bBo7qyrgcDpw5ESDGAZ/0C+g3mgOw2wugrfcC6vdJoaPw1zq2yEiyWEcHxpD372+ZVpkmEs+5mWtDmYypOL+1nJEgBWZi8T8qn21Dho0SCZJPLX3wF4xqTnctJLSEpj4J5ngcDlR6i9dKNscNnjLSzE2OGoIRmMqBaBSB1vR2Fuz/F8TCpgW9aOwLIAXKpeW2TH6YuRXMjWdZo13VTDOj9Usp+YWJjQjx+g+r89VwZ6Wg83OzGJkYAQj8WHMTIkhgLvEDV/Ah7KKcjG/1uvTbLfzX1IH01acZwZ3GaH4gxjudN3B6MCI2Jv0KHCo7E4HfJXl2Hd4PwI1AbGPreZTN6bjABI6WFqSZYfhyizsnAb0/tWLyMWfMTG2/GXPrYK/qYlJjI+M48jxBtTtq3u6z3mTZBk2r9hbxYuT3XlkLfYYN5aW9jb2IIauSxFDqEJLjiTRdTmCxMPEUp+FEZw3Mrh2+lm4qYPd8AQDho25xBc6qmnovnVXRGKtNjo4ip7b3Ut92qyGT5PB6Svj5W0d7Ovt9bUwSct7wsmdmkmJX/zvGJLrgNKNGyqjpvuhz0KjNhnMNltrJASxy5oO39KY9qS7v7iA6XhidaUNME+gEns+OwnJbLZHQpgTOT8vJLP5E9/rBwyjttFGTWqTgSy6nE7yFb+YvXvqNh2MmtQmw+L7AiwSgmKSpKPBY03iu2+zjFrUpDYZloHNw123FhefrjrxFmSnc8PRqEEtalK7sH7JpOJne0lNVVt1a7P4KN0wKH7wtjaDWisdFfx/jggWwW29Q5VFcFvvGGoR3NY7uCsAFEedajrdnhoZQ2pwCOnkYwE4n3mKfIpAdu82OHf64SzfwXutG3LUaQDI1HcfgIMAuCMzRxfp8HySx/cazxp+B/BnJPRv4rceI9jWNAD/AG9p/no4fHAXAAAAAElFTkSuQmCC"
            });
//                    that.iconList.push({id:'suidao',data:""}:
          }
        },
        changeInput: function (value) {
          this.POISearch.road = value;
          if (this.POISearch.road == "") {
            document.getElementById("layer-search-list").style.display = "none";
          };
          this.searchList.length=0;
          this.searchParams={page:1,limit:10};
          this.getSearchList();
        },
        mapLoading: function () {
          let that = this
          this.map.on('load', function () {
            that.addImages();
            that.addSourceLayers();
            that.map.on('click', that.clickLayer);
            that.map.on('dblclick',that.dbclickLayer);
            that.map.on('mousemove', that.overLayer);
            that.showLayers(that.id);
            that.initPopup();
//            this.getTrafficLayer();
            that.showTraffic();
          })
        },
        prepareLayerOptions: function () {
          let that = this;
          that.layerOptions = [];
          conf.interf.LAYER_LIST_API({
            keyword: "",
            searchtype: 0,
            display: 1,
            userId: sessionStorage.getItem('userId')
          }).then((response) => {
            if (response.status == 200) {
              let data = response.data
              if (data.errcode == 0) {
                that.layerOptions = data.data;
                that.setLayerId();
                that._initMap();
              } else {
                that.$message({message: data.errmsg, type: "error", duration: 1500});
              }
            }
          }).catch(e => {
            console.error(e);
          }).finally(() => {
            that.tableLoading = false;
          })
        },
        setLayerId(){
          let that = this;
          that.id = that.layerOptions[0].id;
          that.checkedType = that.layerOptions[0].data_type;
          that.checkedLayerName = that.layerOptions[0].layer_name;
        },
        showLayers: function (id) {
          let that = this;
          that.clearMap();
          that.POISearch.road = '';
          that.Mileage = {
            road: '',
            dir: '',
            num: ''
          };
          that.isQuery=false;
          document.getElementById("layer-search-list").style.display = "none";
          this.classChange(id,"layer-item","layer-item-checked")
          document.getElementById("layer-search-div").style.display = 'block';
          this.layerOptions.forEach((v, i) => {
            if (v.id == id) {
              if (that.map.getLayer("layer_" + v.id) != undefined) {
                that.map.setLayoutProperty("layer_" + v.id, 'visibility', 'visible');
                that.checkedType = v.data_type;
                that.checkedTableName = v.table_name;
                that.checkedLayerName = v.layer_name;
                that.icon = v.icon1 == undefined ? 'icon_1' : v.icon1;
                that.line_color = v.line_color1 == undefined ? '#c535af' : v.line_color1;
              };
              that.isMileage = that.checkedTableName.indexOf('xwt_layer_mileage') != -1 ? true : false;
//              that.$refs.statics.showStatics();
              that._offset = that.checkedType == 1 ? [-1, -25] : [-1, -15];
              that._offset=that.isMileage?[-1, -42]:that._offset;
              that.initPopup();
              if (that.checkedLayerName.indexOf('隧道') != -1) {
                if (that.map.getLayer("layer_suidao_" + v.id) != undefined) {
                  that.map.setLayoutProperty("layer_suidao_" + v.id, 'visibility', 'visible');
                }
              }
              if (that.checkedLayerName.indexOf('桥梁') != -1) {
                if (that.map.getLayer("layer_qiaoliang_" + v.id) != undefined) {
                  that.map.setLayoutProperty("layer_qiaoliang_" + v.id, 'visibility', 'visible');
                }
              }
            } else {
              if (that.map.getLayer("layer_" + v.id) != undefined) {
                that.map.setLayoutProperty("layer_" + v.id, 'visibility', 'none');
              }
              if (that.map.getLayer("layer_symbol_" + v.id) != undefined) {
                that.map.setLayoutProperty("layer_symbol_" + v.id, 'visibility', 'none');
              }
              if (that.map.getLayer("layer_suidao_" + v.id) != undefined) {
                that.map.setLayoutProperty("layer_suidao_" + v.id, 'visibility', 'none');
              }
              if (that.map.getLayer("layer_qiaoliang_" + v.id) != undefined) {
                that.map.setLayoutProperty("layer_qiaoliang_" + v.id, 'visibility', 'none');
              }
            }
          });
          this.visibleId = id;
          this.POISearch.road = '';
          that.initMapDefault();
          that.setMileage();
        },
        classChange(id, baseName, addName) {
          this.removeClassName(baseName, addName)
          this.addClassName(id, baseName, addName)
        },
        styleChange(value){
            console.log(value);
          let active_li=document.getElementById('map-style-button').getElementsByTagName("ul")[0].getElementsByTagName("li")[value];
          active_li.setAttribute('index',0);
          let no_active_li=document.getElementById('map-style-button').getElementsByTagName("ul")[0].getElementsByTagName("li")[value==0?1:0];
          no_active_li.setAttribute('index',1);
          no_active_li.classList.remove('active');
          active_li.classList.add('active');
          document.getElementById('map-style-button').getElementsByTagName("ul")[0].innerHTML = "";
          document.getElementById('map-style-button').getElementsByTagName("ul")[0].appendChild(active_li);
          document.getElementById('map-style-button').getElementsByTagName("ul")[0].appendChild(no_active_li);
        },
        addClassName(id, baseName, addName) {
          let els = document.getElementsByClassName(baseName)
          for (var i = 0; i < els.length; i++) {
            if (els.item(i).getAttribute("data-id") == id) {
              els.item(i).className += " " + addName
            }
          }
        },
        removeClassName(baseName, addName) {
          let els = document.getElementsByClassName(baseName)
          for (var i = 0; i < els.length; i++) {
            els.item(i).className = els.item(i).className.replace(" " + addName, "")
          }
        },
        uncheckedLayer() {
          let that = this;
          this.showMainLayer(true);
          if (this.map.getLayer("cSymbol") != undefined) {
            this.map.setLayoutProperty("cSymbol", "visibility", "none");
          }
          ;
          if (this.map.getLayer("cLine") != undefined) {
            this.map.setLayoutProperty("cLine", "visibility", "none");
          };
          if (that.covers.lines.length > 0) {
            that.covers.lines.forEach(e => {
              if (that.map.getLayer(e) != undefined) {
                that.map.removeLayer(e);
              }
            })
          };
          if (this.map.getLayer("cFill") != undefined) {
            this.map.setLayoutProperty("cFill", "visibility", "none");
          };
          this.map.setFilter("layer_" + this.id,['has','id']);
        },
        clickLayer: function (e) {
          let renderLayerIds = [], features, feature = null;
          if (this.checkedLayerName.indexOf('隧道') != -1) {
            renderLayerIds = ["layer_suidao_" + this.visibleId];
            features = this.map.queryRenderedFeatures(e.point, {
              layers: renderLayerIds
            });
            if (!features || features.length < 0) {
              renderLayerIds = ["layer_" + this.visibleId];
              features = this.map.queryRenderedFeatures(e.point, {
                layers: renderLayerIds
              });
            }
          }else if (this.checkedLayerName.indexOf('桥梁') != -1) {
              renderLayerIds = ["layer_qiaoliang_" + this.visibleId];
              features = this.map.queryRenderedFeatures(e.point, {
                layers: renderLayerIds
              });
              if (!features || features.length < 0) {
                renderLayerIds = ["layer_" + this.visibleId];
                features = this.map.queryRenderedFeatures(e.point, {
                  layers: renderLayerIds
                });
              }
            }else{
            renderLayerIds = ["layer_" + this.visibleId];
            features = this.map.queryRenderedFeatures(e.point, {
              layers: renderLayerIds
            });
          }

          if (features && features.length > 0) {
            feature = features[0];
            if (feature) {
              if (feature.properties.name != undefined || feature.properties.roadno || feature.properties.road_num) {
                feature.city = feature.properties.city;
                feature.citys = feature.properties.citys;
                feature.length = feature.properties.length;
                feature.lengths = feature.properties.length;
                feature.name=feature.properties.roadno?feature.properties.roadno:feature.properties.name;
                this.checkedLayer(feature,true);
              };
            }
          }else{
            this.$refs.tool.handleToolEvent(e);
          }
        },
        dbclickLayer(){
          this.initMapDefault();
        },
        checkedLayer(feature,isClick){
          let that = this;
          this.uncheckedLayer();
          this.showMainLayer(false);
          let _id = (feature.properties.id instanceof Array) ? feature.properties.id[0] : feature.properties.id;
          if (feature.properties.idlist) {
            _id = feature.properties.idlist.split(',')[0];
          };
//          this.$axios.get(conf.interf.LAYER_INFO,{params: {
//            id: _id,
//            tablename: this.checkedTableName,
//            token: this.token,
//            _t:new Date().getTime()
//          }}).then(response => {
          conf.interf.LAYER_INFO_API({id: _id, tablename: this.checkedTableName}).then((response) => {
            if (response.status == 200) {
              let data = response.data;
              if (data.errcode == 0) {
                if (data.data.length < 1) {
                  that.$message({message: "查询失败\r\nErrCode: 查询为空", type: "error", duration: 1500});
                  return;
                };
                let wktItem = data.data[0].geometry.split(";");
//                    feature.properties=data.data[0];
                let center = [], type = '';
                if (that.checkedTableName.indexOf("xwt_layer_mileage") != -1) { //单独处理里程桩图层
                  type = "POINT";
                  center = data.data[0].geometry.split(' ');
                } else {
                  type = wktItem[1].split('(')[0].replace(/\s/g, '');
                };
                if (type == "POINT") {
                  if (that.checkedTableName.indexOf("xwt_layer_mileage") == -1) {
                    center = that.matchLnglat(wktItem[1])[0].split(' ');
                  } else {
                    //do nothing
                  };
                  that.map.flyTo({
                    center: center,//feature.geometry.coordinates,//e.lngLat,//
                    zoom: 14,
//                    duration: 3000,
                    speed:0.8
                  })
                } else {
                  center = data.data[0].center.split(' ');//wktItem[1].split('(')[1].split(',')[0].split(' ');
                  that.map.setCenter(center);
                  if (type == "LINESTRING") {
                      if(feature.name){data.data[0].name=feature.name};
                      data.data[0].length = feature.length == undefined ? data.data[0].length : feature.length;
                      data.data[0].city = feature.city;
  //                      utils.viewFitBounds(that.map,feature);
                  }
                  if (this.checkedLayerName.indexOf('隧道') != -1) {
                    if (feature.geometry) {
                      center = feature.geometry.coordinates;//wktItem[1].split('(')[1].split(',')[0].split(' ');
                      data.data[0].name = feature.properties.name;
                    };
                  };
                };
                that.showCheckedLayer(feature,isClick);//高亮显示选中的元素//
                that.addPopup(data.data[0], center);
                if (type == "LINESTRING") {
                  if (feature.leftRight) {
                    that.fitBounds(feature.leftRight);
                  } else {
                    utils.viewFitBounds(that.map, [feature]);
                  }
                }
              } else {
//                that.$message({message: data.errmsg, type: "error",duration: 1500});
              }
            } else {
//              that.$message({message: "查询失败\r\nErrCode: " + response.status, type: "error",duration: 1500});
            }
          }).catch(e => {
            console.error(e)
//            that.$message({message: "查询失败", type: "error",duration: 1500});
          })
        },
        showCheckedLayer: function (feature,isClick) {
          let that = this;
          that.isShowPopup=false;
          document.getElementById("layer-search-list").style.display = "none";
          if (this.checkedType == "1") {
//            this.map.setLayoutProperty("cSymbol", "visibility", "visible");
//            this.map.setLayoutProperty("cSymbol", "icon-image", this.icon);
            if (this.map.getLayer("cSymbol") != undefined) {
              this.map.removeLayer("cSymbol");
            };
            let icon = 'icon1_' + that.id, position = 'position',offset=[0,0];
            if (that.isMileage) {
              icon = 'mileage_hover_' + feature.properties.direction;
              offset=[0,-20];
            } else {
              feature.properties.mileagenum = '';
              feature.properties.road_num = '';
            }
            this.map.addLayer({
              id: "cSymbol",
              type: "symbol",
              "source": "source_" + that.id,
              "source-layer": position,
              "layout": {
                "icon-image": icon,
                'visibility': 'visible',
                "icon-size": 1,
                "text-field": '' + feature.properties.mileagenum + '\n' + feature.properties.road_num,
                "text-offset": [-0.2, -3.35],
                "text-anchor": "top",
                "icon-allow-overlap": true,  //图标允许压盖
                "text-allow-overlap": true,   //图标覆盖文字允许压盖
                "text-size": 11,
                'symbol-avoid-edges':true,
                'icon-offset':offset
              },
              "paint": {"text-color": 'white'},
              minzoom: 3,
              maxzoom: 17
            });
            if(feature.properties.id instanceof Array){
              this.map.setFilter('cSymbol', ['==', 'name', feature.name]);
            }else{
              this.map.setFilter('cSymbol', ['==', 'id', feature.properties.id]);
            }
          } else if (this.checkedType == "2") {
           that.addHighLine(feature,isClick);
          } else if (this.checkedType == "3") {
//            this.map.setLayoutProperty("cFill", "visibility", "visible")
            if (this.map.getLayer("cFill") != undefined) {
              this.map.removeLayer("cFill");
            };
            this.map.addLayer({
              'id': "cFill",
              'type': 'fill',
              'source': "source_" + that.id,
              "source-layer": "position",
              'layout': {
                'visibility': 'visible',
              },
              'paint': {
                'fill-color': '#5afcff',
                'fill-opacity': .9
              },
              minzoom: 3,
              maxzoom: 17
            });
            this.map.setFilter('cFill', ['==', 'id', feature.properties.id]);
          }


        },
        addHighLine(feature,isClick){
            let that=this;
          if (this.map.getLayer("cLine") != undefined) {
            this.map.removeLayer("cLine");
          };
          let addHightLine = function (cellId) {
            let layer={
              "id": "cLine",
              "type": "line",
              "source": "source_" + that.id,
              "source-layer": "position",
              "layout": {
                "line-join": "round",
                "line-cap": "round",
                'visibility': 'visible',
              },
//                  "filter": ["in", "id", ...cellId],
              "filter": ["all",...cellId],
              "paint": {
                "line-color": that.line_color,
                "line-width": 6
              },
              minzoom: 3,
              maxzoom: 17
            }
            if (that.map.getLayer('layer_suidao_' + that.id) != undefined) {
              that.map.addLayer(layer, 'layer_suidao_' + that.id);
            } else {
              if (that.map.getLayer('layer_qiaoliang_' + that.id) != undefined) {
                that.map.addLayer(layer, 'layer_qiaoliang_' + that.id);
              }else{
                that.map.addLayer(layer,mapConfig[that.mapStyle].ROAD_LAYER_ID);
              }
            };
//              that.covers.lines.push("cLine");
          };
          let filters=[];
          if ((this.checkedLayerName.indexOf('隧道') != -1 && feature.properties.idlist) || (this.checkedLayerName.indexOf('桥梁') != -1 && feature.properties.idlist)) {
//              feature.properties.id = feature.properties.idlist.split(',').map(e => {
//                return e;
//              });
            filters.push(['==',"name", feature.name?feature.name:feature.properties.name]);
          }else{
//                if(isClick){ //点击道路
//                  filters.push(['==',"id", feature.properties.id]);
//                }else{
            if(/[\u4E00-\u9FA5]/g.test(feature.name ? feature.name : feature.properties.name)) {
              filters.push(['==', "name", feature.name ? feature.name : feature.properties.name]);
            }else{
              filters.push(['==', "roadno", feature.name ? feature.name : feature.properties.name])
            }
            if(!isClick) {
              if(feature.city || feature.properties.city) filters.push( ['==', 'city', feature.city ? feature.city : feature.properties.city]);
            }
//                }

          };
          addHightLine(filters);
//            if (!(feature.properties.id instanceof Array)) {
//              addHightLine([feature.properties.id]);
//            } else {
//              addHightLine(feature.properties.id);
//            };
        },
        fitBounds(bbox){
          let _this = this;
//          setTimeout(function(){
//            let featureList=_this.map.queryRenderedFeatures({layers:["cLine"]});
//            if(featureList && featureList.length>0){// && featureList.length==num
//              utils.viewFitBounds(_this.map,featureList);
//            }else{
//              _this.fitBounds(num);
//            }
//          },1000);
          let left = bbox.Left_lower.split(' '), right = bbox.Right_upper.split(' ');
          this.map.fitBounds([[left[0], left[1]], [right[0], right[1]]], {padding: 30});
        },
        //是否显示主图层
        showMainLayer(flag){
          if (this.checkedLayerName.indexOf('隧道') != -1 || this.checkedLayerName.indexOf('桥梁') != -1) {
            return;
          }
          if (flag) {
            if (this.map.getLayer("layer_" + this.id) != undefined) {
              this.map.setLayoutProperty("layer_" + this.id, 'visibility', 'visible');
            }
          } else {
            if (this.map.getLayer("layer_" + this.id) != undefined) {
              this.map.setLayoutProperty("layer_" + this.id, 'visibility', 'none');
            }
          }
        },
        overLayer(e) {
//            if(this.visibleId==17) return;
//          if(this.checkedLayerName.indexOf('里程桩')!=-1) return;
          let renderLayerIds = ["layer_" + this.visibleId];
          let features = this.map.queryRenderedFeatures(e.point, {
            layers: renderLayerIds
          })
          let feature = null
          if (features && features.length > 0) {
            feature = features[0]
            if (feature) {
              this.map.getCanvas().style.cursor = 'pointer';
            } else {
              this.map.getCanvas().style.cursor = this.$store.state.cursor;
            }
          } else {
            renderLayerIds = ["layer_suidao_" + this.visibleId];
            features = this.map.queryRenderedFeatures(e.point, {
              layers: renderLayerIds
            });
            if (features && features.length > 0) {
              feature = features[0]
              if (feature) {
                this.map.getCanvas().style.cursor = 'pointer';
              } else {
                this.map.getCanvas().style.cursor = this.$store.state.cursor;
              }
            }else{
              this.map.getCanvas().style.cursor = this.$store.state.cursor;
            }
          }
        },
        addSourceLayers() {
          let that = this;
          for (let i = this.layerOptions.length - 1; i >= 0; i--) {
            let option = this.layerOptions[i];
            option.line_width = option.line_width == undefined ? 4 : option.line_width;
            this.map.addSource("source_" + option.id, {
              type: "vector",
              tiles: [conf.interf.TILE_URL + "?name=" + option.table_name + "&token=" + that.token]
            });
            if (option.data_name.indexOf('里程桩') != -1) {
              that.showMileage(option.id);
              continue;
            };
            if (option.data_type == 1) {
              let isAllowOverlap = that.getOverAllow(option.data_name);
//              console.log('压盖：' + isAllowOverlap)
              this.map.addLayer({
                "id": "layer_" + option.id,
                "type": "symbol",
                "source": "source_" + option.id,
                "source-layer": "position",
                "layout": {
                  "icon-image": 'icon_' + option.id,
                  "icon-allow-overlap": isAllowOverlap,
                  "text-allow-overlap": true,
                  'visibility': (this.visibleId == option.id) ? 'visible' : 'none',
                },
                "paint": {},
                minzoom: option.min_scale,
                maxzoom: option.max_scale
              })
            } else if (option.data_type == 2) {
              this.map.addLayer({
                "id": "layer_" + option.id,
                "type": "line",
                "source": "source_" + option.id,
                "source-layer": "position",
                "layout": {
                  "line-join": "round",
                  "line-cap": "round",
                  'visibility': (this.visibleId == option.id) ? 'visible' : 'none',
                },
                "paint": {
                  "line-color": option.line_color,
                  "line-width": option.line_width,
                  // "line-dasharray":[5,5],//实线、虚线，
                },
                minzoom: option.min_scale,
                maxzoom: option.max_scale
              },mapConfig[this.mapStyle].ROAD_LAYER_ID);
              if (option.data_name.indexOf('隧道') != -1) {
                this.addSuidaoLayer(option);
                continue;
              };
              if (option.data_name.indexOf('桥梁') != -1) {
                this.addQiaoliangLayer(option);
                continue;
              };
            } else if (option.data_type == 3) {
              this.map.addLayer({
                'id': "layer_" + option.id,
                'type': 'fill',
                'source': "source_" + option.id,
                "source-layer": "position",
                'layout': {
                  'visibility': (this.visibleId == option.id) ? 'visible' : 'none',
                },
                'paint': {
                  'fill-color': option.polygon_color,
                  'fill-opacity': option.polygon_opacity,
                  // 'fill-outline-color': option.polygon_outline_color
                },
                minzoom: option.min_scale,
                maxzoom: option.max_scale
              })
            }
          }
        },
        getTrafficLayer(){
            let that=this;
            conf.interf.TRAFFIC_API(mapConfig.MAP_TRAFFIC_URL+mapConfig[that.mapStyle].SOLUTION+'?token='+mapConfig[that.mapStyle].ACCESS_TOKEN,{}).then((res) => {
                let data=res.data;
              if(data.data.rows[0].layers){
                let arr = data.data.rows[0].layers;
                let idarr = [];
                for (let i = 0; i < arr.length; i++) {
                  let content = JSON.parse(arr[i].content || '{}')
                  if (content['source'] == 'Traffic'  && content['source-layer'] == 'Trafficrtic') {
                      that.trafficArr.push(arr[i].id)
//                    that.map.setLayoutProperty(arr[i].id, 'visibility', 'none');
                  };
                  if(content['source'] == 'DynamicTraffic' && content['source-layer'] == 'link'){
                       that.trafficParticleIds.push(arr[i].id);
//                    that.map.setLayoutProperty(arr[i].id, 'visibility', 'none');
                  }
                }
              }
            });
        },
        showTraffic(){
          let that = this;
          that.isShowRoute=true;
          if(that.trafficArr.length>0){
            for (let i = 0; i < that.trafficArr.length; i++) {
              if(that.map.getLayer(that.trafficArr[i])) {
                that.map.setLayoutProperty(that.trafficArr[i], 'visibility', 'visible');
//                  that.map.setLayoutProperty(that.trafficArr[i], 'line-cap', 'butt');
//                  that.map.setLayoutProperty(that.trafficArr[i], 'line-round-limit', '2');
//                that.map.setLayoutProperty(that.trafficArr[i], 'line-miter-limit', '3');
//                that.map.setLayoutProperty(that.trafficArr[i], 'strokeStyle', '');
              }
            }
          }
        },
        addSuidaoLayer(option){
          this.map.addSource("source_suidao_" + option.id, {
            type: "vector",
            tiles: [conf.interf.TILE_URL + "?name=xwt_layer_tunnel_bat&token=" + this.token]
          });
          this.map.addLayer({
            "id": "layer_suidao_" + option.id,
            "type": "symbol",
            "source": "source_suidao_" + option.id,
            "source-layer": "position",
            "layout": {
              "icon-image": 'suidao',
              'icon-size':0.6,
              "icon-allow-overlap": true,
              "text-allow-overlap": true,
              'visibility': (this.visibleId == option.id) ? 'visible' : 'visible',
            },
            "paint": {},
            minzoom: option.min_scale,
            maxzoom: option.max_scale
          })
        },
        addQiaoliangLayer(option){
          this.map.addSource("source_qiaoliang_" + option.id, {
            type: "vector",
            tiles: [conf.interf.TILE_URL + "?name=xwt_layer_bridge_bat&token=" + this.token]
          });
          this.map.addLayer({
            "id": "layer_qiaoliang_" + option.id,
            "type": "symbol",
            "source": "source_qiaoliang_" + option.id,
            "source-layer": "position",
            "layout": {
              "icon-image": 'qiaoliang',
              'icon-size':0.6,
              "icon-allow-overlap": true,
              "text-allow-overlap": true,
              'visibility': (this.visibleId == option.id) ? 'visible' : 'visible',
            },
            "paint": {},
            minzoom: option.min_scale,
            maxzoom: option.max_scale
          })
        },
        getOverAllow(name){
          if (name.indexOf('气象') != -1 || name.indexOf('港口') != -1) {
            return true;
          } else {
            return false;
          }
        },
        changeSource: function (id) {
          this.map.removeSource("source_" + id)
          this.map.addSource("source_" + id, {
            type: "vector",
            tiles: [conf.interf.TILE_URL + "?id=" + id]
          })
        },
        showStyleDiv: function () {
          let el = document.getElementById("map-style-div");
          if (el.style.display != 'block') {
            el.style.display = "block"
          } else {
            el.style.display = "none"
          }
        },
        changeMapStyle: function (value,el) {
            if(value!=this.mapIcon.index){
              this.mapIcon.index = value;//this.mapIcon.index == 0 ? 1 : 0;
              let style = this.mapIcon.index == 0 ? 'LIGHT' : 'DARK';
//              this.classChange(style, "map-style-item", "map-style-item-checked");
              this.styleChange(el.target.getAttribute('index'));
              mapConfig.DEFAULT_CENTER = this.map.getCenter()
              mapConfig.DEFAULT_PITCH = this.map.getPitch()
              mapConfig.DEFAULT_ZOOM = this.map.getZoom()
              this.mapStyle = style;
              this._removeMap();
              this._initMap();
              document.getElementById("map-style-div").style.display = "none";
              this.clearEdit();
            }

        },
//        exportExcel(tabName){
//          //导出数据
//          let that = this;
////          this.$axios.get(conf.interf.EXPORT, {
////            params: {
////              tablename: that.checkedTableName,
////              type: that.checkedType,
////              token: that.token
////            }
////          }).then(response => {
//////              conf.interf.EXPORT({
//////                tablename: that.checkedTableName,
//////                type: that.checkedType,
//////                token: that.token
//////              }).then((response) => {
////              if (response.status == 200) {
////                let data = response.data;
////                if (response.status == 200) {
////                  that.$message({message: "导出成功", type: "success",duration: 1000});
////                }
////              }
////            });
//
//          window.location.href = conf.interf.EXPORT + '?tablename=' + that.checkedTableName + '&type=' + that.checkedType + '&token=' + that.token;
//        },
        exportQueryExcel(){
          //导出数据
          let dir=this.POISearch.dir=='上行'?'1':(this.POISearch.dir=='下行'?'2':(this.POISearch.dir=='双向'?'0':this.POISearch.dir));
          window.location.href = conf.interf.QUERY_EXPORT + '?tablename=' + this.checkedTableName + '&keyword=' + this.POISearch.road+ '&direction='+dir+'&mileagenum='+this.POISearch.num+'&token=' + this.token;
        },
        matchLnglat(geo){
          let regex1 = /[^\(\)]+(?=\))/g;
          return geo.match(regex1);
        },
//        createLine (map, id, geometry, isShow, lineColor, lineWidth, isShowArrow, lineArray, lineOpacity) {
//          //添加源数据
//          map.addSource("ls_" + id, {
//            "type": "geojson",
//            "data": {
//              "type": "Feature",
//              "properties": {},
//              "geometry": geometry
//            }
//          });
//          // console.log(that.map.getSource(sourceid));
//          let vy = "visible";
//          if (typeof isShow === "boolean" && !isShow) {
//            vy = "none";
//          }
//          if (typeof lineColor === "undefined" || lineColor == null || lineColor == "") lineColor = "#FF0000";
//          if (typeof lineWidth === "undefined" || lineWidth == null || lineWidth == "") lineWidth = 6;
//          if (typeof lineOpacity === "undefined" || lineOpacity == null || lineOpacity == "") lineOpacity = 1;
//          //添加线图层
//          map.addLayer({
//            "id": "line_" + id,
//            "type": "line",
//            "source": "ls_" + id,
//            "layout": {
//              "line-join": "round",
//              "line-cap": "round",
//              "visibility": vy
//            },
//            "paint": {
//              "line-color": lineColor,
//              "line-width": lineWidth,
//              "line-opacity": lineOpacity
//            }
//          });
//          //添加箭头
//          if (typeof isShowArrow === "boolean" && isShowArrow) {
//            map.addLayer({
//              "id": "arrow_" + id,
//              "type": "symbol",
//              "source": "ls_" + id,
//              "layout": {
//                "symbol-placement": "line",
//                "icon-allow-overlap": true,
//                "icon-image": "icon-map-vehicle-direction",//指定箭头图标
//                "text-field": "{title}",
//                "text-offset": [0, 0.6],
//                "text-anchor": "top",
//                "visibility": vy
//              },
//              "paint": {
//                "icon-color": "#ff0000"
//              }
//            });
//          }
//          if (lineArray) lineArray.push(id);
//        },
//        createPolygon (map, id, geometry, properties, isShow, fillColor, fillOpacity, fillOutlineColor, isShowTitle) {
//          if (typeof properties !== "object") properties = {};
//          //添加源数据
//          map.addSource("fs_" + id, {
//            "type": "geojson",
//            "data": {
//              "type": "Feature",
//              "properties": properties,
//              "geometry": geometry
//            }
//          });
//          let vy = "visible";
//          if (typeof isShow === "boolean" && !isShow) {
//            vy = "none";
//          }
//          if (typeof fillOutlineColor === "undefined" || fillOutlineColor == null || fillOutlineColor == "") fillOutlineColor = "#FF0000";
//          if (typeof fillColor === "undefined" || fillColor == null || fillColor == "") fillColor = "#FF0000";
//          if (typeof fillOpacity === "undefined" || fillOpacity == null || fillOpacity == "") fillOpacity = 1;
//          //添加多边形图层
//          map.addLayer({
//            "id": "polygon_" + id,
//            "type": "fill",
//            "source": "fs_" + id,
//            "layout": {
//              "visibility": vy
//            },
//            "paint": {
//              "fill-outline-color": fillOutlineColor,
//              "fill-color": fillColor,
//              "fill-opacity": fillOpacity
//            }
//          });
//          if (typeof isShowTitle === "boolean" && isShowTitle) {
//            /**
//             * 多边形的名称显示
//             */
//            map.addLayer({
//              "id": "pn_" + id,
//              "type": "symbol",
//              "source": "fs_" + id,
//              "layout": {
//                "icon-image": "{icon}",
//                "text-field": "{title}",
//                "text-offset": [0, -0.6],
//                "text-anchor": "top"
//              },
//              "paint": {
//                "icon-color": "#fff",
//                "text-color": "#fff"
//              }
//            });
//          }
//        },
        addPopup(item, lnglat, flag){
          let that = this;
          if (item && this.id == 17) {
            item.name = item.road_name;
          }
          //在地图上显示指数和道路名称
          let mainDiv = document.createElement('div');
          mainDiv.className = 'popup_cls';
          let closeimgDiv = document.createElement('div');
          closeimgDiv.className = 'closeImgDiv';
          let closeimg = document.createElement('img');
          closeimg.src = this.closeImg;
          closeimg.className = 'closeImg';
          closeimgDiv.appendChild(closeimg);
          mainDiv.appendChild(closeimgDiv);
          if (item && item.name) {
          let title = document.createElement('h3');
          title.className = 'popup_title_cls';
          title.innerHTML = item.name;//that.checkedLayerName;
          mainDiv.appendChild(title);}
//          let tpiDiv = document.createElement('p');
//          tpiDiv.className = 'popup_span';
//          tpiDiv.innerHTML = "<span class='label'>名称</span><span>" + (item.name == undefined ? '未知' : item.name) + '</span>';
//          mainDiv.appendChild(tpiDiv);
          if (item && item.roadno) {
            let tpiSpan = document.createElement('p');
            tpiSpan.className = 'popup_span';
            tpiSpan.innerHTML = "<span class='label'>编号</span><span>" + item.roadno + "</span>";
            mainDiv.appendChild(tpiSpan);
          };
          if (item && item.direction) {
            let tpiSpan = document.createElement('p');
            tpiSpan.className = 'popup_span';
            let dir = item.direction == 1 ? '上行' : (item.direction == 2 ? '下行' : '双向')
            tpiSpan.innerHTML = "<span class='label'>方向</span><span>" + dir + "</span>";
            mainDiv.appendChild(tpiSpan);
          };
          if (item && item.lengths != undefined) {
            let tpiSpan = document.createElement('p');
            tpiSpan.className = 'popup_span';
            tpiSpan.innerHTML = "<span class='label'>长度</span><span>" + parseFloat(item.lengths).toFixed(2) + 'km</span>';
            mainDiv.appendChild(tpiSpan);
          };
          if (item && item.mileagenum != undefined) {
            let tpiSpan = document.createElement('p');
            tpiSpan.className = 'popup_span';
            tpiSpan.innerHTML = "<span class='label'>桩号</span><span>" + item.mileagenum + "</span>";
            mainDiv.appendChild(tpiSpan);
          };
          if (item && item.road_type != undefined) {
            let tpiSpan = document.createElement('p');
            tpiSpan.className = 'popup_span';
            let name = item.road_type == 1 ? '高速' : (item.road_type == 2 ? '国道' :(item.road_type == 3 ? '省道':'县道'));
            tpiSpan.innerHTML = "<span class='label'>道路类型</span><span>" + name + "</span>";
            mainDiv.appendChild(tpiSpan);
          };
          if (item && item.road) { //收费站
            let tpiSpan = document.createElement('p');
            tpiSpan.className = 'popup_span';
            tpiSpan.innerHTML = "<span class='label'>道路</span><span>" + item.road + "</span>";
            mainDiv.appendChild(tpiSpan);
          };
          if (item && item.mtc) {//收费站
            let tpiSpan = document.createElement('p');
            tpiSpan.className = 'popup_span';
            tpiSpan.innerHTML = "<span class='label'>MTC</span><span>" + item.mtc + "</span>";
            mainDiv.appendChild(tpiSpan);
          };
          if (item && item.etc) {//收费站
            let tpiSpan = document.createElement('p');
            tpiSpan.className = 'popup_span';
            tpiSpan.innerHTML = "<span class='label'>ETC</span><span>" + item.etc + "</span>";
            mainDiv.appendChild(tpiSpan);
          };
          if (item && item.zhuanghao) {//收费站
            let tpiSpan = document.createElement('p');
            tpiSpan.className = 'popup_span';
            tpiSpan.innerHTML = "<span class='label'>桩号</span><span>" + parseFloat(item.zhuanghao).toFixed(2) + "</span>";
            mainDiv.appendChild(tpiSpan);
          };
          if (item && item.sa_ld) {//服务区
            let tpiSpan = document.createElement('p');
            tpiSpan.className = 'popup_span';
            tpiSpan.innerHTML = "<span class='label'>道路</span><span>" + item.sa_ld + "</span>";
            mainDiv.appendChild(tpiSpan);
          };
          if (item && item.sa_isboth_name) {//服务区
            let tpiSpan = document.createElement('p');
            tpiSpan.className = 'popup_span';
            tpiSpan.innerHTML = "<span class='label'>服务区</span><span>" + item.sa_isboth_name + "</span>";
            mainDiv.appendChild(tpiSpan);
          };
          if (item && item.oil_isboth_name) {//服务区
            let tpiSpan = document.createElement('p');
            tpiSpan.className = 'popup_span';
            tpiSpan.innerHTML = "<span class='label'>加油站</span><span>" + item.oil_isboth_name + "</span>";
            mainDiv.appendChild(tpiSpan);
          };
          if (item && item.sa_zh) {//服务区
            let tpiSpan = document.createElement('p');
            tpiSpan.className = 'popup_span';
            tpiSpan.innerHTML = "<span class='label'>桩号</span><span>" + item.sa_zh+ "</span>";
            mainDiv.appendChild(tpiSpan);
          };
          if (item && item.citys) {
            let city = document.createElement('p');
            city.className = 'popup_span';
            city.innerHTML = "<span class='label'>经过城市</span><span>" + item.citys + '</span>';
            mainDiv.appendChild(city);
          }else {
            if (item && item.city) {
              let city = document.createElement('p');
              city.className = 'popup_span';
              city.innerHTML = "<span class='label'>所属城市</span><span>" + item.city + '</span>';
              mainDiv.appendChild(city);
            }
          };
          if (lnglat && this.checkedType=='1'){
            let position = document.createElement('p');
            position.className = 'popup_span';
            position.innerHTML = "<span class='label'>经纬度</span><span>" + lnglat[0] + ',' + lnglat[1] + '</span>';
            mainDiv.appendChild(position);
          };
//          if(item && item.cross){
//            let position = document.createElement('p');
//            position.className = 'popup_span';
//            position.innerHTML = "<span class='label'>经过城市</span><span>" +item.cross + '</span>';
//            mainDiv.appendChild(position);
//          };
          closeimg.addEventListener('click', function () {
            that.closingPopup();
          });
          closeimg.addEventListener('mouseover', function () {
//            that.closeImg=conf.IMG.CLOSE_IMG_HOVER;
            this.setAttribute('src', './static/images//mapCtr/close_hover.png');
          });
          closeimg.addEventListener('mouseout', function () {
//            that.closeImg=conf.IMG.CLOSE_IMG;
            this.setAttribute('src', './static/images//mapCtr/close.png')
          });
          if(this.checkedType==1){
              if (!flag) { //是否绑定marker的popup框
                that.covers.popup.setLngLat(lnglat).setDOMContent(mainDiv).addTo(that.map);
              } else {
                let popup = new minemap.Popup({closeOnClick: true, offset: [-1, -25], closeButton: false});
                popup.setLngLat(lnglat).setDOMContent(mainDiv).addTo(that.map);
                that.covers.popups.push(popup);
              };
          }else{
            this.isShowPopup=true;
            document.getElementById('minemap_popup').innerHTML='';
            document.getElementById('minemap_popup').appendChild(mainDiv);
            document.getElementsByClassName("minemap-popup-content").style.backgroundColor='blue';
          }
        },
//        addLnglatPopup(lnglat){
//          let that=this;
////          this.closingPopup();
//          let mainDiv = document.createElement('div');
//          mainDiv.className = 'popup_cls';
//          let closeimgDiv = document.createElement('div');
//          closeimgDiv.className = 'closeImgDiv';
//          let closeimg = document.createElement('img');
//          closeimg.src = this.closeImg;
//          closeimg.className = 'closeImg';
//          closeimgDiv.appendChild(closeimg);
//          mainDiv.appendChild(closeimgDiv);
//          closeimg.addEventListener('click', function () {
//            that.closingPopup();
//          });
//          closeimg.addEventListener('mouseover', function () {
////            that.closeImg=conf.IMG.CLOSE_IMG_HOVER;
//            this.setAttribute('src', './static/images//mapCtr/close_hover.png');
//          });
//          closeimg.addEventListener('mouseout', function () {
////            that.closeImg=conf.IMG.CLOSE_IMG;
//            this.setAttribute('src', './static/images//mapCtr/close.png')
//          });
//          let title = document.createElement('h3');
//          title.className = 'popup_title_cls';
//          title.innerHTML = '坐标获取结果';//that.checkedLayerName;
//          mainDiv.appendChild(title);
//
//          if (lnglat){
//            let position = document.createElement('p');
//            position.className = 'popup_span';
//            position.innerHTML = "<span>" + lnglat[0] + ',' + lnglat[1] + "</span><span class='label'></span>";
//            mainDiv.appendChild(position);
//          };
//          let popup = new minemap.Popup({closeOnClick: true, offset: [-1, 0], closeButton: false});
//          popup.setLngLat(lnglat).setDOMContent(mainDiv).addTo(this.map);
//          this.covers.popups.push(popup);
//          this.cursor='pointer';
//          var point = {
//            "type": "Feature",
//            "geometry": {
//              "type": "Point",
//              "coordinates": [
//                e.lngLat.lng,
//                e.lngLat.lat
//              ]
//            },
//            "properties": {
//              "id": String(new Date().getTime())
//            }
//          };
//
//          this.geojson.features.push(point);
//        },
//        addDistancePopup(lnglat,dis){
//          let that=this;
////          this.closingPopup();
//          let mainDiv = document.createElement('div');
//          mainDiv.className = 'popup_dis_cls';
//          let title = document.createElement('h3');
//          title.className = 'popup_dis_content';
//          title.innerHTML = dis;//that.checkedLayerName;
//          mainDiv.appendChild(title);
//          let popup = new minemap.Popup({closeOnClick: false, offset: [-1, 0], closeButton: false});
//          popup.setLngLat(lnglat).setDOMContent(mainDiv).addTo(this.map);
//          this.covers.popups.push(popup);
//          if(dis=='起点'){
//            this.addClosePopup(lnglat);
//          }else{
//            this.covers.closePopups.setLnglat(lnglat);
//          }
//        },
//        addClosePopup(lnglat){
//          let mainDiv = document.createElement('div');
//          mainDiv.className = 'popup_cls';
//          let closeimgDiv = document.createElement('div');
//          closeimgDiv.className = 'closeImgDiv';
//          let closeimg = document.createElement('img');
//          closeimg.src = this.closeImg;
//          closeimg.className = 'closeImg';
//          closeimgDiv.appendChild(closeimg);
//          mainDiv.appendChild(closeimgDiv);
//          closeimg.addEventListener('click', function () {
//            that.closingPopup();
//          });
//          closeimg.addEventListener('mouseover', function () {
////            that.closeImg=conf.IMG.CLOSE_IMG_HOVER;
//            this.setAttribute('src', './static/images//mapCtr/close_hover.png');
//          });
//          closeimg.addEventListener('mouseout', function () {
////            that.closeImg=conf.IMG.CLOSE_IMG;
//            this.setAttribute('src', './static/images//mapCtr/close.png')
//          });
//          let popup = new minemap.Popup({closeOnClick: true, offset: [-1, -25], closeButton: false});
//          popup.setLngLat(lnglat).setDOMContent(mainDiv).addTo(this.map);
//          this.covers.closePopups=popup;
//        },
        clearMap(type){
          let map = this.map;
          this.uncheckedLayer();
          if (type == undefined) {
            this.covers.markers.forEach(function (e) {
              e.remove();
            });
            this.covers.markers = [];
            this.initPopup();
//            if(document.getElementsByClassName('minemap-popup-close-button')!=undefined){
//              document.getElementsByClassName('minemap-popup-close-button').click();
//            }

            if (this.covers.lines.length > 0) {
              this.covers.lines.forEach(function (id) {
                if (map.getLayer("line_" + id)) {
                  map.removeLayer("line_" + id);
                }
                if (map.getLayer("arrow_" + id)) {
                  map.removeLayer("arrow_" + id);
                }
                if (map.getSource("ls_" + id)) {
                  map.removeSource("ls_" + id);
                }
              });
            }
            ;
            this.covers.lines = [];
            if (this.covers.polygons.length > 0) {
              this.covers.polygons.forEach(function (id) {
                if (map.getLayer("layer_" + id)) {
                  map.removeLayer("layer_" + id);
                }
                if (map.getLayer("pn_" + id)) {
                  map.removeLayer("pn_" + id);
                }
                if (map.getSource("fs_" + id)) {
                  map.removeSource("fs_" + id);
                }
              });
            }
            this.covers.polygons = [];
            if (this.covers.popups.length > 0) {
              this.covers.popups.forEach(function (e) {
                e.remove();
              })
            }
            ;
            this.covers.popups = [];
          } else {
            //
          }
        },
        closingPopup(){
          this.clearMap();
          this.uncheckedLayer();
          this.POISearch.road = '';
          this.POISearch.num = '';
          this.POISearch.dir = '';
//          this.initMapDefault();
          this.isShowPopup=false;
          this.isQuery=false;
        },
        initPopup(){
          this.covers.popup.remove();
          this.covers.popup = new minemap.Popup({closeOnClick: false, offset: this._offset, closeButton: false});
        },
        //地图初始化中心点，缩放等级
        initMapDefault(){
//            if(this.checkedTableName.indexOf('桥梁')!=-1 || this.checkedTableName.indexOf('隧道')!=-1){
//
//            }
          this.map.setCenter(mapConfig.DEFAULT_CENTER);
            if (this.checkedType == 1) {
              this.map.setPitch(45);
              this.show3D = true;
              if (this.checkedLayerName.indexOf('气象') != -1 || this.checkedLayerName.indexOf('港口') != -1) {
                this.map.setZoom(6);
              } else {
                this.map.setZoom(8);
              }
            } else {
              this.map.setZoom(mapConfig.DEFAULT_ZOOM);
              this.map.setPitch(0);
              this.show3D = false;
            }
        },
        getMileage(){
          let that = this;
          this.$axios.get(conf.interf.getMileage, {params: {token: that.token}}).then(response => {
            if (response.status == 200) {
              that.mileagedata = response.data.data;
              that.prepareLayerOptions();
            }
          }).catch(e => {
            console.error(e);
            that.$message({message: "查询失败", type: "error", duration: 1500})
          })

        },
        showMileage(id){
          let that = this;
//              let geojson = {
//                "type": "FeatureCollection",
//                "features":[]
//              }
//              this.mileagedata.forEach(function(e){
//                let dir_icon='1003';
//                if(e.direction==1){
//                  dir_icon='1001';
//                }else{
//                  if(e.direction==2){
//                    dir_icon='1002';
//                  }
//                }
//                geojson.features.push({
//                  "type": "Feature",
//                  "properties": {
//                      'id':e.id,
//                    'name':e.road_num,
//                    'Length':e.mileagenum,
//                    "title":e.mileagenum,//+' '+e.road_num,
//                    'road':e.road_num,
//                    'direction':e.direction,
//                    "eventtype": "icon_"+dir_icon,
//                    'transparent':"icon_transparent"
//                  },
//                  "geometry": {
//                    "type": "Point",
//                    "coordinates": e.geometry.split(' ')
//                  }
//                })
//              });
//              this.map.addSource("source_"+id, {
//                "type": "geojson",
//                "data":geojson
//              });
//              this.map.addLayer({
//                "id": "layer_symbol_"+id,
//                "type": "symbol",
//                "source": "source_"+id,
//                'source-layer':'position',
//                "layout": {
//    //              "icon-image": "{transparent}",//说明：eventtype为pbf或jeojson数据中的属性字段，sprite图标库中存在类似event-app-1000-18、event-app-1001-18这样的图标名称，其中1000或1001为对应数据中eventtype的值
//                  "text-field": "{road_num}",
//                  "text-offset": [0, 1.5],
//                  "text-anchor": "top",
//                  "icon-allow-overlap": false,  //图标允许压盖
//                  "text-allow-overlap": false,   //图标覆盖文字允许压盖
//                  'visibility': 'none',
//                  "text-size":12,
//                  "text-max-width":10
//                },
//                "paint": {
//                  "text-color":'#111111'
//                },
//                minzoom: 3,
//                maxzoom: 17
//          });
          this.map.addLayer({
            "id": "layer_" + id,
            "type": "symbol",
            "source": "source_" + id,
            'source-layer': 'position',
            "layout": {
              "icon-image": 'mileage_{direction}',//'mileage_direction-{direction}',//"icon_100{direction}",//"{eventtype}",//说明：eventtype为pbf或jeojson数据中的属性字段，sprite图标库中存在类似event-app-1000-18、event-app-1001-18这样的图标名称，其中1000或1001为对应数据中eventtype的值
              "icon-size": 1,
              "text-field": "{mileagenum}\n{road_num}",
              "text-offset": [-0.1, -2.1],
              "text-anchor": "center",
              "icon-allow-overlap": false,  //图标允许压盖
              "text-allow-overlap": true,   //图标覆盖文字允许压盖
              'visibility': 'none',
              "text-size": 11,
              "text-max-width": 20,
              'symbol-avoid-edges':true,
              'icon-offset':[0,-20]
            },
            "paint": {
              "text-color": 'white'
            },
            minzoom: 3,
            maxzoom: 17
          });
        },
        setMileage(){
          if (this.map.getZoom() > 12) {
            if (this.checkedTableName.indexOf("xwt_layer_mileage") != -1) { //单独处理里程桩图层
              this.map.setLayoutProperty("layer_" + this.visibleId, 'icon-allow-overlap', true);
              this.map.setLayoutProperty("layer_" + this.visibleId, 'text-allow-overlap', true);
            }
          } else {
            if (this.checkedTableName.indexOf("xwt_layer_mileage") != -1) { //单独处理里程桩图层
              this.map.setLayoutProperty("layer_" + this.visibleId, 'icon-allow-overlap', false);
              this.map.setLayoutProperty("layer_" + this.visibleId, 'text-allow-overlap', false);
            }
          }
        },
//        showStatics(){
//          let that = this;
//          if(that.isMileage) that.showLoading=true;
////          that.dataStatics=[
////            {name:'',count:'',kind:''}
////          ];
////          document.getElementsByClassName('chart')[0].addEventListener("resize", () => {
////            this.pieChart.resize();
////          });
////          this.$axios.get(conf.interf.getStatics, {params: {}}).then(response => {
//            conf.interf.GET_STATICS_API({tablename: that.checkedTableName}).then((response) => {
//            if (response.status == 200) {
//              let data = response.data;
//              if (data.errcode == 0) {
//                let dataStatics = data.data;
//                if (dataStatics.length > 0) {
//                  if (that.isMileage) {
//                    that.showLoading=false;
//                    that.pieChart = that.$echarts.init(document.getElementById('staticsDiv'));
//                    that.option.legend.data = dataStatics.map(function (e) {
//                      return e.name;
//                    });
//                    dataStatics.map(function (e) {
//                      e.value = e.count;
//                      e.company = '个';
//                      return e;
//                    });
//                    that.option.series[0].data[0].value = dataStatics[dataStatics.length - 1].count;
//                    that.option.series[1].data[0].value = dataStatics[dataStatics.length - 1].count;
//                    that.option.series[2].data = dataStatics.slice(0, dataStatics.length - 1);
//                    that.option.series[2].name = that.checkedLayerName.replace('图层', '');
//                    that.option.series[2].itemStyle.normal.color = function (params) {
//                      //自定义颜色
//                      var colorList = [
//                        new that.$echarts.graphic.LinearGradient(1, 0, 0, 0,
//                          [
//                            {offset: 0, color: '#0b84f4'},
//                            {offset: 0.5, color: '#16a0f3'},
//                            {offset: 1, color: '#23b4ec'}
//                          ]), new that.$echarts.graphic.LinearGradient(1, 0, 0, 0,
//                          [
//                            {offset: 0, color: '#00e0ac'},
//                            {offset: 0.5, color: '#01cc9c'},
//                            {offset: 1, color: '#00bc8d'}
//                          ]),
//                        new that.$echarts.graphic.LinearGradient(1, 0, 0, 0,
//                          [
//                            {offset: 0, color: '#f5ab7b'},
//                            {offset: 0.5, color: '#e37f63'},
//                            {offset: 1, color: '#d55851'}
//                          ]),
//                        new that.$echarts.graphic.LinearGradient(1, 0, 0, 0,
//                          [
//                            {offset: 0, color: '#888cec'},
//                            {offset: 0.5, color: '#7272f4'},
//                            {offset: 1, color: '#5a43f4'}
//                          ])
//                      ];
//                      return colorList[params.dataIndex]
//                    }
//                    that.pieChart.setOption(that.option);
//                    that.pieChart.resize();
//                    that.pieChart.hideLoading();
//                  } else {
//                    dataStatics = dataStatics.map(function (e) {
//                      e.value = e.count;
//                      if (('' + e.count).split('.')[1] && ('' + e.count).split('.')[1].length > 2) {
//                        e.count = parseFloat(e.count).toFixed(2);
//                      }
//                      ;
////                    e.kind=that.checkedType==2?'条':'个';
//                      return e;
//                    });
//                  }
//                } else {
//                  dataStatics = [{name: '', count: ''}];
//                }
//                ;
//                that.dataStatics = dataStatics;
//              } else {
//                that.dataStatics = [{name: '', count: ''}];
//              }
//            }
//          });
//          if(that.checkedTableName.indexOf('xwt_layer_highspeed') != -1) {
//            that.getHightSpeedTopFive();
////            that.getHightSpeedSorts();
//          };
//        },
        clearMileage(){
          this.mileageMarker.forEach(function (e) {
            e.hide()
          });
        },
        //设置地图放大一级
        setZoomIn (){
          this.map.zoomOut();
        },
        //设置地图缩小一级
        setZoomOut (){
          this.map.zoomIn();
        },
        setCompassRotate (){
          this.map.setBearing(0);
          document.getElementsByClassName('map-ctrl-compass')[0].style.transform='rotate(0deg)';
        },
        //设置旋转图标旋转角度
        setCompassRotateIcon(e) {
          document.getElementsByClassName('map-ctrl-compass')[0].style.transform='rotate(' + e.target.transform.bearing + 'deg)';
        },
        setPitch(show) {
          if (show == 'click') {
            this.show3D = !this.show3D;

          } else {
            this.show3D = show;
          }
          if (!this.show3D) {
            this.map.setPitch(0);
          } else {
            this.map.setPitch(60);
          }
        },
        setPitchIcon(e){
          if (e.target.transform.pitch > 1) {
            this.show3D = true;
          } else {
            this.show3D = false;
          }
        },
        changeRoad(val){
//            console.log(val);
          this.POISearch.road = val;
          if(val!=''){
              this.map.setFilter("layer_" + this.id, ['==', 'road_num', val]);
          } else{
            this.map.setFilter("layer_" + this.id,['has','road_num']);
          }

//          this.searchList.length=0;
          this.initSearchMileage();
        },
        changeDir(val){
//          console.log(val);
          this.initSearchMileage();
        },
        changeNum(val){
//          console.log(val);
          this.POISearch.num=val;
          this.initSearchMileage();
        },
        initSearchMileage(){
          this.searchParams={page:1,limit:10};
          this.searchList.length=0;
          this.mileageSearch();
        },
        getSearchList() {
          let that = this;
          that.loading=true;
//          that.search_list_page = [0, that.size];
//          let CancelToken = this.$axios.CancelToken;
//          if(typeof that.cancel ==='function'){
//            that.cancel();
//          };
//          this.$axios.get(conf.interf.SEARCH_LIST,{
//              cancelToken:new that.$axios.CancelToken(function executor(c) {
//                that.cancel = c;
//                return c;
//                // 这个参数 c 就是CancelToken构造函数里面自带的取消请求的函数，这里把该函数当参数用
//              }),
//            params: {
//            token: this.token,
//            tablename: this.checkedTableName,
//            keyword: this.input,
//            _t:new Date().getTime()
//          }}).then(response => {
          conf.interf.SEARCH_LIST_API({tablename: this.checkedTableName, keyword: this.POISearch.road,page:that.searchParams.page,limit:that.searchParams.limit}).then((response) => {
            if (response.status == 200) {
              let data = response.data;
              if (data.errcode == 0) {
                data.data.map(e => {
                  e.width = '33%';
                  return e;
                });
                that.searchList=that.searchList.concat(data.data);
                if (that.searchList.length <1) {
                  that.setNullQuery();
                  that.isQuery=false;
                }else{
                    that.isQuery=true;
                };
                that.loading=false;
                document.getElementById("layer-search-list").style.display = "block";
              }
            }
          }).catch(e => {
//            console.error(e)
          });
        },
        mileageSearch(){
          let that = this,flag=false;
          that.loading=true;
          let CancelToken = this.$axios.CancelToken;
          if (typeof that.cancel === 'function' && that.searchParams.page==1) {
            that.cancel();
          };
          let data = that.searchParams;
          if (this.POISearch.road != '') {
            data.roadname = this.POISearch.road;
          }
          if (this.POISearch.num != '') {
            data.mileagenum = this.POISearch.num;
          }
          if (this.POISearch.dir != '' && this.POISearch.dir !='全部') {
            data.direction = this.POISearch.dir;
          }
          if(this.POISearch.road == '' && (this.POISearch.dir == '' || this.POISearch.dir =='全部') && this.POISearch.num == ''){
            document.getElementById("layer-search-list").style.display = "none";
          }
//          this.$axios.get(conf.interf.MILEAGE_SEARCH, {
//            cancelToken: new that.$axios.CancelToken(function executor(c) {
//              that.cancel = c;
//              return c;
//              // 这个参数 c 就是CancelToken构造函数里面自带的取消请求的函数，这里把该函数当参数用
//            }),
//            params: data
//          }).then(response => {
              conf.interf.MILEAGE_SEARCH(data).then((response) => {
            if (response.status == 200) {
              let data = response.data;
              if (data.errcode == 0) {
                if (data.data.dataSecond.length > 0) {
                  that.searchList=that.searchList.concat(data.data.dataSecond.map(function (e) {
                    e.name = e.road_name;
                    e.roadno = e.road_num;
                    e.dir = e.direction == 1 ? '上行' : (e.direction == 2 ? '下行' : '双向');
                    e.width = '32%';
                    return e;
                  }));
                  that.isQuery=true;
                } else {
//                  that.searchList = [{name: '没有搜索到查询结果！'}];
                  that.setNullQuery();
                  that.isQuery=false;
                };
                document.getElementById("layer-search-list").style.display = "block";
                if(data.data.dataFirst){
                  that.$refs.statics.showMeligeaDirectionSorts(data);
                }else{
                  if(that.searchParams.page==1)that.$refs.statics.hideMeligeaDirectionSorts();
                };
                that.loading=false;
              }
            }
          });
        },
        startSearch: function (item) {
          /*搜索指定图层*/
          if (item == null) {
            return;
          } else {
            this.clearMap();
//            if(this.checkedType==2){
//                let features;
//              if(this.checkedLayerName.indexOf('隧道')!=-1){
//                let renderLayerIds=["layer_suidao_" + this.visibleId];
//                features = this.map.queryRenderedFeatures({layers : renderLayerIds});
//
//              }else{
//                let renderLayerIds= ["layer_" + this.visibleId];
//                features = this.map.queryRenderedFeatures({layers : renderLayerIds});
//              }
//              features=features.filter(function(el) {
//                if (item.id.indexOf(el.properties.id)) {
//                  return true;
//                } else {
//                  return false;
//                }
//              });
//            }
            item.properties = {};
            item.properties.id = item.id;
            /*判断里程桩***/
            if (item.direction!=undefined && item.direction>=0) {
              item.properties.direction = item.direction;
              this.POISearch.road = item.name;
              this.POISearch.dir = item.dir;
              this.POISearch.num = item.mileagenum
            }
            if (item.mileagenum) {
              item.properties.mileagenum = item.mileagenum;
            }
            if (item.road_num) {
              item.properties.road_num = item.road_num;
            }
            /***END***/
            this.checkedLayer(item,false);
//            this.showCheckedLayer(this.id,item);
//            let features=this.map.queryRenderedFeatures({layers:["layer_" + this.visibleId]}).
//            filter(function(e){if(e.properties.id==item.id) return e});
//            if (features && features.length > 0) {
//              item=features[0];
//              if(feature){
//                this.checkedLayer(item);
//              }
//            }
            this.POISearch.road = item.name;
          }
          document.getElementById("layer-search-list").style.display = "none";
        },
        setNullQuery(){
            if(this.searchList.length==0){
              this.searchList.length=0;
              this.searchList.push({'msg':"无匹配项！"});
            }
        },
        matchLength(str){
          let regex = /[1-9]{1,1}\d{0,4}(\.\d{1,1})?$/g;
          return str.match(regex);
        },
        loadMore() {
          this.search_list_page += this.size;

        },
        layerClick(e){
            console.log(e);
        }
      }
    }
</script>

<style scoped>
  #map-ctrl {
    width:100%;
    height:100%;
    position:relative;
  }
  #layer-list {
    width: 11%;
    height: auto;
    max-height: 99%;
    overflow-y: auto;
    position: absolute;
    top: 7%;
    text-align: center;
    /*background-color: white;*/
    left: 1%;
  }
  .layer-title {
    width: 100%;
    height: 2vw;
    line-height: 2vw;
    background-color: #0b46a4;
    font-weight: bold;
    font-size: 1.2rem;
    color: white;
    border-radius: 17px;
  }
  #map-ctrl #map {
    width:100%;
    height:99%;
    margin:0px;
  }
  #map-ctrl #map-style-button{
    position: absolute;
    bottom: 3%;
    right: 1%;
    width:90px;
    height:50px;
    background-color:#124aa7 ;
    border-radius: 8px;
  }
  #map-ctrl #map-style-button:hover{width:180px;}
  #map-ctrl #map-style-button img{cursor: pointer;margin-right:0.5vw;height: 3vh;}
  #map-ctrl #map-style-button ul{display: block;width:100%;height:100%;padding:5px;overflow: hidden;}
  #map-ctrl #map-style-button ul li{float:left;width:80px;height:100%;cursor: pointer;border-radius: 10px;}
  #map-ctrl #map-style-button ul li.active,  #map-ctrl #map-style-button ul li:hover{
    border:1.5px solid #00c6ff;
  }
  #map-ctrl #map-style-button ul li.active,  #map-ctrl #map-style-button ul li:nth-child(1){margin-right:4%;margin-bottom: 5px;}
  #map-ctrl #map-style-div {
    position: absolute;
    top: 50px;
    right:10px;
    background-color: white;
    border:1px black solid;
    border-radius:4px;
    padding:0;
    display: none;
  }
  .map-style-item {
    display: inline-block;
    width:100px;
    height:80px;
    background-color:green;
    margin:2px;
    border:2px white solid;
  }
  .map-style-item-checked {
    border:2px black solid;
  }

  #map-ctrl #layer-search-div {
    position: absolute;
    top: 7%;
    left: 14%;
    display:none;
    width: auto;
    float:left;
  }
  #map-ctrl #layer-search-list {
    position: absolute;
    top: 12%;
    left: 14%;
    display: none;
    background-color: #0f4091;
    border: 1px #0b46a4 solid;
    width: 16vw;
    height: auto;
    max-height: 33%;
    cursor: pointer;
    text-align: left;
    overflow-y: scroll;
    border-radius: 12px;
    line-height: 2.5em;
    line-height: 2.5em;
    padding: 0.5vw;
  }
  #map-ctrl .exportQuery{float:right;  width: auto;}
  #map-ctrl #layer-search-list .rowCls{border-bottom: 1px solid #4da4f5;font-size:0.83vw;font-family: 'DroidSansFontLight';/*text-align: center;*/}
  #map-ctrl .box-card{
    position: fixed;
    z-index: 2;
    max-width: 380px;
    height: auto;
    top: 20%;
    right: 1%;
    background: #024196;
    border-color: #00c6ff;
    color: white;
    font-size: 1.04vw;
    border-radius: 5%;
    line-height: 2.8em;
    min-width: 14vw;
  }
  #map-ctrl #minemap_popup{
    position: fixed;
    z-index: 2;
    width: 344px;
    height: auto;
    bottom: 10%;
    left: 14%;
    background: #024196;
    border-color: #00c6ff;
    color: white;}
  #map-ctrl .title{
    position: absolute;
    top: 0;
    padding-left: 1.56vw;
  }
  #layer-search-div  input.input-with-select{border-radius:0;padding: 0 8px;}
  #layer-search-div .el-input-group{width:16vw;}
  #layer-search-div .searchMileageDiv .searchBtn{border-radius: 50% 0 0 50%;border: none;}
  #layer-search-div .searchMileageDiv{background-color: #0b47a4;border-radius:25px;
    /*border: 1px solid #00c6ff;*/
    width:24vw;    float: left;}
  #layer-search-div .searchMileageDiv select{
    background-color: transparent;
    border:none;
    border-right: 1px solid #4b7bc9; border-radius: 0px;
    /*margin: 8px 0;*/
    padding:0;
    /*height:15px;*/
  }
  /*#map-ctrl .chart{*/
    /*width: 344px;  height: auto;*/
  /*}*/
  /*#staticsDiv{*/
    /*width:100%;height:230px;*/
  /*}*/
  /*#hight_speed_chart_div{width:100%;height:130px;width:302px;}*/
</style>
<style>
  #layer-search-div .searchMileageDiv .el-select{height:20px;width:50px;}
  /*#layer-search-div .searchMileageDiv .el-select input,#layer-search-div .searchMileageDiv input{*/
    /*background: transparent;*/
    /*border:none;*/
    /*border-right: 1px solid #4b7bc9;border-radius: 0px;*/
    /*!*margin: 10px 0;height:20px;*!*/
    /*!*height: 23px;*!*/
  /*}*/
  #layer-search-div .searchMileageDiv input,#layer-search-div .searchMileageDiv .el-select input{
    color: white;
    height: 20px;
    font-size: 0.83vw;
    background: transparent;
    border-right: 1px solid #4b7bc9;
    border-radius:0;
    margin: 9px 0;
  }
  #layer-search-div .searchMileageDiv .mileageDir input{border:none;}
  #map-ctrl .el-card__body{width:100%;}
  /*::-webkit-input-placeholder { !* WebKit, Blink, Edge *!*/
    /*color:red;*/
    /*font-size:10px;*/
  /*}*/
  #map-ctrl .progress{width:100%;height:50px;}
  #map-ctrl .progress ul{width:100%; display: block;margin:0;}
  #map-ctrl .progress ul:nth-child(1),#map-ctrl .progress ul:nth-child(3){width:100%;height:23px;display: block;line-height: 20px;}
  #map-ctrl .progress ul:nth-child(1) li{font-size: 0.83vw;color: #43DDFF;}
  #map-ctrl .progress ul:nth-child(3) li{font-size: 0.73vw;}
  #map-ctrl .progress ul li{float: left;text-align: center;height: 100%;}
  /*#map-ctrl .progress ul:nth-child(1){}*/
  #map-ctrl .progress ul:nth-child(2){height:12px;}
  #map-ctrl .progress ul:nth-child(2) li{width: 30%; height: 12px;border:1px solid #08A9C6;}
  /*#map-ctrl .toolDiv .tool .el-button{padding:12px 20px;width: auto;border-radius:25px;}*/
  /*.el-icon-edit:before{*/
     /*content:url(../../../static/images/mapCtr/tool.png);*/
  /*}*/
  .map_ctr{width:120px;}
  #map-ctrl .toolDiv .tool .el-button span{
    margin-top: 2px;
    display: block;
    float: right;
    margin-left: 15px;
  }
  /*#map-ctrl .toolDiv .tool{margin:0 1%;}*/
  #map-ctrl .toolDiv .layer-lnglat-div{background-color: #0b47a4;
    border-radius: 25px;text-align: left;
    /* border: 1px solid #00c6ff; */
    width: 307px;float: right;}
  #map-ctrl .space{float:left;width:10px;height:25px;}
  #map-ctrl .layer-lnglat-div .el-input-group{height:100%;width:75%;border:none;border-radius: 50% 0 0 50%;}
  #map-ctrl .layer-lnglat-div>.el-button{float:right;background-color: transparent;border:none;text-decoration: underline;color:#00AEFF;}
</style>
