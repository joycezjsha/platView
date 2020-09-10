<template>
  <div class="accident-map">
    <div class='accident-map--legend'>
      <ul>
        <li v-for='(item,index) in areaList' :key='index'>{{item}}</li>
      </ul>
      <div class='legend'></div>
    </div>
    <div class='accident-map--icon'>
      <ul>
        <li><div>警情</div><div><img :src='jqImg' /></div></li>
        <li><div>施工</div><div @click='showOrhideConstru'><img :src='sgImg' /></div></li>
        <li><div>视频巡查</div><div @click='showOrhideSp'><img :src='xcImg' /></div></li>
        <li><div>应急调度</div><div @click='showOrhideEmergency'><img :src='spImg' /></div></li>
      </ul>
    </div>
    <t-area :indexData='areaIndexs' :isShowTxt='isShowTxt' :isShowArea='showArea' ref='areaModule'></t-area>
    <!-- <t-area v-if='showArea' :indexData='areaIndexs' :isShowArea='showArea' :isShowTxt='isShowTxt'></t-area> :method='clickAreaEvent'-->
  </div>
</template>

<script>
import blur from "@/blur";
import { interf } from "./config";
import { IMG } from "./config";
import tArea from "@/components/area/area.vue";
export default {
  name: "overview_left",
    data() {
    return {
      map: {},
      isShowTxt:false,
      tableIndex:0,
      map_cover:{
        sourceList:[],
        lineList:[],
        markers:[],
        popups:[],
        cons_markers:[],
        cons_popups:[]
      },
      showArea:false,
      areaIndexs:[],
      jqImg:IMG.jqImg,
      sgImg:IMG.SG_UNCHECK_IMG,
      spImg:IMG.SP_UNCHECK_IMG,
      xcImg:IMG.XC_UNCHECK_IMG,
      areaList:[],
      ConstructionData:[],
      showConstruction:false,
      showEmergency:false,
      emergencyData:[],
      showSp:false,
      spData:[]
    };
  },
  mounted() {
    let _this=this;
    this.map = this.$store.state.map;
    this.map.setCenter([109.278987,35.747334]);
    setTimeout(()=>{this.getAreaData();this.getConstructionData();},1000);
    blur.$on('clearRoadAndMaker',function(){
      _this.cancelCityLayerStatus();
    });
    blur.$on('changeCitySelect',function(data){
      _this.addCityAccidentPopup(data);
    });
    this.map.loadImage('./static/images/emergency.png', function(error, image) {
      if (error) throw error;
      _this.map.addImage('emergency', image);
    });
    this.map.loadImage('./static/images/sp.png', function(error, image) {
      if (error) throw error;
      _this.map.addImage('sp', image);
    });
  },
  components: {
    tArea
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
  },
  methods: {
    /**
     * 左侧选择时间范围，地图标注时间范围内的重大警情、
     */
    initDistributionMap(data){
      this.clearMap();
      this.getAreaData(data);
      this.getConstructionData(data);
    },
    /**
     * 显示各城市填充数据
     */
    getAreaData(data){
      let that=this;
      let params={stime:1};
      that.areaIndexs=[];
      if(data){
        params.stime=data.time[0];
        params.etime=data.time[1];
      }
      interf.GET_MAP_CITY_ACCI_API(params).then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
            let max,min,datas=[];
              data.data=data.data.map(e=>{
                e.Num=e.NUM;
                if(!max){
                  max=e.Num;
                }else{
                  max=max<e.Num?e.Num:max;
                }
                if(!min){
                  min=e.Num;
                }else{
                  min=min>e.Num?e.Num:min;
                };
                return e;
              });
              that.areaIndexs=data.data;
              that.areaList.push(max,(max-min)/2+min,min);
              console.log(that.areaList)
              that.showArea=true;
          }else{
            that.$message({
            message: response.errmsg,
            type: "error",
            duration: 1500
          });
          }
        }
      })
      .catch(err=>{
         that.$message({
            message: '请求服务失败',
            type: "error",
            duration: 1500
          });
      })
      .finally(() => {
      });
    },
    addCityAccidentPopup(xzqh){
      let _this=this;
      let data=this.areaIndexs;
      _this.map_cover.popups.forEach(e=>{
          e.remove();
        });
      for(let i=0;i<data.length;i++){
        if(data[i].XZQH==xzqh){
          _this.addCityPopup(data[i]);
        }
      }
      // data.map(e=>{
        // _this.addCityPopup(e);
      // })
    },
    /**
     * 地图显示各市警情数量
     */
    addCityPopup(e){
      let that=this;
      let lnglat=e.jwd.split(' ');
      let mainDiv=document.createElement('div');
      mainDiv.style.width='6vw';
      mainDiv.style.fontSize='0.7vw';
      mainDiv.style.color='white';
      // mainDiv.style.backgroundColor='rgba(3, 12, 32, 0.74)';
      // mainDiv.style.border='1px solid rgb(42, 76, 162)';
      // mainDiv.style.fontFamily='SourceHanSansCN';
      // mainDiv.style.padding='4px 13px';
      // mainDiv.className='dev_popup';

      let title=document.createElement('p');
      title.innerHTML=e.NAME;
      title.className='title';
      title.style.margin='5px 0';

       let closeimgDiv = document.createElement("div");
      closeimgDiv.className = "closeImgDiv";
      let closeimg = document.createElement("img");
      closeimg.src = IMG.CLOSE_IMG;
      closeimg.className = "closeImg";
      closeimgDiv.appendChild(closeimg);
      title.appendChild(closeimgDiv);
      closeimg.addEventListener("click", function() {
        that.map_cover.popups.forEach(e=>{
          e.remove();
        });
      });
      closeimg.addEventListener("mouseover", function() {
        this.setAttribute("src", IMG.CLOSE_HOVER_IMG);
      });
      closeimg.addEventListener("mouseout", function() {
        this.setAttribute("src", IMG.CLOSE_IMG);
      });

      mainDiv.appendChild(title);

      let p1="<p style='color:#00C6FF;margin:5px 0;'><span>警情：</span><span>"+e.NUM+"</span></p>";
      mainDiv.appendChild($(p1)[0]);
      
      // let popup=new minemap.Popup({closeOnClick: false, closeButton: true, offset: [-8, -13]});
      // popup.setLngLat(lnglat).setDOMContent(mainDiv).addTo(this.map);

      // let el = document.createElement('div');
      // // el.style["background-image"] = "url(./static/images/"+(e.KKZT>1?"kakou":"kakou_")+".png)";
      // // el.style["background-size"] = "100% 100%";
      // el.style.width = "8px";
      // el.style.height = "8px";
      // el.style["border-radius"] = "50%";
      // el.style.backgroundColor='red';
      // let marker = new minemap.Marker(mainDiv, {offset: [-8, -8]}).setLngLat(lnglat).addTo(this.map);
      // this.map_cover.markers.push(marker);
      let popup=new minemap.Popup({closeOnClick: false, closeButton: true, offset: [-8, -13]});
      popup.setLngLat(lnglat).setDOMContent(mainDiv).addTo(this.map);
      this.map_cover.popups.push(popup);
    },
    /**
     * 获取施工数据
     */
    getConstructionData(){
      let that=this;
      interf.GET_MAP_CONSTRUCTION_API({}).then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
             that.ConstructionData=data.data;
             if(that.showConstruction){
               that.addConstruction();
             }
          }else{
            that.$message({
            message: response.errmsg,
            type: "error",
            duration: 1500
          });
          }
        }
      })
      .catch(err=>{
         that.$message({
            message: '请求服务失败',
            type: "error",
            duration: 1500
          });
      })
      .finally(() => {
      });
    },
    /**
     * 显示或隐藏施工图层
     */
    showOrhideConstru(){
      this.showConstruction=!this.showConstruction;
      if(this.showConstruction){
        this.addConstruction();
        this.sgImg=IMG.SG_IMG;
      }else{
        this.sgImg=IMG.SG_UNCHECK_IMG;
         //清除marker
        if(this.map_cover.cons_markers.length>0){
          this.map_cover.cons_markers.forEach(e=>{
            e.remove();
          })
        }
        this.map_cover.cons_markers=[];
        //清除popup框
        if(this.map_cover.cons_popups.length>0){
          this.map_cover.cons_popups.forEach(e=>{
            e.remove();
          })
        }
        this.map_cover.cons_popups=[];
      }
    },
    addConstruction(){
      let _this=this;
      if(_this.ConstructionData && _this.ConstructionData.length>0){
        _this.ConstructionData.map(e=>{
          _this.addMainAccidentPopup(e);
        })
      };
    },
    /**
     * 地图显示施工图层
     */
    addMainAccidentPopup(e){

      let lnglat=e.EventCoordinate.split(' ');
      let mainDiv=document.createElement('div');
      mainDiv.style.width='13vw';
      mainDiv.style.fontSize='0.7vw';
      mainDiv.style.color='white';
      // mainDiv.className='dev_popup';

      let title=document.createElement('p');
      title.innerHTML='道路施工';
      title.className='title';
      title.style.fontSize='0.7vw';
      mainDiv.appendChild(title);

      let p1="<p style='margin:5px 0;'><span>所属城市：</span><span>"+e.nameCN+"</span></p>";
      mainDiv.appendChild($(p1)[0]);
       let p2="<p style='margin:5px 0;'><span>描述：</span><span>"+e.EventDescription+"</span></p>";
      mainDiv.appendChild($(p2)[0]);

      let popup=new minemap.Popup({closeOnClick: true, closeButton: true, offset: [5, -5]});
      popup.setLngLat(lnglat).setDOMContent(mainDiv);

      let el = document.createElement('div');
      el.style["background-image"] = "url("+IMG.SG_IMG+")";
      el.style["background-size"] = "100% 100%";
      el.style.width = "32px";
      el.style.height = "32px";
      let marker = new minemap.Marker(el, {offset: [-8, -8]}).setLngLat(lnglat).addTo(this.map).setPopup(popup);
      this.map_cover.cons_markers.push(marker);
      this.map_cover.cons_popups.push(popup);
    },
    /**
     * 地图点击事件，回调绑定事件
     */
    clickAreaEvent(data){
      blur.$emit('setCurrentCityRow',data.name);
      blur.$emit('initAccidentStatics',0,data);
    },
    /**
     * 是否取消地图区域选中
     */
    cancelCityLayerStatus(){
      this.$refs['areaModule'].resumeLayer();
      this.map.setPitch(0);
      this.clearMap();
    },
/**视频巡查 */
    /**
     * 点击-打开或关闭视频巡查图层
     */
    showOrhideSp(){
      this.showSp=!this.showSp;
      if(this.showSp){
        this.hideOrShowSpLayer(true);
        this.xcImg=IMG.XC_IMG;
        this.map.on('click',this.clickSpeedDevice);
      }else{
        this.xcImg=IMG.XC_UNCHECK_IMG;
        this.hideOrShowSpLayer(false);
      }
    },
    /**
     * 获取应急处置数据
     */
    getSpData(){
      let that=this;
      interf.GET_SP_API({}).then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
            that.spData=data.data;
             that.addSpMarker();
          } else{
            that.$message({
              message: '请求服务失败',
              type: "error",
              duration: 1500
            });
          }
        }
      })
      .catch(err=>{
         that.$message({
            message: '请求服务失败',
            type: "error",
            duration: 1500
          });
      })
      .finally(() => {
      });
    },
    /**
     * 地图添加视频巡查图层
     */
    addSpMarker(){
      let data=this.spData;
      if(data.length<1){
        this.getSpData();
        return;
      }
      let that=this;
      let jsonData = {
          "type": "FeatureCollection",
          "features": []
      };
      data.forEach(e=>{
        if(e.KKJD!='' && e.KKWD!=''){
          jsonData.features.push({
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [e.KKJD,e.KKWD]
          },
          "properties": {
            "SBBH": e.KKBH,
            "SBMC": e.KKMC
          }
          });
        }
      })
        this.map.addSource("spSource", {
            "type": "geojson",
            "data": jsonData
        });
        this.map_cover.sourceList.push('spSource');
        this.map.addLayer({
            "id": "spLayer",
            "type": "symbol",
            "source": "spSource",
            "layout": {
                "visibility": "visible",
                "icon-image": "sp",
                "icon-size": 2,
                // "text-field": "{title}",
                // "text-offset": [0, 0.6],
                // "text-anchor": "top",
                // "text-size": 14,
                "icon-allow-overlap": false,  //图标允许压盖
                // "text-allow-overlap": true,   //图标覆盖文字允许压盖
            },
            "paint": {
                "icon-color": {
                    "type": "categorical",
                    "property": "kind",
                    "stops": [["school", "#ff0000"], ["park", "#00ff00"], ["hospital", "#0000ff"]],
                    "default": "#ff0000"
                },
                "text-color": {
                    "type": "categorical",
                    "property": "kind",
                    "stops": [["school", "#ff0000"], ["park", "#00ff00"], ["hospital", "#0000ff"]],
                    "default": "#ff0000"
                },
                "text-halo-color": "#000000",
                "text-halo-width": 0.5,
            },
            "minzoom": 3,
            "maxzoom": 17.5
        });
        this.map_cover.lineList.push('spLayer');
    },
    /**
     * 隐藏或者显示视频巡查图层
     */
    hideOrShowSpLayer(f){
      let val='visible';
      if(!f){
        val='none';
        if(this.map_cover.popups.length>0){
          this.map_cover.popups.forEach(e=>{
            e.remove();
          })
        }
        this.map_cover.popups=[];
      };
      if(this.map.getLayer('spLayer')!=undefined){
        this.map.setLayoutProperty('spLayer', 'visibility', val);
      }else{
        if(f) this.addSpMarker();
      }
    },
/**视频巡查 --END */
/**应急处置 */
    /**
     * 点击-打开或关闭应急处置数据
     */
    showOrhideEmergency(){
      this.showEmergency=!this.showEmergency;
      if(this.showEmergency){
        this.hideOrShowEmergencyLayer(true);
        this.spImg=IMG.SP_IMG;
        this.map.on('click',this.clickSpeedDevice);
      }else{
        this.spImg=IMG.SP_UNCHECK_IMG;
        this.hideOrShowEmergencyLayer(false);
      }
    },
    /**
     * 获取应急处置数据
     */
    getEmergencyData(){
      let that=this;
      interf.GET_EMERGENCY_API(function(response){
        if (response && response.errcode == 0){
          that.emergencyData = response.data.list;
          that.addEmergencyMarker();
        }else{
            that.$message({
              message: '请求服务失败',
              type: "error",
              duration: 1500
            });
          }
      },function(err){

      });
      
    },
    /**
     * 地图添加应急处置图层
     */
    addEmergencyMarker(){
      let data=this.emergencyData;
      if(data.length<1){
        this.getEmergencyData();
        return;
      }
      let that=this;
      let jsonData = {
          "type": "FeatureCollection",
          "features": []
      };
      data.forEach(e=>{
        if(e.center && e.center!=''){
          let c=e.center.match("\\((.+?)\\)")[1];
          if(c && c!=''){
            c=c.split(' ');
            jsonData.features.push({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [c[0],c[1]]
            },
            "properties": {
              "gwlxmc": e.gwlxmc,
              "gwmc": e.gwmc,
              "ssdwmc":e.ssdwmc,
              "isPerson":e.isPerson
            }
            });
          }
        }
      })
        this.map.addSource("emergencySource", {
            "type": "geojson",
            "data": jsonData
        });
        this.map_cover.sourceList.push('emergencySource');
        this.map.addLayer({
            "id": "emergencyLayer",
            "type": "symbol",
            "source": "emergencySource",
            "layout": {
                "visibility": "visible",
                "icon-image": "emergency",
                "icon-size": 1.1,
                // "text-field": "{title}",
                // "text-offset": [0, 0.6],
                // "text-anchor": "top",
                // "text-size": 14,
                "icon-allow-overlap": false,  //图标允许压盖
                // "text-allow-overlap": true,   //图标覆盖文字允许压盖
            },
            "paint": {
                "icon-color": {
                    "type": "categorical",
                    "property": "kind",
                    "stops": [["school", "#ff0000"], ["park", "#00ff00"], ["hospital", "#0000ff"]],
                    "default": "#ff0000"
                },
                "text-color": {
                    "type": "categorical",
                    "property": "kind",
                    "stops": [["school", "#ff0000"], ["park", "#00ff00"], ["hospital", "#0000ff"]],
                    "default": "#ff0000"
                },
                "text-halo-color": "#000000",
                "text-halo-width": 0.5,
            },
            "minzoom": 3,
            "maxzoom": 17.5
        });
        this.map_cover.lineList.push('emergencyLayer');
    },
    /**
     * 隐藏或者显示应急处置图层
     */
    hideOrShowEmergencyLayer(f){
      let val='visible';
      if(!f){
        val='none';
        if(this.map_cover.popups.length>0){
          this.map_cover.popups.forEach(e=>{
            e.remove();
          })
        }
        this.map_cover.popups=[];
      };
      if(this.map.getLayer('emergencyLayer')!=undefined){
        this.map.setLayoutProperty('emergencyLayer', 'visibility', val);
      }else{
        if(f) this.addEmergencyMarker();
      }
    },
/**应急处置 --END */
    /**
     * 地图点击图层-回调
     */
    clickSpeedDevice(event){
      let renderLayerIds = ["emergencyLayer"];
      let features = this.map.queryRenderedFeatures(event.point, {
        layers: renderLayerIds
      });
      if(features && features.length > 0) {
        let e=features[0].properties;
        let lnglat=[event.lngLat.lng,event.lngLat.lat];
        let mainDiv=document.createElement('div');
        mainDiv.style.width='8vw';
        mainDiv.style.fontSize='0.7vw';
        mainDiv.style.color='white';
        // mainDiv.style.backgroundColor='rgba(3, 12, 32, 0.74)';
        // mainDiv.style.border='1px solid rgb(42, 76, 162)';
        mainDiv.style.fontFamily='SourceHanSansCN';
        mainDiv.style.padding='4px 13px';

        let title=document.createElement('p');
        title.innerHTML=e.gwmc;
        title.className='title';
        title.style.margin='5px 0';

        mainDiv.appendChild(title);

        let p1="<p style='color:#00C6FF;margin:5px 0;'><span>管理部门：</span><span>"+e.ssdwmc+"</span></p>";
        mainDiv.appendChild($(p1)[0]);

        // let p2="<p style='color:#00C6FF;margin:5px 0;'><span>设备名称：</span><span>"+e.SBMC+"</span></p>";
        // mainDiv.appendChild($(p2)[0]);

        // let p3="<p style='color:#00C6FF;margin:5px 0;'><span>管理管理部门：</span><span>"+e.CITY+"</span></p>";
        // mainDiv.appendChild($(p3)[0]);

        // let marker = new minemap.Marker(mainDiv, { offset: [-25, -25] })
        //   .setLngLat(lnglat)
        //   .addTo(this.map);
        // this.map_cover.markers.push(marker);
        
        let popup=new minemap.Popup({closeOnClick: true, closeButton: true, offset: [-8, -13]});
        popup.setLngLat(lnglat).setDOMContent(mainDiv).addTo(this.map);
        this.map_cover.popups.push(popup);
      }
      let renderLayerId = ["spLayer"];
      let feature = this.map.queryRenderedFeatures(event.point, {
        layers: renderLayerId
      });
      if(feature && feature.length > 0) {
        let e=feature[0].properties;
        let lnglat=[event.lngLat.lng,event.lngLat.lat];
        let mainDiv=document.createElement('div');
        mainDiv.style.width='8vw';
        mainDiv.style.fontSize='0.7vw';
        mainDiv.style.color='white';
        // mainDiv.style.backgroundColor='rgba(3, 12, 32, 0.74)';
        // mainDiv.style.border='1px solid rgb(42, 76, 162)';
        mainDiv.style.fontFamily='SourceHanSansCN';
        mainDiv.style.padding='4px 13px';
        let title=document.createElement('p');
        title.innerHTML='['+e.SBBH+']';
        title.className='title';
        title.style.margin='5px 0';

        mainDiv.appendChild(title);

        let p1="<p style='color:#00C6FF;margin:5px 0;'><span></span>设备编号：</span><span>"+e.SBMC+"</span></p>";
        mainDiv.appendChild($(p1)[0]);

        // let p2="<p style='color:#00C6FF;margin:5px 0;'><span>设备名称：</span><span>"+e.SBMC+"</span></p>";
        // mainDiv.appendChild($(p2)[0]);

        // let p3="<p style='color:#00C6FF;margin:5px 0;'><span>管理管理部门：</span><span>"+e.CITY+"</span></p>";
        // mainDiv.appendChild($(p3)[0]);

        // let marker = new minemap.Marker(mainDiv, { offset: [-25, -25] })
        //   .setLngLat(lnglat)
        //   .addTo(this.map);
        // this.map_cover.markers.push(marker);
        
        let popup=new minemap.Popup({closeOnClick: true, closeButton: true, offset: [-8, -13]});
        popup.setLngLat(lnglat).setDOMContent(mainDiv).addTo(this.map);
        this.map_cover.popups.push(popup);
      }
    },
/*##清除地图加载点、线、面、弹框*/
    clearMap(){
      //清除source
      if(this.map_cover.sourceList.length>0){
        this.map_cover.sourceList.forEach(e=>{
          if(this.map.getSource(e)!=undefined){
            this.map.removeSource(e);
          }
        })
      }
      //清除layer
      if(this.map_cover.lineList.length>0){
        this.map_cover.lineList.forEach(e=>{
          if(this.map.getLayer(e)!=undefined){
            this.map.removeLayer(e);
          }
        })
      }
      //清除marker
      if(this.map_cover.markers.length>0){
        this.map_cover.markers.forEach(e=>{
          e.remove();
        })
      }
      //清除popup框
      if(this.map_cover.popups.length>0){
        this.map_cover.popups.forEach(e=>{
          e.remove();
        })
      }
      this.map_cover={
          sourceList:[],
          lineList:[],
          markers:[],
          popups:[]
        }
    },
/** */
  }
};
</script>
<style scope lang='scss'>
@import '@/assets/css/color.scss';
@mixin flex($direction,$justify,$align) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}

.accident-map {
  position: fixed;
  z-index: 10;
  left: 500px;
  width: 108px;
  height: 380px;
  bottom: 13px;
  padding:20px 15px;
  background-color:#010416;
  color:$color-white;
  // @include flex(column, center,center);
  &--legend{
    width:100%;
    height:180px;
    ul{
      padding: 0 20px 0 0;
      // display: inline-block;
      width:55px;
      height:100%;
      text-align:center;
      float:left;
      @include flex(column, center,center);
      li{
        width:100%;
        height:33%;
        @include flex(column, center,center);
        align-items: flex-end;
        justify-content: flex-end;
      }
      >li:nth-child(1){
        justify-content: end;
      }
      >li:nth-child(2){
       padding-bottom: 25px;
      }
    }
   .legend{
     display: inline-block;
     width:12px;
     height:180px;
    //  opacity: 0.82;
     border-radius: 8px;
     background-image:linear-gradient(0deg,rgba(6,143,230,0.82),rgba(246,197,0,0.82),rgba(255,127,64,0.82));
     opacity:0.5
   }
  }
  &--icon{
    width:100%;
    height:110px;
    margin-top:20px;
    ul{
      padding:0;
      li{
        line-height:45px;
        div{
          display:inline-block;
          
          text-align:center;
          font-size: 14px;
        }
        div:nth-child(1){
          width:55%;
        }
        div:nth-child(2){
          width:45%;
          img{
            vertical-align: middle;
            margin-bottom: 8px;
            margin-left:5px;
            width:31px;
          }
        }
      }
      li:nth-child(2),li:nth-child(3){
        div:nth-child(2){
          img{
            cursor:pointer;
          }
        }
      }
    }
    
  }
}

</style>
<style lang='scss'>

</style>