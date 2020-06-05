<template>
  <div class="car-info-div" v-show="carinfo">
    <div class="car-info_container boxstyle">
      <div class="car-info_title">
        <div>
          <span style="display:flex;height:4vh;line-height:4vh;"  >
            <span style="margin-right:1vw"  @click="goback()" v-show="showback">&lt;&lt; 返回全省</span>
            <m-title v-if="showback==false" style="height:4vh;line-height:4vh;" label="全省统计"></m-title>
            <span v-else>{{provinceData.city}}</span>
            <!-- <m-title :label='showback==false ? "全省统计":"西安市"' img_type=1 style="height:4vh;line-height:4vh;"></m-title> -->
          </span>
        </div>
      </div>
      <!-- <div class='car-info_title'>总计进入车辆次数:<span class=''>{{statics.count}}</span></div> -->
      <m-tab label='总计进入车辆次数' :value='provinceData.addIn'></m-tab>
      <div class='car-info_tab'>
        <span><div>进入辆次</div><div><span class=''>{{provinceData.incount}}</span></div></span>
        <span><div>流出辆次</div><div><span class=''>{{provinceData.outcount}}</span></div></span>
      </div>
      <div class="car-info_content">
        <div>
          <m-title label='流动趋势' img_type=1 style='width:6vw;'></m-title>
          <div id="">
            <m-line-chart  :flowchartsData='flowchartsData' c_id='sumCountChange'></m-line-chart>
          </div>
        </div>
        <div style="position:relative">
          <m-title label='车辆类型分析' img_type=1 style='width:8vw;'></m-title>
          <div class="typeanalysis">
            <span :class="{active: isActive == 1}" @click="change(1)">进入</span>
            <span :class="{active: isActive == 2}" @click="change(2)">流出</span>
          </div>
          <div class="cars">
            <div>大车:{{echartsData.BIGCAR}}辆次</div>
            <div>小车:{{echartsData.SMALLCAR}}辆次</div>
          </div>
          <div id='accurCreateChange'>
            <!-- <div class="text">122多少两次</div> -->
          </div>
          
          <!-- <div id="">
             <m-line-chart c_id='accurCreateChange'></m-line-chart>
          </div> -->
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
import mLineChart from "@/components/UI_el/double_line_chart.vue";
import mTab from '@/components/UI_el/tab.vue'
import blur from '../../blur.js'
export default {
  name: "TIndex",
  data() {
    return {
      carinfo:true,
      isActive: 1,
      showback:false,
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
                {value:234},
                {value:135}
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
    this.initaccurCreateChange();
    this.getdata();
    this.map = this.$store.state.map;
    let that = this;
    that.$store.commit("setRight", '20vw');
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.getTrafficData();
    that.getIndexDatas() 
    that.getprovinceData()
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
  methods: {
    // 点击返回全省，调用默认显示全省的数据
    goback(){
      this.showback=false;
      this.getprovinceData()
    },
    // 接收传来的数据 将变量的值发送给data，如果值为true，则显示对应的数据
    
    getdata(){
      blur.$on('getcitys',data=>{
        // console.log(data)
        let citys=data;
        this.showback=true;
        this.provinceData.addIn=citys.data.addIn;
        this.provinceData.incount=citys.data.incount;
        this.provinceData.outcount=citys.data.outcount;
        this.provinceData.city=citys.data.city;
        // console.log(citys)
      })
      blur.$on('gettypeData',data=>{
        // console.log(data)
        this.showback=true;
        let citytypedata=data;
        this.echartsData.BIGCAR=citytypedata.data.BIGCAR;
        this.echartsData.SMALLCAR=citytypedata.data.SMALLCAR;
        // this.options.series[0].data[0].value=citytypedata.data.BIGCAR;
        // this.options.series[0].data[1].value=citytypedata.data.BIGCAR;
        console.log(this.options.series[0].data[1].value)
      })
      blur.$on('getcitycardata',data=>{
        // console.log(data)
        let citycardatas=data;
        this.showback=true;
        // console.log(citycatdatas)
        this.provinceData.addIn=citycardatas.data.addIn;
        this.provinceData.incount=citycardatas.data.incount;
        this.provinceData.outcount=citycardatas.data.outcount;
        this.provinceData.city=citycardatas.data.city;
      })
    },
    // 如果选择左侧的城市，显示对应城市的车辆类型分析

    //  点击进入和流出 触发 change事
    change(i){  
      this.isActive = i;
      // console.log(this.changeActive)
      // if(this.isActive==2 && ){

      // }
      let that = this;
      // that. gettypedatashi()
      // console.log(i)
      // 车辆流动页面车辆类型分析  默认显示实时的数据   GET_VEH_TYPE_API
     interf.GET_VEH_TYPE_API({
        id:"",
        stime:'1',
        fxlx:i
      })
      .then(response=>{
       if (response && response.status == 200){
           var data = response.data;
           console.log(data)
           if (data.errcode == 0) {
            //  var obj=data.data
             that.echartsData.BIGCAR=data.data.BIGCAR;
             that.echartsData.SMALLCAR=data.data.SMALLCAR;
            //  this.options.series[0].data[0].value=that.echartsData.BIGCAR;
            //  this.options.series[0].data[1].value=that.echartsData.SMALLCAR
            //  console.log( that.echartsData.BIGCAR,that.echartsData.SMALLCAR)
            //  console.log(this.options.series[0].data[1].value)
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
    initaccurCreateChange(){
      // if(!this.changechart){
        this.changechart = echarts.init(document.getElementById('accurCreateChange'));
      // };
      this.changechart.setOption(this.options);
    },
    // 
    getprovinceData(){
      let that = this;
          //车辆流动页面全省车辆统计  默认显示实时的数据   GET_VEH_PRO_API
    interf.GET_VEH_PRO_API({
      id:"",
      stime:'1'
    })
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
    getIndexDatas(){
      let that=this;
    // 车辆流动页面车辆类型分析  默认显示实时的数据 如果客户没有点击进入或者流出，默认显示进入的数据  GET_VEH_TYPE_API
    interf.GET_VEH_TYPE_API({
        id:"",
        stime:'1',
        fxlx:1
      })
      .then(response=>{
       if (response && response.status == 200){
           var data = response.data;
          //  console.log(data)
           if (data.errcode == 0) {
             that.echartsData.BIGCAR=data.data.BIGCAR;
             that.echartsData.SMALLCAR=data.data.SMALLCAR;
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


    // 车辆流动页面流动趋势   GET_FLOW_TREND_API
      interf.GET_FLOW_TREND_API({
        id:"",
        stime:'1'
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
  
    
    },
    //获取巡航数据
    getTrafficData() {
      let that = this;
    },
    setSelectItems(name,id){
      this.selectItem.road=name;
    },
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
    initAccurCharts(){
      if(!this.accurChart){
        this.accurChart = echarts.init(document.getElementById('accurCreateChange'));
      };
      this.accurChart.setOption(this.accurChangeOption);
    }
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
    right: 2vw;
    width: 17vw;
    height: 80vh;
    top: 9vh;
}
.car-info_container {
  width: 100%;
  height: 100%;
  .car-info_title{
    position: relative;
    width: 96%;
    font-family: Microsoft YaHei;
    font-size: 1vw;
    color: $color-white;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 2px 2% 0.6rem 2%;
    font-weight: bolder;
  }
  .car-info_tab{
    width: 96%;
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
  right:1vw;
  top: 0;
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
  right: 1vw;
}
// .active {
//   color: red;
// }
.active{
  background-color:#0079fe;
  color: #efddfe;
  
}
</style>