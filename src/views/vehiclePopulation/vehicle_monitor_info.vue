<template>
  <div class="vehicle-statics">
    <!-- 车辆实时监测 -->
    <div v-if="isShowdiv=='1'" class="vehicle-statics_container">
      <div class="top borstyle" >
        <div class="title" v-if="showback==true">重点车辆监测</div>
        <div class="back" v-else @click="goback(1)">
          &lt;&lt; 返回全省
          <span>{{name}}</span>
        </div>
      </div>
      <div class="Provincial borstyle">
        <m-com-title label="今日省内重点监测车辆运行势态" img_type="1" style="width:15vw;margin-top:0.5vh;"></m-com-title>
        <div class="tab">
          <!-- 左边 -->
          <div class="left">
            <div>
              <span style="color:#116cf3;margin-right:3px">|</span>
              速度检测次数
            </div>
            <div style="margin-top:1.5vh;margin-bottom:1vh;">
              <span>超速次数：
                <span style="color:#FB3030">{{cscount}}次</span>
              </span>
            </div>
            <div>
              <span>总检测次数次数：
                <span>{{count}}次</span>
              </span>
            </div>
          </div>
          <div class="middle">
            <div class='split'></div>
          </div>
          <!-- 右边 -->
          <div class="right">
            <div >
              <span style="color:#116cf3;margin-right:3px">|</span>
              平均超速幅度
            </div>
            <div class="vehicle-statics_sort" id="vehicle-statics_circle"></div>
          </div>
        </div>
        <!-- <div style="margin-left:2vw;display:flex">
        </div> -->
      </div>
      <div style="margin:11px 0;padding-top:0.8vh;" class="vehicle-statics_tab borstyle">
        <m-tab style='margin-bottom:0.5vh;' :isShowIcon="isShowIcon" label="今日入陕辆次:" :value="incount"></m-tab>
        <m-tab  :isShowIcon="isShowIcon" label="今日出陕辆次:" :value="outcount"></m-tab>
        <!-- <m-com-title label="进出陕车辆趋势" img_type="1" style="width:9vw;"></m-com-title> -->
        <m-line-chart
          style="width:98%;height:85%"
          :chart_data="outboundEchartsData"
          c_id="outboundEcharts"
        ></m-line-chart>
      </div>
      <div class="vehicle-statics_content borstyle">
        <m-com-title label="境内城市监测车辆实时排名" img_type="1" style="width:13vw;"></m-com-title>
        <div class="center_table" style="padding:0 20px">
          <el-table
            :data="indexDataList"
            highlight-current-row
            v-loading='tableLoading'
            style="width: 100%"
            height="32.5vh"
            :default-sort="{prop: 'NUM', order: 'descending'}"
            :row-style="getRowClass"
            :header-row-style="getRowClass"
            :header-cell-style="getRowClass"
          >
            <el-table-column  type="index" label="No." width="80"></el-table-column>
            <el-table-column prop="city" label="管理部门" width="130"></el-table-column>
            <el-table-column prop="NUM" label="辆次" sortable></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 车辆归属地OD -->
    <div v-if="isShowdiv=='2'" class="vehicle-Belong">
      <div class="belong">
        <div class="top">
          <div class="title" v-if="showback==true">全部车辆监控</div>
          <div class="back" v-else @click="goback(2)">
            &lt;&lt; 返回全省
            <span>{{name}}</span>
          </div>
        </div>
        <div class="vehicle-main borstyle">
          <div style="position: relative;">
            <div>
              <m-com-title class="analysis" label="车辆归属地分析"></m-com-title>
            </div>
            <div class="button">
              <el-tabs v-model="fxlxName" @tab-click="handleClick" style="padding:0 15px;" >
                <el-tab-pane label="实时活跃" name="4"></el-tab-pane>
                <el-tab-pane label="今日入陕" name="1"></el-tab-pane>
                <el-tab-pane label="今日出陕" name="2"></el-tab-pane>
              </el-tabs>
            </div>
            <!-- <div class="inoutbox" style="">
              <div class="left-inout">
                <div style="padding-left:2.9vw"  @click="changeIn(1)" >进入</div>
                <div :class="param.fxlx==1? 'showline':'line'"></div> 
              </div>
              <div  class="right-inout">
                <div  style="padding-left:2.9vw" @click="changeIn(2)">流出</div>
                <div :class="param.fxlx==2? 'showline':'line'"></div>
              </div>
            </div>   -->
          </div>
          <div class="inout"> 
              <span class="text" :class="param.provinceInorOut=='1'? 'selecttext':'noselecttext'" style="padding-left:1.5vw">
                  省外: {{provinceExternal}}
                  <span style="margin-left:1vw">({{provinceExternalProportion}})</span>
              </span>
              <span :class="param.provinceInorOut=='1'? 'noselecttext':'selecttext'" class="text" style="margin-left:3vw">
                  省内:{{provinceWithin}}
                  <span  style="margin-left:1vw">({{provinceWithinProportion}})</span>
              </span>
            <!-- 切换省内外   -->
            <div class="vehicle-change">
              <div @click="province(1)" :style="{width:provinceExternalProportion}" class="provinces" :class="param.provinceInorOut=='1'? 'bg':'changebg'" ></div>
              <div @click="province(2)" :style="{width:provinceWithinProportion}" class="city" :class="param.provinceInorOut=='1'? 'bg1':'changebg1'" ></div>
            </div>
          </div>
          <div class="vehicle-table" style="padding:0 1vw;height:100%">
            <el-table
              :data="indexDatas"
              v-loading='tableLoading'
              highlight-current-row
              style="width: 100%"
              height="100%"
              :default-sort="{prop: 'week_radio', order: 'descending'}"
              :row-style="getRowClass"
              :header-row-style="getRowClass"
              :header-cell-style="getRowClass"
            >
              <el-table-column  type="index" label="No" width="60"></el-table-column>
              <el-table-column
                prop="YJDFZJG"
                show-overflow-tooltip
                :label="param.provinceInorOut=='1'? '省份':'城市'"
              ></el-table-column>
              <el-table-column prop="NUM" label="辆次" sortable></el-table-column>
              <el-table-column prop="proportion" label="比例" sortable></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <!-- 热点卡口道路 v-if="isShowdiv=='3'" -->
    <div  v-if="isShowdiv=='3'" id='vehicle_hotcard-modal'>
      <div id="map" style=' width: 100%; height: 100%;'></div>
      <div class="hotcard">
          <div class="top ">
            <div class="title" v-if="showback==true" >全部车辆监控</div>
              <div class="back" v-else @click="goback(3)" >&lt;&lt; 返回全省
                <span> {{name}}</span>
            </div>
          </div>
          <div class="hotroad borstyle" style="height:41.29vh;margin-top:5px;padding-top:5px;">
            <m-com-title class="titletext"  label='热点道路排名' ></m-com-title>
            <div class="padding">
              <div class="table">
                <el-table :data="indexRoadDatas"
                highlight-current-row
                style="width: 100%" height="90%" :default-sort = "{prop: 'innum', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
                    <el-table-column  type="index" label="No" width="50"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="road" width="180"  label="道路"></el-table-column>
                    <el-table-column  prop="innum" label="进入辆次" sortable></el-table-column>
                    <el-table-column  prop="outnum" label="流出辆次"  sortable></el-table-column>
                </el-table>
              </div> 
            </div>
          </div>
          <div  class="hotroad borstyle" style="margin-top:2vh;height:40vh;">
            <m-com-title class="titletext"  label='热点卡口排名' ></m-com-title>
            <div  class="padding"> 
              <div  class="table">
                <el-table :data="indexHardDatas"
                style="width: 100%" height="90%" 
                highlight-current-row
                :default-sort = "{prop: 'NUM', order: 'descending'}" 
                :row-style="getRowClass" :header-row-style="getRowClass" 
                :header-cell-style="getRowClass">
                    <el-table-column  type="index" label="No" width="40"></el-table-column>
                    <!-- <div> -->
                    <el-table-column 
                        show-overflow-tooltip prop='city,KKMC'  width="210" label="卡口名称">
                      <template slot-scope="scope"> 
                          <span v-if="scope.row.city!=null">{{`[`+scope.row.city+`]`}}</span>
                          <span>{{scope.row.KKMC}}</span>
                          <!-- [{{scope.row.city}}]{{scope.row.KKMC}} -->
                      </template>
                    </el-table-column>
                    <!-- </div> -->
                    <el-table-column  prop="NUM" label="过车辆" sortable></el-table-column>     
                </el-table>
              </div>
            </div>       
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
import m_list from "@/components/UI_el/list_o.vue";
import m_tab from "@/components/UI_el/tab.vue";
import mTitle from "@/components/UI_el/title.vue";
import mComTitle from "@/components/UI_el/title_com.vue";
import mLineChart from "@/components/UI_el/double_line_chart.vue";
import blur from "../../blur.js";
export default {
  name: "TIndex",
  data() {
    return {
      map: {},
      // outwidth:'3vw',
      // inwidth:'7vw',
      indexRoadDatas: [],
      indexHardDatas: [],
      isShowIcon:false, //控制tab组件图标的显示
      CODE: "",
      name:'',
      cscount: "",
      city: "",
      count: "",
      isShowdiv:'1',
      avg: "",
      timer:null,
      timeRange: "", //自定义时间
      provinceWithin: '',  //省内数量
      provinceWithinProportion: '', //省内比
      provinceExternal: '', //省外数量
      provinceExternalProportion: '' ,   //省外比
      indexDatas: [],
      belongList:[] , //存放OD图
      param:{
        stime:'4', //实时活跃 传4  今日入陕 出陕传2
        code:'', //车辆类型
        provinceInorOut: "1", //省内外  1省外  2 省内
        fxlx: "", //方向类型 1进 2出
      },
      tableIndex:'',
      tableLoading:false,
      fxlxName:'4', //	归属地分析  实时活跃 传4  今日入陕 出陕传2
      indexDataMapBayonet: "", //  存放车辆实时监测地图的数据
      showback: true, //是否显示返回按钮
      incount: "", //今日入陕辆次
      outcount: "", //进入出陕辆次
      indexDataList: [],
      outboundEchartsData: {
        legend: ["进入车辆次", "流出车辆次"],
        y1data: [],
        y2data: [],
        xdata: []
      },
      map_cover: {
        sourceList:[],
        markers:[],
        lineList:[],
        popups:[]
      },
      statics_sort_option: {
        color: ['#03baff','#333c73'],
        tooltip: {
          show: false,
          showContent: false
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["70%", "90%"],
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
                show: true,
                position: "center",
                formatter: function(argument) {
                  var html;
                  html = "本月业绩\r\n\r\n" + "50单";
                  return html;
                },
                textStyle: {
                  fontSize: 10,
                  color: "#39CCCC"
                }
              }
            }
          }
        ]
      },
      sort_chart: null,
      accurChart: null,
      tabItems: ["超速检测次数", "平均行驶速度/限速"],
      listItems: [
        { label: "超速次数", value: "12" },
        { label: "总检测数", value: "12345" }
      ],
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
    that.getData();
    that.initMainStaticsChart();
    that.getDomesticVehicleRankingDatas();
    that.getToadyKeyVehicleInAndOutDatas();
    that.getMapBayonetRankingDatas();
    that.initAccurCharts();
    that.onShowLayer()
    that.timer=setInterval(() => {
      that.getDomesticVehicleRankingDatas();
      that.initMainStaticsChart();
      that.getToadyKeyVehicleInAndOutDatas()
    },1000*60);
    this.map.on('click',this.setZoom);
  },
  destroyed() {
    this.flyRoutes = [];
    this.clearMap();
    if(this.timer){
      clearInterval(this.timer)
    }
    // let that = this;
    this.map.setPitch(0); //设置地图的俯仰角
    // this.onHideLayer();
    this.map.off('click',this.setZoom);
  },
  beforeDestroy(){
    this.clearMap();
    this.map.off('click',this.setZoom);
  },
  methods: {
    /*
     * 接受外部传来的数据
     */
    getData() {
      let that=this;
      // 接收中间传过来的数据 1  2  3
      blur.$on('Realtime',data=>{
        that.isShowdiv=data;
        that.clearMap();
        if(that.isShowdiv=='2'){
          that.map.setZoom(4);
          that.getVehicleOwnershipDatas();   
        };
        if(that.isShowdiv=='1'){
          that.initMainStaticsChart();
          that.getDomesticVehicleRankingDatas();
          that.getToadyKeyVehicleInAndOutDatas();
          that.initAccurCharts();
        }
        if(that.isShowdiv=='3'){
          that.map.setZoom(8);
          that.getHotspotRoadRankinDatas();
          that.getHotspotBayonetRankingDatas();
        };
      })
      // 左侧列表-车辆监测 传过来的code 
      blur.$on("getCity", (data,name) => {
        that.CODE = data;
        that.param.code=data;
        that.name=name;
        that.clearMap();
        if(that.isShowdiv=='1'){
          that.getDomesticVehicleRankingDatas();
          that.getToadyKeyVehicleInAndOutDatas();
          that.initAccurCharts();
          that.getMapBayonetRankingDatas();
        };
        if(that.isShowdiv=='2'){
          that.getVehicleOwnershipDatas();
        }
        if(that.isShowdiv=='3'){
          that.getHotspotRoadRankinDatas();
          that.getHotspotBayonetRankingDatas();
        };
        if (that.CODE !== "") {
          that.showback = false;
        }
      });
      
    },
    /*
      * 切换 省内外  1省外  2 省内
      */
     province(i){
       let that=this;
        that.param.provinceInorOut=i;
        that.getVehicleOwnershipDatas();
     },
    /*
     * 点击返回按钮
     */
    goback(num) { 
      let that = this;
      blur.$emit('goback')
      that.param.stime='4';
      that.param.provinceInorOut='1';
      that.param.fxlx='1';
      that.param.code='';
      that.CODE='';
      that.showback = true;
      blur.$emit('getleft','');
      if(num=='1'){
        that.initMainStaticsChart();
        that.getDomesticVehicleRankingDatas();
        that.getToadyKeyVehicleInAndOutDatas();
        that.initAccurCharts();
        that.getMapBayonetRankingDatas();
      }
      if(num=='2'){
        that.getVehicleOwnershipDatas();
      }
      if(num=='3'){
        that.getHotspotRoadRankinDatas();
        that.clearMap()
        that.getHotspotBayonetRankingDatas();
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
  /*
  * 切换实时活跃 传4  今日入陕1  出陕2
  */
  handleClick(i){
    let that=this;
    that.clearMap()
     if(i.name=='1'){
       this.param.stime='2';
       this.param.fxlx='1';
     }else if(i.name=='2'){
       this.param.stime='2';
       this.param.fxlx='2';
     }else{
       this.param.fxlx='';
       this.param.stime=i.name;
     }
     this.getVehicleOwnershipDatas();
  },
  // changeIn(fxlx) {
  //   let that = this;
  //   that.param.fxlx = fxlx;
  //   that.getVehicleOwnershipDatas();
  // },
  /*
    *归属地分析-车辆归属地OD地图也是用的这个接口 KeyVehicle/getVehicleOwnership GET_OWN_SHIP_API
    *右侧列表数据 fxlx	1 进 2出   provinceInorOut	1 省外  2省内
    */
    getVehicleOwnershipDatas(){
      let that = this;
      that.tableLoading = true;
      that.indexDatas=[];
      let getBelongData={};
      //  如果是默认显示
      // 请求数据 实时活跃&省外   实时活跃 stime=4  provinceInorOut=1  1省外 
      getBelongData.stime=that.param.stime;
      getBelongData.provinceInorOut=that.param.provinceInorOut;
      if(that.param.fxlx!='' ){
         getBelongData.fxlx=that.param.fxlx;
        //  如果选择车辆类型和方向类型 1进 2出  传入code，fxlx参数
      }
      if(that.param.code!=''){
        getBelongData.code=that.param.code;
      }
        interf.GET_OWN_SHIP_API(getBelongData).then(response => {
          that.tableLoading = false;
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              that.provinceWithin = data.data.provinceWithin;
              that.provinceExternal = data.data.provinceExternal;
              that.provinceWithinProportion =
              data.data.provinceWithinProportion;
              that.provinceExternalProportion =
              data.data.provinceExternalProportion;
              that.indexDatas = data.data.dataList;
              if(that.indexDatas.length>0){
                that.clearMap();
                that.getVehicleOwnershipMapOD(that.indexDatas);
              }
            } else {
              that.$message({
                message: '车辆归属地OD地图',
                type: "error",
                duration: 1500
              });
              that.tableLoading = false;
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
     * OD地图函数
     */  
    getVehicleOwnershipMapOD(itemlist){
      let that=this;
      that.clearMap()
      var data = [] ;
      itemlist.forEach(item => {
        if(item.STARTJWD && item.ENDJWD){
          if(item.ENDNAME=='西安支队') item.ENDNAME='陕西';
          if(item.STRATNAME=='西安支队') item.STRATNAME='陕西';
          data.push([
            item.STARTJWD.split(" ")[0],item.STARTJWD.split(" ")[1],
            item.ENDJWD.split(" ")[0],item.ENDJWD.split(" ")[1],
            item.STRATNAME,item.ENDNAME,item.NUM
          ]) 
        }     
      });
       var colors = ['#00F8FF','#00FF00','#FFF800','#FF0000'];

        var scatterData = [];
        var lineData = [];
        var min = 0;
        var max = 1000;
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var name = item[4];
            var dest = item[5];
            var count = item[6];

            if (count < min) {
                min = count;
            }
            if (count > max) {
                max = count;
            }
            scatterData.push({
                name: dest,
                count: count,
                value: item.slice(2, 4)
            })
            lineData.push({
                name: name,
                count: count,
                dest: dest,
                coords: [item.slice(0, 2), item.slice(2, 4)]
            });
            }
            let getColor=(param)=>{
              let factor = (param.data.count - min) / (max - min);
              let index = Math.round(colors.length * factor);
              return colors[index];
            }
            var series = [{
                    name: 'bgLine',
                    type: 'lines',
                    coordinateSystem: 'GLMap',
                    zlevel: 1,
                    lineStyle: {
                        normal: {
                            color:getColor,
                            width: 2,
                            opacity: 0.5,
                            curveness: 0.2
                        }
                    },
                    data: lineData
                }, {
                name: 'scatter',
                type: 'effectScatter',
                coordinateSystem: 'GLMap',
                zlevel: 2,
                rippleEffect: {
                    scale: 50,
                    brushType: 'stroke'
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                symbolSize: 0.8,
                itemStyle: {
                    normal: {
                        show: true,
                        color:getColor
                    }
                },
                data: scatterData
            }, {
                name: 'sLine',
                type: 'lines',
                coordinateSystem: 'GLMap',
                zlevel: 3,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.4,
                    symbolSize: 4
                },
                lineStyle: {
                    normal: {
                        color:getColor,
                        width: 0,
                        curveness: 0.2
                    }
                },
                data: lineData
            }, {
                name: 'lLine',
                type: 'lines',
                coordinateSystem: 'GLMap',
                zlevel: 4,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.4,
                    opacity: 0.08,
                    symbolSize: 15
                },
                lineStyle: {
                    normal: {
                        color:getColor,
                        width: 0,
                        curveness: 0.2
                    }
                },
                data: lineData
            }
            ];
            var option = {
                GLMap: {
                    roam: true
                },
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(0,0,0,0)',
                    formatter: function (param) {
                        return param.data.name + '->' + param.data.dest + ': ' + param.data.count;
                    }
                },
                series: series
            };
        var echartslayer = minemap.Template.create({map: that.map, type: 'od'});
        echartslayer.chart.setOption(option);
        that.map_cover.popups.push(echartslayer)
      },

  /**
  * 车辆实时监测  地图显示  KeyVehicle/getMapBayonetRanking  GET_MAP_BAY_RANK_API
  * 需要的参数 code	车辆类型  
  */
    getMapBayonetRankingDatas() {
      let that = this;
      let MapBayonetData = {};
      // 如果传入车辆类型code参数
      if (that.CODE !='') {
        MapBayonetData.code = that.CODE;
      }
      interf
        .GET_MAP_BAY_RANK_API(MapBayonetData)
        .then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              that.clearMap()
              that.getBayonetMap(data.data);
            } else {
              that.$message({
                message: 'info车辆实时监测地图显示',
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
     *	 聚合图
     */
    getBayonetMap(item){
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
            "type": "circle",
            "source": "data-point",
            "filter": ["!has", "point_count"],
            "layout": {
              // "icon-image": "bank-15"
              },
             "paint": {
               "circle-color": 'green',
                "circle-radius": 15,
               } 

            })
            that.map_cover.lineList.push("unclustered-points");
            //添加聚合图层
                var layers = [
                [3,'#D20606'], [5,'#D25C06'], [1,'#6C9B06']
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
                 //添加非聚合数量图层
                that.map.addLayer({
                  "id": "-cluster-count",
                  "type": "symbol",
                  "source": "data-point",
                  "layout": {
                      "text-field": "1",
                      "text-size": 14
                  },
                  "paint":{
                      "text-color":"#ffffff"
                  },
                  "filter": ["!has", "point_count"]
                });
                that.map_cover.lineList.push("-cluster-count");
          }
      },
    
    /*
     *今日入陕 出陕 KeyVehicle/getToadyKeyVehicleInAndOut   GET_TOADY_VEHICLE_API 参数  code		车辆类型
     */
    getToadyKeyVehicleInAndOutDatas() {
      let that = this;
      let ToadyKeyData = {};
      // 如果没有参数
      if (that.CODE!='') { // 如果传入参数code  车辆类型
        ToadyKeyData.code =that.CODE;
      }else{
        ToadyKeyData = {};
      }
      interf
        .GET_TOADY_VEHICLE_API(ToadyKeyData)
        .then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              that.incount = data.data.incount;
              that.outcount = data.data.outcount;
            } else {
              that.$message({
                message: '今日入陕 出陕 ',
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
    /*
     * 境内城市监测车辆实时排名 KeyVehicle/getDomesticVehicleRanking   GET_DOM_VEH_RANKING_API
     */
    getDomesticVehicleRankingDatas() {
      let that = this;
      that.tableLoading = true;
      let DomesticVehicleData = {};
      that.indexDataList=[];
      if (that.CODE !='') {
        // 如果传入参数code  车辆类型
        DomesticVehicleData.code =that.CODE;
      }
      interf.GET_DOM_VEH_RANKING_API(DomesticVehicleData)
        .then(response => {
          that.tableLoading = false;
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              if(data.data.length>0){
                for(var i=0;i<data.data.length;i++){
                  if(data.data[i].city!=null){
                    that.indexDataList.push(data.data[i])
                  }
                }
              }
            } else {
              that.$message({
                message: '境内城市监测车辆实时排名',
                type: "error",
                duration: 1500
              });
              that.tableLoading = false;
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
     * 近30日重点车辆出入陕趋势echarts  近30日重点车辆出入陕趋势
     *  KeyVehicle/getMonthKeyVehicleInAndOut GET_MONT_INOUT_API
     */
    initAccurCharts() {
      let that = this;
      let ChartsData = {};
      // 如果没有参数
      if (that.CODE!='') {
        ChartsData.code =that.CODE;
      }else{
        ChartsData = {};
      }
      // 如果有参数
      interf.GET_MONT_INOUT_API(ChartsData)
        .then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
               that.outboundEchartsData.y1data=[];
                that.outboundEchartsData.y2data=[];
                that.outboundEchartsData.xdata=[];
              let car_data = that.outboundEchartsData;
              data.data.forEach(e => {
                that.outboundEchartsData.y1data.push(e.innum);
                that.outboundEchartsData.y2data.push(e.outnum);
                that.outboundEchartsData.xdata.push(e.date);
              });
                that.outboundEchartsData = car_data;
            } else {
              that.$message({
                message: '近30日重点车辆出入陕趋势',
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
    /*
      *热点卡口数据 KeyVehicle/getHotspotBayonetRanking  GET_HOT_BAY_RANK_API
      */
     getHotspotBayonetRankingDatas(){
        let that=this;
        let HotspotBayonetData={};
         // 如果默认显示，没有任何参数
        if(that.code!=''){
          HotspotBayonetData.code=that.CODE;
        }else{
          HotspotBayonetData={}
        }
        // 发送请求
        interf.GET_HOT_BAY_RANK_API(HotspotBayonetData)
        .then(response=>{
            if (response && response.status == 200){
            var data = response.data;
                if(data.errcode == 0){
                  that.indexHardDatas=[];
                    that.indexHardDatas=data.data;
                    if(that.indexHardDatas.length>0){
                      // 清除地图  popus markers
                      that.clearMap()
                      //  调用卡口地图方法
                      that.indexHardDatas.forEach(element => {
                        that.getHotspotBayMapData(element)
                        
                      });
                    }
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
    * 热点卡口地图
    */     
      getHotspotBayMapData(item){
        if(this.$store.state.isClear){return;}
        let itemlist=[];
        itemlist.push(item.JWD.split(" ")[0],item.JWD.split(" ")[1],);
        let lnglat = [itemlist[0],itemlist[1]];
        let el = document.createElement('div');
        // let el1 = document.createElement('div'); 
        el.style.backgroundColor='rgba(3,12,32,0.74)';
        el.style.width='218px';
        el.style.height='130px';
        el.className = 'custom-popup-class'; //custom-popup-class为自定义的css类名
        // el1.id = 'marker'; //
        // el1.style.width='8px';
        // el1.style.height='8px';
        // el1.style.borderRadius='50%';
        // el1.style.border='1px solid #fff';
        // if(item.NUM>=0 && item.NUM<50) {el1.style.backgroundColor='#00b429';}
        // else if(item.NUM>50 && item.NUM<500) {
        //   el1.style.backgroundColor='#e9b806';
        //   el1.style.width='10px';
        //   el1.style.height='10px';
        // }else if(item.NUM>500 && item.NUM<1000) {
        //   el1.style.backgroundColor='#ff9e58';
        //   el1.style.width='12px';
        //   el1.style.height='12px';
        // }else if(item.NUM>1000) {
        //   el1.style.backgroundColor='#fd0000';
        //   el1.style.width='14px';
        //   el1.style.height='14px';
        // }

        let d1 = document.createElement('div');
       if(item.city){
          let citySpan= document.createElement('span');
          citySpan.innerHTML=`[${item.city}]-`; 
          d1.appendChild(citySpan);
        } 
        let KKMCspan=document.createElement('span');  
        KKMCspan.innerHTML = item.KKMC;
        d1.appendChild(KKMCspan); 
        d1.style.color = "rgba(255,255,255,1)";
        d1.fontFamily='Source Han Sans CN';
        d1.style.marginBottom='5px';
        el.appendChild(d1);
        
        let d2 = document.createElement('div');
        let span1= document.createElement('span'); 
        let span2= document.createElement('span'); 
        span1.innerHTML='设备ID :  ';
        span2.innerHTML=item.KKBH;
        d2.fontFamily='Source Han Sans CN';
        d2.style.color = "rgba(255,255,255,1)";
        d2.appendChild(span1)
        d2.appendChild(span2)
        el.appendChild(d2);

        let d3 = document.createElement('div');
        let span3= document.createElement('span'); 
        let span4= document.createElement('span'); 
        span3.innerHTML='地点 :  ';
        span4.innerHTML=item.DLMC;
        d3.fontFamily='Source Han Sans CN';
        d3.style.color = "rgba(255,255,255,1)";
        d3.appendChild(span3)
        d3.appendChild(span4)
        el.appendChild(d3);

         //如果没有方向，就不需要创建d4
        if(item.KKJC) {
          let d4= document.createElement('div');
          let span5= document.createElement('span'); 
          let span6= document.createElement('span'); 
          span5.innerHTML='方向 :  ';
          span6.innerHTML=item.KKJC;
          d4.fontFamily='Source Han Sans CN';
          d4.style.color = "rgba(255,255,255,1)";
          d4.appendChild(span5)
          d4.appendChild(span6)
          el.appendChild(d4);
        }
        
        let d5= document.createElement('div');
        let span7= document.createElement('span'); 
        let span8= document.createElement('span'); 
        span7.innerHTML='过车辆 :  ';
        span8.innerHTML=item.NUM;
        d5.fontFamily='Source Han Sans CN';
        d5.style.color = "rgba(0,198,255,1)";
        d5.appendChild(span7)
        d5.appendChild(span8)
        el.appendChild(d5);
        let popup= new minemap.Popup({closeOnClick: true, closeButton: false, offset: [0, 0]})
        .setLngLat(lnglat)
        .setDOMContent(el);
        this.map_cover.popups.push(popup)
        // (".minemap-popup-tip").style.background='red';

        let el1 = document.createElement('div'); 
        let dot = document.createElement("div");
        let pause = document.createElement("div");
        el1.id = 'marker'; 
        
        let type='';
        if(item.NUM>=0 && item.NUM<50) {
          type='green';
          pause.className= "pulse pulse_"+type;
          dot.className = "dot dot_"+type;
        }else if(item.NUM>50 && item.NUM<500) {
          type='yellow';
          // el1.style.width='8px';
          // el1.style.height='8px';
          pause.className= "pulse pulse_"+type;
          dot.className = "dot dot_"+type;
        }else if(item.NUM>500 && item.NUM<1000) {
          type='orange';
          pause.className= "pulse pulse_"+type;
          dot.className= "dot dot_"+type;
        }else if(item.NUM>1000) {
          type='red';
          pause.className= "pulse pulse_"+type;
          dot.className= "dot dot_"+type;
        }
        el1.appendChild(dot); //将元素追加到el1元素上
        el1.appendChild(pause); //将元素追加到el1元素上
        el1.className='dot_marker dot_marker_'+type;

        let lnglat1 = [itemlist[0],itemlist[1]];
        let marker = new minemap.Marker(el1, {offset: [-5,-5]}).setLngLat(lnglat1).setPopup(popup).addTo(this.map);
        this.map_cover.markers.push(marker);
      },
    /**
       * 热点道路  KeyVehicle/getHotspotRoadRankin  GET_HOT_ROAD_RANK_API
      */
     getHotspotRoadRankinDatas(){
        let that=this;
        let HotspotRoandData={};
        // 如果默认显示，没有任何参数
        if(that.code!=''){
          HotspotRoandData.code=that.CODE;
        }
        // 发送请求
        interf.GET_HOT_ROAD_RANK_API(HotspotRoandData)
        .then(response=>{
            if (response && response.status == 200){
            var data = response.data;
                if(data.errcode == 0){
                  that.indexRoadDatas=[];
                  that.indexRoadDatas=data.data;
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
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
    },
    /**
     * 生成超速占比饼图echarts 今日重点监测车辆运行态势
     * 今日重点监测车辆运行态势 Overview/getVehicleOperation    GET_OPERA_API 
     */
    initMainStaticsChart() {
      let that = this;
      interf.GET_OPERA_API({stime:1}).then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              that.cscount = data.data.cscount;
              that.count = data.data.count;
              that.avg = data.data.avg;
              // if (!that.sort_chart) {
                that.sort_chart = echarts.init(document.getElementById("vehicle-statics_circle"));
              // }
              that.statics_sort_option.series[0].data = [
                { name: "超速次数", value: that.cscount },
                { name: "总检测数", value: that.count }
              ];
              that.statics_sort_option.series[0].label.normal.formatter = function(
                c
              ) {
                return that.avg;
              };
              that.sort_chart.setOption(that.statics_sort_option);
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
    /**
     * 点击聚合图-离散效果
     */
    setZoom(e){
        let bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]
        ];
        let features0 = this.map.queryRenderedFeatures(bbox, {
            layers: ["cluster0"]
        });
        let features1 = this.map.queryRenderedFeatures(bbox, {
            layers: ["cluster1"]
        });
        let features2 = this.map.queryRenderedFeatures(bbox, {
            layers: ["cluster2"]
        });
        let features3 = this.map.queryRenderedFeatures(bbox, {
            layers: ["cluster3"]
        });
        if(features0.length>0 || features1.length>0 || features2.length>0){
            this.map.setZoom(this.map.getZoom()+1);
            this.map.setCenter([e.lngLat.lng,e.lngLat.lat]);
        }
    // console.log(JSON.stringify(features0));
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
.vehicle-statics {
  position: fixed;
  z-index: 10;
  right: 13px;
  width: 474px;
  height: 85vh;
  top: 9vh;
  color: white;
}
.vehicle-statics_container .vehicle-statics_tab {
    width: 474px;
    height: 368px;
  }
.vehicle-statics_container .vehicle-statics_sort {
    margin-top:2vh;
    width: 70%;
    height:70%;
    // margin: 2vh auto;
  }
.vehicle-statics_container .vehicle-statics_content {
    padding-top:0.5vh;
  }

.vehicle-statics_container .top {
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
.vehicle-statics_container .Provincial {
  width: 474px;
  height: 180px;
  // margin-top: 1vh;
  padding-top:1vh;
  div {
    // display: flex;
    .Provincial-data {
      padding: 3vh 1.5vw;
    }
  }
}
.vehicle-statics_container .Provincial-text {
  margin-left: 4vw;
}
.vehicle-statics_container .vehicle-statics_content {
  width: 474px;
  height: 363px;
}
.vehicle-statics_container .Provincial .tab{
  padding-left: 1.5vw;
  display: flex;
  .left,.right{
    flex:5;
    .line{
      width:3px;
      height: 10px;
      background: red;
    }
  }
  .middle{
    flex:0.5;
    .split{
      width:1px;
      height:119px;
      background: radial-gradient(#f3f0f0, #757ba340,transparent);
    }
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
.vehicle-statics .vehicle-Belong .belong {
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
      border:1px solid;
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
    top:4vh;
    left:0;
    .analysis {
      width: 8.5vw;
      height: 3vh;
      position: absolute;
      top:10px;
      left:0.5vw;
    }
    .inout {
      display: flex;
      width: 100%;
      height: 30px;
      position: absolute;
      top:11vh;
      .text{
        flex: 1;
      }
      .selecttext{
        color:rgba(255,255,255,1);
      }
      .noselecttext{
        color:rgba(166,175,205,1);
      }
    }
  }
}
.vehicle-Belong .vehicle-change {
  position: absolute;
  top:3vh;
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
.vehicle-Belong .bg{
    // border:1px solid #ffffff;
    background: #00C6FF;
  }
.vehicle-Belong .bg1{
    background: #265E45;
  }
.vehicle-Belong .changebg{
     background:#0473B2;
  }
.vehicle-Belong .changebg1{
    background: #0DD77D;
  }
.vehicle-Belong .button {
    margin-top: 5px;
    position: absolute;
    top:3vh;
    right: 0;
    span{
        border: 1px solid white;
        background: #aeaeae;
        color: #66718b;
        padding:5px;
        font-size: 13px;
        border-radius: 2px;
        cursor: pointer;
    }
    .active{
    background-color:#0079fe;
    color: #efddfe;
    cursor:pointer;
    }
}
.vehicle-Belong  .inoutbox{
  width:100%;
  height:3vh;
  position: absolute;
  top:9vh;
  left: 0;
  display: flex;
  color: rgba(0, 198, 255, 1);
 .left-inout{
   flex:1;
   margin-left:1.8vw;
   
 }
 .right-inout{
    flex:1;
 }
}
.vehicle-Belong .vehicle-table{
    width: 90%;
    position: absolute;
    top:21vh;
    left: 0;
}
.vehicle-Belong  .showline {
  width: 160px;
  height: 3px;
  background: #00c6ff;
  margin-left: -1.4583vw;
  margin:1vh 0;
}
.vehicle-Belong  .line {
  width: 160px;
  height: 3px;
  margin-left: -1.4583vw;
  margin:1vh 0;
}
#vehicle_hotcard-modal .hotcard{
    position: fixed;
    top: 9.388vh;
    right:13px;
    width:24.6875vw;
    height: 100%;
    .top{
      width: 100%;
      .back{
        height:34px;
        font-size:16px;
        padding-top: 5px;
        font-family:Source Han Sans CN;
        font-weight:400;
        color:rgba(0,198,255,1);
        background-color: $color-bg-1;
        border:1px solid;
        padding-left: 17px;
        cursor:pointer;
        border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
        span{
          width:53px;
          height:18px;
          font-size:18px;
          font-family:Source Han Sans CN;
          font-weight:400;
          color:rgba(254,254,254,1);
          padding-left: 108px;
          cursor:pointer;
        }
      }
     .title{
        height:34px;
        font-size:18px;
        padding-top: 5px;
        text-align: center;
        font-family:Source Han Sans CN;
        font-weight:400;
        color:rgba(254,254,254,1);
        background-color: $color-bg-1;
        border:1px solid;
        cursor:pointer;
        border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
      }
    }
    .titletext{
      width: 8vw;
      height:31px;
    }
    .hotroad{
      height: 41.29vh;
      // background-color: $color-bg-1;
      // border:1px solid;
      // border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
      .padding{
        padding:0 0.5vw;
        .table{
          height: 41vh;
        }
      }
      
    }
}
</style>