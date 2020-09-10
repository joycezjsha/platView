<template>
  <div class="vehicle_warning-div ">
    <div class='vehicle_warning-div--top borstyle '>
      <!-- <m-tab label='今日预警'  :value='warningStatics.tCount' :right_value='warningStatics.t_radio' icon='icon-dianjing' icon_style='color:#FFFFFF' class='item'></m-tab>
      <m-tab label='昨日预警' :value='warningStatics.yestoadyCount' :right_value='warningStatics.y_radio' icon='icon-kakou' icon_style='color:#FFFFFF' class='item'></m-tab>
      <m-tab label='本周预警' :value='warningStatics.weekCount' :right_value='warningStatics.w_radio' icon='icon-jiankong1' icon_style='color:#FFFFFF' class='item'></m-tab> -->
      <div class='tab active' @click='selectTime(1)'>
        <div class='img'></div>
        <div class="label">今日预警</div>
        <div class='value'>{{warningStatics.tCount}}</div>
        <div class='radio'>
          <div v-for='(item,index) in warningStatics.t_radio' :key="index">
            <div class='label'>{{item.label}}:</div>
            <div class='value'>{{item.value}}</div>
            <div class='img'>
              <i class="iconfont icon-shangsheng" :style='item.value=="-"?"color:transparent":(item.value.split("%")[0]>0?"color:#FFAF05":"transform:rotate(180deg);color:#00DFC7")' />
            </div>
          </div>
        </div>
      </div>
      <div class='tab' @click='selectTime(2)'>
        <div class='img'></div>
        <div class="label">昨日预警</div>
        <div class='value'>{{warningStatics.yestoadyCount}}</div>
        <div class='radio'>
          <div v-for='(item,index) in warningStatics.y_radio' :key="index">
            <div class='label'>{{item.label}}:</div>
            <div class='value'>{{item.value}}</div>
            <div class='img'>
              <i class="iconfont icon-shangsheng" :style='item.value=="-"?"color:transparent":(item.value.split("%")[0]>0?"color:#FFAF05":"transform:rotate(180deg);color:#00DFC7")' />
            </div>
          </div>
        </div>
      </div>
      <div class='tab' @click='selectTime(3)'>
        <div class='img'></div>
        <div class="label">本周预警</div>
        <div class='value'>{{warningStatics.weekCount}}</div>
        <div class='radio'>
          <div v-for='(item,index) in warningStatics.w_radio' :key="index">
            <div class='label' style='line-height: 40px;'>{{item.label}}:</div>
            <div class='value' style='line-height: 40px;'>{{item.value}}</div>
            <div class='img' style='line-height: 40px;'>
              <i class="iconfont icon-shangsheng" :style='item.value=="-"?"color:transparent":(item.value.split("%")[0]>0?"color:#FFAF05":"transform:rotate(180deg);color:#00DFC7")' />
            </div>
          </div>
        </div>
      </div>
      <div class='vehicle_warning-div-query'>
        <span class="vehicle_warning-div-query--label">时间：</span><span class="vehicle_warning-div-query--time">
          <el-date-picker width="100%"
            v-model="timeRange"
            type="daterange"
            :default-time="defaultTime"
            value-format='yyyy-MM-dd HH:mm:ss'
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            >
          </el-date-picker>
          </span>
          <span class="vehicle_warning-div-query--btn" @click='selectTime(4)'><el-button type="primary" v-loading='queryLoading'>确定</el-button></span>
      </div>
      <div class='custom_tab' v-show='isCustom'><span>所选时间段内预警量：</span><span>{{warningStatics.customCount}}</span></div>
    </div>
    
    <div class='vehicle_warning-div--bottom borstyle'>
      <m-title label='实时预警' style='width:8vw;'></m-title>
       <ul class="traffic-index_content_table">
         <!--    -->
          <li @click="showMapData(item)" 
          class="index-item"
          :class="{itemselected:highlighted==item.HPHM}"
          v-for="item in trafficDatas" :id="item.id" :key="item.id">
            <div style="margin-bottom:3px">
              <span :style="'color:'+item.color" >{{item.HPHM}}</span>
              <span :style="'color:rgba(255,255,255,1);background-color:'+item.color" class="car-name">{{item.HPZL}}</span>
              <span :style="'color:rgba(255,255,255,1);background-color:'+item.color" class="car-name">{{item.CLLX}}</span>
              <!-- <span class="per-hour">{{item.YJLX}}</span> -->
              <span style="float: right;color:rgba(255,255,255,1);">{{item.YJLX}}</span>
            </div>
            <div class="address-name">
              <div class="road">{{item.DLMC}}</div>
              <div class="timers">{{item.YJSJ.split(" ")[1]}}</div>
            </div>
          </li>
        </ul>
    </div>
    <!-- 点击左侧的超速预警列表，显示对应的数据  -->
    <div>
      
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import m_tab from './tab.vue';
import cus_tab from '@/components/UI_el/tab.vue';
import m_tiptxt from '@/components/UI_el/tiptxt.vue';
import mTitle from '@/components/UI_el/title_com.vue';
import blur from '../../blur.js';
export default {
  name: "overview_left",
  data() {
    return {
      map: {},
      isShowCity:false,
      queryLoading:false,
      highlighted:'', //选中行高亮显示
      isShowIcon:false,
      tableLoading:false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      defaultTime:['00:00:00','00:00:00'],
      warningStatics:{tCount:2328,t_radio:[],yestoadyCount:2328,weekCount:'2308',customCount:'2308',y_radio:[],w_radio:[]},
      map_cover:{
        sourceList:[],
        markers:[],
        lineList:[],
        popups:[]
      },
      timeRange:'',
      countnum:'',
      centerstatics:{
        Count:'',
        comein:'',
        goout:'',
        radio:'25%'
      },
      timer:null,
      indexDatas: [],
      trafficDatas: [],
      selectParam:{stime:1,endtime:'',xzqh:''},
      isCustom:false
    };
  },
  components:{mTab:m_tab,mTiptxt:m_tiptxt,mTitle,cTab:cus_tab},
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    that.getStaticsData();
    that.getIndexData();
    that.timer=setInterval(() => {
      that.getStaticsData();
      that.getIndexData();
    },1000*60);
  },
  destroyed() {
    this.map.setPitch(0);
    if(this.timer){
      clearInterval(this.timer)
    }
  },
  methods: {
    /**
     * 获取预警统计数据 
     */
    getStaticsData(){
      // this.warningStatics={};
      let _this=this;
      _this.warningStatics={tCount:2328,t_radio:[],yestoadyCount:2328,weekCount:'2308',customCount:'2308',y_radio:[],w_radio:[]};
     //获取今日预警
      interf.GET_TODAY_ALARM({}).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
              _this.warningStatics.tCount=data.data.TODAYALARMNUM;
              _this.warningStatics.t_radio.push({label:'环比昨天',value:data.data.YESTERDAYRATIO });
              _this.warningStatics.t_radio.push({label:'环比上周',value:data.data.WEEKRATIO });
            } else{
              _this.$message({
                message: data.errmsg,
                type: "error",
                duration: 3000
              });
            }
        }
      })
      .catch(err=>{
         _this.$message({
            message: '今日预警-程序报错',
            type: "error",
            duration: 3000
          });
      })
      .finally(() => {
      });
    //获取昨日预警
      interf.GET_YESTODAY_ALARM({}).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
              _this.warningStatics.yestoadyCount=data.data.YESTERDAYALARMNUM;
              _this.warningStatics.y_radio.push({label:'环比前一天',value:data.data.YESTERDAYRATIO.split('%')[0]=='∞'?'-':data.data.YESTERDAYRATIO});
              _this.warningStatics.y_radio.push({label:'环比上周',value:data.data.WEEKRATIO});
            } else{
              _this.$message({
                message: data.errmsg,
                type: "error",
                duration: 3000
              });
            }
        }
      })
      .catch(err=>{
        debugger;
         _this.$message({
            message: '昨日预警-程序异常',
            type: "error",
            duration: 3000
          });
      })
      .finally(() => {
      });
    //获取本周预警
      interf.GET_WEEK_ALARM({}).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
              _this.warningStatics.weekCount=data.data.WEEKMNUM;
              _this.warningStatics.w_radio.push({label:'环比上周',value:data.data.WEEKRATIO });
            } else{
              _this.$message({
                message: data.errmsg,
                type: "error",
                duration: 3000
              });
            }
        }
      })
      .catch(err=>{
         _this.$message({
            message: '本周预警-程序报错',
            type: "error",
            duration: 3000
          });
      })
      .finally(() => {
      });
    },
    /**
     * 获取自定义查询预警统计数据 
     */ 
    getCustomWarnStatics(){
      let _this=this;
      interf.GET_CUSTOM_ALARM({stime:this.selectParam.stime,etime:this.selectParam.etime}).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
              _this.warningStatics.customCount=data.data.ALARMMNUM;
            } else{
              _this.$message({
                message: data.errmsg,
                type: "error",
                duration: 1500
              });
            }
        }
      })
      .catch(err=>{
         _this.$message({
            message: '自定义查询报错',
            type: "error",
            duration: 3000
          });
      })
      .finally(() => {
      });
    },
    /**
     * 选择时间
     * @param type 1->今日 2->昨日 3->本周 4->自定义
     */
    selectTime(type){
      $('.tab').removeClass('active');
      if(type<4){
        this.selectParam.stime=type;this.selectParam.etime=null;
        $('.tab').eq(type-1).addClass('active');
        this.isCustom=false;
        this.timeRange='';
      }else{
        if(!this.timeRange || this.timeRange==''){
          this.$message({
            message: '开始日期和结束日期不能为空！',
            type: "warning",
            duration: 3000
          });
         return;
        };
        this.selectParam.stime=this.timeRange[0];
        if(new Date(this.timeRange[1]).getTime()==new Date(new Date().toLocaleDateString()).getTime()){
          this.timeRange[1]=this.timeRange[1].split(' ')[0]+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds();
        }
        this.selectParam.etime=this.timeRange[1];
        this.getCustomWarnStatics();
        this.isCustom=true;
      }
      blur.$emit('changeSelectTime',this.selectParam);
    },

    //  that.highlighted='';
    /*
    * 点击左侧的超速预警列表，显示对应的数据
    */
   showMapData(item){
     let that=this;
     that.highlighted=item.HPHM;
     that.clearMarker();
     this.addOverSpeedMarker(item);
    //  $('#'+item.HPHM+'_marker').trigger('click');
   },
    // 传递city参数
    showCity(row){
      blur.$emit('getCity',row.CODE);
      blur.$emit('getCitycar',row.CODE);
      blur.$emit('getCityhard',row.CODE);
    },
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
   },
   /**
  * 车辆实时预警 数据获取
  */
  getIndexData() {
    let that = this;
    that.clearMarker();
    interf.GET_OVER_WARN({}).then(response=>{
        if (response && response.status == 200){
          var data= response.data;
          if (data.errcode == 0) {
            if(data.data.length>0){
              
              that.trafficDatas=data.data.map(e=>{
                e.color=that.getColor(e.HPZL);
                return e;
              });
              // data.data.forEach(e=>{
              //   that.addOverSpeedMarker(e);
              // });
            }
          }else{
            that.$message({
              message: '重点车辆监测超速预警请求服务失败',
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
     * 展示超速预警点位
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
        that.clearMarker();
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
      span1.style.backgroundColor='#591A1A';
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
      span3.innerHTML='预警类型 :  ';
      span4.innerHTML=item.YJLX;
      d2.style.color = "#00C6FF";
      d2.appendChild(span3)
      d2.appendChild(span4)
      mainDiv.appendChild(d2);

      let d3= document.createElement('div');
      let span5= document.createElement('span'); 
      let span6= document.createElement('span'); 
      span5.innerHTML='预警时间 :  ';
      span5.style.color = "#00C6FF";
      span6.innerHTML=item.YJSJ;
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
      
      
      let popup= new minemap.Popup({closeOnClick: false, closeButton: false, offset: [8, -5]})
      .setLngLat(center)
      .setDOMContent(mainDiv).addTo(this.map);
      this.map_cover.popups.push(popup);

      let marker = new minemap.Marker(el, {offset: [-5,-5]}).setLngLat(center).addTo(this.map);
      this.map_cover.markers.push(marker);
    },
  //清除地图加载点、线、面、弹框
    clearMap(){
      //清除source
      // if(this.mapAddItems.sourceList.length>0){
      //   this.mapAddItems.sourceList.forEach(e=>{
      //     if(this.map.getSource(e)!=undefined){
      //       this.map.removeSource(e);
      //     }
      //   })
      // }
      //清除layer
      if(this.map_cover.lineList.length>0){
        this.map_cover.lineList.forEach(e=>{
          if(this.map.getLayer(e)!=undefined){
            this.map.removeLayer(e);
          }
        })
      }
      this.map_cover.lineList=[];
      //清除marker
      if(this.map_cover.markers.length>0){
        this.map_cover.markers.forEach(e=>{
          e.remove();
        })
      }
      this.map_cover.markers=[];
      //清除popup
      if(this.map_cover.popups.length>0){
        this.map_cover.popups.forEach(e=>{
          e.remove();
        })
      }
      this.map_cover.popups=[];
    },
    /**
     * 清除超速预警的点位
     */
    clearMarker(){
       //清除marker
      if(this.map_cover.markers.length>0){
        this.map_cover.markers.forEach(e=>{
          e.remove();
        })
      }
      this.map_cover.markers=[];
      //清除popup
      if(this.map_cover.popups.length>0){
        this.map_cover.popups.forEach(e=>{
          e.remove();
        })
      }
      this.map_cover.popups=[];
    },
    /**
     * 点击标签页
     */
    handleClick(){
      
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
    }
  },
  
};
</script>
<style scoped lang='scss'>
@import '@/assets/css/color.scss';
@mixin flex($direction,$justify,$align) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}

.vehicle_warning-div ul,li{
  margin: 0;
  padding:0;
}
//  .vehicle_warning-div {
//     position: absolute;
//     z-index: 10;
//     left: 12px;
//     width: 100%;
//     top: 1.5vh;
//     color:$color-white;
//     margin-bottom: 20px;
.vehicle_warning-div-query{
  color: $color-white;
  width: 95%;
  height: 3vh;
  line-height: 3vh;
  text-align: center;
  font-size: 0.8vw;
  margin: 3% auto;
  @include flex(row,center,center);
  &--label{
    width:15%;
    color:$color-text-label;
    display:inline-block;
    @include flex(row,center,center);
  }
  &--time{
    width:60%;
    display:inline-block;
    @include flex(row,center,center);
  }
  &--btn{
    width:25%;
    display:inline-block;
    @include flex(row,center,center);
  }
}
.center_table{
  padding:0 1vw;
  height: 32vh;
}
//   }
.vehicle_warning-div--top{
  width: 474px;
  height:auto;
  overflow: hidden;
  .title{
    display: flex;
    justify-content:space-between;
  }
  .tab{
    display: flex;
    justify-content:space-between;
    width: 95%;
    height:40px;
    line-height: 40px;
    margin: 15px auto;
    color: white;
    background-image: url(./image/tab_bg.png);
    background-size: 100% 100%;
    cursor: pointer;
    .img{
      flex:1
    }
    .label{
      flex:2;
    }
    .value{
      flex:2;
      text-align: center;
    }
    .radio{
      flex:3;
      font-size: 12px;
      >div{
        @include flex(row, start,flex-start);
        height:50%;
        width:100%;
        .img,.label,.value{
          @include flex(row, start,flex-start);
        }
        .img{
          width:10%;
          line-height: 20px;
          i{
            color:#8B8EA4;
            &:before{
              font-size: 14px;
            }
          }
        }
        .label{
          width:auto;
          align-items: start;
          font-style:italic;
          line-height: 20px;
        }
        .value{
          width: auto;
          font-size: 0.72917vw;
          margin-left: 5%;
          line-height: 20px;
        }
      }
      
    }
  }

  .tab.active{
    background-color: #3a8ee673;
  }
  .custom_tab{
    background-image: url(../../../static/images/ui_image/tab_bg.png);
    color: white;
    width: 95%;
    height:40px;
    line-height: 40px;
    margin: 15px auto;
    background-size: 100% 100%;
    &>span:nth-child(1){
      display:inline-block;
      width:90px;
      text-align: center;
    }
    &>span:nth-child(2){
      display:inline-block;
      width:60px;
      text-align: center;
    }
  }
  .custom_tab{
    background-image: url(../../../static/images/ui_image/tab_bg.png);
    color: white;
    &>span:nth-child(1){
      display:inline-block;
      width:200px;
      text-align: center;
    }
    &>span:nth-child(2){
      display:inline-block;
      width:60px;
      text-align: center;
    }
  }
}
.vehicle_warning-div--bottom{
    width:474px;
    height:720px;
    margin-top: 17px;
    overflow: hidden;
    padding:0 0.4vw;
    box-sizing: border-box;
}
.traffic-index_content_table{
  overflow-y: auto;
  height: 86%;
  padding:1vh 0.5vw;
  .index-item{
    width:418px;
    padding:10px 0;
    margin-top: 13px;
    margin-left: 1vw;
  }
  .itemselected{
    background-color: #0069a6;
  }
}
li:nth-of-type(odd){ 
  background-color:rgba(72,84,108,0.2);
}
.vehicle_warning-div li:hover{
  background-color:rgba(4,104,166,0.6);
}

.vehicle_warning-div .car-name{
  width:38px;
  height:22px;
  // background:rgba(89,26,26,1);
  border-radius:2px;
  // border: 1px solid #631415;
  margin-left: 12px;
  font-size:14px;
  font-family:Source Han Sans CN;
  font-weight:400;
  color:rgba(255,255,255,1);
  margin-right: 15px;
}
.vehicle_warning-div .per-hour{
  margin:0 0.4vw;
  font-size:14px;
  font-family:Source Han Sans CN;
  color:rgba(166,176,205,1);
}
.vehicle_warning-div .address-name{
  font-size:14px;
  font-family:Source Han Sans CN;
  color:rgba(166,176,205,1);
  display: flex;
  .road{
    flex: 8;
  }
  .timers{
    flex:2;
    text-align: right;
  }
}


</style>