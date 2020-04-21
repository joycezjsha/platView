<template>
  <div class="container">
    <div id="map"></div>
    <div class="map_contrl">
        <img class="control_size" @click="setPitch('click')" :src="iconPitch">
        <img class="control_size" @click="setRoadCondition" :src="iconTraffic" />
        <div :style="compassBoxStyle" @click="setCompassRotate">
          <img class="map-ctrl-compass" :src="iconCompass">
        </div>
        <img class="control_size" style="margin-top: 1vh" @click="setZoomIn" :src="iconZoomIn" />
        <img class="control_size" style="margin-top: 1vh" @click="setZoomOut" :src="iconZoomOut" />
      </div>
  </div>
</template>

<script>
  import conf from './config'
  export default
  {
    name:'MyMap',
    data (){
      return {
        map: '',
        iconZoomOut: conf.IMG.iconZoomOut,
        iconZoomIn: conf.IMG.iconZoomIn,
        iconCompass:conf.IMG.iconCompass,
        iconPitch2d:conf.IMG.iconPitch2d,
        iconPitch3d:conf.IMG.iconPitch3d,
        iconTraffic:conf.IMG.iconTraffic,
        iconRoadCondition:'',
        show3D:false,
        compassBoxStyle:{"display":"flex","align-items": "center","justify-content":"center","background":"url("+conf.IMG.iconCompassBG+")","background-repeat":"no-repeat","width":"48px","height": "48px"},
        trafficArr:[],
        isShowTraffic:true,
        trafficParticleIds:[]
      }
    },

    mounted()
    {
      let _this=this;
      _this.initMap();
    },
    computed:{
      iconPitch:function(){
        return this.show3D ? this.iconPitch3d : this.iconPitch2d;
      }
    },
    methods:{
      initMap(){
          let _this=this;
        minemap.domainUrl = mapConfig.BASE_URL;
        minemap.dataDomainUrl = mapConfig.DOMAIN_URL;
        minemap.spriteUrl = mapConfig.spriteUrl;//mapConfig.BASE_URL + '/minemapapi/v2.0.0/sprite/sprite';
        minemap.serviceUrl = mapConfig.BASE_URL + '/service';
        minemap.accessToken = mapConfig.ACCESS_TOKEN;
        minemap.solution = mapConfig.SOLUTION;
        this.map = new minemap.Map({
          container: 'map',
          style: mapConfig.BASE_URL + "/service/solu/style/id/" + mapConfig.SOLUTION,
          center: mapConfig.DEFAULT_CENTER,
          zoom: mapConfig.DEFAULT_ZOOM,
          pitch: mapConfig.DEFAULT_PITCH,
          maxZoom: mapConfig.MAX_ZOOM,
         minZoom: mapConfig.MIN_ZOOM
        });
        this.map.addControl(new minemap.Scale(),"bottom-left");
        this.map.resize();
        this.$store.state.map = this.map;
       this.map.on('load',function(){
         _this.getTrafficLayer();
        
       });
       _this.map.on("move", _this.setCompassRotateIcon);
      },
      //隐藏或者显示路况
      setRoadCondition(e){
        this.isShowTraffic=!this.isShowTraffic;
        if(this.isShowTraffic){
          this.showTraffic('visible');
          this.iconTraffic=conf.IMG.iconTraffic;
        }else{
          this.showTraffic('none');
          this.iconTraffic=conf.IMG.icon_traffic_hide;
        }
      },
      //
      showTraffic(val){
        let that = this;
        if(that.trafficArr.length>0){
          for (let i = 0; i < that.trafficArr.length; i++) {
            if(that.map.getLayer(that.trafficArr[i])) {
              that.map.setLayoutProperty(that.trafficArr[i], 'visibility', val);
                 that.map.setLayoutProperty(that.trafficArr[i], 'line-cap', 'butt');
                 that.map.setLayoutProperty(that.trafficArr[i], 'line-round-limit', '2');
               that.map.setLayoutProperty(that.trafficArr[i], 'line-miter-limit', '3');
               that.map.setLayoutProperty(that.trafficArr[i], 'strokeStyle', '');
            }
          }
          for (let i = 0; i < that.trafficParticleIds.length; i++) {
            if(that.map.getLayer(that.trafficParticleIds[i])) {
              that.map.setLayoutProperty(that.trafficParticleIds[i], 'visibility', val);
            }
          }
        }
      },
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
      //获取路况图层数据
      getTrafficLayer(){
        let that=this;
        conf.interf.TRAFFIC_API(mapConfig.BASE_URL+"/service/solu/"+mapConfig.SOLUTION+'?token='+mapConfig.ACCESS_TOKEN,{}).then((res) => {
          let data=res.data;
          if(data.data.rows[0].layers){
            let arr = data.data.rows[0].layers;
            let idarr = [];
            for (let i = 0; i < arr.length; i++) {
              let content = JSON.parse(arr[i].content || '{}')
              if (content['source'] == 'Traffic'  && content['source-layer'] == 'Trafficrtic') {
                that.trafficArr.push(arr[i].id);
              };
              if(content['source'] == 'DynamicTraffic' && content['source-layer'] == 'link'){
                that.trafficParticleIds.push(arr[i].id);
              }
            }
          }
        });
      },
    },
    destroyed: function () {
      console.log('destroyed is Map')
    }

  }
</script>
<style scoped lang="scss">
  * {
    padding: 0;
    margin: 0;
  }

  .container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  #map {
    width: 100%;
    height: 100%;
  }
  .map_contrl{
      cursor: pointer;
       position: fixed;bottom: 10vh;right: 1vw;z-index: 1;display: flex;flex-direction: column;
      .control_size{
        color:white;
      }
      .map-ctrl-compass{width: auto;height: 65%;}
    }
</style>
