<template>
  <div class="car-info-div">
    <div class="car-info_container">
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
      showTime:'1',//	流动趋势 默认显示今日的数据
      city:'',
      fxlx:'1',   //1 进 2出
      stime:'1',  //1 最近的时间 2 今天 3昨天 
      etime:"",  
      timeRange:'',
      isShowIcon:false,
      staticsSort:[],
      timeName:'1', //流动趋势 时间
      fxlxName:'1', //车辆类型分析流入和进出
      isActive: 1,   //1进入  2流出
      xzqh:'', //行政区号
      showback:false,  //显示返回全省
      map: {},
      i:1,
      map_cover:{
        markers:[]
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
    this.map.setCenter([109.278987,35.747334]);
    // this.map.setZoom(6);
    this.getTrafficData();
    that.getprovinceData(that.stime)
    that.initSumCharts(that.timeName);
    that.getCarTypeDatas()
    
  },
  destroyed() {
    this.flyRoutes = [];
    this.map.stop();
    let that = this;
    that.map.setPitch(0); //设置地图的俯仰角
    if(this.map_cover.markers.length>0){
      this.map_cover.markers.forEach(e=>{
        e.remove();
      })
    }

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
    * 流动趋势	可切换1--【今日】、2--【昨日】、3--【近30天】
    */
   handleClick(i){
      let that = this;
      that.timeName=i.name;
      that.initSumCharts(that.timeName)
   },
  //  changeTime(i){
  //    let that = this;
  //    that.showTime=i;
  //    that.initSumCharts(that.showTime)
  //  },
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
      that.getprovinceData('1')
      // that.carflowData('1') 
      that.initSumCharts(that.timeName)
      that.getCarTypeDatas() 
    },
    // 接收传来的数据 将变量的值发送给data，如果值为true，则显示对应的数据
    
    getdata(){
      let that = this;
      /**
       * 接收传过来的参数
       * paramxzqh:  行政区号  gettime:时间 1，2，3，4
       * paramcity:  城市  timeRange:自定义的时间
       */   
      //  接收到对应的时间  1->实时，2->今天，3->昨天，4->自定义
      blur.$on("gettime",time=>{
        that.stime=time;
        if(time!='4'){
         that.getprovinceData(that.stime) 
         that.getCarTypeDatas() 
        }  
      }) 
      //接收自定义的  timeRange:自定义的时间
      blur.$on('determine',times=>{
        that.timeRange=times;
        that.getprovinceData(that.stime) 
        that.getCarTypeDatas()  
         
      })  
      blur.$on("paramxzqh",xzqh=>{
        that.xzqh=xzqh;
        that.getprovinceData(that.stime,that.xzqh);
        that.getCarTypeDatas()
       
      })
      blur.$on("paramcity",city=>{
        that.city=city;
        that.showback=true; 
      })
      blur.$on('sendTime',data=>{
      })
      blur.$on('realtime',i=>{
        this.i=i  //表示中间三个组件
      })
     
      // 接受 如果不是日历选择的时间 车辆流动页面全省车辆统计 GET_VEH_PRO_API
      // blur.$on('getcitycardata',data=>{
      //   let citycardatas=data;
      // })
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
    change(i){  
      let that = this;
      // that.getIndexDatas(that.stime,i) 
      // that.isActive = i.toString();
      // that.fxlx = i.toString();
      // blur.$emit("getfxlf",that.fxlx)
      // that.getCarTypeDatas()
      // that.getIndexDatas(that.stime,that.isActive) 
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
             data.data.forEach(e=>{
               that.flowchartsData.y1data=[];
               that.flowchartsData.y2data=[];
               that.flowchartsData.xdata=[];
               that.flowchartsData.y1data.push(e.innum)
               that.flowchartsData.y2data.push(e.outnum)
               that.flowchartsData.xdata.push(e.date)
               that.flowchartsData=car_data;
             })
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
   /*##清除地图加载点、线、面、弹框*/
  clearMap(){
    //清除source
    // if(this.map_cover.sourceList.length>0){
    //   this.map_cover.sourceList.forEach(e=>{
    //     if(this.map.getSource(e)!=undefined){
    //       this.map.removeSource(e);
    //     }
    //   })
    // }
    // //清除layer
    // if(this.map_cover.lineList.length>0){
    //   this.map_cover.lineList.forEach(e=>{
    //     if(this.map.getLayer(e)!=undefined){
    //       this.map.removeLayer(e);
    //     }
    //   })
    // }
    // //清除popup
    // if(this.map_cover.popups.length>0){
    //   this.map_cover.popups.forEach(e=>{
    //     e.remove();
    //   })
    // }
    //清除marker
    if(this.map_cover.markers.length>0){
      this.map_cover.markers.forEach(e=>{
        e.remove();
      })
    }
  },

    /**
     * 生成重大事故发生趋势echarts
     */
    // initAccurCharts(){
    //   if(!this.accurChart){
    //     this.accurChart = echarts.init(document.getElementById('accurCreateChange'));
    //   };
    //   this.accurChart.setOption(this.accurChangeOption);
    // }
  }
}
</script>
<style scoped lang='scss'>
@import '@/assets/css/color.scss';
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
.text{
  color: #fff;
  position: absolute;
  top:0;
  right: 20vw;
}
.cars{
  color: #fff;
  text-align:left;
  position: absolute;
  top: 12vh;
  right: 1.5vw;
}
.active{
  background-color:#0079fe;
  color: #efddfe;
  cursor:pointer;
}
.back{
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

.echarts{
  width:474px;
  height:368px;
  margin-bottom:1vh;
}
.data{
  margin:1vh 0;
  padding-top:1vh;
  padding-right: 3px;
}
.car-info-div .top{
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
.car-info-div .button{
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
.car-info-div .device-statics_sort_list{
      width:35%;
      height: 5vh;
      margin-top:10.5vh;
      float:right;
      color: #fff;
    }
</style>