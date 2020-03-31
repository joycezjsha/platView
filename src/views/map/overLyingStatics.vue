<template>
  <div class="overly_statics">
    <img :src="staticsIcon" class="staticsIconCls" @click="showStaticsDiv" />
    <transition name ="fade" mode="out-in">
      <div class="staticsDiv" v-show="isShowStatics">
        <div class="el-card-header clearfix">
          <div style="text-align: right;margin-right:1vw;color:#43defd;float:left;min-width: 46%;font-size: 1vw;">
            {{data.road_layer}}&nbsp;{{data.keyword}}
          </div>
          <div style="font-size: 1vw;float:left;text-align: right;">
            <span>{{parseFloat(data.length).toFixed(2)}}km</span>
          </div>
        </div>
        <div class="statics-item" v-for="item in dataList">
          <div style="float:left;text-align: left;margin-left:1vw;color:#43defd;min-width: 40%;font-size: 0.9vw;">{{item.layername.replace('图层','')}}总数<span style="font-size: 1vw;"></span></div>
          <div style="float:left;text-align: right;max-width: 50%;width: 45%;"><span>{{item.count}}</span>&nbsp;个</div>
          <div class="progress" v-show="item.layername.indexOf('里程桩')!=-1">
            <ul>
              <li v-show="item.upcount!=0" :style="'width:'+(item.upcount/item.count)*100+'%'">上行</li>
              <li v-show="item.downcount!=0" :style="'width:'+(item.downcount/item.count)*100+'%'">下行</li>
              <li v-show="item.twowaycount!=0" :style="'width:'+(item.twowaycount/item.count)*100+'%'">双向</li>
            </ul>
            <ul>
              <li v-show="item.upcount!=0" :style="'background:rgba(27, 105, 232, 1);border-radius: 6px 0 0 6px;max-width:49.5%;width:'+(item.upcount/item.count)*100+'%'"></li>
              <li v-show="item.downcount!=0" :style="'background:rgba(72, 169, 106, 1);max-width:49.5%;width:'+(item.downcount/item.count)*100+'%'"></li>
              <li v-show="item.twowaycount!=0" :style="'background:rgba(3, 172, 253, 1);max-width:49.5%;border-radius: 0 6px 6px 0;width:'+(item.twowaycount/item.count)*100+'%'"></li>
            </ul>
            <ul>
              <li v-show="item.upcount!=0" :style="'width:'+(item.upcount/item.count)*100+'%'">{{item.upcount}}个</li>
              <li v-show="item.downcount!=0" :style="'width:'+(item.downcount/item.count)*100+'%'">{{item.downcount}}个</li>
              <li v-show="item.twowaycount!=0" :style="'width:'+(item.twowaycount/item.count)*100+'%'">{{item.twowaycount}}个</li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  /*地图页面*/
  import utils from '../js/utils'
  import {conf} from './config.js'
    export default {
      name: "tool",
      data() {
        return {
          token:sessionStorage.getItem("token"),
          isMileage:true,
          isShowStatics:true,
          staticsIcon:conf.IMG.statics_png,
          dataList:[]
        }
      },
      mounted() {
//          this.initPopup();
      },
      props:{'data':''},
      watch: {
        'data':{
          immediate:true,
          type:Object,
          handler:function(cVAL,oVAL){
              console.log(cVAL);
            this.getOverlyingSearchStatics(cVAL);
          }
        }
      },
      methods: {
        showStaticsDiv(){
          if(this.isShowStatics){
            document.getElementsByClassName('staticsIconCls')[0].classList.add('rotate');
          }else{
            document.getElementsByClassName('staticsIconCls')[0].classList.remove('rotate');
          };
          this.isShowStatics=!this.isShowStatics;
        },
        getOverlyingSearchStatics(data){
          let that = this;
          conf.interf.SEARCH_OVERLY_LIST_ROAD_API(data).then((response) => {
            if (response.status == 200) {
              let data = response.data;
              if (data.errcode == 0) {
                  this.dataList=data.data.list;
              }
            }
          }).catch(e => {
//            console.error(e)
          });
        },
      }
    }
</script>
<style scoped="true" lang="scss">
  .overly_statics{
    position: fixed;
    right: 1%;
    top: 20%;
    width: auto;
    height: auto;
  .staticsIconCls{top:20%;right:1%;float:left;transition: transform 1.2s;cursor: pointer;}
    .rotate{transform: rotate(180deg);}
  .staticsDiv{
    max-width: 380px;
    font-size: 1.04vw;
    border-radius: 6px;
    line-height: 2.8em;
    min-width: 14vw;
    float: right;
    max-height: 600px;
    overflow-y: auto;background: #024196;    border-radius: 6px;
    .el-card-header{
      background: #0a2f6b;
      color: #fff;
      border: none;
      align-items: center;
      height: 48px;
      line-height: 48px;
      display: flex;
      -webkit-box-align: center;
      /* transition: border-bottom-color .3s; */
      outline: 0;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      margin: 0;
      padding: 0 1vw;
    }
    .statics-item{
      background: #024196;
      border-color: #00c6ff;
      color: #fff;
      padding: 8px 1vw;
      line-height: 44px;
      height: 45px;
    }
  }
  }
</style>
