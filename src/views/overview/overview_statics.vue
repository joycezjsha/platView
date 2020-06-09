<template>
  <div class="overview-statics">
   <div class='overview-statics--tab'>
     <div class='overview-statics--tab_title'><span>今日警情</span><span>{{datas.jq.count}}</span>起</div>
     <div class='overview-statics--tab_radio'>
       <div><span class='label'>昨日:</span><span class='value'>{{datas.jq.yestoday}}</span></div>
       <div><span class='label'>历史日均:</span><span class='value'>{{datas.jq.history}}</span></div>
    </div>
     <div class='overview-statics--tab_main'><span class='img'><i class='iconfont icon-shigu'></i></span><span class='label'>重大警情:</span><span class='value'>{{datas.jq.main}}</span>起</div>
   </div>
   <div class='overview-statics--tab' >
     <div class='overview-statics--tab_title'><span>本月事故</span><span>{{datas.sg.count}}</span>起</div>
     <div class='overview-statics--tab_radio'>
       <div><span class='label'>伤:</span><span class='value'>{{datas.sg.hurt}}</span></div>
       <div><span class='label'>死亡:</span><span class='value'>{{datas.sg.die}}</span></div>
    </div>
     <div class='overview-statics--tab_main'><span class='img'><i class='iconfont icon-jingqing'></i></span><span class='label'>重大事故:</span><span class='value'>{{datas.sg.main}}</span>起</div>
   </div>
    <div class='overview-statics--tab'  >
     <div class='overview-statics--tab_title'><span>活跃电警</span><span>{{datas.dj.count}}</span>个</div>
     <div class='overview-statics--tab_radio'>
       <div><span class='label'>总设备:</span><span class='value'>{{datas.dj.sum}}</span></div>
       <div><span class='label'>活跃率:</span><span class='value'>{{datas.dj.work}}</span></div>
    </div>
     <div class='overview-statics--tab_main_'><span class='label'>重点设备活跃率:</span><span class='value'>{{datas.sg.main}}</span>个</div>
   </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";

export default {
  name: "overview_statics",
  data() {
    return {
      map: {},
      // map: commonVariable.CURRENT_MAP,
      citymapDatas:[],
      datas:{
        jq:{count:13512,history:'+123',yestoday:'-122',main:'2'},
        sg:{count:13512,hurt:'123',die:'3',main:'0'},
        dj:{count:11512,sum:'12377',work:'67%',main:'100%'}
      },
      warn_img:IMG.warningInstanceIMG,
      accident_img:IMG.accidentIMG
    };
  },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.map.repaint = true;
    that.getIndexData();
  },
  destroyed() {
    this.map.setPitch(0);
  },
  methods: {
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
                return "background:transparent;";
   },
    //获取巡航数据
    getIndexData() {
      let that = this;
    // 在地图上显示城市流动数据
    // 总览页面地图城市流动数据 Overview/getMapVehicleIn  GET_MAP_CITY_FLOW_API
    interf.GET_MAP_CITY_FLOW_API({
        id:"",
      })
      .then(response=>{
        if (response && response.status == 200){
          var data= response.data;
          // console.log(data)
          if (data.errcode == 0) {
            that.citymapDatas=data.data;
            console.log(that.citymapDatas)
            for(var item of that.citymapDatas){
            // console.log(item,item.addIn,item.city,item.latitude,item.longitude)
            }
            let mainDiv = $("<div style='border:1px solid #9A9A9A;height:33px;width:80px'></div>");
            let leftimgDiv = $("<div class='tpi' style='width:20px;height:22px;text-align: center;float:left;background:" + curTpiColor + ";color:#2c3453;></div>");
            let topSpan = $("<span style='font-weight: bold;font-size: 16px;margin-bottom: 8px;font-family: \"Microsoft YaHei\";'>"+item.city+"</span>");
            let bottomSpan=$("<span style='font-weight: bold;font-size: 16px;margin-bottom: 8px;font-family: \"Microsoft YaHei\";'>" +item.addIn+"</span>");
            bottomSpan.append(topSpan);
            bottomSpan.append(leftimgDiv);
            mainDiv.append(bottomSpan);
          
            let pointPopup = new minemap.Popup({
              closeOnClick: false, 
              offset: [0, 0], 
              closeButton: false
            }) 
            pointPopup.setLngLat().setDOMContent(mainDiv[0]);
            // pointPopup.addTo(commonVariable.CURRENT_MAP);
            // commonVariable.MAP_POPUP_OVERALL_ARRAY[item.areaId] = pointPopup;
            $(".minemap-popup-content").css("padding", "0");
            $(".minemap-popup-tip").css("border-top-color", "#2c3453");
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
    // $.ajax({
    //     url: "./static/json/city_accident_data.json", //globals.CRUISE_ALL_INFO_URL,
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded"
    //     },
    //     responseType: "json",
    //     method: "get",
    //     dataType: "json",
    //     data: {
    //       // token: window.localStorage.getItem("loginUserToken")
    //     },
    //     success: function(data) {
    //       if (data.errcode == -2) {
    //         that.$router.push({ name: "/login" });
    //       }
    //       if (data.errmsg == "success" && data.data.length > 0) {
    //         let datas=[];
    //         data.data.map(e=>{
    //           datas.push(
    //             {"city":e.areaName,"index":Math.round(e.areaTpi)*10/100,"week_radio":"+0.3%","his_radio":"-0.1%"}
    //           )
    //         });
    //         that.indexDatas=datas;
    //       }
    //     },
    //     error: function(XMLHttpRequest, textStatus, errorThrown) {
    //       debugger
    //     }
    //   });
    },
  /**
   * 点击标签页
   */
  handleClick(){
    
  }
  }
};
</script>
<style scope lang='scss'>
@import '@/assets/css/color.scss';
@mixin flex($direction,$justify,$align) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}

.overview-statics {
  position: absolute;
  z-index: 10;
  left: 30vw;
  width: 35vw;
  height: 12vh;
  top: 10vh;
  color:$color-white;
  // border-image: linear-gradient(-51deg,#19559a, #02082f);
  // background-image: linear-gradient(#033a79cf, #02082fde);
  background: url('./image/center_bg.png') no-repeat;
    background-size: 100% 100%;
  @include flex(row, center,center);
  &--tab{
    width:10vw;
    height:10vh;
    // border:1px solid $color-text-sub;
    border-right: 1px solid #02082f;
    // border-image: linear-gradient(#063672,#ffffff,#063672);
    padding: 2%;
     @include flex(column, center,center);
     >div{
       @include flex(row, center,center);
       width:100%;
       height:30%;
       >div{
          @include flex(row, center,center);
          span{
            display:inline-block;
            font-size:0.7vw;
          }
       }
      
       span.label{
            color:$color-label;
          }
          span.value{
            font-family: Hiragino Sans GB;
          }
     }
    &_title{
      span{
        width: 50%;
        @include flex(column, center,center);
      }
      span:nth-child(2){
        font-family: 'DS-Digital-BoldItalic';
        width: 40%;
        font-size: 1.5vw;
        color: #409EFF;
        margin-bottom: 0.3vw;
      }
    }
    &_radio{
      >div{
        width: 50%;
        @include flex(column, center,center);
      }
    }
    &_main{
      span{
        @include flex(column, center,center);
      }
      span.img{
        width:20%;
      }
      span.label{
        width:60%;
        align-items: start;
      }
      span.value{
        width:10%;
      }
    }
    &_main_{
      span.label{
        width:80%;
      }
      span.value{
        width:10%;
      }
    }
  }
  &--tab:last-child{border:none;} 
}
</style>