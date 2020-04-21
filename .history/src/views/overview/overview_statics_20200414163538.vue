<template>
  <div class="overview-statics">
   <div class='overview-statics--tab'>
     <div><el-button>今日警情</el-button><span></span>{{datas.jq.count}}起</div>
     <div>
       <div><span class='label'>昨日:</span><span class='value'>{{datas.jq.yestoday}}</span></div>
       <div><span class='label'>历史日均:</span><span class='value'>{{datas.jq.history}}</span></div>
    </div>
     <div><span class='label'>重大警情</span><span class='value'>{{datas.jq.main}}</span>起</div>
   </div>
   <div class='overview-statics--tab'>
     <div><el-button>本月事故</el-button><span></span>{{datas.sg.count}}起</div>
     <div>
       <div><span class='label'>伤:</span><span class='value'>{{datas.sg.hurt}}</span></div>
       <div><span class='label'>死亡:</span><span class='value'>{{datas.sg.die}}</span></div>
    </div>
     <div><span class='label'>重大事故:</span><span class='value'>{{datas.sg.main}}</span>起</div>
   </div>
    <div class='overview-statics--tab'>
     <div><el-button>活跃电警</el-button><span></span>{{datas.dj.count}}个</div>
     <div>
       <div><span class='label'>总设备:</span><span class='value'>{{datas.dj.sum}}</span></div>
       <div><span class='label'>活跃率:</span><span class='value'>{{datas.dj.work}}</span></div>
    </div>
     <div><span class='label'>重点设备活跃率:</span><span class='value'>{{datas.sg.main}}</span></div>
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
        dj:{count:11512,sum:'12377777',work:'67%',main:'100%'}
      }
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
  width: 30vw;
  height: 10vh;
  top: 10vh;
  color:$color-white;
  @include flex(row, center,center);
  &--tab{
    width:10vw;
    height:10vh;
    border:1px solid $color-text-sub;
     @include flex(column, center,center);
     >div{
       @include flex(column, center,center);
       >div{
          @include flex(column, center,center);
       }
     }
  }
  
}
</style>