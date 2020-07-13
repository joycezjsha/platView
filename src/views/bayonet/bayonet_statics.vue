<template>
  <div class="bayonet_device-statics" style="position: fixed;z-index: 10;color: white;
  right: 13px;
  width: 24.6875vw;
  height: 85vh;
  top: 9vh;">
    <div class="device-statics_container">
      <div class="device-statics_title">
        <!-- <m-title label='全省统计' img_type='1' style='width:6vw;height:3.5vh;line-height:3.5vh;'></m-title> -->
        <div class="top borstyle" >
        <div class="title" v-if="showback==true">全省统计</div>
        <div class="back "  v-else @click="goback()">
          &lt;&lt; 返回全省
          <span>{{city}}</span>
        </div>
      </div>
      </div>
      <div class="bayonet_statics_content">
        <div style="padding-left:5px">
           <m-tab style="margin-bottom:1.2vh" icon='icon-shebei1' label='设备总数' :value='devcount'></m-tab>
           <m-tab style="margin-bottom:1.2vh" icon='icon-kakou' label='活跃卡口数' :value='activedev'></m-tab>
           <m-tab style="margin-bottom:1.2vh" icon='icon-shujuhuichuan' label='今日回传过车数据' :value='todaynum'></m-tab>
        </div>
        <div class="bottom boxstyle">
           <div class="device-statics_title">
            <div style="margin-top:3px">
              <m-title label='今日卡口数据回传排名' style="width:12vw" ></m-title>
              <!-- <i class="el-icon-collection-tag">今日卡口数据回传排名:</i> -->
            </div>
          </div>
          <div class="device-statics_data">
            <div style="padding:0 8px">
              <el-table 
              :data="tableDatas" 
              v-loading='tableLoading'
              style="width: 100%" height="62.4vh" 
              :default-sort = "{prop: 'week_radio', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
                <el-table-column  type="index" label="No" width="50"></el-table-column>
                <el-table-column  show-overflow-tooltip  prop="city,ROADNAME"  width="190" label="设备名称">
                  <template slot-scope="scope">
                   [{{scope.row.city}}]{{scope.row.ROADNAME}}
                  </template>
                </el-table-column>
                <el-table-column prop="TIMENUM" label="流量"  width="60" sortable></el-table-column>
                <el-table-column prop="TODAYNUM" label="过车量"  width="90" sortable></el-table-column>
              </el-table>
            </div>          
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import echarts from 'echarts'
import m_tab from '@/components/UI_el/tab.vue'
import m_list from '@/components/UI_el/list.vue'
import mTitle from "@/components/UI_el/title_com.vue";
import blur from '../../blur.js';
export default {
  name: "TIndex",
  data() {
    return {
      showback: true, //是否显示返回按钮
      map: {},
      devcount:'',
      activedev:'',
      todaynum:'',
      XZQH:'',
      city:'',
      tableLoading:false,
      staticsData: {sum: 10,mainCount:0},
      staticsSort:[],
      device_option: {
        color:['#02FDF4','#4D76F9','#01D647'],
          tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
              orient: 'vertical',
              right: 10,
              top:10,
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
      device_chart:null,
      tableDatas:[]
    }
  },
  components:{mTab:m_tab,mList:m_list,mTitle},
  mounted() {
    
    this.map = this.$store.state.map;
    let that = this;
    that.map.setCenter([108.967368, 34.302634]);
    that.map.setZoom(11);
    that.getIndexData();
    that.getdevcountData();
    that.getbayrankDatas()
    that.getData()
    // that.initdeviceStaticsChart();
    // setTimeout(()=>{
        // that.initAccurCharts();
    // },1000);
 
  },
  destroyed() {
    this.flyRoutes = [];
    this.map.stop();
    let that = this;
    that.map.setPitch(0); //设置地图的俯仰角
  },
  methods: {
    // 是否显示返回
    goback() {
      let that = this;
      that.showback = true;
      that.xzqh='';
      blur.$emit('getXZQH',that.xzqh);
      that.getbayrankDatas();
      that.getdevcountData();
    },
    // 接受传过来的数据
    getData(){
      blur.$on("getxzqh",data=>{
        this.XZQH=data;
        if(this.XZQH!=''){
          this.showback=false;
        }
        this.getbayrankDatas(this.XZQH)
        this.getdevcountData(this.XZQH)
      })
      blur.$on("getcity",data=>{
        this.city=data;
      })
    },
    /**
     * // 卡口监测-今日卡口数据回传排名 Bayonet/getBayonetEchoRanking GET_BAY_RANK_API
    */
   getbayrankDatas(xzqh){
      let that = this;
     that.tableLoading = true;
    //  如果没有参数
     if(xzqh===undefined){
      interf.GET_BAY_RANK_API({})
       .then(response=>{
         that.tableLoading = false;
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
            that.tableDatas=data.data;
          } else{
            that.$message({
              message: data.errmsg,
              type: "error",
              duration: 1500
            });
            that.tableLoading = false;
          }
        }
      })
      .catch(err=>{
        console.log(err);
      })
      .finally(() => {
        that.tableLoading = false;
      });
     }else{
       interf.GET_BAY_RANK_API({
          xzqh:xzqh
       })
      .then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
            that.tableDatas=data.data;
            } else{
              that.$message({
                message: data.errmsg,
                type: "error",
                duration: 1500
              });
            }
          }
        })
       .catch(err=>{
          console.log(err);
       })
       .finally(() => {
         that.tableLoading = false;
       });
     }
   },
    /**
     *  卡口监测-全省统计  Bayonet/getDevCount   GET_DEV_COUNT_API
    */
   getdevcountData(xzqh){
      let that = this;
     
    //  如果没有参数
    if(xzqh===undefined){
      interf.GET_DEV_COUNT_API({})
      .then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
            that.todaynum=data.data.todaynum.toString();
            that.devcount=data.data.devcount.toString();
            that.activedev=data.data.activedev.toString();
          } else{
            that.$message({
              message: data.errmsg,
              type: "error",
              duration: 1500
              });
            }
          }
        })
      .catch(err=>{
        console.log(err);
      })
        .finally(() => {
          that.tableLoading = false;
        });
    }else{
      interf.GET_DEV_COUNT_API({
        xzqh:xzqh
      })
      .then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
                that.todaynum=data.data.todaynum;
                that.devcount=data.data.devcount;
                that.activedev=data.data.activedev;
             } else{
               that.$message({
                 message: data.errmsg,
                 type: "error",
                 duration: 1500
               });
             }
         }
       })
       .catch(err=>{
          console.log(err);
       })
       .finally(() => {
         that.tableLoading = false;
       });
    }
       
   },
    //获取统计数据
    getIndexData() {
      let that = this;
    },
    /**
     * 生成警情分别类统计echarts
     */
    initdeviceStaticsChart(){
       if(!this.device_chart){
        this.device_chart = echarts.init(document.getElementById('bayonet_statics_sort'));
      };
      // this.device_option.legend.data=['视频设备','电警','其他'];
      this.staticsSort=[{color:'#02FDF4',label:'视频设备',value:2328},{color:'#4D76F9',label:'电警',value:1232},{color:'#01D647',label:'其他',value:24}];
      this.device_option.series[0].data=[{name:'视频设备',value:2328},{name:'电警',value:1232},{name:'其他',value:24}]
      this.device_chart.setOption(this.device_option);
    },
    /**
     * 生成设备重点监测趋势echarts
     */
    initAccurCharts(){
      if(!this.accurChart){
        this.accurChart = echarts.init(document.getElementById('accurCreateChange'));
      };
      this.accurChart.setOption(this.accurChangeOption);
    },
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
   },
  }
};
</script>
<style scoped lang='scss'>
@import "@/assets/css/color.scss";
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.bayonet_statics {
  position: fixed;
  z-index: 10;
  right: 13px;
  width: 474px;
  height: 85vh;
  top: 9vh;
  color: white;
}
.bayonet_statics_container {
  width: 100%;
  height: 100%;
  // background-color: $color-bg-1;
  // border: 1px solid $color-border-1;
  .bayonet_statics_title {
    position: relative;
    width: 96%;
    // border-bottom: 0.1rem solid $color-border-1;
    font-family: Microsoft YaHei;
    font-size: 1vw;
    color: $color-white;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 2px 2% 0.6rem 2%;
    font-weight: bolder;
  }
  .bayonet_statics--tab {
  width: 100%;
  height: 5vh;

    > div {
      width: 100%;
      height: 5vh;
      font-size: 0.8vw;
      @include flex(row, center);

      .--tab-title {
        font-size: 0.9vw;
        width: 40%;
        @include flex(row, center);
      }
      .statics--tab--value {
        width: 60%;
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
  .bayonet_statics_content {
    width: 98%;
    height: 85%;
    // background-color: $color-bg-1;
    margin: 1%;
    .bayonet_statics_sort_list{
      width:50%;
      height:10vh;
      margin-top:2vh;
      float:right;
    }
    #bayonet_statics_sort {
      width:50%;
      height:15vh;
      float:left;
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
.bayonet_device-statics .top {
  margin-top: 3px;
    width: 474px;
    .back {
      height: 34px;
      font-size: 16px;
      padding-top: 5px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(0, 198, 255, 1);
      // background-color: $color-bg-1;
      // border:1px solid;
      padding-left: 17px;
      cursor: pointer;
      border-image: linear-gradient(
          182deg,
          rgba(10, 148, 255, 1),
          rgba(255, 255, 255, 0)
        )
        1 1;
      span {
        width: 53px;
        height: 18px;
        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(254, 254, 254, 1);
        padding-left: 108px;
        cursor: pointer;
      }
    }
    .title {
      height: 34px;
      font-size: 18px;
      padding-top: 5px;
      text-align: center;
      margin-bottom: 2px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(254, 254, 254, 1);
      background-color: $color-bg-1;
      border: 1px solid;
      cursor: pointer;
      border-image: linear-gradient(
          182deg,
          rgba(10, 148, 255, 1),
          rgba(255, 255, 255, 0)
        )
        1 1;
    }
    .back{
      border: 1px solid;
      background-color: $color-bg-1;
      border-image: linear-gradient(
          182deg,
          rgba(10, 148, 255, 1),
          rgba(255, 255, 255, 0)
        )
        1 1;
    }
  }
  .bottom{
    margin-top: 3vh;
    height:771px;
  }
  .number{
    width:458px;
    height:37px;
    background:rgba(3,7,30,0.6);
    border:1px solid rgba(139,142,164,1);
    line-height: 37px;
    i{
      margin-left: 14px;
      margin-right: 12px;
    }
    .x1{
      float: right;
      margin-right: 16px;
    }
  }
</style>