<template>
  <div class="car-info-div">
    <div class="car-info_container">
      <!-- top部分  boxstyle  #082354-->
      <div class="car-info_title">
        <div class="top" style="">
          <span style="display:flex;height:4vh;line-height:2.2vh;"  >
            <span class="back"  @click="goback()" v-show="showback">&lt;&lt; 返回全省</span>
            <div class="title" style="text-align:center;margin-left:8vw;line-height:3.5vh" v-if="showback==false" >全部车辆监控</div>
            <!-- <m-title v-if="showback==false" style="height:4vh;line-height:4vh;" label="全省统计"></m-title> -->
            <span style="padding:5px 0" v-else>{{provinceData.city}}</span>
            <!-- <m-title :label='showback==false ? "全省统计":"西安市"' img_type=1 style="height:4vh;line-height:4vh;"></m-title> -->
          </span>
        </div>
      </div>
      <!-- <div class='car-info_title'>总计进入车辆次数:<span class=''>{{statics.count}}</span></div> -->
      <!-- 全省数据 -->
      <div class="data" >
        <m-tab style="margin:5px" label='总计进入车辆次数' :value='provinceData.addIn'></m-tab>
        <div class='car-info_tab'>
          <span><div>进入辆次</div><div><span class=''>{{provinceData.incount}}</span></div></span>
          <span><div>流出辆次</div><div><span class=''>{{provinceData.outcount}}</span></div></span>
        </div>
      </div>   
      <!-- 折线图 -->
        <div class="echarts">
          <m-title label='流动趋势' img_type=1 style='width:6vw;'></m-title>
          <div id="">
            <m-line-chart :flowchartsData='flowchartsData' c_id='sumCountChange'></m-line-chart>
          </div>
        </div>
        <!-- 饼状图 -->
        <div  class="echarts" style="position:relative;"  >
          <m-title label='车辆类型分析' img_type=1 style='width:8vw;'></m-title>
          <div class="typeanalysis">
            <span :class="{active: isActive == 1}" @click="change(1)">进入</span>
            <span :class="{active: isActive == 2}" @click="change(2)">流出</span>
          </div>
          <div class="cars">
            <div>大车:{{echartsData.BIGCAR}}辆次</div>
            <div>小车:{{echartsData.SMALLCAR}}辆次</div>
          </div>
          <div style="width:154px;height:154px;margin-left:3.5vw" id='accurCreateChange'></div>
            <!-- <div class="text">122多少两次</div> -->
          <!-- <div id="">
             <m-line-chart c_id='accurCreateChange'></m-line-chart>
          </div> -->
        </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import echarts from 'echarts'
import mTitle from "@/components/UI_el/title_com.vue";
import mLineChart from "@/components/UI_el/double_line_chart.vue";
import mTab from '@/components/UI_el/tab.vue'
import blur from '../../blur.js'
export default {
  name: "TIndex",
  data() {
    return {
      data:true,
      city:'',
      fxlx:'1',   //1 进 2出
      stime:'1',  //1 最近的时间 2 今天 3昨天  
      timeRange:'',
      isActive: 1,   //1进入  2流出
      xzqh:'', //行政区号
      showback:false,  //显示返回全省
      map: {},
      flowchartsData:{
        legend: ["进入车辆次", "流出车辆次"],
        innum:[],
        outnum:[]
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
      accurCreateChange:null,
      options:{
        legend: {        
            orient: 'vertical',         
            x: 490,
            y: 'center',
            itemWidth: 50,   // 设置图例图形的宽
            itemHeight: 50,  // 设置图例图形的高          
            itemGap: 50,
            textStyle: {
              fontSize: 45,
              color: '#fff'
            },
            // backgroundColor: '#eee',  // 设置整个图例区域背景颜色
            // data: ['小轿车','货车','大车','小车'],
          },
        series: [
            {
              type: 'pie',
              radius: ['30%', '60%'], 
              center: ['30%', '50%'], 
              data:[
                {'value':''},
                {'value':''}
              ],
              // itemStyle 设置饼状图扇形区域样式
              itemStyle: {
                 normal : {
                    label : {
                      show : false
                    },
                    labelLine : {
                      show : false
                    }
                  },
                // emphasis：英文意思是 强调;着重;（轮廓、图形等的）鲜明;突出，重读
                // emphasis：设置鼠标放到哪一块扇形上面的时候，扇形样式、阴影
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(30, 144, 255，0.5)'
                }
              },
              
            },
            
          ],
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
      accurChart:null,
      statics:{count:'+2328',in:'+4546',out:'-2328'}
    };
  },
  components:{mTitle,mLineChart,mTab,blur},
  mounted() {
    // this.initaccurCreateChange();
    this.getdata();
    this.map = this.$store.state.map;
    let that = this;
    that.$store.commit("setRight", '26.5vw');
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.getTrafficData();
    that.getIndexDatas(that.stime,that.fxlx) 
    that.getprovinceData(that.stime)
    that.carflowData(that.stime)
    // that.initSumCharts();
    // that.initAccurCharts();
    
  },
  destroyed() {
    this.flyRoutes = [];
    this.map.stop();
    let that = this;
    that.map.setPitch(0); //设置地图的俯仰角
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
  watch:{
    stime(newValue, oldValue){
      return newValue;
    }
  },
  methods: {
    // 如果点击实时，则右边数据全部加载实时的数据
    realTime(){
      let that = this;
      if(that.stime=='1'){
        that.getprovinceData('1')
        that.carflowData('1')
        that.getIndexDatas('1','1')
      }
    },
    // 点击返回全省，调用默认显示全省的数据
    goback(){
      let that = this;
      that.showback=false;
      that.getprovinceData(that.stime)
      that.getIndexDatas(that.stime,that.fxlx) 
      // this.getprovinceData(stime,xzqh)
    },
    // 接收传来的数据 将变量的值发送给data，如果值为true，则显示对应的数据
    
    getdata(){
      let that = this;
      /**
       *接收传过来的参数
       * paramxzqh:  行政区号  gettime:时间 1，2，3，4
       * paramcity:  城市  timeRange:自定义的时间
       */   
      blur.$on('determine',times=>{
        that.timeRange=times;
        // console.log(that.timeRange)
        if(that.stime=='4'){
          that.getprovinceData(that.timeRange[0],that.xzqh,that.timeRange[1])
          that.carflowData(that.timeRange[0],that.timeRange[1])
          
        }      
      })  
      blur.$on("gettime",time=>{
        that.stime=time;
        // console.log(that.stime)  
        if(that.stime!='4'){
          that.getprovinceData(that.stime)
          that.getprovinceData(that.stime,that.xzqh)  
          that.getIndexDatas(that.stime,that.fxlx,that.xzqh)
          that.getIndexDatas(that.stime,that.fxlx)   
          that.carflowData(that.stime)
          // that.getprovinceData(that.stime,that.xzqh)    
        }else{
          // that.getprovinceData(that.timeRange[0],that.xzqh,that.timeRange[1])
        }       
      }) 
      blur.$on("paramxzqh",xzqh=>{
        that.xzqh=xzqh;
        // console.log(that.stime,that.xzqh);
        if(that.stime!='4'){
          that.getprovinceData(that.stime,that.xzqh);
          that.getprovinceData(that.stime,that.xzqh,that.timeRange) 
          that.getIndexDatas(that.stime,that.fxlx,that.xzqh);
        }
       
      })
      blur.$on("paramcity",city=>{
        that.city=city
      })
      blur.$on('sendTime',data=>{
        // console.log(data)
      })
      // 接受数据 点击城市获取对应城市  总计进入车辆辆次的数据
      // blur.$on('getcitys',data=>{
      //   // console.log(data)
      //   let citys=data;
      //   that.showback=true;  //显示返回全省
      //   that.provinceData.addIn=citys.data.addIn;
      //   that.provinceData.incount=citys.data.incount;
      //   that.provinceData.outcount=citys.data.outcount;
      //   that.provinceData.city=citys.data.city;
      //   // console.log(citys)
      // })
      // 接受 车辆类型分析数据 默认显示进去的数据
      // blur.$on('gettypeData',data=>{
      //   // console.log(data)
      //   this.showback=true;  //显示返回全省
      //   let citytypedata=data;
      //   this.echartsData.BIGCAR=citytypedata.data.BIGCAR;
      //   this.echartsData.SMALLCAR=citytypedata.data.SMALLCAR;
      // })
      // 接受 如果不是日历选择的时间 车辆流动页面全省车辆统计 GET_VEH_PRO_API
      blur.$on('getcitycardata',data=>{
        // console.log(data)
        let citycardatas=data;
        that.showback=true;  //显示返回全省
        // console.log(citycatdatas)
        that.provinceData.addIn=citycardatas.data.addIn;
        that.provinceData.incount=citycardatas.data.incount;
        that.provinceData.outcount=citycardatas.data.outcount;
        that.provinceData.city=citycardatas.data.city;
      })
    },
    // 如果选择左侧的城市，显示对应城市的车辆类型分析
    //  点击进入和流出 触发 change事
    change(i){  
      let that = this;
      // that.getIndexDatas(that.stime,i) 
      that.isActive = i.toString();
      that.fxlx = i.toString();
      blur.$emit("getfxlf",that.fxlx)
      that.getIndexDatas(that.stime,that.isActive) 
    },
    // 车辆流动页面全省车辆统计 xzqh===undefined && etime===undefined
    getprovinceData(stime,xzqh,etime){
      console.log(stime,xzqh,etime)
      let that = this;
      // 一个参数
      if(xzqh===undefined && etime===undefined){
       interf.GET_VEH_PRO_API({
        id:"",
        stime:stime,
      })
      .then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          console.log(data)
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
      }
      // 如果不是自定义时间，2个参数stime,xzqh
      if(xzqh!=undefined && etime===undefined){
       interf.GET_VEH_PRO_API({
        id:"",
        stime:stime,
        xzqh:xzqh
      })
      .then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          console.log(data)
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
      }
      // 如果是自定义的时间，获取数据 3个参数
      if(etime!=undefined && xzqh!=undefined){
        interf.GET_VEH_PRO_API({
          id:"",
          stime:that.timeRange[0],
          xzqh:xzqh,
          etime:that.timeRange[1]
        })
        .then(response=>{
          if (response && response.status == 200){
            var data = response.data;
            console.log(data)
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
        })
      }
   
    },
    /**
     * 车辆流动页面流动趋势 默认显示实时数据  GET_FLOW_TREND_API 
     */
    carflowData(stime,etime){ 
      let that = this;  
      // 如果有两个参数stime,etime
     if(etime!=undefined && stime!='4'){
        interf.GET_FLOW_TREND_API({
        id:"",
        stime:stime,
        etime:etime

      })
      .then(response=>{
       if (response && response.status == 200){
           var data = response.data;
           console.log(data)
           if (data.errcode == 0) {
             var obj=data.data;
            //  for(){
            //    that.
            //  }
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
      }
      // 如果参数只有stime
      if(etime===undefined  && stime!='4'){
        interf.GET_FLOW_TREND_API({
        id:"",
        stime:stime
      })
      .then(response=>{
       if (response && response.status == 200){
           var data = response.data;
           console.log(data)
           if (data.errcode == 0) {
             var obj=data.data;
            //  for(){
            //    that.
            //  }
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
      }
      
  
    },
    /**
     * 车辆流动页面车辆类型分析  默认显示实时的数据
     * 如果客户没有点击进入或者流出，默认显示全省进入的数据  两个参数的 GET_VEH_TYPE_API
     */
    getIndexDatas(stime,fxlx,xzqh,etime){
      let that=this; 
      // console.log(xzqh)
      if(xzqh===undefined && etime==undefined && stime!='4'){
        interf.GET_VEH_TYPE_API({
          id:"",
          stime:stime,
          fxlx:fxlx
        })
        .then(response=>{
        if (response && response.status == 200){
            var data = response.data;
            //  console.log(data)
            if (data.errcode == 0) {
              that.echartsData.BIGCAR=data.data.BIGCAR;
              that.echartsData.SMALLCAR=data.data.SMALLCAR;
              // 绘制饼状图
              this.options.series[0].data[0].value=that.echartsData.BIGCAR;
              this.options.series[0].data[1].value=that.echartsData.SMALLCAR;
              that.changechart = echarts.init(document.getElementById('accurCreateChange'));
              that.changechart.setOption(that.options);
              //  console.log( that.echartsData.BIGCAR,that.echartsData.SMALLCAR)
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
      }
      if(xzqh!=undefined && etime===undefined){
        interf.GET_VEH_TYPE_API({
          id:"",
          stime:stime,
          xzqh:xzqh,
          fxlx:fxlx
        })
        .then(response=>{
        if (response && response.status == 200){
            var data = response.data;
            //  console.log(data)
            if (data.errcode == 0) {
              that.echartsData.BIGCAR=data.data.BIGCAR;
              that.echartsData.SMALLCAR=data.data.SMALLCAR;
              // 绘制饼状图
              this.options.series[0].data[0].value=that.echartsData.BIGCAR;
              this.options.series[0].data[1].value=that.echartsData.SMALLCAR;
              that.changechart = echarts.init(document.getElementById('accurCreateChange'));
              that.changechart.setOption(that.options);
              //  console.log( that.echartsData.BIGCAR,that.echartsData.SMALLCAR)
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
      }
      if(xzqh!=undefined && etime!=undefined){
         interf.GET_VEH_TYPE_API({
          id:"",
          stime:stime,
          xzqh:xzqh,
          fxlx:fxlx
        })
        .then(response=>{
        if (response && response.status == 200){
            var data = response.data;
            //  console.log(data)
            if (data.errcode == 0) {
              that.echartsData.BIGCAR=data.data.BIGCAR;
              that.echartsData.SMALLCAR=data.data.SMALLCAR;
              // 绘制饼状图
              this.options.series[0].data[0].value=that.echartsData.BIGCAR;
              this.options.series[0].data[1].value=that.echartsData.SMALLCAR;
              that.changechart = echarts.init(document.getElementById('accurCreateChange'));
              that.changechart.setOption(that.options);
              //  console.log( that.echartsData.BIGCAR,that.echartsData.SMALLCAR)
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
      }
    },
    //获取巡航数据
    getTrafficData() {
      let that = this;
    },
    setSelectItems(name,id){
      this.selectItem.road=name;
    },
    // change1(){
    //   alert("进入")
    // },
    /**
     * 生成发生数量趋势echarts
     */
    initSumCharts(){
      if(!this.countChart){
        this.countChart = echarts.init(document.getElementById('sumCountChange'));
      };
      this.countChart.setOption(this.accurChangeOption);
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
<style scope lang='scss'>
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
    top: 6.388vh;
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
    // width: 96%;
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
.typeanalysis{
  position: absolute;
  right:3vw;
  top:5vh;
  cursor:pointer;
  span{
    border: 1px solid #fff;
    color: #fff;
    width: 3vw;
    height: 2vh;
    padding: 0.5vh 0.5vw;
    border-radius: 5px;
    // background: #aeaeae;
  }
}
.cars{
  color: #fff;
  text-align:left;
  position: absolute;
  top: 12vh;
  right: 3vw;
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
  // background:rgba(2,6,31,0);margin-top:15px;
// border:1px solid;
// border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;

}

.echarts{
  width:474px;
  height:368px;
  background:rgba(2,6,31,0);
  border:1px solid;
  border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
  margin-bottom:20px;
}
.data{
  margin-bottom: 20px;
  background:rgba(2,6,31,0);
  border:1px solid;
  border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
}
.top{
  background:linear-gradient(0deg,#00082f,#012a60);
  width:478px;height:34px;
  border:1px solid;
  border-image:linear-gradient(0deg, rgba(2,8,47,1), rgba(32,103,187,1)) 1 1;
  box-shadow:0px 0px 0px 0px rgba(7,12,43,1);
  font-size:18px;
  font-family:Source Han Sans CN;
  font-weight:400;
  color:rgba(254,254,254,1);
}
</style>