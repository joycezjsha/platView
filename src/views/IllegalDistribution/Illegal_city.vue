<template>
  <div class="illegal-city-div">
    <div class="illegal-city_container boxstyle">
      <div class="illegal-city_title">
        <m-title label='违法分析' style='width:6vw;'></m-title>
      </div>
      <!-- @tab-click="handleClicktime" -->
      <div style="display:flex">
        <!-- <span class="" style="width:3vw;color:#fff">时间：</span> -->
        <el-tabs v-model="activeName1" @tab-click="handleClickTime" style="padding:0 3vw;">
          <el-tab-pane label="近7天" name="1"></el-tab-pane>
          <el-tab-pane label="近30天" name="2"></el-tab-pane>
          <el-tab-pane label="近3月" name="3"></el-tab-pane>
          <el-tab-pane label="自定义" name="4"></el-tab-pane>
        </el-tabs>
      </div>
      <div class='illegal-city-query'  v-if="activeName1=='4'">
        <span class="illegal-city-query--label">时间：</span>
        <span class="illegal-city-query--time">
          <el-date-picker width="100%"
           value-format="yyyy-MM-dd"
            v-model="timeRange"
            :picker-options="pickerOptions"
            type="daterange"
            :default-time="defaultTime"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            >
          </el-date-picker>
        </span>
        <span class="illegal-city-query--btn">
          <!--  -->
          <el-button  @click="determine" type="primary">确定</el-button>
        </span>
      </div>
      <div class="illegal-city_content">
        <!-- @tab-click="handleClick" -->
         <!-- <el-tabs v-model="activeName"   style="padding:0 3vw;">
          <el-tab-pane label="全部" name="first"></el-tab-pane>
          <el-tab-pane label="122" name="second"></el-tab-pane>
          <el-tab-pane label="互联网" name="third"></el-tab-pane>
          <el-tab-pane label="视频巡查" name="fourth"></el-tab-pane>
        </el-tabs> -->
        <div style="padding:0 5px;height:73vh;width:100%;overflow-x: hidden;">
          <el-table  @row-click="handItem" 
           v-loading='tableLoading'
           highlight-current-row
           style="width:100%"
           ref="tableillegal"
          :data="indexDatas"  height="100%" :default-sort = "{prop: 'COUNTNUM', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
          <el-table-column  type="index" label="No" width="50"></el-table-column>
            <el-table-column prop="CITY" label="管理部门" >
              <!-- <template v-if="scope.row.city!=null" slot-scope="scope">
                {{scope.row.city}}
              </template> -->
            </el-table-column>
            <el-table-column prop="COUNTNUM" label="全部违法" sortable></el-table-column>
            <el-table-column prop="CSNUM" label="超速" sortable></el-table-column>
            <el-table-column prop="XNUM" label="限行"  sortable></el-table-column>
            <el-table-column  v-if='showXZQH' prop="XZQH" label="行政区号"  ></el-table-column>
        </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import mTitle from "@/components/UI_el/title_com.vue";
import blur from '../../blur';
export default {
  name: "TCruise",
  data() {
    return {
      stime:"1",
      map: {},
      xzqh:'',
      showXZQH:false,
      activeName1:"1",
      tableLoading:false,
      indexDatas: [],
      selectItem:{"city":"西安",order:8},
      areaColors:["#556B2F","#00FFFF","#0000EE","#8A2BE2","#c48f58","#9fcac4","#5ad2a0","#f18a52","#656bd4","#7ca0cd","#88b7dc","#a08bd3","#be7fcd","#30a2c4","#c0ccd7","#dbddab","#9cd076","#69b38b","#437fb9","rgb(255, 143, 109)"],
      timeRange:'',
      mapAddItems:{
        polygons:[],
        sourceList:[],
        lineList:[],
        popups:[]
      },
      defaultTime:['00:00:00','00:00:00'],
      activeName:'全部',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
          // shortcuts: [{
          //   text: '最近一周',
          //   onClick(picker) {
          //     const end = new Date();
          //     const start = new Date();
          //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          //     picker.$emit('pick', [start, end]);
          //   }
          // }, {
          //   text: '最近一个月',
          //   onClick(picker) {
          //     const end = new Date();
          //     const start = new Date();
          //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          //     picker.$emit('pick', [start, end]);
          //   }
          // }, {
          //   text: '最近三个月',
          //   onClick(picker) {
          //     const end = new Date();
          //     const start = new Date();
          //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          //     picker.$emit('pick', [start, end]);
          //   }
          // }]
      },

    };
  },
  components:{mTitle},
  mounted() {
    this.map = this.$store.state.map;
    // let that = this;
    this.map.setZoom(11);
    this.map.repaint = true;
    this.getIndexData();
    this.getIllegalAnalysisDatas(this.stime)
    
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
  },
  methods: {
    /**
   * 点击标签页
   */
  handleClickTime(item){
    let that=this;
    that.activeName1=item.name;
    blur.$emit('getstime',item.name)
    if(item.name!='4'){
      that.stime=item.name;
      that.getIllegalAnalysisDatas(that.stime);
      this.timeRange='';
    }else{
      that.timeRange= undefined;
      that.indexDatas=[];
    }
  },
  /**
  * 日历选择的时间
  */
  determine(){
    let that = this;
     if(!that.timeRange || that.timeRange==''){
         that.$message({
            message: '开始日期和结束日期不能为空！',
            type: "warning",
            duration: 3000
          });
         return;
      }else{
        if(new Date(this.timeRange[1]).getTime()==new Date(new Date().toLocaleDateString()).getTime()){
          this.timeRange[1]=this.timeRange[1].split(' ')[0]+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds();
        }
        blur.$emit('gettimeRange',that.timeRange)
        // blur.$emit("determine",that.timeRange)
        that.getIllegalAnalysisDatas(that.timeRange[0],that.timeRange[1]);
        let time1=(that.timeRange[0].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"))+' '+'00:00:00';
        let time2=(that.timeRange[1].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"))+' '+'23:59:59';
        let timeData={time1,time2}
        blur.$emit("sendTime",timeData)
      }
   
  },
    /**
     * 点击表格事件
    */
   handItem(row){
     this.xzqh=row.XZQH;
     blur.$emit('getxzqh',this.xzqh)
     blur.$emit('getcity',row.CITY)
   },
   /**
    * 超速违法 IllegalAnalysis/getSpeedingViolation   GET_SPEED_VIOLA_API
    */
    getSpeedingViolationDatas(){

    },
    /** 
    * 违法分析  IllegalAnalysis/getIllegalAnalysis   GET_ILL_ANALY_API 
    */
   getIllegalAnalysisDatas(stime,etime){
     let that = this;
     that.tableLoading = true;
     that.indexDatas=[];
     let param={};
     if(etime===undefined){
      param.stime=stime;
     }
     if(etime!=undefined){
       param.stime=that.timeRange[0];
       param.etime=that.timeRange[1];
     }
     interf.GET_ILL_ANALY_API(param)
     .then(response=>{
       that.tableLoading = false;
        if(response && response.status==200){
          var data = response.data;
          if(data.errcode == 0){
            if(data.data.length>0){
              for(var i=0;i<data.data.length;i++){
                if(data.data[i].CITY!=null){
                  that.indexDatas.push(data.data[i])
                }
              }
            }else{
              that.indexDatas=[];
            }
          }else{
            that.$message({ 
              message:'违法分析请求服务失败',
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
        blur.$on("gettablelllegal",data=>{
          that.$refs.tableillegal.setCurrentRow()
        })
      });
   },
    //获取巡航数据
    getIndexData() {
      let that = this;
    //  interf.getCityIndexData({index:1},(data) => {
    //       },(e)=>{

    //       })
    $.ajax({
        url: "./static/json/city_accident_data.json", //globals.CRUISE_ALL_INFO_URL,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        responseType: "json",
        method: "get",
        dataType: "json",
        data: {
          // token: window.localStorage.getItem("loginUserToken")
        },
        success: function(data) {
          if (data.errcode == -2) {
            that.$router.push({ name: "/login" });
          }
          if (data.errmsg == "success" && data.data.length > 0) {
            let datas=[];
            data.data.map(e=>{
              datas.push(
                {"city":e.areaName,"index":Math.round(e.areaTpi)*10/100,"week_radio":"+0.3%","his_radio":"-0.1%"}
              )
            });
            // that.indexDatas1=datas;
            that.addArea(data.data);
            // that.addAreaIdentify(data.data);
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          
        }
      });
    },
    /**
     * 地图添加辖区面
     * careated by ..
     */
    addArea(data){
      let _this=this;
      data.forEach((e,i)=>{
        let lonlats=_this.getLonlats(e.areaGeometry)[0].split(',');
        lonlats=lonlats.map(e=>{
          if(e.split(' ')[0]!=''){
            return [e.split(' ')[0],e.split(' ')[1]];
          }else{
            return [e.split(' ')[1],e.split(' ')[2]];
          }
         
        });
        let jsonData = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [lonlats]
                    }
                }
            ]
        };
        _this.areaColors[i];
        _this.mapAddItems.lineList.push('arealayerId_'+i);
        _this.mapAddItems.sourceList.push('areaSourceId_'+i);
        // this.map.addPolygons(jsonData,this.map,'areaSourceId_'+i,'arealayerId_'+i,_this.areaColors[i]);
      })
      
    },
    /**
     * 添加指数悬浮框
     * careated by ..
     */
    addAreaIdentify(data){
      let that=this;
      data.forEach((item,i)=>{
        let newTpi = item.areaTpi;
        let newTpis = newTpi.toFixed(0);
        newTpi = (newTpi/10).toFixed(1);
        let curTpiColor = that.getTpiColor(newTpis);
        let w = 145;
        let h = 30;
        let tw = 113;
        if (item.areaName.length > 6) {
          h = 60;
        }
        //在地图上显示指数和道路名称
        let mainDiv = $("<div style='border:1px solid #9A9A9A;height: " + h + "px;width: "+w+"'></div>");
        let tpiDiv = $("<div class='tpi' style='width:30px;text-align: center;float:left;background:" + curTpiColor + ";color:#2c3453;height: " + h + "px'></div>");
        let tpiSpan = $("<span style='line-height:" + h + "px;font-weight: bold;font-size: 16px;margin-bottom: 8px;font-family: \"Microsoft YaHei\";'>" + newTpi + "</span>");
        tpiDiv.append(tpiSpan);
        mainDiv.append(tpiDiv);
        let nameDiv = $("<div style='width:" + tw + "px;float:left;background:#2c3453;color:#ffffff;height: " + h + "px;text-align: center;'></div>");
        let nameSpan = $("<span style='line-height:30px;font-weight: bold;font-size: 16px;margin-bottom: 8px;font-family: \"Microsoft YaHei\";'>" + item.areaName + "</span>");
        nameDiv.append(nameSpan);
        mainDiv.append(nameDiv);

        let pointPopup = new minemap.Popup({closeOnClick: false, offset: [0, 0], closeButton: false});
        pointPopup.setLngLat(item.areaCentry.split(" ")).setDOMContent(mainDiv[0]);
        pointPopup.addTo(that.map);
        this.mapAddItems.popups.push(pointPopup);
        $(".minemap-popup-content").css("padding", "0");
        $(".minemap-popup-tip").css("border-top-color", "#2c3453");
        //鼠标滚动改变地图层级
        mainDiv.on("mousewheel DOMMouseScroll", function (e) {
          let delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
            (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox
          if (delta > 0) {
            // 向上滚
            commonVariable.CURRENT_MAP.zoomIn();
          } else if (delta < 0) {
            // 向下滚
            commonVariable.CURRENT_MAP.zoomOut();
          }
        });
        mainDiv.click(function(){
          that.drawTeamIndexCharts(item);


        });
        })
    },
    getTpiColor(newTpi) {
        let tpiColor = ['#01bd58', '#91c955', '#f6f954', '#efbf1f',"#f00100"];
        let curTpiColor;
        if (newTpi < 20) {
          curTpiColor = tpiColor[0];
        } else if (newTpi >= 20 && newTpi < 40) {
          curTpiColor = tpiColor[1];
        } else if (newTpi >= 40 && newTpi < 60) {
          curTpiColor = tpiColor[2];
        } else if (newTpi >= 60 && newTpi < 80) {
          curTpiColor = tpiColor[3];
        } else if (newTpi >= 80) {
          curTpiColor = tpiColor[4];
        }
        return curTpiColor;
      },
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
                return "background:transparent;";
   },
    //取括号内数据
    getLonlats(str){
      let regex = /[^\(\)]+(?=\))/g;
      return str.match(regex);
    },
    //清除地图加载点、线、面、弹框
    clearMap(){
      //清除source
      if(this.mapAddItems.sourceList.length>0){
        this.mapAddItems.sourceList.forEach(e=>{
          if(this.map.getSource(e)!=undefined){
            this.map.removeSource(e);
          }
        })
      }
      //清除layer
      if(this.mapAddItems.lineList.length>0){
        this.mapAddItems.lineList.forEach(e=>{
          if(this.map.getLayer(e)!=undefined){
            this.map.removeLayer(e);
          }
        })
      }
      //清除popup
      if(this.mapAddItems.popups.length>0){
        this.mapAddItems.popups.forEach(e=>{
          e.remove();
        })
      }
    },
    


  }
};
</script>
<style  scoped lang='scss'>
@import '@/assets/css/color.scss';
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.illegal-city-div {
  position: absolute;
  z-index: 10;
  left:12px;
  width: 474px;
  height:977px;
  top:12px;
}
.illegal-city_container {
  width: 100%;
  height: 100%;
  .tab_line{
    width: 96%;
    height: 2px;
    background: #fff;
    position: absolute;
    margin: 5% 2% 0 2%;
    }
  .illegal-city_title{
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
    &--tab{
      width:100%;
      height:100%;
      @include flex(row,center);
    }
    .d4_one,.d4_two{
        float: left;
        width: 0;
        height: 0;
        border-width: 1.5vh;
        border-style: solid;
        border-color: transparent #fff transparent transparent; 
        transform: rotate(0deg);
        @include flex(row,center);
      }
      .d5_one,.d5_two{
        float: right;
        width: 0; 
        height: 0;
        border-width: 1.5vh;
        border-style: solid;
        border-color: transparent #fff transparent transparent;
        -webkit-transform: rotate(180deg);
        @include flex(row,center);
      }
     .tab_one,.tab_two{
        @include flex(row,center);
        width: 65%;
        background: #fff;
        color:black;
        cursor:pointer;
        height:3vh;
      }
    &--tab.active,&--tab:hover{
      .d4_one,.d4_two{
        border-color: transparent #09c transparent transparent; 
      }
      .d5_one,.d5_two{
        border-color: transparent #09c transparent transparent;
      }
     .tab_one,.tab_two{
        background: #09c;
        color:white;
      }
    }
    
    }
    .illegal-city-query{
      color: $color-white;
      width: 100%;
      height: 6vh;
      line-height: 3vh;
      text-align: center;
      font-size: 0.8vw;
      // margin: 2% 0;
      @include flex(row,center);
      &--label{
        width:15%;
        color:$color-text-label;
        display:inline-block;
        @include flex(row,center);
      }
      &--time{
        width:60%;
        display:inline-block;
        @include flex(row,center);
      }
      &--btn{
        width:25%;
        display:inline-block;
        @include flex(row,center);
      }
    }
  .illegal-city_content {
    width: 98%;
    height: 87%;
    box-sizing: border-box;
    padding:0 0.3vw;
    // margin: 1%;
    &_table {
      overflow-y: auto;
    }
    
  }
}
</style>