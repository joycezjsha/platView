<template>
  <div class="statics">
    <img :src="staticsIcon" class="staticsIconCls" @click="showStaticsDiv" />
    <transition name ="fade" mode="out-in">
      <div class="staticsDiv" v-show="isShowStatics">
        <el-collapse v-model="activeNames" :data="dataStatics" v-for="(item,name) in dataStatics">
          <el-collapse-item name="overview" v-if="name=='overview'">
            <template slot="title">
              <div class="el-card__header clearfix">
                <div style="text-align: left;margin-right:1vw;color:#43defd;float:left;min-width: 35%;font-size: 0.9vw;">
                  统计总览
                </div>
                <div style="font-size: 1.2vw;float:right;text-align: right;max-width: 50%;"></div>

              </div>
              <!--<div slot="header" class="clearfix" >-->
              <!--<el-col :span="12" style="color:#43defd;">{{item.name}}</el-col>-->
              <!--<el-col v-if="statics.isShow" :span="12" style="font-size: 1.87vw;text-align: right;min-width: 40%;"><span>{{statics.mileageSum}}</span>&nbsp;<span style="font-size: 1vw;">{{item[item.length-1].company}}</span></el-col>-->
              <!--<el-col v-else :span="12" style="font-size: 1.87vw;text-align: right;min-width: 40%;margin-right:5%;"><span>{{item.count}}</span>&nbsp;<span style="font-size: 1vw;">{{item.company}}</span></el-col>-->
              <!--</div>-->
            </template>
            <el-card class="box-card chart">
              <div class="overviewDiv" style="height:200px;width: 100%;" id="overviewDiv" v-loading="showLoading" element-loading-text="加载中..."
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgb(7, 32, 74)"></div>
              <div style="text-align: left;margin-right:1vw;color:#43defd;float:left;min-width: 35%;font-size: 0.8vw;">
                高速公路图层统计分析
              </div>
              <div style="color:white;">
                <el-table :data="listData" size="small" align="center" style="width: 100%"
                          v-loading="tableLoading" element-loading-text="加载中"
                          element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
                >
                  <el-table-column prop="high_length" label="高速" align="center" width="70px"></el-table-column>
                  <el-table-column prop="mileageNum" label="里程桩" align="center" width="75px"></el-table-column>
                  <el-table-column prop="serviceareaNum" label="服务区" align="center" width="75px"></el-table-column>
                  <el-table-column prop="chargeNum" label="收费站" align="center" width="75px"></el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-collapse-item>
          <el-collapse-item :name="name" v-else>
            <template slot="title">
              <div class="el-card__header clearfix">
                <div style="text-align: left;margin-right:1vw;color:#43defd;float:left;min-width: 35%;font-size: 0.9vw;">
                  {{item.name.replace('图层','')}}总数
                </div>
                <div style="font-size: 1.2vw;float:right;text-align: right;max-width: 50%;">
                  <span>{{item.count}}</span>&nbsp;<span style="font-size: 1vw;">{{item.company}}</span>
                </div>
              </div>
              <!--<div slot="header" class="clearfix" >-->
              <!--<el-col :span="12" style="color:#43defd;">{{item.name}}</el-col>-->
              <!--<el-col v-if="statics.isShow" :span="12" style="font-size: 1.87vw;text-align: right;min-width: 40%;"><span>{{statics.mileageSum}}</span>&nbsp;<span style="font-size: 1vw;">{{item[item.length-1].company}}</span></el-col>-->
              <!--<el-col v-else :span="12" style="font-size: 1.87vw;text-align: right;min-width: 40%;margin-right:5%;"><span>{{item.count}}</span>&nbsp;<span style="font-size: 1vw;">{{item.company}}</span></el-col>-->
              <!--</div>-->
            </template>
            <el-card class="box-card chart" v-if="item.isMileage">
              <div class="progress" v-show="statics.isShow">
                <ul>
                  <li v-show="statics.mileageUp!=0" :style="'width:'+statics.mileageUpPer+'%'">上行</li><li v-show="statics.mileageDown!=0" :style="'width:'+(statics.mileageDownPer-1)+'%'">下行</li><li v-show="statics.mileageDouble!=0" :style="'width:'+statics.mileageDoublePer+'%'">双向</li>
                </ul>
                <ul>
                  <li v-show="statics.mileageUp!=0" :style="'background:rgba(27, 105, 232, 1);border-radius: 6px 0 0 6px;width:'+(statics.mileageUpPer-1)+'%'"></li>
                  <li v-show="statics.mileageDown!=0" :style="'background:rgba(72, 169, 106, 1);width:'+(statics.mileageDownPer-1)+'%'"></li>
                  <li v-show="statics.mileageDouble!=0" :style="'background:rgba(3, 172, 253, 1);border-radius: 0 6px 6px 0;width:'+statics.mileageDoublePer+'%'"></li>
                </ul>
                <ul>
                  <li v-show="statics.mileageUp!=0" :style="'width:'+statics.mileageUpPer+'%'">{{statics.mileageUp}}个</li>
                  <li v-show="statics.mileageDown!=0" :style="'width:'+statics.mileageDownPer+'%'">{{statics.mileageDown}}个</li>
                  <li v-show="statics.mileageDouble!=0" :style="'width:'+statics.mileageDoublePer+'%'">{{statics.mileageDouble}}个</li>
                </ul>
              </div>
              <div id="staticsDiv" v-loading="showLoading" element-loading-text="加载中..."
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgb(7, 32, 74)"></div>
            </el-card>
            <el-card class="box-card chart" v-else-if="item.isHighSpeed">
              <div class="progress" >
                <ul>
                  <li :style="'max-width:60%;width:'+statics.contryHighSpeedPer+'%'">国家高速</li><li :style="'min-width:40%;width:'+statics.otherHighSpeedPer+'%'">地方高速</li>
                </ul>
                <ul>
                  <li :style="'border-radius: 6px 0 0 6px;background:#686FFF;border:none;width:'+statics.contryHighSpeedPer+'%'"></li>
                  <li :style="'border-radius:0 6px 6px 0;border:none;background-color:#0DA9AF;width:'+statics.otherHighSpeedPer+'%'"></li>
                </ul>
                <ul>
                  <li :style="'max-width:60%;width:'+statics.contryHighSpeedPer+'%'">{{statics.contryHighSpeed}}条/{{statics.contryHighSpeedLength}}km</li><li :style="'min-width:40%;width:'+statics.otherHighSpeedPer+'%'">{{statics.otherHighSpeed}}条/{{statics.otherHighSpeedLength}}km</li>
                </ul>
              </div>
              <div v-for="o in item.data" class="text item" style="font-size: 0.9vw;line-height: 3em;height: 3em;width:auto;border-bottom: 1px solid #7DB4FF">
                <div style="float:left;text-align: left;color:#43defd;width: 40%;">{{o.name}}<span style="font-size: 1vw;"></span></div>
                <div style="float:left;text-align: right;width: 60%;font-size: 20px;"><span>{{o.count}}</span>&nbsp;<span style="font-size: 1vw;">km</span></div>
              </div>
              <div id="hight_speed_chart_div" v-loading="showLoading"
                   element-loading-text="加载中..."
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgb(7, 32, 74)"></div>
            </el-card>
            <el-card class="box-card" v-else>
              <div v-for="o in item.data" class="text item" style="line-height: 3em;width:auto;font-size: 0.9vw;padding:0 0.5vw;">
                <div style="float:left;text-align: left;margin-right:1vw;color:#43defd;min-width: 40%;">{{o.name}}<span style="font-size: 1vw;"></span></div>
                <div style="float:right;text-align: right;max-width: 50%;width: 45%;"><span>{{o.count}}</span>&nbsp;<span style="font-size: 1vw;">km</span></div>
              </div>
            </el-card>
          </el-collapse-item>
        </el-collapse>
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
            map:'',
          overviewChart:null,
          token:sessionStorage.getItem("token"),
          isMileage:true,
          isHighSpeed:false,
          isNative:false,
          dataStatics: {overview:{}},
          showLoading:true,
          option: {
            color: 'white',
            textStyle: {fontFamily: 'DroidSansFont'},
            tooltip: {
              trigger: 'item',
              formatter: function (params) {
                return params.name + ':' + params.percent + '%'
              }
//                "{a} <br/>{b} : {c} (parseInt({d}).toFixed(0)%)"
            },
            legend: {
              x: 'center',
              y: 'bottom',
              data: [],
              textStyle: {color: 'white'}
            },
//              toolbox: {
//                show : true,
//                feature : {
//                  mark : {show: true},
//                  dataView : {show: true, readOnly: false},
//                  magicType : {
//                    show: true,
//                    type: ['pie', 'funnel']
//                  },
//                  restore : {show: true},
//                  saveAsImage : {show: true}
//                }
//              },
            calculable: true,
            series: [
              {
                name: '里程桩',
                type: 'pie',
                hoverAnimation: false,
                selectedMode: 'single',
                radius: [0, 13],
                center: ['50%', '40%'],
                roseType: 'area',
                // for funnel
                x: '20%',
                width: '40%',
                funnelAlign: 'right',
                max: 1548,
                itemStyle: {
                  normal: {
                    color: '#0054db',
                    label: {
                      position: 'inner'
                    },
                    labelLine: {
                      show: false
                    }
                  }
                },
                data: [
                  {value: 335, name: ''},
                ]
              },
              {
                name: '里程桩',
                type: 'pie',
                selectedMode: 'single',
                radius: [13, 25],
                hoverAnimation: false,
                center: ['50%', '40%'],
                roseType: 'area',
                // for funnel
                x: '20%',
                width: '40%',
                funnelAlign: 'right',
                max: 1548,
                itemStyle: {
                  normal: {
                    color: '#033f90',
                    label: {
                      position: 'inner'
                    },
                    labelLine: {
                      show: false
                    }
                  }
                },
                data: [
                  {value: 335, name: ''},
                ]
              },
              {
                name: '里程桩',
                type: 'pie',
                radius: [25, 65],
                center: ['50%', '40%'],
                roseType: 'area',
                labelLine: {
                  normal: {
                    length: 14,
                    length2: 14
                  }
                },
                data: [],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  },
                  normal: {
                    label: {
                      position: 'outer',
                      formatter: function (params) {
                        return params.name + ' \n\n' + params.percent + '%'
                      },
                      color: 'white',
                      fontSize: 14
                    },
                    labelLine: {
                      show: true
                    }
                  }
                },
              }
            ]
          },
          pieChart: null,
          statics:{isShow:false,mileageSum:'340',mileageUp:'50',mileageUpPer:'30%',mileageDown:'100',mileageDownPer:'',mileageDouble:'',mileageDoublePer:'',contryHighSpeedPer:'70',contryHighSpeed:'20',contryHighSpeedLength:'3500',otherHighSpeed:'2',otherHighSpeedPer:'30',otherHighSpeedLength:'832'},
          hight_speed_option : {
            color: ['#34C3FF'],
            dataset:{source: []},
            grid: {left: '0%',top:'10%',
              right: '25%',
              bottom: '10%',containLabel: true},
            xAxis: {
              name: '',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              },
              axisLabel: {show:false,textStyle: {
                color: 'white'
              }}},
            yAxis: {
              type: 'category',
              axisLine: {
                show: false
              },
              splitLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: '#43DDFF'
                }
              }},
            series: [
              {
                type: 'bar',
                encode: {
                  // Map the "amount" column to X axis.
                  x: 'name',
                  // Map the "product" column to Y axis
                  y: 'length'
                },
                label: {
                  normal: {
                    color:'#fff',
                    position: 'right',//['80%', '50%'],
                    show: true,
                    formatter: '{@name} km'
                  },
                  formatter: function(s,v){
                    console.log(s+''+v)
                  }
                },
                itemStyle: {
                  //柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
                  barBorderRadius: [0, 10, 10, 0]
                },
                barWidth :8
              }
            ]
          },
          high_speed_chart:null,
          isShowStatics:true,
          staticsIcon:conf.IMG.statics_png,
          activeNames:'',
          listData:[],
          tableLoading:false,
//          overviewOption:{
//            title : {
//              text: '统计总览',
//              subtext: '',
//              x:'center'
//            },
//            tooltip : {
//              trigger: 'item',
//              formatter: "{a} <br/>{b} : {c} ({d}%)"
//            },
//            legend: {
//              orient: 'vertical',
//              left: 'left',
//              data: ['高速','邮件营销','联盟广告','视频广告','搜索引擎']
//            },
//            series : [
//              {
//                name: '访问来源',
//                type: 'pie',
//                radius : '55%',
//                center: ['50%', '60%'],
//                data:[
//                  {value:335, name:'高速'},
//                  {value:310, name:'邮件营销'},
//                  {value:234, name:'联盟广告'},
//                  {value:135, name:'视频广告'},
//                  {value:1548, name:'搜索引擎'}
//                ],
//                itemStyle: {
//                  emphasis: {
//                    shadowBlur: 10,
//                    shadowOffsetX: 0,
//                    shadowColor: 'rgba(0, 0, 0, 0.5)'
//                  }
//                }
//              }
//            ]
//          }
          overviewOption:{
            color:['#eb7c22',
              '#3fad08',
              '#4d70c8',
              '#5742d6',
              '#b42121'],
            title : {
              text: '甘肃省公路地理信息分布统计',
              textStyle:{color:'white'},
              subtext: '',
              x:'center'
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
//            legend: {
//              textStyle:{color:'white'},
//              orient: 'vertical',
//              left: 'left',
//              data: ['高速','国道','省道','县道','乡道']
//            },
            series : [
              {
                name: '统计分析',
                type: 'pie',
                radius : '45%',
                center: ['48%', '60%'],
                data:[
                  {value:4704.6, name:'高速'},
                  {value:12934.67, name:'省道'},
                  {value:12925.6, name:'县道'},
                  {value:34461.81, name:'乡道'},
                  {value:12419.43, name:'国道'},
                ],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  },
                  normal: {
                    label: {
                      position: 'outer',
                      formatter: function (params) {
                        return params.name + ':' + params.percent + '%'
                      },
                      color: 'white',
                      fontSize: 14
                    },
                    labelLine: {
                      show: true
                    }
                  }
                }
              }
            ]
          }
        }
      },
      mounted() {
      },
      created(){

      },
      props:{'checkedTable':'','checkedType':'',checkedLayerName:'',flag:'',countEvent:''},
      watch: {
        'checkedTable':{
          immediate:false,
          handler:function(cVAL,oVAL){
            this.activeNames=[cVAL,'overview'];
          }
        },
//        flag:{
//          immediate:false,
//          handler:function(cVAL,oVAL){
//            this.delStatics(cVAL);
//          }
//        },
        countEvent:{
          immediate:false,
          handler:function(cVAL,oVAL){
            this.changeStatics(this.flag);
          }
        }
      },
      methods: {
        addOverview(){
            let _this=this;
          if(_this.overviewChart==undefined){
            this.tableLoading=true;
          conf.interf.GET_HIGHTSPEED_STATICS({}).then((response) => {
            if (response && response.status == 200) {
              let data = response.data;
              _this.tableLoading=false;
              if (data.errcode == 0) {
                data.data.high_length='4704.6km';
                _this.listData.push({
                  'high_length':'4704.6km',
                  'mileageNum':data.data.mileageNum+'个',
                  'serviceareaNum':data.data.serviceareaNum+'个',
                  'chargeNum':data.data.chargeNum+'个',
                });
                _this.listData.push({
                  'high_length':'分布密度',
                  'mileageNum':(Math.floor(data.data.mileageProportion * 100) / 100)+'km',
                  'serviceareaNum':(Math.floor(data.data.serviceareaProportion * 100) / 100)+'km',
                  'chargeNum':(Math.floor(data.data.chargeProportion * 100) / 100)+'km'
                })
              }else{
                _this.tableLoading=false;
                _this.$message({message: "请求失败", type: "error", duration: 1500});
              }
            }
          }).catch(e=>{
            _this.tableLoading=false;
            _this.$message({message: "请求失败", type: "error", duration: 1500});
          });
            setTimeout(function(){
              _this.overviewChart = _this.$echarts.init(document.getElementById('overviewDiv'));
              _this.overviewChart.setOption(_this.overviewOption);
              _this.overviewChart.hideLoading();
            },1000);
          }else{
              return;
          }

        },
        changeStatics(f){
            let _this=this,cVAL=this.checkedTable;
              if(f){
                _this.isMileage=false;
                _this.isNative=false;
                _this.isHighSpeed=false;
                this.$nextTick(() => {
                  if(cVAL && cVAL.indexOf('xwt_layer_mileage')!=-1){
                    _this.isMileage=true;
                  }else{
                    if(cVAL && cVAL.indexOf('xwt_layer_highspeed')!=-1) _this.isHighSpeed=true;
                    else {_this.isNative=true;}
                  };
                  if(cVAL!='') { //cVAL!=oVAL &&
//                    _this.dataStatics[cVAL] = {};
                    this.$nextTick(function(){
//                      _this.$set( _this.dataStatics, cVAL, {});
                      _this.showStatics();
                    });
                  }
                });
              }else{
                this.$delete(_this.dataStatics,this.checkedTable);
              }
          },
//          delStatics(cVAL){
//            if(!cVAL){
//              this.$delete(this.dataStatics,this.checkedTable);
//            };
//          },
//          changeStatics(cVAL){
//              let _this=this;
//            _this.isMileage=false;
//            _this.isNative=false;
//            _this.isHighSpeed=false;
//            this.$nextTick(() => {
//              if(cVAL && cVAL.indexOf('xwt_layer_mileage')!=-1){
//                _this.isMileage=true;
//              }else{
//                if(cVAL && cVAL.indexOf('xwt_layer_highspeed')!=-1) _this.isHighSpeed=true;
//                else {_this.isNative=true;}
//              };
//                if(this.flag){
//                    if(cVAL!='') { //cVAL!=oVAL &&
//                      _this.$set( _this.dataStatics, cVAL, {});
//                        _this.showStatics();
//                    }
//                }
//            });
//          },
        showStaticsDiv(){
           if(this.isShowStatics){
               document.getElementsByClassName('staticsIconCls')[0].classList.add('rotate');
           }else{
             document.getElementsByClassName('staticsIconCls')[0].classList.remove('rotate');
           };
           this.isShowStatics=!this.isShowStatics;
        },
        showStatics(){
          let that = this;
          that.statics.isShow=false;
          if(this.checkedTable.indexOf('xwt_layer_mileage')!=-1)
              that.showLoading=true;
          conf.interf.GET_STATICS_API({tablename: that.checkedTable}).then((response) => {
            if (response && response.status == 200) {
              let data = response.data;
              if (data.errcode == 0) {
                let dataStatics = data.data;
                if (dataStatics.length > 0) {
                  if (this.checkedTable.indexOf('xwt_layer_mileage')!=-1) {
                    that.showLoading=false;
                    that.option.legend.data = dataStatics.map(function (e) {
                      return e.name;
                    });
                    dataStatics.map(function (e) {
                      e.value = e.count;
                      e.company = '个';
                      return e;
                    });
                    let sumData=dataStatics.pop();//new Object();
//                    if(dataStatics.length>1){
//                      sumData=dataStatics.pop();
//                    } else{
//                      sumData=dataStatics[0];
//                    };
                    that.$set(that.dataStatics,that.checkedTable,{data:dataStatics,name:that.checkedLayerName,
                      count:sumData.count,company:sumData.company,isMileage:that.isMileage,
                      isHighSpeed:that.isHighSpeed,isNative:that.isNative});
                    that.option.series[0].data[0].value = dataStatics[dataStatics.length - 1].count;
                    that.option.series[1].data[0].value = dataStatics[dataStatics.length - 1].count;
                    that.option.series[2].data = dataStatics.slice(0, dataStatics.length);
                    that.option.series[2].name = that.checkedLayerName.replace('图层', '');
                    that.option.series[2].itemStyle.normal.color = function (params) {
                      //自定义颜色
                      var colorList = [
                        new that.$echarts.graphic.LinearGradient(1, 0, 0, 0,
                          [
                            {offset: 0, color: '#d0040a'},
                            {offset: 0.5, color: '#f43839'},
                            {offset: 1, color: '#f45e65'}
                          ]), new that.$echarts.graphic.LinearGradient(1, 0, 0, 0,
                          [
                            {offset: 0, color: '#d09804'},
                            {offset: 0.5, color: '#f4ce32'},
                            {offset: 1, color: '#f4f085'}
                          ]),new that.$echarts.graphic.LinearGradient(1, 0, 0, 0,
                          [
                            {offset: 0, color: '#26d7f4'},
                            {offset: 0.5, color: '#42f2f4'},
                            {offset: 1, color: '#79e9f4'}
                          ]), new that.$echarts.graphic.LinearGradient(1, 0, 0, 0,
                          [
                            {offset: 0, color: '#00e0ac'},
                            {offset: 0.5, color: '#01cc9c'},
                            {offset: 1, color: '#00bc8d'}
                          ]),
                        new that.$echarts.graphic.LinearGradient(1, 0, 0, 0,
                          [
                            {offset: 0, color: '#f5ab7b'},
                            {offset: 0.5, color: '#e37f63'},
                            {offset: 1, color: '#d55851'}
                          ]),
                        new that.$echarts.graphic.LinearGradient(1, 0, 0, 0,
                          [
                            {offset: 0, color: '#888cec'},
                            {offset: 0.5, color: '#7272f4'},
                            {offset: 1, color: '#5a43f4'}
                          ])
                      ];
                      return colorList[params.dataIndex]
                    };
//                document.getElementById('staticsDiv').addEventListener("resize", () => {
//                    that.pieChart = that.$echarts.init(document.getElementById('staticsDiv'));that.pieChart.setOption(that.option);
//                    that.pieChart.resize();
//                    that.pieChart.hideLoading();});
                    that.$nextTick(function(){
                      that.pieChart = that.$echarts.init(document.getElementById('staticsDiv'));that.pieChart.setOption(that.option);
                      document.getElementById('staticsDiv').addEventListener("resize", () => {
                        that.pieChart.resize();
                      });
                      that.pieChart.hideLoading();
                    })
//                    setTimeout(function(){
//                      that.pieChart = that.$echarts.init(document.getElementById('staticsDiv'));that.pieChart.setOption(that.option);
//                      document.getElementById('staticsDiv').addEventListener("resize", () => {
//                        that.pieChart.resize();
//                      });
//                      that.pieChart.hideLoading();},2000);
                  } else {
                    dataStatics = dataStatics.map(function (e) {
                      e.value = e.count;
                      if (('' + e.count).split('.')[1] && ('' + e.count).split('.')[1].length > 2) {
                        e.count = parseFloat(e.count).toFixed(2);
                      };
//                    e.kind=that.checkedType==2?'条':'个';
                      return e;
                    });
                    let sumData=dataStatics.pop();//new Object();
//                    if(dataStatics.length>1){
//                        sumData=dataStatics.pop();
//                    } else{
//                        sumData=dataStatics[0];
//                    };
                    that.$set(that.dataStatics, that.checkedTable, {data:dataStatics,name:that.checkedLayerName,
                      count:sumData.count,company:sumData.company,isMileage:that.isMileage,
                      isHighSpeed:that.isHighSpeed,isNative:that.isNative});
                  }
                } else {
//                  dataStatics = [{name: '', count: ''}];
                };
//                that.dataStatics.push([dataStatics]);
//                that.dataStatics[that.checkedTable]=dataStatics;
              } else {
//                that.dataStatics = dataStatics;
              }
            }
          });
          if(that.checkedTable.indexOf('xwt_layer_highspeed') != -1) {
            that.getHightSpeedTopFive();
            that.getHightSpeedSorts();
          };
          if(that.overviewChart==undefined){
            that.addOverview();
          }else{
            setTimeout(function(){
              document.getElementsByClassName('staticsDiv')[0].scrollTop = document.getElementsByClassName('staticsDiv')[0].scrollHeight;
            },1000);
          }
        },
        getHightSpeedTopFive(){
          let _this=this;
          _this.showLoading=true;
          conf.interf.GET_HIGH_SPEED_TOP({tablename: this.checkedTable, top:5}).then((response) => {
            if (response.status == 200) {
              let data = response.data;
              if (data.errcode == 0) {
                _this.hight_speed_option.dataset.source=[['name', 'length']];
                if(data.data && data.data.length>0){
                  _this.hight_speed_option.dataset.source.concat(data.data.reverse().map(e=>{
                    _this.hight_speed_option.dataset.source.push([parseFloat(e.length).toFixed(2),e.name]);
                  }));
                };
//                document.getElementById('hight_speed_chart_div').addEventListener("resize", () => {
//                  _this.high_speed_chart = that.$echarts.init(document.getElementById('hight_speed_chart_div'));
//                  _this.high_speed_chart.setOption(_this.option);
//                  _this.high_speed_chart.resize();
//                  _this.high_speed_chart.hideLoading();});
                setTimeout(function(){
                  _this.high_speed_chart = _this.$echarts.init(document.getElementById('hight_speed_chart_div'));
                  _this.high_speed_chart.setOption(_this.hight_speed_option);
                  _this.high_speed_chart.resize();
                  _this.high_speed_chart.hideLoading();
                  _this.showLoading=false;
                  },2000);

              }
            }
          });
        },
        getHightSpeedSorts(){
          let _this=this;
          conf.interf.GET_HIGH_SPEED_SORTS({}).then((response) => {
            if (response.status == 200) {
              let result = response.data;
              if (result.errcode == 0) {
                let data=result.data;
                let sum=data.DFlength+data.GGlength;
                _this.statics.contryHighSpeedPer=parseFloat((data.GGlength*100)/sum).toFixed(2);
                _this.statics.contryHighSpeed=data.GGnum;
                _this.statics.contryHighSpeedLength=parseFloat(data.GGlength).toFixed(2);
                _this.statics.otherHighSpeedLength= parseFloat(data.DFlength).toFixed(2);
                _this.statics.otherHighSpeedPer=parseFloat((data.DFlength*100)/sum).toFixed(2);
                _this.statics.otherHighSpeed=data.DFnum;
              }
            }
          })
        },
        showMeligeaDirectionSorts(data){
          this.statics.mileageSum=data.data.dataFirst.count;
          this.statics.mileageUpPer=parseFloat((data.data.dataFirst.countUp*100)/data.data.dataFirst.count).toFixed(2);
          this.statics.mileageUp=data.data.dataFirst.countUp;
          this.statics.mileageDownPer=parseFloat((data.data.dataFirst.countDown*100)/data.data.dataFirst.count).toFixed(2);
          this.statics.mileageDown=data.data.dataFirst.countDown;
          this.statics.mileageDoublePer=parseFloat((data.data.dataFirst.countNotApplication*100)/data.data.dataFirst.count).toFixed(2);
          this.statics.mileageDouble=data.data.dataFirst.countNotApplication;
          this.statics.isShow=true;
        },
        hideMeligeaDirectionSorts(){
          this.statics.isShow=false;
        }
      }
    }
</script>
<style scoped="true" lang="scss">
  .statics{
    position: fixed;
    right: 0.5%;
    top: 20%;
    width: auto;
    height: auto;z-index: 999;
  .staticsIconCls{top:20%;right:1%;float:left;transition: transform 1.2s;cursor: pointer;}
    .rotate{transform: rotate(180deg);}
  .staticsDiv,.overviewDiv{
    max-width: 380px;
    font-size: 1.04vw;
    border-radius: 6px;
    line-height: 2.8em;
    min-width: 14vw;
    float: right;
    max-height: 600px;
    overflow-y: auto;
  }
  }
  @media screen  and (width:1366px){
    .statics{
      top:21%;
    }
  }
 .box-card {
    height: auto;
    background: #024196;
    /*border-color: #00c6ff;*/
   border:none;
    color: #fff;
  }
  .chart{
    width: 318px;  height: auto;
  }
  #hight_speed_chart_div{width:100%;height:130px;width:302px;}
  #staticsDiv{
    width:100%;height:230px;
  }
  /*.fade-enter-active, .fade-leave-active {*/
    /*transition: opacity .5s*/
  /*}*/
  /*.fade-enter, .fade-leave-active {*/
    /*opacity: 0*/
  /*}*/
</style>
<style lang="scss">
  .statics .el-table,.statics .el-table--scrollable-x .el-table__body-wrapper {
    overflow: hidden;
  }
  .statics .el-table .cell {
    max-height: 23px;
    padding: 0;
    width: 75px;
    font-size: 0.7vw;
  }
  .statics .el-collapse{
    border:none;
    border-bottom: 3px solid #4da4f5;
  }
  .statics .el-collapse-item__wrap {
    border-bottom: none;
  }
  .statics .el-collapse-item__header{
    background: rgb(10, 47, 107);
    color: white;
    border-bottom: 1px solid #00c6ff;
    overflow: hidden;
  }
  .statics .el-collapse-item__content{padding: 0;    background: #024196;  border-color: #00c6ff;}
  .statics .el-collapse-item__header .el-collapse-item__arrow{transform: rotateZ(90deg);-webkit-transform: rotate(90deg);}
  .statics .el-collapse-item__arrow.is-active{    transform: rotateZ(-90deg);}
</style>
