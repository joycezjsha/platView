<template>
  <div class="device-map">
    <t-area :indexData='areaIndexs' :isShowArea='showArea' :isShowTxt='isShowTxt' :method='clickAreaEvent' ref='areaModule'></t-area>
  </div>
</template>

<script>
import blur from "@/blur";
import { interf } from "./config";
import { IMG } from "./config";
import tArea from "@/components/area/area.vue";
export default {
  name: "overview_left",
    data() {
    return {
      map: {},
      tableIndex:0,
      map_cover:{
        sourceList:[],
        lineList:[],
        markers:[],
        popups:[],
        area_popups:[]
      },
      showArea:false,
      isShowTxt:false,
      areaIndexs:[]
    };
  },
  mounted() {
    let _this=this;
    this.map = this.$store.state.map;
    this.map.setCenter(mapConfig.DEFAULT_CENTER);
    setTimeout(()=>{this.getAreaData();this.getMainAcciData()},1000);
    blur.$on('cancelCityLayerStatus',function(){
      _this.cancelCityLayerStatus();
      _this.map_cover.popups.forEach(e=>{
        e.remove();
      });
    });
    blur.$on('changeCitySelect',function(data){
      _this.addCityAccident(data);
    });
  },
  components: {
    tArea
  },
  destroyed() {
    this.map.setPitch(0);
    this.clearMap();
  },
  methods: {
    /**
     * 左侧选择时间范围，地图标注时间范围内的重大警情、
     */
    initDistributionMap(data){
      this.clearMap();
      this.getAreaData(data);
      this.getMainAcciData(data);
    },
    /**
     * 显示各城市填充数据
     */
    getAreaData(data){
      let that=this;
      let params={stime:1};
      if(data){
        params.stime=data.time[0];
        params.etime=data.time[1];
      }
      interf.GET_CITY_MAP_API(params).then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
              // that.addCityAccident(data.data);
              data.data.map(e=>{
                e.Num=e.ACCIDENTNUM;
                return e;
              })
              that.areaIndexs=data.data;
              that.showArea=true;
          }else{
            that.$message({
            message: response.errmsg,
            type: "error",
            duration: 1500
          });
          }
        }
      })
      .catch(err=>{
         that.$message({
            message: '请求服务失败',
            type: "error",
            duration: 1500
          });
      })
      .finally(() => {
      });
    },
    addCityAccident(xzqh){
      let _this=this;
      _this.map_cover.area_popups.forEach(e=>{
        e.remove();
      });
      // data.map(e=>{
      //   _this.addCityPopup(e);
      // })
      if(!xzqh) return;
      let data=this.areaIndexs;
      _this.map_cover.popups.forEach(e=>{
          e.remove();
        });
      for(let i=0;i<data.length;i++){
        if(data[i].XZQH==xzqh || xzqh.indexOf(data[i].XZQH)!=-1){
          _this.addCityPopup(data[i]);
        }
      }
    },
    /**
     * 地图显示各市重大事故数量
     */
    addCityPopup(e){
      let that=this;
      let lnglat=e.JWD.split(' ');
      let mainDiv=document.createElement('div');
      mainDiv.style.width='6vw';
      mainDiv.style.fontSize='0.7vw';
      mainDiv.style.color='white';
      mainDiv.style.fontFamily='SourceHanSansCN';
      mainDiv.style.padding='4px 13px';
      // mainDiv.className='dev_popup';

      let title=document.createElement('p');
      title.innerHTML=e.CITY;
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
        that.map_cover.area_popups.forEach(e=>{
          e.remove();
        });
        that.cancelCityLayerStatus();
      });
      closeimg.addEventListener("mouseover", function() {
        this.setAttribute("src", IMG.CLOSE_HOVER_IMG);
      });
      closeimg.addEventListener("mouseout", function() {
        this.setAttribute("src", IMG.CLOSE_IMG);
      });

      mainDiv.appendChild(title);
      let p1="<p style='color:#00C6FF;margin:5px 0;'><span>事故：</span><span>"+e.ACCIDENTNUM+"</span></p>";
      mainDiv.appendChild($(p1)[0]);

     let popup=new minemap.Popup({closeOnClick: false, closeButton: true, offset: [-8, -13]});
      popup.setLngLat(lnglat).setDOMContent(mainDiv).addTo(this.map);
      this.map_cover.area_popups.push(popup);
    },
    /**
     * 获取重大事故数据
     */
    getMainAcciData(data){
      let that=this;
     let params={stime:1};
      if(data){
        params.stime=data.time[0];
        params.etime=data.time[1];
      }
      interf.GET_MAIN_ACCI_API(params).then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
              that.addMainAccident(data.data);
          }else{
            that.$message({
            message: response.errmsg,
            type: "error",
            duration: 1500
          });
          }
        }
      })
      .catch(err=>{
         that.$message({
            message: '请求服务失败',
            type: "error",
            duration: 1500
          });
      })
      .finally(() => {
      });
    },
    addMainAccident(data){
      let _this=this;
      data.map(e=>{
        _this.addMainAccidentPopup(e);
      })
    },
    /**
     * 地图显示各市重大事故数量
     */
    addMainAccidentPopup(e){
      let lnglat=e.JWD.split(' ');
      let mainDiv=document.createElement('div');
      mainDiv.style.width='18vw';
      mainDiv.style.fontSize='0.7vw';
      mainDiv.style.color='white';
      // mainDiv.className='dev_popup';

      let title=document.createElement('p');
      title.innerHTML='重大事故';
      title.className='title';
      title.style.fontSize='0.7vw';
      mainDiv.appendChild(title);

      let p1="<p style='margin:5px 0;'><span>事故编号：</span><span>"+e.SGBH+"</span></p>";
      mainDiv.appendChild($(p1)[0]);
       let p2="<p style='margin:5px 0;'><span>发生时间：</span><span>"+e.SGFSSJ+"</span></p>";
      mainDiv.appendChild($(p2)[0]);
       let p3="<p style='color:#00C6FF;margin:5px 0;'><span>事故类型：</span><span>"+e.SGLX+"</span></p>";
      mainDiv.appendChild($(p3)[0]);
       let p4="<p style='margin:5px 0;'><span>伤：</span><span>"+e.INJURY?e.INJURY:''+"</span>&nbsp;&nbsp;<span>死亡：</span><span>"+e.DIE?e.DIE:''+"</span></p>";
      mainDiv.appendChild($(p4)[0]);
      let p5="<p style='margin:5px 0;'><span>地点：</span><span>"+e.SGDD+"</span></p>";
      mainDiv.appendChild($(p5)[0]);
       let p6="<p style='margin:5px 0;'><span>所属辖区：</span><span>"+e.CITY+"</span></p>";
      mainDiv.appendChild($(p6)[0]);
       let p7="<p style='margin:5px 0;'><span>事故描述：</span><span>"+e.SGMS+"</span></p>";
      mainDiv.appendChild($(p7)[0]);
      
      let popup=new minemap.Popup({closeOnClick: true, closeButton: true, offset: [5, -5]});
      popup.setLngLat(lnglat).setDOMContent(mainDiv);

      let el = document.createElement('div');
      el.style["background-image"] = "url("+IMG.ACCI_IMG+")";
      el.style["background-size"] = "100% 100%";
      el.style.width = "32px";
      el.style.height = "32px";
      let marker = new minemap.Marker(el, {offset: [-8, -8]}).setLngLat(lnglat).addTo(this.map).setPopup(popup);
      this.map_cover.markers.push(marker);
      this.map_cover.popups.push(popup);
    },
    /**
     * 地图点击事件，回调绑定事件
     */
    clickAreaEvent(data){
      blur.$emit('setCurrentRow',data.name);
      blur.$emit('initDistributionStatics',0,data,true);
    },
    /**
     * 是否取消地图区域选中
     */
    cancelCityLayerStatus(){
      this.$refs['areaModule'].resumeLayer();
      this.map.setPitch(0);
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
      //清除marker
      if(this.map_cover.markers.length>0){
        this.map_cover.markers.forEach(e=>{
          e.remove();
        })
      }
      //清除popup框
      if(this.map_cover.popups.length>0){
        this.map_cover.popups.forEach(e=>{
          e.remove();
        })
      }
      //清除区域的popup框
      if(this.map_cover.area_popups.length>0){
        this.map_cover.area_popups.forEach(e=>{
          e.remove();
        })
      }
      this. map_cover={
          sourceList:[],
          lineList:[],
          markers:[],
          popups:[],
          area_popups:[]
        }
    },
/** */
  }
};
</script>
<style scope lang='scss'>
@import '@/assets/css/color.scss';
@mixin flex($direction,$justify,$align) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}

.device-map {
  position: fixed;
  z-index: 10;
  left: 691px;
  width: 340px;
  height: 39px;
  bottom: 15px;
  color:$color-white;
  @include flex(row,center,center);
  >div{
    @include flex(column,center,center);
    width:50%;
    height:100%;
    cursor:pointer;
  }
}

</style>
<style lang='scss'>

</style>