<template>
  <div class="city-index-div carflow">
    <div class="city-index_container boxstyle">
      <div class="city-index_title">
        <m-title label='全省流动情况' img_type=1 style='width:100%;height:4vh;line-height:4vh;width:7vw;'></m-title>
      </div>
      <div class="car-flow_content" >
        <el-tabs v-model="activeName" @tab-click="handleClick" style="padding:0 0.5vw;" >
          <el-tab-pane label="实时" name="1"></el-tab-pane>
          <el-tab-pane label="今天" name="2"></el-tab-pane>
          <el-tab-pane label="昨天" name="3"></el-tab-pane>
          <el-tab-pane label="自定义" name="4"></el-tab-pane>
        </el-tabs>
        
        <!-- <m-tiptxt :text='tipTxt[activeName]' v-else></m-tiptxt> -->
        <!-- <div style="color:#8d98b4;margin:0.4vh 2vw;" v-if="activeName==1">实时：统计上一个小时
          <span>({{realtimer1}}:00-{{realtimer2}}:00)</span>的流动情况
        </div> -->
        <!-- <div style="color:#8d98b4;margin:0.4vh 2vw;" v-if="activeName==2">今天：统计上今天(00:00-16:00)的流动情况
        </div>
        <div style="color:#8d98b4;margin:0.4vh 2vw;" v-if="activeName==3">昨天：统计上昨天全天的流动情况
        </div> -->
        <m-tiptxt class='tiptxt' v-if="activeName==1" :text="'实时：统计上6个小时('+realtimer1+':00-'+realtimer2+':00)'" :isShowIcon='isShowIcon'></m-tiptxt>
        
        <m-tiptxt class='tiptxt' v-if="activeName==2" :text="'今天：统计今天(00:00-'+realtimer2+':00)的流动情况'" :isShowIcon='isShowIcon'></m-tiptxt>
        
        <m-tiptxt class='tiptxt' v-if="activeName==3" :text="'昨天：统计昨天全天的流动情况'" :isShowIcon='isShowIcon'></m-tiptxt>
        <div class='car-table-query' v-if="activeName=='4'">
          <span class='car-table-query--label'>时间：</span><span class="car-table-query--time">
              <el-date-picker width="100%"
                value-format="yyyyMMdd"
                v-model="timeRange"
                :picker-options="pickerOptions"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                >
              </el-date-picker>
          </span>
          <span class="car-table-query--btn">
            <el-button type="primary" @click="determine">确定</el-button>
          </span>
        </div>
        <div class='all_statics'>
          <div><span>陕西省</span><span>+{{allStatics.addIn}}</span></div>
          <div style="font-family:Source Han Sans CN;"><span>进入：+{{allStatics.incount}}</span>
          <span >流出：-{{allStatics.outcount}}</span></div>
          <div style="font-family:Source Han Sans CN;"><span>进出比</span><span>{{allStatics.inoutProportion.toFixed(2)}}</span></div>
        </div>
        <div class="sort">
          <div class="text">排序方式 ：</div>
          <div class="dropdown">
            <el-select v-if="flowDatas" @change='orderChange' v-model="orderType" >
               <el-option
                v-for="item in typeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span @click="sort" class='sort_img'>              
              <i style="font-size:20px;" v-show="downIcon" class='iconfont icon-paixu3'></i>
              <i style="font-size:20px;"  v-show="!downIcon" class='iconfont icon-paixu1'></i>
            </span>
          </div>
        </div>
        <ul v-if="flowDatas"  :class="activeName=='4'?'car-flow_content_table car-flow_content_table-':'car-flow_content_table'">
          <!--   class="item"  -->
          <li 
          @click="showData(item)" 
          class="item"
          :class="{itemselected:highlighted==item.city}"
          v-for="(item,index) in flowDatas" :key="item.id">
            <p>
              <span>{{index+1}}</span>
              <span  class="address-name">{{item.city}}</span>
              <span style="margin-left:1.8vw" >进：{{item.inNum}}</span>
              <span style="margin-left:0.5vw">出：{{item.outNum}}</span>
              <span>进出比：{{item.proportion}}%</span>
            </p>
            <p>
              <span></span>
              <span  class="address-name">保有量：<span style="color:#00a6fb" class='value'>{{item.inventory}}</span></span>
              <span>流动变化：
                <span  
                :class="item.addIn>0?'up_value':'down_value'">{{item.addIn}}辆</span></span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import blur from '../../blur.js';
import mTitle from "@/components/UI_el/title_com.vue";
import mTiptxt from '@/components/UI_el/tiptxt.vue'
export default {
  name: "car_table",
  data() {
    return {
      orderType:'4',
      highlighted:'',  //选中行高亮显示
      downIcon: true,  //排序切换
      showCity:false,
      xzqh:'',
      fxlx:'1',
      realtimer1:'',
      realtimer2:'',
      timer:null,//定时器
      stime:'1',
      map: {},
      date1: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
      flowDatas: [],
      typeOption:[
        {label:'进入辆次',value:'0'},
        {label:'流出辆次',value:'1'},
        {label:'进出比',value:'2'},
        {label:'保有量',value:'3'},
        {label:'流动变化',value:'4'}
      ],
      activeName:'1',
      selectItem:{"city":"西安",order:8},
      areaColors:["#556B2F","#00FFFF","#0000EE","#8A2BE2","#c48f58","#9fcac4","#5ad2a0","#f18a52","#656bd4","#7ca0cd","#88b7dc","#a08bd3","#be7fcd","#30a2c4","#c0ccd7","#dbddab","#9cd076","#69b38b","#437fb9","rgb(255, 143, 109)"],
      mapAddItems:{
        polygons:[],
        sourceList:[],
        lineList:[],
        popups:[]
      },
      timeRange:'',
      tipTxt:{
        1:'实时：统计上一个小时(15:00-16:00)的流动情况',
        2:'今天：统计上今天(00:00-16:00)的流动情况',
        3:'昨天：统计上昨天全天的流动情况'
      },
      allStatics:{
        incount:'',
        outcount:'',
        addIn:'',
        inoutProportion:0
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        // //修改给定日期的样式
				// 	cellClassName(time){
				// 		if(containerVue.notWriteDaily.includes(containerVue.getLocalTimes(time.getTime()))){
				// 			return 'red';
				// 		}
        // 	}
        // 其他时间
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
      isShowIcon:false
    };
  },
  components:{mTitle,mTiptxt},
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.repaint = true;
    that.getIndexData();
    that.getData();
    that.realtimeData(that.stime);
    that.getRealTimer();
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
    if(this.timer){
      // 清除定时器
      clearInterval(this.timer)
    }
  },
  methods: {
    /**
    * 实时的时间显示
    */
    getRealTimer(){
      let that = this;
      that.realtimer1=new Date().getHours() - 6;
      that.realtimer2=new Date().getHours();
      that.timer=setInterval(()=>{
        that.realtimer1=new Date().getHours() - 1;
        that.realtimer2=new Date().getHours();
      },1000*60*60)
      
    },
    /**
     * 接受右侧列表传来的数据
     */
    getData(){
      let that = this;
      blur.$on('back',data=>{
        // that.activeName='1';
        that.highlighted='';
        that.stime='1';
        that.xzqh='';
        // that.getIndexData();
        // that.realtimeData(that.stime)
      })
    },
    
    /**
     * 切换排序方式
     */
    orderChange(){
      switch(this.orderType){
        case '0':this.flowDatas=this.flowDatas.sort((a,b)=>{return b.inNum -a.inNum});break;
        case '1':this.flowDatas=this.flowDatas.sort((a,b)=>{return b.outNum -a.outNum});break;
        case '2':this.flowDatas=this.flowDatas.sort((a,b)=>{return b.proportion -a.proportion});break;
        case '3':this.flowDatas=this.flowDatas.sort((a,b)=>{return b.inventory -a.inventory});break;
        case '4':this.flowDatas=this.flowDatas.sort((a,b)=>{return b.addIn -a.addIn});break;
        default:break;
      }
    },
   /**
    *  切换正序和倒序
    */  
    sort() {
     this.downIcon = !this.downIcon;
     this.flowDatas.reverse();
    }, 
    /**
    *   showData() 列表中的每一项
    */
    showData(item){
      let that = this;
      // 车辆类型分析
      blur.$emit("paramxzqh",item.xzqh.toString(),item.city);
      that.xzqh=item.xzqh.toString();
      that.city=item.city;
      that.highlighted=item.city;
      that.map.flyTo({
            center: item.jwd.split(' '),
            // zoom: 10,
            bearing: 10,
            pitch: 0,
            duration: 2000
        });
    },
    /*
    *  全省流动情况  默认显示实时的数据   
    */  
    realtimeData(type){
      let that = this;
      that.flowDatas=[];
      let param={};
      if(type!='4'){
        param.stime=type;
      }
      if(type=='4'){
         param.stime=that.timeRange[0],
         param.etime=that.timeRange[1]
      }
       interf.GET_VEH_FLOW_API(param)
      .then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
             that.allStatics.incount=data.data.incount;
             that.allStatics.outcount=data.data.outcount;
             that.allStatics.addIn=data.data.addIn;
             that.allStatics.inoutProportion=data.data.inoutProportion;
             var obj=data.data.data;
             if((JSON.stringify(obj)=='{}')==false){
                for(var key in obj){
                  obj[key].city=key
                  that.flowDatas.push(obj[key])
                }
              }else{
                  that.flowDatas=[];
              }
              that.orderChange();
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
        blur.$on('setCurrentCity',data=>{
          // 点击地图左侧table变为选中状态
          that.highlighted=data.name;
          // 调用右侧统计区的方法
          blur.$emit('getRight',data)
        })
      });
    },
    /*
    * 日期选择获取的数据
    */ 
    determine(){
       let that = this;
       that.xzqh='';
       if(!that.timeRange || that.timeRange==''){
         that.$message({
            message: '开始日期和结束日期不能为空！',
            type: "error",
            duration: 3000
          });
         return;
       }else{
        blur.$emit("determine",that.timeRange); //发送时间格式20200505
        blur.$emit("determinecar",that.timeRange); //发送中间地图
        blur.$emit("determineIndex",that.timeRange); //发送总组件中
        that.realtimeData(that.activeName);
        let time1=(that.timeRange[0].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"))+' '+'00:00:00';
        let time2=(that.timeRange[1].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"))+' '+'23:59:59';
        let timeData={
          time1,
          time2
        }
        blur.$emit("sendTime",timeData) //发送时间格式  2020-06-10 23:59:59
       }
      //  清空选择的时间
      // setTimeout(()=>{
      //   that.timeRange= undefined;
      // },2000)
    },
    getIndexData(){
     let that = this;
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
    /**
    *  点击左上角的时间选择对应的时间
    */
    handleClick(item){ 
     let that = this;
     that.highlighted='';
     that.activeName=item.name;  //对应的时间1  2  3  4
     blur.$emit('gettime',that.activeName)   //传入对应的时间 1  2  3  4
     blur.$emit('gettimecar',that.activeName)
     if(that.activeName!='4'){
        blur.$emit('gettimecar',that.activeName);  //传入对应的时间 1  2  3  4
        blur.$emit('gettimeIndex',that.activeName) //传给总组件中
        that.realtimeData(that.activeName);
     }else{
       that.timeRange= undefined;
       that.allStatics={
        incount:'',
        outcount:'',
        addIn:'',
        inoutProportion:0
       }
       that.flowDatas=[];
     }
    }

  }
};
</script>
<style scoped lang='scss'>
@import '@/assets/css/color.scss';
@mixin flex($direction, $justify, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.city-index-div {
  position: absolute;
  z-index: 10;
  left: 12px;
  width:474px;
  height:977px;
  top: 9vh;
}
.city-index-div .city-index_container {
  width: 100%;
  height: 100%;
  .city-index_title{
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
    padding: 2px 2% 0 2%;
    font-weight: bolder;
    }
    .all_statics{
      color:$color-white;
      width: 100%;
      height: 7vh;
      line-height: 3vh;
      text-align: center;
     
     @include flex(row,center);
     >div{
       width:30%;
       @include flex(column,center);
       font-family:Source Han Sans CN;
       font-style:italic;
     }
     >div:nth-child(2){
       span:nth-child(1){
         color: $color-yellow;
          font-family:Source Han Sans CN;
          font-style:italic;
       }
       span:nth-child(2){
         color: #00b8a8;
          font-family:Source Han Sans CN;
          font-style:italic;
       }
     }
    }
  .car-flow_content {
    width: 98%;
    height: 100%;
    background-color: $color-bg-1;
    margin: 1%;
    .car-table-query{
      color: $color-white;
      width: 100%;
      height: 3vh;
      line-height: 3vh;
      text-align: center;
      font-size: 0.8vw;
      margin: 2% 0;
      @include flex(row,center);
      &--label{
        width:15%;
        color:$color-label;
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
    .tiptxt{
      padding:0 10px;
    }
    &_table {
      overflow-y: auto;
      color:white;
      padding: 1px 7px;
      height: 92%;
      .item{
        // border-bottom: 1px solid $color-white;
        box-sizing: border-box;
        // padding-right: 0.7vw;
        // padding-top:0.5vh;
        // padding:0.5vh 0.7vw 0.5vh 0;
        line-height: 1em;
        margin: 0 1%;
        cursor: pointer;
        // height:6.8vh;
        p{
          margin:0;
        }
        >p:nth-child(1){
          padding-top:0.5vh;
          @include flex(row,center,center);
          >span{
            @include flex(row,center,center);
          }
          >span:nth-child(1){
            width:8%;
          }
          >span:nth-child(2){
            width:15%;
          }
          >span:nth-child(3){
            width:20%;
            color: $color-info;
            
          }
          >span:nth-child(4){
            width:20%;
            color: $color-info;
          }
          >span:nth-child(5){
            width:30%;
            color: $color-info;
            padding-right:3px;
            @include flex(row,flex-end,center);
          }
        }
        >p:nth-child(2){
          color: $color-info;
          font-size:0.8vw;
          padding:1.2vh 0 ;
          @include flex(row,center,center);
          >span{
            @include flex(row,flex-end,center);
          }
          >span:nth-child(1){
            width:8%;
          }
          >span:nth-child(2){
            width:51%;
            @include flex(row,flex-start,center);
            // margin-left:-7.39583vw
          }
          >span:nth-child(3){
            width:40%;
          }
          span.value{
            color: $color-primary;
          }
          span.up_value{
            color: $color-yellow;
          }
          span.down_value{
            color: $color-active;
          }
        }
      }
      .item:hover{
        background-color: $color-list_bg;
      }
      .itemselected{
        background-color: #0069a6;
      }
    }
    &_table- {
      height: 77%;
    }
  }
}
.carflow .sort{
  height: 4vh;
  width: 95%;
  display: flex;
  margin: 15px auto;
  .text{
    height: 4vh;
    font-size: 16px;
    color: #a6afcd;
    line-height: 4vh;
  }
  .dropdown{
    width: 120px;
    margin-left: 3px;
    display: flex;
  }
  .sort_img{width:30px;height:28px;color:#00C6FF;margin-left:15px;padding-top:3px;cursor:pointer;}
}
.carflow li:nth-of-type(odd){ 
  background:rgba(72,84,108,0.2);
  height: 58px;
  padding:0.5vh 0.7vw 0.5vh 0;
}
.carflow li:nth-of-type(even){ 
  height: 74px;
  padding:1.2vh 0.7vw 0.7vh 0;
}
</style>
<style lang='scss'>
.car-flow_content {
  .el-tabs__nav{width:100%;}
  .el-tabs__item{
    width:25%;
    text-align:center;
  }
}
.dropdown{
  .el-input__inner{
    width: 124px;
    height: 32px;
    border: 1px solid #27438B;
    border-radius: 0;
  }
}
</style>