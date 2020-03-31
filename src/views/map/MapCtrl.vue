<template>
  <div id="map-ctrl" class="warp-main">
  </div>
</template>

<script>
  /*地图页面*/
  import utils from '../js/utils'
  import {conf} from './config.js'
    export default {
      name: "MapCtrl",
      data() {
        return {

        }
      },
      mounted() {

      },
      methods: {
      
      },
      beforeDestroy(){
        
      },
      destroyed(){

      }
    }
</script>

<style lang="scss" scoped>
  #map-ctrl {
    width:100%;
    height:100%;
    position:relative;
    #layer-list{
      .el-icon-arrow-down{
        -webkit-transition: -webkit-transform .3s;
      transition: -webkit-transform .3s;
        transition: transform .3s;
        transition: transform .3s, -webkit-transform .3s;
        transition: transform .3s,-webkit-transform .3s;
        -webkit-transform: rotateZ(180deg);
        transform: rotateZ(180deg);
      }
      .is_reverse{
        transform: rotateZ(0);
      }
    }
  }
  #layer-list {
    width: 11%;
    min-width: 165px;
    height: auto;
    max-height: 60%;
    overflow-y: hidden;
    position: fixed;
    top: 7vw;
    text-align: center;
    /* background-color: white; */
    left: 14%;
    margin-right: 8px;
    font-size: 0.73vw;
    -webkit-transition: all .4s;
    transition: all .4s;
    ul{
      list-style: none;
      display: block;
      width: 100%;
      height:300px;
      background-color: #0b46a4;
      color:white;
      margin-top:5px;
      border-radius: 2%;
      overflow-y: auto;
      padding:5% 0;
      overflow-y: scroll;
      /*ul{*/
        /*display: block;*/
        /*width: 100%;*/
        /*height:100%;*/
        /*overflow-y: scroll;*/
        li{
          background-color: #0b46a4;
          height: 34px;
          line-height: 34px;
          padding: 0 20px;
          cursor: pointer;
          overflow: hidden;
        }
        li:hover{
          background-color: rgba(2,65,150,.89);
          color: #43ddff;
        }
      /*}*/
    }
  }
  .layer-title {
    width: 100%;
    height: 2vw;
    line-height: 2vw;
    background-color: #0b46a4;
    font-weight: bold;
    font-size: 1.2rem;
    color: white;
    border-radius: 17px;
  }
  #map-ctrl #map {
    width:100%;
    height:99%;
    margin:0px;
  }
  #map-ctrl #map-style-button{
    position: fixed;
    bottom: 3%;
    right: 1%;
    width:90px;
    height:50px;
    background-color:#124aa7;
    border-radius: 8px;
  }
  #map-ctrl #map-style-button:hover{width:180px;}
  #map-ctrl #map-style-button img{cursor: pointer;margin-right:0.5vw;height: 3vh;}
  #map-ctrl #map-style-button ul{display: block;width:100%;height:100%;padding:5px;overflow: hidden;}
  #map-ctrl #map-style-button ul li{float:left;width:80px;height:100%;cursor: pointer;border-radius: 10px;}
  #map-ctrl #map-style-button ul li.active,  #map-ctrl #map-style-button ul li:hover{
    border:1.5px solid #00c6ff;
  }
  #map-ctrl #map-style-button ul li.active,  #map-ctrl #map-style-button ul li:nth-child(1){margin-right:4%;margin-bottom: 5px;}
  #map-ctrl #map-style-div {
    position: absolute;
    top: 50px;
    right:10px;
    background-color: white;
    border:1px black solid;
    border-radius:4px;
    padding:0;
    display: none;
  }
  .map-style-item {
    display: inline-block;
    width:100px;
    height:80px;
    background-color:green;
    margin:2px;
    border:2px white solid;
  }
  .map-style-item-checked {
    border:2px black solid;
  }

  #map-ctrl #layer-search-div {
    position: fixed;
    top: 7vw;
    left: 26%;
    display: none;
    width: auto;
    float: left;-webkit-transition: all .4s;
    transition: all .4s;
  }
  #map-ctrl #layer-search-list {
    position: fixed;
    top: 9vw;
    left: 26%;
    display: none;
    background-color: #0f4091;
    border: 1px #0b46a4 solid;
    width: 16vw;
    height: auto;
    max-height: 33%;
    cursor: pointer;
    text-align: left;
    overflow-y: scroll;
    border-radius: 12px;
    line-height: 2.5em;
    line-height: 2.5em;
    padding: 0.5vw;
    min-height: 150px;
  }
  @media screen  and (width:1366px){
  #map-ctrl #layer-search-list{left:15%;}
    #map-ctrl #layer-search-div{left:15%;}}
  #map-ctrl .exportQuery{float:right;  width: auto;}
  #map-ctrl #layer-search-list .rowCls{border-bottom: 1px solid #4da4f5;font-size:0.83vw;font-family: 'DroidSansFontLight';/*text-align: center;*/}
  #map-ctrl .box-card{
    position: fixed;
    z-index: 2;
    max-width: 380px;
    height: auto;
    top: 20%;
    right: 1%;
    background: #024196;
    border-color: #00c6ff;
    color: white;
    font-size: 1.04vw;
    border-radius: 5%;
    line-height: 2.8em;
    min-width: 14vw;
  }
  #map-ctrl #minemap_popup{
    position: fixed;
    z-index: 2;
    width: 344px;
    height: auto;
    bottom: 10%;
    left: 14%;
    background: #024196;
    border-color: #00c6ff;
    color: white;border-radius:12px;}
  #map-ctrl .title{
    position: fixed;
    top: 4vw;
    padding-left: 1.56vw;
    left: 12.5vw;    -webkit-transition: all .4s;
    transition: all .4s;
  }
  #layer-search-div  input.input-with-select{border-radius:0;padding: 0 8px;}
  #layer-search-div .el-input-group{width:16vw;}
  #layer-search-div .searchMileageDiv .searchBtn{border-radius: 50% 0 0 50%;border: none;}
  #layer-search-div .searchMileageDiv{background-color: #0b47a4;border-radius:25px;
    /*border: 1px solid #00c6ff;*/
    width:24vw;    float: left;}
  #layer-search-div .searchMileageDiv select{
    background-color: transparent;
    border:none;
    border-right: 1px solid #4b7bc9; border-radius: 0px;
    /*margin: 8px 0;*/
    padding:0;
    /*height:15px;*/
  }
  /*#map-ctrl .chart{*/
    /*width: 344px;  height: auto;*/
  /*}*/
  /*#staticsDiv{*/
    /*width:100%;height:230px;*/
  /*}*/
  /*#hight_speed_chart_div{width:100%;height:130px;width:302px;}*/
</style>
<style>
  #layer-search-div .searchMileageDiv .el-select{height:20px;width:50px;}
  /*#layer-search-div .searchMileageDiv .el-select input,#layer-search-div .searchMileageDiv input{*/
    /*background: transparent;*/
    /*border:none;*/
    /*border-right: 1px solid #4b7bc9;border-radius: 0px;*/
    /*!*margin: 10px 0;height:20px;*!*/
    /*!*height: 23px;*!*/
  /*}*/
  #layer-search-div .searchMileageDiv input,#layer-search-div .searchMileageDiv .el-select input{
    color: white;
    height: 20px;
    font-size: 0.83vw;
    background: transparent;
    border-right: 1px solid #4b7bc9;
    border-radius:0;
    margin: 9px 0;
  }
  #layer-search-div .searchMileageDiv .mileageDir input{border:none;}
  #map-ctrl .el-card__body{width:100%;padding:12px;}
  /*::-webkit-input-placeholder { !* WebKit, Blink, Edge *!*/
    /*color:red;*/
    /*font-size:10px;*/
  /*}*/
  #map-ctrl .progress{width:100%;height:50px;clear: both;}
  #map-ctrl .progress ul{width:100%; display: block;margin:0;}
  #map-ctrl .progress ul:nth-child(1),#map-ctrl .progress ul:nth-child(3){width:100%;height:23px;display: block;line-height: 20px;}
  #map-ctrl .progress ul:nth-child(1) li{font-size: 0.83vw;color: #43DDFF;max-width:40%;min-width:20%;}
  #map-ctrl .progress ul:nth-child(3) li{font-size: 0.73vw;max-width:40%;min-width:20%;}
  #map-ctrl .progress ul li{float: left;text-align: center;height: 100%;}
  /*#map-ctrl .progress ul:nth-child(1){}*/
  #map-ctrl .progress ul:nth-child(2){height:12px;}
  #map-ctrl .progress ul:nth-child(2) li{width: 30%; height: 12px;border:1px solid #08A9C6;}
  /*#map-ctrl .toolDiv .tool .el-button{padding:12px 20px;width: auto;border-radius:25px;}*/
  /*.el-icon-edit:before{*/
     /*content:url(../../../static/images/mapCtr/tool.png);*/
  /*}*/
  .map_ctr{width:120px;}
  #map-ctrl .toolDiv .tool .el-button span{
    margin-top: 2px;
    display: block;
    float: right;
    margin-left: 15px;
  }
  /*#map-ctrl .toolDiv .tool{margin:0 1%;}*/
  #map-ctrl .toolDiv .layer-lnglat-div{background-color: #0b47a4;
    border-radius: 25px;text-align: left;
    /* border: 1px solid #00c6ff; */
    width: 307px;float: right;}
  #map-ctrl .space{float:left;width:10px;height:25px;}
  #map-ctrl .layer-lnglat-div .el-input-group{height:100%;width:75%;border:none;border-radius: 50% 0 0 50%;}
  #map-ctrl .layer-lnglat-div>.el-button{float:right;background-color: transparent;border:none;text-decoration: underline;color:#00AEFF;}
</style>
