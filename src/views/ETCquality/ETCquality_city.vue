<template>
  <div class="ETCquality_city-div boxstyle">
    <div class="ETCquality_city_container">
      <div class='ETCquality_city_header'>
        <div @click='changeTable(0)'><m-title label='城市统计' :img_type='!tableIndex?"1":"0"' style='width:6vw;height:3.5vh;line-height:3.5vh;'></m-title></div>
        <div @click='changeTable(1)'><m-title label='道路统计' :img_type='tableIndex?"1":"0"' style='width:6vw;height:3.5vh;line-height:3.5vh;'></m-title></div>
      </div>
      <div class="ETCquality_city_content">
        <m-tiptxt text='活跃龙门架设备是指近一天有数据回传数据'></m-tiptxt>
        <div v-if="!tableIndex">
          <el-table :data="indexDatas" style="width: 100%" height="100%" :default-sort = "{prop: 'week_radio', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
            <el-table-column fixed type="index" label="No" width="50"></el-table-column>
            <el-table-column prop="city" label="城市"></el-table-column>
            <el-table-column prop="index" label="设备数量" sortable></el-table-column>
            <el-table-column prop="week_radio" label="覆盖率" sortable></el-table-column>
            <el-table-column prop="week_radio" label="活跃率" sortable></el-table-column>
          </el-table>
        </div>
        <div v-else>
            <span class='road_label'>道路类型筛选:</span><el-select v-model="road_type" placeholder="请选择道路类型">
               <el-option
                v-for="item in typeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          <el-table :data="roadDatas" style="width: 100%" height="100%" :default-sort = "{prop: 'week_radio', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
            <el-table-column fixed type="index" label="No" width="50"></el-table-column>
            <el-table-column prop="road_name" label="道路名称"></el-table-column>
            <el-table-column prop="index" label="设备数量" sortable></el-table-column>
            <el-table-column prop="week_radio" label="活跃率" sortable></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import m_tiptxt from '@/components/UI_el/tiptxt.vue'
import mTitle from "@/components/UI_el/title_com.vue";
export default {
  name: "TCruise",
  data() {
    return {
      map: {},
      indexDatas: [{"city":"西安","index":"2.1","week_radio":"+0.3%","his_radio":"-0.1%"},{"city":"渭南","index":"1.1","week_radio":"+0.3%","his_radio":"-0.1%"}],
      roadDatas:[{"road_name":"西安","index":"2.1","week_radio":"+0.3%","his_radio":"-0.1%"},{"road_name":"渭南","index":"1.1","week_radio":"+0.3%","his_radio":"-0.1%"}],
      selectItem:{"city":"西安",order:8},
      areaColors:["#556B2F","#00FFFF","#0000EE","#8A2BE2","#c48f58","#9fcac4","#5ad2a0","#f18a52","#656bd4","#7ca0cd","#88b7dc","#a08bd3","#be7fcd","#30a2c4","#c0ccd7","#dbddab","#9cd076","#69b38b","#437fb9","rgb(255, 143, 109)"],
      timeRange:'',
      mapAddItems:{
        polygons:[],
        sourceList:[],
        lineList:[],
        popups:[]
      },
      activeName:'全部',
      tableIndex:0,
      typeOption:[
        {label:'全部道路',value:'0'},{label:'国/省道',value:'1'},{label:'高速',value:'2'},{label:'主干道',value:'3'}
      ],
      road_type:'0'
    };
  },
  components:{mTiptxt:m_tiptxt,mTitle},
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
    this.clearMap();
  },
  methods: {
     /**
     * 切换显示table类型
     * @param 0->城市统计，1->道路统计
     */
    changeTable(t){
      this.tableIndex=t;
    },
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
                return "background:transparent;";
   },
  //取括号内数据
  getLonlats(str){
    let regex = /[^\(\)]+(?=\))/g;
    return str.match(regex);
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
   * 点击标签页
   */
  handleClick(){
    
  }
  }
};
</script>
<style scope scoped  lang='scss'>
@import '@/assets/css/color.scss';
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}

.ETCquality_city-div {
  position: fixed;
  z-index: 10;
  left: 1vw;
  width: 23vw;
  height: 80vh;
  top: 9vh;
}
.ETCquality_city_container {
  width: 100%;
  height: 100%;
  .ETCquality_city_header{
    width:80%;
    height: 4vh;
    margin-top: 1px;
    >div{
      float:left;
      cursor:pointer;
    }
    >div:nth-child(2){
      margin-left:-1vw;
    }
  }
  .ETCquality_city_content {
    width: 98%;
    height: 87%;
    background-color: $color-bg-1;
    margin: 1%;
    
    &_table {
      overflow-y: auto;
    }
    .road_label{
      color:$color-label;
      margin-right:1vw;
    }
  }
}
</style>