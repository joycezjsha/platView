<template>
  <div class="intersection-traffic_container">
    <div class="intersection-traffic-left-list boxstyle">
      <div style='width:70%;'><m-title label='路口失衡排名' img_type=1 style='width:11vw;height:4vh;line-height:4vh;'></m-title></div>
      <div style="border-bottom: 0.1rem solid #a9afd6;">
        <div class="intersection-traffic-left-list-unbalance" v-for="(item,index) in unbalanceList" :key='index'>
          <div class="intersection-yuan" :style="item.backgroundColor"></div>
          <div style="display: inline-block;">&nbsp;{{item.name}}</div>
        </div>
      </div>
      <div class="intersection-traffic-left-list-ul-title">
        <div class="left-list-ul-title" style="width: 48%;margin-left: 9%;">路口名称</div>
        <div class="left-list-ul-title" style="width: 40%;">失衡指数</div>
      </div>
      <ul class="list-group intersection-traffic-analysis-ul" style="height:77%;">
        <li class="intersection-left-list-li" v-for="(item,index) in leftListUlItems" :key='index' :id="item.leftLiId" v-on:click="showFlyToDiv(item,item.type,index)" v-on:mouseenter="setListItemStyle(true, item)" v-on:mouseleave="setListItemStyle(false, item)">
          <img :src="noImg" style="width: 5%;display: inline-block;margin-left: 2%;" v-if="item.iShow" :title='item.descInfo'>
          <div style="width: 5%;display: inline-block;margin-left: 2%;" v-else>&nbsp;</div>
          <div style="width:45%; display:inline-block; text-align: left;padding-left: 1%;">{{item.juncName}}</div>
          <div style="width:40%; display:inline-block; text-align: left;">
            <div class="intersection-yuan" :style="item.unbalanceStyle"></div>
            <div style="display: inline-block;">&nbsp;{{item.unBalanceIndex}}&nbsp;{{item.unbalanceName}}</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="intersection-traffic-analysis boxstyle">
      <div class="intersection-traffic-analysis-title">
        <div class="intersection-analysis-title-name">
          <m-title :label='analysisTitleName+"交通运行状况评价"' img_type=1 style='width:16vw;height:4vh;line-height:4vh;margin:0;'></m-title>
        </div>
        <img :src='closeImg' @click="closeAnalysis(2)" class="intersection-analysis-img">
      </div>
      <div class="itat-direction-title">
        <div id="idtDivns" v-on:click="showTrendAnalysisLabel(tableRows[0].direction);"  v-on:mouseenter="setDirDivStyle(true, 'idtDivns')" v-on:mouseleave="setDirDivStyle(false, 'idtDivns')">北向南</div>
        <div id="idtDivsn" v-on:click="showTrendAnalysisLabel(tableRows[1].direction);"  v-on:mouseenter="setDirDivStyle(true, 'idtDivsn')" v-on:mouseleave="setDirDivStyle(false, 'idtDivsn')">南向北</div>
        <div id="idtDivwe" v-on:click="showTrendAnalysisLabel(tableRows[2].direction);"  v-on:mouseenter="setDirDivStyle(true, 'idtDivwe')" v-on:mouseleave="setDirDivStyle(false, 'idtDivwe')">西向东</div>
        <div id="idtDivew" v-on:click="showTrendAnalysisLabel(tableRows[3].direction);"  v-on:mouseenter="setDirDivStyle(true, 'idtDivew')" v-on:mouseleave="setDirDivStyle(false, 'idtDivew')" style="border-right: 0.1rem solid #ffffff;">东向西</div>
      </div>
      <div v-show="is_noLane" id="unbalanceEchartsContent" style="width:100%;height:20%; margin-top: 0.5rem;"></div>
      <div v-show="!is_noLane" id="laneContent" style="width:100%;height:20%; margin-top: 0.5rem;">
        <!--<div v-if="is_sn" class="s_n_lane_cls">-->
        <div class="s_n_lane_cls">
          <ul>
            <li><span v-for="dir in laneData[0]"  :key='dir'  :style="'width:'+(100/laneData[0].length)+'%'">{{dir}}</span></li>
            <li><span v-for="img in laneData[1]"  :key='img'  :style="'width:'+(parseInt(100/laneData[1].length))+'%'"><img :style="'width:24px;transform:rotate('+img.deg+'deg);-webkit-transform:rotate('+img.deg+'deg);-moz-transform: rotate('+img.deg+'deg);'" :src="img.src" /></span></li>
            <li><span v-for="flow in laneData[2]" :key='flow'  :style="'width:'+(100/laneData[2].length)+'%'">{{flow}}</span></li>
          </ul>
        </div>
        <!--<div v-else class="w_e_lane_cls">-->
          <!--<ul><li v-for="item in laneData"><span>{{item.dir}}</span><span><img :style="'width:24px;-webkit-transform:rotate('+item.img.deg+'deg);-moz-transform: rotate('+item.img.deg+'deg);transform:rotate('+item.img.deg+'deg);'" :src="item.img.src" /></span><span>{{item.flow}} pcu/h</span></li></ul>-->
        <!--</div>-->
      </div>
      <div id="itsaDiv1" class="intersection-traffic-state-analysis-1" style="height:12%;">
        <div class="itsa-1-title">
          <div class="itsa-1-title-name">峰值监测</div>
        </div>

        <div class="intersection-d-div-list-title" style="height:20%;">
          <div class="intersection-div-list-title-1">早/晚高峰</div>
          <div class="intersection-div-list-title-2" title="早/晚高峰最佳流量"><img src="../../../static/images/tpis.png" style="width:18px;height:18px;cursor:pointer;" class="tip_img" @click="showTitle($event)"/>最佳流量&nbsp;➜&nbsp;速度</div>
          <div class="intersection-div-list-title-1" title="早/晚高峰交通指数最高值"><img src="../../../static/images/tpis.png" style="width:18px;height:18px;cursor:pointer;" class="tip_img" @click="showTitle($event)"/>高峰指数</div>
          <div class="intersection-div-list-title-1" title="早/晚高峰交通指数最高值对应的时刻"><img src="../../../static/images/tpis.png" style="width:18px;height:18px;cursor:pointer;" class="tip_img" @click="showTitle($event)"/>峰值时刻</div>
          <!--<div class="intersection-div-list-title-2" :title="gfjt1.drjzcs">当日最佳车速</div>-->
          <div class="intersection-div-list-title-2" title="近两个月内早/晚高峰的最大流量值"><img src="../../../static/images/tpis.png" style="width:18px;height:18px;cursor:pointer;" class="tip_img" @click="showTitle($event)"/>历史最佳流量&nbsp;➜&nbsp;速度</div>
        </div>
        <ul class="list-group intersection-traffic-analysis-ul" style="overflow-y:hidden;height:21%;">
          <li class="intersection-d-div-li" v-for="(item,index) in tableRowsA" :key='index' :name="item.leftLiId" v-on:click="showTrendAnalysisLabel(item.direction,item.leftLiId,item.type)"  v-on:mouseenter="setItemStyle(true, item)" v-on:mouseleave="setItemStyle(false, item)">
            <div style="width:13%; display:inline-block; text-align: center;">{{itsaTitleName1}}</div>
            <div style="width:29%; display:inline-block; text-align: center;">{{item.h_flow_speed}}</div>
            <div style="width:13%; display:inline-block; text-align: center;">{{item.avgcon}}</div>
            <div style="width:13%; display:inline-block; text-align: center;">{{item.time}}</div>
            <div style="width:29%; display:inline-block; text-align: center;" v-if="item.flow_h_time_history!='-'" :title="'流量峰值时间：'+item.flow_h_time_history">{{item.h_history_flow_speed}}</div>
            <div style="width:29%; display:inline-block; text-align: center;" v-else>{{item.h_history_flow_speed}}</div>
          </li>
        </ul>
        <ul class="list-group intersection-traffic-analysis-ul" style="overflow-y:hidden;height:21%;">
          <li class="intersection-d-div-li" v-for="(item,index) in tableRowsB" :key='index' :name="item.leftLiId" v-on:click="showTrendAnalysisLabel(item.direction,item.leftLiId,item.type)"  v-on:mouseenter="setItemStyle(true, item)" v-on:mouseleave="setItemStyle(false, item)">
            <div style="width:13%; display:inline-block; text-align: center;">{{itsaTitleName2}}</div>
            <div style="width:29%; display:inline-block; text-align: center;">{{item.h_flow_speed}}</div>
            <div style="width:13%; display:inline-block; text-align: center;">{{item.avgcon}}</div>
            <div style="width:13%; display:inline-block; text-align: center;">{{item.time}}</div>
            <div style="width:29%; display:inline-block; text-align: center;" v-if="item.h_history_flow_speed!='-'" :title="'流量峰值时间：'+item.flow_h_time_history">{{item.h_history_flow_speed}}</div>
            <div style="width:29%; display:inline-block; text-align: center;" v-else>{{item.h_history_flow_speed}}</div>
          </li>
        </ul>
      </div>

      <div id="itsaDiv3" class="intersection-traffic-state-analysis-1" style="height:10%;margin-top:0px;">
        <div class="itsa-1-title">
          <div class="itsa-1-title-name">实时监测</div>
        </div>
        <div class="intersection-c-div-list-title" style="">
          <div class="intersection-c-div-list-title-name-1">路口方向</div>
          <div class="intersection-c-div-list-title-name-2">拥堵状态</div>
          <div class="intersection-c-div-list-title-name-5" :title="ssjt.ydzs"><img src="../../../static/images/tpis.png" style="width:18px;height:18px;cursor:pointer;" class="tip_img" @click="showTitle($event)"/>拥堵指数</div>
          <div class="intersection-c-div-list-title-capacity-1" :title="ssjt.dqll"><img src="../../../static/images/tpis.png" style="width:18px;height:18px;cursor:pointer;" class="tip_img" @click="showTitle($event)"/>实时流量&nbsp;➜&nbsp;速度</div>
          <!--<div class="intersection-c-div-list-title-name" :title="ssjt.dqcs">当前车速</div>-->
          <div class="intersection-c-div-list-title-capacity" :title="ssjt.lszjll"><img src="../../../static/images/tpis.png" style="width:18px;height:18px;cursor:pointer;" class="tip_img" @click="showTitle($event)"/>实时最佳流量&nbsp;➜&nbsp;速度</div>
          <!--<div class="intersection-c-div-list-title-name-3" :title="ssjt.lszjcs">历史最佳车速</div>-->
          <!--div class="intersection-c-div-list-title-name-4" :title="ssjt.bhd">饱和度</div-->
          <!--<div class="intersection-c-div-list-title-name" :title="ssjt.lxsj">旅行时间</div>-->
        </div>
        <ul class="list-group intersection-traffic-analysis-ul" style="overflow-y:hidden;height:30px;">
          <li class="intersection-c-div-li" v-for="(item,index) in tableRows" :key='index' :name="item.leftLiId" v-on:click="showTrendAnalysisLabel(item.direction,item.leftLiId,item.type,item.arrowLonlat)"  v-on:mouseenter="setItemStyle(true, item)" v-on:mouseleave="setItemStyle(false, item)">
            <div style="width:13%; display:inline-block; text-align: center;">{{item.dir}}</div>
            <div style="width:15%; display:inline-block; text-align: center;vertical-align: middle;" v-show="item.juncName!==''">
              <div style="height: 14px;display:inline-block;" v-html="item.juncName"></div>
              <span :style="item.cic">&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div>
            <div style="width:13%; display:inline-block; text-align: center;vertical-align: middle;" v-show="item.congestionIndex!==''">
              <div style="height: 14px;display:inline-block;">{{item.congestionIndex}}</div>
              <span :style="item.cic">&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div>
            <div style="width:26%; display:inline-block; text-align: center;" v-if="item.h_flow_speed!='-'" :title="'信号机流量：'+item.flow_signal_h+'\n卡口　流量：'+item.flow_kakou_h+'\n反推　流量：'+item.flow_derive_h">{{item.h_flow_speed}}</div>
            <div style="width:26%; display:inline-block; text-align: center;" v-else>{{item.h_flow_speed}}</div>
            <!--<div style="width:12%; display:inline-block; text-align: center;padding-right: 2%;" v-show="item.speed!==''">{{item.speed}}km/h</div>-->
            <div style="width:26%; display:inline-block; text-align: center;padding-right: 1%;" v-if="item.h_history_flow_speed!='-'" :title="'流量峰值时间：'+item.max_flow_h_time">{{item.h_history_flow_speed}}</div>
            <div style="width:27%; display:inline-block; text-align: center;padding-right: 1%;" v-else>{{item.h_history_flow_speed}}</div>
            <!--<div style="width:14%; display:inline-block; text-align: center;" v-show="item.criticalSpeed!==''">{{item.criticalSpeed}}km/h</div>-->
            <!--div style="width:9%; display:inline-block; text-align: center;">{{item.saturation}}</div-->
            <!--<div style="width:9%; display:inline-block; text-align: center;padding-left: 2%;" v-show="item.travelTime!==''">{{item.travelTime}}秒</div>-->
          </li>
        </ul>
      </div>
      <div id="intersectionEchartsContent" style="width:100%;margin-top: 0.5rem;"></div>
    </div>
    <div class="intersection-a-div">
      <div class="road-popup-div-title">
        <div class="road-popup-div-title-1">{{roadNameA}}</div>
        <img :src="closeImg" class="road-popup-div-title-img" v-on:click="closeDivByid('intersection-a-div')">
      </div>
      <div class="intersection-a-div-list-title">
        <div class="intersection-a-div-list-title-name">路口方向<br/>&nbsp;</div>
        <div class="intersection-a-div-list-title-index">交通指数<br/>&nbsp;</div>
        <div class="intersection-a-div-list-title-speed">平均车速<br/><span class="title-span-font">(km/h)</span></div>
        <div class="intersection-a-div-list-title-flow-speed">自由流速度<br/><span class="title-span-font">(km/h)</span></div>
      </div>
      <ul class="list-group intersection-a-div-ul">
        <li class="intersection-a-div-li" v-for="(item,index) in intersectionAItems" :key='index' :id="item.leftLiId" v-on:click="showLineByid(item,'a')"  v-on:mouseenter="setItemStyle(true, item)" v-on:mouseleave="setItemStyle(false, item)">
          <img :src="dingweiImg" style="width: 6%;display: inline-block;">
          <div style="width:38%; display:inline-block; margin-left: 2%;">{{item.rsName}}</div>
          <div style="width:16%; display:inline-block; text-align: center;">{{item.index}}</div>
          <div style="width:16%; display:inline-block; text-align: center;">{{item.speed}}</div>
          <div style="width:16%; display:inline-block; text-align: center;">{{item.rsFlowSpeed}}</div>
        </li>
      </ul>
    </div>
    <div class="intersection-b-div">
      <div class="road-popup-div-title">
        <div class="road-popup-div-title-1">{{roadNameB}}</div>
        <img :src="closeImg" class="road-popup-div-title-img" v-on:click="closeDivByid('intersection-b-div')">
      </div>
      <div class="intersection-b-div-list-title">
        <div class="intersection-b-div-list-title-name">路口方向<br/>&nbsp;</div>
        <div class="intersection-b-div-list-title-capacity">历史最佳流量<br/><span class="title-span-font">pcu/h</span></div>
        <div class="intersection-b-div-list-title-flow">当前流量<br/><span class="title-span-font">pcu/h</span></div>
        <div class="intersection-b-div-list-title-index">交通指数<br/>&nbsp;</div>
        <div class="intersection-b-div-list-title-speed">平均车速<br/><span class="title-span-font">km/h</span></div>
        <div class="intersection-b-div-list-title-flow-speed">自由流速度<br/><span class="title-span-font">km/h</span></div>
        <div class="intersection-b-div-list-title-saturation">饱和度<br/>&nbsp;</div>
      </div>
      <ul class="list-group intersection-b-div-ul">
        <li class="intersection-b-div-li" v-for="(item,index) in intersectionBItems" :key='index' :id="item.leftLiId" v-on:click="showLineByid(item,'b')"  v-on:mouseenter="setItemStyle(true, item)" v-on:mouseleave="setItemStyle(false, item)">
          <img :src="dingweiImg" style="width: 5%;display: inline-block;">
          <div style="width:26%; display:inline-block;">{{item.rsName}}</div>
          <div style="width:13%; display:inline-block;text-align: center;">{{item.capacity}}</div>
          <div style="width:11%; display:inline-block;text-align: center;">{{item.flow_15min}}</div>
          <div style="width:11%; display:inline-block;text-align: center;">{{item.index}}</div>
          <div style="width:10%; display:inline-block;text-align: center;">{{item.speed}}</div>
          <div style="width:12%; display:inline-block;text-align: center;">{{item.rsFlowSpeed}}</div>
          <div style="width:7%; display:inline-block;text-align: center;">{{item.saturation}}</div>
        </li>
      </ul>
    </div>
    <div class="road-popup-div-echart">
      <div id="roadPopupDivEchart" style="width: 100%; height: 100%;"></div>
    </div>
  </div>

</template>
<script>
import { IMG } from "./config";
import { interf } from "./config";
import mTitle from "@/components/UI_el/title_com.vue";
export default {
    name: 'IntersectionEvaluation',
    data(){
      return {
        closeImg: IMG.CLOSE_ICON,
        eswnImg: IMG.INTERSECTION_ESWN_ICON,
        dingweiImg: IMG.INTERSECTION_DINGWEI_ICON,
        noImg: IMG.NO_ICON,
        MAP_LINE_OVERALL_ARRAY:[],
        MAP_POPUP_OVERALL_ARRAY:[],
        MAP_MARKER_OVERALL_ARRAY:[],
        analysisTitleName: '',
        showIntersectionIndex:1,
        roadNameA: '',
        roadNameB: '',
        stName: '',
        endName: '',
        intersectionAItems: [],
        intersectionBItems: [],
        trafficArr: [],
        markerIdList: [],
        currentType: "-1",
        currentleftLiId: "",
        intersectionPopupId: "intersectionPopupId",
        intersectionMarkerImgId: "intersectionMarkerImgId",
        currentTrendLabelIndex: "idtDivns",
        currenMarkerid: "",
        currentRoadId: "",
        currentRoadColor: "",
        minTimeInterval: "",
        minTimeInterval2: "",
        minTimeInterval3: "",
        timeInterval: 1000*60*5,
        speed_source: "",
        flow_source: "",
        tableRows: [],
        tableRowsA: [],
        tableRowsB: [],
        xData:[],
        //速度与流量图表数据
        sdyllChartData: {
          east: {sd:[], ll: []},//东
          south: {sd:[], ll: []},//南
          west: {sd:[], ll: []},//西
          north: {sd:[], ll: []}//北
        },
        //拥堵指数图表数据
        ydysChartData: {
          east: [],//东
          south: [],//南
          west: [],//西
          north: []//北
        },
        //旅行时间图表数据
        lxsjChartData: {
          east: [],//东
          south: [],//南
          west: [],//西
          north: []//北
        },
        //失衡指数图表数据
        shzsChartData: {
          east: [],//东
          south: [],//南
          west: [],//西
          north: []//北
        },
        //拥堵、旅行的图表配置
        ydysChartOption: {
          color: ['#7FFFD4', '#EE00EE', '#4876FF', '#CD0000'],
          grid: {
            top: 35,
            left: 50,
            right: 20,
            bottom: 50,
            backgroundColor: 'rgba(3,12,31, 1)',
            borderWidth: 2,
            borderColor: '#030c1f'
          },
          dataZoom: [{
            type: 'slider',
            height: 6,
            bottom: 9,
            borderColor: 'transparent',
            backgroundColor: '#007aff',
            textStyle: {
              color: '#ffffff',
              fontWeight: 300,
              fontFamily: 'Microsoft YaHei',
              fontSize: 12,
            },
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
            handleSize: 12,
            handleStyle: {
              shadowBlur: 8,
              shadowOffsetX: 1,
              shadowOffsetY: 2,
              shadowColor: '#aaa'
            }
          }, {
            type: 'inside'
          }],
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data:['东向西','南向北','西向东','北向南'],
            textStyle: {
              color: '#ffffff',
              fontSize: 12
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#0757a7',
                  width: 2
                }
              },
              boundaryGap: false,
              data: [],
              axisLabel: {
                //interval: 1,
                textStyle: {
                  color: '#e9e9e9',//坐标值得具体的颜色
                  fontSize: 12,
                  fontFamily: "Microsoft YaHei"
                }//,
                //rotate: 60,
                //margin: 8
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              splitLine: {show: true},//去除网格线
              splitArea: {show: false},//保留网格区域
              // background: 'rgba(3,12,31, 1)',
              min: 'dataMin',
              borderColor: '#030c1f',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#0757a7',
                  width: 0
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#e9e9e9',//坐标值得具体的颜色
                  fontSize: 12,
                  fontFamily: "Microsoft YaHei"
                }
              },
              splitLine: {           // 分隔线
                show: true,        // 默认显示，属性show控制显示与否
                // onGap: null,
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: ['#021f43'],
                  width: 1,
                  type: 'solid'
                }
              },
              axisTick: {            // 坐标轴小标记
                show: false,       // 属性show控制显示与否，默认不显示
                inside: false,    // 控制小标记是否在grid里
                length: 5,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: '#333',
                  width: 1
                }
              }
            }
          ],
          series: [
            {
              name: '东向西',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              data: []
            },
            {
              name: '南向北',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              data: []
            },
            {
              name: '西向东',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              data: []
            },
            {
              name: '北向南',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              data: []
            }
          ]
        },
        //速度与流量的图表配置
        sdylyChartOption: {
          color: ['#7FFFD4', '#EE00EE', '#4876FF', '#EEEE00'],
          grid: {
            top: 45,
            left: 75,
            right: 45,
            bottom: 40,
            backgroundColor: '#ffffff',
            borderWidth: 2,
            borderColor: '#ffffff'
          },
          dataZoom: [{
            type: 'slider',
            height: 6,
            bottom: 9,
            borderColor: 'transparent',
            backgroundColor: '#007aff',
            textStyle: {
              color: '#ffffff',
              fontWeight: 300,
              fontFamily: 'Microsoft YaHei',
              fontSize: 12,
            },
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
            handleSize: 12,
            handleStyle: {
              shadowBlur: 8,
              shadowOffsetX: 1,
              shadowOffsetY: 2,
              shadowColor: '#aaa'
            }
          }, {
            type: 'inside'
          }],
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data:['拥堵指数','速度','流量'],//['拥堵指数','速度','流量','旅行时间'],
            textStyle: {
              color: '#ffffff',
              fontSize: 12
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#ffffff',
                  width: 2
                }
              },
              axisTick: {
                show: true,
                interval: function(index,value){
                  if(!value || value.indexOf(":00")<0){
                    return false;
                  }else{
                    return true;
                  }
                }
              },
              boundaryGap: false,
              data: [],
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: '#e9e9e9',//坐标值得具体的颜色
                  fontSize: 12,
                  fontFamily: "Microsoft YaHei"
                },
                formatter: function (value, index) {
                  //console.log(value);
                  if(!value || value.indexOf(":00")<0) value="";
                  return value;
                },
                rotate: 30,
                //margin: 8
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              position: 'left',
              offset: 45,
              name: '拥堵指数 \n ',
              splitLine: {show: true},//去除网格线
              splitArea: {show: false},//保留网格区域
              // background: 'rgba(3,12,31, 1)',
              //min: 'dataMin',
              borderColor: '#ffffff',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#0757a7',
                  width: 0
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#e9e9e9',//坐标值得具体的颜色
                  fontSize: 12,
                  fontFamily: "Microsoft YaHei"
                }
              },
              splitLine: {           // 分隔线
                show: false,        // 默认显示，属性show控制显示与否
                // onGap: null,
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: ['#4176f3'],
                  width: 1,
                  type: 'solid'
                }
              },
              axisTick: {            // 坐标轴小标记
                show: false,       // 属性show控制显示与否，默认不显示
                inside: false,    // 控制小标记是否在grid里
                length: 5,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: '#4176f3',
                  width: 1
                }
              },
              nameTextStyle: {
                color: '#e9e9e9'
              }
            },
            {
              type: 'value',
              position: 'left',
              name: '速度 \n km/h',
              splitLine: {show: true},//去除网格线
              splitArea: {show: false},//保留网格区域
              // background: 'rgba(3,12,31, 1)',
              borderColor: '#030c1f',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#0757a7',
                  width: 0
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#e9e9e9',//坐标值得具体的颜色
                  fontSize: 12,
                  fontFamily: "Microsoft YaHei"
                }
              },
              splitLine: {           // 分隔线
                show: false,        // 默认显示，属性show控制显示与否
                // onGap: null,
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: ['#4176f3'],
                  width: 1,
                  type: 'solid'
                }
              },
              axisTick: {            // 坐标轴小标记
                show: false,       // 属性show控制显示与否，默认不显示
                inside: false,    // 控制小标记是否在grid里
                length: 5,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: '#4176f3',
                  width: 1
                }
              },
              nameTextStyle: {
                color: '#e9e9e9'
              }
            },
            {
              type: 'value',
              position: 'right',
              name: '流量 \n pcu/h',
              splitLine: {show: true},//去除网格线
              splitArea: {show: false},//保留网格区域
              // background: 'rgba(3,12,31, 1)',
              //min: 'dataMin',
              borderColor: '#030c1f',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#0757a7',
                  width: 0
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#e9e9e9',//坐标值得具体的颜色
                  fontSize: 12,
                  fontFamily: "Microsoft YaHei"
                }
              },
              splitLine: {           // 分隔线
                show: false,        // 默认显示，属性show控制显示与否
                // onGap: null,
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: ['#4176f3'],
                  width: 1,
                  type: 'solid'
                }
              },
              axisTick: {            // 坐标轴小标记
                show: false,       // 属性show控制显示与否，默认不显示
                inside: false,    // 控制小标记是否在grid里
                length: 5,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: '#4176f3',
                  width: 1
                }
              },
              nameTextStyle: {
                color: '#e9e9e9'
              }

            }
          ],
          series: [
            {
              name: '拥堵指数',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              yAxisIndex: 0,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0.2, color: '#7FFFD4'},
                      {offset: 1, color: '#0d1b37'}
                    ]
                  )
                }
              },
              data: []
            },
            {
              name: '速度',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              yAxisIndex: 1,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0.2, color: '#EE00EE'},
                      {offset: 1, color: '#0d1b37'}
                    ]
                  )
                }
              },
              data: []
            },
            {
              name: '流量',
              type: 'line',
              smooth: true,
              yAxisIndex: 2,
              symbol: 'circle',
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0.2, color: '#4876FF'},
                      {offset: 1, color: '#0d1b37'}
                    ]
                  )
                }
              },
              data: []

            }
          ]
        },
        //道路与路口1、2的速度与流量的图表配置
        sdylyPopupChartOption: {
          color: ['#7FFFD4', '#EE00EE', '#4876FF'],
          grid: {
            top: 30,
            left: 90,
            right: 40,
            bottom: 45,
            backgroundColor: '#0d1b37',
            borderWidth: 2,
            borderColor: '#030c1f'
          },
          tooltip: {
            trigger: 'axis',
          },
          dataZoom: [{
            type: 'slider',
            height: 6,
            bottom: 9,
            borderColor: 'transparent',
            backgroundColor: '#007aff',
            textStyle: {
              color: '#ffffff',
              fontWeight: 300,
              fontFamily: 'Microsoft YaHei',
              fontSize: 12,
            },
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
            handleSize: 12,
            handleStyle: {
              shadowBlur: 8,
              shadowOffsetX: 1,
              shadowOffsetY: 2,
              shadowColor: '#aaa'
            }
          }, {
            type: 'inside'
          }],
          legend: {
            data:['拥堵指数','速度','流量'],
            textStyle: {
              color: '#ffffff',
              fontSize: 12
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#0757a7',
                  width: 2
                }
              },
              axisTick: {
                show: true,
                interval: function(index,value){
                  if(!value || value.indexOf(":00")<0){
                    return false;
                  }else{
                    return true;
                  }
                }
              },
              boundaryGap: false,
              data: [],
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: '#e9e9e9',//坐标值得具体的颜色
                  fontSize: 11,
                  fontFamily: "Microsoft YaHei"
                },
                formatter: function (value, index) {
                  if(!value || value.indexOf(":00")<0) value="";
                  return value;
                },
                rotate: 45
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              position: 'left',
              offset: 60,
              name: '拥堵指数',
              splitLine: {show: true},//去除网格线
              splitArea: {show: false},//保留网格区域
              // background: 'rgba(3,12,31, 1)',
              //min: 'dataMin',
              borderColor: '#030c1f',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#0757a7',
                  width: 0
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#e9e9e9',//坐标值得具体的颜色
                  fontSize: 12,
                  fontFamily: "Microsoft YaHei"
                }
              },
              splitLine: {           // 分隔线
                show: false,        // 默认显示，属性show控制显示与否
                // onGap: null,
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: ['#021f43'],
                  width: 1,
                  type: 'solid'
                }
              },
              axisTick: {            // 坐标轴小标记
                show: false,       // 属性show控制显示与否，默认不显示
                inside: false,    // 控制小标记是否在grid里
                length: 5,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: '#333',
                  width: 1
                }
              },
              nameTextStyle: {
                color: '#e9e9e9'
              }
            },
            {
              type: 'value',
              position: 'left',
              name: '速度 km/h',
              splitLine: {show: true},//去除网格线
              splitArea: {show: false},//保留网格区域
              // background: 'rgba(3,12,31, 1)',
              borderColor: '#030c1f',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#0757a7',
                  width: 0
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#e9e9e9',//坐标值得具体的颜色
                  fontSize: 11,
                  fontFamily: "Microsoft YaHei"
                }
              },
              splitLine: {           // 分隔线
                show: false,        // 默认显示，属性show控制显示与否
                // onGap: null,
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: ['#021f43'],
                  width: 1,
                  type: 'solid'
                }
              },
              axisTick: {            // 坐标轴小标记
                show: false,       // 属性show控制显示与否，默认不显示
                inside: false,    // 控制小标记是否在grid里
                length: 5,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: '#333',
                  width: 1
                }
              },
              nameTextStyle: {
                color: '#e9e9e9'
              }
            },
            {
              type: 'value',
              position: 'right',
              name: '流量 pcu/h',
              splitLine: {show: true},//去除网格线
              splitArea: {show: false},//保留网格区域
              // background: 'rgba(3,12,31, 1)',
              //min: 'dataMin',
              borderColor: '#030c1f',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#0757a7',
                  width: 0
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#e9e9e9',//坐标值得具体的颜色
                  fontSize: 11,
                  fontFamily: "Microsoft YaHei"
                }
              },
              splitLine: {           // 分隔线
                show: false,        // 默认显示，属性show控制显示与否
                // onGap: null,
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: ['#021f43'],
                  width: 1,
                  type: 'solid'
                }
              },
              axisTick: {            // 坐标轴小标记
                show: false,       // 属性show控制显示与否，默认不显示
                inside: false,    // 控制小标记是否在grid里
                length: 5,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: '#333',
                  width: 1
                }
              },
              nameTextStyle: {
                color: '#e9e9e9'
              }
            }
          ],
          series: [
            {
              name: '拥堵指数',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              yAxisIndex: 0,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0.2, color: '#7FFFD4'},
                      {offset: 1, color: '#0d1b37'}
                    ]
                  )
                }
              },
              data: []
            },
            {
              name: '速度',
              type: 'line',
              smooth: true,
              yAxisIndex: 1,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0.2, color: '#EE00EE'},
                      {offset: 1, color: '#0d1b37'}
                    ]
                  )
                }
              },
              symbol: 'circle',
              data: []
            },
            {
              name: '流量',
              type: 'line',
              smooth: true,
              yAxisIndex: 2,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0.2, color: '#4876FF'},
                      {offset: 1, color: '#0d1b37'}
                    ]
                  )
                }
              },
              symbol: 'circle',
              data: []
            }
          ]
        },
        //失衡指数图表数据
        shzsChartData: {
          east: [],//东
          south: [],//南
          west: [],//西
          north: []//北
        },
        //失衡的图表配置
        shzsChartOption: {
          color: ['#4876FF'],
          grid: {
            top: 25,
            left: 30,
            right: 20,
            bottom: 45,
            backgroundColor: 'rgba(3,12,31, 1)',
            borderWidth: 2,
            borderColor: '#030c1f'
          },
          dataZoom: [{
            type: 'slider',
            height: 6,
            bottom: 9,
            borderColor: 'transparent',
            backgroundColor: '#007aff',
            textStyle: {
              color: '#ffffff',
              fontWeight: 300,
              fontFamily: 'Microsoft YaHei',
              fontSize: '1.2rem',
            },
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
            handleSize: 12,
            handleStyle: {
              shadowBlur: 8,
              shadowOffsetX: 1,
              shadowOffsetY: 2,
              shadowColor: '#aaa'
            }
          }, {
            type: 'inside'
          }],
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data:['失衡指数'],
            textStyle: {
              color: '#e9e9e9',
              fontSize: 12
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#e9e9e9',
                  width: 2
                }
              },
              axisTick: {
                show: true,
                interval: function(index,value){
                  if(!value || value.indexOf(":00")<0){
                    return false;
                  }else{
                    return true;
                  }
                }
              },
              boundaryGap: false,
              data: [],
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: '#e9e9e9',//坐标值得具体的颜色
                  fontSize: '1rem',
                  fontFamily: "Microsoft YaHei"
                },
                formatter: function (value, index) {
                  //console.log(value);
                  if(!value || value.indexOf(":00")<0) value="";
                  return value;
                },
                rotate: 45
                //margin: 8
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              splitLine: {show: true},//去除网格线
              splitArea: {show: false},//保留网格区域
              // background: 'rgba(3,12,31, 1)',
              min: 'dataMin',
              borderColor: '#030c1f',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#0757a7',
                  width: 0
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#e9e9e9',//坐标值得具体的颜色
                  fontSize: '1rem',
                  fontFamily: "Microsoft YaHei"
                }
              },
              splitLine: {           // 分隔线
                show: false,        // 默认显示，属性show控制显示与否
                // onGap: null,
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: ['#021f43'],
                  width: 1,
                  type: 'solid'
                }
              },
              axisTick: {            // 坐标轴小标记
                show: false,       // 属性show控制显示与否，默认不显示
                inside: false,    // 控制小标记是否在grid里
                length: 5,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: '#333',
                  width: 1
                }
              }
            }
          ],
          series: [
            {
              name: '失衡指数',
              type: 'line',
              smooth: true,
              data: []
            }
          ]
        },
        //图表对象
        myChart: {},
        myPopupChart: {},
        shzsChart: {}, //失衡指数图表对象
        isReture: false,
        refInterval: {},
        intersectionRotateX: 0,
        intersectionRotateZ: 27,
        deg:0,//偏移角度
        intersectionRotate1Z: 0,
        intersectionRotateScale: 1,
        isFlyTo: false,
        markerIconDivId: [],
        currentZoom: 11,
        currentzi: 3,
        isM3: false,
        isM1_2: false,
        isNetworkFlow: false,
        tempRoadLinesId: [],
        layesArray:["area_layer_area_group_id"],
        allMarkerLayer: {},//第一第二类路口图层id集合
        layesLochusArray:[],//中队辖区图层id集合
        z13: true,
        roadArrowMarkers: [], //道路箭头marker集合
        road1Lnglat: "",
        road2Lnglat: "",
        loadData1: false,
        loadData2: false,
        currentDirection: "", //当前显示的路口方向
        threeType: "",
        itsaTitleName1: "早高峰", //第三类路口标签名
        itsaTitleName2: "晚高峰",   //第三类路口标签名
        itsaTitleCongestionIndex1: 4.3,
        itsaTitleCongestionIndex2: 5.6,
        itsaTitleCongestionIndex3: 4.6,
        itsaTitleCongestionName1: "中",
        itsaTitleCongestionName2: "高",
        itsaTitleCongestionName3: "低",
        ssjt:{//路口实时交通运行状况
          ydzs: "当前时刻，此方向车速对应的交通指数", //拥堵指数
          ydzt: "根据拥堵指数所属区间得到的拥堵状态", //拥堵状态
          dqll: "当前时刻的车流量，单位pcu每小时。", //当前流量
          dqcs: "当前时刻此方向的车辆速度，单位km每小时。", //当前车速
          lszjll: "前两个月内此方向的最大流量", //历史最佳流量
          lszjcs: "前两个月内此方向的最大流量时的车速", //历史最佳车速
          bhd: "当前流量与最佳流量的比值", //饱和度
          lxsj: "当前时段，车辆通过上游路段的时间", //旅行时间
          lkjhzs: "当前时段，表示路口各个方向速度差异的指标" //路口均衡指数
        },
        zgfjt: { //早高峰交通运行状况
          gfzs: "早高峰7:00-9:00时段内交通指数最高值", //高峰指数
          fzsk: "早高峰7:00-9:00交通指数最高值对应的时刻", //峰值时刻
          lszjll: "前两个月内早高峰的最大流量", //历史最佳流量
          lszjcs: "前两个月内早高峰最大流量发生时对应的车速", //历史最佳车速
          drjzll: "当天早高峰7:00-9:00的最大流量", //当日最佳流量
          drjzcs: "当天早高峰7:00-9:00最大流量时对应的平均旅行速度", //当日最佳车速
          lkjhzs: "当天早高峰7:00-9:00路口失衡指数的平均值" //路口均衡指数
        },
        wgfjt: { //晚高峰交通运行状况
          gfzs: "晚高峰17:00-19:00时段内交通指数最高值", //高峰指数
          fzsk: "晚高峰17:00-19:00交通指数最高值对应的时刻", //峰值时刻
          lszjll: "前两个月内晚高峰的最大流量", //历史最佳流量
          lszjcs: "前两个月内晚高峰最大流量发生时对应的车速", //历史最佳车速
          drjzll: "当天晚高峰17:00-19:00的最大流量", //当日最佳流量
          drjzcs: "当天晚高峰17:00-19:00最大流量时对应的平均旅行速度", //当日最佳车速
          lkjhzs: "当天晚高峰17:00-19:00路口失衡指数的平均值" //路口均衡指数
        },
        gfjt1: { //早高峰交通运行状况
          gfzs: "早高峰7:00-9:00时段内交通指数最高值", //高峰指数
          fzsk: "早高峰7:00-9:00交通指数最高值对应的时刻", //峰值时刻
          lszjll: "前两个月内早高峰的最大流量", //历史最佳流量
          lszjcs: "前两个月内早高峰最大流量发生时对应的车速", //历史最佳车速
          drjzll: "当天早高峰7:00-9:00的最大流量", //当日最佳流量
          drjzcs: "当天早高峰7:00-9:00最大流量时对应的平均旅行速度", //当日最佳车速
          lkjhzs: "当天早高峰7:00-9:00路口失衡指数的平均值" //路口均衡指数
        },
        gfjt2: { //晚高峰交通运行状况
          gfzs: "晚高峰17:00-19:00时段内交通指数最高值", //高峰指数
          fzsk: "晚高峰17:00-19:00交通指数最高值对应的时刻", //峰值时刻
          lszjll: "前两个月内晚高峰的最大流量", //历史最佳流量
          lszjcs: "前两个月内晚高峰最大流量发生时对应的车速", //历史最佳车速
          drjzll: "当天晚高峰17:00-19:00的最大流量", //当日最佳流量
          drjzcs: "当天晚高峰17:00-19:00最大流量时对应的平均旅行速度", //当日最佳车速
          lkjhzs: "当天晚高峰17:00-19:00路口失衡指数的平均值" //路口均衡指数
        },
        ijluAjax: false,
        iaccAjax: false,
        iaclAjax: false,
        iciuAjax: false,
        reiciuAjax: false,
        reijsuAjax: false,
        reijtuAjax: false,
        icplAjax: false,
        ijsuAjax: false,
        ijtuAjax: false,
        peuAjax: false,
        repeuAjax: false,
        areaColorList: ["#66CC66","#CCFF99","#669933","#99CC66","#003300","#CCFFCC","#339966","#99CC99","#99CC33","#66CCCC","#97FFFF","#000080"],
        adAreaColorList: ["#66CC66","#CCFF99","#669933","#99CC66","#003300","#006633","#339966","#99CC99","#CCFFCC","#99CC33","#996699","#CCCC00","#CCCC66","#999933","#9999CC","#CCCCFF","#CCCC33","#669999","#99CCFF","#0099FF","#CCFFFF","#3399CC","#99CCFF","#99CCFF","#6666CC","#CCFF99","#66CCCC","#FFCC99","#66CCFF","#FF6666","#CCFF99","#669933","#99CC66","#003300"],
        unbalanceList: [
          {backgroundColor: "background-color:#00bc52",name:"均衡(0,2)"},
          {backgroundColor: "background-color:#97d158",name:"轻微失衡(2,4)"},
          {backgroundColor: "background-color:#f6f954",name:"失衡(4,6)"},
          {backgroundColor: "background-color:#f1c11f",name:"较重失衡(6,8)"},
          {backgroundColor: "background-color:#f00100",name:"严重失衡(8,10)"}
        ],
        leftListUlItems: [],
        panType: "",
        is_sn:false, //选中方向是否为s_n方向
        laneData:[],  //车道数据
        arrow:{straightImg:IMG.INTERSECTION_STRIGHT,leftImg:IMG.INTERSECTION_LEFT,rightImg:IMG.INTERSECTION_RIGHT,
          stright_l_Img:IMG.INTERSECTION_STRIGHT_L,stright_r_Img:IMG.INTERSECTION_STRIGHT_R},
        is_noLane:true //是否显示均衡指数
      }
    },
    components:{mTitle:mTitle},
    mounted(){
      let that=this;
      this.map=this.$store.state.map;
      $('.showIns .videoCls').css({background: 'url(./static/images/navtab/background_bomb_box.png) 0% 0% / 100% 100% no-repeat'});
      this.map.resize();
      this.map.setCenter([108.937368,34.232634]);
      this.map.setZoom(12.5);
      that.myChart = echarts.init(document.getElementById('intersectionEchartsContent'));
      that.myPopupChart = echarts.init(document.getElementById('roadPopupDivEchart'));
      that.shzsChart = echarts.init(document.getElementById('unbalanceEchartsContent')); //均衡指数曲线-去掉

      $(window).resize(function (){
        that.resizeContainer();
        that.myChart.resize();
        that.myPopupChart.resize();
        that.shzsChart.resize();
      });

      that.createPointPopupToArray(that.intersectionPopupId, null, null, [0, -15], null, null, this.map, this.MAP_POPUP_OVERALL_ARRAY);

      //$('.fixed-table-loading').hide();
      //that.createDivintersectionMarker();
      that.intersectionRotateScale = 1.2-(18-this.map.getZoom())*0.2;
      //地图旋转角度改变事件
      this.map.on("move", that.setMapMove);
      this.map.on("zoomend", that.setMapZoomend);
      this.map.on('click', that.showLinePopup);
      this.map.on('mousemove',that.setMousemoveStyle);
      setTimeout(function(){
        //加载路口数据
        that.getIntersectionData();
        that.minTimeInterval3 = window.setInterval(function(){
          that.reGetIntersectionData();
        },that.timeInterval);
      },300);

      for(let i=0; i<15; i++){
        let outer = document.createElement('div');
        let el = document.createElement('div');
        el.id = "arrowRoadMarkerId"+i;
        el.style.backgroundImage= "url('"+IMG.INTERSECTION_ARROW_ROAD+"')";
        el.style.backgroundSize = 'cover';
        el.style.width = 18+"px";
        el.style.height = 18+"px";
        outer.appendChild(el);
        let offsetX = 9;
        let offsetY = 9;
        let marker = new minemap.Marker(outer, {offset: [-offsetX, -offsetY]});
        that.roadArrowMarkers.push(marker);
      };
    },
    destroyed: function () {
      let that = this;
      that.isReture = true;
      this.map.off("move", that.setMapMove);
      this.map.off("zoomend", that.setMapZoomend);
      this.map.off('click', that.showLinePopup);
      this.map.off('mousemove',that.setMousemoveStyle);
      if(that.ijluAjax) that.ijluAjax.abort();
      if(that.iaccAjax) that.iaccAjax.abort();
      if(that.iaclAjax) that.iaclAjax.abort();
      if(that.iciuAjax) that.iciuAjax.abort();
      if(that.reiciuAjax) that.reiciuAjax.abort();
      if(that.reijsuAjax) that.reijsuAjax.abort();
      if(that.reijtuAjax) that.reijtuAjax.abort();
      if(that.icplAjax) that.icplAjax.abort();
      if(that.ijsuAjax) that.ijsuAjax.abort();
      if(that.ijtuAjax) that.ijtuAjax.abort();
      if(that.peuAjax) that.peuAjax.abort();
      if(that.repeuAjax) that.repeuAjax.abort();

      this.REMOVE_MAP_MARKER_OVERALL_ARRAY();
      this.REMOVE_MAP_POPUP_OVERALL_ARRAY();
      this.REMOVE_MAP_LINE_OVERALL_ARRAY(null,this.map);
      /*for(let i =0; i<15; i++){
        this.map.removeLayer(that.layesArray[i]);
      }*/
      //清除大队辖区图层
      if (this.map.getLayer("area_layer_area_group_id")) {
        this.map.removeLayer("area_layer_area_group_id");
        this.map.removeSource('area_source_area_group_id');
        this.map.removeLayer("polygon_area_polygon_group_id");
        this.map.removeSource('polygon_source_area_polygon_group_id');
      }
      //清除中队辖区图层
      that.layesLochusArray.forEach(function (element, index, array) {
        if (this.map.getLayer("area_layer_"+element)) {
          this.map.removeLayer("area_layer_"+element);
          this.map.removeSource('area_source_'+element);
          this.map.removeLayer("polygon_"+element);
          this.map.removeSource('polygon_source_'+element);
        }
      });
      for( let key in that.allMarkerLayer){
        if (this.map.getLayer("poi_point_"+key)) {
          this.map.removeLayer("poi_point_"+key);
          this.map.removeSource('marker_source_'+key);
        }
      }
      for(let i=0; i<15; i++) {
        that.roadArrowMarkers[i].remove();
      }
      window.clearInterval(this.minTimeInterval);
      window.clearInterval(this.minTimeInterval2);
      window.clearInterval(this.minTimeInterval3);
    },
    methods:{
      closeAnalysis(type){
        let that = this;
        if(type===1){
          $('.intersection-traffic-trend-analysis').hide();
        }else if(type===2){
          that.clearMarker3();
          that.isM3 = false;
          that.isNetworkFlow = true;
          that.setMarkerLayerShow();
          that.showIntersectionMarkers();
        }
      },
      closeDivByid(id){
        let that = this;
        that.clearRoadLinesAndPopupDiv();
        that.isNetworkFlow = true;
        that.isM1_2 = false;

      },
      resizeContainer(){
        let analysisHeight = $('.intersection-traffic-analysis').outerHeight(true);
        $('#unbalanceEchartsContent').css('height', (analysisHeight*0.20) + 'px');
        $('#unbalanceEchartsContent').css('width', $('.intersection-traffic-analysis').width());
        let titleHeight = $('.intersection-traffic-analysis-title').outerHeight(true);
        let unbalanceEchartsContent=$('#laneContent').outerHeight(true);
        if(this.is_noLane){
          unbalanceEchartsContent = $('#unbalanceEchartsContent').outerHeight(true);
        };
        let directionTitleHeight = $('.itat-direction-title').outerHeight(true);
        let itsaDiv1Height = $('#itsaDiv1').outerHeight(true);
        let itsaDiv2Height = $('#itsaDiv2').outerHeight(true);
        let itsaDiv3Height = $('#itsaDiv3').outerHeight(true);
        let ih = analysisHeight-titleHeight-unbalanceEchartsContent-directionTitleHeight-itsaDiv1Height-itsaDiv2Height-itsaDiv3Height-150;
        $('#intersectionEchartsContent').css('height', (ih) + 'px');

        let itcLeft = $('.intersection-traffic-analysis').outerWidth(true)-210;
        $('.itsa-1-title-congestion').css('margin-left',itcLeft+'px');
      },
      sort(property){
        return function(a,b){
          return b[property] - a[property];
        }
      },
      //获取路口评价列表数据
      getIntersectionData(type){
        let that = this;
        that.markerIdList = [];
        that.markerIconDivId = [];
        let datetime = "";
        if(!type) type=0;
        that.ijluAjax = $.ajax({
          url: './static/json/intersection/intersectionListData.json',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          async: true,
          responseType: 'json',
          dataType: 'json',
          method: 'get',
          data: {
            date: datetime,
            type: type
          },
          success: function (result) {
            if(result.errcode == 0 && result.data.total>0){
              let iconObj = that.getIconByMonitorType("intersectionMarkerC");
              let intersecItems = result.data.rows.sort(that.sort('unBalanceIndex'));
              let iluis = [];
              for(let i=intersecItems.length-1; i>=0; i--){
                let lnglat = intersecItems[i].lnglat.split(",");
                intersecItems[i].indexValue = parseFloat(intersecItems[i].indexValue).toFixed(1);
                intersecItems[i].leftLiId = "intersectionItemLiId"+i;
                intersecItems[i].lnglat = lnglat;
                intersecItems[i].datetime = datetime;
                intersecItems[i].intersectionMarkerId = intersecItems[i].juncId;
                if(intersecItems[i].juncId === "123"){
                  that.createIntersectionMarker(intersecItems[i], iconObj, 0,i);
                  that.road1Lnglat = [Number(lnglat[0]),Number(lnglat[1])];
                  intersecItems[i].type = 0;
                }else{
                  that.createIntersectionMarker(intersecItems[i], iconObj, 1,i);
                  that.road2Lnglat = [Number(lnglat[0]),Number(lnglat[1])];
                  intersecItems[i].type = 1;
                }
                let iw = false;
                intersecItems[i].iShow =intersecItems[i].isUnBalance;
                intersecItems[i].unbalanceName = that.getNameByunbalanceindex(intersecItems[i].unBalanceIndex);
                intersecItems[i].unbalanceStyle = "width: 1.2rem;height: 1.2rem;background-color:"+that.getColorByIndex(intersecItems[i].unBalanceIndex);
              }
              that.leftListUlItems = intersecItems;
            }
          }
        });
      },
      //获取路口评价列表数据
      reGetIntersectionData(type) {
        let that = this;
        let datetime = "";
        if (!type) type = 0;
        //获取路口评价的路口数据
        that.ijluAjax = $.ajax({
          url: './static/json/intersectionListData.json',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          async: true,
          responseType: 'json',
          dataType: 'json',
          method: 'get',
          data: {
            date: datetime,
            type: type
          },
          success: function (result) {
            if (result.errcode == 0 && result.data.total > 0) {
              let intersecItems = result.data.rows.sort('unbalanceindex');
              for (let i = intersecItems.length-1; i >=0; i--) {
                let lnglat = intersecItems[i].lnglat.split(",");
                intersecItems[i].indexValue = parseFloat(intersecItems[i].indexValue).toFixed(1);
                intersecItems[i].leftLiId = "intersectionItemLiId" + i;
                intersecItems[i].lnglat = lnglat;
                intersecItems[i].datetime = datetime;
                intersecItems[i].intersectionMarkerId = intersecItems[i].juncId;
                if (intersecItems[i].juncId === "123") {
                  that.road1Lnglat = [Number(lnglat[0]), Number(lnglat[1])];
                  intersecItems[i].type = 0;
                } else {
                  that.road2Lnglat = [Number(lnglat[0]), Number(lnglat[1])];
                  intersecItems[i].type = 1;
                }
                let iw = false;
                if (intersecItems[i].unbalanceindex >= 4) iw = true;
                intersecItems[i].iShow = iw;
                intersecItems[i].unbalanceName = that.getNameByunbalanceindex(intersecItems[i].unbalanceindex);
                intersecItems[i].unbalanceStyle = "width: 1.2rem;height: 1.2rem;background-color:" + that.getColorByIndex(intersecItems[i].unbalanceindex);
              }
              that.leftListUlItems = intersecItems;
            }
          }
        });
      },
      //根据路口数量获取颜色
      getColorByCount(pcount) {
        let pcolor = '#dc2e2e';
        if(pcount<10){
          pcolor = '#57b743';
        }else if(pcount<50){
          pcolor = '#9fbd10';
        }else if(pcount<100){
          pcolor = '#dda600';
        }else if(pcount<200){
          pcolor = '#fd6919';
        }
        return pcolor;
      },
      //创建路口3类型标点
      createIntersectionMarker(row, iconObj, i,index) {
        let that = this;
        let outer = document.createElement('div');
        let el = document.createElement('div');
        that.markerIconDivId.push("intersectionOuter"+i);
        el.id = "intersectionOuter"+i;
        el.style.backgroundImage= "url('"+iconObj.icon+"')";
        el.style.backgroundSize = 'cover';
        el.style.width = iconObj.width+'px';
        el.style.height = iconObj.height+'px';
        el.style.cursor = 'pointer';
        outer.appendChild(el);
        let offsetX = iconObj.width/2;
        let offsetY = iconObj.height/2;

        let marker = new minemap.Marker(outer, {offset: [-offsetX, -offsetY]})
          .setLngLat(row.lnglat);

        marker.addTo(this.map);
        this.MAP_MARKER_OVERALL_ARRAY[row.intersectionMarkerId] = marker;
        that.markerIdList.push(row.intersectionMarkerId);

        outer.addEventListener('click',function(e){
          that.showFlyToDiv(row,i,index);
          e.stopPropagation();//终止事件冒泡
        },false);
      },
      //创建路口1-2类型标点
      createIntersectionMarker1(geometry,iconObj, id, i,type) {
        let that = this;
        let outer = document.createElement('div');
        let el = document.createElement('div');
        that.markerIconDivId.push("intersectionOuter"+type+i);
        el.id = "intersectionOuter"+type+i;
        el.style.backgroundImage= "url('"+iconObj.icon+"')";
        el.style.backgroundSize = 'cover';
        el.style.width = iconObj.width+'px';
        el.style.height = iconObj.height+'px';
        el.style.cursor = 'pointer';
        outer.appendChild(el);
        let offsetX = iconObj.width/2;
        let offsetY = iconObj.height/2;

        let marker = new minemap.Marker(outer, {offset: [-offsetX, -offsetY]})
          .setLngLat(geometry.coordinates).addTo(this.map);
        this.MAP_MARKER_OVERALL_ARRAY["intersectionOuter"+type+i] = marker;

        outer.addEventListener('click',function(e){
          that.getIntersectionDataByType(id,type);
          e.stopPropagation();//终止事件冒泡
        });
      },
      //创建辖区聚合标点图层
      createAreaMarkerLayer(areaData, id, show){
        this.map.addSource("area_source_"+id, {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": areaData
          }
        });
        let visibility = "visible";
        let textOffset = [0, 0];
        if(show){
          visibility = "none";
        }

        this.map.addLayer({
          "id": "area_layer_"+id,
          "type": "symbol",
          "source": "area_source_"+id,
          "layout": {
            "icon-image": "{icon}",
            "text-field": "{title}",
            "text-offset": textOffset,
            "text-anchor": "center",
            "icon-allow-overlap": true,  //图标允许压盖
            "text-allow-overlap": true,   //图标覆盖文字允许压盖
            "visibility": visibility
          },
          "paint": {
            "text-color":{
              'type': 'identity',
              'property': 'color'
            }
          }
        });
      },
      /*创建标点图层*/
      createMarkerLayer(poiData, id){
        this.map.addSource('marker_source_'+id, {
          type: "geojson",
          data: poiData
        });
        this.layesArray.push("poi_point_"+id);
        this.map.addLayer({
          "id": "poi_point_"+id,
          "type": "symbol",
          "source": 'marker_source_'+id,
          "layout": {
            "icon-image": "{icon}",
            'visibility': "none"
          }
        });
      },
      getIntersectionDataByType(id,type){
        // let that = this;
        // that.clearRoadLinesAndPopupDiv();
        // that.clearMarker3();
        // that.tempRoadLinesId = [];
        // that.isNetworkFlow=false;
        // that.isM1_2 = true;
        // if(that.currentleftLiId!='') $('#' + that.currentleftLiId).css("background-color", "transparent");
        // that.iciuAjax = $.ajax({
        //   url: globals.INTERSECTION_CROSS_INFO_URL,
        //   headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //   },
        //   async: false,
        //   responseType: 'json',
        //   method: 'post',
        //   dataType: "json",
        //   data: {
        //     crossId: id
        //   },
        //   success: function (data) {
        //     let items = [];

        //     if(data.errcode == 0 && data.data.cross_data){
        //       let minMaxLonlat = [360,0,360,0];
        //       for(let i=0; i<data.data.cross_data.length; i++){
        //         let color="#33CC00";
        //         if(data.data.cross_data[i].is_start === "1") color="#00e4ff";
        //         items.push({
        //           leftLiId: 'li_'+type+data.data.cross_data[i].rs_id,
        //           rsName: data.data.cross_data[i].rs_name,
        //           capacity: data.data.cross_data[i].capacity == 0 ? "-" : data.data.cross_data[i].capacity,
        //           flow_15min: data.data.cross_data[i].flow_15min == 0 ? "-" : data.data.cross_data[i].flow_15min,
        //           index: data.data.cross_data[i].rs_tpi == 0 ? "-" : data.data.cross_data[i].rs_tpi,
        //           speed: data.data.cross_data[i].rs_speed == 0 ? "-" : data.data.cross_data[i].rs_speed,
        //           rsFlowSpeed: data.data.cross_data[i].rs_flow_speed == 0 ? "-" : data.data.cross_data[i].rs_flow_speed,
        //           saturation: data.data.cross_data[i].saturation == 0 ? "-" : data.data.cross_data[i].saturation,
        //           geometry: data.data.cross_data[i].rs_geometry,
        //           id:data.data.cross_data[i].rs_id,
        //           lineColor: color
        //         });

        //         let features = [{
        //           type: "Feature",
        //           geometry: data.data.cross_data[i].rs_geometry,
        //           properties:{
        //             "color": color,
        //             "id": data.data.cross_data[i].rs_id
        //           }
        //         }];
        //         //在地图上绘线
        //         that.createLines(that.MAP_POPUP_OVERALL_ARRAY, data.data.cross_data[i].rs_id, features, true, "#FFFF00", 8, true, [], 0.3, 0);
        //         that.tempRoadLinesId.push(data.data.cross_data[i].rs_id);
        //         that.getMinMaxLonlat(data.data.cross_data[i].rs_geometry.coordinates,minMaxLonlat);
        //       }
        //       if(type==='a'){
        //         that.roadNameA = data.data.cross_name;
        //       }else{
        //         that.roadNameB = data.data.cross_name;
        //       }
        //       //在地图上绘线
        //       //根据道路的最大最小经纬度设置地图范围
        //       if(minMaxLonlat[1] > 0){
        //         that.z13=false;
                
        //         that.fitBox(that.map, minMaxLonlat[0], minMaxLonlat[2], minMaxLonlat[1], minMaxLonlat[3]);
        //       }
        //     }
        //     if(type==='a'){
        //       that.intersectionAItems = items;
        //       if($(".intersection-a-div").is(":hidden")) $('.intersection-a-div').show();
        //     }else{
        //       that.intersectionBItems = items;
        //       if($(".intersection-b-div").is(":hidden")) $('.intersection-b-div').show();
        //     }
        //     that.minTimeInterval = window.setInterval(function(){
        //       that.reShowIntersectionDataByType(id,type);
        //     },that.timeInterval);
        //     setTimeout(function(){
        //       that.showLineByid(items[0],type);
        //     },1000);
        //   },
        //   error: function (XMLHttpRequest, textStatus, errorThrown) {
        //     console.log(XMLHttpRequest)
        //     console.log(textStatus)
        //     console.log(errorThrown)
        //   }
        // });
      },
      reShowIntersectionDataByType(id,type) {
        // let that = this;
        // that.reiciuAjax = $.ajax({
        //   url: globals.INTERSECTION_CROSS_INFO_URL,
        //   headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //   },
        //   async: false,
        //   responseType: 'json',
        //   method: 'post',
        //   dataType: "json",
        //   data: {
        //     crossId: id
        //   },
        //   success: function (data) {
        //     //console.log(data);
        //     let items = [];

        //     if(data.errcode == 0 && data.data.cross_data){

        //       for(let i=0; i<data.data.cross_data.length; i++){
        //         let color="#33CC00";
        //         if(data.data.cross_data[i].is_start === "1") color="#00e4ff";
        //         items.push({
        //           leftLiId: 'li_'+type+data.data.cross_data[i].rs_id,
        //           rsName: data.data.cross_data[i].rs_name,
        //           capacity: data.data.cross_data[i].capacity == 0 ? "-" : data.data.cross_data[i].capacity,
        //           flow_15min: data.data.cross_data[i].flow_15min == 0 ? "-" : data.data.cross_data[i].flow_15min,
        //           index: data.data.cross_data[i].rs_tpi == 0 ? "-" : data.data.cross_data[i].rs_tpi,
        //           speed: data.data.cross_data[i].rs_speed == 0 ? "-" : data.data.cross_data[i].rs_speed,
        //           rsFlowSpeed: data.data.cross_data[i].rs_flow_speed == 0 ? "-" : data.data.cross_data[i].rs_flow_speed,
        //           saturation: data.data.cross_data[i].saturation == 0 ? "-" : data.data.cross_data[i].saturation,
        //           geometry: data.data.cross_data[i].rs_geometry,
        //           id:data.data.cross_data[i].rs_id,
        //           lineColor: color
        //         });
        //       }
        //       if(type==='a'){
        //         that.roadNameA = data.data.cross_name;
        //       }else{
        //         that.roadNameB = data.data.cross_name;
        //       }
        //     }
        //     if(type==='a'){
        //       that.intersectionAItems = items;
        //     }else{
        //       that.intersectionBItems = items;
        //     }
        //   },
        //   error: function (XMLHttpRequest, textStatus, errorThrown) {
        //     console.log(XMLHttpRequest)
        //     console.log(textStatus)
        //     console.log(errorThrown)
        //   }
        // });
      },
      //点击第三类路口后飞行完显示路口信息
      showFlyToDiv(item, type,index){
        let that = this;
        that.showIntersectionIndex=index>3?1:index+1;
        if(that.currenMarkerid !== "" && that.currenMarkerid !== item.leftLiId) {
          $('#' + that.currenMarkerid).css("background-color", "#36579f");
        }
        that.clearRoadLinesAndPopupDiv();
        that.clearMarker3();
        that.setMarkerLayerHide();
        that.isNetworkFlow = false;
        that.isFlyTo = true;
        that.isM3 = true;
        that.loadData1 = true;
        that.loadData2 = true;
        if(this.map.getZoom()>16){
          if(that.currenMarkerid === item.leftLiId){
            that.showIntersectionInfo(item,type,false);
          }else{
            that.road2Lnglat =[Number(item.lnglat[0]), Number(item.lnglat[1])];
            this.map.flyTo({center: item.lnglat, zoom:17,speed: 1, easing: function(t){if(t>0.5){that.showIntersectionInfo(item,type,true);} return t;}});
          }
        }else{
          that.road2Lnglat =[Number(item.lnglat[0]), Number(item.lnglat[1])];
          this.map.flyTo({center: item.lnglat, zoom:17,speed: 1, easing: function(t){if(t>0.5){that.showIntersectionInfo(item,type,true);} return t;}});
        }
        if(that.currenMarkerid !== item.leftLiId) {
          that.getCrossPeakData(item.juncId, item.datetime, type);
          that.showStateAnalysis(item.juncId, item.datetime, type);
          that.showTrendAnalysis(item.juncId, item.datetime);
        }
      },
      //根据日期和路口id显示路口信息
      showIntersectionInfo(item,type, noFly) {
        let that = this;
        if(noFly && (this.map.getZoom() < 16 || that.isFlyTo == false)) return false;
        that.hideIntersectionMarkers();
        if(that.currenMarkerid!=item.leftLiId) {
          that.currenMarkerid = item.leftLiId;
          $('#' + item.leftLiId).css("background-color", "#4176f3");
          if($('.intersection-traffic-analysis').is(':hidden')){　　//如果node是隐藏的则显示node元素，否则隐藏
            $('.intersection-traffic-analysis').show();
          }
          if(item.intersectionMarkerId === "125"){
            that.createDivintersection1Marker();
          }else if(item.intersectionMarkerId === "700" ||item.intersectionMarkerId === "690" || item.intersectionMarkerId === "1192" || item.intersectionMarkerId === "1176" || item.intersectionMarkerId === "643" || item.intersectionMarkerId === "1175") {
            that.createDivintersectionMarker(item.juncId);
          }else{
            that.createDivintersection1Marker();
          }
          this.MAP_MARKER_OVERALL_ARRAY[that.intersectionMarkerImgId].setLngLat(item.lnglat).addTo(this.map);
          if(that.loadData1 && that.loadData2){
            setTimeout(function(){
                that.resizeContainer();
              that.myChart.resize();
              that.shzsChart.resize();
              that.initIntersection(item.juncName,type);
            },2000);
          }else {
            that.resizeContainer();
            that.myChart.resize();
            that.shzsChart.resize();
            that.initIntersection(item.juncName, type);
          }
        }else{
          if($('.intersection-traffic-analysis').is(':hidden')){　　//如果node是隐藏的则显示node元素，否则隐藏
            $('.intersection-traffic-analysis').show();
          }
          if(this.MAP_MARKER_OVERALL_ARRAY[that.intersectionMarkerImgId]) this.MAP_MARKER_OVERALL_ARRAY[that.intersectionMarkerImgId].addTo(this.map);
          that.initIntersection(item.juncName,type);
        }
        that.isFlyTo = false;

        if(that.minTimeInterval != "") window.clearInterval(that.minTimeInterval);
        that.minTimeInterval = window.setInterval(function(){
          that.reShowIntersectionInfo(item.juncId, item.datetime, type);
        },that.timeInterval);
      },
      reShowIntersectionInfo(juncId, datetime,type){
        // let that = this;
        // that.getCrossPeakData(juncId, datetime,type);
        // that.reijsuAjax = $.ajax({
        //   url: globals.INTERSECTION_JUNCTION_STATE_URL,
        //   headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //   },
        //   async: true,
        //   responseType: 'json',
        //   dataType: 'json',
        //   method: 'post',
        //   data: {
        //     date: datetime,
        //     juncId: juncId
        //   },
        //   success: function (result) {
        //     if(result.errcode === 0 && result.data.total>0){

        //       let tableData = [
        //         {dir: "北向南",juncName: "",congestionIndex: "",speed: "",criticalSpeed: "",flow: "",maxFlow: "",saturation: "",travelTime: "",direction: "",unbalanceindex: "",leftLiId: 'trendIndexns',type: "",arrowLonlat: "",cic: "",dirS: 0,dirL: 0,dirR: 0},
        //         {dir: "南向北",juncName: "",congestionIndex: "",speed: "",criticalSpeed: "",flow: "",maxFlow: "",saturation: "",travelTime: "",direction: "",unbalanceindex: "",leftLiId: 'trendIndexsn',type: "",arrowLonlat: "",cic: "",dirS: 0,dirL: 0,dirR: 0},
        //         {dir: "西向东",juncName: "",congestionIndex: "",speed: "",criticalSpeed: "",flow: "",maxFlow: "",saturation: "",travelTime: "",direction: "",unbalanceindex: "",leftLiId: 'trendIndexwe',type: "",arrowLonlat: "",cic: "",dirS: 0,dirL: 0,dirR: 0},
        //         {dir: "东向西",juncName: "",congestionIndex: "",speed: "",criticalSpeed: "",flow: "",maxFlow: "",saturation: "",travelTime: "",direction: "",unbalanceindex: "",leftLiId: 'trendIndexew',type: "",arrowLonlat: "",cic: "",dirS: 0,dirL: 0,dirR: 0},
        //       ];
        //       let rows = result.data.rows;
        //       for(let i=0; i<rows.length; i++){
        //         let cc = that.getColorByIndex(parseFloat(rows[i].congestionIndex).toFixed(1));
        //         if(i===0){
        //           that.speed_source = "数据来源："+rows[i].speed_source;
        //           that.flow_source = "数据来源："+rows[i].flow_source;
        //         }
        //         let cne = rows[i].congestionName;
        //         if(cne === "通畅"){
        //           cne = "通&emsp;&emsp;畅";
        //         }
        //         let tdaFlow = rows[i].flow_h==0?'-':parseInt(rows[i].flow_h);
        //         if((rows[i].dir_s>0 || rows[i].dir_l>0 || rows[i].dir_r>0) && !(rows[i].dir_s>0 && rows[i].dir_l>0 && rows[i].dir_r>0)) tdaFlow=">"+tdaFlow;
        //         let arrowlnglat=that.GetArrowLonlat(rows[i].dir_geometry.coordinates.reverse());
        //         let tda = {
        //           dir: that.getNameByDirection(rows[i].direction),
        //           juncName: cne,
        //           congestionIndex: parseFloat(rows[i].congestionIndex).toFixed(1),
        //           speed: rows[i].flow_h_speed==0?'-':parseInt(rows[i].flow_h_speed),
        //           criticalSpeed: rows[i].max_flow_h_speed==0?'-':parseInt(rows[i].max_flow_h_speed),
        //           flow: tdaFlow,
        //           maxFlow: rows[i].max_flow_h==0?'-':rows[i].max_flow_h,
        //           direction: rows[i].direction,
        //           unbalanceindex: rows[i].unBalanceIndex,
        //           leftLiId: 'trendIndex'+rows[i].direction,
        //           type: type,
        //           arrowLonlat:arrowlnglat.reverse(),
        //           cic: 'margin-left: 1px;font-size: 1rem;border-radius: 2px;background-color: '+cc,
        //           lane_flow:rows[i].lane_flow
        //         };
        //         let h_flow_speed='';
        //         if(tda.flow=='-'){
        //           if(tda.speed=='-'){
        //             h_flow_speed='-';
        //           }else{
        //             h_flow_speed='- ➜ '+tda.speed+' km/h';
        //           }
        //         }else{
        //           if(tda.speed=='-'){
        //             h_flow_speed=tda.flow+'pcu/h ➜ '+'-';
        //           }else{
        //             h_flow_speed=tda.flow+'pcu/h ➜ '+tda.speed+' km/h';
        //           }
        //         }
        //         tda.h_flow_speed=h_flow_speed;
        //         let h_history_flow_speed='';
        //         if(tda.maxFlow=='-'){
        //           if(tda.criticalSpeed=='-'){
        //             h_history_flow_speed='-';
        //           }else{
        //             h_history_flow_speed='- ➜ '+tda.criticalSpeed+' km/h';
        //           }
        //         }else{
        //           if(tda.criticalSpeed=='-'){
        //             h_history_flow_speed=tda.maxFlow+'pcu/h ➜ '+'-';
        //           }else{
        //             h_history_flow_speed=tda.maxFlow+'pcu/h ➜ '+tda.criticalSpeed+' km/h';
        //           }
        //         }
        //         tda.h_history_flow_speed=h_history_flow_speed;
        //         if(rows[i].direction === "ns"){
        //           tableData[0] = tda;
        //         }else if(rows[i].direction === "sn"){
        //           tableData[1] = tda;
        //         }else if(rows[i].direction === "we"){
        //           tableData[2] = tda;
        //         }else if(rows[i].direction === "ew"){
        //           tableData[3] = tda;
        //         }
        //       }
        //       that.tableRows = tableData;
        //       that.setDirectionTitle();
        //       let slri= -1;
        //       for(let j=0; j<that.tableRows.length; j++){
        //         if(that.currentDirection === that.tableRows[j].direction){
        //           $("li[name="+that.tableRows[j].leftLiId+"]").css("background-color","#4176f3");
        //           that.setUnbalanceindexTitle(that.tableRows[j].direction);
        //           slri = j;
        //         }else{
        //           $("li[name="+that.tableRows[j].leftLiId+"]").css("background-color","#36579f");
        //         }
        //       }
        //       that.setIntersectionSLR(slri);
        //     }
        //   }
        // });
        // that.reijtuAjax = $.ajax({
        //   url: globals.INTERSECTION_JUNCTION_TREND_URL,
        //   headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //   },
        //   async: true,
        //   responseType: 'json',
        //   dataType: 'json',
        //   method: 'post',
        //   data: {
        //     date: datetime,
        //     juncId: juncId
        //   },
        //   success: function (result) {
        //     that.xData = [];
        //     that.sdyllChartData = {//速度、流量、拥堵、旅行
        //       east: {sd:[], ll: [], yd:[], lx:[],times: []},//东
        //       south: {sd:[], ll: [], yd:[], lx:[],times: []},//南
        //       west: {sd:[], ll: [], yd:[], lx:[],times: []},//西
        //       north: {sd:[], ll: [], yd:[], lx:[],times: []}//北
        //     };
        //     that.shzsChartData={
        //       east: [],//东
        //       south: [],//南
        //       west: [],//西
        //       north: []//北
        //     };
        //     if(result.errcode == 0 && result.data.total>0){
        //       let rows = result.data.rows;
        //       for(let j=0; j<rows.length; j++){
        //         if(rows[j][0].direction === "ew"){
        //           for(let i=0; i<rows[j].length; i++){//东
        //             that.sdyllChartData.east.times.push(rows[j][i].time);
        //             that.sdyllChartData.east.sd.push(parseInt(rows[j][i].flow_h_speed));
        //             that.sdyllChartData.east.ll.push(rows[j][i].flow_h);
        //             that.sdyllChartData.east.yd.push(parseFloat(rows[j][i].congestionIndex).toFixed(1));
        //             that.shzsChartData.east.push(parseFloat(rows[j][i].unBalanceIndex).toFixed(1));
        //           }
        //         }else if(rows[j][0].direction === "sn") {
        //           for (let i = 0; i < rows[j].length; i++) {//南
        //             that.sdyllChartData.south.times.push(rows[j][i].time);
        //             that.sdyllChartData.south.sd.push(parseInt(rows[j][i].flow_h_speed));
        //             that.sdyllChartData.south.ll.push(rows[j][i].flow_h);
        //             that.sdyllChartData.south.yd.push(parseFloat(rows[j][i].congestionIndex).toFixed(1));
        //             that.shzsChartData.south.push(parseFloat(rows[j][i].unBalanceIndex).toFixed(1));
        //           }
        //         }else if(rows[j][0].direction === "we"){
        //           for(let i=0; i<rows[j].length; i++){//西
        //             that.sdyllChartData.west.times.push(rows[j][i].time);
        //             that.sdyllChartData.west.sd.push(parseInt(rows[j][i].flow_h_speed));
        //             that.sdyllChartData.west.ll.push(rows[j][i].flow_h);
        //             that.sdyllChartData.west.yd.push(parseFloat(rows[j][i].congestionIndex).toFixed(1));
        //             that.sdyllChartData.west.lx.push(parseInt(rows[j][i].travelTime/10));
        //             that.shzsChartData.west.push(parseFloat(rows[j][i].unBalanceIndex).toFixed(1));
        //           }
        //         }else if(rows[j][0].direction === "ns"){
        //           for(let i=0; i<rows[j].length; i++){//北
        //             that.sdyllChartData.north.times.push(rows[j][i].time);
        //             that.sdyllChartData.north.sd.push(parseInt(rows[j][i].flow_h_speed));
        //             that.sdyllChartData.north.ll.push(rows[j][i].flow_h);
        //             that.sdyllChartData.north.yd.push(parseFloat(rows[j][i].congestionIndex).toFixed(1));
        //             that.sdyllChartData.north.lx.push(parseInt(rows[j][i].travelTime/10));
        //             that.shzsChartData.north.push(parseFloat(rows[j][i].unBalanceIndex).toFixed(1));
        //           }
        //         }
        //       }
        //       that.myChart.clear();
        //       that.shzsChart.clear();
        //       if(that.currentleftLiId== 'trendIndexwe'){
        //         that.shzsChartOption.xAxis[0].data = that.sdyllChartData.west.times;
        //         that.shzsChartOption.series[0].data = that.shzsChartData.west;
        //         that.sdylyChartOption.xAxis[0].data = that.sdyllChartData.west.times;
        //         that.sdylyChartOption.series[1].data = that.sdyllChartData.west.sd;
        //         that.sdylyChartOption.series[2].data = that.sdyllChartData.west.ll;
        //         that.sdylyChartOption.series[0].data = that.sdyllChartData.west.yd;
        //       }else if(that.currentleftLiId== 'trendIndexns'){
        //         that.shzsChartOption.xAxis[0].data = that.sdyllChartData.north.times;
        //         that.shzsChartOption.series[0].data = that.shzsChartData.north;
        //         that.sdylyChartOption.xAxis[0].data = that.sdyllChartData.north.times;
        //         that.sdylyChartOption.series[1].data = that.sdyllChartData.north.sd;
        //         that.sdylyChartOption.series[2].data = that.sdyllChartData.north.ll;
        //         that.sdylyChartOption.series[0].data = that.sdyllChartData.north.yd;
        //       }else if(that.currentleftLiId== 'trendIndexew'){
        //         that.shzsChartOption.xAxis[0].data = that.sdyllChartData.east.times;
        //         that.shzsChartOption.series[0].data = that.shzsChartData.east;
        //         that.sdylyChartOption.xAxis[0].data = that.sdyllChartData.east.times;
        //         that.sdylyChartOption.series[1].data = that.sdyllChartData.east.sd;
        //         that.sdylyChartOption.series[2].data = that.sdyllChartData.east.ll;
        //         that.sdylyChartOption.series[0].data = that.sdyllChartData.east.yd;
        //       }else if(that.currentleftLiId== 'trendIndexsn'){
        //         that.shzsChartOption.xAxis[0].data = that.sdyllChartData.south.times;
        //         that.shzsChartOption.series[0].data = that.shzsChartData.south;
        //         that.sdylyChartOption.xAxis[0].data = that.sdyllChartData.south.times;
        //         that.sdylyChartOption.series[1].data = that.sdyllChartData.south.sd;
        //         that.sdylyChartOption.series[2].data = that.sdyllChartData.south.ll;
        //         that.sdylyChartOption.series[0].data = that.sdyllChartData.south.yd;
        //       }
        //       that.shzsChart.setOption(that.shzsChartOption);/*******************去掉更新均衡指数曲线图*************/
        //       that.myChart.setOption(that.sdylyChartOption);//更新饼图
        //     }
        //   }
        // });
      },
      //设置列表选择时的样式
      setItemStyle(isN, item) {
        let that = this;
        if(that.currentleftLiId!=item.leftLiId) {
          if (isN) {
            $('#' + item.leftLiId).css("background-color", "#4176f3");
          } else {
            $('#' + item.leftLiId).css("background-color", "transparent");
          }
        }
      },
      //设置左侧路口名称列表选择时的样式
      setListItemStyle(isN, item) {
        let that = this;
        if(that.currenMarkerid !== item.leftLiId && !that.isFlyTo) {
          if (isN) {
            $('#' + item.leftLiId).css("background-color", "#4176f3");
          } else {
            $('#' + item.leftLiId).css("background-color", "transparent");
          }
        }
      },
      //设置方向按钮选择时的样式
      setDirDivStyle(isN, id) {
        let that = this;
        if(that.currentTrendLabelIndex!=id) {
          if (isN) {
            $('#' + id).css("background-color", "#4176f3");
          } else {
            $('#' + id).css("background-color", "#335fbd");
          }
        }
      },
      //设置列表选择时的样式
      setPopupItemStyle(isN, item) {
        let that = this;
        if(that.currentleftLiId!=item.leftLiId) {
          if (isN) {
            $('#' + item.leftLiId).css("background-color", "#4176f3");
          } else {
            $('#' + item.leftLiId).css("background-color", "transparent");
          }
        }
      },
      //获取路口早晚高峰数据
      getCrossPeakData(juncId, datetime,type) {
        let that = this;
        that.icplAjax = $.ajax({
          url: './static/json/intersection/intersectionCrossPeak_'+that.showIntersectionIndex+'.json',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          async: false,
          responseType: 'json',
          dataType: 'json',
          method: 'get',
          data: {
            juncId: juncId
          },
          success: function (result) {
            if(result.errcode === 0){
              let tableDataA = [
                {dir: "北向南",juncName: "-",congestionIndex: "-",speed: "-",flowSpeed: "-",flow: "-",maxFlow: "-",saturation: "-",travelTime: "-",direction: "-",unbalanceindex: "-",leftLiId: 'trendIndexns',type: "-",arrowLonlat: "-",cic: "-",dirS: 0,dirL: 0,dirR: 0,flow_signal_h:'-',flow_derive_h:'-',flow_kakou_h:'-',flow_h_time_history:'-'},
                {dir: "南向北",juncName: "-",congestionIndex: "-",speed: "-",flowSpeed: "-",flow: "-",maxFlow: "-",saturation: "-",travelTime: "-",direction: "-",unbalanceindex: "-",leftLiId: 'trendIndexsn',type: "-",arrowLonlat: "-",cic: "-",dirS: 0,dirL: 0,dirR: 0,flow_signal_h:'-',flow_derive_h:'-',flow_kakou_h:'-',flow_h_time_history:'-'},
                {dir: "西向东",juncName: "-",congestionIndex: "-",speed: "-",flowSpeed: "-",flow: "-",maxFlow: "-",saturation: "-",travelTime: "-",direction: "-",unbalanceindex: "-",leftLiId: 'trendIndexwe',type: "-",arrowLonlat: "-",cic: "-",dirS: 0,dirL: 0,dirR: 0,flow_signal_h:'-',flow_derive_h:'-',flow_kakou_h:'-',flow_h_time_history:'-'},
                {dir: "东向西",juncName: "-",congestionIndex: "-",speed: "-",flowSpeed: "-",flow: "-",maxFlow: "-",saturation: "-",travelTime: "-",direction: "-",unbalanceindex: "-",leftLiId: 'trendIndexew',type: "-",arrowLonlat: "-",cic: "-",dirS: 0,dirL: 0,dirR: 0,flow_signal_h:'-',flow_derive_h:'-',flow_kakou_h:'-',flow_h_time_history:'-'},
              ];
              let tableDataB = [
                {dir: "北向南",juncName: "-",congestionIndex: "-",speed: "-",flowSpeed: "-",flow: "-",maxFlow: "-",saturation: "-",travelTime: "-",direction: "-",unbalanceindex: "-",leftLiId: 'trendIndexns',type: "-",arrowLonlat: "-",cic: "-",dirS: 0,dirL: 0,dirR: 0,flow_signal_h:'-',flow_derive_h:'-',flow_kakou_h:'-',flow_h_time_history:'-'},
                {dir: "南向北",juncName: "-",congestionIndex: "-",speed: "-",flowSpeed: "-",flow: "-",maxFlow: "-",saturation: "-",travelTime: "-",direction: "-",unbalanceindex: "-",leftLiId: 'trendIndexsn',type: "-",arrowLonlat: "-",cic: "-",dirS: 0,dirL: 0,dirR: 0,flow_signal_h:'-',flow_derive_h:'-',flow_kakou_h:'-',flow_h_time_history:'-'},
                {dir: "西向东",juncName: "-",congestionIndex: "-",speed: "-",flowSpeed: "-",flow: "-",maxFlow: "-",saturation: "-",travelTime: "-",direction: "-",unbalanceindex: "-",leftLiId: 'trendIndexwe',type: "-",arrowLonlat: "-",cic: "-",dirS: 0,dirL: 0,dirR: 0,flow_signal_h:'-',flow_derive_h:'-',flow_kakou_h:'-',flow_h_time_history:'-'},
                {dir: "东向西",juncName: "-",congestionIndex: "-",speed: "-",flowSpeed: "-",flow: "-",maxFlow: "-",saturation: "-",travelTime: "-",direction: "-",unbalanceindex: "-",leftLiId: 'trendIndexew',type: "-",arrowLonlat: "-",cic: "-",dirS: 0,dirL: 0,dirR: 0,flow_signal_h:'-',flow_derive_h:'-',flow_kakou_h:'-',flow_h_time_history:'-'},
              ];
              if(result.data.tableOne.total>0){
                let rows = result.data.tableOne.rows;
                for(let i=0; i<rows.length; i++){
                  let tda = {
                    dir: that.getNameByDirection(rows[i].direction),
                    avgcon: rows[i].max_flow_h_index==0?'-':rows[i].max_flow_h_index,//高峰指数
                    time: rows[i].time,//当日峰值时刻
                    maxFlow: rows[i].max_flow_h_history==0?'-':rows[i].max_flow_h_history, //历史最佳流量
                    flowSpeed: rows[i].max_flow_h_speed_history==0?'-':parseInt(rows[i].max_flow_h_speed_history), //历史最佳速度
                    flow: rows[i].max_flow_h==0?'-':rows[i].max_flow_h, //当天最佳流量
                    speed: rows[i].max_flow_h_speed==0?'-':parseInt(rows[i].max_flow_h_speed), //当天最佳速度
                    direction: rows[i].direction,
                    leftLiId: 'trendIndex'+rows[i].direction,
                    type: type,
                    flow_signal_h:rows[i].flow_signal_h==0?'-':rows[i].flow_signal_h,
                    flow_kakou_h:rows[i].flow_kakou_h==0?'-':rows[i].flow_kakou_h,
                    flow_derive_h:rows[i].flow_derive_h==0?'-':rows[i].flow_derive_h,
                    flow_h_time_history:rows[i].flow_h_time_history==0?'-':rows[i].flow_h_time_history
                  };
                  let h_flow_speed='';
                  if(tda.flow=='-'){
                      h_flow_speed='-';
                  }else{
                    if(tda.speed=='-'){
                      h_flow_speed='-';
                    }else{
                      h_flow_speed=tda.flow+'pcu/h ➜ '+tda.speed+' km/h';
                    }
                  }
                  tda.h_flow_speed=h_flow_speed;
                  let h_history_flow_speed='';
                  if(tda.maxFlow=='-'){
                      h_history_flow_speed='-';
                  }else{
                    if(tda.flowSpeed=='-'){
                      h_history_flow_speed='-';
                    }else{
                      h_history_flow_speed=tda.maxFlow+'pcu/h ➜ '+tda.flowSpeed+' km/h';
                    }
                  }
                  tda.h_history_flow_speed=h_history_flow_speed;
                  if(rows[i].direction === "ns"){
                    tableDataA[0] = tda;
                  }else if(rows[i].direction === "sn"){
                    tableDataA[1] = tda;
                  }else if(rows[i].direction === "we"){
                    tableDataA[2] = tda;
                  }else if(rows[i].direction === "ew"){
                    tableDataA[3] = tda;
                  }
                }
              }
              if(result.data.tableTwo.total>0){
                let rows = result.data.tableTwo.rows;
                for(let i=0; i<rows.length; i++){
                  let tda = {
                    dir: that.getNameByDirection(rows[i].direction),
                    avgcon: rows[i].max_flow_h_index==0?'-':rows[i].max_flow_h_index,//高峰指数
                    time: rows[i].time,//当日峰值时刻
                    maxFlow: rows[i].max_flow_h_history==0?'-':rows[i].max_flow_h_history, //历史最佳流量
                    flowSpeed: rows[i].max_flow_h_speed_history==0?'-':rows[i].max_flow_h_speed_history, //历史最佳速度
                    flow: rows[i].max_flow_h==0?'-':rows[i].max_flow_h, //当天最佳流量
                    speed: rows[i].max_flow_h_speed==0?'-':rows[i].max_flow_h_speed, //当天最佳速度
                    direction: rows[i].direction,
                    leftLiId: 'trendIndex'+rows[i].direction,
                    type: type,
                    flow_signal_h:rows[i].flow_signal_h==0?'-':rows[i].flow_signal_h,
                    flow_kakou_h:rows[i].flow_kakou_h==0?'-':rows[i].flow_kakou_h,
                    flow_derive_h:rows[i].flow_derive_h==0?'-':rows[i].flow_derive_h,
                    flow_h_time_history:rows[i].flow_h_time_history==0?'-':rows[i].flow_h_time_history
                  };
                  let h_flow_speed='';
                  if(tda.flow=='-'){
                      h_flow_speed='-';
                  }else{
                    if(tda.speed=='-'){
                      h_flow_speed='-';
                    }else{
                      h_flow_speed=tda.flow+'pcu/h ➜ '+tda.speed+' km/h';
                    }
                  }
                  tda.h_flow_speed=h_flow_speed;
                  let h_history_flow_speed='';
                  if(tda.maxFlow=='-'){
                      h_history_flow_speed='-';
                  }else{
                    if(tda.flowSpeed=='-'){
                      h_history_flow_speed='-';
                    }else{
                      h_history_flow_speed=tda.maxFlow+'pcu/h ➜ '+tda.flowSpeed+' km/h';
                    }
                  }
                  tda.h_history_flow_speed=h_history_flow_speed;
                  if(rows[i].direction === "ns"){
                    tableDataB[0] = tda;
                  }else if(rows[i].direction === "sn"){
                    tableDataB[1] = tda;
                  }else if(rows[i].direction === "we"){
                    tableDataB[2] = tda;
                  }else if(rows[i].direction === "ew"){
                    tableDataB[3] = tda;
                  }
                }
              }
              that.tableRowsA = tableDataA;
              that.tableRowsB = tableDataB;
              that.itsaTitleName1 = result.data.tableOne.tableName;
              that.itsaTitleName2 = result.data.tableTwo.tableName;
            }
          }
        });
      },
      //显示状态分析
      showStateAnalysis(juncId, datetime,type) {
        let that = this;
        that.ijsuAjax = $.ajax({
          url: './static/json/intersection/intersectionInfo_'+that.showIntersectionIndex+'.json',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          async: true,
          responseType: 'json',
          dataType: 'json',
          method: 'get',
          data: {
            date: datetime,
            juncId: juncId
          },
          success: function (result) {
            if(result.errcode === 0 && result.data.total>0){
              let tableData = [
                {dir: "北向南",juncName: "",congestionIndex: "",speed: "",criticalSpeed: "",flow: "",maxFlow: "",saturation: "",travelTime: "",direction: "",unbalanceindex: "",leftLiId: 'trendIndexns',type: "",arrowLonlat: "",cic: "",dirS: 0,dirL: 0,dirR: 0,flow_signal_h:'-',flow_derive_h:'-',flow_kakou_h:'-',max_flow_h_time:'-'},
                {dir: "南向北",juncName: "",congestionIndex: "",speed: "",criticalSpeed: "",flow: "",maxFlow: "",saturation: "",travelTime: "",direction: "",unbalanceindex: "",leftLiId: 'trendIndexsn',type: "",arrowLonlat: "",cic: "",dirS: 0,dirL: 0,dirR: 0,flow_signal_h:'-',flow_derive_h:'-',flow_kakou_h:'-',max_flow_h_time:'-'},
                {dir: "西向东",juncName: "",congestionIndex: "",speed: "",criticalSpeed: "",flow: "",maxFlow: "",saturation: "",travelTime: "",direction: "",unbalanceindex: "",leftLiId: 'trendIndexwe',type: "",arrowLonlat: "",cic: "",dirS: 0,dirL: 0,dirR: 0,flow_signal_h:'-',flow_derive_h:'-',flow_kakou_h:'-',max_flow_h_time:'-'},
                {dir: "东向西",juncName: "",congestionIndex: "",speed: "",criticalSpeed: "",flow: "",maxFlow: "",saturation: "",travelTime: "",direction: "",unbalanceindex: "",leftLiId: 'trendIndexew',type: "",arrowLonlat: "",cic: "",dirS: 0,dirL: 0,dirR: 0,flow_signal_h:'-',flow_derive_h:'-',flow_kakou_h:'-',max_flow_h_time:'-'},
              ];
              let rows = result.data.rows;
              for(let i=0; i<rows.length; i++){
                let cc = that.getColorByIndex(parseFloat(rows[i].congestionIndex).toFixed(1));
                if(i===0){
                  that.speed_source = "数据来源："+rows[i].speed_source;
                  that.flow_source = "数据来源："+rows[i].flow_source;
                }
                let cne = rows[i].congestionName;
                if(cne === "通畅"){
                  cne = "通&emsp;&emsp;畅";
                }
                let tdaFlow = rows[i].flow_h==0?'-':rows[i].flow_h;
                if((rows[i].dir_s>0 || rows[i].dir_l>0 || rows[i].dir_r>0) && !(rows[i].dir_s>0 && rows[i].dir_l>0 && rows[i].dir_r>0)) tdaFlow=">"+tdaFlow;
                let arrowlnglat=that.GetArrowLonlat(rows[i].dir_geometry.coordinates.reverse());
                let tda = {
                  dir: that.getNameByDirection(rows[i].direction),
                  juncName: cne,
                  congestionIndex: parseFloat(rows[i].congestionIndex).toFixed(1),
                  speed: rows[i].speed==0?'-':parseInt(rows[i].speed),
                  criticalSpeed: rows[i].max_flow_h_speed==0?'-':parseInt(rows[i].max_flow_h_speed),
                  flow: tdaFlow,
                  maxFlow: rows[i].max_flow_h==0?'-':rows[i].max_flow_h,
                  saturation: parseFloat(rows[i].saturation).toFixed(1),
                  direction: rows[i].direction,
                  unbalanceindex: rows[i].unBalanceIndex,
                  leftLiId: 'trendIndex'+rows[i].direction,
                  type: type,
                  arrowLonlat: arrowlnglat.reverse(),//[arrowlnglat[arrowlnglat.length-1],arrowlnglat[0]],
                  cic: 'margin-left: 1px;font-size: 1rem;border-radius: 2px;background-color: '+cc,
                  dirS: rows[i].dir_s,
                  dirL: rows[i].dir_l,
                  dirR: rows[i].dir_r,
                  flow_signal_h:rows[i].flow_signal_h==0?'-':rows[i].flow_signal_h,
                  flow_derive_h:rows[i].flow_derive_h==0?'-':rows[i].flow_derive_h,
                  flow_kakou_h:rows[i].flow_kakou_h==0?'-':rows[i].flow_kakou_h,
                  max_flow_h_time:rows[i].max_flow_h_time==0?'-':rows[i].max_flow_h_time,
                  lane_flow:rows[i].lane_flow
                };
                let h_flow_speed='';
                if(tda.flow=='-'){
                    h_flow_speed='-';
                }else{
                  if(tda.speed=='-'){
                    h_flow_speed='-';
                  }else{
                    h_flow_speed=tda.flow+'pcu/h ➜ '+tda.speed+' km/h';
                  }
                }
                tda.h_flow_speed=h_flow_speed;
                let h_history_flow_speed='';
                if(tda.maxFlow=='-'){
                    h_history_flow_speed='-';
                }else{
                  if(tda.criticalSpeed=='-'){
                    h_history_flow_speed='-';
                  }else{
                    h_history_flow_speed=tda.maxFlow+'pcu/h ➜ '+tda.criticalSpeed+' km/h';
                  }
                }
                tda.h_history_flow_speed=h_history_flow_speed;
                if(rows[i].direction === "ns"){
                  tableData[0] = tda;
                }else if(rows[i].direction === "sn"){
                  tableData[1] = tda;
                }else if(rows[i].direction === "we"){
                  tableData[2] = tda;
                }else if(rows[i].direction === "ew"){
                  tableData[3] = tda;
                }
              }
              that.tableRows = tableData;
              that.$nextTick(function(){
                that.currentleftLiId = that.tableRows[0].leftLiId;
                for(let j=0; j<that.tableRows.length; j++){
                  if(j===0){
                    $("li[name="+that.tableRows[j].leftLiId+"]").css("background-color","#4176f3");
                    that.setIntersectionSLR(j);
                    that.setUnbalanceindexTitle(that.tableRows[j].direction);
                  }else{
                    $("li[name="+that.tableRows[j].leftLiId+"]").css("background-color","#36579f");
                  }
                }
                that.loadData1 = false;
              });
            }
          }
        });
      },
      //获取两点间距离
      GetArrowLonlat(lonlats){
        let that=this;
        let lonlatarr=[];
        lonlatarr.push(lonlats[0]);
        for(let i=1;i<lonlats.length;i++){
          if(that.GetDistance(lonlats[0][0],lonlats[i][0],lonlats[0][1],lonlats[i][1])<=0.5){
            lonlatarr.push(lonlats[i]);
          }else{
            break;
          }
        };
        return lonlatarr;

      },
      GetDistance(lng1,lng2,lat1,lat2){
        function Rad(d){
          return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
        }
        let radLat1 = Rad(lat1);
        let radLat2 = Rad(lat2);
        let a = radLat1 - radLat2;
        let  b = Rad(lng1) - Rad(lng2);
        let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
            Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
        s = s *6378.137 ;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000; //输出为公里
        //s=s.toFixed(4);
        return s;
      },
      /*创建道路箭头标识图层*/
      createRoadArrowLayer(arrowLonlat){
        let that = this;
        let startx = arrowLonlat[0][0];
        let starty = arrowLonlat[0][1];
        let endx = arrowLonlat[1][0];
        let endy = arrowLonlat[1][1];
        let arrowData1 = [];
        let arrowData2 = [];
        let arrowData3 = [];
        let arrowData4 = [];
        let angle = that.calulateXYAnagle(arrowLonlat[0][0],arrowLonlat[0][1], arrowLonlat[1][0], arrowLonlat[1][1]);
        let lx = (startx-endx)/60;
        let ly = (starty-endy)/60;
        for(let i=0; i<60; i++){
          let tx = endx+lx*i;
          let ty = endy+ly*i++;
          arrowData1.push({"geometry": {"type": "Point","coordinates": [tx, ty]}, "type": "Feature", "properties": {icon: "icon-arrow-road"}});
          tx = endx+lx*i;
          ty = endy+ly*i++;
          arrowData2.push({"geometry": {"type": "Point","coordinates": [tx, ty]}, "type": "Feature", "properties": {icon: "icon-arrow-road"}});
          tx = endx+lx*i;
          ty = endy+ly*i++;
          arrowData3.push({"geometry": {"type": "Point","coordinates": [tx, ty]}, "type": "Feature", "properties": {icon: "icon-arrow-road"}});
          tx = endx+lx*i;
          ty = endy+ly*i;
          arrowData4.push({"geometry": {"type": "Point","coordinates": [tx, ty]}, "type": "Feature", "properties": {icon: "icon-arrow-road"}});
        }
        let poiData1 = {"type": "FeatureCollection", "features": arrowData1};
        let poiData2 = {"type": "FeatureCollection", "features": arrowData2};
        let poiData3 = {"type": "FeatureCollection", "features": arrowData3};
        let poiData4 = {"type": "FeatureCollection", "features": arrowData4};
        if (this.map.getLayer("road_arrow_point_layer_1")) {
          this.map.getSource('road_arrow_source_1').setData(poiData1);
          this.map.getSource('road_arrow_source_2').setData(poiData2);
          this.map.getSource('road_arrow_source_3').setData(poiData3);
          this.map.getSource('road_arrow_source_4').setData(poiData4);
          this.map.setLayoutProperty('road_arrow_point_layer_1', 'visibility', 'visible');
          this.map.setLayoutProperty('road_arrow_point_layer_2', 'visibility', 'none');
          this.map.setLayoutProperty('road_arrow_point_layer_3', 'visibility', 'none');
          this.map.setLayoutProperty('road_arrow_point_layer_4', 'visibility', 'none');
          this.map.setLayoutProperty('road_arrow_point_layer_1', 'icon-rotate', angle);
          this.map.setLayoutProperty('road_arrow_point_layer_2', 'icon-rotate', angle);
          this.map.setLayoutProperty('road_arrow_point_layer_3', 'icon-rotate', angle);
          this.map.setLayoutProperty('road_arrow_point_layer_4', 'icon-rotate', angle);
        }else {
          this.map.addSource('road_arrow_source_1', {
            type: "geojson",
            data: poiData1
          });
          this.map.addLayer({
            "id": "road_arrow_point_layer_1",
            "type": "symbol",
            "source": 'road_arrow_source_1',
            "layout": {
              "icon-image": "{icon}",
              "icon-rotate": angle,
              //"symbol-spacing": 50,
              //"icon-padding": 1,
              'visibility': "visible"
            }
          });
          this.map.addSource('road_arrow_source_2', {
            type: "geojson",
            data: poiData2
          });
          this.map.addLayer({
            "id": "road_arrow_point_layer_2",
            "type": "symbol",
            "source": 'road_arrow_source_2',
            "layout": {
              "icon-image": "{icon}",
              "icon-rotate": angle,
              'visibility': "none"
            }
          });

          this.map.addSource('road_arrow_source_3', {
            type: "geojson",
            data: poiData3
          });
          this.map.addLayer({
            "id": "road_arrow_point_layer_3",
            "type": "symbol",
            "source": 'road_arrow_source_3',
            "layout": {
              "icon-image": "{icon}",
              "icon-rotate": angle,
              'visibility': "none"
            }
          });

          this.map.addSource('road_arrow_source_4', {
            type: "geojson",
            data: poiData4
          });
          this.map.addLayer({
            "id": "road_arrow_point_layer_4",
            "type": "symbol",
            "source": 'road_arrow_source_4',
            "layout": {
              "icon-image": "{icon}",
              "icon-rotate": angle,
              'visibility': "none"
            }
          });
        }

        if(that.minTimeInterval2 !== ""){
          window.clearInterval(that.minTimeInterval2);
          that.minTimeInterval2 == "";
        }
        that.minTimeInterval2 = window.setInterval(function(){
          if(that.roadArrowIndex==1){
            this.map.setLayoutProperty('road_arrow_point_layer_1', 'visibility', 'none');
            this.map.setLayoutProperty('road_arrow_point_layer_2', 'visibility', 'none');
            this.map.setLayoutProperty('road_arrow_point_layer_3', 'visibility', 'none');
            this.map.setLayoutProperty('road_arrow_point_layer_4', 'visibility', 'visible');
            that.roadArrowIndex=2;
          }else if(that.roadArrowIndex==2){
            this.map.setLayoutProperty('road_arrow_point_layer_1', 'visibility', 'none');
            this.map.setLayoutProperty('road_arrow_point_layer_2', 'visibility', 'none');
            this.map.setLayoutProperty('road_arrow_point_layer_3', 'visibility', 'visible');
            this.map.setLayoutProperty('road_arrow_point_layer_4', 'visibility', 'none');
            that.roadArrowIndex=3;
          }else if(that.roadArrowIndex==3){
            this.map.setLayoutProperty('road_arrow_point_layer_1', 'visibility', 'none');
            this.map.setLayoutProperty('road_arrow_point_layer_2', 'visibility', 'visible');
            this.map.setLayoutProperty('road_arrow_point_layer_3', 'visibility', 'none');
            this.map.setLayoutProperty('road_arrow_point_layer_4', 'visibility', 'none');
            that.roadArrowIndex=4;
          }else {
            this.map.setLayoutProperty('road_arrow_point_layer_1', 'visibility', 'visible');
            this.map.setLayoutProperty('road_arrow_point_layer_2', 'visibility', 'none');
            this.map.setLayoutProperty('road_arrow_point_layer_3', 'visibility', 'none');
            this.map.setLayoutProperty('road_arrow_point_layer_4', 'visibility', 'none');
            that.roadArrowIndex=1;
          }
        },500*1);
      },
      //显示路口趋势分析
      showTrendAnalysis(juncId, datetime){
        let that = this;
        that.ijtuAjax = $.ajax({
          url: './static/json/intersection/intersectionCrossTrend_'+that.showIntersectionIndex+'.json',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          async: true,
          responseType: 'json',
          dataType: 'json',
          method: 'get',
          data: {
            date: datetime,
            juncId: juncId
          },
          success: function (result) {
            that.xData = [];
            that.sdyllChartData = {//速度、流量、拥堵、旅行
              east: {sd:[], ll: [], yd:[], lx:[], times: []},//东
              south: {sd:[], ll: [], yd:[], lx:[], times: []},//南
              west: {sd:[], ll: [], yd:[], lx:[], times: []},//西
              north: {sd:[], ll: [], yd:[], lx:[], times: []}//北
            };
            that.shzsChartData={
              east: [],//东
              south: [],//南
              west: [],//西
              north: []//北
            };
            if(result.errcode == 0 && result.data.total>0){
              //console.log(result.data)
              let rows = result.data.rows;
              for(let j=0; j<rows.length; j++){
                if(rows[j][0].direction === "ew"){
                  for(let i=0; i<rows[j].length; i++){//东
                    //that.xData.push(rows[j][i].time);
                    that.sdyllChartData.east.times.push(rows[j][i].time);
                    that.sdyllChartData.east.sd.push(parseInt(rows[j][i].flow_h_speed));
                    that.sdyllChartData.east.ll.push(rows[j][i].flow_h);
                    that.sdyllChartData.east.yd.push(parseFloat(rows[j][i].congestionIndex).toFixed(1));
                    that.sdyllChartData.east.lx.push(parseInt(rows[j][i].travelTime/10));
                    that.shzsChartData.east.push(parseFloat(rows[j][i].unBalanceIndex).toFixed(1));
                  }
                }else if(rows[j][0].direction === "sn") {
                  for (let i = 0; i < rows[j].length; i++) {//南
                    that.sdyllChartData.south.times.push(rows[j][i].time);
                    that.sdyllChartData.south.sd.push(parseInt(rows[j][i].flow_h_speed));
                    that.sdyllChartData.south.ll.push(rows[j][i].flow_h);
                    that.sdyllChartData.south.yd.push(parseFloat(rows[j][i].congestionIndex).toFixed(1));
                    that.sdyllChartData.south.lx.push(parseInt(rows[j][i].travelTime/10));
                    that.shzsChartData.south.push(parseFloat(rows[j][i].unBalanceIndex).toFixed(1));
                  }
                }else if(rows[j][0].direction === "we"){
                  for(let i=0; i<rows[j].length; i++){//西
                    that.sdyllChartData.west.times.push(rows[j][i].time);
                    that.sdyllChartData.west.sd.push(parseInt(rows[j][i].flow_h_speed));
                    that.sdyllChartData.west.ll.push(rows[j][i].flow_h);
                    that.sdyllChartData.west.yd.push(parseFloat(rows[j][i].congestionIndex).toFixed(1));
                    that.sdyllChartData.west.lx.push(parseInt(rows[j][i].travelTime/10));
                    that.shzsChartData.west.push(parseFloat(rows[j][i].unBalanceIndex).toFixed(1));
                  }
                }else if(rows[j][0].direction === "ns"){
                  for(let i=0; i<rows[j].length; i++){//北
                    that.sdyllChartData.north.times.push(rows[j][i].time);
                    that.sdyllChartData.north.sd.push(parseInt(rows[j][i].flow_h_speed));
                    that.sdyllChartData.north.ll.push(rows[j][i].flow_h);
                    that.sdyllChartData.north.yd.push(parseFloat(rows[j][i].congestionIndex).toFixed(1));
                    that.sdyllChartData.north.lx.push(parseInt(rows[j][i].travelTime/10));
                    that.shzsChartData.north.push(parseFloat(rows[j][i].unBalanceIndex).toFixed(1));
                  }
                }
              }
              that.loadData2 = false;
            }
          }
        });
      },
      //隐藏所有路口标点
      hideIntersectionMarkers() {
        let that = this;
        for (let i = 0; i < that.markerIdList.length; i++) {
          that.MAP_MARKER_OVERALL_ARRAY[that.markerIdList[i]].remove();//设置标点隐藏
        }
        if(this.MAP_MARKER_OVERALL_ARRAY[that.intersectionMarkerImgId]) this.MAP_MARKER_OVERALL_ARRAY[that.intersectionMarkerImgId].remove();
      },
      //显示所有路口标点
      showIntersectionMarkers() {
        let that = this;
        that.clearMarker3();
        for (let i = 0; i < that.markerIdList.length; i++) {
          if(this.MAP_MARKER_OVERALL_ARRAY[that.markerIdList[i]]) this.MAP_MARKER_OVERALL_ARRAY[that.markerIdList[i]].addTo(this.map);
        }
      },
      //根据拥堵指数获取颜色
      getColorByIndex(value) {
        let color='';
        if(value>=0 && value <2)	{
          color='#00bc52'
        }else if(value>=2 && value <4)	{
          color='#97d158'
        }else if(value>=4 && value <6)	{
          color='#f6f954'
        }else if(value>=6 && value <8)	{
          color='#f1c11f'
        }else if(value>=8 && value <=10)	{
          color= '#f00100'
        }else {
          color='#00bc52'
        }
        return color;
      },
      //根据指数获取线颜色
      getLineColorByIndex(index) {
        if(index <0.2){
          return '#33CC00';
        }else if(index <0.4){
          return '#FFFF00';
        }else if(index <0.6){
          return '#FF9933';
        }else if(index <0.8){
          return '#FF3300';
        }else if(index <=1){
          return '#990000';
        }else if(index >1){
          return '#660000';
        }
      },
      //定义一个函数，实现随机生成十六进制颜色值
      getRandomColor(){
        //定义字符串变量colorValue存放可以构成十六进制颜色值的值
        let colorValue="0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
        //以","为分隔符，将colorValue字符串分割为字符数组["0","1",...,"f"]
        let colorArray = colorValue.split(",");
        let color="#";//定义一个存放十六进制颜色值的字符串变量，先将#存放进去
        //使用for循环语句生成剩余的六位十六进制值
        for(let i=0;i<6;i++){
          //colorArray[Math.floor(Math.random()*16)]随机取出
          // 由16个元素组成的colorArray的某一个值，然后将其加在color中，
          //字符串相加后，得出的仍是字符串
          color+=colorArray[Math.floor(Math.random()*16)];
        }
        return color;
      },
      //在table表里选择后显示图表
      showTrendAnalysisLabel(index, id, type, arrowLonlat) {
        if(!index || index ==="") return false;
        let that = this;
        if(that.currentTrendLabelIndex!="") $('#' + that.currentTrendLabelIndex).css("background-color", "#335fbd");
        if($('.intersection-traffic-analysis').is(':hidden')){　　//如果是隐藏的则显示
          $('.intersection-traffic-analysis').show();
        }
        that.currentTrendLabelIndex = 'idtDiv'+index;
        $('#'+that.currentTrendLabelIndex).css("background-color","#4176f3");
        if(that.currentleftLiId!="") $("li[name="+that.currentleftLiId+"]").css("background-color","#36579f");
        if(!id) id = "trendIndex"+index;
        if(!type) type = that.threeType;
        that.threeType = type;
        that.currentleftLiId=id;
        that.currentDirection=index;
        $("li[name="+id+"]").css("background-color","#4176f3");
        let stp = $("li[name="+id+"]")[0].offsetTop;
        console.log(id+':'+stp);
        $('.intersection-traffic-analysis-ul,.intersection-traffic-analysis-ul-').animate({ scrollTop: stp}, 10);
        for(let j=0; j<that.tableRows.length; j++){
          if(index === that.tableRows[j].direction){
            that.setIntersectionSLR(j);
            that.setUnbalanceindexTitle(that.tableRows[j].direction);
            if(!arrowLonlat) arrowLonlat = that.tableRows[j].arrowLonlat;
            that.setLaneData(that.tableRows[j].lane_flow,index);
            break;
          }
        }
        that.myChart.clear();
        that.shzsChart.clear();
        if(index === 'we'){
          that.shzsChartOption.xAxis[0].data = that.sdyllChartData.west.times;
          that.shzsChartOption.series[0].data = that.shzsChartData.west;
          that.sdylyChartOption.xAxis[0].data = that.sdyllChartData.west.times;
          that.sdylyChartOption.series[1].data = that.sdyllChartData.west.sd;
          that.sdylyChartOption.series[2].data = that.sdyllChartData.west.ll;
          that.sdylyChartOption.series[0].data = that.sdyllChartData.west.yd;
        }else if(index === 'ns'){
          that.shzsChartOption.xAxis[0].data = that.sdyllChartData.north.times;
          that.shzsChartOption.series[0].data = that.shzsChartData.north;
          that.sdylyChartOption.xAxis[0].data = that.sdyllChartData.north.times;
          that.sdylyChartOption.series[1].data = that.sdyllChartData.north.sd;
          that.sdylyChartOption.series[2].data = that.sdyllChartData.north.ll;
          that.sdylyChartOption.series[0].data = that.sdyllChartData.north.yd;
        }else if(index === 'ew'){
          that.shzsChartOption.xAxis[0].data = that.sdyllChartData.east.times;
          that.shzsChartOption.series[0].data = that.shzsChartData.east;
          that.sdylyChartOption.xAxis[0].data = that.sdyllChartData.east.times;
          that.sdylyChartOption.series[1].data = that.sdyllChartData.east.sd;
          that.sdylyChartOption.series[2].data = that.sdyllChartData.east.ll;
          that.sdylyChartOption.series[0].data = that.sdyllChartData.east.yd;
        }else if(index === 'sn'){
          that.shzsChartOption.xAxis[0].data = that.sdyllChartData.south.times;
          that.shzsChartOption.series[0].data = that.shzsChartData.south;
          that.sdylyChartOption.xAxis[0].data = that.sdyllChartData.south.times;
          that.sdylyChartOption.series[1].data = that.sdyllChartData.south.sd;
          that.sdylyChartOption.series[2].data = that.sdyllChartData.south.ll;
          that.sdylyChartOption.series[0].data = that.sdyllChartData.south.yd;
        }
        that.shzsChart.setOption(that.shzsChartOption);//**********取消更新均衡指数曲线图***********************/
        that.myChart.setOption(that.sdylyChartOption);//更新饼图
        setTimeout(function(){
          that.resizeContainer();
          that.myChart.resize();
          that.shzsChart.resize();
        },1000);
        that.setCenterPan(type,index);
        that.showAirLineLayer(arrowLonlat);
      },
      //根据类型显示路口图片上的图表
      setMapMove(e) {
        let that = this;
        if(that.isFlyTo) return;
        that.intersectionRotateX = e.target.transform.pitch;
        that.intersectionRotateZ = that.deg-e.target.transform.bearing;
        if($('#divintersectionMarkerImgId')) {
          $('#divintersectionMarkerImgId').css('transform','rotateX('+that.intersectionRotateX+'deg) rotateZ('+that.intersectionRotateZ+'deg) scale('+that.intersectionRotateScale+','+that.intersectionRotateScale+')');
        }
        that.intersectionRotate1Z = (0-e.target.transform.bearing);
        if($('#divintersectionMarkerImgId1')) {
          $('#divintersectionMarkerImgId1').css('transform','rotateX('+that.intersectionRotateX+'deg) rotateZ('+that.intersectionRotate1Z+'deg) scale('+that.intersectionRotateScale+','+that.intersectionRotateScale+')');
        }
        for(let i=0; i<that.markerIconDivId.length; i++){
          if($('#'+that.markerIconDivId[i])) $('#'+that.markerIconDivId[i]).css('transform','rotateX('+that.intersectionRotateX+'deg) rotateZ('+e.target.transform.bearing+'deg)');
        }
      },
      setMapZoomend(e) {
        let that = this;
        let zoom = this.map.getZoom();
        that.intersectionRotateScale = 1.2-(18-this.map.getZoom())*0.2;
        if(that.isM3){
          if(!that.isFlyTo) {
            if(zoom < 13){
              that.clearMarker3();
              that.isM3 = false;
              that.isNetworkFlow = true;
              that.showIntersectionMarkers();
            }
          }
          if(!$("#divintersectionMarkerImgId").is(":hidden")){
            $('#divintersectionMarkerImgId').css('transform','rotateX('+that.intersectionRotateX+'deg) rotateZ('+that.intersectionRotateZ+'deg) scale('+that.intersectionRotateScale+','+that.intersectionRotateScale+')');
          }
          if(!$("#divintersectionMarkerImgId1").is(":hidden")){
            $('#divintersectionMarkerImgId1').css('transform','rotateX('+that.intersectionRotateX+'deg) rotateZ('+that.intersectionRotate1Z+'deg) scale('+that.intersectionRotateScale+','+that.intersectionRotateScale+')');
          }
        }else if(that.isM1_2 === true){
          if(zoom < 12 && !that.isFlyTo) {
            that.clearRoadLinesAndPopupDiv();

            that.isM1_2 = false;
            that.isNetworkFlow = true;
            that.setMarkerLayerHide();
            that.showIntersectionMarkers();
          }
        }else if(!that.isFlyTo) {
          if(!$("#divintersectionMarkerImgId").is(":hidden")){
            $('#divintersectionMarkerImgId').css('transform','rotateX('+that.intersectionRotateX+'deg) rotateZ('+that.intersectionRotateZ+'deg) scale('+that.intersectionRotateScale+','+that.intersectionRotateScale+')');
          }
          if(!$("#divintersectionMarkerImgId1").is(":hidden")){
            $('#divintersectionMarkerImgId1').css('transform','rotateX('+that.intersectionRotateX+'deg) rotateZ('+that.intersectionRotate1Z+'deg) scale('+that.intersectionRotateScale+','+that.intersectionRotateScale+')');
          }
          if(zoom<11){
            that.setMarkerLayerHide();
            that.clearRoadLinesAndPopupDiv();
            that.showIntersectionMarkers();
            that.z13=true;
          }else if(zoom<13){
            that.setMarkerLayerHide();
            that.clearRoadLinesAndPopupDiv();
            that.showIntersectionMarkers();
            that.z13=true;
          }else{
            if(that.z13){
              that.setMarkerLayerShow();
              that.showIntersectionMarkers();
              that.z13=false;
            }
          }
        }
        that.currentZoom = zoom;
      },
      //添加线
      createLines (map, id, features, isShow, lineColor, lineWidth, isShowArrow, lineArray, lineOpacity,lineGapWidth) {
        if(this.isReture) return;
        //添加源数据
        map.addSource("ls_" + id, {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": features
          }
        });

        let vy = "visible";
        if (typeof isShow === "boolean" && !isShow) {
          vy = "none";
        }
        if (typeof lineColor === "undefined" || lineColor == null || lineColor == "") lineColor = "#FF0000";
        if (typeof lineWidth === "undefined" || lineWidth == null || lineWidth == "") lineWidth = 6;
        if (typeof lineOpacity ==="undefined" || lineOpacity == null || lineOpacity == "") lineOpacity = 1;
        if (typeof lineGapWidth ==="undefined" || lineGapWidth == null || lineGapWidth == "") lineGapWidth = 0;
        //添加线图层
        map.addLayer({
          "id": "line_" + id,
          "type": "line",
          "source": "ls_" + id,
          "layout": {
            "line-join": "round",
            //"line-cap": "round",
            "visibility": vy
          },
          "paint": {
            "line-color": {'type': 'identity','property': 'color'},
            "line-width": lineWidth,
            "line-gap-width": lineGapWidth,
            "line-opacity": lineOpacity
          }
        });
        //添加箭头
        if (typeof isShowArrow === "boolean" && isShowArrow) {
          map.addLayer({
            "id": "arrow_" + id,
            "type": "symbol",
            "source": "ls_" + id,
            "layout": {
              "symbol-placement": "line",
              "icon-allow-overlap": true,
              "icon-image": "icon-map-vehicle-direction",//指定箭头图标
              "text-field": "{title}",
              "text-offset": [0, 0.6],
              "text-anchor": "top",
              "visibility": vy
            },
            "paint": {
              "icon-color": {'type': 'identity','property': 'color'}
            }
          });
        }
        if(lineArray) lineArray.push(id);
      },
      createRoadLines (map, id, features, isShow, lineColor, lineWidth, isShowArrow, lineArray, lineOpacity,lineGapWidth) {
        if(this.isReture) return;
        //添加源数据
        map.addSource("ls_" + id, {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": features
          }
        });

        let vy = "visible";
        if (typeof isShow === "boolean" && !isShow) {
          vy = "none";
        }
        if (typeof lineColor === "undefined" || lineColor == null || lineColor == "") lineColor = "#FF0000";
        if (typeof lineWidth === "undefined" || lineWidth == null || lineWidth == "") lineWidth = 6;
        if (typeof lineOpacity ==="undefined" || lineOpacity == null || lineOpacity == "") lineOpacity = 1;
        if (typeof lineGapWidth ==="undefined" || lineGapWidth == null || lineGapWidth == "") lineGapWidth = 0;
        //添加线图层
        map.addLayer({
          "id": "line_" + id,
          "type": "line",
          "source": "ls_" + id,
          "layout": {
            "line-join": "round",
            //"line-cap": "round",
            "visibility": vy
          },
          "paint": {
            "line-color": {'type': 'identity','property': 'color'},
            "line-width": 6,//{'type': 'identity','property': 'lwidth'},
            "line-gap-width": lineGapWidth,
            "line-opacity": lineOpacity
          }
        });
        if(lineArray) lineArray.push(id);
      },
      //添加面
      createPolygon(id,data,isShow){
        //console.log("polygon",data);
        this.map.addSource("polygon_source_" + id, {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": data
          }
        });
        let vy = "visible";
        if (typeof isShow === "boolean" && !isShow) {
          vy = "none";
        }
        //添加多边形图层
        this.map.addLayer({
          "id": "polygon_" + id,
          "type": "fill",
          "source": "polygon_source_" + id,
          "layout": {
            "visibility": vy
          },
          "paint": {
            "fill-outline-color": "#ffffff",
            "fill-color": {'type': 'identity','property': 'color'},
            "fill-opacity": {'type': 'identity','property': 'opacity'}
          }
        });
      },
      //根据道路id显示道路信息
      showLineByid(item,type) {
        // let that = this;
        // if(that.minTimeInterval2 !== ""){
        //   window.clearInterval(that.minTimeInterval2);
        //   that.minTimeInterval2 = "";
        // }
        // if(that.currentleftLiId!=='') {
        //   $('#' + that.currentleftLiId).css("background-color", "transparent");
        // }
        // if(that.currentRoadId!=='' && this.map.getLayer('line_'+that.currentRoadId)){
        //   this.map.setPaintProperty ( 'line_'+that.currentRoadId, 'line-color', that.currentRoadColor );
        // }
        // $('#' + item.leftLiId).css("background-color", "#4176f3");
        // that.currentleftLiId = item.leftLiId;
        // that.currentRoadId = item.id;
        // that.currentRoadColor = item.lineColor;
        // let popupEchartUrl = globals.INTERSECTION_POPUP_SDYLL_URL;
        // if(!type){
        //   that.stName = item.stName;
        //   that.endName = item.endName;
        //   popupEchartUrl = globals.INTERSECTION_POPUP_SDYLL1_URL;
        // }

        // if(this.map.getLayer('line_'+item.id)) {
        //   this.map.setPaintProperty ( 'line_'+item.id, 'line-color', "#FF00FF");
        // }

        // let minMaxLonlat = [360,0,360,0];//minx,maxx,miny,maxy
        // that.getMinMaxLonlat(item.geometry.coordinates,minMaxLonlat);
        // if(minMaxLonlat[1] > 0){
        //   minMaxLonlat[0] = minMaxLonlat[0]+(minMaxLonlat[1]-minMaxLonlat[0])/3;
        //   minMaxLonlat[1] = minMaxLonlat[1]+(minMaxLonlat[1]-minMaxLonlat[0])/3;
        //   that.fitBox(that.map, minMaxLonlat[0], minMaxLonlat[2], minMaxLonlat[1], minMaxLonlat[3]);
        // }
        // $('.road-popup-div-echart').show();
        // let sd=[];
        // let ll= [];
        // let ydzs=[];
        // let xdata = [];
        // that.sdylyPopupChartOption.xAxis[0].data = [];
        // that.sdylyPopupChartOption.series[0].data = [];
        // that.sdylyPopupChartOption.series[1].data = [];
        // that.sdylyPopupChartOption.series[2].data = [];
        // that.myPopupChart.setOption(that.sdylyPopupChartOption);//更新饼图
        // that.myPopupChart.resize();
        // that.peuAjax = $.ajax({
        //   url: popupEchartUrl,
        //   headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //   },
        //   async: true,
        //   responseType: 'json',
        //   dataType: 'json',
        //   method: 'post',
        //   data: {
        //     roadId: item.id
        //   },
        //   success: function (result) {
        //     if(result.errcode == 0 && result.data.total>0){
        //       let rows = result.data.rows;
        //       let dMax = 0;
        //       for(let j=0; j<rows.length; j++){
        //         dMax = Math.max(dMax,rows[j].speed);
        //         sd.push(rows[j].speed);
        //         ll.push(rows[j].flow);
        //         ydzs.push(rows[j].tpi);
        //         xdata.push(rows[j].time);
        //       }
        //       that.sdylyPopupChartOption.xAxis[0].data = xdata;
        //       that.sdylyPopupChartOption.series[0].data = ydzs;
        //       that.sdylyPopupChartOption.series[1].data = sd;
        //       that.sdylyPopupChartOption.series[2].data = ll;
        //       that.myPopupChart.setOption(that.sdylyPopupChartOption);//更新饼图
        //       that.myPopupChart.resize();

        //       that.minTimeInterval2 = window.setInterval(function(){
        //         that.reShowLineByid(popupEchartUrl,item.id);
        //       },that.timeInterval);
        //     }
        //   }
        // });
      },
      reShowLineByid(popupEchartUrl,itemId ){
        let that = this;
        let sd=[];
        let ll= [];
        let ydzs = [];
        let xdata = [];
        that.repeuAjax = $.ajax({
          url: popupEchartUrl,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          async: true,
          responseType: 'json',
          dataType: 'json',
          method: 'post',
          data: {
            roadId: itemId
          },
          success: function (result) {
            if(result.errcode == 0 && result.data.total>0){
              let rows = result.data.rows;
              let dMax = 0;
              for(let j=0; j<rows.length; j++){
                dMax = Math.max(dMax,rows[j].speed);
                sd.push(rows[j].speed);
                ll.push(rows[j].flow);
                ydzs.push(rows[j].tpi);
                xdata.push(rows[j].time);
              }
              that.sdylyPopupChartOption.xAxis[0].data = xdata;
              that.sdylyPopupChartOption.series[0].data = ydzs;
              that.sdylyPopupChartOption.series[1].data = sd;
              that.sdylyPopupChartOption.series[2].data = ll;
              that.myPopupChart.setOption(that.sdylyPopupChartOption);//更新饼图
              that.myPopupChart.resize();
            }
          }
        });
      },
      //设置路口图层隐藏
      setMarkerLayerHide(layerId){
        let that = this;
        if(layerId){
          this.map.setLayoutProperty('poi_point_'+layerId, 'visibility', 'none');
        }else {
          for( let key in that.allMarkerLayer){
            this.map.setLayoutProperty("poi_point_"+key, 'visibility', 'none');
          }
        }
        /*this.map.setLayoutProperty('poi-point-marker-layer-id', 'visibility', 'none');*/

      },
      //设置路口图层显示
      setMarkerLayerShow(layerId){
        let that = this;
        if(layerId){
          this.map.setLayoutProperty('poi_point_'+layerId, 'visibility', 'visible');
        }else {
          for( let key in that.allMarkerLayer){
            this.map.setLayoutProperty("poi_point_"+key, 'visibility', 'visible');
          }
        }
        //this.map.setLayoutProperty('poi-point-marker-layer-id', 'visibility', 'visible');
      },
      //清除所有线
      clearLines() {
       this.REMOVE_MAP_LINE_OVERALL_ARRAY('networkFlowLinesId',this.map);
       this.REMOVE_MAP_LINE_OVERALL_ARRAY('networkFlowLinesId1',this.map);
        for(let i =0; i<this.tempRoadLinesId.length; i++){
         this.REMOVE_MAP_LINE_OVERALL_ARRAY(this.tempRoadLinesId[i],this.map);
        }
        this.tempRoadLinesId=[];
        this.currentRoadId='';
        this.REMOVE_MAP_LINE_OVERALL_ARRAY('tempSectionLineId',this.map);
      },
      //清除路段线和信息框
      clearRoadLinesAndPopupDiv(isHide) {
        let that = this;
        that.clearRoadInterval();
        for(let i =0; i<this.tempRoadLinesId.length; i++){
         this.REMOVE_MAP_LINE_OVERALL_ARRAY(this.tempRoadLinesId[i],this.map);
        }
        this.tempRoadLinesId=[];
        this.currentRoadId='';
        //清除路口的路线
       this.REMOVE_MAP_LINE_OVERALL_ARRAY('tempIntersectionALinesId',this.map);
        $('.intersection-a-div').hide();
        $('.intersection-b-div').hide();
        $('.road-popup-div-echart').hide();
      },
      //清除第三类路口信息
      clearMarker3() {
        let that = this;
        if(this.MAP_MARKER_OVERALL_ARRAY[that.intersectionMarkerImgId]) this.MAP_MARKER_OVERALL_ARRAY[that.intersectionMarkerImgId].remove();
        $('.intersection-traffic-analysis').hide();
        that.isM3 = false;
        that.clearRoadInterval();
        for(let i=0; i<15; i++) {
          that.roadArrowMarkers[i].remove();
        }
      },
      setMousemoveStyle(e){
        let features = this.map.queryRenderedFeatures(e.point);
        this.map.getCanvas().style.cursor = '';
        if (!features || !features.length) {
          return;
        }
        for (let i = 0; i < features.length; i++) {
          if (features[i].layer.id == "area_layer_area_group_id") {//如果是大队图层
            this.map.getCanvas().style.cursor = 'pointer';
            return;
          }else if(features[i].properties.type === "lochus"){
            this.map.getCanvas().style.cursor = 'pointer';
            return;
          }else if(features[i].properties.type === "intersectionMarker"){
            this.map.getCanvas().style.cursor = 'pointer';
            return;
          }
        }
      },
      //显示线路信息
      showLinePopup (e) {
        let that = this;
        //let features = this.map.queryRenderedFeatures(e.point, {layers: that.layesArray});
        let features = this.map.queryRenderedFeatures(e.point);
        //this.map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
        if (!features || !features.length) {
          return;
        }
        for (let i = 0; i < features.length; i++) {
          if (features[i].layer.id == "area_layer_area_group_id") {//如果是大队图层
            this.map.setCenter(features[i].properties.lnglat.split(" "));
            this.map.setZoom(11);
            that.lastZoom = 11;
            this.map.setCenter(e.lngLat);
            break;
          }else if(features[i].properties.type === "lochus"){
            this.map.setCenter(features[i].properties.lnglat.split(" "));
            this.map.setZoom(13);
            that.lastZoom = 13;
            that.setMarkerLayerHide();
            that.setMarkerLayerShow(features[i].properties.id);
            this.map.setCenter(e.lngLat);
            break;
          }else if(features[i].properties.type === "intersectionMarker"){
            that.getIntersectionDataByType(features[i].properties.id,features[i].properties.ptype);
            that.hideIntersectionMarkers();
            //this.map.setCenter(e.lngLat);
            break;
          }
        }
      },
      //创建路口评价图标
      createDivintersectionMarker(juncId){
        let that = this;
        let iconObj = that.getIconByMonitorType(juncId);
        that.deg=iconObj.deg;
        let outer = $('<div></div>');
        let el = $('<div id="divintersectionMarkerImgId" style="background-image: url('+iconObj.icon+'); background-size: cover; width: '+iconObj.width+'px; height: '+iconObj.height+'px; transform: rotate('+iconObj.deg+'deg);color: #000000;font-size: 14px; position: relative;"></div>');
        let northb = $('<div id="northTableDiv" style="margin-left: 9rem;margin-top: -2rem; width: 7rem;text-align: left; padding-left: 0.5rem;position: absolute;background-color: #0066cc;"><span id="northDir"></span><br/><span id="northJuncName"></span><br/><span id="northFlow"></span></div>');
        let westb = $('<div id="westTableDiv" style="margin-top: 13rem;margin-left: -2.5rem;width: 7rem;text-align: left; padding-left: 0.5rem;position: absolute;background-color: #0066cc;"><span id="westDir"></span><br/><span id="westJuncName"></span><br/><span id="westFlow"></span></div>');
        let eastb = $('<div id="eastTableDiv" style="margin-left: 28.5rem;margin-top: 5.5rem; width: 7rem;text-align: left; padding-left: 0.5rem;position: absolute;background-color: #0066cc;"><span id="eastDir"></span><br/><span id="eastJuncName"></span><br/><span id="eastFlow"></span></div>');
        let southb = $('<div id="southTableDiv" style="margin-left: 17rem;margin-top: 22rem;width: 7rem;text-align: left; padding-left: 0.5rem;position: absolute;background-color: #0066cc;"><span id="southDir"></span><br/><span id="southJuncName"></span><br/><span id="southFlow"></span></div>');
        el.append(northb);
        el.append(westb);
        el.append(eastb);
        el.append(southb);

        outer.append(el);
        let offsetX = iconObj.width/2;
        let offsetY = iconObj.height/2;
        let marker = new minemap.Marker(outer[0], {offset: [-offsetX, -offsetY]});
        this.MAP_MARKER_OVERALL_ARRAY[that.intersectionMarkerImgId] = marker;
      },
      //创建路口评价图标1
      createDivintersection1Marker(){
        let that = this;
        let iconObj = that.getIconByMonitorType("intersectionIMG1");
        let outer = $('<div></div>');
        let el = $('<div id="divintersectionMarkerImgId1" style="background-image: url('+iconObj.icon+'); background-size: cover; width: '+iconObj.width+'px; height: '+iconObj.height+'px; color: #000000;font-size: 14px; font-family: \'Microsoft YaHei\'; position: relative;"></div>');

        let northb = $('<div id="northTableDiv" style="margin-left: 8rem;margin-top: -2rem; width: 7rem;text-align: left; padding-left: 0.5rem;position: absolute;background-color: #0066cc;"><span id="northDir"></span><br/><span id="northJuncName"></span><br/><span id="northFlow"></span></div>');
        let westb = $('<div id="westTableDiv" style="margin-top: 14rem;margin-left: -3.5rem;width: 7rem;text-align: left; padding-left: 0.5rem;position: absolute;background-color: #0066cc;"><span id="westDir"></span><br/><span id="westJuncName"></span><br/><span id="westFlow"></span></div>');
        let eastb = $('<div id="eastTableDiv" style="margin-left: 28.5rem;margin-top: 7.5rem; width: 7rem;text-align: left; padding-left: 0.5rem;position: absolute;background-color: #0066cc;"><span id="eastDir"></span><br/><span id="eastJuncName"></span><br/><span id="eastFlow"></span></div>');
        let southb = $('<div id="southTableDiv" style="margin-left: 16rem;margin-top: 25rem;width: 7rem;text-align: left; padding-left: 0.5rem;position: absolute;background-color: #0066cc;"><span id="southDir"></span><br/><span id="southJuncName"></span><br/><span id="southFlow"></span></div>');
        el.append(northb);
        el.append(westb);
        el.append(eastb);
        el.append(southb);

        outer.append(el);
        let offsetX = iconObj.width/2;
        let offsetY = iconObj.height/2;
        let marker = new minemap.Marker(outer[0], {offset: [-offsetX, -offsetY]});
        this.MAP_MARKER_OVERALL_ARRAY[that.intersectionMarkerImgId] = marker;
      },
      //设置最大最小经纬度
      getMinMaxLonlat(lls,minMaxLl){
        for(let i=0; i<lls.length; i++){
          minMaxLl[0] = Math.min(minMaxLl[0], lls[i][0]);
          minMaxLl[1] = Math.max(minMaxLl[1], lls[i][0]);
          minMaxLl[2] = Math.min(minMaxLl[2], lls[i][1]);
          minMaxLl[3] = Math.max(minMaxLl[3], lls[i][1]);
        }
      },
      //第三类路口道路示意线
      showAirLineLayer(arrowLonlat){
        let that = this;
        let startx = arrowLonlat[0][0];
        let starty = arrowLonlat[0][1];
        let endx = arrowLonlat[arrowLonlat.length-1][0];
        let endy = arrowLonlat[arrowLonlat.length-1][1];
        let xl=0,yl=0;
        for(let d=0;d<arrowLonlat.length;d++){
          if(arrowLonlat[d+1]){
            xl+=arrowLonlat[d][0]-arrowLonlat[d+1][0];
            yl+=arrowLonlat[d][1]-arrowLonlat[d+1][1];
          }
        }
        let angle = that.calulateXYAnagle(arrowLonlat[0][0],arrowLonlat[0][1], arrowLonlat[arrowLonlat.length-1][0], arrowLonlat[arrowLonlat.length-1][1]);
        let lx = xl/60;
        let ly = yl/60;
        let lnglats = [[],[],[],[]];
        for(let i=59; i>=0; i--) {
          let tx = endx + lx * i;
          let ty = endy + ly * i--;
          lnglats[0].push([tx,ty]);

          tx = endx + lx * i;
          ty = endy + ly * i--;
          lnglats[1].push([tx,ty]);
          tx = endx + lx * i;
          ty = endy + ly * i--;
          lnglats[2].push([tx,ty]);
          tx = endx + lx * i;
          ty = endy + ly * i;
          lnglats[3].push([tx,ty]);
        }
        let lonlats=[[],[],[],[]];
        lnglats.forEach(function(e,i){
          lonlats[i].push(e[0]);
          for(var j=1;j<e.length;j++){
            if(that.GetDistance(lonlats[i][lonlats[i].length-1][0],lnglats[i][j][0],lonlats[i][lonlats[i].length-1][1],lnglats[i][j][1])>=0.02){
              lonlats[i].push(lnglats[i][j]);
            }
          }
        })
        if(that.minTimeInterval2 !== ""){
          window.clearInterval(that.minTimeInterval2);
          that.minTimeInterval2 == "";
        }
        let li = 0;
        that.minTimeInterval2 = window.setInterval(function(){
          if(li>3) li = 0;
          for(let i=0; i<14; i++){
            if(i>=lonlats[li].length) lonlats[li][i]=lonlats[li][i-1];
            that.roadArrowMarkers[i].setLngLat(lonlats[li][i]).addTo(that.map);
            document.getElementById("arrowRoadMarkerId"+i).style.transform = "rotate("+(angle+that.intersectionRotate1Z)+"deg)";
          }
          li=li+1;
        },800);
      },
      // 两点计算角度
      calulateXYAnagle(startx, starty, endx, endy){
        if (endy == starty) endy=endy+0.00001;
        //除数不能为0
        let tan = Math.atan(Math.abs((endy - starty) / (endx - startx))) * 180 / Math.PI;
        if (endx >= startx && endy >= starty){//第一象限
          return -tan;
        }else if (endx >= startx && endy < starty){//第二象限
          return tan;
        }else if (endx < startx && endy > starty){//第三象限
          return tan - 180;
        }else{
          return 180 - tan;
        }
      },
      //清除定时任务
      clearRoadInterval() {
        if(this.minTimeInterval !== ""){
          window.clearInterval(this.minTimeInterval);
          this.minTimeInterval == "";
        }
        if(this.minTimeInterval2 !== ""){
          window.clearInterval(this.minTimeInterval2);
          this.minTimeInterval2 == "";
        }
      },
      //根据英文方向获取中文名称
      getNameByDirection(dir){
        let name = '';
        if(dir === "ns"){
          name = "北向南";
        }else if(dir === "ew"){
          name = "东向西";
        }else if(dir === "we"){
          name = "西向东";
        }else if(dir === "sn"){
          name = "南向北";
        }
        return name;
      },
      //设置路口标签数据
      setDirectionTitle(){
        let that = this;
        let fadeToIndex = 1;
        $('#northTableDiv').hide();
        $('#eastTableDiv').hide();
        $('#westTableDiv').hide();
        $('#southTableDiv').hide();
        for(let j=0; j<that.tableRows.length; j++){
          let row = that.tableRows[j];
          if(row.direction === "ns"){
            $('#northJuncName').html(that.tableRows[j].juncName);
            $('#northFlow').html(that.tableRows[j].speed+'km/h');
            $('#northDir').html(that.tableRows[j].dir);
            $('#northTableDiv').css("backgroundColor", that.getColorByIndex(that.tableRows[j].congestionIndex));
            $('#northTableDiv').fadeTo("slow",fadeToIndex);
            $('#northTableDiv').show();
          }else if(row.direction === "ew"){
            $('#eastJuncName').html(that.tableRows[j].juncName);
            $('#eastFlow').html(that.tableRows[j].speed+'km/h');
            $('#eastDir').html(that.tableRows[j].dir);
            $('#eastTableDiv').css("backgroundColor", that.getColorByIndex(that.tableRows[j].congestionIndex));
            $('#eastTableDiv').fadeTo("slow",fadeToIndex);
            $('#eastTableDiv').show();
          }else if(row.direction === "we"){
            $('#westJuncName').html(that.tableRows[j].juncName);
            $('#westFlow').html(that.tableRows[j].speed+'km/h');
            $('#westDir').html(that.tableRows[j].dir);
            $('#westTableDiv').css("backgroundColor", that.getColorByIndex(that.tableRows[j].congestionIndex));
            $('#westTableDiv').fadeTo("slow",fadeToIndex);
            $('#westTableDiv').show();
          }else if(row.direction === "sn"){
            $('#southJuncName').html(that.tableRows[j].juncName);
            $('#southFlow').html(that.tableRows[j].speed+'km/h');
            $('#southDir').html(that.tableRows[j].dir);
            $('#southTableDiv').css("backgroundColor", that.getColorByIndex(that.tableRows[j].congestionIndex));
            $('#southTableDiv').fadeTo("slow",fadeToIndex);
            $('#southTableDiv').show();
          }
        }
      },
      //根据路口方向显示图表数据
      showEChartByDir(dir){
        let that = this;
        if(dir === "ns"){
          that.sdylyChartOption.xAxis[0].data = that.sdyllChartData.north.times;
          that.sdylyChartOption.series[2].data = that.sdyllChartData.north.ll;
          that.sdylyChartOption.series[1].data = that.sdyllChartData.north.sd;
          that.sdylyChartOption.series[0].data = that.sdyllChartData.north.yd;
          that.shzsChartOption.xAxis[0].data = that.sdyllChartData.north.times;
          that.shzsChartOption.series[0].data = that.shzsChartData.north;
        }else if(dir === "ew"){
          that.sdylyChartOption.xAxis[0].data = that.sdyllChartData.east.times;
          that.sdylyChartOption.series[2].data = that.sdyllChartData.east.ll;
          that.sdylyChartOption.series[1].data = that.sdyllChartData.east.sd;
          that.sdylyChartOption.series[0].data = that.sdyllChartData.east.yd;
          that.shzsChartOption.xAxis[0].data = that.sdyllChartData.east.times;
          that.shzsChartOption.series[0].data = that.shzsChartData.east;
        }else if(dir === "we"){
          that.sdylyChartOption.xAxis[0].data = that.sdyllChartData.west.times;
          that.sdylyChartOption.series[2].data = that.sdyllChartData.west.ll;
          that.sdylyChartOption.series[1].data = that.sdyllChartData.west.sd;
          that.sdylyChartOption.series[0].data = that.sdyllChartData.west.yd;
          that.shzsChartOption.xAxis[0].data = that.sdyllChartData.west.times;
          that.shzsChartOption.series[0].data = that.shzsChartData.west;
        }else if(dir === "sn"){
          that.sdylyChartOption.xAxis[0].data = that.sdyllChartData.south.times;
          that.sdylyChartOption.series[2].data = that.sdyllChartData.south.ll;
          that.sdylyChartOption.series[1].data = that.sdyllChartData.south.sd;
          that.sdylyChartOption.series[0].data = that.sdyllChartData.south.yd;
          that.shzsChartOption.xAxis[0].data = that.sdyllChartData.south.times;
          that.shzsChartOption.series[0].data = that.shzsChartData.south;
        }
        that.myChart.setOption(that.sdylyChartOption);//更新饼图
        that.shzsChart.setOption(that.shzsChartOption);/************取消更新均衡指数曲线图***/
        setTimeout(function(){
          that.resizeContainer();
          that.myChart.resize();
          that.shzsChart.resize();
        },1000);
      },
      //根据路口方向设置偏移量
      setCenterPan(type,index){
        let that = this;
        if(that.panType !== type) {
          if(type === 1){
            this.map.setCenter(that.road2Lnglat);
          }else{
            this.map.setCenter(that.road1Lnglat);
          }
          this.map.panBy([240,-100]);
          that.panType = type;
        }
      },
      //初始化第三类路口
      initIntersection(juncName,type){
        let that = this;
        let ti = 0;
        if(that.tableRows[0].juncName !== ""){
          ti = 0;
        }else if(that.tableRows[1].juncName !== ""){
          ti = 1;
        }else if(that.tableRows[2].juncName !== ""){
          ti = 2;
        }else if(that.tableRows[3].juncName !== ""){
          ti = 3;
        }else{
          return;
        }
        that.currentleftLiId = that.tableRows[ti].leftLiId;
        for(let j=0; j<that.tableRows.length; j++){
          if(j===0){
            $("li[name="+that.tableRows[j].leftLiId+"]").css("background-color","#4176f3");
            that.setIntersectionSLR(j);
            that.setUnbalanceindexTitle(that.tableRows[j].direction);
            $('.intersection-traffic-analysis-ul').animate({ scrollTop: $("li[name="+that.tableRows[j].leftLiId+"]")[0].offsetTop }, 10);
          }else{
            $("li[name="+that.tableRows[j].leftLiId+"]").css("background-color","#transparent");
          }
        }
        that.threeType = type;
        if(that.currentTrendLabelIndex!="") $('#' + that.currentTrendLabelIndex).css("background-color", "#335fbd");
        that.currentTrendLabelIndex = 'idtDiv'+that.tableRows[ti].direction;
        $('#'+that.currentTrendLabelIndex).css("background-color","#4176f3");
        that.analysisTitleName=juncName;
        that.currentDirection = that.tableRows[ti].direction;
        that.showAirLineLayer(that.tableRows[ti].arrowLonlat);
        that.setLaneData(that.tableRows[ti].lane_flow,that.tableRows[ti].direction);
        that.setDirectionTitle();
        that.showEChartByDir(that.tableRows[ti].direction);
        that.setCenterPan(type,that.tableRows[ti].direction);
      },
      //显示某一个路口的3方向流量信息
      setIntersectionSLR(index){
        let that = this;
        if(index === -1 || !that.tableRows[index]) {
          $("#arrowDiv").hide();
          $("#arrowDivName").hide();
          return false;
        }
        let dirs = that.tableRows[index].dirS;
        let dirl = that.tableRows[index].dirL;
        let dirr = that.tableRows[index].dirR;
        if((dirs === 0 && dirl === 0) || (dirs === 0  && dirr === 0) || (dirl === 0 && dirr === 0)){
          $("#arrowDiv").hide();
          $("#arrowDivName").hide();
        }else{
          $("#arrowDiv").show();
          $("#arrowDivName").show();
          if(dirs > 0){
            $("#arrowDivDirS").html(dirs);
            $("#arrowDivDirS").show();
          }else{
            $("#arrowDivDirS").hide();
          }
          if(dirl > 0){
            $("#arrowDivDirL").html(dirl);
            $("#arrowDivDirL").show();
          }else{
            $("#arrowDivDirL").hide();
          }
          if(dirr > 0){
            $("#arrowDivDirR").html(dirr);
            $("#arrowDivDirR").show();
          }else{
            $("#arrowDivDirR").hide();
          }
          $("#arrowDivName").text(that.tableRows[index].dir);
        }
      },
      //设置方向按钮是否显示
      setDirDiv(tableRows){
        let that = this;
        $('#idtDivns').hide();
        $('#idtDivsn').hide();
        $('#idtDivew').hide();
        $('#idtDivwe').hide();
        for(let j=0; j<that.tableRows.length; j++){
          $('#idtDiv'+that.tableRows[j].direction).show();
          $('#idtDiv'+that.tableRows[j].direction).css("background-color", "#335fbd");
        }
      },
      //根据方向设置路口均衡指数
      setUnbalanceindexTitle(direction){
        let that = this;
        for(let j=0; j<that.tableRows.length; j++){
          if(that.tableRows[j].direction === direction){
            that.itsaTitleCongestionIndex3 = that.tableRows[j].unbalanceindex;
            that.itsaTitleCongestionName3 = that.getNameByunbalanceindex(that.tableRows[j].unbalanceindex);
            $('#itsa-3-title-congestion-color').css("backgroundColor", that.getColorByIndex(that.tableRows[j].unbalanceindex));
          }
        }
        for(let j=0; j<that.tableRowsA.length; j++){
          if(that.tableRowsA[j].direction === direction){
            that.itsaTitleCongestionIndex1 = that.tableRowsA[j].unbalanceindex;
            that.itsaTitleCongestionName1 = that.getNameByunbalanceindex(that.tableRowsA[j].unbalanceindex);
            $('#itsa-1-title-congestion-color').css("backgroundColor", that.getColorByIndex(that.tableRowsA[j].unbalanceindex));
          }
        }
        for(let j=0; j<that.tableRowsB.length; j++){
          if(that.tableRowsB[j].direction === direction){
            that.itsaTitleCongestionIndex2 = that.tableRowsB[j].unbalanceindex;
            that.itsaTitleCongestionName2 = that.getNameByunbalanceindex(that.tableRowsB[j].unbalanceindex);
            $('#itsa-2-title-congestion-color').css("backgroundColor", that.getColorByIndex(that.tableRowsB[j].unbalanceindex));
          }
        }
      },
      //根据失衡指数返回失衡名称
      getNameByunbalanceindex(index){
        if(index<2){
          return "均衡";
        }else if(index<4){
          return "轻微失衡";
        }else if(index<6){
          return "失衡";
        }else if(index<8){
          return "较重失衡";
        }else if(index >= 8){
          return "严重失衡";
        }
      },
      //根据道路流量数据重新组装
      setLaneData(data,dir){
        let that=this;
         if(data == undefined) {
           that.is_noLane=true;
           return;
         };
        that.is_noLane=false;
        that.laneData=[];
        let datalist=data.data;
        if(datalist==undefined || datalist.length<1) {that.is_noLane=true;return;}else{that.is_noLane=false;}
        if(!data.type){
          datalist=list.reverse();
        };
        datalist.sort(function(a,b){return b.road_sort - a.road_sort;})
          this.is_sn=true;let deg=-90;
          this.laneData=[[],[],[]];
          datalist.forEach(function(e){
            let dir_img=that.getDir(e.road_dir);
            if(dir_img!=undefined) {
              that.laneData[0].push(dir_img.name);
              that.laneData[1].push({'src':dir_img.img,'deg':deg});
              that.laneData[2].push(e.flow==undefined?'-':(e.flow>0?e.flow+' pcu/h':'-'));
            }
          });
      },
      getDir(dir){
          switch(dir){
            case 1: return {name:'直行',img:this.arrow.straightImg};break;
            case 2: return {name:'向左',img:this.arrow.leftImg};break;
            case 3: return{name:'向右',img:this.arrow.rightImg};break;
            case 4: return {name:'向左转弯',img:this.arrow.stright_l_Img};break;
            case 5: return {name:'向右转弯',img:this.arrow.stright_r_Img};break;
              defaults:return null;break;
          }
      },
      showTitle(div){
        let $div=$(div.target).parent('div');$('.tip_cs').remove();
        $div.append('<div class="tip_cs">'+$div.attr('title')+'</div>');
        setTimeout(function(){$('.tip_cs').remove();},10000);
        $(document).click(function(event){
          var _con = $('.tip_img');  // 设置目标区域
          if(!_con.is(event.target) && _con.has(event.target).length === 0){ // Mark 1
            //$('#divTop').slideUp('slow');  //滑动消失
            $('.tip_cs').fadeOut();     //淡出消失
          }
        });
      },
      fitBox(mapc, lon1, lat1, lon2, lat2) {
        let temp = 0;
        if (lon2 > lon1) {
          temp = lon1;
          lon1 = lon2;
          lon2 = temp;
        }
        if (lat2 > lat1) {
          temp = lat1;
          lat1 = lat2;
          lat2 = temp;
        }
        let minx = lon2 - (lon1 - lon2) / 1.5;
        let miny = lat2 - (lat1 - lat2) / 1.5;
        let maxx = lon1 + (lon1 - lon2) / 1.5;
        let maxy = lat1 + (lat1 - lat2) / 1.5;
        let arr = [[minx, miny], [maxx, maxy]];
        mapc.fitBounds(minemap.LngLatBounds.convert(arr),{linear:true});
      },
      getIconByMonitorType (monitorType) {
        let icon = "";
        let width = 0;
        let height = 0;
        let deg=0;
        if (monitorType === "intersectionMarker") {//路口标点
          icon = IMG.INTERSECTION_MARKER_ICON;
          width = '30';
          height = '30';
        } else if (monitorType === "intersectionIMG") {//路口图片
          icon = IMG.INTERSECTION_IMG_ICON;
          width = '400';
          height = '280';
        } else if (monitorType === "intersectionIMG1") {//路口1图片
          icon = IMG.INTERSECTION_IMG_ICON1;
          width = '380';
          height = '330';
        }else if (monitorType === "intersectionMarkerC") {//道路通行能力路口标点3
          icon = IMG.INTERSECTION_MARKER_ICON_3;
          width = 42;
          height = 42;
        };
        return {"icon": icon, "width": width, "height": height,'deg':deg};
      },
      createPointPopupToArray(id, cock, cbn, offset, coordinates, html, map, pointPopupArray) {
        if (typeof pointPopupArray === "object" && id) {
          if (pointPopupArray[id]) pointPopupArray[id].remove();
          if (typeof cock !== "boolean") cock = true;
          if (typeof cbn !== "boolean") cbn = false;
          if (!offset) offset = [0, -20];
          let pointPopup = new minemap.Popup({closeOnClick: cock, offset: offset, closeButton: cbn});
          if (coordinates && coordinates != null) pointPopup.setLngLat(coordinates);
          if (html && html != null) pointPopup.setHTML(html);
          if (map) pointPopup.addTo(map);
          pointPopupArray[id] = pointPopup;
        }
      },
      REMOVE_MAP_MARKER_OVERALL_ARRAY (id) {
        //从地图上删除marker
        if(id) {
          for (let key in this.MAP_MARKER_OVERALL_ARRAY){
            if(id === key || key.indexOf(id)!=-1 ){
              this.MAP_MARKER_OVERALL_ARRAY[key].remove();
              delete this.MAP_MARKER_OVERALL_ARRAY[key];
            }
          }
        }else{
          for (let key in this.MAP_MARKER_OVERALL_ARRAY){
            this.MAP_MARKER_OVERALL_ARRAY[key].remove();
            delete this.MAP_MARKER_OVERALL_ARRAY[key];
          }
        }
      },
      REMOVE_MAP_LINE_OVERALL_ARRAY(id, map) {
        if(id && id!=null) {
          for(let i =0; i< this.MAP_LINE_OVERALL_ARRAY.length; i++){
            if(id === this.MAP_LINE_OVERALL_ARRAY[i]){
              if(map.getLayer("line_"+this.MAP_LINE_OVERALL_ARRAY[i])){//线图层
                map.removeLayer("line_"+this.MAP_LINE_OVERALL_ARRAY[i]);
              }
              if(map.getLayer("arrow_"+this.MAP_LINE_OVERALL_ARRAY[i])){//箭头层图
                map.removeLayer("arrow_"+this.MAP_LINE_OVERALL_ARRAY[i]);
              }
              if(map.getSource("ls_"+this.MAP_LINE_OVERALL_ARRAY[i])){//源数据
                map.removeSource("ls_"+this.MAP_LINE_OVERALL_ARRAY[i]);
              }
              MAP_LINE_OVERALL_ARRAY.splice(i--,1);
              break;
            }
          }
        }else {
          for(let i =0; i< this.MAP_LINE_OVERALL_ARRAY.length; i++){
            if(map.getLayer("line_"+this.MAP_LINE_OVERALL_ARRAY[i])){//线图层
              map.removeLayer("line_"+this.MAP_LINE_OVERALL_ARRAY[i]);
            }
            if(map.getLayer("arrow_"+this.MAP_LINE_OVERALL_ARRAY[i])){//箭头层图
              map.removeLayer("arrow_"+this.MAP_LINE_OVERALL_ARRAY[i]);
            }
            if(map.getSource("ls_"+this.MAP_LINE_OVERALL_ARRAY[i])){//源数据
              map.removeSource("ls_"+this.MAP_LINE_OVERALL_ARRAY[i]);
            }
            this.MAP_LINE_OVERALL_ARRAY.splice(i--,1);
          }
        }
      },
      REMOVE_MAP_POPUP_OVERALL_ARRAY (id) {
        if(id){
          for (let key in this.MAP_POPUP_OVERALL_ARRAY){
            if(id === key){
             this.MAP_POPUP_OVERALL_ARRAY[key].remove();
              delete this.MAP_POPUP_OVERALL_ARRAY[key];
              break;
            }
          }
        }else{
          //从地图上删除popup
          for (let key in this.MAP_POPUP_OVERALL_ARRAY){
            this.MAP_POPUP_OVERALL_ARRAY[key].remove();
            delete this.MAP_POPUP_OVERALL_ARRAY[key];
          }
        }
      }
    }
}
</script>
<style scoped>
  .intersection-traffic-left-list{
    position: fixed;
    width: 474px;
    height: 770px;
    left: 12px;
    top: 99px;
    background-color: #36579f;
  }
  .intersection-traffic-left-list-title {
    /* width: 100%; */
    text-align: center;
    border-bottom: 0.1rem solid #a9afd6;
    background-color: #0d6180;
    padding: 0.5rem 1rem;
    font-family: 'Microsoft YaHei';
    font-size: 16px;
    font-weight: bolder;
    color: #ffffff;
  }
  .intersection-traffic-left-list-tab {
    /* width: 100%; */
    text-align: center;
    border-bottom: 0.1rem solid #a9afd6;
    padding: 0.5rem 1rem;
    font-family: 'Microsoft YaHei';
    font-size: 16px;
    font-weight: bolder;
    color: #ffffff;
    background-color: #335fbd;
  }
  .intersection-traffic-left-list-ul-title{
    width: 100%;
    padding: 0.5rem 0;
  }
  .intersection-traffic-left-list-unbalance{
    display: inline-block;
    font-family: 'Microsoft YaHei';
    font-size: 16px;
    font-weight: 400;
    color: #ffffff;
    margin: 0.5rem 1rem;
  }

  .intersection-yuan{
    display: inline-block;
    vertical-align:middle;
    margin-top: -0.2rem;
    border-radius: 50%;
    width: 1rem;
    height: 1rem;
    background-color: #e51d18;
  }
  .left-list-ul-title {
    display: inline-block;
    /* vertical-align:middle; */
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 16px;
    font-weight: 500;
    color: #1D98AB;
  }
  .intersection-left-list-li {
    font-family: 'Microsoft YaHei';
    font-weight: 500;
    font-size: 16px;
    padding: 0.2rem 0;
    color:#ffffff;
    cursor: pointer;
  }
  .intersection-traffic-analysis{
    position: fixed;
    width: 680px;
    height: 960px;
    right: 0;
    top: 90px;
    display: none;
  }
  .itat-direction-title{
    width: 100%;
    height: 5%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .itat-direction-title div{
    width: 8rem;
    border-top: 0.1rem solid #ffffff;
    border-bottom: 0.1rem solid #ffffff;
    border-left: 0.1rem solid #ffffff;
    color: #ffffff;
    font-family: 'Microsoft YaHei';
    font-size: 16px;
    font-weight: 400;
    display: inline-block;
    margin: 0.4rem 0;
    border-radius: 3px;
    text-align: center;
    padding: 0.2rem 0;
    background-color: #335fbd;
    cursor: pointer;
  }
  .intersection-traffic-state-analysis-1 {
    width: 100%;
    margin-top: 1rem;
    height: 10%;
  }
  .itsa-1-title{
    width: 100%;
    height: 20%;
    display: flex;
    align-items: center;
  //justify-content: center;
    padding:0.3rem 0;
  }
  .itsa-1-title-name{
    font-family: 'Microsoft YaHei';
    font-weight: bolder;
    font-size: 16px;
    color:#ffffff;
    margin-left: 45%;
  }
  .itsa-1-title-congestion{
    font-family: 'Microsoft YaHei';
    font-weight: 400;
    font-size: 14px;
    color:#ffffff;
    margin-left: 70%;
    position: absolute;
  }
  .intersection-d-div-list-title {
    width: 100%;
    height: 32%;
    color:#ffffff;
    font-family: 'Microsoft YaHei';
    font-weight: 500;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 0.2rem 0;
    margin-bottom:5px;
  }
  .intersection-d-div-li {
    font-family: 'Microsoft YaHei';
    font-weight: 500;
    font-size: 14px;
    padding: 0.2rem 0;
    color:#ffffff;
    cursor: pointer;
  }
  .s_n_lane_cls,.w_e_lane_cls{width:100%;height:100%;padding-top:2%;}
  .s_n_lane_cls ul,.w_e_lane_cls ul{display:block;width:100%;height:100%;margin:0;padding:0;list-style:none;}
  .s_n_lane_cls ul li,.w_e_lane_cls ul li{height:33%;width:92%;border-bottom:1px solid #ccc;color: white;line-height:5rem;font-size:2rem;  text-align: center;margin: 0 4%;}
  .s_n_lane_cls ul li span,.w_e_lane_cls ul li span{display:inline-block;width:30%;height:100%;    text-align: center;  line-height: 2rem;}
  .s_n_lane_cls ul li:nth-child(2){height:25%;line-height:3rem;}
</style>
<style>
  .tip_cs{
    position: fixed;
    width: auto;
    height: auto;
    background: white;
    color: #666;
    /*background: orange;*/
    /*color: white;*/
    z-index: 1000;
    line-height: 25px;
    padding: 0 2px;font-size:12px;
    /* left: 15px; */
    text-align: left;border:1px solid #ddd;border-radius:2px;    box-shadow: 2px 2px 5px #463f3f;
  }
  .closeIns{width:30px;height:30px;}
  .intersection-traffic_container {
    width: 0;
    height: 0;
  }
.intersection-content span {
  color: #fbfcfb;
  font-family: "Microsoft YaHei";
  font-size: 16px;
}
input[type="datetime-local"]{
  background: rgba(0,54,88, 0.95);
  color: #ffffff;
  border: 0;
  margin-left: 14px;
  font-size: 2rem;
}
.intersection-traffic-state-analysis {
  position: fixed;
  width: 49.5%;
  height: 26%;
  left: 0;
  bottom: 0;
  background-color:#36579f;
  border: 0.2rem solid #0d5280;
  display: none;
}
.intersection-traffic-trend-analysis {
  position: fixed;
  width: 49.5%;
  height: 26%;
  background: #0d1b37;
  border: 0.2rem solid #0d5280;
  left: 50%;
  bottom: 0;
  display: none;
}
.intersection-traffic-trend-title1 {
  display: inline-block;
  padding: 0 1rem;
  font-family: 'Microsoft YaHei';
  font-size: 16px;
  font-weight: bolder;
  color: #ffffff;
}
.intersection-traffic-trend-title1:hover {
  background-color: #0d3a75;
}
.intersection-traffic-trend-title {
  width: 100%;
  height: 16%;
  border-bottom: 0.2rem solid #0d5280;
  display: flex;
  align-items: center;
  justify-content: center;
}
.intersection-traffic-analysis-title {
  width: 100%;
  height: 5%;
  /* display: flex;
  align-items: center;
  justify-content: center; */
  /* border-bottom: 0.1rem solid #a9afd6;
  background-color: #0d6180; */
}
.intersection-analysis-title-name {
  display: inline-block;
  margin: 1px 0;
  font-family: 'Microsoft YaHei';
  font-size: 16px;
  font-weight: bolder;
  color: #ffffff;
}
.intersection-analysis-img {
  width: 16px;
  height: 16px;
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 45px;
}
.intersection-trend-analysis-img {
  margin-left: 46%;
  width: 16px;
  height: 16px;
  cursor: pointer;
  position: absolute;
}
#intersection-state-tbody tr td{
  border: 0;
}
.road-network-flow-right-top {
  position: fixed;
  width: 19%;
  height: 5%;
  left: 80%;
  top: 16%;
}
.network-flow-right-top-title {
  width: 100%;
  color: #fbfcfb;
  font-family: "Microsoft YaHei";
  font-size: 14px;
}
.road-network-flow-right-top-span {
  width: 100%;
  color: #fbfcfb;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
}
.road-popup-div {
  position: fixed;
  width: 38%;
  height: 42%;
  right: 2%;
  top: 25%;
  background-color:#36579f;
  display: none;
}
.road-popup-div-title{
  width: 100%;
  height: 8%;
  color:#ffffff;
  border-bottom: 0.1rem solid #a9afd6;
  padding: 0.5rem;
  font-family: 'Microsoft YaHei';
  font-weight: bolder;
  display: flex;
  align-items: center;
  background-color: #0d6180;
}
.road-popup-div-content {
  width: 100%;
  height: 92%;
  overflow-y:scroll;
}
.road-popup-div-title-1 {
  font-size: 16px;
  display: inline-block;
  margin-left: 1rem;
}
.road-popup-div-title-2 {
  font-size: 14px;
  display: inline-block;
  margin-left: 2rem;
}
.road-popup-div-title-3 {
  font-size: 14px;
  display: inline-block;
  margin-left: 3rem;
}
.road-popup-div-title-img {
  margin-left: 92%;
  width: 16px;
  height: 16px;
  cursor: pointer;
  position: absolute;
}
.road-popup-direction-1 {
  width: 100%;
  height: 7%;
  color:#ffffff;
  border-bottom: 0.1rem solid #a9afd6;
  padding: 0.5rem 0;
  background-color:#335fbd;
  font-family: 'Microsoft YaHei';
  font-weight: bolder;
  font-size: 14px;
}
.road-popup-direction-1-img {
  display: inline-block;
  width: 4%;
  height: 2rem;
}
.road-popup-direction-1-ul {
  width: 100%;
  background-color:#36579f;
}
.intersection-traffic-analysis-ul {
  width: 100%;
  height: 34%;
//background-color:#36579f;
  overflow-y:hidden;
//border-bottom: 0.1rem solid #003a60;
}
.intersection-traffic-analysis-ul- {
  width: 100%;
  height: 20%;
  overflow-y:hidden;
}
.road-popup-direction-1-li {
  background-color:#36579f;
  border-bottom: 0.1rem solid #a9afd6;
  padding: 0;
  text-align: center;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  color: #ffffff;
}
.road-popup-div-echart {
  position: fixed;
  width: 38%;
  height: 20%;
  right: 2%;
  top: 70%;
  background-color:#36579f;
  border: 0.2rem solid #0d5280;
  display: none;
}
.intersection-a-div {
  position: fixed;
  width: 25%;
  height: 42%;
  left: 73%;
  top: 25%;
  background-color:#36579f;
  border: 0.2rem solid #0d5280;
  display: none;
}
.intersection-a-div-list-title {
  width: 100%;
  height: 14%;
  color:#ffffff;
  border-bottom: 0.1rem solid #a9afd6;
  background-color:#335fbd;
  font-family: 'Microsoft YaHei';
  font-weight: bolder;
  font-size: 14px;
  text-align: center;
}
.intersection-a-div-list-title-name {
  display: inline-block;
  padding: 0.5rem 0;
  width: 43%;
  text-align: center;
}
.intersection-a-div-list-title-index {
  display: inline-block;
  width: 15%;
  cursor: pointer;
  text-align: center;
}
.intersection-a-div-list-title-speed {
  display: inline-block;
  width: 15%;
  cursor: pointer;
  text-align: center;
}
.intersection-a-div-list-title-flow-speed {
  display: inline-block;
  width: 18%;
  cursor: pointer;
  text-align: center;
}
.list-group {
  position: relative;
  overflow-y: auto;
  margin-bottom: 0;
  padding: 0;
}
.intersection-a-div-ul {
  width: 100%;
  height: 77%;
  background-color:#36579f;
}
.intersection-a-div-li {
  background-color:#36579f;
  border-bottom: 0.1rem solid #a9afd6;
  padding: 0;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  color: #ffffff;
}

.intersection-b-div {
  position: fixed;
  width: 38%;
  height: 42%;
  right: 2%;
  top: 25%;
  background-color:#36579f;
  display: none;
}
.intersection-b-div-list-title {
  width: 100%;
  color:#ffffff;
  border-bottom: 0.1rem solid #a9afd6;
  background-color:#335fbd;
  font-family: 'Microsoft YaHei';
  font-weight: bolder;
  font-size: 14px;
  text-align: center;
  height: 14%;
}
.intersection-b-div-list-title-name {
  display: inline-block;
  padding: 0.5rem 0;
  width: 30%;
  text-align: center;
}
.intersection-b-div-list-title-capacity{
  display: inline-block;
  width: 14%;
  text-align: center;
}
.intersection-b-div-list-title-flow{
  display: inline-block;
  width: 11%;
  text-align: center;
}
.intersection-b-div-list-title-index {
  display: inline-block;
  width: 10%;
  text-align: center;
}
.intersection-b-div-list-title-speed {
  display: inline-block;
  width: 10%;
  text-align: center;
}
.intersection-b-div-list-title-flow-speed {
  display: inline-block;
  width: 12%;
  text-align: center;
}
.intersection-b-div-list-title-saturation {
  display: inline-block;
  width: 8%;
  text-align: center;
}
.intersection-b-div-ul {
  width: 100%;
  height: 78%;
  background-color:#36579f;
  border-bottom: 0.1rem solid #a9afd6;
}
.intersection-b-div-li {
  background-color:#36579f;
  border: 0.1rem solid #a9afd6;
  padding: 0;
  font-family: 'Microsoft YaHei';
  font-size: 1.3rem;
  color: #ffffff;
}

.intersection-c-div-list-title {
  width: 100%;
  height: 32%;
  color:#ffffff;
  font-family: 'Microsoft YaHei';
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 0.2rem 0;
}
.intersection-c-div-list-title-name {
  display: inline-block;
  width: 11%;
  text-align: center;
}
.intersection-c-div-list-title-name-1 {
  display: inline-block;
  width: 13%;
  text-align: center;
}
.intersection-c-div-list-title-name-2 {
  display: inline-block;
  width: 15%;
  text-align: center;
}
.intersection-c-div-list-title-name-3 {
  display: inline-block;
  width: 16%;
  text-align: center;
}
.intersection-c-div-list-title-name-4 {
  display: inline-block;
  width: 9%;
  text-align: center;
}
.intersection-c-div-list-title-name-5 {
  display: inline-block;
  width: 13%;
  text-align: center;
}
.intersection-c-div-list-title-capacity {
  display: inline-block;
  width: 32%;
  text-align: center;
}
.intersection-c-div-list-title-capacity-1 {
  display: inline-block;
  width: 26%;
  text-align: center;
}
.intersection-c-div-li {
  /* border-bottom: 0.1rem solid #a9afd6; */
  font-family: 'Microsoft YaHei';
  font-weight: 500;
  font-size: 14px;
  padding: 0.2rem 0;
  /*line-height:20px;*/
  /*height:20px;*/
  color:#ffffff;
  cursor: pointer;
}
.title-span-font {
  font-size: 1rem;
  font-weight: 400;
}
.intersection-div-list-title-1 {
  display: inline-block;
  width: 13%;
  text-align: center;
}
.intersection-div-list-title-2 {
  display: inline-block;
  width: 30%;
  text-align: center;
}
</style>
