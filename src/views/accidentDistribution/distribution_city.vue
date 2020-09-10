<template>
  <div class="distribution-div boxstyle">
    <div class="distribution_container">
      <div class="city-distribution_header">
        <div @click="changeTable(0)">
          <m-title label="城市统计" :img_type="!tableIndex?'1':'0'" style="width:6vw;"></m-title>
        </div>
        <div @click="changeTable(1)">
          <m-title label="区域统计" :img_type="tableIndex?'1':'0'" style="width:6vw;"></m-title>
        </div>
      </div>
      <div class="city-distribution-query">
        <span class="city-distribution-query--label">时间：</span>
        <span class="city-distribution-query--time">
          <el-date-picker
            width="100%"
            v-model="timeRange"
            :default-time="defaultTime"
            value-format='yyyy-MM-dd HH:mm:ss'
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </span>
        <span class="city-distribution-query--btn">
          <el-button type="primary" @click='changeTable()' v-loading='queryLoading'>确定</el-button>
        </span>
      </div>
      <div class="city-distribution_content">
        <el-table
          :data="indexDatas"
          style="width: 90%"
          height="80%"
          :default-sort="{prop: 'week_radio', order: 'descending'}"
          :row-style="getRowClass"
          :header-row-style="getRowClass"
          :header-cell-style="getRowClass"
          @row-click='handle' highlight-current-row
          ref='cityTable'
        >
          <el-table-column type="index" label="No" width="50"></el-table-column>
          <el-table-column v-if='tableIndex==0' prop="CITY" label="管理部门"></el-table-column>
           <el-table-column v-else prop="CITY" label="区域"></el-table-column>
          <el-table-column prop="ACCIDENTNUM" label="事故数量" sortable></el-table-column>
          <el-table-column prop="MAJORSNUM" label="重大事故" sortable v-if='tableIndex==0'></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import blur from "@/blur";
import util from "@/common/util.js";
import { IMG } from "./config";
import { interf } from "./config";
import mTitle from "@/components/UI_el/title_com.vue";
export default {
  name: "TCruise",
  data() {
    return {
      map: {},
      indexDatas: [],
      selectItem: { city: "西安", order: 8 },
      timeRange: [],
      defaultTime:['00:00:00','00:00:00'],
      tableIndex: 0,
      mapAddItems: {
        polygons: [],
        sourceList: [],
        lineList: [],
        popups: []
      },
      queryLoading:false
    };
  },
  components: { mTitle },
  mounted() {
    this.map = this.$store.state.map;
    let that = this;
    let starttime=new Date(new Date(new Date().getTime()-30*24*60*60*1000));
    let endtime=new Date();
    this.timeRange.push(util.getTimeStr(starttime));
    this.timeRange.push(util.getTimeStr(endtime));
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(6);

    setTimeout(()=>{this.changeTable(0);},1000);
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
    changeTable(t) {
      let _this=this;
      if(t!=undefined) {
        if(this.range_type==t) return; 
        else this.tableIndex = t;
        // this.timeRange=''; //取消清空时间
      }else{
        this.queryLoading=true;
        if(this.timeRange && this.timeRange!='') {
          if(new Date(this.timeRange[1]).getTime()==new Date(new Date().toLocaleDateString()).getTime()){
            this.timeRange[1]=this.timeRange[1].split(' ')[0]+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds();
          }
          blur.$emit('initDistributionMapdata',{time:this.timeRange});
        }else{
          this.$message({
            message: '开始日期和结束日期不能为空！',
            type: "warning",
            duration: 3000
          });
         return;
        }
        setTimeout(()=>{_this.queryLoading=false;},500);
      }
      if(this.tableIndex){
        this.getAreaStaticsData();
      }else{
        this.getCityStaticsData();
      }
    },
     /**
     * 表格点击事件
     */
    handle(row, event, column){
      let data={};
      data.time=this.timeRange;
      if(this.tableIndex){
        data.name=row.CITY;
        data.value=row.AREAID;
      }else{
        data.name=row.CITY;
        data.value=row.XZQH;
        blur.$emit('changeCitySelect',data.value);
      }
      blur.$emit('initDistributionStatics',this.tableIndex,data);
    },
    /**
     * 获取城市统计数据，并填充
     */
    getCityStaticsData(){
      let that = this;
      let param={stime:1};
      if(this.timeRange && this.timeRange!=''){
        param.stime=this.timeRange[0];
        param.etime=this.timeRange[1];
      };
      interf.GET_CITY_STA_API(param).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
               that.indexDatas=data.data;
            } else{
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
        blur.$on('setCurrentRow',(city)=>{
          let index=null;
            if(city){
              that.indexDatas.forEach((e,i)=>{
                if(city.indexOf(e.CITY)!=-1){
                  index=i;
                }
              })
            }
          that.$refs.cityTable.setCurrentRow(that.indexDatas[index]);
        })
      });
    },
    /**
     * 获取区域统计数据，并填充
     */
    getAreaStaticsData(){
      let that = this;
       let param={stime:1};
      if(this.timeRange!=''){
        param.stime=this.timeRange[0];
        param.etime=this.timeRange[1];
      };
      interf.GET_AREA_STA_API(param).then(response=>{
        if (response && response.status == 200){
           var data = response.data;
            if (data.errcode == 0) {
               that.indexDatas=data.data;
            } else{
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
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
    },
    //取括号内数据
    getLonlats(str) {
      let regex = /[^\(\)]+(?=\))/g;
      return str.match(regex);
    },
    //清除地图加载点、线、面、弹框
    clearMap() {
      //清除source
      if (this.mapAddItems.sourceList.length > 0) {
        this.mapAddItems.sourceList.forEach(e => {
          if (this.map.getSource(e) != undefined) {
            this.map.removeSource(e);
          }
        });
      }
      //清除layer
      if (this.mapAddItems.lineList.length > 0) {
        this.mapAddItems.lineList.forEach(e => {
          if (this.map.getLayer(e) != undefined) {
            this.map.removeLayer(e);
          }
        });
      }
      //清除popup
      if (this.mapAddItems.popups.length > 0) {
        this.mapAddItems.popups.forEach(e => {
          e.remove();
        });
      }
    }
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
.distribution-div {
  position: absolute;
  z-index: 10;
  left: 13px;
  width: 474px;
  height: 977px;
  top: 11px;
}
.distribution_container {
  width: 100%;
  height: 100%;
  .tab_line {
    width: 96%;
    height: 2px;
    background: #fff;
    position: absolute;
    margin: 5% 2% 0 2%;
  }
  .city-distribution_header {
    width: 80%;
    height: 4vh;
    margin-top: 1px;
    > div {
      float: left;
      cursor: pointer;
    }
    > div:nth-child(2) {
      margin-left: -1vw;
    }
  }
  .city-distribution-query {
    color: $color-white;
    width: 100%;
    height: 3vh;
    line-height: 3vh;
    text-align: center;
    font-size: 0.8vw;
    margin: 2% 0;
    @include flex(row, center);
    &--label {
      width: 15%;
      color: $color-label;
      display: inline-block;
      @include flex(row, center);
    }
    &--time {
      width: 60%;
      display: inline-block;
      @include flex(row, center);
    }
    &--btn {
      width: 25%;
      display: inline-block;
      @include flex(row, center);
    }
  }
  .city-distribution_content {
    width: 100%;
    height: 85%;
    margin: 1%;
    padding:0 10px;
    &_table {
      overflow-y: auto;
    }
  }
}
</style>
<style>
/* .el-table,
.el-table__expanded-cell,
.el-table th,
.el-table tr {
  background-color: transparent;
  color: white;
}
.el-table--enable-row-hover .el-table__body tr:hover > td,
.el-table__body tr.hover-row > td {
  background-color: rgb(14, 182, 233);
  color: white;
}
.el-input__inner {
}
.el-input__inner,
.el-range-editor .el-range-input {
  background: transparent;
  color: white;
}
.el-date-editor .el-range-separator {
  color: white;
}
.el-picker-panel {
  color: white;
  background-color: #282d27eb;
}
.el-range-editor.el-input__inner {
  height: 3vh;
  line-height: 3vh;
}
.el-date-editor .el-range__icon {
  line-height: 2vh;
}
.el-date-editor .el-range-separator {
  line-height: 2vh;
}
.el-button {
  height: 3vh;
  line-height: 0.5;
} */
</style>