<template>
  <div class="vehicle-middle" >
    <div @click="realtime(1)" >
      <m-title label='车辆实时监测' class="car" :img_type='tableIndex==1?"1":"0"'></m-title>
    </div>
    <div @click="realtime(2)" >
      <m-title label='车辆归属地OD' class="car" :img_type='tableIndex==2?"1":"0"'></m-title>
    </div>
   <div @click="realtime(3)">
      <m-title  label='热点卡口道路' class="car" :img_type='tableIndex==3?"1":"0"'></m-title>
   </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import mTitle from "@/components/UI_el/map_title_com.vue";
import mTab from '@/components/UI_el/tab.vue';
import blur from '../../blur.js';
export default {
    name:'vehicle_middle',
    data(){
        return{
            tableIndex:1,
            code:'',
            map_cover:{
              sourceList:[],
              lineList:[]
            },
        }
    },
    components:{
        mTitle,
        mTab,
        blur
    },
    mounted(){
        this.map = this.$store.state.map;
        this.map.setCenter(mapConfig.DEFAULT_CENTER);
        this.map.setZoom(8);
        this.getMapBayonetRankingDatas()
    },
    destroyed(){
      this.clearMap()
    },
    methods:{
      // 进入页面，默认实现聚合图，如果选择车辆类型，调用函数
      // 在调用之前清除之前的数据

      /* 
      * 接收传来的参数  getCity--车辆类型
      */
     getData(){
        blur.$on('getCitycar',data=>{
          this.code=data;
          // this.getMapBayonetRankingDatas(this.code)
        });
     },
        // 车辆实时监测
        realtime(i){    
            this.tableIndex=i;
            // let els=document.getElementsByClassName('.custom-popup-class');
            blur.$emit('realtime',this.tableIndex) 
            if(this.code!=""){
              this.getMapBayonetRankingDatas()
            }
            if(this.code==""){
              // this.getMapBayonetRankingDatas()
            }
            if(this.tableIndex!=1){
              this.onHideLayer()
            }else{
              this.onShowLayer()
              this.getMapBayonetRankingDatas()
            }
            
        },
        /*
        * 显示地图聚合图
        */
        onShowLayer() {
          let that=this;
          if (that.map) {
            if(this.map_cover.lineList.length>0){
              this.map_cover.lineList.forEach(e=>{
                if(this.map.getLayer(e)!=undefined){
                  that.map.setLayoutProperty(e, 'visibility', 'visible');
                }
              })
            } 
          }
        },
        /*
        * 隐藏地图聚合图
        */
        onHideLayer() {
          let that=this;
          if(this.map_cover.lineList.length>0){
            this.map_cover.lineList.forEach(e=>{
              if(this.map.getLayer(e)!=undefined){
                that.map.setLayoutProperty(e, 'visibility', 'none');
              }
            })
          }   
        },
    /**
    *	车辆实时监测   聚合图
    */
    getBayonetMapRank(item){
      let that=this;
      that.map = that.$store.state.map;
      if(that.map.getLayer('unclustered-points')!=undefined){
        that.map.setLayoutProperty('unclustered-points', 'visibility', 'visible');
        that.map.getSource("data-point").setData(item);
      }else{
        let jsonData={
          "type": "FeatureCollection", 
          "features": []
        }
        item.forEach(e=>{
          if(e.JWD){
            for(let i=0;i<e.NUM;i++){
              jsonData.features.push({
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates":e.JWD.split(" "),
                }
              })
            }    
          }
        })
        that.map.addSource("data-point", {
          type: "geojson",
          data: jsonData,  //"//117.157.231.168:80/minemapapi/demo/assets/poi_suzhou.json",
          cluster: true,
          clusterMaxZoom: 15,                    
          clusterRadius: 50,
          enableQueryChildren:false /*是否显示聚合详细信息，默认为false，如果为true，则开启显示详细信息功能，备注（如果开启显示详细信息功能，会引发性能问题，建议数据量较少（1000点以内）时使用）*/
        })
          that.map_cover.sourceList.push('data-point');
           //添加非聚合图层
           that.map.addLayer({
             "id": "unclustered-points",
             "type": "symbol",
             "source": "data-point",
             "filter": ["!has", "point_count"],
             "layout": {
               "icon-image": "bank-15"
               }
            })
            that.map_cover.lineList.push("unclustered-points"); 
            //添加聚合图层
              var layers = [
              [3,'#ff5a0f'], [5,'#D25C06'], [1,'#6C9B06']
              ];
              layers.forEach(function (layer, i) {
                let clusterId="cluster"+i;
                that.map.addLayer({
                  "id": clusterId, //+ i,
                  "type": "circle",
                  "source": "data-point",
                  "paint": {
                    "circle-color": layer[1],
                    "circle-radius": 18
                  },
                  "filter": i === 0 ?
                    [">=", "point_count", layer[0]] :
                    ["all", [">=", "point_count", layer[0]], ["<", "point_count", layers[i - 1][0]]]
                  })
                  that.map_cover.lineList.push(clusterId)
                });
                //添加数量图层
                 that.map.addLayer({
                    "id": "cluster-count",
                    "type": "symbol",
                    "source": "data-point",
                    "layout": {
                        "text-field": "{point_count}",
                        "text-size": 14
                    },
                    "paint":{
                        "text-color":"#ffffff"
                    },
                    "filter": ["has", "point_count"]
                }); 
                that.map_cover.lineList.push("cluster-count"); 
            }
    },
     /**
      * 车辆实时监测  地图显示  KeyVehicle/getMapBayonetRanking  GET_MAP_BAY_RANK_API
      */
      getMapBayonetRankingDatas(){
        let that=this;
        let MapBayonetData={};
        //  如果默认显示
        // 如果传入车辆类型code参数
        if(that.code!=''){
          MapBayonetData.code=that.code;
        }
          interf.GET_MAP_BAY_RANK_API(MapBayonetData)
          .then(response=>{
            if (response && response.status == 200){
              var data= response.data;
              if (data.errcode == 0 && that.tableIndex=='1') {
                that.getBayonetMapRank(data.data)
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
        //清除popup
        // if(this.map_cover.popups.length>0){
        //   this.map_cover.popups.forEach(e=>{
        //     e.remove();
        //   })
        // }
        //清除marker
        // if(this.map_cover.markers.length>0){
        //   this.map_cover.markers.forEach(e=>{
        //     e.remove();
        //   })
        // }
      },
       
    }

}
</script>

<style scoped lang='scss'>
@import "@/assets/css/color.scss";
@import "../../assets/css/base.css";
.vehicle-middle{
    position: fixed;
    top:93.5vh;
    left:34.53vw;
    width: 38.85vw;
    display: flex;
    .car{
        width:199px;
        height:39px;
        justify-content: space-around;
        line-height: 39px;
        cursor:pointer;
    }
    .car1{
        width:199px;
        height:39px;
        background:linear-gradient(90deg,rgba(59,79,101,1));
        border:1px solid;
        border-image:linear-gradient(-55deg, rgba(175,182,184,1)) 1 1;
        // background:url(../../../static/images/ui_image/title_bg_unchecked.png) no-repeat;
        // background-image: url(./static/images/ui_image/tab_bg.png);
        span{
            width:121px;
            height:20px;
            font-size:20px;
            font-family:Source Han Sans CN;
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height:25px;
        }
    }
}

</style>
