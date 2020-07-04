<template>
  <div class="vehicle-Belong">
    <div class="belong">
      <div class="top">
        <div class="title" v-if="showback==true">全部车辆监控</div>
        <div class="back" v-else @click="goback()">
          &lt;&lt; 返回全省
          <span>{{param.code}}</span>
        </div>
      </div>
      <div class="vehicle-main borstyle">
        <div style="position: relative;">
           <div>
            <m-title class="analysis" label="车辆归属地分析"></m-title>
           </div>
          <div class="button">
            <el-tabs v-model="fxlxName" @tab-click="handleClick" style="padding:0 15px;" >
              <el-tab-pane label="实时活跃" name="4"></el-tab-pane>
              <el-tab-pane label="今日入陕" name="1"></el-tab-pane>
              <el-tab-pane label="今日出陕" name="2"></el-tab-pane>
            </el-tabs>
            <!-- <span :class="{active: isActive == 4}" @click="change(4)">实时活跃</span>     
            <span :class="{active: isActive == 1}" @click="change(1,1)">今日入陕</span>
            <span :class="{active: isActive == 2}" @click="change(2,2)">今日出陕</span>  -->
          </div>
         
        </div>
        <div class="inout">         
            <span class="text" :class="param.provinceInorOut=='1'? 'selecttext':'noselecttext'" style="padding-left:1.5vw">
                省外: {{provinceExternal}}
                <span style="margin-left:1vw">({{provinceExternalProportion}})</span>
            </span>
            <span :class="param.provinceInorOut=='1'? 'noselecttext':'selecttext'" class="text" style="margin-left:3vw">
                省内:{{provinceWithin}}
                <span  style="margin-left:1vw">({{provinceWithinProportion}})</span>
            </span>
          <!-- 切换省内省外的div -->
          <div class="vehicle-change">
            <div @click="province(1)" class="provinces" :class="param.provinceInorOut=='1'? 'bg':'changebg'" ></div>
            <div @click="province(2)" class="city" :class="param.provinceInorOut=='1'? 'bg1':'changebg1'" ></div>
          </div>
        </div>
        <div class="vehicle-table" style="padding:0 27px;height:100%">
          <el-table
            :data="indexDatas"
            style="width: 100%"
            height="100%"
            :default-sort="{prop: 'week_radio', order: 'descending'}"
            :row-style="getRowClass"
            :header-row-style="getRowClass"
            :header-cell-style="getRowClass"
          >
            <el-table-column  type="index" label="No" width="60"></el-table-column>
            <el-table-column
              prop="YJDFZJG"
              show-overflow-tooltip
              :label="param.provinceInorOut=='1'? '省份':'城市'"
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
  name: "vehicle_belong",
  data() {
    return {
      city: "",
      fxlxName:'4', //	归属地分析  实时活跃 传4  今日入陕 出陕传2
      tableIndex:'',
      // isActive:'4', //实时活跃 4  今日入陕1  出陕2
      param:{
        stime:'4', //实时活跃 传4  今日入陕 出陕传2
        code:'', //车辆类型
        provinceInorOut: "1", //省内外  1省外  2 省内
        fxlx: "", //方向类型 1进 2出
      },
      showback: true, //是否显示返回按钮
      timeRange: "", //自定义时间
      provinceWithin: '',  //省内数量
      provinceWithinProportion: '', //省内比
      provinceExternal: '', //省外数量
      provinceExternalProportion: '' ,   //省外比
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
    this.map.setZoom(4);
    this.map.setCenter([108.967368, 34.302634]);
    let that = this;
    that.getData();
    
    that.getVehicleOwnershipDatas();        
  },
  destroyed(){
   this.clearMap()
  },
  components: {
    mTitle,
    mTab,
    blur
  },
  watch: {
  },
  methods: {
      /*
      * 切换 省内外  1省外  2 省内
      */
     province(i){
        this.param.provinceInorOut=i;
        this.getVehicleOwnershipDatas();
     },
    /*
    * 切换实时活跃 传4  今日入陕1  出陕2
    */
   handleClick(i){
     if(i.name=='1'){
       this.param.stime='2';
        this.getVehicleOwnershipDatas();
     }else{
       this.param.stime=i.name;
        this.getVehicleOwnershipDatas();
     }
    //  if(i.name=='1'){
    //    that.param.stime=='2';
    //    console.log(that.param.stime)
    //    that.getVehicleOwnershipDatas();
    //  }else{
    //    that.param.stime==i.name;
    //    console.log(that.param.stime)
    //  }

   },
  //  change(i,j){
  //      this.isActive=i;
  //      this.param.fxlx=j;
  //      if(this.isActive==1 || this.isActive==2){
  //          this.param.stime='2';
  //          this.getVehicleOwnershipDatas();
  //      }
  //      if(this.isActive==4 ){
  //         this.param.stime='4';
  //         this.getVehicleOwnershipDatas();
  //      }
  //  },
    /**
     * 接收table传过来的数据  getCity:城市
     */
    getData() {
      let that = this;
      blur.$on('realtime',data=>{
        that.tableIndex=data;
      })  
      blur.$on('getCity',data=>{
          that.param.code=data;
          that.showback = false;
          if(that.tableIndex==2){
            that.getVehicleOwnershipDatas();
          }
         
      })
    },
    // 是否显示返回
    goback() {
      let that = this;
      that.showback = true;
      that.param.stime='4';
      that.param.provinceInorOut='1';
      that.getVehicleOwnershipDatas();

    },
//  OD地图函数
    getVehicleOwnershipMapOD(itemlist){
      this.clearMap();
      var data = [] ;
      itemlist.forEach(item => {
        if(item.STARTJWD && item.ENDJWD){
          data.push([
            item.STARTJWD.split(" ")[0],item.STARTJWD.split(" ")[1],
            item.ENDJWD.split(" ")[0],item.ENDJWD.split(" ")[1],
            item.STRATNAME,item.ENDNAME,item.NUM
          ]) 
        }     
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
        this.map_cover.popups.push(echartslayer)
    },
//
    /*
    *归属地分析-车辆归属地OD地图也是用的这个接口 KeyVehicle/getVehicleOwnership GET_OWN_SHIP_API
    *右侧列表数据 fxlx	1 进 2出   provinceInorOut	1 省外  2省内
    */
    getVehicleOwnershipDatas(){
      let that = this;
      let getBelongData={};
      //  如果是默认显示
      // 请求数据 实时活跃&省外   实时活跃 stime=4  provinceInorOut=1  1省外 
      getBelongData.stime=that.param.stime;
      getBelongData.provinceInorOut=that.param.provinceInorOut;
      if(that.param.fxlx!='' ){
         getBelongData.fxlx=that.param.fxlx;
        //  如果选择车辆类型和方向类型 1进 2出  传入code，fxlx参数
      }
      if(that.param.code!=''){
        getBelongData.code=that.param.code;
      }
        interf.GET_OWN_SHIP_API(getBelongData).then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              that.provinceWithin = data.data.provinceWithin;
              that.provinceExternal = data.data.provinceExternal;
              that.provinceWithinProportion =
              data.data.provinceWithinProportion;
              that.provinceExternalProportion =
              data.data.provinceExternalProportion;
              that.indexDatas = data.data.dataList;
              if(that.indexDatas.length>0){
                that.getVehicleOwnershipMapOD(that.indexDatas) 
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
.vehicle-Belong .belong {
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
  .vehicle-main {
    height: 951px;
    // background-color: $color-bg-1;
    // border: 1px solid;
    // border-image: linear-gradient(
    //     182deg,
    //     rgba(10, 148, 255, 1),
    //     rgba(255, 255, 255, 0)
    //   )
    //   1 1;
    .analysis {
      width: 8.5vw;
      height: 3vh;
    }
    .inout {
      display: flex;
      width: 100%;
      height: 30px;
      position: absolute;
      top:14.5vh;
      .text{
        flex: 1;
      }
      .selecttext{
        color:rgba(255,255,255,1);
      }
      .noselecttext{
        color:rgba(166,175,205,1);
      }
    }
  }
}
.vehicle-change {
  position: absolute;
  top:3vh;
  left: 0;
  display: flex;
  padding: 0 30px;
  .provinces {
    width: 213px;
    height: 32px;
    // background: rgba(0, 198, 255, 1);
    margin-top: 1vh;
    cursor: pointer;
    flex: 1;
    margin-right: 2px;
  }
}
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
.vehicle-Belong .city {
  width: 207px;
  height: 32px;
  margin-top: 1vh;
  cursor: pointer;
  flex: 1;
}
.vehicle-main .button {
    margin-top: 5px;
    position: absolute;
    top:3vh;
    right: 0;
    span{
        border: 1px solid white;
        background: #aeaeae;
        color: #66718b;
        padding:5px;
        font-size: 13px;
        border-radius: 2px;
        cursor: pointer;
    }
    .active{
    background-color:#0079fe;
    color: #efddfe;
    cursor:pointer;
    }
}
.vehicle-Belong .vehicle-table{
    width: 90%;
    position: absolute;
    top:23vh;
    left: 0;
}
</style>