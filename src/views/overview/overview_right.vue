<template>
  <div class="overview-info">
    <div class="overview-info_container">
      <div class="boxstyle top">
        <div>
          <m-title label='省内超速情况' img_type=1 style='width:9vw;height:10%'></m-title>
        </div>
        <div class="top-main">
          <!-- 切换时间 -->
          <div style="display:flex;box-sizing:border-box;text-align:center;cursor:pointer;">
            <div @click='switchtime(1)' :class="isSelected==1? 'isSelected':''" style="flex:1;">
              <div>今日
                <span>{{overSpeedData.today}}</span></div>
            </div>
            <div @click='switchtime(2)' :class="isSelected==2? 'isSelected':''" style="flex:1">
              <div >本周
                <span>{{overSpeedData.lastWeek}}</span></div>
            </div>
            <div @click='switchtime(3)' :class="isSelected==3? 'isSelected':''" style="flex:1">
              <div>本月
                <span>{{overSpeedData.lastMonth}}</span></div>
            </div>
          </div>
          <!-- 显示详细数据 -->
          <div style="display:flex;margin-top:0.5vh;height:85%">
            <!-- 左侧信息 :style="i==1? 'border-top:1px solid #333333;border-bottom:1px solid #333333':''" -->
            <div class="top-left">
              <div v-for="(item,i) of speedingprovince" :key='i' >
                <div>{{item.name}}</div>
                <div style="color:#00a0ff">{{item.value}}</div>
              </div>
            </div>
            <!-- 折线图  chart_type='line' -->
            <div style="flex:9">
              <bar-chart :chart_data="speeding_data" xAxis_data='0' c_id="speed-province"></bar-chart>
            </div>
          </div>
        </div>
        <!-- <div>
          <m-title label='今日省内车辆运行态势' img_type=1 style='width:11vw;'></m-title>
        </div>
        <div class="tab">
          <div>
            <div class="split"></div>
            <div class='label'>速度检测次数</div>
          </div>
          <div>
            <div class="split"></div>
            <div class='label'>平均超速幅度</div>
          </div>
        </div>
        <div class="overview-info_sort">
          <div>
            <m-list-o :list='listItems'></m-list-o>
          </div>
          <div style="width:1px;height:10vh;background:radial-gradient(#f3f0f0,rgba(117,123,163,0.25098),transparent);"></div>
          <div class="avg">{{avg}}</div>
          <div id="overview-info_sort" v-loading='tableLoading'>
            
          </div>
        </div> -->
      </div>
      <div class="boxstyle">
        <m-title label='进出陕车辆趋势' img_type=1 style='width:9vw;'></m-title>
        <div style='width:100%;height:26vh'> 
          <m-line-chart style='width:100%;height:26vh' :chart_data="chart_data" c_id='overViewsumCountChange' ></m-line-chart>
        </div>
      </div>
      <div class="boxstyle">
        <m-title label='车辆保有量' img_type=1  style='width:7vw;'></m-title>
        
        <m-tab :isShowIcon='showIcon' label='陕西车辆保有量' :value='carStatics.count'></m-tab>
        <div class='register'>
          <div><span>本月注册</span><span>{{carStatics.this_month}}</span></div>
          <div><span>上月注册</span><span>{{carStatics.front_month}}</span></div>
        </div>
        <div style="height:23vh;width:100%;">
          <bar-chart c_id='accurCreateChange' :chart_data="car_chart_data" style="height:22vh;width:100%;"></bar-chart>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import echarts from 'echarts'
import mTitle from "@/components/UI_el/title_com.vue";
import m_list from '@/components/UI_el/list_o.vue'
import mLineChart from "@/components/UI_el/double_line_chart.vue";
import barChart from "@/components/UI_el/bar_chart.vue";
import mTab from '@/components/UI_el/tab.vue'
import blur from '../../blur.js'
export default {
  name: "overview_right",
  data() {
    return {
      avg:'',
      map: {},
      stime:'1',
      data1:null, 
      overSpeedData:{today:'',lastWeek:'',lastMonth:''},
      speedingprovince:[
        {'name':'总检测次数:','value':''},
        {'name':'超速比例:','value':''},
        {'name':'平均速度/限速:','value':''}
      ],
      listItems:[
        {'label':'超速次数','value':null},
        {'label':'总检测数','value':null}
      ],
      listmap:[],
      speeding_data:{
        legend: ["次数", "幅度"],
        xdata:[],
        ydata:[]
      },
      countChart:null,
      chart_data:{
        legend: ["进入辆次", "流出辆次"],
        xdata:[],
        y1data:[],
        y2data:[]
      },
      isSelected:1,
      car_chart_data:{
        legend: [],
        xdata:[],
        ydata:[]
      },
      staticsData: {sum: 10,mainCount:0},
      sg_sort_data: [
        { name: "机动车与机动车", value: "12", radio: "32%" },
        { name: "机动车与非机动车", value: "122", radio: "32%" },
        { name: "行人", value: "2", radio: "32%" }
      ],
      tableLoading:false,//加载中...控制
      carStatics:{count:0,front_month:0,this_month:0},
      showIcon:false,
      interval:null,
    }
  },
  components: {
    mTitle,
    mLineChart,
    mListO:m_list,
    mTab,
    barChart
  },
  created(){
  },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    that.initSumCharts();
    that.initAccurCharts();
    // this.interval=setInterval(()=>{
    //   that.initOverSpeedModule();
    // },1000*60)
    that.initSumCharts1();
    this.getOverSpeedData();
    that.overSpeedData.lastWeek=urlConf.overview_weekCount?urlConf.overview_weekCount:'';
    that.overSpeedData.lastMonth=urlConf.overview_monthCount?urlConf.overview_monthCount:'';
  },
  destroyed() {
    this.flyRoutes = [];
    this.map.stop();
    let that = this;
    that.map.setPitch(0); //设置地图的俯仰角
    if(this.interval){
      clearInterval(this.interval);
    }
  },
  methods: {
    getOverSpeedData(){
      let that=this;
      let param={};
      interf.GET_PRO_COUNT_API(param).then(response => {
        if (response && response.status == 200) {
          let data = response.data;
          that.overSpeedData.today=data.data.todayCount;
          if(that.overSpeedData.lastWeek=='')  that.overSpeedData.lastWeek=data.data.weekCount;
          if(that.overSpeedData.lastMonth=='') that.overSpeedData.lastMonth=data.data.monthCount;
        }
      })
    },
    /**
     * 点击切换时间
     */
    switchtime(i){
      let that=this;
      that.isSelected=i;
      that.stime=i;
      that.initSumCharts1()
    },
     /**
     * 生成 省内超速情况 echarts
     * 省内超速情况   获取省内车辆运行态势数据  GET_PRO_CAR_API   1 今日 2 本周 3 本月   xzqh
     */
    initSumCharts1(){
      let that=this;
      that.speeding_data.ydata=[];
      that.speeding_data.xdata=[];
      let param={};
      param.stime=that.stime;
      interf.GET_PRO_CAR_API(param).then(response => {
          if (response && response.status == 200) {
            let data = response.data;
            if (data.errcode == 0) {
              that.speedingprovince[0].value=data.data.count;
              that.speedingprovince[1].value=data.data.ratio;
              that.speedingprovince[2].value=data.data.avg;
              // 超速次数--cscount    平均行駛速度--avg
              if(data.data.listmap.length>0){
                let arr=[
                  {name:'10%',value:'0'},
                  {name:'20-50%',value:'0'},
                  {name:'50%',value:'0'},
                  {name:'其他',value:'0'}
                ];
                for(var i=0;i<data.data.listmap.length;i++){
                  let item=data.data.listmap[i];
                  for(var j=0;j<arr.length;j++){
                    if(item.WFXW==arr[j].name){
                      arr[j].value=item.NUM;
                    }
                  }
                };
                arr.map((e)=>{
                  that.speeding_data.ydata.push(e.value);
                  that.speeding_data.xdata.push(e.name);
                })
              }
            } else {
              that.$message({
                message: '省内超速情况',
                type: "error",
                duration: 1500
              });
            }
          }
        })
       .catch(err => {
          console.error(err);
        })
        .finally(() => {
          that.tableLoading = false;
        })

    },
    /**
     * 初始化省内车辆运行态势echarts
     */
    initAccidentStaticsChart(){
      let that=this;
      that.accident_option.series[0].data=[];
      that.tableLoading=true;
      interf.GET_PRO_CAR_API({}).then(response => {
        that.tableLoading=false;
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
                that.listItems[0].value=data.data.cscount;
                that.listItems[1].value=data.data.count;
                that.avg=data.data.avg;
                if(!that.accident_chart){
                  that.accident_chart = echarts.init(document.getElementById('overview-info_sort'));
                };
                that.accident_option.series[0].data=[{name:'超速次数',value:that.listItems[0].value},{name:'总检测数',value:that.listItems[1].value}]
                that.accident_chart.setOption(that.accident_option);
                window.addEventListener("resize",()=>{
                  that.accident_chart.resize();
                })
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
          console.error(err);
          that.tableLoading=false;
        })
        .finally(() => {
          that.tableLoading = false;
        });
    },
    
    /**
     * 初始化进出陕车辆趋势echarts
     */
    initSumCharts(){
      let _this=this;
      interf.GET_VEH_CAR_API({})
      .then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              let _data=_this.chart_data;
              _data.xdata=data.data.timelist;
              data.data.inlist=data.data.inlist.map(s=>{
                s=(s/10000).toFixed(2);
                return s;
              });
              data.data.outlist=data.data.outlist.map(s=>{
                s=(s/10000).toFixed(2);
                return s;
              })
              _data.y1data=data.data.inlist;
              _data.y2data=data.data.outlist;
              _data.unit=['万','万'];
              _this.chart_data=_data;
            } else {
              _this.$message({
                message: data.errmsg,
                type: "error",
                duration: 1500
              });
            }
          }
        })
       .catch(err => {
          console.error(err);
        })
        .finally(() => {
          _this.tableLoading = false;
        })
    },
    /**
     * 初始化全省车辆保有量
     */
    initAccurCharts(){
      let _this=this;
      interf.GET_CAR_FLOW_API({}).then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              let _data=data.data;
              _this.carStatics.count=_data.count?_data.count:'';
              _this.carStatics.this_month=_data.month?_data.month:'';
              _this.carStatics.front_month=_data.lastmonth?_data.lastmonth:'';
              let car_data=_this.car_chart_data;
              _data.list.forEach(e=>{
                car_data.xdata.push(e.name);
                car_data.ydata.push(e.num);
              });
             _this.car_chart_data=car_data;
            } else {
              _this.$message({
                message: '车辆保有量数据接口请求失败',//data.errmsg,
                type: "error",
                duration: 1500
              });
            }
          }
        })
       .catch(err => {
          console.error(err);
        })
        .finally(() => {
          _this.tableLoading = false;
        })
    }
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
.overview-info {
  position: fixed;
  z-index: 10;
  right: 13px;
  width: 480px;
  height: 80vh;
  top: 10vh;
  color: white;
}
.overview-info_container {
  width: 100%;
  height: 100%;
  .top{
    width: 100%;
    height: 25vh;
    .top-main{
      box-sizing: border-box;
      padding:0 1vw;
      width: 100%;
      height: 85.5%;
    }
    .top-main span{
      padding-left: 1vw;
    }
    .isSelected{
      color: #00a0ff;
      border-bottom: 2px solid #00a0ff;
      padding-bottom: 0.5vh;
      text-align: center;
    }
    .top-main .top-left{
      flex: 3.5;
      div{
        margin:0.3vh 0;
      }
    }
  }
  .register{
    width:100%;
    height:4vh;
     @include flex(row, center);
     >div{
       width:50%;
        height:4vh;
       @include flex(row, center,center);
       >span{
         text-align:center;
         padding:0 15px;
       }
       >span:nth-child(2){
         font-size: 24px;
       }
     }
  }
  >div:nth-child(1){
    .tab{
      width:80%;
      margin:0 auto;
      height:3vh;
      // @include flex(row, center,center);
      >div{
        width: 43%;
        float:left;
        // @include flex(column, center,center);
        .split{
          width: 0.10417vw;
          height: 2vh;
          background: #116cf3;
          margin-top: 2vh;
          float: left;
        }
        .label{
          width: 80%;
          float: left;
          line-height: 6vh;
          margin-left: 10px;
        }
      }
      
    }
  }
  .overview-info_sort {
  width:90%;
  height:10vh;
  margin:2vh auto;
  @include flex(row, center,center);
  >div{
    @include flex(row, center,center);
    width:50%;
  }
  .avg{
    position: absolute;
    left: 48%;
    width: 50%;
    height: auto;
  }
  >div:nth-child(4){
    height: 100%;
    width: 40%;
  }
}
  >div{
    width:100%;}
  >div:nth-child(2),>div:nth-child(3){
    margin-top:2.5%;
  }
  #accurCreateChange{
    width:100%;
    height:25vh;
  }
}
#speed-province{
  width:100%;
  height: 100%;
 
}
</style>