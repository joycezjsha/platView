<template>
  <div class="car-info-div">
    <!--  城市车辆分析-->
    <div v-if="isShowdiv=='1'" class="car-info_container">
      <!-- top部分  boxstyle  #082354-->
      <div class="car-info_title">
        <div class="top ">
          <span class="borstyle" style="display:flex;height:4vh;line-height:2.2vh;"  >
            <span class="back"  @click="goback" v-if="showback">&lt;&lt; 返回全省</span>
            <div class="title" style="text-align:center;margin-left:8vw;line-height:3.5vh;padding:0.5vh 0" v-if="showback==false" >全部车辆监控</div>
            <span style="padding:5px 0" v-if="showback">{{city}}</span>           
          </span>
        </div>
      </div>
      <div class="data borstyle" >
        <m-tab :isShowIcon="isShowIcon" style="margin:5px"  label='总计进入车辆次数' :value='provinceData.addIn'></m-tab>
        <div class='car-info_tab'>
          <span><div>进入辆次</div><div><span class=''>{{provinceData.incount}}</span></div></span>
          <span><div>流出辆次</div><div><span class=''>{{provinceData.outcount}}</span></div></span>
        </div>
      </div>   
      <!-- 折线图 -->
        <div class="echarts borstyle">
          <div style="display:flex; position: relative;">
            <div>
              <m-title label='流动趋势' img_type=1 style='width:6vw;'></m-title>
            </div>
            <div class="button">
              <el-tabs v-model="timeName" @tab-click="handleClick" style="padding:0 15px;" >
                <el-tab-pane label="今日" name="1"></el-tab-pane>
                <el-tab-pane label="昨日" name="2"></el-tab-pane>
                <el-tab-pane label="近30天" name="3"></el-tab-pane>
              </el-tabs>
              <!-- <span :class="{active: showTime == 1}" @click="changeTime(1)">今日</span>     
              <span :class="{active: showTime == 2}" @click="changeTime(2)">昨日</span>
              <span :class="{active: showTime == 3}" @click="changeTime(3)">近30天</span>  -->
            </div>
          </div>
          <div style="width:95%;height:95%" id="">
            <m-line-chart  style="width:100%;height:100%" :chart_data='flowchartsData' c_id='sumCountChange'></m-line-chart>
          </div>
        </div>
        <!-- 饼状图 -->
        <div  class="echarts borstyle" style=""  >
          <div style="display:flex;position:relative;">
            <div>
              <m-title label='车辆类型分析' img_type=1 style='width:8vw;'></m-title>
            </div>
            <div  class="button">
              <el-tabs v-model="fxlxName" @tab-click="fxlxNameClick" style="padding:0 15px;" >
                <el-tab-pane label="进入" name="1"></el-tab-pane>
                <el-tab-pane label="流出" name="2"></el-tab-pane>
              </el-tabs>
              <!-- <span :class="{active: isActive == 1}" @click="change(1)">进入</span>
              <span :class="{active: isActive == 2}" @click="change(2)">流出</span> -->
            </div>
          </div>
          <!-- <div class="cars">
            <div>大车:{{echartsData.BIGCAR}}辆次</div>
            <div>小车:{{echartsData.SMALLCAR}}辆次</div>
          </div> -->
          <div class="device-statics_sort_list">
            <m-list :list='staticsSort'></m-list>
          </div>
          <div style="width:65%;height:70%;" id='accurCreateChange'></div>
        </div>
    </div>
    <!-- 车辆归属地OD -->
    <div  v-if="isShowdiv=='2'" class="carFlowBelong ">
      <div class="belong">
        <div class="top borstyle">
          <div class="title" v-if="showback==false">全部车辆监控</div>
          <div class="back" v-else @click="goback()">
            &lt;&lt; 返回全省
            <span>{{city}}</span>
          </div>
        </div>
        <div class="carFlow-main borstyle">
          <div>
            <m-title class="analysis" label="车辆归属地分析"></m-title>
          </div>
          <div class="inout">
            <div class="left">
              <div style="padding-left:4.89vw" @click="changeIn(1)" class="inouttext">进入</div>
              <div :class="fxlx==1? 'showline':'line'"></div>
              <div class="protext">
                <span   :class="provinceInorOut=='1'? 'isSelected': 'noSelect'" style="padding-left:1.5vw;" >
                  省外: {{belongData.provinceExternal}}
                  <span>({{belongData.provinceExternalProportion}})</span>
                </span>
              </div>
            </div>
            <div class="right">
              <div style="padding-left:4.89vw" @click="changeIn(2)" class="inouttext">流出</div>
              <div style :class="fxlx==2? 'showline':'line'"></div>
              <div class="protext">
                <span  :class="provinceInorOut=='2'? 'isSelected': 'noSelect'"  style="margin-right:1vw">
                  省内: {{belongData.provinceWithin}}
                  <span> ({{belongData.provinceWithinProportion}})</span>
                </span>
              </div>
            </div>
            <!-- 切换省内外 -->
            <div class="change">
              <div @click="province(1)" class="provinces" :class="provinceInorOut=='1'? 'bg': 'changebg'"></div>
              <div @click="province(2)" class="city"  :class="provinceInorOut=='1'? 'bg1': 'changebg1'"></div>
            </div>
          </div>
          <div class="belong-table" style="padding:0 2vw;height:100%;marfin-top:3vh">
            <el-table
              :data="indexDatas"
              style="width: 100%"
              height="100%"
              :default-sort="{prop: 'NUM', order: 'descending'}"
              :row-style="getRowClass"
              :header-row-style="getRowClass"
              :header-cell-style="getRowClass"
            >
              <el-table-column  type="index" label="No" width="60"></el-table-column>
              <el-table-column
                prop="YJDFZJG"
                show-overflow-tooltip
                :label="provinceInorOut=='1'? '省份':'城市'"
              ></el-table-column>
              <el-table-column prop="NUM" label="辆次" sortable></el-table-column>
              <el-table-column prop="proportion" label="比例" sortable></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <!-- 热点卡口道路  -->
    <div v-if="isShowdiv=='3'" id='card-modal'>
      <div class="hotcard">
          <div class="top borstyle">
            <div class="title" v-if="showback==false" >全部车辆监控</div>
              <div class="back" v-else @click="goback()" >&lt;&lt; 返回全省
                <span> {{city}}</span>
            </div>
          </div>
          <div class="hotroad borstyle" >
            <m-title class="titletext"  label='热点道路排名' ></m-title>
            <div class="padding">
              <div class="table">
                <el-table :data="indexDatas"
              height="90%" :default-sort = "{prop: 'inNum', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
                    <el-table-column show-overflow-tooltip  type="index" label="No" width="60"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="road"   label="道路"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="inNum" label="进入辆次" sortable></el-table-column>
                    <el-table-column show-overflow-tooltip prop="outNum" label="流出辆次" sortable></el-table-column>
                </el-table>
              </div> 
            </div>
          </div>
          <div  class="hotroad borstyle" style="margin-top:2vh">
            <m-title class="titletext"  label='热点卡口排名' ></m-title>
            <div  class="padding"> 
              <div  class="table">
                <el-table :data="tableDatas"
              style="width: 100%" height="90%" :default-sort = "{prop: 'NUM', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
                    <el-table-column show-overflow-tooltip  type="index" label="No" width="60"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="city,KKMC"  width="160" label="卡口名称">
                      <template slot-scope="scope">
                      [{{scope.row.city}}]{{scope.row.KKMC}}
                      </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="NUM" label="过车辆" sortable></el-table-column>     
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
import echarts from 'echarts';
import m_list from '@/components/UI_el/list.vue'
import mTitle from "@/components/UI_el/title_com.vue";
import mLineChart from "@/components/UI_el/double_line_chart.vue";
import mTab from '@/components/UI_el/tab.vue'
import blur from '../../blur.js';

// import FlowMap from "./carFlow_map";
export default {
  name: "TIndex",
  data() {
    return {
      data:true,
      isShowdiv:'1',
      showTime:'1',//	流动趋势 默认显示今日的数据
      city:'',
      fxlx:'1',   //1 进 2出
      stime:'1',  //1 最近的时间 2 今天 3昨天 
      etime:"",  
      timeRange:'',
      isShowIcon:false,
      staticsSort:[],
      provinceInorOut: "1", //省份 1  城市2
      timeName:'1', //流动趋势 时间
      fxlxName:'1', //车辆类型分析流入和进出
      isActive: 1,   //1进入  2流出
      xzqh:'', //行政区号
      showback:false,  //显示返回全省
      map: {},
      i:1,
      indexDatas: [],
      tableDatas:[],
      map_cover:{
        markers:[],
        belongList:[],
        popups:[]
      },
      belongData: {
        provinceWithin: null,
        provinceWithinProportion: null,
        provinceExternal: null,
        provinceExternalProportion: null
      },
      markerList:[], //存放marker
      flowchartsData:{
        legend: ["进入车辆次", "流出车辆次"],
        y1data:[],
        y2data:[],
        xdata:[]
      },
      provinceData:{
        addIn:'',
        incount:'',
        outcount:'',
        city:''
      },
      echartsData:{
        BIGCAR:'',
        SMALLCAR:''
      },
      listItems:[{'label':'',value:''}],
      accurCreateChange:null,
      options: {
         color : [ '#0065e3', '#00a5d1', '#ffffff', '#ab3ff7', '#4840e2', '#00a979'],
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
                    name: '车辆类型分析',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['50%', '50%'],  
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '15',
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
      options1: {
        color : [ '#0065e3', '#00a5d1', '#ffffff', '#ab3ff7', '#4840e2', '#00a979'],
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
                orient: 'vertical',
                right: 30,
                top:80,
                // data: ['大车','小车'],
                textStyle:{color:'white'},
                formatter: function(name){
            　　　return name.length>5?name.substr(0,5)+"...":name;
            　　}
            },
            series: [
                {
                    name: '车辆类型分析',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['30%', '50%'],  
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '15',
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
      indexDatas: [
      //   {"road":"西安","index":"2.1","averageSpeed":"33.2","length":"1.5","startRoad":"西兰高速公路","endRoad":"空工立交"},
      // {"road":"西安","index":"2.1","averageSpeed":"24","length":"2.2","startRoad":"西兰高速公路","endRoad":"空工立交"}
      ],
      countChangeOption:{
        title: {
            text: '特性示例：渐变色 阴影 点击缩放',
            subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
        },
        xAxis: {
            data:['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'],
            axisLabel: {
                inside: true,
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                show: true
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
                show: true
            },
            axisLabel: {
                textStyle: {
                    color: '#999'
                }
            }
        },
        dataZoom: [
            {
                type: 'inside'
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
              type: 'bar',
              itemStyle: {
                  color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                          {offset: 0, color: '#83bff6'},
                          {offset: 0.5, color: '#188df0'},
                          {offset: 1, color: '#188df0'}
                      ]
                  )
              },
              emphasis: {
                  itemStyle: {
                      color: new echarts.graphic.LinearGradient(
                          0, 0, 0, 1,
                          [
                              {offset: 0, color: '#2378f7'},
                              {offset: 0.7, color: '#2378f7'},
                              {offset: 1, color: '#83bff6'}
                          ]
                      )
                  }
              },
              data: [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220]
          }
        ]
      },
      countChart:null,
      accurChangeOption:{
        title: {
            // text: '特性示例：渐变色 阴影 点击缩放',
            // subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
        },
        xAxis: {
            data:['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'],
            axisLabel: {
                inside: true,
                textStyle: {
                    color: '#fff'
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
                    color: '#999'
                }
            }
        },
        dataZoom: [
            {
                type: 'inside'
            }
        ],
        series: [
          {
              type: 'bar',
              itemStyle: {
                  color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                          {offset: 0, color: '#83bff6'},
                          {offset: 0.5, color: '#188df0'},
                          {offset: 1, color: '#188df0'}
                      ]
                  )
              },
              emphasis: {
                  itemStyle: {
                      color: new echarts.graphic.LinearGradient(
                          0, 0, 0, 1,
                          [
                              {offset: 0, color: '#2378f7'},
                              {offset: 0.7, color: '#2378f7'},
                              {offset: 1, color: '#83bff6'}
                          ]
                      )
                  }
              },
              data: []
          }
        ]
      },
      accurChart:null,
      statics:{count:'+2328',in:'+4546',out:'-2328'},
      showIcon:false
    };
  },
  components:{mTitle,mLineChart,mTab,blur,mList:m_list,},
  mounted() {
    // this.initaccurCreateChange();
    this.getdata();
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter(mapConfig.DEFAULT_CENTER);
    this.map.setZoom(6);
    this.getTrafficData();
    that.getprovinceData(that.stime)
    that.initSumCharts(that.timeName);
    that.getCarTypeDatas()
    // that.getHotCarDatas(that.stime)
  },
  destroyed() {
    this.flyRoutes = [];
    this.map.stop();
    let that = this;
    that.map.setPitch(0); //设置地图的俯仰角
  },
  methods: {
    /*
    * 流动趋势	可切换1--【今日】、2--【昨日】、3--【近30天】
    */
   handleClick(i){
      let that = this;
      that.timeName=i.name;
      that.initSumCharts(that.timeName)
   },
    // 如果点击实时，则右边数据全部加载实时的数据
    realTime(){
      let that = this;
      that.stime=='1';
      if(that.stime=='1'){
        that.getprovinceData('1')
        that.carflowData('1')
      }
    },
    // 点击返回全省，调用默认显示全省的数据
    goback(){
      let that = this;
      that.showback=false;
      that.stime='1';
      that.fxlx='1';
      that.isActive='1';
      that.timeName='1';
      that.xzqh='';
      that.provinceInorOut="1";
      that.getprovinceData(that.stime)
      that.initSumCharts(that.timeName)
      that.getCarTypeDatas() ;
      that.getHotCarDatas(that.stime)
      that.getBelongData();
    },
    /**
     * 接收传来的数据 将变量的值发送给data，如果值为true，则显示对应的数据
     * */ 
    getdata(){
      let that = this;
      /**
       * 接收传过来的参数
       * paramxzqh:  行政区号  gettime:时间 1，2，3，4
       * paramcity:  城市  timeRange:自定义的时间
       */   
      blur.$on('realtime',data=>{
        that.isShowdiv=data;
        if(that.map_cover.belongList.length>0){
          that.map_cover.belongList.forEach(e=>{
            e.remove();
          })
        }     
        that.map_cover.belongList=[];
        if( that.isShowdiv==data)
        if(that.isShowdiv=='3'){
          this.map.setZoom(8);
          that.getHotCarDatas(that.stime)
        }else{
          if(that.map_cover.popups.length>0){
            that.map_cover.popups.forEach(e=>{
              e.remove();
              })
          }
          if(this.map_cover.markers1.length>0){
            this.map_cover.markers1.forEach(e=>{
              e.remove();
            })
          }
        }
        if(that.isShowdiv=='2'){
          this.map.setZoom(4);
          that.getBelongData();   
        };
        if(that.isShowdiv=='1'){
          this.map.setZoom(8);
        }
      });
      //  接收到对应的时间  1->实时，2->今天，3->昨天，4->自定义
      blur.$on("gettime",time=>{
        that.stime=time;
        if(time!='4'){
          that.getprovinceData(that.stime) 
          that.getCarTypeDatas() ;
          if(that.isShowdiv=='3'){
            that.getHotCarDatas(that.stime)
          }
          if(that.isShowdiv=='2'){
            that.getBelongData();
          }
         
         
        }  
      }) 
      //接收自定义的  timeRange:自定义的时间
      blur.$on('determine',times=>{
        that.timeRange=times;
        that.getprovinceData(that.stime) 
        that.getCarTypeDatas();
        if(that.isShowdiv=='3'){
          that.getHotCarDatas(that.stime);
        }
        if(that.isShowdiv=='2'){
          
          that.getBelongData();
        }
         
      })  
      blur.$on("paramxzqh",(xzqh,city)=>{
        that.xzqh=xzqh;
        that.city=city;
        that.showback=true; 
        that.getprovinceData(that.stime,that.xzqh);
        that.getCarTypeDatas();
        if(that.isShowdiv=='3'){
          that.getHotCarDatas(that.stime);
        }
        if(that.isShowdiv=='2'){
          that.getBelongData();
        }
      })
      blur.$on('sendTime',data=>{
      })
    },
    // 如果选择左侧的城市，显示对应城市的车辆类型分析
    //  点击进入和流出 触发 change事
    fxlxNameClick(i){
      let that = this;
      that.isActive = i.name;
       that.fxlx = i.name;
       blur.$emit("getfxlf",that.fxlx);
       that.getCarTypeDatas()
    },
    // 车辆流动页面全省车辆统计 xzqh===undefined && etime===undefined
    getprovinceData(type,xzqh){
      let that = this;
      let provinceData={};
      // 如果只有一个 type=1  2  3 时 并且没有xzqh 参数
      if(type!='4' && xzqh===undefined){
        provinceData.stime=type;
        // 如果type=4 时  并且没有xzqh 参数
      }else if(type=='4' && xzqh===undefined){
        provinceData.stime=that.timeRange[0];
        provinceData.etime=that.timeRange[1];
      }else if(type!='4' && xzqh!=undefined){
        provinceData.stime=type;
        provinceData.xzqh=xzqh;
        // 如果type=4 时 并且有xzqh 参数
      }else if(type=='4' && xzqh!=undefined){
        provinceData.stime=that.timeRange[0];
        provinceData.xzqh=xzqh;
        provinceData.etime=that.timeRange[1];
      }
        // 请求 全省车辆统计 数据
      interf.GET_VEH_PRO_API(provinceData)
      .then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
            that.provinceData.addIn=data.data.addIn.toString();
            that.provinceData.incount=data.data.incount.toString();
            that.provinceData.outcount=data.data.outcount.toString();            
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
     * 车辆流动页面车辆类型分析  默认显示实时的数据 Vehicle/getCarType
     * 如果客户没有点击进入或者流出，默认显示全省进入的数据  两个参数的 GET_VEH_TYPE_API
     */
    getCarTypeDatas(){
      let that=this; 
      let getCarTypeData={};
      getCarTypeData.stime=that.stime;
      getCarTypeData.fxlx=that.fxlx;
       // 如果传入xzqh
      if(that.xzqh!=''){
        getCarTypeData.xzqh=that.xzqh;
      }
      if(that.stime=='4'){
        getCarTypeData.stime=that.timeRange[0];
        getCarTypeData.etime=that.timeRange[1];
      }
      // 发送请求，获取
    interf.GET_VEH_TYPE_API(getCarTypeData)
    .then(response=>{
      if (response && response.status == 200){
        var data = response.data;
        if (data.errcode == 0) {
          // that.echartsData.BIGCAR=data.data.BIGCAR;
          // that.echartsData.SMALLCAR=data.data.SMALLCAR;
          that.staticsSort=[
            {color:'#0067e2',label:'大车',value:data.data.BIGCAR},
            {color:'#00a8d2',label:'小车',value:data.data.SMALLCAR}];
          // 绘制饼状图
          that.options.series[0].data=[];
          that.options.series[0].data=[{value:data.data.BIGCAR, name:'大车'},
          {value:data.data.SMALLCAR, name:'小车'},]
          that.changechart = echarts.init(document.getElementById('accurCreateChange'));
          that.changechart.setOption(that.options);
          window.addEventListener("resize",()=>{
            that.changechart.resize();
            }) 
          } else{
            that.$message({
              message: data.errmsg,
              type: "error",
              duration: 1500
              });
            } 
          }
        })
        .catch(err=>{
          console.log(err);
          })
          .finally(() => {
            that.tableLoading = false;
          });
    },
    //获取巡航数据
    getTrafficData() {
      let that = this;
    },
    setSelectItems(name,id){
      this.selectItem.road=name;
    },
    /**
     * 车辆流动页面流动趋势 echarts  开始时间 1今天,2昨天,3,近30天
     */
    initSumCharts(time){
      let that = this;  
      let SumChartsData={};
      SumChartsData.stime=time;
      interf.GET_FLOW_TREND_API(SumChartsData)
      .then(response=>{
       if (response && response.status == 200){
           var data = response.data;
           if (data.errcode == 0) {
            let car_data= that.flowchartsData;
            if(data.data.length>0){
              data.data.forEach(e=>{
                that.flowchartsData.y1data=[];
                that.flowchartsData.y2data=[];
                that.flowchartsData.xdata.push=[];
               that.flowchartsData.y1data.push(e.innum)
               that.flowchartsData.y2data.push(e.outnum)
               that.flowchartsData.xdata.push(e.date)
             })
             that.flowchartsData=car_data;
            }
             
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
        })
    },
    // 车辆归属地分析，根据进入 流出 和 省内，省外获取对应的 数据
    province(provinceInorOut) {
      let that = this;
      that.provinceInorOut = provinceInorOut;
      that.getBelongData()
    },
    // 车辆流动页面  归属地分析  Vehicle/getVehicleOwnership  // 进入 流出数据
    changeIn(fxlx) {
      let that = this;
      that.fxlx = fxlx;
      that.getBelongData()
    },
     //  OD地图函数
    getCityMapOD(itemlist){
      // this.clearMap();
      let data = [] ;
      itemlist.forEach(item => {
        if(item.STARTJWD && item.ENDJWD){
          data.push([
          item.STARTJWD.split(" ")[0],item.STARTJWD.split(" ")[1],
          item.ENDJWD.split(" ")[0],item.ENDJWD.split(" ")[1],
          item.STRATNAME,item.ENDNAME,item.NUM
          ]) 
        }
      });
        var scatterData = [];
        var lineData = [];
        var min = Number.MAX_VALUE;
        var max = Number.MIN_VALUE;
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
      let series = [{
            name: 'bgLine',
            type: 'lines',
            coordinateSystem: 'GLMap',
            zlevel: 1,
            lineStyle: {
                normal: {
                    color: '#03825d',
                    width: 2,
                    opacity: 0.5,
                    curveness: 0.2
                }
            },
            data: lineData
        }, {
            name: 'scatter',
            type: 'scatter',
            coordinateSystem: 'GLMap',
            zlevel: 2,

            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                }
            },
            symbolSize: 10,
            itemStyle: {
                normal: {
                    show: true,
                    color: '#03825d'
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
                    color: '#04b06e',
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
                    color: '#04b06e',
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
        var echartslayer = minemap.Template.create({map: this.map, type: 'od'});
        echartslayer.chart.setOption(option);
        this.map_cover.belongList.push(echartslayer)
        // this.map_cover.lineList.push(echartslayer)
    },
    // 车辆归属地分析  右侧列表数据 fxlx	1 进 2出   provinceInorOut	1 省外  2省内
    getBelongData(){
      let that = this;
      that.clearMap();
      let BelongData={};
      BelongData.stime=that.stime;
      BelongData.fxlx=that.fxlx;
      BelongData.provinceInorOut=that.provinceInorOut;
      if(that.xzqh!=''){
        BelongData.xzqh=that.xzqh;
      }
      if(that.timeRange!=''){
        BelongData.stime=that.timeRange[0];
        BelongData.etime=that.timeRange[1];
      }
        interf.GET_BELONG_API(BelongData)
        .then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              that.belongData.provinceWithin = data.data.provinceWithin;
              that.belongData.provinceExternal = data.data.provinceExternal;
              that.belongData.provinceWithinProportion =
              data.data.provinceWithinProportion;
              that.belongData.provinceExternalProportion =
              data.data.provinceExternalProportion;
              that.indexDatas = data.data.dataList;
              if(that.indexDatas.length>0){
                that.getCityMapOD(that.indexDatas) 
              }
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
      * 热点卡口地图
      */     
      getcardMapData(item){
        let itemlist=[];
        itemlist.push(item.KKJD,item.KKWD)
        let lnglat = [itemlist[0],itemlist[1]];
        let el = document.createElement('div');
        let el1 = document.createElement('div'); 
        el.style.backgroundColor='rgba(3,12,32,0.74)';
        el.style.width='218px';
        el.style.height='130px';
        el.className = 'custom-popup-class'; //custom-popup-class为自定义的css类名
        el1.id = 'marker'; 
        el1.style.width='17px';
        el1.style.height='17px';
        el1.style.borderRadius='50%';
        if(item.NUM>0) el1.style.backgroundColor='#D01828';
        if(item.NUM<0) el1.style.backgroundColor='#00b429';
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
        span1.innerHTML='设备ID: ';
        span2.innerHTML=item.KKBH;
        d2.fontFamily='Source Han Sans CN';
        d2.style.color = "rgba(255,255,255,1)";
        d2.appendChild(span1)
        d2.appendChild(span2)
        el.appendChild(d2);

        let d3 = document.createElement('div');
        let span3= document.createElement('span'); 
        let span4= document.createElement('span'); 
        span3.innerHTML='地点: ';
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
          span5.innerHTML='方向: ';
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
        span7.innerHTML='过车辆: ';
        span8.innerHTML=item.NUM;
        d5.fontFamily='Source Han Sans CN';
        d5.style.color = "rgba(0,198,255,1)";
        d5.appendChild(span7)
        d5.appendChild(span8)
        el.appendChild(d5);
        let popup= new minemap.Popup({closeOnClick: false, closeButton: false, offset: [0, 0]})
        .setLngLat(lnglat)
        .setDOMContent(el)
        .addTo(this.map);
        this.map_cover.popups.push(popup);
        let marker = new minemap.Marker(el1, {offset: [-8,0]}).setLngLat(lnglat).addTo(this.map);
        this.map_cover.markers.push(marker);
        
      },
      /**
       *车辆流动页面热点道路
       *车辆流动页面热点卡口
       *{@params} type 1->实时，2->今天，3->昨天，4->自定义 xzqh：行政区划编码
      */
      getHotCarDatas(type){
        let that=this;
        that.clearMap();
        var hotroadData={};  //存放热点道路参数
        var hotcardData={};  //存放热点卡口参数
        // if(type!='4'){
          hotroadData.stime=type;
          hotcardData.stime=type;
        // }
         if(type=='4'){
          hotroadData.stime=that.timeRange[0];
          hotroadData.etime=that.timeRange[1];

          hotcardData.stime=that.timeRange[0];
          hotcardData.etime=that.timeRange[1];
        }
        if(that.xzqh!=''){
          hotroadData.xzqh=that.xzqh;
          hotcardData.xzqh=that.xzqh;
        }
        // 请求热点卡口数据
        interf.GET_HOT_RANK_API(hotcardData)
        .then(response=>{
          if (response && response.status == 200){
            var data = response.data;
            that.tableDatas=data.data;  
            if (data.errcode == 0) {
              if(that.tableDatas.length>0){
                //  调用卡口地图方法
                that.tableDatas.forEach(element => {
                  that.getcardMapData(element)
                });
              }
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
          // 请求热点道路数据
          interf.GET_HOT_ROAD_API(hotroadData)
          .then(response=>{
            if (response && response.status == 200){
              var data = response.data;
                if (data.errcode == 0) {
                  that.indexDatas=data.data;
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
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
    },
   /*##清除地图加载点、线、面、弹框*/
  clearMap(){
    let that=this;
    if(this.map_cover.popups.length>0){
      this.map_cover.popups.forEach(e=>{
        e.remove();
      })
    };
    this.map_cover.popups=[];
    if(this.map_cover.markers.length>0){
      this.map_cover.markers.forEach(e=>{
        e.remove();
      })
    };
    this.map_cover.markers=[];
    if(that.map_cover.belongList.length>0){
      that.map_cover.belongList.forEach(e=>{
        e.remove();
      })
    };
    that.map_cover.belongList=[];
  }
  }
}
</script>
<style scoped lang='scss'>
@import '@/assets/css/color.scss';
@import "../../assets/css/base.css";
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.car-info-div {
position: fixed;
    z-index: 10;
    right: 13px;
    // width: 17vw;
    width:24.6875vw;
    height: 80vh;
    top: 9.388vh;
}
.car-info_container {
  // width: 100%;
  // height: 100%;
  .car-info_title{
    position: relative;
    // width: 96%;
    font-family: Microsoft YaHei;
    font-size: 1vw;
    color: $color-white;
    border:1px solid;
    border-image:linear-gradient(0deg, rgba(2,8,47,1), rgba(32,103,187,1)) 1 1;
    box-shadow:0px 0px 0px 0px rgba(7,12,43,1);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    // padding: 2px 2% 0.6rem 2%;
    font-weight: bolder;
  }
  .car-info_tab{
    font-family:Source Han Sans CN;
    font-weight:400;
    font-style:italic;
    padding: 2px 2% 0.6rem 2%;
    @include flex(row,center,center);
    >span{
      @include flex(column,center,center);
      width:50%;
      >div{
        @include flex(column,center,center);
        width:50%;
      }
    }
    >span:nth-child(1){
      color:$color-yellow;
    }
    >span:nth-child(2){
      color:$color-active;
    }
  }
    .xian_order{
      color: $color-white;
    width: 100%;
    height: 3vh;
    line-height: 3vh;
    text-align: center;
    font-size: 1.2vw;
    &--city{
      color:$color-active;
    }
    }
  .car-info_content {
    width: 98%;
    height: 85%;
    background-color: $color-bg-1;
    margin: 1%;
    
    #sumCountChange{
      width:100%;
      height:25vh;
    }
    #accurCreateChange{
      width:100%;
      height:25vh;
    }
    
  }
}
.car-info_container .text{
  color: #fff;
  position: absolute;
  top:0;
  right: 20vw;
}
.car-info_container .cars{
  color: #fff;
  text-align:left;
  position: absolute;
  top: 12vh;
  right: 1.5vw;
}
.car-info_container .active{
  background-color:#0079fe;
  color: #efddfe;
  cursor:pointer;
}
.car-info_container .back{
  height:34px;
  font-size:16px;
  padding-top: 5px;
  font-family:Source Han Sans CN;
  font-weight:400;
  color:rgba(0,198,255,1);
  padding-left: 17px;
  cursor:pointer;
  margin-right: 108px;
}

.car-info_container .echarts{
  width:474px;
  height:368px;
  margin-bottom:1vh;
}
.car-info_container .data{
  margin:1vh 0;
  padding-top:1vh;
  padding-right: 3px;
}
.car-info_container .top{
  // background:linear-gradient(0deg,#00082f,#012a60);
  width:478px;height:34px;
  // padding:0.5vh 0;
  // border:1px solid;
  // border-image:linear-gradient(0deg, rgba(2,8,47,1), rgba(32,103,187,1)) 1 1;
  box-shadow:0px 0px 0px 0px rgba(7,12,43,1);
  font-size:18px;
  font-family:Source Han Sans CN;
  font-weight:400;
  color:rgba(254,254,254,1);
}
.car-info_container .button{
  position: absolute;
  top:1vh;
  right:2vw;
  span{
    padding:5px;
    border: 1px solid white;
    border-radius: 3px;
    background: #aeaeae;
  }
  .active{
    background-color:#0079fe;
    color: #efddfe;
    cursor:pointer;
    }
}
.car-info_container .device-statics_sort_list{
      width:35%;
      height: 5vh;
      margin-top:10.5vh;
      float:right;
      color: #fff;
}
.carFlowBelong .belong {
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
 .carFlow-main {
    height: 951px;
    border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
    .analysis {
      width: 8.5vw;
      height: 3vh;
    }

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
}
.carFlowBelong .isSelected{
  color:rgba(255,255,255,1);
}
.carFlowBelong .noSelect{
  color:rgba(166,175,205,1);
}
.carFlowBelong .change {
  position: absolute;
  top: 60px;
  left: 0;
  display: flex;
  padding: 0 30px;
  .bg{
    // border:1px solid #ffffff;
    background: #00C6FF;
  }
  .bg1{
    background: #265E45;
  }
  .changebg{
     background:#0473B2;
  }
  .changebg1{
    background: #0DD77D;
  }
  
}
.carFlowBelong .provinces {
  width: 213px;
  height: 32px;
  // background: rgba(0, 198, 255, 1);
  margin-top: 4vh;
  cursor: pointer;
  flex: 1;
  margin-right: 2px;
}
.carFlowBelong .city {
  width: 207px;
  height: 32px;
  // background: rgba(38, 94, 69, 1);
  margin-top: 4vh;
  cursor: pointer;
  flex: 1;
}
#card-modal .hotcard{
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
        // background-color: $color-bg-1;
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
        padding:0 1.5vw;
        height: 41vh;
        .table{
          height: 41vh;
        }
      }
      
    }
}
</style>