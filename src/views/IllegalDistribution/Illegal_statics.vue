<template>
  <div class="accident-statics">
    <div class="accident-statics_container">
      <div class="accident-statics_title">
        <m-title label='全省统计' style='width:100%;'></m-title>
        <!-- <div>
          <i class="el-icon-collection-tag">全省统计</i>
        </div> -->
      </div>
      <div class="accident-statics--tab">
        <div>
          <span class="--tab-title">
            <i class="el-icon-bell"></i>全部违法数量总计
          </span>
          <span class="statics--tab--value">
            <span class="statics_value sum">{{staticsData.sum}}</span>
          </span>
        </div>
        <div>
          <span>超速行驶：{{staticsData.over}}</span>
          <el-divider direction="vertical"></el-divider>
          <span>尾号限行：{{staticsData.lastNumberLimit}}</span>
        </div>
      </div>
      <div class="accident-statics_content">
        <div class="accident-statics_title">
          <div>
            <i class="el-icon-collection-tag">违法类别Top5:</i>
          </div>
        </div>
        <div id="accident-statics_sort">
          
        </div>
        <div class='accident-statics_table'>
          <div class="accident-statics_title">
            <div>
              <i class="el-icon-collection-tag">高发道路排名:</i>
            </div>
          </div>
          <el-table :data="indexDatas" style="width: 100%" height="80%" :default-sort = "{prop: 'week_radio', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
            <el-table-column fixed type="index" label="No" width="50"></el-table-column>
              <el-table-column prop="city" label="道路名称"></el-table-column>
              <el-table-column prop="index" label="违法数量" sortable></el-table-column>
            </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import echarts from 'echarts'
import mTitle from "@/components/UI_el/title.vue";
import mLineChart from "@/components/UI_el/double_line_chart.vue";
export default {
  name: "TIndex",
  data() {
    return {
      map: {},
      staticsData: {sum: 10,over:123,lastNumberLimit:1224},
      accident_option: {
        color:['#02FDF4','#4D76F9','#01D647'],
          tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
              orient: 'vertical',
              right: 10,
              data: [],
              textStyle:{color:'white'}
          },
          series: [
              {
                  name: '警情统计',
                  type: 'pie',
                  radius: ['40%', '60%'],
                  avoidLabelOverlap: false,
                  label: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      label: {
                          show: true,
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  },
                  labelLine: {
                      show: false
                  },
                  data: [
                     
                  ]
              }
          ]
      },
      accident_chart:null,
      sg_sort_data: [
        { name: "机动车与机动车", value: "12", radio: "32%" },
        { name: "机动车与非机动车", value: "122", radio: "32%" },
        { name: "行人", value: "2", radio: "32%" }
      ],
      indexDatas: [{"city":"西安","index":"2.1","week_radio":"+0.3%","his_radio":"-0.1%"},{"city":"渭南","index":"1.1","week_radio":"+0.3%","his_radio":"-0.1%"}]
    }
  },
  components: { mTitle,mLineChart },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.getIndexData();
    this.initAccidentStaticsChart();
  },
  destroyed() {
    this.flyRoutes = [];
    this.map.stop();
    let that = this;
    that.map.setPitch(0); //设置地图的俯仰角
  },
  methods: {
    //获取统计数据
    getIndexData() {
      let that = this;
    },
    /**
     * 生成警情分别类统计echarts
     */
    initAccidentStaticsChart(){
       if(!this.accident_chart){
        this.accident_chart = echarts.init(document.getElementById('accident-statics_sort'));
      };
      this.accident_option.legend.data=['122','互联网','视频巡查'];
      this.accident_option.series[0].data=[{name:'122',value:120},{name:'互联网',value:120},{name:'视频巡查',value:10}]
      this.accident_chart.setOption(this.accident_option);
    },
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
                return "background:transparent;";
   },
    /**
     * 获取高发道路排名
     */
  }
};
</script>
<style scope='true' lang='scss'>
@import "@/assets/css/color.scss";
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.accident-statics {
  position: fixed;
  z-index: 10;
  right: 1vw;
  width: 474px;
  height: 80vh;
  top: 9vh;
  color: white;
}
.accident-statics_container {
  width: 100%;
  height: 100%;
  .accident-statics_title {
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
    font-weight: bolder;
  }
  .accident-statics--tab {
  width: 100%;
  height: 9vh;

    > div {
      width: 100%;
      height: 5vh;
      font-size: 0.8vw;
      @include flex(row, center);

      .--tab-title {
        font-size: 0.9vw;
        width: 60%;
        @include flex(row, center);
      }
      .statics--tab--value {
        width: 40%;
        @include flex(row, center);
        .statics_value {
          color: $color-active;
        }
        .statics_value.sum {
          font-size: 1.4vw;
        }
      }
      .--tab-title {
        .el-icon-bell:before {
          font-size: 1.5vw;
          color: #e70101;
          font-weight: 600;
        }
      }
    }
}
  .accident-statics_content {
    width: 98%;
    height: 85%;
    background-color: $color-bg-1;
    margin: 1%;

    #accident-statics_sort {
      width:100%;
      height:15vh;
    }
    #sumCountChange{
      width:100%;
      height:25vh;
    }
    #accurCreateChange{
      width:100%;
      height:25vh;
    }
  }
}

</style>