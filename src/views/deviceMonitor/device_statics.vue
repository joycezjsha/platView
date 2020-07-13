<template>
  <div class="device-statics-overview">
    <div class="device-statics_container">
      <div class="device-statics_title">
         <m-title :label='title' img_type=1></m-title>
         <div v-show='isShowReturn' class='return' @click='returnAll'><<返回全省</div>
      </div>
      <div class="device-statics_content boxstyle">
        <m-title-com label='设备类型分析' style='width:8vw;height:4vh;line-height:4vh;margin-bottom:10px;'></m-title-com>
        <m-tab :value="num" label='设备总数' icon_style="font-size:15px" icon='icon-shebei1'></m-tab>
        <div>
          <div class='device-statics_sort_list'>
            <m-list :list='staticsSort'></m-list>
          </div>
          <div id="device-statics_sort">
          </div>
        </div>
      </div>
        <div class='device-statics_tab boxstyle'>
          <m-tab label='近30天活跃电警' :value='allStatics.pcount' icon='icon-dianjing' icon_style='color:#FFFFFF' class='item'></m-tab>
          <m-tab label='连通卡口设备' :value='allStatics.kkcount' icon='icon-kakou' icon_style='color:#FFFFFF' class='item'></m-tab>
          <m-tab label='连通视频设备' :value='allStatics.viocount' icon='icon-jiankong1' icon_style='color:#FFFFFF' class='item'></m-tab>
          <m-tab label='连通龙门架设备' :value='allStatics.lmjcount' icon='icon-liantonglongmenjia' icon_style='color:#FFFFFF' class='item'></m-tab>
          <m-tab label='连通区间测速设备' :value='allStatics.qjcscount' icon='icon-cesu' icon_style='color:#FFFFFF' class='item'></m-tab>
        </div>
        <div v-show='isShowMainDev' class='device-statics_chart boxstyle'>
          <m-title-com label='重点设备监测' style='width:8vw;height:4vh;line-height:4vh;'></m-title-com>
          <m-line-chart :chart_data="device_data" c_id='deviceStaticsMainDevice' style='width:100%;height:28vh' :showDoubleX='showDoubleX'></m-line-chart>
        </div>
      </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import echarts from 'echarts';
import blur from "@/blur";
import m_tab from '@/components/UI_el/tab.vue'
import m_list from '@/components/UI_el/list.vue'
import mTitle from "@/components/UI_el/title.vue";
import mTitleCom from "@/components/UI_el/title_com.vue";
import mLineChart from "@/components/UI_el/double_line_chart.vue";
export default {
  name: "TIndex",
  data() {
    return {
      map: {},
      title:'全省统计',
      isShowReturn:false,
      isShowMainDev:true,
      num:0,
      staticsData: {sum: 10,mainCount:0},
      staticsSort:[],
      device_option: {
        color:['#00B5B7','#4f35d0','#4F35D0'],
          tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
              orient: 'vertical',
              right: 10,
              top:10,
              data: [],
              textStyle:{color:'white'}
          },
          series: [
              {
                  name: '警情统计',
                  type: 'pie',
                  radius: ['50%', '75%'],
                  avoidLabelOverlap: false,
                  hoverAnimation:false,
                  label: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      label: {
                          show: true,
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  },
                  labelLine: {
                      show: false
                  },
                  data: [
                     
                  ]
              }
          ]
      },
      device_chart:null,
      sg_sort_data: [
        { name: "机动车与机动车", value: "12", radio: "32%" },
        { name: "机动车与非机动车", value: "122", radio: "32%" },
        { name: "行人", value: "2", radio: "32%" }
      ],
      allStatics:{},
      accurChangeOption:{
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross',
                  crossStyle: {
                      color: '#999'
                  }
              }
          },
          toolbox: {
              feature: {
                  dataView: {show: true, readOnly: false},
                  magicType: {show: true, type: ['line', 'bar']},
                  restore: {show: true},
                  saveAsImage: {show: true}
              }
          },
          legend: {
              data: ['蒸发量', '降水量', '平均温度']
          },
          xAxis: [
              {
                  type: 'category',
                  data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                  axisPointer: {
                      type: 'shadow'
                  }
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  name: '水量',
                  min: 0,
                  max: 250,
                  interval: 50,
                  axisLabel: {
                      formatter: '{value} ml'
                  }
              },
              {
                  type: 'value',
                  name: '温度',
                  min: 0,
                  max: 25,
                  interval: 5,
                  axisLabel: {
                      formatter: '{value} °C'
                  }
              }
          ],
          series: [
              {
                  name: '蒸发量',
                  type: 'bar',
                  data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
              },
              {
                  name: '降水量',
                  type: 'bar',
                  data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
              },
              {
                  name: '平均温度',
                  type: 'line',
                  yAxisIndex: 1,
                  data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
              }
          ]
      },
      accurChart:null,
      tableLoading:false,
      device_data:{
        legend: ["全部设备", "活跃设备"],
        xdata:[],
        y1data:[],
        y2data:[]
      },
      showDoubleX:false,
       map_cover:{
        sourceList:[],
        lineList:[],
        RoadSourceList:[],
        RoadLineList:[],
        markers:[],
        popups:[]
      },
    }
  },
  components:{mTab:m_tab,mList:m_list,mTitle,mTitleCom,mLineChart},
  mounted() {
    this.map = this.$store.state.map;
    this.getSumDev();
    this.initdeviceAnalysisChart();
    this.getAllStaticsData();
    this.initAccurCharts();
  },
  destroyed() {
    this.flyRoutes = [];
    this.map.setPitch(0); //设置地图的俯仰角
    this.clearMap();
  },
  methods: {
    /**
     * 根据参数刷新界面
     * type:0->城市，1->道路  value：参数名称  flag：0->不显示‘返回全省’按钮，1->显示‘返回全省’按钮
     */
    initStatics(type,data,flag){
      this.hideRoadLine();
      if(!data) return;
      if(flag){
        this.isShowReturn=true;
        this.clearMaker();
        this.isShowMainDev=false;
        switch(type){
          case 0:{
            this.title=data.name;
            this.getSumDev(type,data.value);
            this.getAllStaticsData(type,data.value);
            this.initdeviceAnalysisChart(type,data.value);
            break;}
          case 1:{
            this.title=data.name;
            this.getSumDev(type,data.value);
            this.getAllStaticsData(type,data.value);
            this.initdeviceAnalysisChart(type,data.value);
            this.getRoadDevice(data.value);
            break;
          }
        }
      }else{
        this.isShowReturn=false;
      }
    },
    /**
     * 获取设备总数
     */
    getSumDev(type,value){
      let _this=this;
      let params={};
      if(type!=undefined && value){
        switch(type){
          case 0:params.xzqh=value;break;
          case 1:params.dldm=value;break;
          default:break;
        }
      };
      interf.GET_TOTAL_NUM_API(params).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
              _this.num=data.data.num;
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
        _this.tableLoading = false;
      });
    },
    /**
     * 初始化设备类型分析chart
     */
    initdeviceAnalysisChart(type,value){
      let _this=this;
      let params={};
      if(type!=undefined && value){
        switch(type){
          case 0:params.xzqh=value;break;
          case 1:params.dldm=value;break;
          default:break;
        }
      }
      interf.GET_QUERY_API(params).then(response=>{
       if (response && response.status == 200){
           var data = response.data;
           if (data.errcode == 0) {
             if(!_this.device_chart){
               _this.device_chart = echarts.init(document.getElementById('device-statics_sort'));
              };
            _this.staticsSort=[{color:'#00B5B7',label:'视频设备',value:data.data.viocount},{color:'#0572ED',label:'电警',value:data.data.pcount}];
            _this.device_option.series[0].data=[{name:'视频设备',value:data.data.viocount},{name:'电警',value:data.data.pcount}]
            _this.device_chart.setOption(_this.device_option);
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
        _this.tableLoading = false;
      });
      
    },
    /**
     * 获取区间测速、电警、卡口、视频、龙门架统计数据,初始化统计列表
     */
    getAllStaticsData(type,value){
      let _this=this;
      let params={};
      if(type!=undefined && value){
        switch(type){
          case 0:params.xzqh=value;break;
          case 1:params.dldm=value;break;
          default:break;
        }
      };
      interf.GET_DEVICE_STATICS_API(params).then(response=>{
       if (response && response.status == 200){
         var data = response.data;
         if (data.errcode == 0) {
             _this.allStatics=data.data;
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
        _this.tableLoading = false;
      });
    },
    /**
     * 生成设备重点监测趋势echarts
     */
    initAccurCharts(value){
      let _this=this;
      _this.device_data={
        legend: ["全部设备", "活跃设备"],
        xdata:[],
        y1data:[],
        y2data:[]
      };
      let params={};
      if(value){
        params.xzqh=value;
      };
      interf.GET_MAIN_DEVICE_API(params).then(response=>{
       if (response && response.status == 200){
         var data = response.data;
         if (data.errcode == 0) {
             let _data=_this.device_data;
             data.data.map(e=>{
               _data.xdata.push(e.city);
               _data.y1data.push(e.DEVNUM);
               _data.y2data.push(e.ACTIVENUM);
             });
             _this.chart_data=_data;
          }else{
            _this.$message({
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
        _this.tableLoading = false;
      });
    },
    /**
     * 获取道路上的设备
     */
    getRoadDevice(id){
      let _this=this;
      this.hideRoadLine();
      this.map_cover.markers=[];
      interf.GET_DEVICE_ROAD_API({dldm:id}).then(response=>{
       if (response && response.status == 200){
         var data = response.data;
         if (data.errcode == 0) {
             _this.addRoadLine(data.data);
          }else{
            _this.$message({
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
      this.map_cover.RoadSourceList.push('device_lineSource');
      this.map_cover.RoadlineList.push('device_lineLayer');
      }
      this.map.setCenter(points[0]);
    },
    /**
     * 地图显示道路上的设备
     */
    addRoadMarker(e){
      let lnglat=e.JWD.split(' ');
      let mainDiv=document.createElement('div');
      mainDiv.style.width='13vw';
      mainDiv.style.fontSize='0.7vw';
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
      
      let popup=new minemap.Popup({closeOnClick: true, closeButton: true, offset: [-3, -15]});
      popup.setLngLat(lnglat).setDOMContent(mainDiv);

      let el = document.createElement('div');
      el.style["background-image"] = "url(./static/images/"+(e.KKZT>1?"kakou":"kakou_")+".png)";
      el.style["background-size"] = "100% 100%";
      el.style.width = "30px";
      el.style.height = "30px";
      el.style["border-radius"] = "50%";
      let marker = new minemap.Marker(el, {offset: [-15, -15]}).setLngLat(lnglat).addTo(this.map).setPopup(popup);
      this.map_cover.markers.push(marker);
      this.map_cover.popups.push(popup);
    },
    /**
     * 返回全省
     */
    returnAll(){
      this.isShowMainDev=true;
      this.isShowReturn=false;
      this.title='全省统计';
      this.getSumDev();
      this.initdeviceAnalysisChart();
      this.initAccurCharts();
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
      //清除road 的source
      if(this.map_cover.RoadSourceList.length>0){
        this.map_cover.RoadSourceList.forEach(e=>{
          if(this.map.getSource(e)!=undefined){
            this.map.removeSource(e);
          }
        })
      }
      //清除road 的layer
      if(this.map_cover.RoadLineList.length>0){
        this.map_cover.RoadLineList.forEach(e=>{
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
          RoadSourceList:[],
          RoadLineList:[],
          markers:[],
          popups:[]
        }
    },
    /**
     * 
     */
    clearMaker(){
      let _this=this;
      //清除marker
      if(this.map_cover.markers.length>0){
        this.map_cover.markers.forEach(e=>{
          e.remove();
        })
      }
      this.map_cover.markers=[];
      //清除popup框
      if(this.map_cover.popups.length>0){
        this.map_cover.popups.forEach(e=>{
          e.remove();
        })
      }
      this.map_cover.popups=[];
       //清除road 的source
      if(this.map_cover.RoadSourceList.length>0){
        this.map_cover.RoadSourceList.forEach(e=>{
          if(this.map.getSource(e)!=undefined){
            _this.map.removeSource(e);
          }
        })
      }
      this.map_cover.RoadSourceList=[];
      //清除road 的layer
      if(this.map_cover.RoadLineList.length>0){
        this.map_cover.RoadLineList.forEach(e=>{
          if(this.map.getLayer(e)!=undefined){
            _this.map.removeLayer(e);
          }
        })
      }
      this.map_cover.RoadLineList=[];
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
<style scope='true' lang='scss'>
@import "@/assets/css/color.scss";
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.device-statics-overview {
  position: fixed;
  z-index: 10;
  right: 10px;
  width: 474px;
  height: auto;
  top: 90px;
  color: white;
}
.device-statics_container {
  width: 100%;
  height: 100%;
  .device-statics_title {
    position: relative;
    width: 100%;
    margin-bottom: 9px;
    color: $color-white;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    .return{
      position: absolute;
      left: 5%;
      cursor: pointer;
    }
    .return:hover{
      color:$color-primary;
    }
  }
  
  .device-statics_content {
    width: 100%;
    height: 280px;
    .device-statics_sort_list{
      width:50%;
      margin-top:2vh;
      float:right;
    }
    #device-statics_sort {
      width:50%;
      height:200px;
      float:left;
    }
  }
  .device-statics_tab {
    width: 94%;
    height: 250px;
    padding:6px 3%;
    .item{
       margin-top:12px;
    }
  }
  .device-statics_chart{
    width: 100%;
    height: 280px;
  }
    #sumCountChange{
      width:100%;
      height:25vh;
    }
    #accurCreateChange{
      width:100%;
      height:25vh;
    }
}

</style>
<style lang='scss'>
@import "@/assets/css/color.scss";
.dev_popup{
  color:$color-white;
  .title{
    font-size:14px;
    margin:0 0 15px 0;
  }
  >p{
    margin:7px 0;
  }
}
</style>