<template>
  <div class="Illegal_middle" >
    <div @click="realtime(1)" >
        <m-title label='违法分析' class="car" :img_type='tableIndex==1?"1":"0"'></m-title>
    </div>
    <div @click="realtime(2)" >
        <m-title label='超速' class="car" :img_type='tableIndex==2?"1":"0"'></m-title>
    </div>
   <div @click="realtime(3)">
        <m-title  label='限行' class="car" :img_type='tableIndex==3?"1":"0"'></m-title>
   </div>
  </div>
</template>

<script>
import { IMG } from "./config";
import { interf } from "./config";
import mTitle from "@/components/UI_el/map_title_com.vue";
import mTab from '@/components/UI_el/tab.vue';
import blur from '../../blur.js';
export default {
    name:'middle',
    data(){
        return{
            stime:'1',
            xzqh:'',
            type:'', // 超速 (1) 限行(2)
            tableIndex:1,
            timeRange:{ //自定义时间
                time1:'',
                time2:''
            },
             map_cover: {
                sourceList: [],
                lineList: [],
                markers: [],
                popups: []
            },
        }
    },
    components:{
        mTitle,
        mTab,
        blur
    },
    destroyed(){
        if(this.map){
            this.clearMap()
        }
    },
    mounted(){
        this.map = this.$store.state.map;
        // this.map.setCenter([108.967368, 34.302634]);
        this.map.setCenter(mapConfig.DEFAULT_CENTER);
        this.map.setZoom(11);
        this.getIllegalHeatMapDatas(this.stime)
        this.gatData()
    },
    methods:{
        /**
         * 接受传过来的参数
         */
        gatData(){
            let that = this;
            blur.$on("sendTime",data=>{
                that.timeRange.time1=data.time1;
                that.timeRange.time2=data.time2;
                that.stime=='4';
                that.getIllegalHeatMapDatas(that.stime)
            })

            blur.$on('getstime',data=>{
                that.stime=data;
                if(that.stime!='4'){
                    that.getIllegalHeatMapDatas(that.stime)
                }
            })
            blur.$on('getxzqh',data=>{
                that.xzqh=data;
                that.getIllegalHeatMapDatas(that.stime)
            })
            blur.$on("goback",data=>{
                that.stime='1';
                that.xzqh='';
                that.getIllegalHeatMapDatas(that.stime)
                // console.log(data)
                // that.stime,that.xzqh
            })
        },
        realtime(i){   
            let that = this;
            that.tableIndex=i;
            if(that.tableIndex=='1'){
                that.type='';
                that.getIllegalHeatMapDatas(that.stime)
            }
            if(that.tableIndex=='2'){
                that.type='1';
                blur.$emit('gettype',that.type)
                that.getIllegalHeatMapDatas(that.stime)
            }else{
                that.onHideLayer()
            }
            if(that.tableIndex=='3'){
                that.type='2';
                blur.$emit('gettype',that.type)
                that.getIllegalHeatMapDatas(that.stime)
            }else{
                that.onHideLayer()
            }
            
            blur.$emit('getIndex',that.tableIndex)
        },
        /**
         *  显示柱形热力图
        */
        onShowLayer() {
            let that = this;
            if (that.map) {
                if (this.map_cover.lineList.length > 0) {
                this.map_cover.lineList.forEach(e => {
                    if (this.map.getLayer(e) != undefined) {
                    that.map.setLayoutProperty(e, "visibility", "visible");
                    }
                });
                }
            }
        },
        /**
        * 隐藏热力图
        */
        onHideLayer() {
            let that = this;
            if (this.map_cover.lineList.length > 0) {
                this.map_cover.lineList.forEach(e => {
                    if (this.map.getLayer(e) != undefined) {
                    that.map.setLayoutProperty(e, "visibility", "none");
                    }
                });    
            }
        },
        /**
        *  柱形热力图
        */
       getMapDatas(item){
        let that = this;
        if (that.map.getLayer("histogram-layer") != undefined) {
            that.map.setLayoutProperty("histogram-layer", "visibility", "visible");
            that.map.getSource("histogram-source").setData(item);
        }else{
            that.map.addSource('histogram-source', {
                'type': 'geojson',
                'data': item//'./static/json/wuhuannei_level1.json'//
            });
            that.map.addLayer({
                "id": "histogram-layer",
                'type': 'histogram',
                'source': 'histogram-source',
                'layout': {
                    'histogram-max-height-render': true, /* 是否开启柱状图极大高度控制 */
                    "histogram-color-render": true /* 是否开启分段颜色，如果为true，paint中histogram-color的stops */
                },
                'paint': {
                    "histogram-colors": ['#ad0532', '#8e7146', '#00ece8', '#a24228', '#ad0532'],
                    /**开启分段颜色，根据柱状图高度从下到上设置颜色值，备注：颜色数组值长度必须为5个*/
                    'histogram-max-height': 100,/*该参数针对histogram-colors进行配合使用，该值为从下到上的前四段颜色的最大限定高度值，备注：如果不开启分段颜色，该参数不用设置*/
                    'histogram-height': {
                        'type': 'identity',
                        'property': 'levels'
                    }, /*高度*/
                    'histogram-base': 0,/*基础高度*/
                    'histogram-opacity': 0.8
                }
            });
            that.map_cover.sourceList.push("histogram-source");
            that.map_cover.lineList.push("histogram-layer");
            }
            that.map.setCenter(item.features[0].geometry.coordinates[0][0]);
            that.map.setPitch(60);
        
       },
        /**
        * 违法热力图数据及展示 IllegalAnalysis/getIllegalHeatMap  GET_HEAT_MAP_API
        */
       getIllegalHeatMapDatas(time){
           let that = this;
            let param={};
            if(that.type!=''){
             param.type=that.type;
            }
            if(that.xzqh!=''){
             param.xzqh=that.xzqh;
            }
            //如果传入的时间type！='4'
            if(time!='4'){
               param.stime=that.stime;
            }
            if(time=='4' ){
                param.stime=that.timeRange.time1;
                param.etime=that.timeRange.time2;
            }
            interf.GET_HEAT_MAP_API(param)
            .then(response=>{
                if(response && response.status==200){
                var data = response.data;
                if(data.errcode == 0){
                    if(data.data.features.length>0){
                        setTimeout(() => {
                            that.getMapDatas(data.data)   
                        }, 200);
                    }
                }else{
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
       },
    //清除地图加载点、线、面、弹框
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
        if (this.map_cover.lineList.length > 0) {
            this.map_cover.lineList.forEach(e => {
            if (this.map.getLayer(e) != undefined) {
                this.map.removeLayer(e);
            }
            });
        }
        this.map_cover.lineList=[];
        //清除popup
        if (this.map_cover.popups.length > 0) {
            this.map_cover.popups.forEach(e => {
            e.remove();
            });
        }
        this.map_cover.popups=[];
    }
    
    }
}
</script>

<style scoped lang='scss'>

.Illegal_middle{
    position: fixed;
    top:93.5vh;
    left:34.53vw;
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
