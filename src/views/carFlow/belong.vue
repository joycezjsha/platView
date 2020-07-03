<template>
  <div class="carFlowBelong ">
    <!-- 中间的OD地图 -->
    <!-- <div class="carmapOD" id="map"></div> -->
    <div class="belong">
      <div class="top">
        <div class="title" v-if="showback==true">全部车辆监控</div>
        <div class="back" v-else @click="goback()">
          &lt;&lt; 返回全省
          <span>{{city}}</span>
        </div>
      </div>
      <div class="carFlow-main boxstyle">
        <div>
          <m-title class="analysis" label="车辆归属地分析"></m-title>
        </div>
        <div class="inout">
          <div class="left">
            <div style="padding-left:4.89vw" @click="changeIn(1)" class="inouttext">进入</div>
            <div :class="fxlx==1? 'showline':'line'"></div>
            <div class="protext">
              <span   :class="provinceInorOut=='1'? 'isSelected': 'noSelect'" style="padding-left:1.5vw;" >
                省外: {{belongData.provinceExternal}}
                <span>({{belongData.provinceExternalProportion}})</span>
              </span>
            </div>
          </div>
          <div class="right">
            <div style="padding-left:4.89vw" @click="changeIn(2)" class="inouttext">流出</div>
            <div style :class="fxlx==2? 'showline':'line'"></div>
            <div class="protext">
              <span  :class="provinceInorOut=='2'? 'isSelected': 'noSelect'"  style="margin-right:1vw">
                省内: {{belongData.provinceWithin}}
                <span> ({{belongData.provinceWithinProportion}})</span>
              </span>
            </div>
          </div>
          <!-- 切换省内省外的div  1--省外 2--省内-->
          <div class="change">
            <div @click="province(1)" class="provinces" :class="provinceInorOut=='1'? 'bg': 'changebg'"></div>
            <div @click="province(2)" class="city"  :class="provinceInorOut=='1'? 'bg1': 'changebg1'"></div>
          </div>
        </div>
        <div class="belong-table" style="padding:0 2vw;height:100%;marfin-top:3vh">
          <el-table
            :data="indexDatas"
            style="width: 100%"
            height="100%"
            :default-sort="{prop: 'NUM', order: 'descending'}"
            :row-style="getRowClass"
            :header-row-style="getRowClass"
            :header-cell-style="getRowClass"
          >
            <el-table-column  type="index" label="No" width="60"></el-table-column>
            <el-table-column
              prop="YJDFZJG"
              show-overflow-tooltip
              :label="provinceInorOut=='1'? '省份':'城市'"
            ></el-table-column>
            <el-table-column prop="NUM" label="辆次" sortable></el-table-column>
            <el-table-column prop="proportion" label="比例" sortable></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mTitle from "@/components/UI_el/title_com.vue";
import mTab from "@/components/UI_el/tab.vue";
import blur from "../../blur.js";
import { IMG } from "./config";
import { interf } from "./config";
export default {
  name: "belong",
  data() {
    return {
      city: "",
      stime: "1",
      xzqh: "",
      isZoom:'',
      tableIndex:'',
      provinceInorOut: "1", //省份 1  城市2
      fxlx: "1", //进入1  流出2
      showback: true, //是否显示返回按钮
      timeRange: "", //自定义时间
      belongData: {
        provinceWithin: null,
        provinceWithinProportion: null,
        provinceExternal: null,
        provinceExternalProportion: null
      },
      indexDatas: [],
      belongList:[] , //存放OD图
      map_cover:{
        sourceList:[],
        markers:[],
        lineList:[],
        popups:[]
      }
    };
  },
  mounted() {
    this.map=this.$store.state.map;
    this.map.setCenter([108.967368, 34.302634]);
    this.map.setZoom(6);
    let that = this;
    that.getData();
    that.getBelongData();      
  },
  destroyed(){
    // this.clearBelongMap()
    
  },
  components: {
    mTitle,
    mTab,
    blur
  },
  methods: {
    /**
    * 接收table传过来的数据
    */
    getData() {
      let that = this;
      blur.$on('realtime',data=>{
        that.isZoom=data;
        that.tableIndex=data;
      })
      // blur.$on('realtime',data=>{
      //   that.tableIndex=data;
      // })
      blur.$on("sendTime", data => {
        that.getBelongData();
      });
      /** 接收table传过来的数据 gettime  传入对应的时间 1  2  3  4  时间格式为 timer1 2020-06-10 timer2  2020-06-10
      * determine：自定义时间  paramcity ：某个城市 paramxzqh 行政区划
      */
      blur.$on("paramxzqh", xzqh => {
        that.xzqh = xzqh;
        // if(that.tableIndex=='2'){
          that.getBelongData();
        // }
       
      });

      blur.$on("gettime", time => {
        that.stime = time;
        // if(that.tableIndex=='2'){
          that.getBelongData();
        // }
      });
      blur.$on("determine", times => {
        that.timeRange = times;
        // if(that.tableIndex=='2'){
          that.getBelongData();
        // }
      });
      //
      blur.$on("paramcity", city => {
        that.city = city;
        if (city !='') {
          that.showback = false;
        }
      });
      
    },
    clearBelongMap(){
      this.belongList.map(item=>{  
        item.remove();
        this.belongList=[];
      })
    },
    // 是否显示返回
    goback() {
      let that = this;
      that.showback = true;
      that.fxlx="1";
      that.stime='1';
      that.provinceInorOut="1";
      that.xzqh='';
      that.getBelongData();
    },
    //  OD地图函数
    getCityMapOD(itemlist){
      // this.clearMap();
      var data = [] ;
      itemlist.forEach(item => {
        data.push([
          item.STARTJWD.split(" ")[0],item.STARTJWD.split(" ")[1],
          item.ENDJWD.split(" ")[0],item.ENDJWD.split(" ")[1],
          item.STRATNAME,item.ENDNAME,item.NUM]) 
          });
        var scatterData = [];
        var lineData = [];
        var min = Number.MAX_VALUE;
        var max = Number.MIN_VALUE;
      for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var name = item[4];
            var dest = item[5];
            var count = item[6];

            if (count < min) {
                min = count;
            }
            if (count > max) {
                max = count;
            }
            scatterData.push({
                name: dest,
                count: count,
                value: item.slice(2, 4)
            })
            lineData.push({
                name: name,
                count: count,
                dest: dest,
                coords: [item.slice(0, 2), item.slice(2, 4)]
            });
      }
      var series = [{
            name: 'bgLine',
            type: 'lines',
            coordinateSystem: 'GLMap',
            zlevel: 1,
            lineStyle: {
                normal: {
                    color: '#03825d',
                    width: 2,
                    opacity: 0.5,
                    curveness: 0.2
                }
            },
            data: lineData
        }, {
            name: 'scatter',
            type: 'scatter',
            coordinateSystem: 'GLMap',
            zlevel: 2,

            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                }
            },
            symbolSize: 10,
            itemStyle: {
                normal: {
                    show: true,
                    color: '#03825d'
                }
            },
            data: scatterData
        }, {
            name: 'sLine',
            type: 'lines',
            coordinateSystem: 'GLMap',
            zlevel: 3,
            effect: {
                show: true,
                period: 6,
                trailLength: 0.4,
                symbolSize: 4
            },
            lineStyle: {
                normal: {
                    color: '#04b06e',
                    width: 0,
                    curveness: 0.2
                }
            },
            data: lineData
        }, {
            name: 'lLine',
            type: 'lines',
            coordinateSystem: 'GLMap',
            zlevel: 4,
            effect: {
                show: true,
                period: 6,
                trailLength: 0.4,
                opacity: 0.08,
                symbolSize: 15
            },
            lineStyle: {
                normal: {
                    color: '#04b06e',
                    width: 0,
                    curveness: 0.2
                }
            },
            data: lineData
        }
        ];
        var option = {
            GLMap: {
                roam: true
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(0,0,0,0)',
                formatter: function (param) {
                    return param.data.name + '->' + param.data.dest + ': ' + param.data.count;
                }
            },
            series: series
        };
        var echartslayer = minemap.Template.create({map: this.map, type: 'od'});
        echartslayer.chart.setOption(option);
        this.belongList.push(echartslayer)
        // this.map_cover.lineList.push(echartslayer)
    },

    // 车辆归属地分析  右侧列表数据 fxlx	1 进 2出   provinceInorOut	1 省外  2省内
    getBelongData(){
      let that = this;
      let BelongData={};
      BelongData.stime=that.stime;
      BelongData.fxlx=that.fxlx;
      BelongData.provinceInorOut=that.provinceInorOut;
      if(that.xzqh!=''){
        BelongData.xzqh=that.xzqh;
      }
      if(that.timeRange!=''){
        BelongData.stime=that.timeRange[0];
        BelongData.etime=that.timeRange[1];
      }
        interf.GET_BELONG_API(BelongData)
        .then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            console.log(data);
            if (data.errcode == 0) {
              that.belongData.provinceWithin = data.data.provinceWithin;
              that.belongData.provinceExternal = data.data.provinceExternal;
              that.belongData.provinceWithinProportion =
              data.data.provinceWithinProportion;
              that.belongData.provinceExternalProportion =
              data.data.provinceExternalProportion;
              that.indexDatas = data.data.dataList;
              console.log(that.belongData);
              if(that.indexDatas.length>0){
                that.getCityMapOD(that.indexDatas) 
              }
            } else {
              that.$message({
                message: data.errmsg,
                type: "error",
                duration: 1500
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          that.tableLoading = false;
        });
    },
    // 车辆归属地分析，根据进入 流出 和 省内，省外获取对应的 数据
    province(provinceInorOut) {
      let that = this;
      that.provinceInorOut = provinceInorOut;
      // 如果没有xzqh 
      if(that.xzqh==''){
        that.getBelongData(that.stime)
      }else{
        that.getBelongData(that.stime,that.xzqh)
      }
    },
    // 车辆流动页面  归属地分析  Vehicle/getVehicleOwnership  // 进入 流出数据
    changeIn(fxlx) {
      let that = this;
      that.fxlx = fxlx;
      // 如果没有xzqh 
      if(that.xzqh==''){
        that.getBelongData(that.stime)
      }else{
        that.getBelongData(that.stime,that.xzqh)
      }
    },
    //设置表格样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return "background:transparent;";
    },
    /*##清除地图加载点、线、面、弹框*/
  clearMap(){
    //清除source
    if(this.map_cover.sourceList.length>0){
      this.map_cover.sourceList.forEach(e=>{
        if(this.map.getSource(e)!=undefined){
          this.map.removeSource(e);
        }
      })
    }
    //清除layer
    if(this.map_cover.lineList.length>0){
      this.map_cover.lineList.forEach(e=>{
        if(this.map.getLayer(e)!=undefined){
          this.map.removeLayer(e);
        }
      })
    }
    //清除popup
    if(this.map_cover.popups.length>0){
      this.map_cover.popups.forEach(e=>{
        e.remove();
      })
    }
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

<style scoped lang='scss'>
@import "@/assets/css/color.scss";
.carmapOD {
  width: 746px;
  height: 589px;
  position: fixed;
  top: 209px;
  left: 588px;
  margin-bottom: 114px;
}
.carFlowBelong .belong {
  position: fixed;
  top: 9.388vh;
  right: 13px;
  width: 24.6875vw;
  height: 100%;
  box-sizing: border-box;
  .top {
    width: 100%;
    .back {
      height: 34px;
      font-size: 16px;
      padding-top: 5px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(0, 198, 255, 1);
      background-color: $color-bg-1;
      border:1px solid;
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
  }
 .carFlow-main {
    height: 951px;
    .analysis {
      width: 8.5vw;
      height: 3vh;
    }

    .inout {
      display: flex;
      width: 100%;
      height: 15.2vh;
      position: relative;
      .left,
      .right {
        height: 60px;
        .inouttext {
          width: 160px;
          height: 14px;
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(0, 198, 255, 1);
          line-height: 60px;
          margin-bottom: 4.5vh;
          cursor: pointer;
        }
        .protext {
          width: 9.68vw;
          height: 1vh;
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          // color: rgba(255, 255, 255, 1);
          margin-bottom: 3vh;
          margin-top: 1vh;
          
        }
        .showline {
          width: 160px;
          height: 2px;
          background: #00c6ff;
          margin-left: 1.4583vw;
        }
        .line {
          width: 160px;
          height: 2px;
          margin-left: 1.4583vw;
          // background: chartreuse;
        }
      }
    }
  }
}
.isSelected{
  color:rgba(255,255,255,1);
}
.noSelect{
  color:rgba(166,175,205,1);
}
.carFlowBelong .change {
  position: absolute;
  top: 60px;
  left: 0;
  display: flex;
  padding: 0 30px;
  .bg{
    // border:1px solid #ffffff;
    background: #00C6FF;
  }
  .bg1{
    background: #265E45;
  }
  .changebg{
     background:#0473B2;
  }
  .changebg1{
    background: #0DD77D;
  }
  
}
.provinces {
  width: 213px;
  height: 32px;
  // background: rgba(0, 198, 255, 1);
  margin-top: 4vh;
  cursor: pointer;
  flex: 1;
  margin-right: 2px;
}
.city {
  width: 207px;
  height: 32px;
  // background: rgba(38, 94, 69, 1);
  margin-top: 4vh;
  cursor: pointer;
  flex: 1;
}
// .carFlowBelong .belong-table{
//   position: absolute;
//   top:3vh;
// }
</style>