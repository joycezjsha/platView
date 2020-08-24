<template>
  <div class="over_speed_info">
    <m-title :label="title" img_type="1" style="width:100%;"></m-title>
    <div v-show='isCity' class='return' @click='returnAll'>&lt;&lt;返回全省</div>
    <div class="over_speed_info_container" v-show='tableIndex==1'>
      <div class="over_speed_info_tab borstyle">
        <m-com-title label="超速时间趋势" img_type="1" style="width:8vw;"></m-com-title>
         <div class='tab'>
          <el-tabs v-model="activeName" @tab-click="handleTrendTabClick">
            <el-tab-pane label="今日" name="1"></el-tab-pane>
            <el-tab-pane label="近30天" name="2"></el-tab-pane>
          </el-tabs>
        </div>
        <m-line-chart
          style="width:98%;height:85%"
          :chart_data="overSpeedEchartsData"
          c_id="outboundEcharts"
        ></m-line-chart>
      </div>
      <div class="Provincial borstyle">
        <m-com-title label="超速车辆分析" img_type="1" style="width:10vw;"></m-com-title>
        <div class="tab">
          <div class="over_speed_info_sort" id="over_speed_info_circle"></div>
        </div>
      </div>
      <div class="over_speed_info_statics borstyle">
        <m-com-title label="超速分类统计" img_type="1" style="width:10vw;"></m-com-title>
        <div class="tab">
          <div id="current-date"></div>
        </div>
      </div>
      <div class="center_table borstyle">
         <m-com-title label="实时超速" img_type="1" style="width:7vw;"></m-com-title>
         <ul class="traffic-index_content_table">
         <!--    -->
          <li @click="showMapData(item)" 
          class="index-item"
          :class="{itemselected:highlighted==item.HPHM}"
          v-for="item in indexDataList" :id="item.id" :key="item.id">
            <div style="margin-bottom:3px">
              <span :style="'color:rgba(255,255,255,1);background-color:'+item.color" class="car-name">{{item.HPZL}}</span>
              <span :style="'color:'+item.color" >{{item.HPHM}}</span>
              <!-- <span class="per-hour">{{item.YJLX}}</span> -->
              <span style="float: right;color:rgba(255,255,255,1);">时速/限速：{{item.SJ}}</span>
            </div>
            <div class="address-name">
              <div class="road">{{item.WFDZ}}</div>
              <div class="timers">违法时间：{{item.WFSJ.split(" ")[1]}}</div>
            </div>
          </li>
        </ul>
        </div>
    </div>
    <div class='over_speed_info_container boxstyle' v-show='tableIndex==2'>
      <m-com-title label="高发道路排名" img_type="1" style="width:10vw;"></m-com-title>
      <div class='roadTypeCls'><el-select v-model="roadType"  @change="changeRoadType">
        <el-option
        v-for="item in roadTypeList"
        :key="item.DLLX"
        :label="item.NAME"
        :value="item.DLLX">
        </el-option>
      </el-select>
      </div>
      <el-table class='gfTable'
            :data="roadDatas"
            v-loading="tableLoading"
            :default-sort="{prop: 'NUM', order: 'descending'}"
            :row-style="getRowClass"
            :header-row-style="getRowClass"
            :header-cell-style="getRowClass"
          >
            <el-table-column type="index" label="No." width="80"></el-table-column>
            <el-table-column prop="NAME" label="道路名称" width="130"></el-table-column>
            <el-table-column prop="NUM" label="超速数量"></el-table-column>
            <el-table-column prop="RATIO" label="超速比例" sortable></el-table-column>
          </el-table>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import echarts from "echarts";
import m_item from "@/components/UI_el/tab_item.vue";
import m_list from "@/components/UI_el/list.vue";
import m_tab from "@/components/UI_el/tab.vue";
import mTitle from "@/components/UI_el/title.vue";
import mComTitle from "@/components/UI_el/title_com.vue";
import mLineChart from "@/components/UI_el/line_chart.vue";
import blur from "../../blur.js";
export default {
  name: "TIndex",
  data() {
    return {
      map: {},
      title:'全省统计',
      activeName:'1',
      roadType:'',
      roadTypeList:[],
      roadDatas:[],
      overSpeedEchartsData: {
        legend: [],
        ydata:[],
        xdata: []
      },
      isCity:false,
      interval:null,
      highlighted:'', //选中行高亮显示
      indexDataList: [],//实时超速列表数据
      param:{ //全局查询参数缓存
        stime:1,etime:'',xzqh:''
      },
      tableIndex:'1', //标记地图选择标签：0->统计分析 1->多发路段
      tableLoading:false,
      map_cover: {
        sourceList:[],
        markers:[],
        lineList:[],
        popups:[]
      },
      statics_sort_option: { //车辆类型分析环形图
        color: ['#16c5ff','#ffa414','#8bb7b7','#10de28','#0F6FD2','#00B5B7','#FF2B2B'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend:{
          x : '50%',
          y : '5%',
          orient: 'vertical',
          align: 'right',
          "itemGap": 5,
	        'itemWidth':18,
          data:[],
          textStyle:{color:'white'}
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["60%", "80%"],
            center: ['25%', '55%'],
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
            data: []
          }
        ]
      },
      sort_chart: null,
      accurChart: null,
      listItems: [],
      echartslayer:null,
      statics_chart:null,//超速分类统计图表
      statics_option:{
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
            barWidth : 8,//柱图宽度
            type: 'bar',
            data:[],
            // data: [18203, 23489, 29034, 104970, 131744, 630230]
          }
        ]
      },
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
    this.map.setZoom(6);
    let that = this;
    that.initMainStaticsChart();
    that.getRealTimeOverSpeedDatas();
    that.initAccurCharts();
    that.getOverSpeedSort();
    that.getRoadTypesDatas();
    that.getRoadDatas();
    that.interval=setInterval(() => {
      that.initAccurCharts();
      if(that.param.stime==1 || that.param.stime==3){
        that.initMainStaticsChart();
        that.getOverSpeedSort();
      }
    },1000*60);
    blur.$on('changeMapTab',(tab)=>{
      if(that.tableIndex==tab) return;
      that.tableIndex=tab;
    });
    blur.$on('changeParamTimeAndXzqh',(data)=>{
      that.param=data;
      that.title=data.name;
      if(that.title!=''){
        this.isCity=true;
      }
      switch(that.tableIndex){
        case '1':case 1:{
          that.initMainStaticsChart();
          that.getOverSpeedSort();
          break;}
        case '2':case 2:{
          that.getRoadDatas();
          break;}
        default:break;
      }
    });
  },
  destroyed() {
    this.flyRoutes = [];
    this.clearMap();
    if(this.interval){
      clearInterval(this.interval)
    }
    // let that = this;
    this.map.setPitch(0); //设置地图的俯仰角
    // this.onHideLayer();
  },
  beforeDestroy(){
    this.clearMap();
  },
  methods: {
    /*
     * 点击返回按钮
     */
    returnAll() { 
      this.title='全省统计';
      this.isCity=false;
      this.param={stime:1,etime:'',xzqh:''};
      let that=this;
      blur.$emit('return');
      blur.$emit('returnAll');
      switch(that.tableIndex){
        case '1':case 1:{
          that.initMainStaticsChart();
          that.getOverSpeedSort();
          break;}
        case '2':case 2:{
          that.getRoadDatas();
          break;}
        default:break;
      }
    },
    /**
     * 超速时间趋势
     */
    initAccurCharts() {
      let that = this;
      let param = {state:this.activeName};
      that.overSpeedEchartsData.ydata=[];
      that.overSpeedEchartsData.xdata=[];
      // 如果有参数
      interf.GET_OVER_SPEED_TIME_TREND(param).then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              let car_data = that.overSpeedEchartsData;
              if(that.activeName=='1'){
                car_data.legend=["今日超速", "昨日超速","上周同期超速"];
                data.data.today.name='今日超速';
                car_data.ydata.push(data.data.today);
                data.data.yesterDay.name='昨日超速';
                car_data.ydata.push(data.data.yesterDay);
                data.data.lweek.name='上周同期超速';
                car_data.ydata.push(data.data.lweek);
                data.data.today.forEach(e => {
                  car_data.xdata.push(e.RQ);
                });
              }else{
                car_data.legend=["近30天超速"];
                data.data.thirty.name='近30天超速';
                  car_data.ydata.push(data.data.thirty);
                  data.data.thirty.forEach(e => {
                    car_data.xdata.push(e.RQ);
                  });
              }
              that.overSpeedEchartsData = car_data;
            } else {
              that.$message({
                message: '近30日重点车辆出入陕趋势',
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
     * 超速时间趋势tab切换
     */
    handleTrendTabClick(tab, event) {
      this.initAccurCharts();
    },
    /**
     * 生成超速车辆分析饼图echarts 
     */
    initMainStaticsChart() {
      let that = this;
      that.car_type_data=[];
      that.statics_sort_option.series[0].data=[];
      that.statics_sort_option.legend.data=[];
      let param={stime:that.param.stime};
      if(that.param.etime && that.param.etime!='') param.etime=that.param.etime;
      if(that.param.xzqh && that.param.xzqh!='') param.xzqh=that.param.xzqh;
      interf.GET_OVER_CAR_TYPE_API(param).then(response => {
        if (response && response.status == 200) {
          var data = response.data;
          if (data.errcode == 0) {
            if (!that.sort_chart) {
              that.sort_chart = echarts.init(document.getElementById("over_speed_info_circle"));
            }
            that.car_type_data=data.data;
            if(data.data.length>0){
              data.data.forEach(e=>{
                that.statics_sort_option.series[0].data.push({name:e.NAME,value:e.NUM});
                  that.statics_sort_option.legend.data.push(e.NAME);
              })
            }
            that.statics_sort_option.legend.formatter=function (name) {
              let value='';
              for(let i=0;i<data.data.length;i++){
                if(data.data[i].NAME==name){
                  value=data.data[i].NUM;
                }
              }
              return name+'：'+value;
          };
            that.sort_chart.setOption(that.statics_sort_option);
            
          } else {
            that.$message({
              message: '请求超速车辆类型分析数据失败',
              type: "error",
              duration: 3000
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
     * 获取超速分类统计
     */
    getOverSpeedSort(){
      let that = this;
      that.statics_option.yAxis.data=[];
      that.statics_option.series[0].data=[];
      let param={stime:that.param.stime};
      if(that.param.etime && that.param.etime!='') param.etime=that.param.etime;
      if(that.param.xzqh && that.param.etime!='') param.xzqh=that.param.xzqh;
      let names={
        17211:'超速50%以上',
        16361:'超速20-50%',
        13521:'超速10%',
      };
      interf.GET_OVER_SPEED_SORT_API(param).then(response=>{
        if(response && response.status==200){
          var data = response.data;
          if(data.errcode == 0){
            if(data.data.length>0){
              that.statics_chart = echarts.init(document.getElementById('current-date'));
              data.data.reverse().forEach(e=>{
                that.statics_option.yAxis.data.push(names[e.WFXW]?names[e.WFXW]:'其他');
                that.statics_option.series[0].data.push(e.NUM)
              })
              that.statics_chart.setOption(that.statics_option);
              window.addEventListener("resize",()=>{
                that.statics_chart.resize();
              })
            }else{
              that.statics_chart.setOption(that.statics_option);
            }
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
    *实时超速
    */
    getRealTimeOverSpeedDatas(){
      let that = this,param={stime:this.param.stime};
      that.tableLoading = true;
      that.indexDataList=[];

      if(this.param.stime!='' && this.param.etime!=''){
        param.etime=this.param.etime;
      };
      if(this.param.xzqh!=''){
        param.xzqh=this.param.xzqh;
      };
      interf.GET_OVER_SPEED_REAL_API(param).then(response => {
        that.tableLoading = false;
        if (response && response.status == 200) {
          var data = response.data;
          // data={"errcode":0,"data":[{"XZQH":"610602","SJ":"76\\60","HPZL":"小型汽车","HPHM":"鲁R528HW","WFDZ":"303省道61公里700米至303省道67公里700米","WFSJ":"2020-06-03 00:00:00"}],"errmsg":"success"};
          if (data.errcode == 0) {
            that.indexDataList=data.data.map(e=>{
                e.color=that.getColor(e.HPZL);
                return e;
              });
          } else {
            that.$message({
              message: '实时超速服务异常',
              type: "error",
              duration: 3000
            });
            that.tableLoading = false;
          }
        }
      })
      .catch(err => {
        that.$message({
              message: '更新车辆归属地信息失败',
              type: "error",
              duration: 1500
            });
            that.tableLoading = false;
      })
      .finally(() => {
        that.tableLoading = false;
      });
    },
    /**
     * 获取车辆类型对应颜色
     */
    getColor(type){
      let color='#8bb7b7';
      switch(type){
        case '大型汽车': case '大型普通客车' :color='#ffa414';break;
        case '小型汽车' :color='#16c5ff';break;
        case '小型新能源汽车' :color='#10de28';break;
        default:break;
      }
      return color;
    },
    /*
    * 点击左侧的超速预警列表，显示对应的数据
    */
    showMapData(item){
      let that=this;
      that.clearMap();
      that.highlighted=item.HPHM;
      this.addOverSpeedMarker(item);
      // $('#'+item.HPHM+'_marker').trigger('click');
    },
    /**
     * 展示实时超速点位
     */
    addOverSpeedMarker(item){
      let that=this;
      let center=[item.JD,item.WD];
      let el = document.createElement('div'); 
      el.style["background-image"] = "url("+IMG.OVER_SPEED_IMG+")";
      el.style["background-size"] = "100% 100%";
      el.style.width='25px';
      el.style.height='25px';
      el.id=item.HPHM+'_marker';

      let mainDiv = document.createElement('div');
      mainDiv.style.backgroundColor='rgba(3,12,32,0.74)';
      mainDiv.style.width='218px';
       mainDiv.style.paddingTop='6px';
      mainDiv.style.height='auto';
      mainDiv.className = 'custom-popup-class'; //custom-popup-class为自定义的css类名

      let closeimgDiv = document.createElement("div");
      closeimgDiv.className = "closeImgDiv";
      let closeimg = document.createElement("img");
      closeimg.src = IMG.CLOSE_IMG;
      closeimg.className = "closeImg";
      closeimgDiv.appendChild(closeimg);
      mainDiv.appendChild(closeimgDiv);
      closeimg.addEventListener("click", function() {
        that.clearMap();
        that.highlighted='';
      });
      closeimg.addEventListener("mouseover", function() {
        this.setAttribute("src", IMG.CLOSE_HOVER_IMG);
      });
      closeimg.addEventListener("mouseout", function() {
        this.setAttribute("src", IMG.CLOSE_IMG);
      });

      
      let d1 = document.createElement('div');
      let span1= document.createElement('span'); 
      let span2= document.createElement('span'); 
      span1.innerHTML=item.HPZL;
      span1.style.backgroundColor=this.getColor(item.HPZL);
      span1.style.marginRight='5px';
      span2.innerHTML=item.HPHM;
      d1.fontFamily='Source Han Sans CN';
      d1.style.color = "rgba(255,255,255,1)";
      d1.appendChild(span1);
      d1.appendChild(span2);
      mainDiv.appendChild(d1);

      let d2 = document.createElement('div');
      let span3= document.createElement('span'); 
      let span4= document.createElement('span'); 
      span3.innerHTML='时速\限速 :  ';
      span3.style.color = "#00C6FF";
      span4.innerHTML=item.SJ;
      span4.style.color = "rgba(255,255,255,1)";
      d2.appendChild(span3)
      d2.appendChild(span4)
      mainDiv.appendChild(d2);

      let d3= document.createElement('div');
      let span5= document.createElement('span'); 
      let span6= document.createElement('span'); 
      span5.innerHTML='监测时间 :  ';
      span5.style.color = "#00C6FF";
      span6.innerHTML=item.WFSJ;
      d3.style.color = "rgba(255,255,255,1)";
      d3.appendChild(span5)
      d3.appendChild(span6)
      mainDiv.appendChild(d3);

      if(item.tupian) {
        let d4= document.createElement('div');
        let span7= document.createElement('img'); 
        span7.src=item.tupian;
        span7.style.width='97%';
        span7.style.height='157px';
        span7.style.margin='8px 5px';
        d4.appendChild(span7);
        mainDiv.appendChild(d4);
      }
      let popup= new minemap.Popup({closeOnClick: false, closeButton: false, offset: [0, 0],autoPan: true}).setDOMContent(mainDiv).setLngLat(center).addTo(this.map);
      this.map_cover.popups.push(popup);
      let marker = new minemap.Marker(el, {offset: [-5,-5]}).setLngLat(center).addTo(this.map);
      this.map_cover.markers.push(marker);

      this.map.setCenter(center);
    },
    
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
    },
    /*
    * 获取道路分类列表
    */
    getRoadTypesDatas(){
      let that = this;
      that.roadTypeList=[];
      interf.GET_ROAD_CATE_GORY_API({}).then(response=>{
        if(response && response.status==200){
          var data = response.data;
          if(data.errcode == 0){
            that.roadTypeList=[{"DLLX":"","NAME":"全部道路"}].concat(data.data);
            that.roadType='';
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
     * 切换道路类型
     */
    changeRoadType(){
      this.getRoadDatas();
    },
    /**
    * 高发道路排名
    * stime   etime  xzqh   dllx  
    */
   getRoadDatas(){
     let that = this;
     that.tableLoading = true;
    that.roadDatas=[];
    let param={stime:that.param.stime};
    if(that.param.etime && that.param.etime!=''){
      param.etime=that.param.etime;
    }
    if(that.param.xzqh && that.param.xzqh!=''){
      param.xzqh=that.param.xzqh;
    }
    if(this.roadType!=''){
      param.dllx=this.roadType;
    }
    interf.GET_ROAD_ORDER(param).then(response=>{
      that.tableLoading = false;
      if(response && response.status==200){
        var data = response.data;
        if(data.errcode == 0){
          that.roadDatas=data.data;
        }else{
          that.$message({ 
            message: data.errmsg,
            type: "error",
            duration: 1500
            });
          that.tableLoading = false;
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
   
    /*##清除地图加载点、线、面、弹框*/
      clearMap(){
        //清除marker
        if(this.map_cover.markers.length>0){
          for(let i=0;i<this.map_cover.markers.length;i++){
            this.map_cover.markers[i].remove();
          }
          // this.map_cover.markers.forEach(e=>{
          //     e.remove();
          //   })
        }
        this.map_cover.markers=[];
        //清除source
        if(this.map_cover.sourceList.length>0){
          this.map_cover.sourceList.forEach(e=>{
            if(this.map.getSource(e)!=undefined){
              this.map.removeSource(e);
            }
          })
        }
        //清除layer
        if(this.map_cover.lineList.length>0){
          this.map_cover.lineList.forEach(e=>{
            if(this.map.getLayer(e)!=undefined){
              this.map.removeLayer(e);
            }
          })
        }
        //清除popup
        if(this.map_cover.popups.length>0){
          this.map_cover.popups.forEach(e=>{
            e.remove();
          })
        }
        this.map_cover.popups=[];
        if(this.echartslayer){
          this.echartslayer.remove();
        }
      }
    /*##清除地图加载点、线、面、弹框 --END*/
    }
};
</script>
<style scoped lang='scss'>
@import "@/assets/css/color.scss";
@import "@/assets/css/color.scss";
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.over_speed_info {
  position: fixed;
  z-index: 10;
  right: 13px;
  width: 474px;
  height: 85vh;
  top: 90px;
  color: white;
  .over_speed_info_container{
    width:100%;
    height:100%;
  }
  .return{
    position: absolute;
    left: 5%;
    top: 10px;
    cursor: pointer;
    color: $color-primary;
  }
  .return:hover{
    color:$color-primary;
  }
  .item{width:95%;margin:0 auto;margin-top:10px;
    margin-bottom:10px;
  }
  &_statics{
    width:100%;
    height:200px;
    .tab{
      width:100%;
      height:85%;
      #current-date{
        width:100%;
        height:100%;
      }
    }
  }
}
.over_speed_info_container .over_speed_info_tab {
  width: 474px;
  height: 230px;
  .tab{
    position:absolute;
    top:35px;
    right:0px;
    width:155px;
  }
}

.over_speed_info_container .top {
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
  }
}
.over_speed_info_container .Provincial {
  width: 474px;
  height: 210px;
  right:13px;
  div {
    // display: flex;
    .Provincial-data {
      padding: 3vh 1.5vw;
    }
  }
  .tab {
  padding-left: 1.5vw;
  display: flex;
  width: 100%;
  height: 150px;
  .over_speed_info_sort {
    width: 100%;
    height: 90%;
    float: left;
  }
}
}
.center_table{
  width: 474px;
  height: 250px;
  right:13px;
  .traffic-index_content_table{
    overflow-y: auto;
    height: 86%;
    padding:1vh 0.5vw;
    
    .index-item{
      width:418px;
      padding:10px 0;
      margin: 3px auto;
      .car-name{
        width:38px;
        height:22px;
        background:rgba(89,26,26,1);
        border-radius:2px;
        border: 1px solid #631415;
        // margin-left: 12px;
        font-size:14px;
        font-family:Source Han Sans CN;
        font-weight:400;
        color:rgba(255,255,255,1);
        margin-right: 15px;
      }
      .per-hour{
        margin:0 0.4vw;
        font-size:14px;
        font-family:Source Han Sans CN;
        color:rgba(166,176,205,1);
      }
      .address-name{
        font-size:14px;
        font-family:Source Han Sans CN;
        color:rgba(166,176,205,1);
        display: flex;
        .road{
          flex: 4;
        }
        .timers{
          flex:2;
          text-align: right;
        }
      }
    }
    .index-item:nth-of-type(odd){ 
      background-color:rgba(72,84,108,0.2);
    }
    .index-item:hover{
      background-color:rgba(4,104,166,0.6);
    }
    .itemselected{
      background-color: #0069a6;
    }
  }
}
.roadTypeCls{
  position:absolute;
  right:20px;
}
.gfTable{
  width: 100%;
  height:722px;
  margin-top: 30px;
  overflow-y: scroll;
}
</style>