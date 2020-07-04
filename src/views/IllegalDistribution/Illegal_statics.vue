<template>
  <div class="accident-statics">
    <div class="accident-statics_container ">
      <div class=" top borstyle">
        <div class="title" v-if="showback==true" >全省统计</div>
          <div class="back" v-else @click="goback()" >&lt;&lt; 返回全省
            <span> {{city}}</span>
          </div>
      </div>
      <!-- 点击中间的三个按钮，切换对应的template accident-statics_title   -->
      <div class="right-top-speed" v-show="isShow=='1'">
        <div class="borstyle " style="padding:0.5vh 0.5vw;">
          <m-tab style="margin:5px"  icon='icon-weifaguanli' icon_style="font-size:15px" label='全部违法数量总计' :value="staticsData.sum"></m-tab>
          <div style="padding:0.3vh 5vw;display:flex;height:9vh">
            <div  class="left">
              <div>超速行驶</div>
              <div style="padding-bottom:0.5vh">{{staticsData.over}}</div>
            </div>
            <div class="right">
              <div>尾号限行</div>
              <div  style="padding-bottom:0.5vh">{{staticsData.lastNumberLimit}}</div>
            </div>
          </div>
        </div>
        <div class="accident-statics_content Top5 borstyle">
          <m-title label='违法类别Top5' style='width:7vw;margin-left:1vw'></m-title>
          <!-- <div class="accident-statics_sort-list">
            <m-list-o :list='listItems'></m-list-o>
          </div> -->
          <div id="accident-statics_sort"></div>
        </div>
      </div>
      <!--第二个按钮，切换对应的div style="paddin:1vh 1vw" style="paddin:1vh 1vw" -->
        <div v-show="isShow=='2'">
          <div class="speed borstyle">
            <m-tab label='超速违法数量总计' icon='icon-chaosu' icon_style="font-size:15px" :value=speed.NUM></m-tab>
          </div>
          <div class="speedecharts borstyle" >
            <m-title  label='超速违法分类' style='width:8vw'></m-title>
            <div>
              <div style="width:360px;height:180px;" id="speeding-offences"></div>
            </div>
          </div>
        </div>
      <!-- 第三个按钮，切换对应的div -->
         <div v-show="isShow=='3'">
            <div class="speed borstyle" >
              <m-tab  label='违法限行数量总计' icon_style="font-size:15px" icon='icon-xianhangmian'  :value=illegal.NUM></m-tab>
            </div>
            <div class="speedecharts borstyle">
              <!-- <div> -->
                <m-title label='限行日期分布' style='width:9vw'></m-title>
              <!-- </div> -->
              <!-- <div style="padding-left:1vw"> -->
                <div style="width:360px;height:180px;" id="current-date"></div>
              <!-- </div> -->
            </div>
         </div>
         
      <!-- 高发道路排名 -->
      <div class='accident-statics_table borstyle'>
          <div class="">
            <m-title label='高发道路排名' style='width:9vw;'></m-title>
          </div>
           <div style="position:absolute;left:14vw;top:1vh">
              <select v-model="selected" @change="isSelected($event)"
              style="background:#000916;color:rgba(255,255,255,1);padding-bottom:3px;font-size:14px;border-radius:4px; line-height:14px" id="sortdata" >
                <option :value="item.DLLX" v-for="item in roadClassification" :key="item.id">{{item.NAME}}</option>
              </select>
              <!-- <span>{{selected}}</span> -->
            </div>
          <div style="padding:0 1vw;margin-top:1vh;height:30vh;">
            <el-table :data="indexDatas" style="width: 100%" height="100%" :default-sort = "{prop: 'NUM', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
              <el-table-column type="index" label="No." width="50"></el-table-column>
              <el-table-column prop="NAME" label="道路名称" width="180%"></el-table-column>
              <el-table-column prop="NUM" label="违法数量" sortable ></el-table-column>
            </el-table>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import echarts from 'echarts';
import mTab from '@/components/UI_el/tab.vue'
import blur from '../../blur.js';
import mTitle from '@/components/UI_el/title_com.vue';
import mLineChart from "@/components/UI_el/double_line_chart.vue";
import m_list from '@/components/UI_el/list.vue'
export default {
  name: "TIndex",
  data() {
    return {
      selected:'10',  //选中道路类型
      stime:'1',
      city:'',
      xzqh:'',
      isShowIcon:false,
      icon:'iconfont icon-weifaguanli',
      timeRange:{ //自定义时间
        time1:'',
        time2:''
      },
      listItems:[],
      dllx:'', //道路类型
      countnum1:'',
      roadClassification:[
        // {
        //   DLLX:'', //道路类型
        //   NAME:'' //道路类型名称
        // }
      ],  //道路分类
      // roadClassification:{  
      //   DLLX:'', //道路类型
      //   NAME:'' //道路类型名称
      // },
      showback:true, //是否显示返回按钮
      map: {},
      speed:{
        NUM:''
      },
      illegal:{
        NUM:''
      },
      isShow:'1',  //默认显示全部违法 2--超速  3--限行
      staticsData: {
        sum:'',
        over:'',
        lastNumberLimit:''
      },
      accident_option: {
        color:['#ff792a','#00f5f8','#fd0000','#fdbd44','#008ff6'],
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
                orient: 'vertical',
                right: 30,
                top:20,
                data: [],
                textStyle:{color:'white'},
                formatter: function(name){
            　　　return name.length>5?name.substr(0,5)+"...":name;
            　　}
            },
            series: [
                {
                    name: '违法类别',
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
      accident_chart:null,
      sg_sort_data: [
        // { name: "机动车与机动车", value: "12", radio: "32%" },
        // { name: "机动车与非机动车", value: "122", radio: "32%" },
        // { name: "行人", value: "2", radio: "32%" }
      ],
      indexDatas: [
        {"NAME":"","index":"","NUM":""}
      ],
      current_chart:null,
      current_option:{
        grid: {
            left: '6%',
            top: 20, // 默认60
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        color: ['#00b4f3'],
         tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          splitLine:{
            show:false
          },
            type: 'value',
            boundaryGap: [0, 0.01],
            axisTick: {
              show: false,  //是否显示网状线 默认为true
              alignWithLabel: true
           },
           axisLine:{
             show:false
           },
            axisLabel:{
              show:false,  
          },
        },
        yAxis: { 
          axisLine:{
            show:false
          },
          axisTick:{       //y轴刻度线
            show:false
          },
          splitLine:{
            show:false
          },
          axisLabel : {
           formatter: '{value}',
            textStyle: { //改变刻度字体样式
              color: '#fff'
            }
          },
          type: 'category',
          data:[]
          // data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']   //y轴数据
        },
        series: [
          {
            name: '限行日期分布',
            barWidth : 10,//柱图宽度
            type: 'bar',
            data:[],
            // data: [18203, 23489, 29034, 104970, 131744, 630230]
          }
        ]
      },
      speeding_chart:null,
      speeding_option:{
        // title: {
        //   // text: '世界人口总量',
        //   // subtext: '数据来自网络'
        // },
        color: ['#da0000'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
            }
        },
        // legend: {
        // data: ['2011年', '2012年']
        // },
        grid: {
            left: '6%',
            top: 20, // 默认60
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
          splitLine:{
            show:false
          },
            type: 'value',
            boundaryGap: [0, 0.01],
            axisTick: {
              show: false,  //是否显示网状线 默认为true
              alignWithLabel: true
           },
           axisLine:{
             show:false
           },
            axisLabel:{
              show:false,  
          },
        },
        yAxis: {
          axisLine:{
            show:false
          },
          axisTick:{       //y轴刻度线
            show:false
          },
          splitLine:{
            show:false
          },
          axisLabel : {
           formatter: '{value}',
            textStyle: { //改变刻度字体样式
              color: '#fff'
            }
          },
          type: 'category',
          data:[]
          // data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']   //y轴数据
        },
        series: [
          {
            name: '超速违法分类',
            barWidth : 10,//柱图宽度
            type: 'bar',
            data:[]
            // data: [18203, 23489, 29034, 104970, 131744, 630230]
          }
        ]
      }
    }
  },
  components: { mTitle,mLineChart,mTab,mListO:m_list },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(8);
    // this.getIndexData();
    this.getData()
    this.getAllProvinceIllegalStatisticsDatas(that.stime);
    this.initAccidentStaticsChart(that.stime);
    this.getRoadCategoryDatas()
    this.getSpeedingViolationDatas(that.stime)
    this.getIllegalAnalyDatas(that.stime);
    this.getlastTrafficRestrictionDatas(that.stime);
    // this.getEcharts()
    this.getIllegalAnalysisDatas(that.time)
    this.getTrafficRestrictionDates(that.stime)
  },
  destroyed() {
    this.flyRoutes = [];
    this.map.stop();
    let that = this;
    that.map.setPitch(0); //设置地图的俯仰角
  },
  methods: {
    /**
    * 点击返回按钮
    */
   goback(){
      let that=this;
      that.stime='1';
      that.xzqh='';
      that.selected='';
      that.showback=true;
      that.dllx='';
      that.getAllProvinceIllegalStatisticsDatas(that.stime);
      that.initAccidentStaticsChart(that.stime);
      that.getSpeedingViolationDatas(that.stime)
      that.getlastTrafficRestrictionDatas(that.stime);
      that.getIllegalAnalysisDatas(that.stime)
      that.getIllegalAnalyDatas(that.stime)
      that.getTrafficRestrictionDates(that.stime)
      that.getRoadCategoryDatas()
   },
    /**
     * blur.$emit('getIndex',this.tableIndex)
     * getstime--传入对应的时间  
     * sendTime--时间对象 {time1: "2020-06-15 00:00:00", time2: "2020-06-17 23:59:59"}
     */
    getData(){
      let that=this;
      blur.$on('gettype',data=>{
        that.type=data;
        that.getIllegalAnalysisDatas(that.time)
      })
      blur.$on('getcity',data=>{
        that.city=data;
        that.showback=false;
      })
      blur.$on("sendTime",data=>{
        that.timeRange.time1=data.time1;
        that.timeRange.time2=data.time2;
        that.stime=='4'
        that.getAllProvinceIllegalStatisticsDatas(that.stime)
        that.initAccidentStaticsChart(that.stime);
        that.getSpeedingViolationDatas(that.stime)
        that.getlastTrafficRestrictionDatas(that.stime);
        that.getIllegalAnalysisDatas(that.stime)
        that.getIllegalAnalyDatas(that.stime)
        that.getTrafficRestrictionDates(that.stime)
        
      })

      blur.$on('getstime',data=>{
        that.stime=data;
        if(that.stime!='4'){
          that.getAllProvinceIllegalStatisticsDatas(that.stime);
          that.initAccidentStaticsChart(that.stime);
          that.getSpeedingViolationDatas(that.stime)
          that.getlastTrafficRestrictionDatas(that.stime);
          that.getIllegalAnalysisDatas(that.stime)
          that.getIllegalAnalyDatas(that.stime)
          that.getTrafficRestrictionDates(that.stime)
          
        }
      })
      blur.$on('getIndex',data=>{
        that.isShow=data;
        // if(that.isShow==2){
        //   // that.getSpeedingViolationDatas(that.stime)
        // }
        // if(that.isShow==3){
        //   // that.getlastTrafficRestrictionDatas()
        // }
      })
      blur.$on('getxzqh',data=>{
        that.xzqh=data;
         
        if(that.isShow==1 ){
          that.getAllProvinceIllegalStatisticsDatas(that.stime,that.xzqh);
          that.initAccidentStaticsChart(that.stime,that.xzqh);
          that.getIllegalAnalysisDatas(that.stime)
        }
        if(that.isShow==2){
          that.getSpeedingViolationDatas(that.stime,that.xzqh);
          that.getIllegalAnalysisDatas(that.stime)
          that.getIllegalAnalyDatas(that.stime)   //报错
        }
        if(that.isShow==3){
          that.getlastTrafficRestrictionDatas(that.stime,that.xzqh);
          that.getIllegalAnalysisDatas(that.stime)
          that.getTrafficRestrictionDates(that.stime)
        }
        
      })
    },
    /**
     * 切换道路类型
     */
    isSelected(event){
      // console.log(event.target.value)  //12 序号
      let that = this; 
      that.dllx=event.target.value;
      that.getIllegalAnalysisDatas(that.time)

    },
    /**
    *  限行日期分布 IllegalAnalysis/getTrafficRestrictionDate  GET_TRAFFIC_REST_API
    */
   getTrafficRestrictionDates(type){
     let that = this;
      let param={};
      if(that.xzqh!=''){
        param.xzqh=that.xzqh;
      }
      //如果传入的时间type！='4'
      if(type!='4'){
        param.stime=type;
      }
      if(type=='4' ){
        param.stime=that.timeRange.time1;
        param.etime=that.timeRange.time2;
      }
      interf.GET_TRAFFIC_REST_API(param)
     .then(response=>{
        if(response && response.status==200){
          var data = response.data;
          if(data.errcode == 0){
             if(!that.current_chart){
              that.current_chart = echarts.init(document.getElementById('current-date'));
            };
            that.current_option.yAxis.data=[];
            that.current_option.series[0].data=[];
            data.data.forEach(e=>{
              that.current_option.yAxis.data.push(e.WEEK)
              that.current_option.series[0].data.push(e.NUM)
            })
            that.current_chart.setOption(that.current_option);
            window.addEventListener("resize",()=>{
              that.current_chart.resize();
              })
          }else{
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
    /*
    * 超速违法分类  IllegalAnalysis/getIllegalAnalysis  GET_IllE_GAL_ANALY_SORT_API
    *  返回时 报错
    */
    getIllegalAnalyDatas(type){
      let that = this;
      let param={};
      if(that.xzqh!=''){
        param.xzqh=that.xzqh;
      }
      //如果传入的时间type！='4'
      if(type!='4'){
        param.stime=that.stime;
      }
      if(type=='4' ){
        param.stime=that.timeRange.time1;
        param.etime=that.timeRange.time2;
      }
      interf.GET_IllE_GAL_ANALY_SORT_API(param)
     .then(response=>{
        if(response && response.status==200){
          var data = response.data;
          if(data.errcode == 0){
             if(!that.speeding_chart){
              that.speeding_chart = echarts.init(document.getElementById('speeding-offences'));
            };
             that.speeding_option.yAxis.data=[];
             that.speeding_option.series[0].data=[];
             data.data.forEach(e=>{
               if(e.WFXW=='1'){
                e.WFXW="   "+' 其他'
              }
              if(e.WFXW=='17211'){
                e.WFXW='超速50%以上'
              }
              if(e.WFXW=='16361'){
                e.WFXW='超速20-50%'
              }
              if(e.WFXW=='13521'){
                e.WFXW="   "+' 超速10%'
              }
              that.speeding_option.yAxis.data.push(e.WFXW)
              that.speeding_option.series[0].data.push(e.NUM)
            })
            // that.speeding_chart.clear();
            
            that.speeding_chart.setOption(that.speeding_option,true);
            window.addEventListener("resize",()=>{
              that.speeding_chart.resize();
              })
          }else{
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
    /**
     * 尾号限行 IllegalAnalysis/getlastTrafficRestriction  GET_LAST_TRAFF_API
    */
   getlastTrafficRestrictionDatas(type,xzqh){
     let that = this;
      let param={};
      if(xzqh!=undefined){
        param.xzqh=xzqh;
      }
      //如果传入的时间type！='4'
      if(type!='4'){
        param.stime=type;
      }
      if(type=='4' ){
        param.stime=that.timeRange.time1;
        param.etime=that.timeRange.time2;
      }
      interf.GET_LAST_TRAFF_API(param)
     .then(response=>{
        if(response && response.status==200){
          var data = response.data;
          if(data.errcode == 0){
            that.illegal.NUM=data.data.NUM;
          }else{
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
    /**
    * 超速违法 IllegalAnalysis/getSpeedingViolation   GET_SPEED_VIOLA_API
    */
    getSpeedingViolationDatas(type,xzqh){
      let that = this;
      let param={};
      if(xzqh!=undefined){
        param.xzqh=xzqh;
      }
      //如果传入的时间type！='4'
      if(type!='4'){
        param.stime=type;
      }
      if(type=='4' ){
        param.stime=that.timeRange.time1;
        param.etime=that.timeRange.time2;
      }
      interf.GET_SPEED_VIOLA_API(param)
     .then(response=>{
        if(response && response.status==200){
          var data = response.data;
          if(data.errcode == 0){
            that.speed.NUM=data.data.NUM;
          }else{
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
    /**
    * 高发道路排名  IllegalAnalysis/getIllegalAnalysis   GET_ILL_ANALYSIS_API
    * stime   etime  xzqh   dllx     type 超速 (1) 限行(2)
    */
   getIllegalAnalysisDatas(time){
     let that = this;
      let param={};
      param.type=that.type;
      if(that.dllx!=''){
        param.dllx=that.dllx;
      }
      if(that.xzqh!=''){
        param.xzqh=that.xzqh;
      }
      if(time!='4'){
        param.stime=that.stime;
      }
      if(time=='4'){
        param.stime=that.timeRange.time1;
        param.etime=that.timeRange.time2;
      }
      interf.GET_ILL_ANALYSIS_API(param)
     .then(response=>{
        if(response && response.status==200){
          var data = response.data;
          if(data.errcode == 0){
            that.indexDatas=data.data;
          }else{
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
    /*
    * 道路分类 IllegalAnalysis/getRoadCategory  GET_ROAD_CATE_GORY_API
    */
    getRoadCategoryDatas(){
      let that = this;
      interf.GET_ROAD_CATE_GORY_API({})
     .then(response=>{
        if(response && response.status==200){
          var data = response.data;
          if(data.errcode == 0){
            that.roadClassification=data.data;
          }else{
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
    /**
     * 全省统计  IllegalAnalysis/getAllProvinceIllegalStatistics  GET_ILL_PRO_STATIS_API 
     * stime   etime    xzqh
     * type--时间类型 7天 (1)  30天(2)  3个月 (3)  自定义 2020-01-24 00:00:00  2020-06-25 23:59:59
    */
    getAllProvinceIllegalStatisticsDatas(type,xzqh){
      let that = this;
      let param={};
      if(xzqh!=undefined){
        param.xzqh=xzqh;
      }
      //如果传入的时间type！='4'
      if(type!='4'){
        param.stime=type;
      }
      if(type=='4' ){
        param.stime=that.timeRange.time1;
        param.etime=that.timeRange.time2;
      }
      interf.GET_ILL_PRO_STATIS_API(param)
     .then(response=>{
        if(response && response.status==200){
          var data = response.data;
          if(data.errcode == 0){
            that.staticsData.sum=data.data.COUNTNUM;
            that.staticsData.over=data.data.SNUM;
            that.staticsData.lastNumberLimit=data.data.TRNUM;
          }else{
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
    //获取统计数据
    getIndexData() {
      let that = this;
    },
    /**
     * 违法类别 TOP5-- IllegalAnalysis/getIllegalCategory GET_ILL_CATE_GORY_API
     * echarts stime  etime   xzqh
     */
    initAccidentStaticsChart(type,xzqh){
      let that = this;
       let param={};
      if(xzqh!=undefined){
        param.xzqh=xzqh;
      }
      //如果传入的时间type！='4'
      if(type!='4'){
        param.stime=type;
      }
      if(type=='4' ){
        param.stime=that.timeRange.time1;
        param.etime=that.timeRange.time2;
      }
      interf.GET_ILL_CATE_GORY_API(param)
     .then(response=>{
        if(response && response.status==200){
          var data = response.data;
          if(data.errcode == 0){
            if(!that.accident_chart){
              that.accident_chart = echarts.init(document.getElementById('accident-statics_sort'));
            };
            if(data.data && data.data.length>0){
                let colors=['#ff792a','#00f5f8','#fd0000','#fdbd44','#008ff6']
                data.data.map((e,i)=>{
                  if(e.CATEGORY && e.NUM){
                    that.accident_option.series[0].data.push({name:e.CATEGORY,value:e.NUM});
                    // that.listItems.push({color:colors[i],label:e.CATEGORY,value:e.NUM});
                    this.accident_option.legend.data.push(e.CATEGORY);         
                  }
                     
                })
              };
            // data.data.forEach(e=>{
            //   if(e.CATEGORY && e.NUM ){
            //     that.accident_option.legend.data.push(e.CATEGORY);
            //     that.accident_option.series[0].data.push({
            //       name:e.CATEGORY,value:e.NUM
            //     })
            //     //  let colors=['#ff792a','#00f5f8','#fd0000','#fdbd44','#008ff6'],
            //     //   // that.listItems.push({label:e.CATEGORY,value:e.NUM})
            //   }
            // })
            // that.accident_option.series[0].data=[
            //   {name:data.data[0].CATEGORY,value:data.data[0].NUM},
            //   {name:data.data[1].CATEGORY,value:data.data[1].NUM},
            //   {name:data.data[2].CATEGORY,value:data.data[2].NUM},
            //   {name:data.data[3].CATEGORY,value:data.data[3].NUM},
            //   {name:data.data[4].CATEGORY,value:data.data[4].NUM},
            //   {name:data.data[5].CATEGORY,value:data.data[5].NUM},
            //   ]
            that.accident_chart.setOption(that.accident_option);
            window.addEventListener("resize",()=>{
                that.accident_chart.resize();
              })
          }else{
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
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
   },
    /**
     * 获取高发道路排名
     */
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
.accident-statics {
  position: fixed;
  z-index: 10;
  right: 13px;
  width: 474px;
  top: 9vh;
  color: white;
}
.accident-statics_container {
  width: 100%;
  height: 100%;
  // .accident-statics_title {
  //   position: relative;
  //   width: 100%;
  //   height: 3vh;
  //   font-family: Microsoft YaHei;
  //   font-size: 1vw;
  //   color: $color-white;
  //   display: -webkit-box;
  //   display: -ms-flexbox;
  //   display: flex;
  //   -webkit-box-align: center;
  //   -ms-flex-align: center;
  //   align-items: center;
  //   font-weight: bolder;
  // }
  .accident-statics--tab {
  width: 100%;
  height:153px;
  margin-bottom: 19px;
  // background:rgba(2,6,31,0);
  border:1px solid;
  border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;

    > div {
      width: 100%;
      height: 5vh;
      font-size: 0.8vw;
      @include flex(row, center);

      .--tab-title {
        font-size: 0.9vw;
        width: 60%;
        @include flex(row, center);
      }
      .statics--tab--value {
        width: 40%;
        @include flex(row, center);
        .statics_value {
          color: $color-active;
        }
        .statics_value.sum {
          font-size: 1.4vw;
        }
      }
      .--tab-title {
        .el-icon-bell:before {
          font-size: 1.5vw;
          color: #e70101;
          font-weight: 600;
        }
      }
    }
}
  .accident-statics_content {
    width:474px;
    height:299px;
    background-color: $color-bg-1;
    margin-bottom: 10px;
    border:1px solid;
    border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
    #accident-statics_sort {
      width:100%;
      height:80%;
    }
    .accident-statics_sort-list{
      width:30%;
      height:80%;
      float: right;
      margin-top:3vh;
    }
    // #sumCountChange{
    //   width:100%;
    //   height:25vh;
    // }
    // #accurCreateChange{
    //   width:100%;
    //   height:25vh;
    // }
  }
}
.accident-statics .top{
  width: 100%;
  height:34px;
  background-color: $color-bg-1;
  border:1px solid;
  border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
  margin-bottom: 1vh;
  .back{
        height:34px;
        font-size:16px;
        padding-top: 5px;
        font-family:Source Han Sans CN;
        font-weight:400;
        color:rgba(0,198,255,1);
        padding-left: 17px;
        cursor:pointer;
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
        width: 100%;
        height:34px;
        font-size:18px;
        padding-top: 5px;
        text-align: center;
        font-family:Source Han Sans CN;
        font-weight:400;
        color:rgba(254,254,254,1);
        cursor:pointer;
        // border:1px solid;
        // border-image:linear-gradient(0deg, rgba(2,8,47,1), rgba(32,103,187,1)) 1 1;
        // box-shadow:0px 0px 0px 0px rgba(7,12,43,1);
      }
}
.accident-statics_table{
  width:474px;
  height:422px;
  position: relative;
  // background:rgba(2,6,31,0);
  border:1px solid;
  border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
}
.accident-statics .speed{  
  width:474px;
  height:69px;
  padding:5px;
  // background:rgba(2,6,31,0);
  border:1px solid;
  border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
}
.accident-statics .speedecharts{
  width:474px;
  height:299px;
  margin-top: 29px;
  margin-bottom: 29px;
  // background:rgba(2,6,31,0);
  border:1px solid;
  // padding:1vh 1vw;
  border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
  // div>#speeding-offences{
  //   width: 100%;
  //   height: 25vh;
  // }
}
.right-top-speed .left,.right-top-speed .right{
  flex: 1;
  font-size:16px;
  font-family:Source Han Sans CN;
  font-weight:400;
  font-style:italic;
  color:rgba(255,255,255,1);
  line-height:40px;
}
</style>