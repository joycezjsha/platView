<template>
  <div class="vehicle-w-statics">
    <div class="vehicle-w-statics_container">
      <div style="margin:11px 0;padding-top:0.8vh;" class="vehicle-w-statics_tab borstyle">
        <m-com-title label="预警量趋势" img_type="1" style="width:8vw;"></m-com-title>
        <div class='tab'>
          <el-tabs v-model="activeName" @tab-click="handleTrendTabClick">
            <el-tab-pane label="今日" name="1"></el-tab-pane>
            <el-tab-pane label="近30天" name="2"></el-tab-pane>
          </el-tabs>
        </div>
        <m-line-chart
          style="width:98%;height:85%"
          :chart_data="overSpeedEchartsData"
          c_id="outboundEcharts"
        ></m-line-chart>
      </div>
      <div class="Provincial borstyle">
        <m-com-title label="预警车辆类型及归属地分析" img_type="1" style="width:15vw;"></m-com-title>
        <div class="tab">
          <div class="vehicle-w-statics_sort" id="vehicle-w-statics_circle"></div>
        </div>
        <!-- <m-com-title :label="selectCarType.name+'>>'" img_type="1" style="width:8vw;"></m-com-title> -->
        <div class='car_type_title'>{{selectCarType.name}}<span class='t'>>></span></div>
        <div class='inout'>
          <div class="left">
              
              <div class="protext">
                <span   :class="provinceInorOut=='1'? 'isSelected': 'noSelect'" style="padding-left:1.5vw;" >
                  省外: {{provinceExternal}}
                  <span>({{provinceExternalProportion}})</span>
                </span>
              </div>
            </div>
            <div class="right">
              
              <div class="protext">
                <span  :class="provinceInorOut=='2'? 'isSelected': 'noSelect'"  style="margin-right:1vw">
                  省内: {{provinceWithin}}
                  <span> ({{provinceWithinProportion}})</span>
                </span>
              </div>
            </div>
        </div>
        <div class="change">
          <div @click="province(1)" class="provinces"  :style="'flex-basis:'+provinceExternalProportion" :class="car_owner_param.type=='1'? 'bg': 'changebg'"></div>
          <div @click="province(2)" class="city"  :style="'flex-basis:'+provinceWithinProportion" :class="car_owner_param.type=='1'? 'bg1': 'changebg1'"></div>
        </div>
        <div class="center_table" style="padding:0 20px">
          <el-table
            :data="indexDataList"
            highlight-current-row
            v-loading="tableLoading"
            style="width: 100%"
            height="32.5vh"
            :default-sort="{prop: 'NUM', order: 'descending'}"
            :row-style="getRowClass"
            :header-row-style="getRowClass"
            :header-cell-style="getRowClass"
          >
            <el-table-column type="index" label="No." width="80"></el-table-column>
            <el-table-column prop="YJDFZJG" label="城市" width="130"></el-table-column>
            <el-table-column prop="NUM" label="辆次" width="130"></el-table-column>
            <el-table-column prop="PROPORTION" label="比例" sortable></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import echarts from "echarts";
import m_item from "@/components/UI_el/tab_item.vue";
import m_list from "@/components/UI_el/list.vue";
import m_tab from "@/components/UI_el/tab.vue";
import mTitle from "@/components/UI_el/title.vue";
import mComTitle from "@/components/UI_el/title_com.vue";
import mLineChart from "@/components/UI_el/line_chart.vue";
import blur from "../../blur.js";
export default {
  name: "TIndex",
  data() {
    return {
      map: {},
      overSpeedEchartsData: {
        legend: [],
        ydata:[],
        xdata: []
      },
      activeName:'1',
      interval:null,
      provinceWithin: '',  //省内数量
      provinceWithinProportion: '', //省内比
      provinceExternal: '', //省外数量
      provinceExternalProportion: '' ,   //省外比
      provinceInorOut:1,
      indexDataList: [],
      param:{
        stime:'1', 
        etime:''
      },
      tableIndex:'',
      tableLoading:false,
      fxlxName:'4', //	归属地分析  实时活跃 传4  今日入陕 出陕传2
      indexDataMapBayonet: "", //  存放车辆实时监测地图的数据
      showback: true, //是否显示返回按钮
      incount: "", //今日入陕辆次
      outcount: "", //进入出陕辆次
      indexDataList: [],
      map_cover: {
        sourceList:[],
        markers:[],
        lineList:[],
        popups:[]
      },
      statics_sort_option: { //车辆类型分析环形图
        color: ['#16c5ff','#ffa414','#8bb7b7','#10de28','#0F6FD2','#00B5B7','#FF2B2B'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend:{
          x : '50%',
          y : '5%',
          orient: 'vertical',
          align: 'right',
          "itemGap": 5,
	        'itemWidth':18,
          data:[],
          textStyle:{color:'white',fontSize:10}
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["60%", "80%"],
            center: ['25%', '55%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "10",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [],
            label: {
              normal: {
                show: false
              }
            }
          }
        ]
      },
      sort_chart: null,
      selectCarType:{name:'全部车辆',type:''},
      car_owner_param:{stime:1,etime:'',hpzl:'',type:1},
      accurChart: null,
      listItems: [],
      echartslayer:null
    };
  },
  components: {
    mItem: m_item,
    mListO: m_list,
    mTab: m_tab,
    mTitle,
    mComTitle,
    mLineChart
  },
  mounted() {
    this.map = this.$store.state.map;
    this.map.setZoom(6);
    let that = this;
    that.initMainStaticsChart();
    that.getVehicleOwnershipDatas();
    that.initAccurCharts();
    setTimeout(()=>{
      that.getMapBayonetRankingDatas();
    },300);
    that.onShowLayer()
    that.interval=setInterval(() => {
      that.initAccurCharts();
      if(this.param.stime==1 || this.param.stime==3){
        that.initMainStaticsChart();
        that.getMapBayonetRankingDatas();
      }
    },1000*60);
    blur.$on('changeSelectTime',(data)=>{
      that.clearMap();
      that.param=data;
      that.selectCarType={name:'全部车辆',type:''};
      that.initMainStaticsChart();
      
      that.getMapBayonetRankingDatas();
      
      that.car_owner_param={stime:1,etime:'',hpzl:'',type:1};
      that.car_owner_param.stime=data.stime;
      that.car_owner_param.etime=data.etime;
      that.getVehicleOwnershipDatas();
    });
  },
  destroyed() {
    this.flyRoutes = [];
    this.clearMap();
    if(this.interval){
      clearInterval(this.interval);
    }
    // let that = this;
    this.map.setPitch(0); //设置地图的俯仰角
    // this.onHideLayer();
  },
  beforeDestroy(){
    this.clearMap();
  },
  methods: {
  /*
  * 切换 省内外  1省外  2 省内
  */
    province(i){
      let that=this;
      that.car_owner_param.type=i;
      that.getVehicleOwnershipDatas();
    },
    // /*
    //  * 点击返回按钮
    //  */
    // goback(num) { 
    //   let that = this;
    //   blur.$emit('goback')
    //   that.param.stime='4';
    //   that.param.provinceInorOut='1';
    //   that.param.fxlx='1';
    //   that.param.code='';
    //   that.CODE='';
    //   that.showback = true;
    //   blur.$emit('getleft','');
    //   if(num=='1'){
    //     that.initMainStaticsChart();
    //     that.initAccurCharts();
    //     that.getMapBayonetRankingDatas();
    //   }
    //   if(num=='2'){
    //     that.getVehicleOwnershipDatas();
    //   }
    //   if(num=='3'){
    //     that.getHotspotRoadRankinDatas();
    //     that.clearMap()
    //     that.getHotspotBayonetRankingDatas();
    //   }
    // },
  /**预警量 */
    /**
     * 预警量趋势
     */
    initAccurCharts() {
      let that = this;
      that.overSpeedEchartsData.ydata=[];
      that.overSpeedEchartsData.xdata=[];
      let param = {};
      // 如果有参数
      interf.GET_MONT_INOUT_API({state:this.activeName}).then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              let car_data = that.overSpeedEchartsData;
              if(that.activeName=='1'){
                car_data.legend=["今日预警量", "昨日预警量","上周同期预警量"];
                data.data.todayAlarm.name='今日预警量';
                car_data.ydata.push(data.data.todayAlarm);
                data.data.yesterDayAlarm.name='昨日预警量';
                car_data.ydata.push(data.data.yesterDayAlarm);
                data.data.lweekAlarm.name='上周同期预警量';
                car_data.ydata.push(data.data.lweekAlarm);
                data.data.todayAlarm.forEach(e => {
                  car_data.xdata.push(e.RQ);
                });
              }else{
                car_data.legend=["近30天预警量"];
                data.data.thirtyAlarm.name='近30天预警量';
                car_data.ydata.push(data.data.thirtyAlarm);
                data.data.thirtyAlarm.forEach(e => {
                  car_data.xdata.push(e.RQ);
                });
              }
              that.overSpeedEchartsData = car_data;
            } else {
              that.$message({
                message: '预警量趋势服务异常',
                type: "error",
                duration: 1500
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          that.tableLoading = false;
        });
    },
    /**
     * 预警量趋势tab切换
     */
    handleTrendTabClick(tab, event) {
      this.initAccurCharts();
    },
  /**预警量趋势 -END */
    /**
     * 生成预警车辆类型占比饼图echarts 
     */
    initMainStaticsChart() {
      let that = this;
      that.car_type_data=[];
      that.statics_sort_option.series[0].data=[];
      that.statics_sort_option.legend.data=[];
      let param = {stime:this.param.stime};
      if(this.param.etime!=''){
        param.etime=this.param.etime;
      };
      interf.GET_CAR_TYPE_API(param).then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              if (!that.sort_chart) {
                that.sort_chart = echarts.init(document.getElementById("vehicle-w-statics_circle"));
              }
              that.car_type_data=data.data;
              if(data.data.length>0){
                data.data.forEach(e=>{
                  that.statics_sort_option.series[0].data.push({name:e.NAME,value:e.NUM});
                   that.statics_sort_option.legend.data.push(e.NAME);
                })
              }
             
              that.statics_sort_option.legend.formatter=function (name) {
                let value='';
                for(let i=0;i<data.data.length;i++){
                  if(data.data[i].NAME==name){
                    value=data.data[i].NUM;
                  }
                }
                return name+'：'+value;
            };
              that.sort_chart.setOption(that.statics_sort_option);
              // that.sort_chart.on('click', function (params) {
                // alert("饼图点击事件");window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(params.name));
              // })
              that.sort_chart.on('legendselectchanged', function(params) {
                
                var option = this.getOption();
                var select_key = Object.keys(params.selected);
                var select_value = Object.values(params.selected);
                var n = 0;
                select_value.map(res => {
                  if(!res){
                      n++;
                    }
                });
                
                if( n ==select_value.length){
                    option.legend[0].selected[params.name] = true;
                }
                // this.setOption(option);
                let value='';
                that.selectCarType.type=params.name;
                that.selectCarType.name=params.name;
                for(let i=0;i<data.data.length;i++){
                  if(data.data[i].NAME==params.name){
                    that.car_owner_param.hpzl=data.data[i].HPZL;
                  }
                }
                that.getVehicleOwnershipDatas();
            });
            } else {
              that.$message({
                message: '请求今日省内重点车辆运行态势平均超速数据失败',
                type: "error",
                duration: 3000
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          that.tableLoading = false;
        });
    },
    /*
    *归属地分析-车辆归属地OD地图也是用的这个接口
    @param stime:开始事件 etime:结束时间 hpzl:号牌种类 type:1->省内 2->省外
    */
    getVehicleOwnershipDatas(){
      let that = this,param={stime:this.car_owner_param.stime};
      that.tableLoading = true;
      that.indexDataList=[];

      if(this.car_owner_param.stime!='' && this.car_owner_param.etime!=''){
        param.etime=this.car_owner_param.etime;
      };
      if(this.car_owner_param.hpzl!=''){
        param.hpzl=this.car_owner_param.hpzl;
      };
      if(this.car_owner_param.type!=''){
        param.provinceInorOut=this.car_owner_param.type;
      };
      interf.GET_OWN_SHIP_API(param).then(response => {
        that.tableLoading = false;
        if (response && response.status == 200) {
          var data = response.data;
          if (data.errcode == 0) {
            that.provinceWithin = data.data.PROVINCEINCOUNT;
            that.provinceExternal = data.data.PROVINCEOUTCOUNT;
            that.provinceWithinProportion =data.data.PROVINCEINCOUNTRATIO;
            that.provinceExternalProportion = data.data.PROVINCEOUTCOUNTRATIO;
            that.indexDataList = data.data.DATALIST;
          } else {
            that.$message({
              message: '获取归属地信息服务异常',
              type: "error",
              duration: 3000
            });
            that.tableLoading = false;
          }
        }
      })
      .catch(err => {
        that.$message({
              message: '更新车辆归属地信息失败',
              type: "error",
              duration: 1500
            });
            that.tableLoading = false;
      })
      .finally(() => {
        that.tableLoading = false;
      });
    },
    /**
    * 获取车辆预警位置聚合图 
    */
    getMapBayonetRankingDatas() {
      let that = this;
      let param = {stime:this.param.stime};
      if(this.param.etime!=''){
        param.etime=this.param.etime;
      };
      interf.GET_MAP_BAY_RANK_API(param).then(response => {
        if (response && response.status == 200) {
          var data = response.data;
          if (data.errcode == 0) {
            that.clearMap();
            that.addBayonetToMap(data.data);
          } else {
            that.$message({
              message: 'info车辆实时监测地图显示',
              type: "error",
              duration: 1500
            });
          }
          }
      }).catch(err => {
          console.log(err);
      }).finally(() => {
          that.tableLoading = false;
      });
    },
    /**
     *	 地图添加 聚合图
    */
    addBayonetToMap(item){
      let that=this;
      that.map = that.$store.state.map;
      if(that.map.getLayer('data-point')!=undefined){
        that.map.setLayoutProperty('data-point', 'visibility', 'visible');
      }else{
        let jsonData={
          "type": "FeatureCollection",
          "features": []
          }
        item.forEach(e=>{
          if(e.JD && e.WD){
            for(let i=0;i<e.NUM;i++){
              jsonData.features.push({
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates":[parseFloat(e.JD),parseFloat(e.WD)],
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
          "type": "circle",
          "source": "data-point",
          "paint": {
              "circle-color": 'green',
              "circle-radius": 15
            },
          "filter": ["!has", "point_count"],
          
          // "layout": {
          //   "icon-image": "bank-15"
          //   }
        })
        that.map_cover.lineList.push("unclustered-points"); 
        //添加聚合图层
        var layers =[[1000,'#ff5a0f',20], [100,'#D25C06',18], [0,'#6C9B06',15]];
        layers.forEach(function (layer, i) {
          let clusterId="cluster"+i;
          that.map.addLayer({
            "id": clusterId, //+ i,
            "type": "circle",
            "source": "data-point",
            "paint": {
              "circle-color": layer[1],
              "circle-radius":18
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
          // "filter": ["has", "point_count"]
        });
        that.map_cover.lineList.push("cluster-count"); 
      }
    },
    /*
    * 显示地图聚合图
    */
    onShowLayer() {
      let that=this;
      if (that.map) {
        if(that.map_cover.lineList.length>0){
          that.map_cover.lineList.forEach(e=>{
            if(that.map.getLayer(e)!=undefined){
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
      if(that.map_cover.lineList.length>0){
        that.map_cover.lineList.forEach(e=>{
          if(that.map.getLayer(e)!=undefined){
            that.map.setLayoutProperty(e, 'visibility', 'none');
          }
        })
      } 
    },
    
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
    },
    
    /*##清除地图加载点、线、面、弹框*/
      clearMap(){
        //清除marker
        if(this.map_cover.markers.length>0){
          for(let i=0;i<this.map_cover.markers.length;i++){
            this.map_cover.markers[i].remove();
          }
          // this.map_cover.markers.forEach(e=>{
          //     e.remove();
          //   })
        }
        this.map_cover.markers=[];
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
        if(this.map_cover.popups.length>0){
          this.map_cover.popups.forEach(e=>{
            e.remove();
          })
        }
        this.map_cover.popups=[];
        if(this.echartslayer){
          this.echartslayer.remove();
        }
      }
    /*##清除地图加载点、线、面、弹框 --END*/
    }
};
</script>
<style scoped lang='scss'>
@import "@/assets/css/color.scss";
@import "@/assets/css/color.scss";
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.vehicle-w-statics {
  position: fixed;
  z-index: 10;
  right: 13px;
  width: 474px;
  height: 85vh;
  top: 9vh;
  color: white;
}
.vehicle-w-statics_container .vehicle-w-statics_tab {
  width: 474px;
  height: 280px;
  .tab{
    position:absolute;
    top:18px;
    right:0px;
    width:155px;
  }
}

.vehicle-w-statics_container .top {
  width: 474px;
  height: 34px;
  .back {
    height: 34px;
    font-size: 16px;
    padding-top: 5px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: rgba(0, 198, 255, 1);
    padding-left: 17px;
    border: 1px solid;
    background-color: $color-bg-1;
    cursor: pointer;
    border-image: linear-gradient(
        182deg,
        rgba(10, 148, 255, 1),
        rgba(255, 255, 255, 0)
      )
      1 1;
    span {
      width: 53px;
      height: 18px;
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(254, 254, 254, 1);
      padding-left: 108px;
      cursor: pointer;
    }
  }
  .title {
    height: 34px;
    font-size: 18px;
    padding: 5px;
    margin-bottom: 0.5vh;
    text-align: center;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: rgba(254, 254, 254, 1);
    background-color: $color-bg-1;
    border: 1px solid;
    cursor: pointer;
    border-image: linear-gradient(
        182deg,
        rgba(10, 148, 255, 1),
        rgba(255, 255, 255, 0)
      )
      1 1;
  }
}
.vehicle-w-statics_container .Provincial {
  width: 474px;
  height: 561px;
  div {
    // display: flex;
    .Provincial-data {
      padding: 3vh 1.5vw;
    }
  }
  .car_type_title{
    margin-left:15px;
    line-height: 3vh;
    margin-left: 20px;
    font-size: 0.85vw;
    .t{
      color:aqua;
      margin-left:5px;
    }
  }
  .inout {
      display: flex;
      width: 100%;
      height: 4.2vh;
      position: relative;
      .left,
      .right {
        height: 60px;
        width: 50%;
        .inouttext {
          width: 160px;
          height: 14px;
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(0, 198, 255, 1);
          line-height: 60px;
          margin-bottom: 4.5vh;
          cursor: pointer;
        }
        .protext {
          width: 100%;
          height: 1vh;
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          // color: rgba(255, 255, 255, 1);
          margin-bottom: 3vh;
          margin-top: 1vh;
          
        }
        .showline {
          width: 160px;
          height: 2px;
          background: #00c6ff;
          margin-left: 1.4583vw;
        }
        .line {
          width: 160px;
          height: 2px;
          margin-left: 1.4583vw;
          // background: chartreuse;
        }
      }
    }
  .change {
    height:3vh;
    width: 100%;
    box-sizing: border-box;
    padding: 0 30px;
    display: flex;
    .bg{
      height:100%;
      background: #00C6FF;
    }
    .bg1{
      height:100%;
      background: #265E45;
    }
    .changebg{
      height:100%;
      background:#0473B2;
    }
    .changebg1{
      height:100%;
      background: #0DD77D;
    }
  }
}
.vehicle-w-statics_container .Provincial-text {
  margin-left: 4vw;
}
.vehicle-w-statics_container .Provincial .tab {
  padding-left: 1.5vw;
  display: flex;
  width: 100%;
  height: 185px;
  .vehicle-w-statics_sort {
    width: 100%;
    height: 95%;
    float: left;
  }
}

// .vehicle-Belong{
//   // width: 746px;
//   // height: 589px;
//   position: fixed;
//   top: 0;
//   left: 0;
//   // margin-bottom: 114px;
// }
.vehicle-w-statics .vehicle-Belong .belong {
  position: fixed;
  top: 9.388vh;
  right: 13px;
  width: 24.6875vw;
  height: 100%;
  box-sizing: border-box;
  .top {
    width: 100%;
    .back {
      height: 34px;
      font-size: 16px;
      padding-top: 5px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(0, 198, 255, 1);
      background-color: $color-bg-1;
      border: 1px solid;
      padding-left: 17px;
      cursor: pointer;
      border-image: linear-gradient(
          182deg,
          rgba(10, 148, 255, 1),
          rgba(255, 255, 255, 0)
        )
        1 1;
      span {
        width: 53px;
        height: 18px;
        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(254, 254, 254, 1);
        padding-left: 108px;
        cursor: pointer;
      }
    }
    .title {
      height: 34px;
      font-size: 18px;
      padding-top: 5px;
      text-align: center;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(254, 254, 254, 1);
      background-color: $color-bg-1;
      border: 1px solid;
      cursor: pointer;
      border-image: linear-gradient(
          182deg,
          rgba(10, 148, 255, 1),
          rgba(255, 255, 255, 0)
        )
        1 1;
    }
  }
  .vehicle-main {
    height: 951px;
    width: 100%;
    position: absolute;
    top: 4vh;
    left: 0;
    .analysis {
      width: 8.5vw;
      height: 3vh;
      position: absolute;
      top: 10px;
      left: 0.5vw;
    }
    .inout {
      display: flex;
      width: 100%;
      height: 30px;
      position: absolute;
      top: 11vh;
      .text {
        flex: 1;
      }
      .selecttext {
        color: rgba(255, 255, 255, 1);
      }
      .noselecttext {
        color: rgba(166, 175, 205, 1);
      }
    }
  }
}
.vehicle-Belong .vehicle-change {
  position: absolute;
  top: 3vh;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  padding: 0 30px;
  cursor: pointer;
  margin-top: 1vh;
  height: 32px;
  .provinces {
    // width: 213px;
    // flex: 1;
    // margin-right: 2px;
  }
  .city {
    // width: 207px;
    // flex: 1;
  }
}
.vehicle-Belong .bg {
  // border:1px solid #ffffff;
  background: #00c6ff;
}
.vehicle-Belong .bg1 {
  background: #265e45;
}
.vehicle-Belong .changebg {
  background: #0473b2;
}
.vehicle-Belong .changebg1 {
  background: #0dd77d;
}
.vehicle-Belong .button {
  margin-top: 5px;
  position: absolute;
  top: 3vh;
  right: 0;
  span {
    border: 1px solid white;
    background: #aeaeae;
    color: #66718b;
    padding: 5px;
    font-size: 13px;
    border-radius: 2px;
    cursor: pointer;
  }
  .active {
    background-color: #0079fe;
    color: #efddfe;
    cursor: pointer;
  }
}
.vehicle-Belong .inoutbox {
  width: 100%;
  height: 3vh;
  position: absolute;
  top: 9vh;
  left: 0;
  display: flex;
  color: rgba(0, 198, 255, 1);
  .inout {
      display: flex;
      width: 100%;
      height: 15.2vh;
      position: relative;
      .left,
      .right {
        height: 60px;
        .inouttext {
          width: 160px;
          height: 14px;
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(0, 198, 255, 1);
          line-height: 60px;
          margin-bottom: 4.5vh;
          cursor: pointer;
        }
        .protext {
          width: 9.68vw;
          height: 1vh;
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          // color: rgba(255, 255, 255, 1);
          margin-bottom: 3vh;
          margin-top: 1vh;
          
        }
        .showline {
          width: 160px;
          height: 2px;
          background: #00c6ff;
          margin-left: 1.4583vw;
        }
        .line {
          width: 160px;
          height: 2px;
          margin-left: 1.4583vw;
          // background: chartreuse;
        }
      }
    }
}
.vehicle-Belong .vehicle-table {
  width: 90%;
  position: absolute;
  top: 21vh;
  left: 0;
}
.vehicle-Belong .showline {
  width: 160px;
  height: 3px;
  background: #00c6ff;
  margin-left: -1.4583vw;
  margin: 1vh 0;
}
.vehicle-Belong .line {
  width: 160px;
  height: 3px;
  margin-left: -1.4583vw;
  margin: 1vh 0;
}
#vehicle_hotcard-modal .hotcard {
  position: fixed;
  top: 9.388vh;
  right: 13px;
  width: 24.6875vw;
  height: 100%;
  .top {
    width: 100%;
    .back {
      height: 34px;
      font-size: 16px;
      padding-top: 5px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(0, 198, 255, 1);
      background-color: $color-bg-1;
      border: 1px solid;
      padding-left: 17px;
      cursor: pointer;
      border-image: linear-gradient(
          182deg,
          rgba(10, 148, 255, 1),
          rgba(255, 255, 255, 0)
        )
        1 1;
      span {
        width: 53px;
        height: 18px;
        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(254, 254, 254, 1);
        padding-left: 108px;
        cursor: pointer;
      }
    }
    .title {
      height: 34px;
      font-size: 18px;
      padding-top: 5px;
      text-align: center;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(254, 254, 254, 1);
      background-color: $color-bg-1;
      border: 1px solid;
      cursor: pointer;
      border-image: linear-gradient(
          182deg,
          rgba(10, 148, 255, 1),
          rgba(255, 255, 255, 0)
        )
        1 1;
    }
  }
  .titletext {
    width: 8vw;
    height: 31px;
  }
  .hotroad {
    height: 41.29vh;
    // background-color: $color-bg-1;
    // border:1px solid;
    // border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
    .padding {
      padding: 0 0.5vw;
      .table {
        height: 41vh;
      }
    }
  }
}
</style>