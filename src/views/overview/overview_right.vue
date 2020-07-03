<template>
  <div class="overview-info">
    <div class="overview-info_container">
      <div class="boxstyle">
        <div>
          <m-title label='省内车辆运行态势' img_type=1 style='width:10vw;'></m-title>
        </div>
        <div class="tab">
          <span style="margin-right:1.5vw;">
            <i class="split"></i>
            速度检测次数</span>
          <span style="margin-left:0.5vw;">
            <i class="split"></i>
            平均行驶速度/限速</span>
        </div>
        <div class="overview-info_sort">
          <div>
            <m-list-o :list='listItems'></m-list-o>
          </div>
          <div style="width:1px;height:10vh;background:radial-gradient(#f3f0f0,rgba(117,123,163,0.25098),transparent);"></div>
          <div class="avg">{{avg}}</div>
          <div id="overview-info_sort" v-loading='tableLoading'>
            
          </div>
        </div>
      </div>
      <div class="boxstyle">
        <m-title label='进出陕车辆趋势' img_type=1 style='width:9vw;'></m-title>
        <div style='width:100%;height:28.99vh'> 
          <m-line-chart style='width:100%;height:28.99vh' :chart_data="chart_data" c_id='overViewsumCountChange' ></m-line-chart>
        </div>
      </div>
      <div class="boxstyle">
        <m-title label='车辆保有量' img_type=1  style='width:7vw;'></m-title>
        
        <m-tab :isShowIcon='showIcon' label='陕西车辆保有量' :value='carStatics.count'></m-tab>
        <div class='register'>
          <div><span>本月注册</span><span>{{carStatics.this_month}}</span></div>
          <div><span>上月注册</span><span>{{carStatics.front_month}}</span></div>
        </div>
        <div style="height:25.32vh">
          <bar-chart c_id='accurCreateChange' :chart_data="car_chart_data" ></bar-chart>
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
      data1:null, 
      listItems:[
        {'label':'超速次数','value':null},
        {'label':'总检测数','value':null}
      ],
      chart_data:{
        legend: ["进入辆次", "流出辆次"],
        xdata:[],
        y1data:[],
        y2data:[]
      },
      car_chart_data:{
        legend: [],
        xdata:[],
        ydata:[]
      },
      staticsData: {sum: 10,mainCount:0},
      accident_option: {
        grid:{
          top:'35%',
          left:'15%',
          right:'15%',
          bottom:'15%'
        },
        color:['#03baff','#333c73 '],
          tooltip: {
            show:false,
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: [
              {
                  name: '车辆运行态势',
                  type: 'pie',
                  radius: ['70%', '80%'],
                  avoidLabelOverlap: false,
                  label: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      label: {
                          show: false,
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  },
                  labelLine: {
                      show: false
                  },
                  data:this.data
              }
          ]
      },
      accident_chart:null,
      sg_sort_data: [
        { name: "机动车与机动车", value: "12", radio: "32%" },
        { name: "机动车与非机动车", value: "122", radio: "32%" },
        { name: "行人", value: "2", radio: "32%" }
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
      tableLoading:false,//加载中...控制
      carStatics:{count:0,front_month:0,this_month:0},
      showIcon:false,
      interval:null
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
    this.initAccidentStaticsChart();
    that.initSumCharts();
    that.initAccurCharts();
    this.interval=setInterval(()=>{
      _this.initAccidentStaticsChart();
    },1000*60)
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
              _data.y1data=data.data.inlist;
              _data.y2data=data.data.outlist;
              
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
            console.log(data)
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
      margin-top:1vh;margin-left:-3vw;
      @include flex(row, center,center);
      >span{
        @include flex(column, center,center);
        .split{
          width:2px;height:2vh;line-height:2vh;background:#116cf3;
          position: absolute;
          margin-left: -3vw;
        }
        
      }
      >span:nth-child(2){
        .split{
          margin-left: -4vw;
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
    margin-top:5%;
  }
  #accurCreateChange{
    width:100%;
    height:25vh;
    
  }
}

</style>