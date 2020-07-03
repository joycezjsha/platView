<template>
  <div>
  </div>
</template>

<script>
import blur from '../../blur.js';
import { IMG } from "./config";
import { interf } from "./config";
export default {
    name:'FlowMap',
    data(){
        return{
            stime:'1',
            etime:'',
            timeRange:'',
            xzqh:'',
            // map_cover:{
            //  markers:[]
            // },
            // markerlist:[] //存放marker

        }
    },
    components:{

    },
    destroyed() {
      this.map.setPitch(0);
      // if(this.markerlist.length>0){
      //   this.clearMap();
      // }

    },
    mounted(){
      this.map = this.$store.state.map;
      this.map.setCenter([108.967368, 34.302634]);
      this.map.setZoom(6);
      let that=this;
      that.getData()
      that.getMapVehicleInData(that.stime)
      that.getHotspotBayonetRanking(that.stime)
    },
    methods:{
    /**
    * 接收传过来的数据
    * gettime  传入的时间 1,2,3,4
    * determine  选择的时间
    */                
    getData(){
      let that=this;
      blur.$on("paramxzqh",xzqh=>{
        that.xzqh=xzqh;
        // if(that.stime!='4' && that.xzqh!=undefined){
          that.getHotspotBayonetRanking(that.stime,that.xzqh)
        // }
      })
      blur.$on('gettime',time=>{
        that.stime=time;
        // if(that.xzqh===undefined){
          that.getMapVehicleInData(that.stime)
          // that.getHotspotBayonetRanking(that.stime)
        // }
        
      }) 
      blur.$on('determine',times=>{
        that.timeRange=times;
        console.log(that.timeRange[0],that.timeRange[1])
        console.log(that.timeRange[0],that.xzqh,that.timeRange[1])
        that.getMapVehicleInData(that.timeRange[0],that.timeRange[1])
        // if(that.stime=='4' && that.xzqh===undefined){       
          // that.getHotspotBayonetRanking(that.timeRange[0],that.timeRange[1])
        // }
       
        // if(that.stime=='4' && that.xzqh!=undefined){
          // that.getHotspotBayonetRanking(that.timeRange[0],that.xzqh,that.timeRange[1])
        // }
        // if(that.stime=='4' && that.xzqh===undefined){
        //   that.getHotspotBayonetRanking(that.timeRange[0],that.timeRange[1])
        // }
       
      })  
    },
    // 	车辆流动页面地图热点卡口  Vehicle/getHotspotBayonetRanking GET_MAP_HOT_BAY_API
    getHotspotBayonetRanking(stime,xzqh,etime){
      let that=this;
      // 如果只有一个参数 stime
      if(etime===undefined && xzqh===undefined){
        interf.GET_MAP_HOT_BAY_API({
          id: "",
          stime:stime
          })
          .then(response=>{
            if (response && response.status == 200){
              var data = response.data;        
                if (data.errcode == 0) {
                    // if(data.data.length>0){
                    //     data.data.forEach(e=>{
                    //     that.addCityMarker(e);
                    //     })
                    // }
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
      }
      // 如果只有2个参数 stime xzqh
      if(etime===undefined & stime!='4' && xzqh!=undefined){
        interf.GET_MAP_HOT_BAY_API({
          id: "",
          stime:stime,
          xzqh:xzqh
          })
          .then(response=>{
            if (response && response.status == 200){
              var data = response.data;
               console.log(data)               
                if (data.errcode == 0) {
                    // if(data.data.length>0){
                    //     data.data.forEach(e=>{
                    //     that.addCityMarker(e);
                    //     })
                    // }
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
      }
      // 如果只有3个参数 stime etime xzqh
      if(etime!=undefined && xzqh!=undefined){
        interf.GET_MAP_HOT_BAY_API({
          id: "",
          stime:stime,
          xzqh:xzqh
          })
          .then(response=>{
            if (response && response.status == 200){
              var data = response.data;
               console.log(data)               
                if (data.errcode == 0) {
                    // if(data.data.length>0){
                    //     data.data.forEach(e=>{
                    //     that.addCityMarker(e);
                    //     })
                    // }
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
      }
    },
    // //车辆流动页面地图 城市流动数据 Vehicle/getMapVehicleIn   GET_MAP_CITY_FLOW_API
    // getMapVehicleInData(stime,etime){
    //   let that=this;
    //     // 如果只有一个参数 stime
    //   if(etime===undefined && stime!='4'){
    //      interf.GET_MAP_CITY_FLOW_API({
    //       id: "",
    //       stime:stime
    //       })
    //       .then(response=>{
    //         if (response && response.status == 200){
    //           var data = response.data;
    //           //  console.log(data)               
    //             if (data.errcode == 0) {
    //                 if(data.data.length>0){
    //                     data.data.forEach(e=>{
    //                     that.addCityMarker(e);
    //                     })
    //                 }
    //             } else{
    //               that.$message({
    //                 message: data.errmsg,
    //                 type: "error",
    //                 duration: 1500
    //               });
    //             }
    //           }
    //         })
    //         .catch(err=>{
    //           console.log(err);
    //         })
    //         .finally(() => {
    //           that.tableLoading = false;
    //         });
    //     } 
    //     // 如果有2个参数 stime,etime
    //      if(etime!=undefined){
    //      interf.GET_MAP_CITY_FLOW_API({
    //       id: "",
    //       stime:stime,
    //       etime:etime
    //       })
    //       .then(response=>{
    //         if (response && response.status == 200){
    //           var data = response.data;
    //           //  console.log(data)             
    //             if (data.errcode == 0) {
    //                 if(data.data.length>0){
    //                     data.data.forEach(e=>{
    //                     that.addCityMarker(e);
    //                     })
    //                 }
    //             } else{
    //               that.$message({
    //                 message: data.errmsg,
    //                 type: "error",
    //                 duration: 1500
    //               });
    //             }
    //           }
    //         })
    //         .catch(err=>{
    //           console.log(err);
    //         })
    //         .finally(() => {
    //           that.tableLoading = false;
    //         });
    //     }
    // },
    //     //  地图上的显示 
    // addCityMarker(item){
    //     let el = document.createElement('div');
    //     el.id = 'marker';
    //     // el.style["border"] = "solid 1px #333333";
    //     // el.style["backgroundColor"] = "#333";
    //     el.style["padding"] = "4px 6px";
    //     el.style.color='white';
        
    //     let leftImgDiv=document.createElement('div');
    //     leftImgDiv.style.float='left';
    //     leftImgDiv.style.width='20px';
    //     leftImgDiv.style.height='40px';
    //     leftImgDiv.style.lineHeight='30px';
    //     let img_i = document.createElement('i');
    //     img_i.className='iconfont icon-shangsheng';
    //     img_i.style.color='#FFAF05';
        
    //     if(item.addIn<0){
    //         img_i.style.color='#00DFC7';
    //         leftImgDiv.style.transform='rotate(180deg)';
    //         leftImgDiv.style.lineHeight='50px';  
    //     }
    //     leftImgDiv.appendChild(img_i);
    //     el.appendChild(leftImgDiv);

    //     let rightDiv=document.createElement('div');
    //     rightDiv.style.float='right';
    //     rightDiv.style.width='40px';
    //     rightDiv.style.height='30px';
    //     let span1 = document.createElement('p');
    //     span1.innerHTML = item.city;
    //     span1.style.margin='0';
    //     rightDiv.appendChild(span1);
    //     let span2 = document.createElement('p');
    //     span2.innerHTML = item.addIn;
    //     span2.style.margin='0';
    //     span2.style.color='#FFAF05';
    //     if(item.addIn<0) span2.style.color='#00DEC7';
    //     rightDiv.appendChild(span2);
    //     el.appendChild(rightDiv);
    //     //添加marker
    //     let lnglat = [item.longitude,item.latitude];
    //     let marker = new minemap.Marker(el, {offset: [-25, -25]}).setLngLat(lnglat).addTo(this.map);
    //     this.map_cover.markers.push(marker);
    //     // this.markerlist.push(marker)

    //     },
      
    },
/*##清除地图加载点、线、面、弹框*/
  clearMap(){
    // //清除source
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
    // //清除popup
    // if(this.map_cover.popups.length>0){
    //   this.map_cover.popups.forEach(e=>{
    //     e.remove();
    //   })
    // }
    //清除marker
    if(this.map_cover.markers.length>0){
      this.map_cover.markers.forEach(e=>{
        e.remove();
      })
    }
  },

}
</script>

<style>

</style>