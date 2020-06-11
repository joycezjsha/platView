<template>
  <div class="city-index-div">
    <div class="city-index_container boxstyle">
      <div class="city-index_title">
        <m-title label='城市拥堵排名' img_type=1 class='title'></m-title>
      </div>
      <m-tab :label="selectItem.city+'在全国排名'" :value='selectItem.order'></m-tab>
      <div class="city-index_content">
        <el-table
          :data="indexDatas"
          style="width: 100%"
          highlight-current-row
          @current-change="handleCurrentChange"
          height="55vh"
          :default-sort="{prop: 'week_radio', order: 'descending'}"
          :row-style="getRowClass"
          :header-row-style="getRowClass"
          :header-cell-style="getRowClass"
          @row-click="clickHandle"
        >
          <el-table-column fixed type="index" label="No" width="50"></el-table-column>
          <el-table-column prop="name" label="城市" width="70"></el-table-column>
          <el-table-column prop="ydzs" label="拥堵指数"></el-table-column>
          <el-table-column prop="tbsz" label="同比上周" sortable></el-table-column>
          <!-- <el-table-column prop="his_radio" label="历史均值" sortable></el-table-column> -->
        </el-table>
      </div>
    </div>
    <el-dialog title="" :visible.sync="drawer" append-to-body>
      <traffic-inde-charts></traffic-inde-charts>
    </el-dialog>
    <module-area></module-area>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import blur from "@/blur";
import TrafficIndeCharts from "./TrafficIndexCharts.vue";
import moduleArea from "@/components/area/area.vue";
import mTitle from "@/components/UI_el/title_com.vue";
import mTab from '@/components/UI_el/tab.vue'
export default {
  name: "TCruise",
  data() {
    return {
      map: {},
      indexDatas: [],
      selectItem: { city: "西安", order: 8 },
      map_cover: {
        markers:[]
      },
      currentRow: null,
      drawer: false
    };
  },
  components: {
    TrafficIndeCharts,
    moduleArea,
    mTitle,
    mTab
  },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(11);
    this.map.repaint = true;
    this.getCityIndexData();
  },
  destroyed() {
    this.map.setPitch(0);
  },
  methods: {
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
    },
    clickHandle(item) {
      blur.$emit("setSelectItems", item.city, item.index);
      this.drawer = true;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    /**
     * 初始化城市拥堵排名列表
     */
    getCityIndexData(){
      let that=this;
      interf.GET_CITY_TAFFIC_ORDER_API({})
      .then(response=>{
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
    /**
     * 地图上显示各个城市拥堵指数
     */
     addCityMarker(item){
      let el = document.createElement('div');
      el.id = 'marker';
      // el.style["border"] = "solid 1px #333333";
      // el.style["backgroundColor"] = "#333";
      el.style["padding"] = "4px 6px";
      el.style.color='white';
      
      let leftImgDiv=document.createElement('div');
      leftImgDiv.style.float='left';
      leftImgDiv.style.width='20px';
      leftImgDiv.style.height='40px';
      leftImgDiv.style.lineHeight='30px';
      let img_i = document.createElement('i');
      img_i.className='iconfont icon-shangsheng';
      img_i.style.color='#FFAF05';
     
      if(item.addIn<0){
        img_i.style.color='#00DFC7';
        leftImgDiv.style.transform='rotate(180deg)';
        leftImgDiv.style.lineHeight='50px';  
      }
      leftImgDiv.appendChild(img_i);
      el.appendChild(leftImgDiv);

      let rightDiv=document.createElement('div');
      rightDiv.style.float='right';
      rightDiv.style.width='40px';
      rightDiv.style.height='30px';
      let span1 = document.createElement('p');
      span1.innerHTML = item.name;
      span1.style.margin='0';
      rightDiv.appendChild(span1);
      let span2 = document.createElement('p');
      span2.innerHTML = item.ydzs;
      span2.style.margin='0';
      span2.style.color='#FFAF05';
      if(item.addIn<0) span2.style.color='#00DEC7';
      rightDiv.appendChild(span2);
      el.appendChild(rightDiv);
      //添加marker
      let lnglat = item.jwd.split(' ');
      let marker = new minemap.Marker(el, {offset: [-25, -25]}).setLngLat(lnglat).addTo(this.map);
      this.map_cover.markers.push(marker);

    },
/*##清除地图加载点、线、面、弹框*/
  clearMap(){
    //清除marker
    if(this.map_cover.markers.length>0){
      this.map_cover.markers.forEach(e=>{
        e.remove();
      })
    }
  },
  }
};
</script>
<style scope lang='scss'>
@import "@/assets/css/color.scss";
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.city-index-div {
  position: fixed;
  z-index: 10;
  left: 1vw;
  width: 474px;
  height: 1026px;
  top: 9vh;
  .city-index_container {
  width: 100%;
  height: 100%;
  .city-index_title {
    position: relative;
    width: 100%;
    font-family: Microsoft YaHei;
    font-size: 1vw;
    color: $color-white;
    font-weight: bolder;
    margin-bottom: 10px;
    .title{
      width:148px;height:4vh;line-height: 4vh;
    }
  }
  .xian_order {
    color: $color-white;
    width: 100%;
    height: 3vh;
    line-height: 3vh;
    text-align: center;
    font-size: 1.2vw;
    &--city {
      color: $color-active;
    }
  }
  .city-index_content {
    width: 98%;
    height: 85%;
    background-color: $color-bg-1;
    margin: 1%;

    &_table {
      overflow-y: auto;
    }
  }
}
}

</style>
