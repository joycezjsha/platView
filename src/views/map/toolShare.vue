<template>
  <div class="toolDiv">
    <div class="export" v-show="isShowExport"><el-button @click="exportExcel()" round>导出</el-button></div>
    <div class="space" style="float: right;"></div>
    <div class='tool' style="right:7%">
      <el-dropdown>
        <el-button type="primary" class="el-icon-share">工具<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" class="map_ctr">
          <el-dropdown-item><div @click="handleClick">拾取坐标</div></el-dropdown-item>
          <el-dropdown-item><div @click="onDistanceBtnClick">测距离</div></el-dropdown-item>
          <!--<el-dropdown-item><div @click="clearEdit()">清除</div></el-dropdown-item>-->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!--<div id="minemap_popup" v-show="isShowPopup"></div>-->
    <div class="space"></div>
    <div v-show="showLnglatDiv" class="searchTool layer-lnglat-div">
      <el-input id="lnglatInput" v-model="lnglat" placeholder="经纬度" size="mini"  class="input-with-select" clearable>
        <el-button slot="prepend" icon="el-icon-search" class="searchBtn" style="background-color: transparent;"></el-button>
      </el-input>
      <el-button type="primary" @click="copyLnglat()">复制</el-button>
    </div>
  </div>
</template>

<script>
  /*地图页面*/
  import utils from '../js/utils'
  import {conf} from './config.js'
    export default {
      name: "tool",
      data() {
        return {
            map:'',
          token:sessionStorage.getItem("token"),
          covers: {
            markers: [], lines: [], polygons: [], popups: [],closeMarker:null,
            popup: new minemap.Popup({closeOnClick: true, offset: [0, -20], closeButton: false})
          },
          mar_icon:conf.IMG.mar_icon,
          showLnglatDiv:false,
          lnglat:'',
          geojson : {
            "type": "FeatureCollection",
            "features": []
          },
// Used to draw a line between points
          linestring : {
            "type": "Feature",
            "geometry": {
              "type": "LineString",
              "coordinates": []
            }
          },
          mar_icon:conf.IMG.mar_icon,
          closeImg: conf.IMG.CLOSE_IMG,
          flag:false,
          isShowExport:false
        }
      },
      mounted() {
//          this.initPopup();
        this.initExport();
      },
      watch: {
        'is_show_export':{
          immediate:false,
          handler:function(cVAL,oVAL){
            this.initExport();
          }
        }
      },
      props:{'checkedTable':'','checkedType':'','is_show_export':''},
      methods: {
          initExport(){
            this.isShowExport=this.is_show_export;
            if(this.isShowExport) this.isShowExport=sessionStorage.getItem("role")==2?true:false;
          },
        exportExcel(tabName){
          //导出数据
          let that = this;
//          this.$axios.get(conf.interf.EXPORT, {
//            params: {
//              tablename: that.checkedTableName,
//              type: that.checkedType,
//              token: that.token
//            }
//          }).then(response => {
////              conf.interf.EXPORT({
////                tablename: that.checkedTableName,
////                type: that.checkedType,
////                token: that.token
////              }).then((response) => {
//              if (response.status == 200) {
//                let data = response.data;
//                if (response.status == 200) {
//                  that.$message({message: "导出成功", type: "success",duration: 1000});
//                }
//              }
//            });
          window.location.href = conf.interf.EXPORT + '?tablename=' + that.checkedTable + '&type=' + that.checkedType + '&token=' + that.token;
         this.insertLog('导出图层数据',that.checkedTableName+':'+that.checkedTable);
          },
        addLayer(){
            let _this=this;
            if(!this.flag){
              this.map.addSource('geojson', {
                "type": "geojson",
                "data": _this.geojson
              });
              this.map.addLayer({
              id: 'measure-points',
              type: 'circle',
              source: 'geojson',
              paint: {
                'circle-radius': 6,
                'circle-color': 'rgba(8, 133, 214, 1)'
              },
              filter: ['in', '$type', 'Point']
            });
              this.map.addLayer({
                id: 'measure-lines',
                type: 'line',
                source: 'geojson',
                layout: {
                  'line-cap': 'round',
                  'line-join': 'round'
                },
                paint: {
                  'line-color': 'rgba(8, 133, 214, 1)',
                  'line-width': 4
                },
                filter: ['in', '$type', 'LineString']
              });
              this.flag=true;
              if (this.map.getLayer("measure-points") != undefined) {
                this.map.setLayoutProperty("measure-points", 'visibility', 'visible');
              };
              if (this.map.getLayer("measure-lines") != undefined) {
                this.map.setLayoutProperty("measure-lines", 'visibility', 'visible');
              };
            }else{
                if(!this.showLnglatDiv){
                  if (this.map.getLayer("measure-points") != undefined) {
                    this.map.setLayoutProperty("measure-points", 'visibility', 'visible');
                  }else{
                    this.flag=false;
                    this.addLayer();
                  };
                  if (this.map.getLayer("measure-lines") != undefined) {
                    this.map.setLayoutProperty("measure-lines", 'visibility', 'visible');
                  };
                }
            }
//          this.map.getSource('geojson').setData(this.geojson);
        },
        handleToolEvent(e){
          this.map=this.$store.state.map;
          if(this.$store.state.cursor!='crosshair'){return;}
          this.addLayer();
          if(this.showLnglatDiv){
              let p=[parseFloat(e.lngLat.lng).toFixed(6),parseFloat(e.lngLat.lat).toFixed(6)]
            this.addLnglatPopup(p);
//            this.addCloseMarker(p);
            this.addMarker(p);
          }else{
              this.initMesureDistance(e);
          }
        },
        initPopup(){
          this.covers.popup.remove();
          this.covers.popup = new minemap.Popup({closeOnClick: false, offset: [-15, -30], closeButton: false});
        },
        handleClick() {
          this.$store.state.cursor= 'crosshair';
//          this.cursor = 'crosshair';
          this.showLnglatDiv=true;
        },
        onDistanceBtnClick(){
          this.$store.state.cursor= 'crosshair';
          this.showLnglatDiv=false;
          this.map=this.$store.state.map;
        },
        initMesureDistance(e){
          var features = this.map.queryRenderedFeatures(e.point, { layers: ['measure-lines'] });
          if (this.geojson.features.length > 1) this.geojson.features.pop();
// If a feature was clicked, remove it from the map
          if (features.length) {
            var id = features[0].properties.id;
            this.geojson.features = this.geojson.features.filter(function(point) {
              return point.properties.id !== id;
            });
          } else {
            var point = {
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [
                  e.lngLat.lng,
                  e.lngLat.lat
                ]
              },
              "properties": {
                "id": String(new Date().getTime())
              }
            };
            this.geojson.features.push(point);
          }

          if (this.geojson.features.length > 1) {
            this.linestring.geometry.coordinates = this.geojson.features.map(function(point) {
              return point.geometry.coordinates;
            });

            this.geojson.features.push(this.linestring);

// Populate the distanceContainer with total distance
//            this.addDistancePopup([
//              e.lngLat.lng,
//              e.lngLat.lat
//            ],turf.lineDistance(this.linestring).toLocaleString()+'公里');
            //this.$message({message: turf.lineDistance(this.linestring).toLocaleString() + 'km', type: "success", duration: 5000});
            this.addDisMarker([e.lngLat.lng,
              e.lngLat.lat
            ],turf.lineDistance(this.linestring).toLocaleString()+'公里');
          }else{
//            this.addDistancePopup([
//              e.lngLat.lng,
//              e.lngLat.lat
//            ],'起点');
            this.addDisMarker([
              e.lngLat.lng,
              e.lngLat.lat
            ],'起点');
          }

          this.map.getSource('geojson').setData(this.geojson);
        },
        addLnglatPopup(lnglat){
          let that=this;
//          this.closingPopup();
          let mainDiv = document.createElement('div');
          mainDiv.className = 'popup_cls';
          let closeimgDiv = document.createElement('div');
          closeimgDiv.className = 'closeImgDiv';
          let closeimg = document.createElement('img');
          closeimg.src = this.closeImg;
          closeimg.className = 'closeImg';
          closeimgDiv.appendChild(closeimg);
          mainDiv.appendChild(closeimgDiv);
          closeimg.addEventListener('click', function (event) {
//            that.closingPopup();
            event.stopPropagation();
            that.clearEdit();
          });
          closeimg.addEventListener('mouseover', function () {
//            that.closeImg=conf.IMG.CLOSE_IMG_HOVER;
            this.setAttribute('src', './static/images//mapCtr/close_hover.png');
          });
          closeimg.addEventListener('mouseout', function () {
//            that.closeImg=conf.IMG.CLOSE_IMG;
            this.setAttribute('src', './static/images//mapCtr/close.png')
          });
//          let title = document.createElement('h3');
//          title.className = 'popup_title_cls';
//          title.innerHTML = '坐标获取结果';//that.checkedLayerName;
//          mainDiv.appendChild(title);

          if (lnglat){
            let position = document.createElement('p');
            position.className = 'popup_span';
            position.innerHTML = "<span>" + lnglat[0] + ',' + lnglat[1] + "</span><span class='label'></span>";
            mainDiv.appendChild(position);
          };
          let popup = new minemap.Popup({closeOnClick: true, offset: [0, -20], closeButton: false});
          popup.setLngLat(lnglat).setDOMContent(mainDiv).addTo(this.map);
          this.covers.popups.push(popup);
          var point = {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                lnglat[0],
                lnglat[1]
              ]
            },
            "properties": {
              "id": String(new Date().getTime())
            }
          };

          this.geojson.features.push(point);
        },
        addDistancePopup(lnglat,dis){
          let that=this;
          this.map=this.$store.state.map;
//          this.closingPopup();
          let mainDiv = document.createElement('div');
          mainDiv.className = 'popup_dis_cls';
          let title = document.createElement('h3');
          title.className = 'popup_dis_content';
          title.innerHTML = dis;//that.checkedLayerName;
          mainDiv.appendChild(title);
          let popup = new minemap.Popup({closeOnClick: false, offset: [-1, 0], closeButton: false});
          popup.setLngLat(lnglat).setDOMContent(mainDiv).addTo(this.map);
          this.covers.popups.push(popup);
          if(dis=='起点'){
            this.addClosePopup(lnglat);
          }else{
            this.covers.closePopup.setLngLat(lnglat);
          }
        },
        addDisMarker(lnglat,dis){
          let that = this;
          this.map=this.$store.state.map;
          this.lnglat=lnglat.toString();
          let el = document.createElement('div');
          el.id = 'marker';
//          el.style.width='16px';
//          el.style.height='16px';
//          el.style.borderRadius='50%';
//          el.style.backgroundColor='#fff';
//          el.style.border='6px solid rgba(8, 133, 214, 1)';
          let pop = document.createElement('div');
          pop.style.width='auto';
          pop.style.whiteSpace='nowrap';
          pop.style.padding='0 10px';
          pop.style.height='35px';
          pop.style.lineHeight='35px';
          pop.style.backgroundColor='#f3f3f3';//'rgba(10, 47, 107, 0.76)';//
          pop.style.opacity='0.7';
//          pop.style.backgroundColor='rgba(12, 70, 164, 0.85)';
          pop.style.color='#021737';//'white';//
          pop.style.fontWeight='500';
          pop.style.borderRadius='5px';
          pop.style.border=' 1px solid rgba(39, 144, 209, 1)';
          pop.style.textAlign='center';
          pop.style.position='absolute';
          pop.style.top='20px';
          pop.style.left='-40px';
          pop.style.fontSize='16px';
          pop.innerHTML=dis;
          el.appendChild(pop);
          var marker = new minemap.Marker(el, {offset: [-1, -10]})
            .setLngLat(lnglat).addTo(that.map);//.setPopup(that.covers.popup);
          that.covers.markers.push(marker);
          if(dis=='起点'){
            this.addCloseMarker(lnglat);
          }else{
            this.covers.closeMarker.setLngLat(lnglat);
          }
        },
        addCloseMarker(lnglat,dis){
            let that=this;
          let mainDiv = document.createElement('div');
          mainDiv.id = 'marker';
          mainDiv.title='关闭';
          mainDiv.style.backgroundColor='rgba(10, 47, 107, 1)';
//          mainDiv.style.border='1px solid rgb(8, 77, 189)';
          mainDiv.style.borderRadius='5px';
          mainDiv.style.width='35px';
          mainDiv.style.height='35px';
          mainDiv.style.lineHeight='40px';
          mainDiv.style.textAlign='center';
//          mainDiv.prototype.
          let closeimgDiv = document.createElement('div');
          closeimgDiv.className = 'closeImgDiv';
          let closeimg = document.createElement('img');
          closeimg.src = this.closeImg;
          closeimg.className = 'closeImg';
          closeimgDiv.appendChild(closeimg);
          mainDiv.appendChild(closeimgDiv);
          closeimg.addEventListener('click', function (event) {
            that.clearEdit();
            event.stopPropagation();
          });
          closeimg.addEventListener('mouseover', function () {
//            that.closeImg=conf.IMG.CLOSE_IMG_HOVER;
            this.setAttribute('src', './static/images//mapCtr/close_hover.png');
          });
          closeimg.addEventListener('mouseout', function () {
//            that.closeImg=conf.IMG.CLOSE_IMG;
            this.setAttribute('src', './static/images//mapCtr/close.png')
          });
          var marker = new minemap.Marker(mainDiv, {offset: [-78,10]})
            .setLngLat(lnglat).addTo(that.map);//.setPopup(that.covers.popup);
          that.covers.closeMarker=marker;
        },
        addMarker(lnglat){
          let that = this;
          this.map=this.$store.state.map;
          this.lnglat=lnglat.toString();
          this.clearMarker();
          let el = document.createElement('div');
          el.id = 'marker';
          el.style["background-image"] = "url(" + this.mar_icon + ")";
          el.style["background-size"] = "cover";
          el.style.width = "30px";
          el.style.height = "38px";
          el.style.cursor = "pointer";
          var marker = new minemap.Marker(el, {offset: [-15, -19]})
            .setLngLat(lnglat).addTo(that.map);//.setPopup(that.covers.popup);
          that.covers.markers.push(marker);
        },
        copyLnglat(){
          var Url2=document.getElementById("lnglatInput");
          Url2.select(); // 选择对象
          document.execCommand("Copy"); // 执行浏览器复制命令
          this.$message({message: "已复制好，可贴粘。", type: "success", duration: 1000});
//          this.showLnglatDiv=false;
//          this.closingPopup();
        },
        clearEdit(){
          this.showLnglatDiv=false;
          this.$store.state.cursor='pointer';
          this.lnglat='';
          if (this.map.getLayer("measure-points") != undefined) {
            this.map.setLayoutProperty("measure-points", 'visibility', 'none');
          };
          if (this.map.getLayer("measure-lines") != undefined) {
            this.map.setLayoutProperty("measure-lines", 'visibility', 'none');
          };
          this.geojson.features=[];
          this.linestring.geometry.coordinates=[];
          this.clearMarker();
          this.closingPopup();
        },
        clearMarker(){
          this.covers.markers.forEach((e)=>{
            e.remove();
          });
          this.covers.markers.length=0;
        },
        closingPopup(type){
          let map = this.map;
          if (type == undefined) {
            this.covers.markers.forEach(function (e) {
              e.remove();
            });
            this.covers.markers = [];
            this.initPopup();
            if (this.covers.popups.length > 0) {
              this.covers.popups.forEach(function (e) {
                e.remove();
              })
            };
            this.covers.popups = [];
            if(this.covers.closeMarker!=undefined){this.covers.closeMarker.remove();}
          } else {
            //
          };
        },
        insertLog(content,name){
          conf.interf.insertLog({userName:sessionStorage.getItem('fullname'),content:content+','+name}).then((res) => {
          })
        }
      },
      beforeDestroy(){
        if(this.$store.state.map.getSource('geojson')){
          this.$store.state.map.removeSource('geojson');
        }
        if (this.$store.state.map.getLayer("measure-points") != undefined) {
          this.$store.state.map.removeLayer("measure-points");
        }
        if (this.$store.state.map.getLayer("measure-lines") != undefined) {
          this.$store.state.map.removeLayer("measure-lines");
        }
      },
      destroyed(){
//          console.log('销毁组件');
        this.clearMarker();
        this.closingPopup();
      }
    }
</script>
<style scoped="true">
.toolDiv{    width: auto;
  text-align: right;
  position: fixed;
  top: 14%;
  right: 1%;}
.toolDiv .tool{float: right;}
.toolDiv .tool .el-button{padding:12px 20px;width: auto;border-radius:25px;}
.toolDiv .el-button{background-color: #0c46a4;border:none;height:40px;width:auto;color: white;text-align: center;}
.toolDiv .el-button:hover{background-color: #1c55a4;}
.el-icon-share:before{
content:url(../../../static/images/mapCtr/tool.png);
}
.map_ctr{width:120px;}
.toolDiv .tool .el-button span{
margin-top: 2px;
display: block;
float: right;
margin-left: 15px;
}
.toolDiv .export{float: right;top:7%;right:1%;}
.toolDiv .export .el-button{border:none;}
.toolDiv .layer-lnglat-div{background-color: #0b47a4;
border-radius: 25px;text-align: left;
/* border: 1px solid #00c6ff; */
width: 16vw;float: right;}
.space{float:right;width:10px;height:25px;}
.layer-lnglat-div .el-input-group{height:100%;width:75%;border:none;border-radius: 50% 0 0 50%;}
.layer-lnglat-div>.el-button{float:right;background-color: transparent;border:none;text-decoration: underline;color:#00AEFF;}
</style>
