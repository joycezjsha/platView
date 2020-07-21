<template>
  <div class="accident-statics">
    <div class="accident-statics_container">
      <div class="accident-statics_title boxstyle">
        <m-title :label='title' style='width:100%;'></m-title>
         <div v-show='isShowReturn' class='return' @click='returnAll'><<返回全省</div>
      </div>
      <div class="accident-statics--tab boxstyle">
        <m-com-title label='警情统计' style='width:6vw;margin-bottom:1vh;'></m-com-title>
        <m-tab :isShowIcon='isShowIcon' label='警情总计' :value='staticsData.NUM' style='width:90%;margin:0 auto;'></m-tab>
        <!-- <m-tab :isShowIcon='isShowIcon' label='重大警情' :value='staticsData.mainCount' style='width:90%;margin:10px auto 5px auto;'></m-tab> -->
        <div class="accident-statics_sort">
          
          <div id="accident-statics_sort">
            
          </div>
          <div>
            <m-list-o :list='listItems'></m-list-o>
          </div>
        </div>
      </div>
      <div class="accident-statics--tab boxstyle">
        <m-com-title label='近30天警情发生趋势' style='width:12vw;'></m-com-title>
        <bar-chart c_id='accidentsumCountChange' :chart_data="chart_data" style='width:100%;height:20vh' chart_type='line'></bar-chart>
      </div>
      <div class="accident-statics--tab boxstyle">
        <m-com-title label='重大警情发生趋势' style='width:10vw;'></m-com-title>
        <bar-chart c_id='accidentaccurCreateChange' :chart_data="bar_chart_data" style='width:100%;height:20vh'></bar-chart>
      </div>
    </div>
  </div>
</template>

<script>
import blur from "@/blur";
import { IMG } from "./config";
import { interf } from "./config";
import echarts from 'echarts'
import mTitle from "@/components/UI_el/title.vue";
import mComTitle from "@/components/UI_el/title_com.vue";
import barChart from "@/components/UI_el/bar_chart.vue";
import mTab from '@/components/UI_el/tab.vue'
import m_list from '@/components/UI_el/list.vue'
export default {
  name: "TIndex",
  data() {
    return {
      map: {},
      isShowIcon:false,
      isShowReturn:false,
      title:'全省统计',
      staticsData: {sum: 10,mainCount:0},
      listItems:[],
      accident_option: {
        color:['#02FDF4','#4D76F9','#01D647'],
          tooltip: {
            show:true,
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          // legend:{
          //   data:[],
          //   orient: 'vertical',
          //   right: 10},
          series: [
              {
                  name: '警情统计',
                  type: 'pie',
                  // center:['30%','50%'],
                  radius: ['60%', '75%'],
                  avoidLabelOverlap: false,
                  label: {
                      show: false,
                      position: 'center'
                  },
                  
                  labelLine: {
                      show: false
                  },
                  data: [
                     
                  ]
              }
          ]
      },
      accident_chart:null,
      chart_data:{
        legend: ["全部警情", "日期"],
        xdata:[],
        ydata:[]
      },
      bar_chart_data:{
        legend: ["重大警情", "日期"],
        xdata:[],
        ydata:[]
      }
    }
  },
  components:{barChart,mTitle,mComTitle,mTab,mListO:m_list},
  mounted() {
    let _this=this;
    this.map = this.$store.state.map;
    this.getAllStatics();
    this.initAccidentStaticsChart();
    this.initAcciAccurCharts();
    this.initAccurCharts();
    blur.$on('initAccidentStatics',function(type,value,flag){
      _this.initAccidentStatics(type,value,flag);
    });
    blur.$on('initAccidentMapdata',function(data){
      _this.initAccidentMap(data);
    });
  },
  destroyed() {
    this.flyRoutes = [];
    this.map.stop();
    let that = this;
    that.map.setPitch(0); //设置地图的俯仰角
  },
  methods: {
    initAccidentStatics(type,data,flag){
      this.isShowReturn=true;
      this.title=data.name;
      this.getAllStatics(type,data);
      this.initAccidentStaticsChart(type,data);
      this.initAcciAccurCharts(type,data);
      this.initAccurCharts(type,data);
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
          params.xzqh=data.value;
        }
      }
      interf.GET_ALL_ACCI_STA_API(params).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
               that.staticsData=data.data;
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
     * 生成警情分别类统计echarts
     */
    initAccidentStaticsChart(type,data){
      let that = this;
      this.accident_option.series[0].data=[];
      that.listItems=[];
      let params={stime:1};
      if(type!=undefined && data){
        if(data.time && data.time!=''){
          params.stime=data.time[0];
          params.etime=data.time[1];
        };
        if(type){
          params.areaid=data.value;
        }else{
          params.xzqh=data.value;
        }
      }
      interf.GET_ACCI_SORT_API(params).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
              let _data=[];
              if(data.data && data.data.length>0){
                let colors=['#00B5B7','#0572ED','#4F35D0']
                data.data.map((e,i)=>{
                  _data.push({name:e.NAME,value:e.NUM});
                  i=i%3;
                  that.listItems.push({color:colors[i],label:e.NAME,value:e.NUM});
                  // this.accident_option.legend.data.push(e.NAME);             
                })
              };
               if(!this.accident_chart){
                  this.accident_chart = echarts.init(document.getElementById('accident-statics_sort'));
                };
                this.accident_option.series[0].data=_data;
                this.accident_chart.setOption(this.accident_option);
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
     * 生成警情发生趋势echarts
     */
    initAcciAccurCharts(type,data){
      let that = this;
      that.chart_data={
                  legend: ["全部警情", "日期"],
                  xdata:[],
                  ydata:[]
                }
      this.accident_option.series[0].data=[];
      let params={};
      if(type!=undefined && data){
        if(type){
          params.areaid=data.value;
        }else{
          params.xzqh=data.value;
        }
      };
      interf.GET_ACCI_ACCUR_API(params).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
              let car_data=that.chart_data;
              if(data.data && data.data.length>0){
                data.data.forEach(e=>{
                  car_data.xdata.push(e.DATE);
                  car_data.ydata.push(e.NUM);
                });
                that.chart_data=car_data;
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
      let that = this;
      that.bar_chart_data={
                  legend: ["重大警情", "日期"],
                  xdata:[],
                  ydata:[]
                }
      this.accident_option.series[0].data=[];
      let params={};
      if(type!=undefined && data){
        if(type){
          params.areaid=data.value;
        }else{
          params.xzqh=data.value;
        }
      };
      interf.GET_MAIN_ACCI_ACCUR_API(params).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
              let car_data=that.bar_chart_data;
              if(data.data && data.data.length>0){
                data.data.forEach(e=>{
                  car_data.xdata.push(e.DATE);
                  car_data.ydata.push(e.NUM);
                });
                that.bar_chart_data=car_data;
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
     * 返回全省
     */
    returnAll(){
      this.isShowReturn=false;
      this.title='全省统计';
      this.getAllStatics();
      this.initAccidentStaticsChart();
      this.initAcciAccurCharts();
      this.initAccurCharts();
      blur.$emit('setCurrentCityRow',null);
      blur.$emit('clearRoadAndMaker');
    },
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
.accident-statics {
  position: fixed;
  z-index: 10;
  right: 13px;
  width: 474px;
  height: 977px;
  top: 9vh;
  color: white;
}
.accident-statics_container {
  width: 100%;
  height: 100%;
  // background-color: $color-bg-1;
  // border: 1px solid $color-border-1;
  .accident-statics_title {
    position: relative;
    width: 100%;
    font-size: 1vw;
    color: $color-white;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    .return{
      font-size: 16px;
      position: absolute;
      left: 5%;
      cursor: pointer;
      color:$color-primary;
    }
    .return:hover{
      color:$color-primary;
    }
  }
  .accident-statics--tab {
    width: 100%;
    height: 28vh;
    .accident-statics_sort {
      width:90%;
      height:13vh;
      margin:2vh auto;
      @include flex(row, center,center);
      >div{
        @include flex(row, center,center);
        width:50%;
        height: 100%;
      }
      >div:nth-child(2){
        width: 50%;
      }
    }
    
  }
  .accident-statics--tab:nth-child(2){
    margin-top:38px;
  }
  .accident-statics--tab:nth-child(3){
    margin-top:21px;
  }
  .accident-statics_content {
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

</style>