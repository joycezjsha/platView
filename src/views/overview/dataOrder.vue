<template>
  <div class="city_index_chart">
    <!-- <m-tile  :label="order_value==1 ? '今日轨迹接口调用情况':'过车数据回传排行'"></m-tile> -->
    <div v-if="order_value==0" style="width:90%;margin:0 auto;height:80%;">
      <el-table
        :data="indexDatascar"
        highlight-current-row
        height="100%"
        :default-sort="{prop: 'TODAYNUM', order: 'descending'}"
        :row-style="getRowClass"
        :header-row-style="getRowClass"
        :header-cell-style="getRowClass"
      >
        <el-table-column fixed type="index" label="No" width="70"></el-table-column>
        <el-table-column prop="YJDFZJG" label="城市" width="100"></el-table-column>
        <el-table-column prop="TODAYNUM" label="今日上传"></el-table-column>
        <el-table-column prop="YESTERDAYNUM" label="昨日上传" sortable></el-table-column>
        <el-table-column prop="TODAYPROPORTION" label="今日上传占比" sortable></el-table-column>
      </el-table>
    </div>
    <div style="width:90%;margin:0 auto;height:80%;" v-else>
      <el-table
        :data="indexDatas"
        highlight-current-row
        max-height="100%"
        style="width: 100%;"
        :default-sort="{prop: 'YESTERDAYNUM', order: 'descending'}"
        :row-style="getRowClass"
        :header-row-style="getRowClass"
        :header-cell-style="getRowClass"
      >
        <el-table-column fixed='left' type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="city" label="城市" width="100"></el-table-column>
        <el-table-column
          :prop="item.jzdm"
          :label="item.name"
          v-for="(item,i) of tableData.RECORDS"
          :key="i"
          width="120"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import echarts from "echarts";
import title from "@/components/UI_el/title.vue";
export default {
  name: "cityIndexChart",
  props: {
    order_value: {
      type: Number,
      default: 0
    }
    // indexDatascar,
  },
  watch: {
    order_value: {
      immediate: false,
      handler: function(cVAL, oVAL) {
        this.getIndexData();
      }
    }
  },
  data() {
    return {
      indexDatascar: [
        {
          city: "渭南",
          index: "1.1",
          TODAYNUM: "+0.3%",
          YESTERDAYNUM: "-0.1%",
          TODAYPROPORTION: "8.4"
        }
      ],
      indexDatas: [
        // {
          // city: "渭南",
          // "00": "1.1",
          // "01": "+0.3%",
          // "02": "-0.1%",
          // "03": "8.4",
          // "04": "边防管理",
          // "05": "边防管理",
          // "06": "边防管理",
          // "07": "边防管理",
          // "08": "边防管理",
          // "09": "边防管理",
          // "10": "边防管理",
          // "11": "边防管理",
          // "12": "边防管理",
          // "13": "边防管理",
          // "14": "边防管理",
          // "15": "边防管理",
          // "16": "边防管理",
          // "18": "边防管理",
          // "19": "边防管理",
          // "20": "边防管理",
          // "21": "边防管理",
          // "22": "边防管理",
          // "23": "边防管理",
          // "24": "边防管理",
          // "26": "边防管理",
          // "27": "边防管理",
          // "31": "边防管理",
          // "32": "边防管理",
          // "33": "边防管理",
          // "34": "边防管理",
          // "35": "边防管理",
          // "36": "边防管理",
          // "38": "边防管理",
          // "39": "边防管理",
          // "40": "边防管理",
          // "41": "边防管理",
          // "89": "边防管理",
          // "90": "边防管理",
          // "91": "边防管理",
          // "92": "边防管理",
          // "93": "边防管理",
          // "94": "边防管理",
          // "95": "边防管理",
          // "96": "边防管理",
          // "97": "边防管理",
          // "98": "边防管理"
        // }
      ],
      tableData: {
        RECORDS: [
          { jzdm: "00", name: "公安局" },
          { jzdm: "01", name: "国内安全保卫" },
          { jzdm: "02", name: "经济犯罪侦查" },
          {
            jzdm: "03",
            name: "治安管理"
          },
          {
            jzdm: "04",
            name: "边防管理"
          },
          {
            jzdm: "05",
            name: "刑事侦查"
          },
          {
            jzdm: "06",
            name: "出入境管理"
          },
          {
            jzdm: "07",
            name: "消防"
          },
          {
            jzdm: "08",
            name: "警卫"
          },
          {
            jzdm: "09",
            name: "中办警卫"
          },
          {
            jzdm: "10",
            name: "铁道(行业)"
          },
          {
            jzdm: "11",
            name: "公共信息网络安全监察"
          },
          {
            jzdm: "12",
            name: "行动技术"
          },
          {
            jzdm: "13",
            name: "监所管理"
          },
          {
            jzdm: "14",
            name: "交通(行业)"
          },
          {
            jzdm: "15",
            name: "民航(行业)"
          },
          {
            jzdm: "16",
            name: "林业(行业)"
          },
          {
            jzdm: "18",
            name: "法制"
          },
          {
            jzdm: "19",
            name: "外事"
          },
          {
            jzdm: "20",
            name: "装备财务"
          },
          {
            jzdm: "21",
            name: "禁毒"
          },
          {
            jzdm: "22",
            name: "科技"
          },
          {
            jzdm: "23",
            name: "信息通信"
          },
          {
            jzdm: "24",
            name: "海关(行业)"
          },
          {
            jzdm: "26",
            name: "反邪教"
          },
          {
            jzdm: "27",
            name: "反恐怖"
          },
          {
            jzdm: "31",
            name: "办公厅(室)"
          },
          {
            jzdm: "32",
            name: "纪委"
          },
          {
            jzdm: "33",
            name: "监察"
          },
          {
            jzdm: "34",
            name: "督察"
          },
          {
            jzdm: "35",
            name: "政工"
          },
          {
            jzdm: "36",
            name: "人事训练"
          },
          {
            jzdm: "38",
            name: "机关党委"
          },
          {
            jzdm: "39",
            name: "离退休干部中心"
          },
          {
            jzdm: "40",
            name: "机关服务中心"
          },
          {
            jzdm: "41",
            name: "审计"
          },
          {
            jzdm: "89",
            name: "出版社"
          },
          {
            jzdm: "90",
            name: "院校"
          },
          {
            jzdm: "91",
            name: "研究所"
          },
          {
            jzdm: "92",
            name: "医院"
          },
          {
            jzdm: "93",
            name: "训练基地"
          },
          {
            jzdm: "94",
            name: "边检"
          },
          {
            jzdm: "95",
            name: "巡警"
          },
          {
            jzdm: "96",
            name: "派出所"
          },
          {
            jzdm: "97",
            name: "金盾办"
          },
          {
            jzdm: "98",
            name: "科技委"
          }
        ]
      }
    };
  },
  components: {
    mTile: title
  },
  mounted() {
    this.$nextTick(() => {
      this.getIndexData();
    });
  },
  methods: {
    getIndexData() {
      let that = this;
      //获取历史过车数据列表  GET_HIS_CAR_LIST_API
      if (this.order_value) {
        interf.GET_TRAIL_LIST_API({}).then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              // that.indexDatas = data.data;
            }
          }
        });
      } else {
        interf.GET_HIS_CAR_LIST_API({}).then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              that.indexDatascar = data.data;
            }
          }
        });
      }
    },
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
    }
  },
  destroyed() {}
};
</script>

<style scoped='true' lang='scss'>
.city_index_chart {
  width: 100%;
  height: 85%;
  .title {
    width: 60%;
    color: white;
    font-size: 20px;
  }
  .section {
    position: absolute;
    right: 2vw;
    top: 6vh;
    color: white;
    font-size: 0.9vw;
  }
  #exponentChart {
    width: 100%;
    height: 30vh;
    border: 1px solid white;
  }
  .txt {
    height: 5vh;
    width: 100%;
    color: #cecece;
    line-height: 5vh;
  }
}
</style>
