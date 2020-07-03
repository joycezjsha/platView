<template>
  <div class="vehicle-statics">
    <div class="vehicle-statics_container">
      <div class="top borstyle" >
        <div class="title" v-if="showback==true">全部车辆监控</div>
        <div class="back" v-else @click="goback()">
          &lt;&lt; 返回全省
          <span>{{CODE}}</span>
        </div>
      </div>
      <div class="Provincial borstyle">
        <m-com-title label="今日省内重点监测车辆运行势态" img_type="1" style="width:17vw;"></m-com-title>
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
              平均行驶速度/限速
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
            style="width: 100%"
            height="32.5vh"
            :default-sort="{prop: 'NUM', order: 'descending'}"
            :row-style="getRowClass"
            :header-row-style="getRowClass"
            :header-cell-style="getRowClass"
          >
            <el-table-column  type="index" label="No." width="80"></el-table-column>
            <el-table-column prop="city" label="城市" width="130"></el-table-column>
            <el-table-column prop="NUM" label="辆次" sortable></el-table-column>
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
      isShowIcon:false, //控制tab组件图标的显示
      CODE: "",
      cscount: "",
      count: "",
      avg: "",
      indexDataMapBayonet: "", //  存放车辆实时监测地图的数据
      showback: true, //是否显示返回按钮
      incount: "", //今日入陕辆次
      outcount: "", //进入出陕辆次
      indexDataList: [{ NUM: "", XZQH: "", city: "" }],
      outboundEchartsData: {
        legend: ["进入车辆次", "流出车辆次"],
        y1data: [],
        y2data: [],
        xdata: []
      },
      map_cover: {
        sourceList: [],
        lineList: []
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
      countChangeOption: {
        // title: {
        //     text: '特性示例：渐变色 阴影 点击缩放',
        //     subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
        // },
        xAxis: {
          data: [
            "点",
            "击",
            "柱",
            "子",
            "或",
            "者",
            "两",
            "指",
            "在",
            "触",
            "屏",
            "上",
            "滑",
            "动",
            "能",
            "够",
            "自",
            "动",
            "缩",
            "放"
          ],
          axisLabel: {
            inside: true,
            textStyle: {
              color: "#fff"
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: [
          //   { // For shadow
          //     type: 'bar',
          //     itemStyle: {
          //         color: 'rgba(0,0,0,0.05)'
          //     },
          //     barGap: '-100%',
          //     barCategoryGap: '40%',
          //     data: dataShadow,
          //     animation: false
          // },
          {
            type: "bar",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" }
                ])
              }
            },
            data: [
              220,
              182,
              191,
              234,
              290,
              330,
              310,
              123,
              442,
              321,
              90,
              149,
              210,
              122,
              133,
              334,
              198,
              123,
              125,
              220
            ]
          }
        ]
      },
      countChart: null,
      accurChangeOption: {
        // title: {
        //     text: '特性示例：渐变色 阴影 点击缩放',
        //     subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
        // },
        xAxis: {
          data: [
            "点",
            "击",
            "柱",
            "子",
            "或",
            "者",
            "两",
            "指",
            "在",
            "触",
            "屏",
            "上",
            "滑",
            "动",
            "能",
            "够",
            "自",
            "动",
            "缩",
            "放"
          ],
          axisLabel: {
            inside: true,
            textStyle: {
              color: "#fff"
            }
          },
          axisTick: {
            show: true
          },
          axisLine: {
            show: true
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: [
          //   { // For shadow
          //     type: 'bar',
          //     itemStyle: {
          //         color: 'rgba(0,0,0,0.05)'
          //     },
          //     barGap: '-100%',
          //     barCategoryGap: '40%',
          //     data: dataShadow,
          //     animation: false
          // },
          {
            type: "bar",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" }
                ])
              }
            },
            data: [
              220,
              182,
              191,
              234,
              290,
              330,
              310,
              123,
              442,
              321,
              90,
              149,
              210,
              122,
              133,
              334,
              198,
              123,
              125,
              220
            ]
          }
        ]
      },
      accurChart: null,
      tabItems: ["超速检测次数", "平均行驶速度/限速"],
      listItems: [
        { label: "超速次数", value: "12" },
        { label: "总检测数", value: "12345" }
      ]
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
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(6);
    let that = this;
    that.initMainStaticsChart();
    that.getData();
    that.getDomesticVehicleRankingDatas();
    that.getToadyKeyVehicleInAndOutDatas();
    // that.initSumCharts();
    that.initAccurCharts();
    // that.getMapBayonetRankingDatas();
    that.onShowLayer()
    setInterval(() => {
      that.getDomesticVehicleRankingDatas();
      that.initMainStaticsChart();
      that.getToadyKeyVehicleInAndOutDatas()
    },1000*60);
  },
  destroyed() {
    this.flyRoutes = [];
    this.map.stop();
    // let that = this;
    this.map.setPitch(0); //设置地图的俯仰角
    // this.onHideLayer();
    /*for (let i = 0; i < that.buildingmore.length; i++) {
        if(that.map.getLayer(that.buildingmore[i])) that.map.setLayoutProperty(that.buildingmore[i], 'visibility', 'none');
      }*/
    //显示地图右下角飞行图标
    // eventBridge.$emit('map_hideFlyIcon');
    // eventBridge.$emit('map_hideBuildingmore');
    // eventBridge.$emit('hideLayerBtn');
    // $("#traffiCtrlFly").css(
    //   "background",
    //   "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAWCAMAAADto6y6AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABC1BMVEWjtO////+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO+jtO////+KC4gAAAAAV3RSTlMAAJ8/nr07Xrk4H7U03/6yMKD7rS1g+Mn9qSohk6Un4WX8oSSikEr0nWM16fmZIzfblRzjGRbK8adNpMYGC5sHnASSjz4DJc7lx3UiAcBtCWKutB3uWVzSmX8cAAAAAWJLR0QB/wIt3gAAAAd0SU1FB+EKDAoBO7QtmC0AAADoSURBVCjPY2BiZkABjFDAwBLOyoZVgj08PJyDE4sEVzgIcPNgSDDwgmX4+AXQJQSBwkIgKWERVAlRoKCYOEiXhKQUsoQ0SIxXhg8sJSuHkGCQBwmxKgiB7VJUUoZLqIBFVNXUwXS4kIY0VEITIiCqpQ1hhOvocoEl9CBcMX1lg3CYlKERyIXGEJ6xiakZVMLcwhIkYQXlWtvYcgMpbTs1e7BRDAowExwYHJ2cXVxhrmJwg0m46yF7EAg8QCHi6eXN4IMmIavo62fE4B8QKIkmIWcKIn1Yw4PQJKAgOASHBEMoLgmGMIQEABPwPWhIBaSaAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTEwLTEyVDEwOjAxOjU5KzA4OjAwEMBd+QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMC0xMlQxMDowMTo1OSswODowMGGd5UUAAAAASUVORK5CYII=') no-repeat 50% center"
    // );
    // commonVariable.CURRENT_MAP.repaint = false;
  },
  methods: {
    /*
     * 接受外部传来的数据
     */
    getData() {
      blur.$on("getCity", data => {
        this.CODE = data;
        this.getDomesticVehicleRankingDatas(this.CODE);
        this.getToadyKeyVehicleInAndOutDatas(this.CODE);
        this.initAccurCharts(this.CODE);
        this.getMapBayonetRankingDatas(this.CODE);
        if (this.CODE !== "") {
          this.showback = false;
        }
      });
      blur.$on('realtime',data=>{
        // console.log(data)
        if(data==1){
          this.onShowLayer()
        }else{
          this.onHideLayer()
        }
      })  
    },
    /*
     * 点击返回按钮
     */
    goback() {
      this.showback = true;
      this.getDomesticVehicleRankingDatas();
      this.getToadyKeyVehicleInAndOutDatas();
      this.initAccurCharts();
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
  * 车辆实时监测  地图显示  KeyVehicle/getMapBayonetRanking  GET_MAP_BAY_RANK_API
  * 需要的参数 code	车辆类型  
  */
    getMapBayonetRankingDatas(code) {
      let that = this;
      let MapBayonetData = {};
      // 如果传入车辆类型code参数
      if (code != undefined) {
        MapBayonetData.code = code;
      }
      interf
        .GET_MAP_BAY_RANK_API(MapBayonetData)
        .then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              that.getBayonetMap(data.data);
            } else {
              that.$message({
                message: data.errmsg,
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
            }
        },
    // getMapRank(item) {
    //   let that = this;
    //   that.map = that.$store.state.map;
    //   if (that.map.getLayer("data-point") != undefined) {
    //     that.map.setLayoutProperty("data-point", "visibility", "visible");
    //   } else {
    //     let jsonData = {
    //       type: "FeatureCollection",
    //       features: []
    //     };
    //     item.forEach(e => {
    //       if (e.JWD) {
    //         for (let i = 0; i < e.NUM; i++) {
    //           jsonData.features.push({
    //             type: "Feature",
    //             geometry: {
    //               type: "Point",
    //               coordinates: e.JWD.split(" ")
    //             }
    //           });
    //         }
    //       }
    //     });
    //     that.map.addSource("data-point", {
    //       type: "geojson",
    //       data: jsonData,
    //       cluster: true,
    //       clusterMaxZoom: 15,
    //       clusterRadius: 50,
    //       enableQueryChildren: false /*是否显示聚合详细信息，默认为false，如果为true，则开启显示详细信息功能，备注（如果开启显示详细信息功能，会引发性能问题，建议数据量较少（1000点以内）时使用）*/
    //     });
    //     that.map_cover.sourceList.push("data-point");
    //     //添加非聚合图层
    //     that.map.addLayer({
    //       id: "unclustered-points",
    //       type: "symbol",
    //       source: "data-point",
    //       filter: ["!has", "point_count"],
    //       layout: {
    //         "icon-image": "bank-15"
    //       }
    //     });
    //     that.map_cover.lineList.push("unclustered-points");
    //     //添加聚合图层
    //     var layers = [
    //       [3, "#ff5a0f"],
    //       [5, "#D25C06"],
    //       [1, "#6C9B06"]
    //     ];
    //     layers.forEach(function(layer, i) {
    //       let clusterId = "cluster" + i;
    //       that.map.addLayer({
    //         id: clusterId, //+ i,
    //         type: "circle",
    //         source: "data-point",
    //         paint: {
    //           "circle-color": layer[1],
    //           "circle-radius": 18
    //         },
    //         filter:
    //           i === 0
    //             ? [">=", "point_count", layer[0]]
    //             : [
    //                 "all",
    //                 [">=", "point_count", layer[0]],
    //                 ["<", "point_count", layers[i - 1][0]]
    //               ]
    //       });
    //       that.map_cover.lineList.push(clusterId);
    //     });
    //     //添加数量图层
    //     that.map.addLayer({
    //       id: "cluster-count",
    //       type: "symbol",
    //       source: "data-point",
    //       layout: {
    //         "text-field": "{point_count}",
    //         "text-size": 14
    //       },
    //       paint: {
    //         "text-color": "#ffffff"
    //       },
    //       filter: ["has", "point_count"]
    //     });
    //     that.map_cover.lineList.push("cluster-count");
    //   }
    // },

    /*
     *今日入陕 出陕 KeyVehicle/getToadyKeyVehicleInAndOut   GET_TOADY_VEHICLE_API 参数  code		车辆类型
     */
    getToadyKeyVehicleInAndOutDatas(code) {
      let that = this;
      let ToadyKeyData = {};
      // 如果没有参数
      if (code === undefined) {
        ToadyKeyData = {};
      } else {
        // 如果传入参数code  车辆类型
        ToadyKeyData.code = code;
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
                message: data.errmsg,
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
    getDomesticVehicleRankingDatas(code) {
      let that = this;
      let DomesticVehicleData = {};
      if (code != undefined) {
        // 如果传入参数code  车辆类型
        DomesticVehicleData.code = code;
      }
      interf
        .GET_DOM_VEH_RANKING_API(DomesticVehicleData)
        .then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              that.indexDataList = data.data;
              //  console.log(that.indexDataList)
            } else {
              that.$message({
                message: data.errmsg,
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
     * 近30日重点车辆出入陕趋势echarts  近30日重点车辆出入陕趋势
     *  KeyVehicle/getMonthKeyVehicleInAndOut GET_MONT_INOUT_API
     */
    initAccurCharts(code) {
      let that = this;
      let ChartsData = {};
      // 如果没有参数
      if (code === undefined) {
        ChartsData = {};
      } else {
        ChartsData.code = code;
      }
      // 如果有参数
      interf
        .GET_MONT_INOUT_API(ChartsData)
        .then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              let car_data = that.outboundEchartsData;
              data.data.forEach(e => {
                that.outboundEchartsData.y1data=[];
                that.outboundEchartsData.y2data=[];
                that.outboundEchartsData.xdata=[];
                that.outboundEchartsData.y1data.push(e.innum);
                that.outboundEchartsData.y2data.push(e.outnum);
                that.outboundEchartsData.xdata.push(e.date);
                that.outboundEchartsData = car_data;
              });
            } else {
              that.$message({
                message: data.errmsg,
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
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
    },
    /**
     * 生成超速占比饼图echarts 今日重点监测车辆运行态势 Overview/getVehicleOperation   GET_OPERA_API
     */
    initMainStaticsChart() {
      let that = this;
      interf
        .GET_OPERA_API({})
        .then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              that.cscount = data.data.cscount;
              that.count = data.data.count;
              that.avg = data.data.avg;
              if (!this.sort_chart) {
                this.sort_chart = echarts.init(
                  document.getElementById("vehicle-statics_circle")
                );
              }
              this.statics_sort_option.series[0].data = [
                { name: "超速次数", value: that.cscount },
                { name: "总检测数", value: that.count }
              ];
              this.statics_sort_option.series[0].label.normal.formatter = function(
                c
              ) {
                return that.avg;
              };
              this.sort_chart.setOption(this.statics_sort_option);
            } else {
              that.$message({
                message: data.errmsg,
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
    }
  },
  /*##清除地图加载点、线、面、弹框*/
  clearMap() {
    //清除source
    if (this.map_cover.sourceList.length > 0) {
      this.map_cover.sourceList.forEach(e => {
        if (this.map.getSource(e) != undefined) {
          this.map.removeSource(e);
        }
      });
    }
    //清除layer
    if (this.map_cover.lineList.length > 0) {
      this.map_cover.lineList.forEach(e => {
        if (this.map.getLayer(e) != undefined) {
          this.map.removeLayer(e);
        }
      });
    }
  }
};
</script>
<style scoped lang='scss'>
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
// .vehicle-statics_container {
  // width: 100%;
  // height: 100%;
  // .vehicle-statics_title {
  //   width: 100%;
  //   height: 5vh;
  //   font-family: Microsoft YaHei;
  //   font-size: 1vw;
  //   color: $color-white;

  //   font-weight: bolder;
  //   > div {
  //     width: 100%;
  //     height: 100%;
  //   }
  // }
  // .vehicle-statics--tab {
  //   width: 100%;
  //   height: 5vh;
  // }
  .vehicle-statics_tab {
    width: 474px;
    height: 368px;
  }
  .vehicle-statics_sort {
    margin-top:2vh;
    width: 70%;
    height:70%;
    // margin: 2vh auto;
  }
  //   @include flex(row, center, center);
  //   > div {
  //     @include flex(row, center, center);
  //     width: 50%;
  //   }
  //   > div:nth-child(2) {
  //     height: 100%;
  //     width: 40%;
  //   }
  // }
  // .vehicle-statics-tab {
  //   width: 98%;
  //   height: 10vh;
  //   background-color: $color-bg-1;
  //   margin: 1%;
  //   border: 1px solid $color-border-1;
  // }
  .vehicle-statics_content {
    padding-top:0.5vh;
  }
  //   width: 98%;
  //   height: 50%;
  //   margin: 1%;
  //   #sumCountChange {
  //     width: 100%;
  //     height: 20vh;
  //   }
  //   #accurCreateChange {
  //     width: 100%;
  //     height: 20vh;
  //   }
  // }
// }
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
.Provincial {
  width: 474px;
  height: 180px;
  margin-top: 1vh;
  padding-top:1vh;
  div {
    // display: flex;
    .Provincial-data {
      padding: 3vh 1.5vw;
    }
  }
}
.Provincial-text {
  margin-left: 4vw;
}
.vehicle-statics_content {
  width: 474px;
  height: 363px;
}
.Provincial .tab{
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
</style>