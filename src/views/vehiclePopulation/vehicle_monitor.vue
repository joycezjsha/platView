<template>
  <div class="vehicle_monitor-div ">
    <div class='vehicle_monitor-div--top borstyle '>
      <div class='title'>
        <m-title label='车辆监测' style='width:6vw;'></m-title>
        <span style="margin-right:1.5vw;margin-top:1vh;color:#fff">
          <i class="iconfont icon-shijian" style='margin-right:1vw;'></i>{{time}}
        </span>
      </div>
      <m-tiptxt class="tiptxt" text='“活跃”是指：1小时内有被卡口监测到车辆'></m-tiptxt>
      <!-- <div class='right-time'><i class="iconfont icon-shijian" style='margin-right:1vw;'></i>{{time}}</div> -->
      <m-tab :isShowIcon="isShowIcon" label='实时监控车辆活跃数：' :value=countnum></m-tab>
      <div class='center_table'>
         <el-table @row-click="showCity"
         highlight-current-row
        @current-change="handleCurrentChange"
         v-loading='tableLoading'
         ref="table"
          :data="indexDatas" style="width: 100%" height="32vh" :default-sort = "{prop: 'proportion', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
            <el-table-column  type="index" label="No" width="50"></el-table-column>
            <el-table-column prop="NAME" label="类型"></el-table-column>
            <el-table-column prop="NUM" label="数量"  sortable></el-table-column>
            <el-table-column prop="proportion" label="比例"  sortable></el-table-column>
            <el-table-column prop="CODE" v-if='isShowCity'></el-table-column>
          </el-table>
      </div>
    </div>
    <div class='vehicle_monitor-div--bottom borstyle'>
      <m-title label='超速预警' style='width:8vw;'></m-title>
       <ul class="traffic-index_content_table">
         <!--    -->
          <li @click="showMapData(item)" 
          class="index-item"
          :class="{itemselected:highlighted==item.HPHM}"
          v-for="item in trafficDatas" :id="item.id" :key="item.id">
            <div style="margin-bottom:3px">
               <span class="car-name" :style="'color:rgba(255,255,255,1);background-color:'+item.color">{{item.HPZL}}</span>
               <span :style="'color:'+item.color">{{item.HPHM}}</span>
               <span class="per-hour">时速/限速:{{item.SJ}}</span>
               <span style="float: right;color:rgba(255,255,255,1);">{{item.WFSJ.split(" ")[0]}}</span>
            </div>
            <div class="address-name">
              <div class="road">{{item.WFDZ}}</div>
              <div class="timers">{{item.WFSJ.split(" ")[1]}}</div>
              <!-- <span>{{item.WFSJ}}</span> -->
            </div>
            <!-- <p  style="margin-bottom:3px">
            <span class="address-name">{{item.WFDZ}}</span>
            </p>         
            <div class="address-name time">{{item.WFSJ}}</div>           -->
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
import m_tab from '@/components/UI_el/tab.vue';
import m_tiptxt from '@/components/UI_el/tiptxt.vue';
import mTitle from '@/components/UI_el/title_com.vue';
import blur from '../../blur.js';
export default {
  name: "overview_left",
  data() {
    return {
      map: {},
      isShowCity:false,
      highlighted:'', //选中行高亮显示
      isShowIcon:false,
      tableLoading:false,
      map_cover:{
        sourceList:[],
        markers:[],
        lineList:[],
        popups:[]
      },
      time:'',
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
      selectItem:{"road":"西安",order:8}
    };
  },
  components:{mTab:m_tab,mTiptxt:m_tiptxt,mTitle},
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setZoom(11);
    this.map.repaint = true;
    that.getTimer();
    that.getIndexData();
    that.getData();
    that.getKeyVehicleDatas();
    that.timer=setInterval(() => {
      that.getIndexData();
      that.getKeyVehicleDatas();
      that.getTimer()
    },1000*60);

  },
  destroyed() {
    this.map.setPitch(0);
    // this.clearMap();
    if(this.timer){
      clearInterval(this.timer)
    }
  },
  methods: {
    /**
     * 接受传来的数据 
     */
    getData(){
      let that=this;
       blur.$on('goback',data=>{
         this.highlighted='';
       })
       blur.$on('hideOverSpeedMarker',data=>{
         if(data){
           that.getIndexData();
         }else{
           that.clearMap();
         }
       })
    },
    /**
     * 获取时间
     */
    getTimer(){
      let that = this;
      // let myDate=new Date();
      let h = new Date().getHours();//获取当前小时数(0-23)
      let m = new Date().getMinutes();//获取当前分钟数(0-59)
      // let s = new Date().getSeconds();//获取当前秒
      // if(s<10){
      //   s="0"+s;
      // }
      if(h<10) h="0"+h;
      if(m<10) m="0"+m;
      that.time=`${h}:${m}`;
    },
    //  that.highlighted='';
    /*
    * 点击左侧的超速预警列表，显示对应的数据
    */
   showMapData(item){
     let that=this;
     that.highlighted=item.HPHM;
     this.addOverSpeedMarker(item);
     $('#'+item.HPHM+'_marker').trigger('click');
   },
    // 传递city参数
    showCity(row){
      blur.$emit('getCity',row.CODE,row.NAME);
      blur.$emit('getCitycar',row.CODE);
      blur.$emit('getCityhard',row.CODE);
    },
    //重点车辆监测  KeyVehicle/getKeyVehicle   GET_KEY_VEHICLE_API 
    getKeyVehicleDatas(){
     let that = this;
     that.tableLoading = true;
     interf.GET_KEY_VEHICLE_API({}).then(response=>{
      that.tableLoading = false;
        if (response && response.status == 200){
          var data= response.data;
          if (data.errcode == 0) {
           that.countnum=data.data.countnum;
           that.indexDatas=data.data.list;
          }else{
            that.$message({
              message:'重点车辆监测',
              type: "error",
              duration: 1500
            });
            that.tableLoading = false;
          }
        }
      })
      .catch(err=>{
        console.log(err);
      })
      .finally(() => {
        that.tableLoading = false;
        blur.$on('getleft',data=>{
          // 取消table选中状态
          that.$refs.table.setCurrentRow()
        });
      });
    },
    //设置城市列表，选中行
    handleCurrentChange(val){
      this.currentRow = val;
    },
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
   },
    /* 重点车辆监测超速预警 KeyVehicle/getSpeeding   GET_OVER_WARN_FLOW_API  */
    getIndexData() {
    let that = this;
    that.clearMarker();
    that.trafficDatas=[];
    interf.GET_OVER_WARN_FLOW_API({}).then(response=>{
        if (response && response.status == 200){
          var data= response.data;
          if (data.errcode == 0) {
            // data.data=[{"XZQH":"610602","SJ":"76\\60","HPZL":"小型汽车","HPHM":"鲁R528HW","WFDZ":"303省道61公里700米至303省道67公里700米","WFSJ":"2020-06-03 00:00:00",WD:'33.79388',JD:'108.37161'}];
            if(data.data.length>0){
              that.trafficDatas=data.data;
              that.trafficDatas.map(e=>{
                e.color=that.getColor(e.HPZL);
                return e;
              });
              that.trafficDatas.forEach(e=>{
                that.addOverSpeedMarker(e);
              });
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
     * 根据车辆类型匹配颜色
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
    /**
     * 展示超速预警点位
     */
    addOverSpeedMarker(item){
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
      span3.innerHTML='时速/限速 :  ';
      span4.innerHTML=item.SJ;
      d2.style.color = "#00C6FF";
      d2.appendChild(span3)
      d2.appendChild(span4)
      mainDiv.appendChild(d2);

      let d3= document.createElement('div');
      let span5= document.createElement('span'); 
      let span6= document.createElement('span'); 
      span5.innerHTML='监测时间 :  ';
      span6.innerHTML=item.WFSJ;
      d3.fontFamily='Source Han Sans CN';
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
      
      
      let popup= new minemap.Popup({closeOnClick: true, closeButton: false, offset: [0, 0]})
      .setLngLat(center)
      .setDOMContent(mainDiv);
      this.map_cover.popups.push(popup);

      let marker = new minemap.Marker(el, {offset: [-5,-5]}).setLngLat(center).setPopup(popup).addTo(this.map);
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
      
    }
  }
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
.vehicle_monitor-div ul,li{
  margin: 0;
  padding:0;
}
//  .vehicle_monitor-div {
//     position: absolute;
//     z-index: 10;
//     left: 12px;
//     width: 100%;
//     top: 1.5vh;
//     color:$color-white;
//     margin-bottom: 20px;
.center_table{
  padding:0 1vw;
  height: 32vh;
}
//   }
.vehicle_monitor-div--top{
  width: 474px;
  height:459px;
  overflow: hidden;
  .title{
    display: flex;
    justify-content:space-between;
  }
}
.vehicle_monitor-div--bottom{
    width:474px;
    height:459px;
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
.vehicle_monitor-div li:hover{
  background-color:rgba(4,104,166,0.6);
}

.vehicle_monitor-div .car-name{
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
.vehicle_monitor-div .per-hour{
  margin:0 0.4vw;
  font-size:14px;
  font-family:Source Han Sans CN;
  color:rgba(166,176,205,1);
}
.vehicle_monitor-div .address-name{
  margin-left: 15px;
  font-size:14px;
  font-family:Source Han Sans CN;
  color:rgba(166,176,205,1);
  display: flex;
  .road{
    flex: 8;
  }
  .timers{
    flex:2
  }
}


</style>