<template>
  <div class="distribution-statics">
    <div class="distribution-statics_container">
      <div class="distribution-statics_title">
         <m-title :label='title' style='width:100%;'></m-title>
         <div v-show='isShowReturn' class='return' @click='returnAll'><<返回全省</div>
      </div>
      <div class="distribution-statics--tab boxstyle">
        <!--</div> +"(其中重大事故:"+staticsData.esplish+")"-->
        <m-tab label='事故总数' :value='staticsData.ACCIDENTNUM' :right_value='"(其中重大事故:"+staticsData.MAJORACCIDENTNUM+")"' icon='icon-weifaguanli' icon_style='color:#FFFFFF' style="width:94%;margin:0 auto;"></m-tab>
        
        <div class='item_content'>
            <div class='item'>
            受伤
            <br/><span><span class="statics_value">{{staticsData.INJURYNUM}}</span>人</span>
          </div>
          <div class='item'>
            死亡
            <br/><span><span class="statics_value">{{staticsData.DEATHNUM}}</span>人</span>
          </div>
        </div>
      </div>
      <div class="distribution-statics_sort boxstyle">
          <m-com-title label='事故类型' style='width:6vw;'></m-com-title>
          <div class="distribution-statics_sort--div">
            <el-row v-for="(item,index) in sg_sort_data" :key="index" class="row_cls">
              <el-col :span="12" class="row_col_cls">{{item.NAME}}</el-col>
              <el-col :span="6" class="row_col_cls">{{item.NUM}}起</el-col>
              <el-col :span="6">{{item.radio}}</el-col>
            </el-row>
          </div>
        </div>
        <div class='distribution-statics_count boxstyle'>
          <m-com-title label='事故发生数量变化' style="width:9vw;"></m-com-title>
          <m-line-chart :chart_data="chart_data" c_id='sumCountChange' style='width:100%;height:25vh'></m-line-chart>
        </div>
        <div class='distribution-statics_main boxstyle'>
          <m-com-title label='重大事故发生趋势' style="width:9vw;"></m-com-title>
          <bar-chart c_id='accurCreateChange' :chart_data="bar_chart_data" style='width:100%;height:18vh'></bar-chart>
        </div>
    </div>
  </div>
</template>

<script>
import blur from "@/blur";
import { IMG } from "./config";
import { interf } from "./config";
import echarts from 'echarts';
import mTitle from "@/components/UI_el/title.vue";
import mComTitle from "@/components/UI_el/title_com.vue";
import mLineChart from "@/components/UI_el/double_line_chart.vue";
import m_tab from '@/components/UI_el/tab.vue'
import barChart from "@/components/UI_el/bar_chart.vue";
export default {
  name: "TIndex",
  data() {
    return {
      map: {},
      title:'全省统计',
      isShowReturn:false,
      staticsData: {"ACCIDENTNUM":"","MAJORACCIDENTNUM":"","INJURYNUM":"","DEATHNUM":""},
      sg_sort_data: [
        { NAME: "机动车与机动车", NUM: "12", radio: "32%" }
      ],
      chart_data:{
        legend: ["事故量", "同比上月(%)"], 
          xdata:[],
          y1data: [],
          y2data:[]
      },
      bar_chart_data:{
        legend: ["数量", "城市"],
        xdata:[],
        ydata:[]
      },
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
      tableLoading:false
    }
  },
  components: { mTitle,mComTitle,mLineChart,mTab:m_tab,barChart},
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(6);
    this.getAllStatics();
    this.initSumCharts();
    this.initAccurCharts();
    this.initSgTypes();
  },
  destroyed() {
    this.flyRoutes = [];
    this.map.stop();
    let that = this;
    that.map.setPitch(0); //设置地图的俯仰角
  },
  methods: {
    /**
     * 左侧选择区域，右侧联动
     * type：
     */
    initDistributionStatics(type,data,flag){
       this.isShowReturn=true;
        this.title=data.name;
        this.getAllStatics(type,data);
        this.initSumCharts(type,data);
        this.initAccurCharts(type,data);
        this.initSgTypes(type,data);
    },
    //获取统计数据
    getAllStatics(type,data) {
      let that = this;
      let params={stime:1};
      if(type!=undefined && data){
        if(data.time && data.time!=''){
          params.stime=data.time[0];
          params.etime=data.time[1];
        };
        if(type){
          params.areaid=data.value;
        }else{
          params.xzqh=data.value.length>4?data.value.substring(0,4):data.value;
        }
      }
      interf.GET_ALL_STA_API(params).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
               that.staticsData=data.data;
              //  that.staticsData.sum=data.data.ACCIDENTNUM?data.data.ACCIDENTNUM:'';
              //  that.staticsData.esplish=data.data.MAJORACCIDENTNUM?data.data.MAJORACCIDENTNUM:'';
              //  that.staticsData.injury=data.data.INJURYNUM?data.data.INJURYNUM:'';
              //  that.staticsData.died=data.data.DEATHNUM?data.data.DEATHNUM:'';
            } else{
              that.$message({
                message: data.message,
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
     * 获取事故类型数据
     */
    initSgTypes(type,data) {
      let that = this;
      let params={stime:1};
      if(type!=undefined && data){
        if(data.time && data.time!=''){
          params.stime=data.time[0];
          params.etime=data.time[1];
        };
        if(type){
          params.areaid=data.value;
        }else{
          params.xzqh=data.value.length>4?data.value.substring(0,4):data.value;
        }
      }
      interf.GET_ACCIDENT_TYPE_API(params).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
              that.sg_sort_data=data.data;  
            } else{
              that.$message({
                message: data.message,
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
     * 生成事故发生数量变化echarts
     */
    initSumCharts(type,data){
      let that = this;
       that.chart_data={
        legend: ["事故量", "同比上月(%)"], 
          xdata:[],
          y1data: [],
          y2data:[]
      }
      let params={};
      if(type!=undefined && data){
        if(type){
          params.areaid=data.value;
        }else{
          params.xzqh=data.value.length>4?data.value.substring(0,4):data.value;
        }
      };
      interf.GET_ACCIDENT_CHANGE_API(params).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
              let _data=that.chart_data;
              if(data.data && data.data.length>0){
                data.data.forEach(e=>{
                  _data.xdata.push(e.rq);
                  _data.y1data.push(e.num);
                  _data.y2data.push(e.ratio.split('%')[0]);
                })
                that.chart_data=_data;
              }
            } else{
              that.$message({
                message: data.message,
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
     * 生成重大事故发生趋势echarts
     */
    initAccurCharts(type,data){
      let _this = this;
      _this.bar_chart_data={
                  legend: ["数量", "城市"],
                  xdata:[],
                  ydata:[]
                }
     let params={};
      if(type!=undefined && data){
        if(type){
          params.areaid=data.value;
        }else{
          params.xzqh=data.value.length>4?data.value.substring(0,4):data.value;
        }
      }
      interf.GET_ACCIDENT_TREND_API(params).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
              let car_data=_this.bar_chart_data;
              if(data.data && data.data.length>0){
                data.data.forEach(e=>{
                  car_data.xdata.push(e.RQ);
                  car_data.ydata.push(e.NUM);
                });
                _this.bar_chart_data=car_data;
                // blur.$emit('addCityMainAcci',data.data);
              }
            } else{
              _this.$message({
                message: data.message,
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
     * 返回全省
     */
    returnAll(){
      this.isShowReturn=false;
      this.title='全省统计';
      this.getAllStatics();
      this.initSumCharts();
      this.initAccurCharts();
      this.initSgTypes();
      blur.$emit('setCurrentRow',null);
      blur.$emit('cancelCityLayerStatus');
    },
  }
};
</script>
<style scope lang='scss'>
@import "@/assets/css/color.scss";
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.distribution-statics {
  position: fixed;
  z-index: 10;
  right: 14px;
  width: 474px;
  height: 977px;
  top: 90px;
  color: white;
}
.distribution-statics_container {
  width: 100%;
  height: 100%;
  .distribution-statics_title {
    position: relative;
    width: 100%;
    // height:45px;
    font-family: Microsoft YaHei;
    background-color: $color-bg-1;
    // border:1px solid;
    // border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
    color: $color-white;
    margin:0 auto 1vh auto;
    .return{
      position: absolute;
      left: 5%;
      cursor: pointer;
      top: 10px;
      font-size: 14px;
      color:$color-primary;
    }
    .return:hover{
      color:$color-primary;
    }
  }
  .distribution-statics--tab {
    width: 100%;
    height: 130px;
    padding-top:8px;
    .item_content{
      width:100%;
      margin: 15px 0;
      @include flex(row, center);
      .item{
        @include flex(column, center,center);
        width:50%;
        font-size:16px;
        .statics_value{
          font-size:24px;
        }
      }
    }
    
    // > div {
    //   width: 100%;
    //   height: 5vh;
    //   font-size: 0.8vw;
    //   @include flex(row, center);

    //   .--tab-title {
    //     font-size: 0.9vw;
    //     width: 40%;
    //     @include flex(row, center);
    //   }
    //   .statics--tab--value {
    //     width: 60%;
    //     @include flex(row, center);
    //     .statics_value {
    //       color: $color-active;
    //     }
    //     .statics_value.sum {
    //       font-size: 1.4vw;
    //     }
    //   }
    //   .--tab-title {
    //     .el-icon-bell:before {
    //       font-size: 1.5vw;
    //       color: #e70101;
    //       font-weight: 600;
    //     }
    //   }
    // }
  }
  .distribution-statics_sort {
    width: 96%;
    height:211px;
    padding:0 10px;
    margin-top:13px;
    &--div {
      width: 85%;
      height: auto;
      margin: 2vh auto;
      // border-top: 1px solid $color-border-4;
      // border-left: 1px solid $color-border-4;
      // border-right: 1px solid $color-border-4;
      // background-color: $color-bg-2;
      .row_cls{
        text-align:center;
        line-height: 3vh;
        margin:5px 0;
        // border-bottom: 1px solid $color-border-4;
        .row_col_cls{
          // border-right: 1px solid $color-border-4;
        }
      }
      .row_cls:nth-child(odd){
        background-color: $color-bg-2;
      }
      
    }
  }
  .distribution-statics_count{
    width: 96%;
    padding:0 10px;
    height:285px;
    margin-top:13px;
    #sumCountChange{
      width:100%;
      height:25vh;
    }
  }
  .distribution-statics_main{
    width: 96%;
    height:252px;
    padding:0 10px;
    margin-top:13px;
    #accurCreateChange{
      width:100%;
      height:25vh;
    }
  }
    
    
  }

</style>