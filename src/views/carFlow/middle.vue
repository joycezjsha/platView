<template>
  <div class="carFlow-middle" >
    <div @click="realtime(1)" >
        <m-title label='城市车辆分析' class="car" :img_type='tableIndex=="1"?"1":"0"'></m-title>
    </div>
    <!-- <div @click="realtime(2)" >
        <m-title label='车辆归属地OD' class="car" :img_type='tableIndex=="2"?"1":"0"'></m-title>
    </div> -->
   <div @click="realtime(3)">
        <m-title  label='热点卡口道路' class="car" :img_type='tableIndex=="3"?"1":"0"'></m-title>
   </div>
    <t-area 
      :indexData='areaIndexs' 
      :isShowArea='showArea' 
      :isShowTxt='isShowTxt' 
      :method='clickAreaEvent'
      ref="areaModule"
    ></t-area>
  </div>
</template>

<script>
import mTitle from "@/components/UI_el/map_title_com.vue";
import mTab from '@/components/UI_el/tab.vue';
import tArea from "@/components/area/area.vue";
import blur from '../../blur.js';
import { IMG } from "./config";
import { interf } from "./config";
export default {
    name:'middle',
    data(){
        return{
            stime:'1',
            xzqh:'',
            tableIndex:'1',
            indexDatas:[],
            timeRange:'',
            showArea:false,
            areaIndexs:[],
            isShowTxt:false,
             map_cover:{
                sourceList:[],
                markers:[],
                lineList:[],
                popups:[]
            },
            isReturn:false
        }
    },
    components:{
        mTitle,
        mTab,
        blur,
        tArea
    },
    mounted(){
      this.map = this.$store.state.map;
      this.map.setCenter(mapConfig.DEFAULT_CENTER);
      this.map.setZoom(8);
      this.getData();
      this.getMapVehicleInData(this.stime)
      blur.$on('clearMaker',data=>{
        this.cancelCityLayerStatus();
      });
    },
    destroyed(){
      this.clearMarkers();
    },
    methods:{
    // 车辆实时监测
    realtime(i){
        this.tableIndex=i;
        if(this.tableIndex!='1'){
          this.clearMarkers();
          this.showArea=false;
        }else{
            this.clearMarkers();
            this.getMapVehicleInData(this.stime);
        }
        let els=document.getElementsByClassName('.custom-popup-class');
        blur.$emit('realtime',this.tableIndex);
    },
    /**
    * 接收传过来的数据
    * 定义组件内函数gettime  传入的时间 1,2,3,4
    * 定义组件内函数determine  选择的时间
    */                
    getData(){
      let that=this;
      blur.$on('gettimecar',time=>{
        that.stime=time;
        if(that.stime!='4' && that.tableIndex==1){
          that.clearMarkers();
          that.showArea=false;
          that.getMapVehicleInData(that.stime) 
        }
      }) 
      blur.$on('determinecar',times=>{
        if(that.tableIndex==1){
          that.timeRange=times;
          that.clearMarkers();
          that.showArea=false;
          that.getMapVehicleInData(that.timeRange[0],that.timeRange[1]);
          }
       })
    },
    /**
     * 地图点击事件，回调绑定事件
     */
    clickAreaEvent(data){
      blur.$emit('setCurrentCity',data);
    },
    /**
    * 车辆流动页面地图  地图城市流动数据  Vehicle/getMapVehicleIn   GET_MAP_CITY_FLOW_API
    */
    getMapVehicleInData(stime,etime){
      let that=this;
        // 如果只有一个参数 stime
        let param={};
        if(etime!=undefined){
            param.stime=stime;
            param.etime=etime;
        }
        if(etime===undefined){
            param.stime=stime;
        }
        interf.GET_MAP_CITY_FLOW_API(param)
          .then(response=>{
            if (response && response.status == 200){
              var data = response.data;             
                if (data.errcode == 0) {
                    if(data.data.length>0){
                        data.data.forEach(e=>{
                          that.addCityMarker(e);
                        })
                        data.data.map(e=>{
                            e.Num=e.addIn;
                            return e;
                        })
                        that.areaIndexs=data.data;
                        that.showArea=true;
                    }
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
    /**
     * 是否取消地图区域选中
     */
    cancelCityLayerStatus(){
      this.$refs['areaModule'].resumeLayer();
      this.map.setPitch(0);
    },
    /**
    *  添加marker
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
        leftImgDiv.style.width='15px';
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
        span1.innerHTML = item.city;
        span1.style.margin='0';
        rightDiv.appendChild(span1);
        let span2 = document.createElement('p');
        span2.innerHTML = item.addIn;
        span2.style.margin='0';
        span2.style.color='#FFAF05';
        if(item.addIn<0) span2.style.color='#00DEC7';
        rightDiv.appendChild(span2);
        el.appendChild(rightDiv);
        //添加marker
        let lnglat = [item.longitude,item.latitude];
        let marker = new minemap.Marker(el, {offset: [-25, -25]}).setLngLat(lnglat).addTo(this.map);
        this.map_cover.markers.push(marker);
    },

    /*
    * 地图热点卡口
    */
    //清除marker
    clearMarkers(){
      if(this.map_cover.markers.length>0){
        this.map_cover.markers.forEach(e=>{
          e.remove();
          })
      }
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
    },
  }
}
</script>

<style scoped lang='scss'>

.carFlow-middle{
    position: fixed;
    top:93.5vh;
    left:38vw;
    width: 38.85vw;
    display: flex;
    .car{
        width:199px;
        height:39px;
        justify-content: space-around;
        line-height: 39px;
        cursor:pointer;
    }
    .car1{
        width:199px;
        height:39px;
        background:linear-gradient(90deg,rgba(59,79,101,1));
        border:1px solid;
        border-image:linear-gradient(-55deg, rgba(175,182,184,1)) 1 1;
        // background:url(../../../static/images/ui_image/title_bg_unchecked.png) no-repeat;
        // background-image: url(./static/images/ui_image/tab_bg.png);
        span{
            width:121px;
            height:20px;
            font-size:20px;
            font-family:Source Han Sans CN;
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height:25px;
        }
    }
}
</style>
