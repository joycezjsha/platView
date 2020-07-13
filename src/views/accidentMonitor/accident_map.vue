<template>
  <div class="accident-map">
    <div class='accident-map--legend'>
      <ul>
        <li v-for='(item,index) in areaList' :key='index'>{{item}}</li>
      </ul>
      <div class='legend'></div>
    </div>
    <div class='accident-map--icon'>
      <ul>
        <li><div>警情</div><div><img :src='jqImg' /></div></li>
        <li><div>事故</div><div @click='showOrhideConstru'><img :src='sgImg' /></div></li>
      </ul>
    </div>
    <t-area :indexData='areaIndexs' :isShowTxt='isShowTxt' :isShowArea='showArea' :method='clickAreaEvent'></t-area>
    <!-- <t-area v-if='showArea' :indexData='areaIndexs' :isShowArea='showArea' :isShowTxt='isShowTxt'></t-area> -->
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
      isShowTxt:false,
      tableIndex:0,
      map_cover:{
        sourceList:[],
        lineList:[],
        markers:[],
        popups:[],
        cons_markers:[],
        cons_popups:[]
      },
      showArea:false,
      areaIndexs:[],
      jqImg:IMG.jqImg,
      sgImg:IMG.SG_UNCHECK_IMG,
      areaList:[],
      ConstructionData:[],
      showConstruction:false
    };
  },
  mounted() {
    this.map = this.$store.state.map;
    this.map.setCenter([109.278987,35.747334]);
    setTimeout(()=>{this.getAreaData();this.getConstructionData()},1000);
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
      this.getConstructionData(data);
    },
    /**
     * 显示各城市填充数据
     */
    getAreaData(data){
      let that=this;
      let params={stime:1};
      that.areaIndexs=[];
      if(data){
        params.stime=data.time[0];
        params.etime=data.time[1];
      }
      interf.GET_MAP_CITY_ACCI_API(params).then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
            that.addCityAccident(data.data);
            let max,min,datas=[];
              data.data=data.data.map(e=>{
                e.Num=e.NUM;
                if(!max){
                  max=e.Num;
                }else{
                  max=max<e.Num?e.Num:max;
                }
                if(!min){
                  min=e.Num;
                }else{
                  min=min>e.Num?e.Num:min;
                };
                return e;
              });
              that.areaIndexs=data.data;
              that.areaList.push(max,(max-min)/2+min,min);
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
    addCityAccident(data){
      let _this=this;
      data.map(e=>{
        _this.addCityPopup(e);
      })
    },
    /**
     * 地图显示各市警情数量
     */
    addCityPopup(e){
      let lnglat=e.jwd.split(' ');
      let mainDiv=document.createElement('div');
      mainDiv.style.width='6vw';
      mainDiv.style.fontSize='0.7vw';
      mainDiv.style.color='white';
      mainDiv.style.backgroundColor='rgba(3, 12, 32, 0.74)';
      mainDiv.style.border='1px solid rgb(42, 76, 162)';
      mainDiv.style.fontFamily='SourceHanSansCN';
      mainDiv.style.padding='4px 13px';
      // mainDiv.className='dev_popup';

      let title=document.createElement('p');
      title.innerHTML=e.NAME;
      title.className='title';
      title.style.margin='5px 0';
      mainDiv.appendChild(title);

      let p1="<p style='color:#00C6FF;margin:5px 0;'><span>警情：</span><span>"+e.NUM+"</span></p>";
      mainDiv.appendChild($(p1)[0]);
      
      // let popup=new minemap.Popup({closeOnClick: false, closeButton: true, offset: [-8, -13]});
      // popup.setLngLat(lnglat).setDOMContent(mainDiv).addTo(this.map);

      // let el = document.createElement('div');
      // // el.style["background-image"] = "url(./static/images/"+(e.KKZT>1?"kakou":"kakou_")+".png)";
      // // el.style["background-size"] = "100% 100%";
      // el.style.width = "8px";
      // el.style.height = "8px";
      // el.style["border-radius"] = "50%";
      // el.style.backgroundColor='red';
      let marker = new minemap.Marker(mainDiv, {offset: [-8, -8]}).setLngLat(lnglat).addTo(this.map);
      this.map_cover.markers.push(marker);
      // this.map_cover.popups.push(popup);
    },
    /**
     * 获取施工数据
     */
    getConstructionData(){
      let that=this;
      interf.GET_MAP_CONSTRUCTION_API({}).then(response=>{
        if (response && response.status == 200){
          var data = response.data;
          if (data.errcode == 0) {
             that.ConstructionData=data.data;
             if(that.showConstruction){
               that.addConstruction();
             }
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
    /**
     * 显示或隐藏施工图层
     */
    showOrhideConstru(){
      this.showConstruction=!this.showConstruction;
      if(this.showConstruction){
        this.addConstruction();
        this.sgImg=IMG.SG_IMG;
      }else{
        this.sgImg=IMG.SG_UNCHECK_IMG;
         //清除marker
        if(this.map_cover.cons_markers.length>0){
          this.map_cover.cons_markers.forEach(e=>{
            e.remove();
          })
        }
        this.map_cover.cons_markers=[];
        //清除popup框
        if(this.map_cover.cons_popups.length>0){
          this.map_cover.cons_popups.forEach(e=>{
            e.remove();
          })
        }
        this.map_cover.cons_popups=[];
      }
    },
    addConstruction(){
      let _this=this;
      if(_this.ConstructionData && _this.ConstructionData.length>0){
        _this.ConstructionData.map(e=>{
          _this.addMainAccidentPopup(e);
        })
      };
    },
    /**
     * 地图显示施工图层
     */
    addMainAccidentPopup(e){

      let lnglat=e.EventCoordinate.split(' ');
      let mainDiv=document.createElement('div');
      mainDiv.style.width='13vw';
      mainDiv.style.fontSize='0.7vw';
      mainDiv.style.color='white';
      // mainDiv.className='dev_popup';

      let title=document.createElement('p');
      title.innerHTML='道路施工';
      title.className='title';
      title.style.fontSize='0.7vw';
      mainDiv.appendChild(title);

      let p1="<p style='margin:5px 0;'><span>所属城市：</span><span>"+e.nameCN+"</span></p>";
      mainDiv.appendChild($(p1)[0]);
       let p2="<p style='margin:5px 0;'><span>描述：</span><span>"+e.EventDescription+"</span></p>";
      mainDiv.appendChild($(p2)[0]);

      let popup=new minemap.Popup({closeOnClick: true, closeButton: true, offset: [5, -5]});
      popup.setLngLat(lnglat).setDOMContent(mainDiv);

      let el = document.createElement('div');
      el.style["background-image"] = "url("+IMG.SG_IMG+")";
      el.style["background-size"] = "100% 100%";
      el.style.width = "32px";
      el.style.height = "32px";
      let marker = new minemap.Marker(el, {offset: [-8, -8]}).setLngLat(lnglat).addTo(this.map).setPopup(popup);
      this.map_cover.cons_markers.push(marker);
      this.map_cover.cons_popups.push(popup);
    },
    /**
     * 地图点击事件，回调绑定事件
     */
    clickAreaEvent(data){
      blur.$emit('setCurrentCityRow',data.name);
      blur.$emit('initAccidentStatics',0,data);
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
      this. map_cover={
          sourceList:[],
          lineList:[],
          markers:[],
          popups:[]
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

.accident-map {
  position: fixed;
  z-index: 10;
  left: 500px;
  width: 108px;
  height: 280px;
  bottom: 13px;
  padding:20px 15px;
  background-color:#010416;
  color:$color-white;
  // @include flex(column, center,center);
  &--legend{
    width:100%;
    height:180px;
    ul{
      padding: 0 20px 0 0;
      // display: inline-block;
      width:55px;
      height:100%;
      text-align:center;
      float:left;
      @include flex(column, center,center);
      li{
        width:100%;
        height:33%;
        @include flex(column, center,center);
        align-items: flex-end;
        justify-content: flex-end;
      }
      >li:nth-child(1){
        justify-content: end;
      }
      >li:nth-child(2){
       padding-bottom: 25px;
      }
    }
   .legend{
     display: inline-block;
     width:12px;
     height:180px;
    //  opacity: 0.82;
     border-radius: 8px;
     background-image: linear-gradient(#402720, #2c3224, #05284b);

   }
  }
  &--icon{
    width:100%;
    height:110px;
    margin-top:20px;
    ul{
      padding:0;
      li{
        line-height:45px;
        div{
          display:inline-block;
          width:50%;
          text-align:center;
          font-size: 14px;
        }
        div:nth-child(2){
          img{
            vertical-align: middle;
            margin-bottom: 8px;
            margin-left:5px;
          }
        }
      }
      li:nth-child(2){
        div:nth-child(2){
          img{
            cursor:pointer;
          }
        }
      }
    }
    
  }
}

</style>
<style lang='scss'>

</style>