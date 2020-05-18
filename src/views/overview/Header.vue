<template>
  <div class="_nav_header">
    <div class="_header_inner">
      <div class="_inner_img">
        <div class="_img_police">
          <img :src="logo" />
        </div>
        <m-time style='margin-top: 9%;'></m-time>
      </div>
      <div class="_inner_title">
        <div class="_inner_title_font">陕西交警总队集成指挥平台地图大数据</div>
      </div>
      <div class="_inner_btn">
        <div class="_btn_content" @click="gotoSys">进入系统>></div>
      </div>
    </div>
  </div>
</template>

<script>
import time from "@/components/UI_el/time.vue";
export default {
  name: "Header",
  props: {
    msg: String
  },
  components: {
    mTime: time
  },
  created() {},
  mounted() {},
  data: function() {
    return {
      weather: {
        status: "晴",
        temperature: "7℃",
        windy: "东南风2级"
      },
      logo: "./static/images/guohui.png"
    };
  },
  methods: {
    /**
    *进入系统
    *@params
     */
    gotoSys() {
      this.$router.replace("/accident/monitor");
    }
  }
};
</script>

<style scoped lang="scss">
$percent100: 100%;

@mixin flex($direction: row, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
@mixin _flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
._nav_header {
  width: $percent100;
  height: 8vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 11;
  color: #fff;
  background-color: #02030c;
  ._header_inner {
    width: 98%;
    height: $percent100;
    background-image: url("./image/title_back.png");
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    padding: 0 1%;
    @include flex(row);

    ._inner_img {
      width: 20%;
      height: 100%;
      @include flex(row);

      ._img_police {
        width: 12%;
        height: 100%;
        @include flex(row);

        img {
          width: auto;
          height: auto;
        }
      }
      ._img_content {
        width: 80%;
        height: 100%;
        @include flex(row, flex-start);
        font-size: 1vw;
      }
    }

    ._inner_title {
      width: 70%;
      height: 100%;

      // background: orange;
      @include flex(row, center);

      ._inner_title_font {
        width: $percent100;
        height: $percent100;
        color: white;
        font-size: 1.3vw;
        @include flex(column, center);
      }
    }
    ._inner_yq_statics {
      width: 23%;
      height: 100%;
      @include flex(row, center);
      &_tab {
        width: 25%;
        height: 100%;
        color: rgb(87, 147, 243);
        line-height: 10vh;
        font-size: 1vw;
        text-align: center;
        span {
          cursor: pointer;
          display: inline-block;
          color: #a5a5a5;
        }
        span.active {
          color: white;
        }
      }
      &_data {
        width: 75%;
        height: 100%;
        margin-top: 10%;
        &_item {
          float: left;
          width: 21%;
          height: 50%;
          @include _flex(column, center);
          border: 1px solid #ccc;
          margin: 0 5px;
          ._header {
            height: 65%;
            width: 85%;
            font-size: 0.85vw;
            padding: 0 8%;
            line-height: 3vh;
            span {
              display: inline-block;
              float: right;
            }
          }
          ._radio {
            height: 35%;
            width: 85%;
            font-size: 0.65vw;
            padding: 0 8%;
            background-color: #cccccc;
            color: black;
            span {
              display: inline-block;
              float: right;
            }
          }
        }
        &_item:nth-child(1) ._header {
          background-color: #d14b60;
        }
        &_item:nth-child(2) ._header {
          background-color: #ffcc33;
        }
        &_item:nth-child(3) ._header {
          background-color: #666666;
        }
        &_item:nth-child(4) ._header {
          background-color: #33cc33;
        }
        &_item:nth-child(1) ._radio span {
          color: red;
        }
        &_item:nth-child(2) ._radio span {
          color: yellow;
        }
        &_item:nth-child(3) ._radio span {
          color: black;
        }
        &_item:nth-child(4) ._radio span {
          color: #33cc33;
        }
      }
    }
    ._inner_btn {
      width: 18%;
      height: 100%;
      text-align: right;

      @include flex(row, center);
      ._btn_content {
        width: 6vw;
        height: 3vh;
        float: right;
        text-align: center;
        line-height: 3vh;
        background-image: url(./image/title_bg_checked.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        // background-color: #3a3c4c;
        // background-image: linear-gradient(to right, #0c123a , #19579D);
        cursor: pointer;
        @include flex(row, center);
      }
    }
  }
}
</style>
