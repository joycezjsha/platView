<template>
  <div id='vehicle_hotcard-modal'>
    <div id="map" style=' width: 100%; height: 100%;'></div>
    <div class="hotcard">
        <div class="top">
          <div class="title" v-if="showback==true" >全部车辆监控</div>
            <div class="back" v-else @click="goback()" >&lt;&lt; 返回全省
              <span> {{code}}</span>
          </div>
        </div>
        <div class="hotroad" style="height:41.29vh;">
          <m-title class="titletext"  label='热点道路排名' ></m-title>
          <div class="padding">
            <div class="table">
              <el-table :data="indexDatas"
            style="width: 100%" height="90%" :default-sort = "{prop: 'innum', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
                  <el-table-column fixed type="index" label="No" width="60"></el-table-column>
                  <el-table-column show-overflow-tooltip prop="road"   label="道路"></el-table-column>
                  <el-table-column  prop="innum" label="进入辆次" sortable></el-table-column>
                  <el-table-column  prop="outnum" label="流出辆次" sortable></el-table-column>
              </el-table>
            </div> 
          </div>
        </div>
        <div  class="hotroad" style="margin-top:2vh;height:40vh;">
          <m-title class="titletext"  label='热点卡口排名' ></m-title>
          <div  class="padding"> 
            <div  class="table">
              <el-table :data="indexDatas1"
            style="width: 100%" height="90%" :default-sort = "{prop: 'NUM', order: 'descending'}" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
                  <el-table-column  fixed type="index" label="No" width="60"></el-table-column>
                  <!-- <div v-if="showCity==null">
                       <el-table-column show-overflow-tooltip prop="KKMC"   label="卡口名称"></el-table-column>
                  </div>  :formatter="userTypeList"  -->
                  <div>
                      <el-table-column 
                      show-overflow-tooltip prop='city,KKMC'   label="卡口名称">
                        <template slot-scope="scope"> 
                            <span v-if="scope.row.city!=null">{{`[`+scope.row.city+`]`}}</span>
                            <span>{{scope.row.KKMC}}</span>
                        <!-- [{{scope.row.city}}]{{scope.row.KKMC}} -->
                        </template>
                      </el-table-column>
                  </div>
                  <el-table-column  prop="NUM" label="过车辆" sortable></el-table-column>     
              </el-table>
            </div>
          </div>       
        </div>
    </div>
  </div>
    
</template>

<script>
import mTitle from "@/components/UI_el/title_com.vue";
import mTab from '@/components/UI_el/tab.vue';
import blur from '../../blur.js';
import { IMG } from "./config";
import { interf } from "./config";
export default {
    name:'vehicle_hotcard',
    data(){
        return{
          poPupList:[], //熱點卡口界面popup存儲
          showback:true, //是否显示返回按钮
          code:'',
          stime:'1',
          xzqh:'',
          showCity:true,  //用于判断table中的城市与卡口名称拼接
          timeRange:'', //自定义时间
          showhotcard:false,
          map_cover:{
          // sourceList:[],
          // lineList:[],
            popups:[],
            markers:[]
          },
          indexDatas: [
            {"road":"","index":"","innum":"","outnum":""}
            ],
            indexDatas1: [
            {"KKMC":"","index":"","NUM":"","city":""}
            ],
          
        }
    },
    components:{
        mTitle,
        mTab,
        blur
    },
    mounted(){
      this.map=this.$store.state.map;
      this.map.setCenter([108.967368, 34.302634]);
      this.map.setZoom(11);
       let that = this;
       that.$store.commit("setRight", '26.5vw');
       that.getData()
       that.getHotspotRoadRankinDatas();
       that.getHotspotBayonetRankingDatas();
    },
    destroyed(){
      this.clearMap();
    },
    methods:{
      /**
       * 点击返回按钮
       */
      goback(){
        let that=this;
        that.showback=true;
        that.getHotspotRoadRankinDatas();
        that.getHotspotBayonetRankingDatas();

      },
      /**
       * 接收table传过来的数据 
       */
     getData() {
      let that = this;
      blur.$on('getCity',data=>{
          that.code=data;
          that.showback = false;
          that.getHotspotRoadRankinDatas(that.code)
          that.getHotspotBayonetRankingDatas(that.code)
      })
    },
      /**
       * 热点卡口地图
       */     
      getHotspotBayMapData(item){
        let itemlist=[];
        itemlist.push(item.JWD.split(" ")[0],item.JWD.split(" ")[1],);
        // console.log(itemlist)
        let lnglat = [itemlist[0],itemlist[1]];
        let el = document.createElement('div');
        let el1 = document.createElement('div'); //
        // el.style.border='1px solid rgba(42, 76, 162, 1)';
        // el.style.borderRadius='2px';
        el.style.backgroundColor='rgba(3,12,32,0.74)';
        el.style.width='218px';
        el.style.height='130px';
        // el.style["padding"] = "10px 10px";
        el.className = 'custom-popup-class'; //custom-popup-class为自定义的css类名
        el1.id = 'marker'; //
        // el1.style["border"] = "solid 1px #D01828"; // if(item.addIn<0) span2.style.color='#00DEC7';
        el1.style.width='17px';
        el1.style.height='17px';
        el1.style.borderRadius='50%';
        if(item.NUM>0) el1.style.backgroundColor='#D01828';
        if(item.NUM<0) el1.style.backgroundColor='#00b429';

        let d1 = document.createElement('div');
       if(item.city){
          let citySpan= document.createElement('span');
          citySpan.innerHTML=`[${item.city}]-`; 
          d1.appendChild(citySpan);
        } 
        let KKMCspan=document.createElement('span');  
        KKMCspan.innerHTML = item.KKMC;
        d1.appendChild(KKMCspan); 
        d1.style.color = "rgba(255,255,255,1)";
        d1.fontFamily='Source Han Sans CN';
        d1.style.marginBottom='5px';
        el.appendChild(d1);
        
        let d2 = document.createElement('div');
        let span1= document.createElement('span'); 
        let span2= document.createElement('span'); 
        span1.innerHTML='设备ID :  ';
        span2.innerHTML=item.KKBH;
        d2.fontFamily='Source Han Sans CN';
        d2.style.color = "rgba(255,255,255,1)";
        d2.appendChild(span1)
        d2.appendChild(span2)
        el.appendChild(d2);

        let d3 = document.createElement('div');
        let span3= document.createElement('span'); 
        let span4= document.createElement('span'); 
        span3.innerHTML='地点 :  ';
        span4.innerHTML=item.DLMC;
        d3.fontFamily='Source Han Sans CN';
        d3.style.color = "rgba(255,255,255,1)";
        d3.appendChild(span3)
        d3.appendChild(span4)
        el.appendChild(d3);

         //如果没有方向，就不需要创建d4
        if(item.KKJC) {
          let d4= document.createElement('div');
          let span5= document.createElement('span'); 
          let span6= document.createElement('span'); 
          span5.innerHTML='方向 :  ';
          span6.innerHTML=item.KKJC;
          d4.fontFamily='Source Han Sans CN';
          d4.style.color = "rgba(255,255,255,1)";
          d4.appendChild(span5)
          d4.appendChild(span6)
          el.appendChild(d4);
        }
        
        let d5= document.createElement('div');
        let span7= document.createElement('span'); 
        let span8= document.createElement('span'); 
        span7.innerHTML='过车辆 :  ';
        span8.innerHTML=item.NUM;
        d5.fontFamily='Source Han Sans CN';
        d5.style.color = "rgba(0,198,255,1)";
        d5.appendChild(span7)
        d5.appendChild(span8)
        el.appendChild(d5);
        let popup= new minemap.Popup({closeOnClick: false, closeButton: false, offset: [0, 0]})
        .setLngLat(lnglat)
        .setDOMContent(el)
        .addTo(this.map);
        this.map_cover.popups.push(popup)
        // (".minemap-popup-tip").style.background='red';
        let lnglat1 = [itemlist[0],itemlist[1]];
        let marker = new minemap.Marker(el1, {offset: [-8,0]}).setLngLat(lnglat1).addTo(this.map);
        this.map_cover.markers.push(marker);

      },
      /*
      *热点卡口数据 KeyVehicle/getHotspotBayonetRanking  GET_HOT_BAY_RANK_API
      */
     getHotspotBayonetRankingDatas(code){
        let that=this;
        let HotspotBayonetData={};
         // 如果默认显示，没有任何参数
        if(code===undefined){
            HotspotBayonetData={};
        }else{
            HotspotBayonetData.code=code;
        }
        // 发送请求
        interf.GET_HOT_BAY_RANK_API(HotspotBayonetData)
        .then(response=>{
            if (response && response.status == 200){
            var data = response.data;
                if(data.errcode == 0){
                    that.indexDatas1=data.data;
                    // console.log(that.indexDatas1)
                    that.indexDatas1.forEach(e=>{
                        // if(e.city!=null){
                        //     that.showCity=false;
                        // }
                    })
                        if(that.indexDatas1.length>0){

                        // 清除上一次的popups
                        // if(this.map_cover.popups.length>0){
                        //   this.map_cover.popups.forEach(e=>{
                        //     e.remove();
                        //   })
                        // }
                        //  调用卡口地图方法
                        that.indexDatas1.forEach(element => {
                        that.getHotspotBayMapData(element)
                        // console.log(element)
                        });
                    }
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
       * 热点道路  KeyVehicle/getHotspotRoadRankin  GET_HOT_ROAD_RANK_API
      */
     getHotspotRoadRankinDatas(code){
        let that=this;
        let HotspotRoandData={};
        // 如果默认显示，没有任何参数
        if(code===undefined){
            HotspotRoandData={};
        }else{
            HotspotRoandData.code=code;
        }
        // 发送请求
        interf.GET_HOT_ROAD_RANK_API(HotspotRoandData)
        .then(response=>{
            if (response && response.status == 200){
            var data = response.data;
            // console.log(data)
                if(data.errcode == 0){
                    that.indexDatas=data.data;
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
      /*##清除地图加载点、线、面、弹框*/
      clearMap(){
        //清除source
        // if(this.map_cover.sourceList.length>0){
        //   this.map_cover.sourceList.forEach(e=>{
        //     if(this.map.getSource(e)!=undefined){
        //       this.map.removeSource(e);
        //     }
        //   })
        // }
        // //清除layer
        // if(this.map_cover.lineList.length>0){
        //   this.map_cover.lineList.forEach(e=>{
        //     if(this.map.getLayer(e)!=undefined){
        //       this.map.removeLayer(e);
        //     }
        //   })
        // }
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
      //设置表格样式
      getRowClass({ row, column, rowIndex, columnIndex }) {
        return "background:transparent;";
      },
    }
}
</script>

<style  scope lang='scss'>
@import "@/assets/css/color.scss";
@import "../../assets/css/base.css";
.hotcard{
    position: fixed;
    top: 9.388vh;
    right:13px;
    width:24.6875vw;
    height: 100%;
    .top{
      width: 100%;
      .back{
        height:34px;
        font-size:16px;
        padding-top: 5px;
        font-family:Source Han Sans CN;
        font-weight:400;
        color:rgba(0,198,255,1);
        background-color: $color-bg-1;
        border:1px solid;
        padding-left: 17px;
        cursor:pointer;
        border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
        span{
          width:53px;
          height:18px;
          font-size:18px;
          font-family:Source Han Sans CN;
          font-weight:400;
          color:rgba(254,254,254,1);
          padding-left: 108px;
          cursor:pointer;
        }
      }
     .title{
        height:34px;
        font-size:18px;
        padding-top: 5px;
        text-align: center;
        font-family:Source Han Sans CN;
        font-weight:400;
        color:rgba(254,254,254,1);
        background-color: $color-bg-1;
        border:1px solid;
        cursor:pointer;
        border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
      }
    }
    .titletext{
      width: 8vw;
      height:31px;
    }
    .hotroad{
      height: 41.29vh;
      background-color: $color-bg-1;
      border:1px solid;
      border-image:linear-gradient(182deg, rgba(10,148,255,1), rgba(255,255,255,0)) 1 1;
      .padding{
        padding:0 1.5vw;
        .table{
          height: 41vh;
        }
      }
      
    }
}
</style>

