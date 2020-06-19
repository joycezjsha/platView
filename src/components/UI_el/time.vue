<template>
  <div class="_inner_header_time">
    <!--顶部时间-->
    <div class="col-md-5 fix-title-time" id="fix-title-time">
      <div id="time" class="fix-title-time-date time">{{year}}</div>
      <div class="week-year">
        <span class="week" id="week">{{week}}</span>
        <div class="year" id="year">{{time}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      week: "",
      year: "",
      time: ""
    };
  },
  props: {},
  components: {},
  created() {
    let that=this;
    this.initTime();
    setInterval(function () {
        that.initTime();
    }, 1000);
  },
  mounted(){
    // 调用
   
  },
  methods: {
    initTime() {
      let _this = this;
      let nowTime = new Date();
      var a = new Array("日", "一", "二", "三", "四", "五", "六");
      var week = new Date().getDay();
      _this.week = "周" + a[week];

      //取年月日
      var my_day = nowTime.getDate();
      var my_month = nowTime.getMonth() + 1;
      var my_year = nowTime.getFullYear();
      _this.year = my_year + "年" + my_month + "月" + my_day + "日";
      //取时分秒
      var d = new Date();
      var my_hours = d.getHours();
      var my_minutes = d.getMinutes();
      if (my_minutes < 10) {
        my_minutes = "0" + my_minutes;
      }
      var my_seconds = d.getSeconds();
      if (my_seconds < 10) {
        my_seconds = "0" + my_seconds;
      }
      _this.time = my_hours + ":" + my_minutes + ":" + my_seconds;
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/css/color.scss";
@mixin flex($direction, $justify, $align) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
._inner_header_time {
  float: right;
  width: 100%;
  height: 100%;
  font-size: 0.9vw !important;
  margin: 6% 0 2% 5%;
  color:$color-white;
  .fix-title-time {
    width: 100%;
    height: 80%;
    // margin-top: 5%;
    .week-year {
      width: 100%;
      height: 30px;
      font-size: 0.9vw;
      @include flex(row, flex-start,start);

      .year {
        width: 55%;
        height: 100%;
        @include flex(row, flex-start,start);
      }

      .week {
        width: 2.5vw;
        height: 100%;
        @include flex(row, flex-start,start);
      }
    }

    .time {
      width: 100%;
      height: 20px;
      font-size: 0.9vw !important;
      @include flex(row, flex-start,start);
    }
  }
}
</style>