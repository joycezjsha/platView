<template>
  <div class="bayonet-middle">
    <div @click="change(1)">
      <m-title label="统计分析" :img_type="tableIndex==1?'1':'0'" class="car"></m-title>
    </div>
    <div @click="change(2)">
      <m-title label="多发点位" :img_type="tableIndex==2?'1':'0'" class="car"></m-title>
    </div>
    <t-area :indexData='areaIndexs' :isShowArea='showArea' :isRefreColor='isRefre'></t-area>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import mTitle from "@/components/UI_el/map_title_com.vue";
import mTab from "@/components/UI_el/tab.vue";
import blur from "../../blur.js";
import tArea from "@/components/area/area.vue";
export default {
  name: "middle",
  data() {
    return {
      tableIndex: 1,
      indexDataList: [],
      map_cover: {
        sourceList: [],
        lineList1: [], //热力图
        lineList2: [], //聚合图
        markers: [],
        popups: []
      },
      showArea: false,
      isRefre:false,
      areaIndexs: [],
      param:{stime:1,etime:null,xzqh:null}
    };
  },
  components: {
    mTitle,
    blur,
    mTab,
    tArea
  },
  mounted() {
    let that=this;
    this.map = this.$store.state.map;
    this.getAreaData();
    blur.$on('changeParam',(data)=>{
      that.param=data;
      switch(that.tableIndex){
        case 1: that.isRefre = false;that.getAreaData(data.xzqh);break;
        case 2: that.clearMap();that.getBayonetActiveDatas();break;
        default:break;
      }
    });
    blur.$on('returnAll',(data)=>{
      that.param={stime:1,etime:null,xzqh:null};
      that.map.setCenter(mapConfig.DEFAULT_CENTER);that.map.setZoom(mapConfig.DEFAULT_ZOOM);
      switch(that.tableIndex){
        case 1: that.map_cover.popups.forEach(e=>{ e.remove();});break;
        case 2: that.clearMap();that.getBayonetActiveDatas();break;
        default:break;
      }
    })
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
  },
  methods: {
    // 切换 统计分析--1  与   活跃卡口点位--2
    change(i) {
      let that = this;
      if(that.tableIndex == i) return;
      that.showArea=false;
      that.clearMap();
      that.tableIndex = i;
      switch(i){
        case 1: that.getAreaData();break;
        case 2: that.getBayonetActiveDatas();break;
        default:break;
      }
      blur.$emit('changeMapTab', that.tableIndex);
    },
    /*
     *  地图叠加统计分析
     */
    getAreaData(xzqh) {
      let that = this;
      let param={stime:this.param.stime,c_flag:1};
      if(this.param.etime) param.etime=this.param.etime;
      interf.GET_OVER_TABLE(param).then(response => {
          if (response && response.status == 200) {
          let data = response.data;
          if (data.errcode == 0) {
            let max,
              min,
              item = 0;
            that.areaIndexs = data.data.map(e => {
              e.Num = e.WFNUM;
              if (!max) {
                max = e.Num;
              } else {
                max = max < e.Num ? e.Num : max;
              }
              if (!min) {
                min = e.Num;
              } else {
                min = min > e.Num ? e.Num : min;
              }
              return e;
            });
            // that.areaList.push(max, (max - min) / 2 + min, min);
            if(that.showArea) that.isRefre = true;
            else{
               that.showArea = true;
            };
            if(xzqh && xzqh!=''){
              that.addCityMarker(xzqh);
            }
            // if (data.data.length > 0) {
              // data.data.forEach(e => {
                // that.addCityMarker(e);
              // });
            // }
          }
        }
      }) 
    },
    /*
     *显示统计分析弹框
     */
    addCityMarker(code) {
      let that=this;
      that.map_cover.popups.forEach(e=>{
        e.remove();
      });
      let e={};
      for(let i=0;i<this.areaIndexs.length;i++){
        if(this.areaIndexs[i].XZQH==code){
          e=this.areaIndexs[i];
          break;
        }
      };
      let mainDiv=document.createElement('div');
      mainDiv.style.width='8vw';
      mainDiv.style.fontSize='0.7vw';
      mainDiv.style.color='white';
      // mainDiv.style.backgroundColor='rgba(3, 12, 32, 0.74)';
      // mainDiv.style.border='1px solid rgb(42, 76, 162)';
      // mainDiv.style.fontFamily='SourceHanSansCN';
      // mainDiv.style.padding='4px 13px';
      // mainDiv.className='dev_popup';

      let title=document.createElement('p');
      title.innerHTML=e.CITYNAME;
      title.className='title';
      title.style.margin='5px 0';
     

      let closeimgDiv = document.createElement("div");
      closeimgDiv.className = "closeImgDiv";
      let closeimg = document.createElement("img");
      closeimg.src = IMG.CLOSE_IMG;
      closeimg.className = "closeImg";
      closeimgDiv.appendChild(closeimg);
      title.appendChild(closeimgDiv);
      closeimg.addEventListener("click", function() {
        that.map_cover.popups.forEach(e=>{
          e.remove();
        });
      });
      closeimg.addEventListener("mouseover", function() {
        this.setAttribute("src", IMG.CLOSE_HOVER_IMG);
      });
      closeimg.addEventListener("mouseout", function() {
        this.setAttribute("src", IMG.CLOSE_IMG);
      });

      mainDiv.appendChild(title);
      
      let p1="<p style='color:#00C6FF;margin:5px 0;'><span>超速次数：</span><span>"+e.WFNUM+"</span></p>";
      mainDiv.appendChild($(p1)[0]);

      let p2="<p style='color:#00C6FF;margin:5px 0;'><span>超速预警次数：</span><span>"+e.YJWFNUM+"</span></p>";
      mainDiv.appendChild($(p2)[0]);

      let p3="<p style='color:#00C6FF;margin:5px 0;'><span>拦截次数：</span><span>"+e.LJNUM+"</span></p>";
      mainDiv.appendChild($(p3)[0]);

      let p4="<p style='color:#00C6FF;margin:5px 0;'><span>拦截比例：</span><span>"+e.RATIO+"</span></p>";
      mainDiv.appendChild($(p4)[0]);

      //添加marker
      let lnglat = e.JWD.split(' ');
      // let marker = new minemap.Marker(mainDiv, { offset: [-25, -25] })
      //   .setLngLat(lnglat)
      //   .addTo(this.map);
      // this.map_cover.markers.push(marker);
      let popup= new minemap.Popup({closeOnClick: false, closeButton: false, offset: [0, 0],autoPan: true}).setDOMContent(mainDiv).setLngLat(lnglat).addTo(this.map);
      this.map_cover.popups.push(popup);
      // let eles= $('.minemap-marker');
      // for(let i=0;i<eles.length;i++){
      //   eles[i].style.cursor='default';
      // };
    },
    /*
     * 活跃卡口点位  Bayonet/getBayonetActive   GET_BAY_ACTIVE_API
     */
    getBayonetActiveDatas(xzqh) {
      let that = this;
      let param={stime:this.param.stime,c_flag:1};
      if(this.param.etime) param.etime=this.param.etime;
      if(this.param.xzqh) param.xzqh=this.param.xzqh;
      interf.GET_ACTIVE_BAYONET_API(param).then(response => {
          if (response && response.status == 200) {
            var data = response.data;
            if (data.errcode == 0) {
              data.data.forEach(e=>{
                that.addBayonetToMap(e);
              })
            } else {
              that.$message({
                message: '活跃卡口点位请求服务失败',
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
    addBayonetToMap(e){
      let lnglat = [e.JD,e.WD];
      let mainDiv = document.createElement("div");
      mainDiv.style.width = "16vw";
      mainDiv.style.color = "white";
      mainDiv.style.fontSize = "10px";
      // mainDiv.className='overview_popup';
      let title = document.createElement("p");
      title.innerHTML = "设备编号[" + e.SBBH + "]";
      title.style.fontSize = "10px";
      title.style.margin = "10px 0";
      mainDiv.appendChild(title);

      // let p1 =
      //   "<p style='margin:5px 0;'><span>设备编号：</span><span>" +
      //   e.SBBH +
      //   "</span></p>";
      // mainDiv.appendChild($(p1)[0]);

      let p4 =
        "<p style='color:#00C6FF;margin:5px 0;'><span>超速次数：</span><span>" +
        e.NUM +
        "</span></p>";
      mainDiv.appendChild($(p4)[0]);

      let popup = new minemap.Popup({
        closeOnClick: true,
        closeButton: true,
        offset: [-13, -30]
      });
      popup.setLngLat(lnglat).setDOMContent(mainDiv);

      let el = document.createElement("div");
      el.className = "dot_marker";
      let type='green';
      if(e.NUM>20){
        type='red';
      }else if(e.NUM>15){
        type='orange';
      }else if(e.NUM>10){
        type='yellow';
      };
      el.style.borderRadius = "50%";
      el.style["border-radius"] = "50%";
      let dot = document.createElement("div");
      dot.className = "dot dot_"+type;
      el.appendChild(dot);
      let pulse = document.createElement("div");
      pulse.className = "pulse pulse_"+type;
      el.appendChild(pulse);
      //  let pulse1 = document.createElement("div");
      // pulse1.className = "pulse1 pulse1_"+type;
      // el.appendChild(pulse1);
      let marker = new minemap.Marker(el, { offset: [-26, -20] })
        .setLngLat(lnglat)
        .addTo(this.map)
        .setPopup(popup);
      this.map_cover.markers.push(marker);
      this.map_cover.popups.push(popup);
    },
    /*##清除地图加载点、线、面、弹框*/
    clearMap() {
      //清除source
      if (this.map_cover.sourceList.length > 0) {
        this.map_cover.sourceList.forEach(e => {
          if (this.map.getSource(e) != undefined) {
            this.map.removeSource(e);
          }
        });
      }
      this.map_cover.sourceList=[];
      //清除layer
      if (this.map_cover.lineList1.length > 0) {
        this.map_cover.lineList1.forEach(e => {
          if (this.map.getLayer(e) != undefined) {
            this.map.removeLayer(e);
          }
        });
      }
      this.map_cover.lineList1=[];
      //清除layer
      if (this.map_cover.lineList2.length > 0) {
        this.map_cover.lineList2.forEach(e => {
          if (this.map.getLayer(e) != undefined) {
            this.map.removeLayer(e);
          }
        });
      }
      this.map_cover.lineList2=[];
      //清除marker
      if(this.map_cover.markers.length>0){
        this.map_cover.markers.forEach(e=>{
          e.remove();
        })
        this.map_cover.markers=[];
      }
       //清除popup框
      if(this.map_cover.popups.length>0){
        this.map_cover.popups.forEach(e=>{
          e.remove();
        })
        this.map_cover.popups=[];
      }
    }
  }
}
</script>

<style scoped  lang='scss'>
.bayonet-middle {
  position: fixed;
  top:93.5vh;
  left: 756px;
  width: 38.85vw;
  display: flex;
  .car {
    width: 199px;
    height: 39px;
    justify-content: space-around;
    line-height: 39px;
    cursor: pointer;
  }
}
</style>
