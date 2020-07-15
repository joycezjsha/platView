<template>
  <div class="traffic-index-div">
    <div class="traffic-index_container boxstyle">
      <div class="traffic-index_title">
        <m-title label='境内高速路及主干道路况' img_type=1 class='title'></m-title>
      </div>
      <m-tab :isShowIcon="isShowIcon" label='当前选择范围' :value='selectItem.road' style='width:90%;margin:0 auto;'></m-tab>
      <div class="traffic-index_content">
        <ul class="traffic-index_content_table">
          <li class="index-item" v-for="(item,index) in indexDatas" :id="item.id" :key="item.id">
            <p><span>{{++index}}</span><span>{{item.roadname}}</span>
            <span class="address-name">{{item.stratname}}--->{{item.endname}}</span>
            </p>
            <p><span>平均速度：<span class='value'>{{item.sd}}km/h</span></span>
            <span>路长<span class='value'>{{item.cd}}km</span></span>
            </p>
          </li>
        </ul>
      </div>
      <!-- <traffic-index-charts v-show='isShowCharts'></traffic-index-charts> -->
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import mTitle from "@/components/UI_el/title_com.vue";
import mTab from '@/components/UI_el/tab.vue'
// import TrafficIndexCharts from './TrafficIndexCharts.vue'
export default {
  name: "TIndex",
  data() {
    return {
      map: {},
      indexDatas: [],
      selectItem:{"road":"全省",order:8},
      isShowCharts:true,
      isShowIcon:false,
      interval:null
    };
  },
  components: {
    mTitle,mTab
  },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.getRoadIndexData();
    this.interval=setInterval(()=>{
      that.getRoadIndexData();
    },1000*60)
  },
  destroyed() {
    if(this.interval){
      clearInterval(this.interval);
    }
  },
  methods: {
    /**
     * 获取高速路及主干道拥堵排名
     */
    getRoadIndexData() {
      let that = this;
       interf.GET_ROAD_TAFFIC_ORDER_API({}).then(response=>{
        if (response && response.status == 200){
          var data= response.data;
          if (data.errcode == 0) {
            that.indexDatas=data.data;
            data.data.forEach(e=>{
              that.addCityMarker(e);
            })
          }else{
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
    setSelectItems(name,id){
      this.selectItem.road=name;
    },
        /**
     * 初始化城市拥堵排名列表
     */
    getRoadIndexData(){
      let that=this;
      interf.GET_ROAD_TAFFIC_ORDER_API({})
      .then(response=>{
        if (response && response.status == 200){
          var data= response.data;
          if (data.errcode == 0) {
            that.indexDatas=data.data;
          }else{
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
  }
}
</script>
<style scope lang='scss'>
@import '@/assets/css/color.scss';
@mixin flex($direction, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.traffic-index-div {
  position: fixed;
  z-index: 10;
  right: 13px;
  width: 474px;
  height: 1026px;
  top: 9vh;
  .traffic-index_container {
    width: 100%;
    height: 100%;
    .traffic-index_title{
      position: relative;
      width: 100%;
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
      .title{
        width:220px;
        height:4vh;
        line-height: 4vh;
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
  .traffic-index_content {
    width: 95%;
    height: 85%;
    background-color: $color-bg-1;
    margin: 1%;
    
    &_table {
      color: $color-white;
      margin: 0;
      padding: 23px 5% 2% 5%;
      width: 90%;
      height: 80%;
      overflow-y: auto;
      .index-item{
        padding:10px 0 5px 0;
        >p:nth-child(1){
          margin:0px;
          @include flex(row,center,center);
          >span{
            font-size: 14px;
            @include flex(row,center,center)
          }
          >span:nth-child(1){
            width:15%;
          }
          >span:nth-child(2){
            width:30%;
             @include flex(row,start,start)
          }
          >span:nth-child(3){
            width:55%;
            @include flex(row,flex-end,center);
          }
        }
        >p:nth-child(2){
          margin:0px;
          color: $color-text-label;
          font-size: 0.8vw;
          @include flex(row,center,center);
          >span{
            font-size: 14px;
            @include flex(row,center,center)
          }
          >span:nth-child(1){
            margin-left:15%;
            width:45%;
            @include flex(row,start,start)
          }
          >span:nth-child(2){
            width:40%;
            @include flex(row,flex-end,center);
          }
        }
        span.address-name{
          color:$color-info;
        }
        span.value{
          color:$color-text-value;
        }
      }
      .index-item:nth-child(odd){
        background-color: rgba(72,84,108,0.2);
      }
    }
    
  }
}
}

</style>