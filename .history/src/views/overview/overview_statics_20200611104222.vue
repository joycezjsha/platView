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
      interf.GET_DEV_STATICS_API({})
      .then(response=>{
        if (response && response.status == 200){
          let data= response.data;
          console.log(data)
          if (data.errcode == 0){
           if(data.data.length>0){
             
           }
          }
        }

      })
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
  left: 28vw;
  width: 835px;
  height: 147px;
  top: 8vh;
  color:$color-white;
  // border-image: linear-gradient(-51deg,#19559a, #02082f);
  // background-image: linear-gradient(#033a79cf, #02082fde);
  background: url('./image/center_bg.png') no-repeat;
    background-size: 100% 100%;
  @include flex(row, center,center);
  &--tab{
    width:33%;
    height:10vh;
    border-right: 1px solid;
    border-image: linear-gradient(rgba(0,255,255,0), #27345b 20%, #2f4162 80%, rgba(236, 239, 239, 0)) 1;
    padding: 2% 5%;
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
            color:$color-text-label;
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
        color: $color-primary;
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
        width:40%;
        align-items: start;
      }
      span.value{
        width:30%;
        color:$color-red;
      }
    }
    &_main_{
      span.label{
        width:65%;
      }
      span.value{
        width:10%;
        color:$color-primary;
      }
    }
  }
  &--tab:last-child{border:none;} 
}
</style>