<template>
  <div class="overview-statics">
    <div class="overview-statics--tab" v-loading="carLoading">
      <div class="content">
        <div class="overview-statics--tab_title">大车流量</div>
        <div class="overview-statics--tab_radio">
          <div class='in'>
            <span class="label">进</span>
            <span class="value">{{datas.b_car.in}}</span>
          </div>
          <div class='out'>
            <span class="label">出</span>
            <span class="value">{{datas.b_car.out}}</span>
          </div>
          <div class='inout'>
            <span class="label">净流入:</span>
            <span class="value">{{datas.b_car.inout}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="overview-statics--split"></div>
    <div class="overview-statics--tab" v-loading="carLoading">
      <div class='content'>
        <div class="overview-statics--tab_title">小车流量</div>
        <div class="overview-statics--tab_radio">
          <div  class='in'>
            <span class="label">进</span>
            <span class="value">{{datas.s_car.in}}</span>
          </div>
          <div  class='out'>
            <span class="label">出</span>
            <span class="value">{{datas.s_car.out}}</span>
          </div>
          <div  class='inout'>
            <span class="label">净流入:</span>
            <span class="value">{{datas.s_car.inout}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="overview-statics--split"></div>
    <div class="overview-statics--tab" v-loading='warnLoading'>
      <div class='content'>
        <div class="overview-statics--tab_title">今日预警</div>
        <div class="overview-statics--tab_radio">
          <div class='count'>{{datas.warn.count}}</div>
          <div class='inout'>
            <span class="label">超速预警:</span>
            <span class="value">{{datas.warn.over_speed_warn}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="overview-statics--split"></div>
    <div class="overview-statics--tab">
      <div class='content'>
        <div class="overview-statics--tab_title">今日拦截</div>
        <div  class="overview-statics--tab_radio">
          <div class='count'>{{datas.enforcement.count}}</div>
          <div class='inout'>
            <span class="label">拦截率:</span>
            <span class="value">{{datas.enforcement.radio}}</span>
          </div>
        </div>
      </div>
    </div>
    <transition name="el-zoom-in-top">
      <div class="jqInfo" v-show="showJqInfo">
        <el-table
          :data="jqInfoDatas"
          width="300px"
          height="200px"
          :row-style="getRowClass"
          :header-row-style="getRowClass"
          :header-cell-style="getRowClass"
        >
          <el-table-column prop="CITY" label="城市" width="70"></el-table-column>
          <el-table-column prop="NUM" label="数量"></el-table-column>
          <el-table-column prop="RADIO" label="比例"></el-table-column>
        </el-table>
      </div>
    </transition>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
` `;
export default {
  name: "overview_statics",
  data() {
    return {
      map: {},
      jqInfoDatas: [],
      datas: {
        b_car: { in: "", out: "", inout: "" },
        s_car: { in: "", out: "", inout: "" },
        warn: { count: "", over_speed_warn: "" },
        enforcement: { count: "", radio: "" },
      },

      interval: null,
      carLoading: false,
      warnLoading: false,
      showJqInfo: false,
    };
  },
  mounted() {
    this.map = this.$store.state.map;
    let that = this,
      i = 0;
    that.getBigCarData(1);
    that.getBigCarData(2);
    that.getAlarmData();
    that.getEnforceData();
    // this.interval=setInterval(()=>{
    //   that.getBigCarData(1);
    //   that.getBigCarData(2);
    //   if(i%5==0){
    //     that.getSgData();
    //   }
    //   i++;
    // },1000*60);
  },
  destroyed() {
    this.map.setPitch(0);
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
    },
    /**
     * 获取大车、小车流量数据
     * @param type 1->大车 2->小车
     **/
    getBigCarData(type) {
      let that = this;
      that.carLoading = true;
      interf
        .GET_BIG_CAR_API({ state: type, c_flag: 1 })
        .then((response) => {
          if (response && response.status == 200) {
            let data = response.data;
            if (data.errcode == 0) {
              that.carLoading = false;
              let type = response.config.params.state;
              if (type == 1) {
                that.datas.b_car.inout = data.data.INOUT;
                for (let i = 0; i < data.data.LIST.length; i++) {
                  if (data.data.LIST[i].FXLX == 1) {
                    that.datas.b_car.in = data.data.LIST[i].NUM;
                  } else {
                    that.datas.b_car.out = data.data.LIST[i].NUM;
                  }
                }
              } else {
                that.datas.s_car.inout = data.data.INOUT;
                for (let i = 0; i < data.data.LIST.length; i++) {
                  if (data.data.LIST[i].FXLX == 1) {
                    that.datas.s_car.in = data.data.LIST[i].NUM;
                  } else {
                    that.datas.s_car.out = data.data.LIST[i].NUM;
                  }
                }
              }
            }
          }
        })
        .catch((err) => {
          that.$message({
            message: "请求大车、小车流量数据失败！",
            type: "error",
            duration: 1500,
          });
          that.carLoading = false;
        })
        .finally(() => {
          that.carLoading = false;
        });
    },
    /**
     * 获取今日预警数据
     **/
    getAlarmData() {
      let that = this;
      that.warnLoading = true;
      interf.GET_TODAY_ALARM_API({})
        .then((response) => {
          that.sgLoading = false;
          if (response && response.status == 200) {
            let data = response.data;
            if (data.errcode == 0) {
              that.datas.warn.count = data.data.TODAYALARMNUM;
              that.datas.warn.over_speed_warn = data.data.SPEEDINGNUM;
            }
          }
        })
        .catch((err) => {
          that.$message({
            message: "请求今日预警数据失败！",
            type: "error",
            duration: 1500,
          });
          that.warnLoading = false;
        })
        .finally(() => {
          that.warnLoading = false;
        });
    },
    /**
     * 获取设备统计数据
     **/
    getEnforceData() {
      let that = this;
      interf.GET_TODAY_ENFORCEMENT_API({}).then((response) => {
        if (response && response.status == 200) {
          let data = response.data;
          if (data.errcode == 0) {
            that.datas.enforcement.count = data.data.TODAYINTERCEPTNUM;
            that.datas.enforcement.radio = data.data.INTERCEPTRATIO;
          }
        }
      });
    },
    /**
     * 点击标签页
     */
    handleClick() {},
  },
};
</script>
<style scope lang='scss'>
@import "@/assets/css/color.scss";
@mixin flex($direction, $justify, $align) {
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
  top: 87px;
  color: $color-white;
  background: url("./image/center_bg.png") no-repeat;
  background-size: 100% 100%;
  @include flex(row, center, center);
  &--tab {
    width: 30%;
    height: 10vh;
    // border-right: 1px solid;
    // border-image-source: url('./image/split.png');
    // border-image: linear-gradient(rgba(0,255,255,0), #27345b 20%, #2f4162 80%, rgba(236, 239, 239, 0)) 1;
    padding: 27px 17px;
    @include flex(column, center, center);
    .content{
      @include flex(row, center, center);
      width: 100%;
      height: 100%;
    }
    &_title {
      @include flex(column, center, center);
      width: 100%;
      width: 20%;
      writing-mode: vertical-lr;
      font-size:18px;
      letter-spacing: 4px;
    }
    &_radio {
      @include flex(column, center, center);
      width: 100%;
      width: 80%;
      padding-left:28px;
      .in{
        color:#FFAF05;
        height:36px;
        @include flex(row, center, center);
        width: 100%;
        .label,.value{
          @include flex(column, center, center);
        }
        .label{
          flex:2;
          font-size: 16px;
          justify-content: start;
          align-items: flex-start;
        }
        .value{
          flex:5;
          font-size: 36px;
         font-family: 'DS-Digital-BoldItalic';
        }
      }
      .out{
        color:#00DEC7;
        @include flex(row, center, center);
        width: 100%;
        height:36px;
        .label,.value{
          @include flex(column, center, center);
        }
        .label{
          flex:2;
          font-size: 16px;
          justify-content: start;
          align-items: flex-start;
        }
        .value{
          flex:5;
          font-size: 36px;
          font-family: 'DS-Digital-BoldItalic';
        }
      }
      .inout{
        width: 100%;
        font-size: 14px;
        justify-content: start;
        align-items: flex-start;
        text-align: left;
        border-top:2px solid #1a213c;
        padding:8px 0;
        margin-top:8px;
      }
      .count{
        color:#FF1818;
        width: 100%;
        font-size:36px;
        font-family: 'DS-Digital-BoldItalic';
        height: 67px;
        line-height: 85px;
        @include flex(row, start, flex-start);
        
      }
    }
  }
  &--split{
    @include flex(column, center,center);
    width:3px;
    height:119px;
    background: radial-gradient(#f3f0f0, #757ba340,transparent);
  }
}
</style>