<template>
  <div class="over_speed_index borstyle">
    <div class='over_speed_index--top'>
      <div class='tab active' @click='selectTime(1)'><div class='img'></div><div class="label">今日超速</div><div class='value'>{{warningStatics.tCount}}</div></div>
      <div class='tab' @click='selectTime(2)'><div class='img'></div><div class="label">昨日超速</div><div class='value'>{{warningStatics.yestoadyCount}}</div></div>
      <div class='tab' @click='selectTime(3)'><div class='img'></div><div class="label">本周超速</div><div class='value'>{{warningStatics.weekCount}}</div></div>
      <div class='over_speed_index-query'>
        <span class="over_speed_index-query--label">时间：</span><span class="over_speed_index-query--time">
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
          <span class="over_speed_index-query--btn" @click='selectTime(4)'><el-button type="primary" v-loading='queryLoading'>确定</el-button></span>
      </div>
      <div class='custom_tab' v-show='isCustom'><span>自定义</span><span>{{warningStatics.customCount}}</span></div>
    </div>
    
    <div class='over_speed_index--bottom'>
      
       <div class="_table">
          <el-table ref='cityTable'
            :data="overSpeedTableDatas"
            highlight-current-row
            v-loading="tableLoading"
            style="width: 100%"
            height="100%"
            :default-sort="{prop: 'NUM', order: 'descending'}"
            :row-style="getRowClass"
            :header-row-style="getRowClass"
            :header-cell-style="getRowClass"
            @row-click='handle'
          >
            <el-table-column type="index" label="No." width="50"></el-table-column>
            <el-table-column prop="CITYNAME" label="管理部门" width="90"></el-table-column>
            <el-table-column prop="YJWFNUM" label="超速预警次数" sortable></el-table-column>
            <el-table-column prop="LJNUM" label="拦截次数" sortable></el-table-column>
            <el-table-column prop="WFNUM" label="处罚次数" sortable></el-table-column>
            <el-table-column prop="RATIO" label="拦截率" sortable></el-table-column>
          </el-table>
        </div>
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
      queryLoading:false,
      currentRow:null, //选中行高亮显示
      isShowIcon:false,
      tableLoading:false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        // endDateDisabled(time){
        //   return time.getTime() > Date.now()
        // }
      },
      defaultTime:['00:00:00','00:00:00'],
      warningStatics:{tCount:'',yestoadyCount:'',weekCount:'',customCount:''},
      map_cover:{
        sourceList:[],
        markers:[],
        lineList:[],
        popups:[]
      },
      timeRange:'',
      timer:null,
      overSpeedTableDatas: [],
      selectParam:{stime:1,etime:null,xzqh:null,name:''},
      isCustom:false
    };
  },
  components:{mTab:m_tab,mTiptxt:m_tiptxt,mTitle},
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    that.getStaticsData(1,null,1);
    that.getStaticsData(2,null,1);
    that.getStaticsData(3,null,1);
    that.getIndexData();
    that.timer=setInterval(() => {
      that.getStaticsData(1,null,1);
      that.getStaticsData(3,null,1);
      that.getIndexData();
    },1000*60);
    blur.$on('return',()=>{
      // this.currentRow=null;
      that.$refs.cityTable.setCurrentRow(that.overSpeedTableDatas[null]);
    });
  },
  destroyed() {
    this.map.setPitch(0);
    if(this.timer){
      clearInterval(this.timer)
    }
  },
  methods: {
    /**
     * 获取今日、昨日、本周、自定义超速统计数据
     * @param stime 1->今日 2->昨日 3->本周 yyyy-mm-dd hh:mm:ss->自定义
     */
    getStaticsData(stime,etime,f){
      let _this=this;
      let param={stime:stime};
      if(etime){
        param.etime=etime;
      }
      if(f){
        param.c_flag=f;
      }
      interf.GET_OVER_SPEED_BY_TIME(param).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
              let type=response.config.params.stime;
              if(type==1) _this.warningStatics.tCount=data.data.NUM;
              else if(type==2) _this.warningStatics.yestoadyCount=data.data.NUM;
              else if(type==3) _this.warningStatics.weekCount=data.data.NUM;
              else _this.warningStatics.customCount=data.data.NUM;
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
        this.selectParam.stime=this.timeRange[0];
        if(new Date(this.timeRange[1]).getTime()==new Date(new Date().toLocaleDateString()).getTime()){
          this.timeRange[1]=this.timeRange[1].split(' ')[0]+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds();
        }
        this.selectParam.etime=this.timeRange[1];
        this.getStaticsData(this.selectParam.stime,this.selectParam.etime);
        this.isCustom=true;
      }
      blur.$emit('changeParam',this.selectParam);
      blur.$emit('changeParamTimeAndXzqh',this.selectParam);
      this.getIndexData();
    },
    /**
     * 表格点击事件
     */
    handle(row, event, column){
      this.centerTo(row.JWD.split(' '));
      let data={};
      this.selectParam.name=row.CITYNAME;
      this.selectParam.xzqh=row.XZQH;
      blur.$emit('changeParam',this.selectParam);
      blur.$emit('changeParamTimeAndXzqh',this.selectParam);
    },
    /**
     * 地图移动到点击城市市中心
    */
    centerTo(center){
      this.map.flyTo({
              center: center,
              zoom: 8,
              bearing: 10,
              pitch: 0,
              duration: 2000
          });
    },
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
   },
   /**
  * 超速分析列表 数据获取
  */
  getIndexData() {
    let that = this;
    let param={stime:this.selectParam.stime,c_flag:1};
    if(this.selectParam.etime) param.etime=this.selectParam.etime;
    interf.GET_OVER_TABLE(param).then(response=>{
        if (response && response.status == 200){
          var data= response.data;
          if (data.errcode == 0) {
            if(data.data.length>0){
              that.overSpeedTableDatas=data.data;
            }
          }else{
            that.$message({
              message: '城市超速分析列表服务请求失败！',
              type: "error",
              duration: 2500
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
        case '小型轿车' :color='#16c5ff';break;
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
.over_speed_index{
  position:fixed;
  top:99px;
  left:12px;
  width:474px;
  height:977px;
}
.over_speed_index-query{
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
//   }
.over_speed_index--top{
  width: 474px;
  height:auto;
  overflow: hidden;
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
      flex:3
    }
    .value{
      flex:3;
      text-align: center;
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
}
.over_speed_index--bottom{
    width:474px;
    height:708px;
    overflow: hidden;
    padding:0 0.4vw;
    box-sizing: border-box;
    ._table{
      width:100%;
      height:100%;
    }
}


.over_speed_index .car-name{
  width:38px;
  height:22px;
  background:rgba(89,26,26,1);
  border-radius:2px;
  border: 1px solid #631415;
  margin-left: 12px;
  font-size:14px;
  font-family:Source Han Sans CN;
  font-weight:400;
  color:rgba(255,255,255,1);
  margin-right: 15px;
}
.over_speed_index .per-hour{
  margin:0 0.4vw;
  font-size:14px;
  font-family:Source Han Sans CN;
  color:rgba(166,176,205,1);
}
.over_speed_index .address-name{
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