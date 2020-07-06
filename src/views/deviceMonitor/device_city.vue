<template>
  <div class="device-city-div boxstyle">
    <div class="device-city_container">
      <div class='device-city_header'>
        <div @click='changeTable(0)'><m-title label='城市统计' :img_type='!tableIndex?"1":"0"' style='width:6vw;height:4vh;line-height:4vh;'></m-title></div>
        <div @click='changeTable(1)'><m-title label='道路统计' :img_type='tableIndex?"1":"0"' style='width:6vw;height:4vh;line-height:4vh;'></m-title></div>
      </div>
      <div class="device-city_content">
        <m-tiptxt text='设备包括：电子警察、视频设备、ETC龙门架...' icon='icon-shebei1' icon_style='color:#A6AFCD;font-size:23px;height:30px;' :isShowIcon='ishowicon'></m-tiptxt>
        <m-tiptxt text='活跃设备：是指电警近一个月有抓拍违法数据；卡口、ETC龙门架 、区间测速设备近一天有回传数据；视频设备可查看视频画面。' icon='icon-shebei1' icon_style='color:#00C6FF;font-size:23px;height:30px;' :isShowIcon='ishowicon'></m-tiptxt>
        <div class='device-city_content_table' v-if="tableIndex==0">
          <el-table :data="indexcityDatas" @row-click="handle">
            <el-table-column fixed type="index" label="No" width="50"></el-table-column>
            <el-table-column prop="city"   label="城市"></el-table-column>
            <el-table-column prop="NUM" label="设备数量" sortable></el-table-column>
            <el-table-column prop="ACTIVE" label="活跃率" sortable></el-table-column>
          </el-table>
        </div>

         <div class='device-city_content_table' v-else>
          <span class='road_label'>道路类型筛选:</span>
          <el-select v-model="road_type" placeholder="请选择道路类型">
          <el-option v-for='(item,index) in typeOption' :key='index'
          :label="item.label"
          :value="item.value">
            </el-option>
          </el-select>
          <el-table :data="roadDatas" @row-click="handle" style="width: 100%;height:100%;" :default-sort = "{prop: 'week_radio', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
            <el-table-column fixed type="index" label="No" width="50"></el-table-column>
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
import blur from "@/blur";
import { interf } from "./config";
import m_tiptxt from '@/components/UI_el/tiptxt.vue'
import mTitle from "@/components/UI_el/title_com.vue";
export default {
  name: "TCruise",
  data() {
    return {
      map: {},
      indexcityDatas: [],
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
      road_type:'0',
      ishowicon:true
    };
  },
  components:{mTiptxt:m_tiptxt,mTitle},
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(6);
    this.map.repaint = true;
    that.getIndexData();
    that.getRoadData();
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
  },
  methods: {
    /**
     * 表格点击事件
     */
    handle(row, event, column){
      let data={};
      if(this.tableIndex){
        data.name=row.NAME;
        data.value=row.DLDM;
      }else{
        data.name=row.city;
        data.value=row.XZQH;
        this.centerTo(row.jwd.split(' '));
      }
      blur.$emit('initCityOrRoadStatics',this.tableIndex,data,true);
    },
    /**
     * 切换显示table类型
     * @param 0->城市统计，1->道路统计
     */
    changeTable(t){
      this.tableIndex=t;
    },
    /**
     * 获取设备总览，城市统计数据
     */
    getIndexData() {
      let that = this;
      interf.GET_CITY_STA_API({}).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
               that.indexcityDatas=data.data;
            } else{
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
    /**
     * 获取设备总览，道路统计数据
     */
    getRoadData() {
      let that = this;
      interf.GET_ROAD_ORDER_API({}).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
               that.roadDatas=data.data;
            } else{
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
                return "background:transparent;cursor:pointer;";
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
  //清除地图加载点、线、面、弹框
  clearMap(){
    //清除source
    if(this.mapAddItems.sourceList.length>0){
      this.mapAddItems.sourceList.forEach(e=>{
        if(this.map.getSource(e)!=undefined){
          this.map.removeSource(e);
        }
      })
    }
    //清除layer
    if(this.mapAddItems.lineList.length>0){
      this.mapAddItems.lineList.forEach(e=>{
        if(this.map.getLayer(e)!=undefined){
          this.map.removeLayer(e);
        }
      })
    }
    //清除popup
    if(this.mapAddItems.popups.length>0){
      this.mapAddItems.popups.forEach(e=>{
        e.remove();
      })
    }
  },
  /**
   * 点击标签页
   */
  handleClick(){
    
  }
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
.device-city-div {
  position: absolute;
  z-index: 10;
  left: 12px;
  width: 474px;
  height: 977px;
  top: 11px;
}
.device-city_container {
  width: 100%;
  height: 100%;
  .device-city_header{
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
  .device-city_content {
    width: 98%;
    height: 87%;
    margin: 1%;
    
    &_table {
      height: 550px;
      overflow-y: auto;
      padding:0 26px;
    }
    .road_label{
      color:$color-label;
      margin-right:1vw;
    }
  }
}
</style>