<template>
  <div class="electricPolice_city-div boxstyle">
    <div class="electricPolice_city_container">
      <div class='electricPolice_city_header'>
        <div @click='changeTable(0)'><m-title label='城市统计' :img_type='!tableIndex?"1":"0"' style='width:6vw;height:3.5vh;line-height:3.5vh;'></m-title></div>
        <div @click='changeTable(1)'><m-title label='道路统计' :img_type='tableIndex?"1":"0"' style='width:6vw;height:3.5vh;line-height:3.5vh;'></m-title></div>
      </div>
      <div class="electricPolice_city_content">
        <i class="iconfont icon-dianjing" style="color:#00aadd;position:absolute;top:6.5vh;left:1.416vw;font-size:20px;"></i>
        <m-tiptxt style="margin-left:1vw" text='活跃电警是指近一个月有抓拍违法数据的设备'></m-tiptxt>
        <div v-if="!tableIndex" style="padding:0 5px;width:98%;height:100%">
          <el-table :data="indexData" 
          v-loading='tableLoading'
             @row-click="handdleCity"
             style="width: 100%"  height="100%"  :default-sort = "{prop: 'COUNT', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
            <el-table-column  type="index" label="No" width="40"></el-table-column>
            <el-table-column prop="city" label="城市" width="55"></el-table-column>
            <el-table-column prop="COUNT" label="设备数量" sortable></el-table-column>
            <el-table-column prop="ACTIVENUM" label="活跃个数"  sortable></el-table-column>
            <el-table-column prop="ACTIVE" label="活跃率" sortable></el-table-column>
            <el-table-column prop="XZQH" v-if='showXZQH'  ></el-table-column>
          </el-table>
        </div>
        <div v-else>
            <span class='road_label'>道路类型筛选:</span><el-select v-model="road_type" placeholder="请选择道路类型">
               <el-option
                v-for="item in typeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          <el-table @row-click="handelRoad"
           v-loading='tableLoading'
          :data="roadDatas" style="width: 100%" height="100%" :default-sort = "{prop: 'NUM', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
            <el-table-column  type="index" label="No" width="50"></el-table-column>
            <el-table-column prop="NAME" label="道路名称"></el-table-column>
            <el-table-column prop="NUM" label="设备数量" sortable></el-table-column>
            <el-table-column prop="ACTIVE" label="活跃率" sortable></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import m_tiptxt from '@/components/UI_el/tiptxt.vue';
import mTitle from "@/components/UI_el/title_com.vue";
import blur from '../../blur.js';
export default {
  name: "TCruise",
  data() {
    return {
      map: {},
      XZQH:'',
      city:'',
      tableLoading:false,
      showXZQH:false,
      map_cover:{
        sourceList:[],
        lineList:[],
        markers:[],
        popups:[]
      },
      indexData: [],
      roadDatas:[],
      selectItem:{"city":"西安",order:8},
      areaColors:["#556B2F","#00FFFF","#0000EE","#8A2BE2","#c48f58","#9fcac4","#5ad2a0","#f18a52","#656bd4","#7ca0cd","#88b7dc","#a08bd3","#be7fcd","#30a2c4","#c0ccd7","#dbddab","#9cd076","#69b38b","#437fb9","rgb(255, 143, 109)"],
      timeRange:'',
      mapAddItems:{
        polygons:[],
        sourceList:[],
        lineList:[],
        popups:[]
      },
      activeName:'全部',
      tableIndex:0,
      typeOption:[
        {label:'全部道路',value:'0'},{label:'国/省道',value:'1'},{label:'高速',value:'2'},{label:'主干道',value:'3'}
      ],
      road_type:'0'
    };
  },
  components:{mTiptxt:m_tiptxt,mTitle},
  mounted() {
    this.map = this.$store.state.map;
    this.map.setCenter(mapConfig.DEFAULT_CENTER);
    this.map.setZoom(11);
    this.map.repaint = true;
    this.getIndexData();
    this.getCityStatisticsDatas();
    this.getRoadStatisticsDatas();
    blur.$on('clearMapRoad',()=>{this.clearMap();});
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
  },
  methods: {
    /**
     * 通过点击城市table表格传递参数  XZQH
    */
    handdleCity(row){
      let that=this;
      that.XZQH=row.XZQH;
      that.city=row.city;
      blur.$emit("sendXZQH",that.XZQH)
      blur.$emit("sendcity",that.city)
      that.centerTo(row.jwd.split(' '));
    },
    /*
    *	道路统计 Electronic/getRoadStatistics  GET_ROAD_STATIS_API
    */
   getRoadStatisticsDatas(){
     let that = this;
     that.roadDatas=[];
      that.tableLoading = true;
       interf.GET_ROAD_STATIS_API({})
        .then(response=>{
           that.tableLoading = false;
          if (response && response.status == 200){
            var data = response.data;
            if (data.errcode == 0) {
             that.roadDatas=data.data;
            }else{
              that.$message({
                message: '道路统计请求服务失败',
                type: "error",
                duration: 1500
                });
                 that.tableLoading = false;
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
    /**
     * 切换显示table类型
     * @param 0->城市统计，1->道路统计
     *  城市统计  Electronic/getCityStatistics   GET_CITY_STATIS_API
    */
    getCityStatisticsDatas(){
      let that = this;
      that.indexData=[];
      that.tableLoading = true;
      interf.GET_CITY_STATIS_API({})
      .then(response=>{
        that.tableLoading = false;
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
            for(var i=0;i<data.data.length;i++){
              if(data.data[1].city){
                that.indexData.push(data.data[i])
              }
            }
            // that.indexData=data.data;
          }else{
            that.$message({
              message: '城市统计请求服务失败',
              type: "error",
              duration: 1500
              });
              that.tableLoading = false;
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
    changeTable(t){
      this.tableIndex=t;
    },
    /**
    * 点击道路名称  触发事件
    */
     handelRoad(row, event, column){
      let data={};
      if(this.tableIndex){
        data.name=row.NAME;
        data.value=row.DLDM;
        this.getRoadMapDev(data.value)
      }
      blur.$emit('initCityOrRoadStatics',this.tableIndex,data,true);
    },
    /*
    * 道路上的设备  Electronic/getRoadMapDev   GET_ROAD_MAP_DEV_API
    */
   getRoadMapDev(id){
      let _this=this;
      this.hideRoadLine();
      this.map_cover.markers=[];
      interf.GET_ROAD_MAP_DEV_API({dldm:id}).then(response=>{
       if (response && response.status == 200){
         var data = response.data;
         if (data.errcode == 0) {
             _this.addRoadLine(data.data);
          }else{
            _this.$message({
              message: '道路上的设备获取数据失败',
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
        _this.tableLoading = false;
      });
   },
    /**
     * 地图显示道路上的设备、线
     */
    addRoadLine(data){
      let _this=this;
      let points=[];
      data.forEach(e=>{
        _this.addRoadMarker(e);
        points.push(e.JWD.split(' '));
      });
      let jsonData = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": points
                    }
                }
            ]
        };
      if(_this.map.getSource("device_lineSource")!=undefined){
        _this.map.getSource("device_lineSource").setData(jsonData);
        if(this.map.getLayer('device_lineLayer')!=undefined){
          this.map.setLayoutProperty('device_lineLayer', 'visibility', 'visible');
        };
      }else{
        _this.map.addSource("device_lineSource", {
            "type": "geojson",
            "data": jsonData
        });
        _this.map.addLayer({
          "id": "device_lineLayer",
          "type": "line",
          "source": "device_lineSource",
          "layout": {
              "line-join": "round",
              "line-cap": "round"
          },
          "paint": {
              "line-width": 8,
              "line-color": {
                  "type": "categorical",
                  "property": "kind",
                  "stops": [[1, "#ff0000"], [2, "#00ff00"]],
                  "default": "#0CA6FF"
              }
          },
          "minzoom": 3,
          "maxzoom": 17.5
        });
      this.map_cover.sourceList.push('device_lineSource');
      this.map_cover.lineList.push('device_lineLayer');
      }
      this.map.setCenter(points[0]);
    },
    /**
     * 地图显示道路上的设备
     */
    addRoadMarker(e){
      let lnglat=e.JWD.split(' ');
      let mainDiv=document.createElement('div');
      mainDiv.style.width='15vw';
      mainDiv.style.fontSize='0.8vw';
      mainDiv.className='dev_popup';
      let title=document.createElement('p');
      title.innerHTML=e.KKMC;
      title.className='title';
      mainDiv.appendChild(title);
      

      let p1="<p><span>设备ID：</span><span>"+e.KKBH+"</span></p>";
      mainDiv.appendChild($(p1)[0]);

      let p2="<p><span>地点：</span><span>"+e.DLMC+"</span></p>";
      mainDiv.appendChild($(p2)[0]);

      let p3="<p><span>类型：</span><span>"+e.LX+"</span></p>";
      mainDiv.appendChild($(p3)[0]);
      
      let popup=new minemap.Popup({closeOnClick: true, closeButton: true, offset: [0, -30]});
      popup.setLngLat(lnglat).setDOMContent(mainDiv);

      let el = document.createElement('div');
      el.style["background-image"] = "url(./static/images/"+(e.KKZT>1?"kakou":"kakou_")+".png)";
      el.style["background-size"] = "100% 100%";
      el.style.width = "30px";
      el.style.height = "30px";
      el.style["border-radius"] = "50%";
      let marker = new minemap.Marker(el, {offset: [-25, -25]}).setLngLat(lnglat).addTo(this.map).setPopup(popup);
      this.map_cover.markers.push(marker);
      this.map_cover.popups.push(popup);
    },
    //获取巡航数据
    getIndexData() {
      let that = this;
    //  interf.getCityIndexData({index:1},(data) => {
    //       },(e)=>{

    //       })
    $.ajax({
        url: "./static/json/city_accident_data.json", //globals.CRUISE_ALL_INFO_URL,
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
          if (data.errmsg == "success" && data.data.length > 0) {
            let datas=[];
            data.data.map(e=>{
              datas.push(
                {"city":e.areaName,"index":Math.round(e.areaTpi)*10/100,"week_radio":"+0.3%","his_radio":"-0.1%"}
              )
            });
            // that.indexDatas=datas;
            // that.addArea(data.data);
            // that.addAreaIdentify(data.data);
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          
        }
      });
    },
    /**
     * 地图添加辖区面
     * careated by ..
     */
    addArea(data){
      let _this=this;
      data.forEach((e,i)=>{
        let lonlats=_this.getLonlats(e.areaGeometry)[0].split(',');
        lonlats=lonlats.map(e=>{
          if(e.split(' ')[0]!=''){
            return [e.split(' ')[0],e.split(' ')[1]];
          }else{
            return [e.split(' ')[1],e.split(' ')[2]];
          }
         
        });
        let jsonData = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [lonlats]
                    }
                }
            ]
        };
        _this.areaColors[i];
        _this.mapAddItems.lineList.push('arealayerId_'+i);
        _this.mapAddItems.sourceList.push('areaSourceId_'+i);
        this.map.addPolygons(jsonData,this.map,'areaSourceId_'+i,'arealayerId_'+i,_this.areaColors[i]);
      })
      
    },
    /**
     * 添加指数悬浮框
     * careated by ..
     */
    addAreaIdentify(data){
      let that=this;
      data.forEach((item,i)=>{
        let newTpi = item.areaTpi;
        let newTpis = newTpi.toFixed(0);
        newTpi = (newTpi/10).toFixed(1);
        let curTpiColor = that.getTpiColor(newTpis);
        let w = 145;
        let h = 30;
        let tw = 113;
        if (item.areaName.length > 6) {
          h = 60;
        }
        //在地图上显示指数和道路名称
        let mainDiv = $("<div style='border:1px solid #9A9A9A;height: " + h + "px;width: "+w+"'></div>");
        let tpiDiv = $("<div class='tpi' style='width:30px;text-align: center;float:left;background:" + curTpiColor + ";color:#2c3453;height: " + h + "px'></div>");
        let tpiSpan = $("<span style='line-height:" + h + "px;font-weight: bold;font-size: 16px;margin-bottom: 8px;font-family: \"Microsoft YaHei\";'>" + newTpi + "</span>");
        tpiDiv.append(tpiSpan);
        mainDiv.append(tpiDiv);
        let nameDiv = $("<div style='width:" + tw + "px;float:left;background:#2c3453;color:#ffffff;height: " + h + "px;text-align: center;'></div>");
        let nameSpan = $("<span style='line-height:30px;font-weight: bold;font-size: 16px;margin-bottom: 8px;font-family: \"Microsoft YaHei\";'>" + item.areaName + "</span>");
        nameDiv.append(nameSpan);
        mainDiv.append(nameDiv);

        let pointPopup = new minemap.Popup({closeOnClick: false, offset: [0, 0], closeButton: false});
        pointPopup.setLngLat(item.areaCentry.split(" ")).setDOMContent(mainDiv[0]);
        pointPopup.addTo(that.map);
        this.mapAddItems.popups.push(pointPopup);
        $(".minemap-popup-content").css("padding", "0");
        $(".minemap-popup-tip").css("border-top-color", "#2c3453");
        //鼠标滚动改变地图层级
        mainDiv.on("mousewheel DOMMouseScroll", function (e) {
          let delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
            (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox
          if (delta > 0) {
            // 向上滚
            commonVariable.CURRENT_MAP.zoomIn();
          } else if (delta < 0) {
            // 向下滚
            commonVariable.CURRENT_MAP.zoomOut();
          }
        });
        mainDiv.click(function(){
          that.drawTeamIndexCharts(item);


        });
        })
    },
    getTpiColor(newTpi) {
        let tpiColor = ['#01bd58', '#91c955', '#f6f954', '#efbf1f',"#f00100"];
        let curTpiColor;
        if (newTpi < 20) {
          curTpiColor = tpiColor[0];
        } else if (newTpi >= 20 && newTpi < 40) {
          curTpiColor = tpiColor[1];
        } else if (newTpi >= 40 && newTpi < 60) {
          curTpiColor = tpiColor[2];
        } else if (newTpi >= 60 && newTpi < 80) {
          curTpiColor = tpiColor[3];
        } else if (newTpi >= 80) {
          curTpiColor = tpiColor[4];
        }
        return curTpiColor;
      },
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
                return "background:transparent;";
   },
  //取括号内数据
  getLonlats(str){
    let regex = /[^\(\)]+(?=\))/g;
    return str.match(regex);
  },
  /**
   * 地图移动到点击城市市中心
   */
  centerTo(center){
    this.map.flyTo({
            center: center,
            zoom: 8,
            bearing: 10,
            pitch: 0,
            duration: 2000
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
      this. map_cover={
          sourceList:[],
          lineList:[],
          markers:[],
          popups:[]
        }
    },
    hideRoadLine(){
      if(this.map_cover.markers.length>0){
        this.map_cover.markers.forEach(e=>{
          e.remove();
        })
      };
      if(this.map_cover.popups.length>0){
        this.map_cover.popups.forEach(e=>{
          e.remove();
        })
      }
      if(this.map.getSource("device_lineSource")!=undefined){
        if(this.map.getLayer('device_lineLayer')!=undefined){
          this.map.setLayoutProperty('device_lineLayer', 'visibility', 'none');
        };
      }
    }
/** */
  }
};
</script>
<style scope lang='scss'>
@import '@/assets/css/color.scss';
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.electricPolice_city-div {
  position: fixed;
  z-index: 10;
  left: 12px;
  width: 474px;
  height:977px;
  top: 9.5vh;
}
.electricPolice_city_container {
  width: 100%;
  height: 100%;
 .electricPolice_city_header{
    width:80%;
    height: 4vh;
    margin-top: 1px;
    >div{
      float:left;
      cursor:pointer;
    }
    >div:nth-child(2){
      margin-left:-1vw;
    }
  }
  .electricPolice_city_content {
    width: 98%;
    height: 87%;
    // background-color: $color-bg-1;
    margin: 1%;
    
    &_table {
      overflow-y: auto;
    }
    .road_label{
      color:$color-text-label;
      margin:0 1vw;
      
    }
  }
}
</style>
<style lang='scss'>
@import "@/assets/css/color.scss";
.dev_popup{
  color:$color-white;
  .title{
    font-size:16px;
  }
}
</style>