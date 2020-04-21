<template>
  <div class="city-index-div">
    <div class="city-index_container">
      <div class="city-index_title">
        <div>
          <i class="el-icon-collection-tag">城市拥堵排名</i>
        </div>
        
      </div>
      <div class='xian_order'><span class="xian_order--city">{{selectItem.city}}</span>在全国排名:<span class="xian_order--city">{{selectItem.order}}</span></div>
      <div class="city-index_content">
        <el-table :data="indexDatas" style="width: 100%" :default-sort = "{prop: 'week_radio', order: 'descending'}">
          
      <el-table-column type="index" label="No" width="50"></el-table-column>
      <el-table-column prop="city" label="城市" width="80"></el-table-column>
      <el-table-column prop="index" label="拥堵指数"></el-table-column>
      <el-table-column prop="week_radio" label="同比上周" sortable></el-table-column>
      <el-table-column prop="his_radio" label="历史均值" sortable></el-table-column>
    </el-table>
        <!-- <ul class="city-index_content_table">
          <li class="index-item" v-for="item in indexDatas" :id="item.id" :key="item.id">
            <span>{{item.address}}</span>
            <span class="address-name">{{item.name}}</span>
            <span v-show="showDelIcon" class="delIcon">
              <i class="el-icon-delete"></i>
            </span>
          </li>
        </ul> -->
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
export default {
  name: "TCruise",
  data() {
    return {
      map: {},
      indexDatas: [{"city":"西安","index":"2.1","week_radio":"+0.3%","his_radio":"-0.1%"},{"city":"渭南","index":"1.1","week_radio":"+0.3%","his_radio":"-0.1%"}],
      selectItem:{"city":"西安",order:8}
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
    this.flyRoutes = [];
    this.map.stop();
    let that = this;
    clearInterval(that.fly);
    that.map.setPitch(0);
  },
  methods: {
    //获取巡航数据
    getIndexData() {
      let that = this;
     interf.getCityIndexData({},(data) => {
        console.log(data);
          },e=>{

          })
    }
  }
};
</script>
<style scope lang='scss'>
@import '@/assets/css/color.scss';
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
#cruise_table::-webkit-scrollbar {
  width: 1rem;
  height: 1rem;
  background-color:$color-bg;
}

/*定义滚动条轨道 内阴影+圆角*/
#cruise_table::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px  $box-shadow;
  border-radius: 5px;
  background-color: $color-bg;
}

/*定义滑块 内阴影+圆角*/
#cruise_table::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px $box-shadow;
  background-color: $color-white;
}
.city-index-div {
  position: absolute;
  z-index: 10;
  left: 1vw;
  width: 23vw;
  height: 68vh;
  top: 9vh;
}
.city-index_container {
  width: 100%;
  height: 100%;
  background-color: $color-bg-1;
  border: 1px solid $color-border-1;
  .city-index_title{
      position: relative;
    width: 96%;
    border-bottom: 0.1rem solid $color-border-1;
    font-family: Microsoft YaHei;
    font-size: 1vw;
    color: $color-white;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 0.6rem 2%;
    font-weight: bolder;
    }
    .xian_order{
      color: $color-white;
    width: 100%;
    height: 3vh;
    line-height: 3vh;
    text-align: center;
    font-size: 1.2vw;
    &--city{
      color:$color-active;
    }
    }
  .city-index_content {
    width: 98%;
    height: 85%;
    background-color: $color-bg-1;
    margin: 1%;
    
    &_table {
      
    }
    
  }
}
</style>