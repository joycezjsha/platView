<template>
  <div class="statics">
    <img :src="staticsIcon" class="staticsIconCls" @click="showStaticsDiv" />
    <transition name ="fade" mode="out-in">
      <div class="staticsDiv" v-show="isShowStatics">
        <el-card class="box-card" v-if="checkedTable.indexOf('xwt_layer_mileage')==-1 && checkedTable.indexOf('xwt_layer_highspeed')==-1">
          <div slot="header" class="clearfix" >
            <div style="text-align: right;margin-right:1vw;color:#43defd;float:left;min-width: 35%;">
              {{checkedLayerName.replace('图层','')+dataStatics[dataStatics.length-1].name}}
            </div>
            <div style="font-size: 1.87vw;float:left;text-align: right;">
              <span>{{dataStatics[dataStatics.length-1].count}}</span>&nbsp;<span style="font-size: 1vw;">{{dataStatics[dataStatics.length-1].company}}</span>
            </div>
          </div>
          <div v-for="o in dataStatics.slice(0,dataStatics.length-1)" class="text item" style="line-height: 3em;width:auto">
            <div style="float:left;text-align: right;margin-right:1vw;color:#43defd;min-width: 40%;">{{o.name}}<span style="font-size: 1vw;"></span></div>
            <div style="float:left;text-align: left;max-width: 40%;"><span>{{o.count}}</span>&nbsp;<span style="font-size: 1vw;">km</span></div>
          </div>
        </el-card>
        <el-card class="box-card chart" v-else-if="checkedTable.indexOf('xwt_layer_mileage')!=-1">
          <div slot="header" class="clearfix">
            <el-col :span="12" style="color:#43defd;">{{checkedLayerName.replace('图层','')+dataStatics[dataStatics.length-1].name}}</el-col>
            <el-col v-if="statics.isShow" :span="12" style="font-size: 1.87vw;text-align: right;min-width: 40%;"><span>{{statics.mileageSum}}</span>&nbsp;<span style="font-size: 1vw;">{{dataStatics[dataStatics.length-1].company}}</span></el-col>
            <el-col v-else :span="12" style="font-size: 1.87vw;text-align: right;min-width: 40%;"><span>{{dataStatics[dataStatics.length-1].count}}</span>&nbsp;<span style="font-size: 1vw;">{{dataStatics[dataStatics.length-1].company}}</span></el-col>
          </div>
          <div class="progress" v-show="statics.isShow">
            <ul>
              <li v-show="statics.mileageUp!=0" :style="'width:'+statics.mileageUpPer+'%'">上行</li><li v-show="statics.mileageDown!=0" :style="'width:'+statics.mileageDownPer+'%'">下行</li><li v-show="statics.mileageDouble!=0" :style="'width:'+statics.mileageDoublePer+'%'">双向</li>
            </ul>
            <ul>
              <li v-show="statics.mileageUp!=0" :style="'background:rgba(27, 105, 232, 1);border-radius: 6px 0 0 6px;width:'+statics.mileageUpPer+'%'"></li>
              <li v-show="statics.mileageDown!=0" :style="'background:rgba(72, 169, 106, 1);width:'+statics.mileageDownPer+'%'"></li>
              <li v-show="statics.mileageDouble!=0" :style="'background:rgba(3, 172, 253, 1);border-radius: 0 6px 6px 0;width:'+statics.mileageDoublePer+'%'"></li>
            </ul>
            <ul>
              <li v-show="statics.mileageUp!=0" :style="'width:'+statics.mileageUpPer+'%'">{{statics.mileageUp}}个</li><li v-show="statics.mileageDown!=0" :style="'width:'+statics.mileageDownPer+'%'">{{statics.mileageDown}}个</li><li v-show="statics.mileageDouble!=0" :style="'width:'+statics.mileageDoublePer+'%'">{{statics.mileageDouble}}个</li>
            </ul>
          </div>
          <div id="staticsDiv"></div>
        </el-card>
        <el-card class="box-card chart" v-show="checkedTable.indexOf('xwt_layer_highspeed')!=-1">
          <div slot="header" class="clearfix">
            <el-col :span="12" style="color:#43defd;">{{checkedLayerName.replace('图层','')+dataStatics[dataStatics.length-1].name}}</el-col>
            <el-col :span="12" style="font-size: 1.87vw;text-align: right;min-width: 40%;"><span>{{dataStatics[dataStatics.length-1].count}}</span>&nbsp;<span style="font-size: 1vw;">{{dataStatics[dataStatics.length-1].company}}</span></el-col>
          </div>
          <div class="progress">
            <ul>
              <li :style="'max-width:70%;width:'+statics.contryHighSpeedPer+'%'">国家高速</li><li :style="'min-width:30%;width:'+statics.otherHighSpeedPer+'%'">地方高速</li>
            </ul>
            <ul>
              <li :style="'border-radius: 6px 0 0 6px;background:#686FFF;border:none;width:'+statics.contryHighSpeedPer+'%'"></li><li :style="'border-radius:0 6px 6px 0;border:none;background-color:#0DA9AF;width:'+statics.otherHighSpeedPer+'%'"></li>
            </ul>
            <ul>
              <li :style="'max-width:70%;width:'+statics.contryHighSpeedPer+'%'">{{statics.contryHighSpeed}}({{statics.contryHighSpeedLength}}km)</li><li :style="'min-width:30%;width:'+statics.otherHighSpeedPer+'%'">{{statics.otherHighSpeed}}({{statics.otherHighSpeedLength}}km)</li>
            </ul>
          </div>
          <div v-for="o in dataStatics.slice(0,dataStatics.length-1)" class="text item" style="line-height: 3em;height: 3em;width:auto;border-bottom: 1px solid #7DB4FF">
            <div style="float:left;text-align: left;color:#43defd;width: 40%;">{{o.name}}<span style="font-size: 1vw;"></span></div>
            <div style="float:left;text-align: right;width: 60%;font-size: 20px;"><span>{{o.count}}</span>&nbsp;<span style="font-size: 1vw;">km</span></div>
          </div>
          <div id="hight_speed_chart_div"></div>
        </el-card>
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
          token:sessionStorage.getItem("token"),
          dataStatics: [
            {name: '', count: '', kind: ''}
          ],
          showLoading:true,
          option: {
            color: 'white',
            textStyle: {
              fontFamily: 'DroidSansFont',
            },
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
                radius: [25, 75],
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
              right: '20%',
              bottom: '10%',containLabel: true},
            xAxis: {
              name: 'amount',
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
          staticsIcon:conf.IMG.statics_png
        }
      },
      mounted() {
//          this.initPopup();
      },
      props:{'checkedTable':'','checkedType':'',checkedLayerName:''},
      watch: {
        'checkedTable':{
          immediate:true,
          handler:function(cVAL,oVAL){
            this.showStatics();
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
        showStatics(){
          let that = this;
          that.statics.isShow=false;
          if(this.checkedTable.indexOf('xwt_layer_mileage')!=-1) that.showLoading=true;
//          that.dataStatics=[
//            {name:'',count:'',kind:''}
//          ];
//          document.getElementsByClassName('chart')[0].addEventListener("resize", () => {
//            this.pieChart.resize();
//          });
//          this.$axios.get(conf.interf.getStatics, {params: {}}).then(response => {
          conf.interf.GET_STATICS_API({tablename: that.checkedTable}).then((response) => {
            if (response.status == 200) {
              let data = response.data;
              if (data.errcode == 0) {
                let dataStatics = data.data;
                if (dataStatics.length > 0) {
                  if (this.checkedTable.indexOf('xwt_layer_mileage')!=-1) {
                    that.showLoading=false;
                    that.pieChart = that.$echarts.init(document.getElementById('staticsDiv'));
                    that.option.legend.data = dataStatics.map(function (e) {
                      return e.name;
                    });
                    dataStatics.map(function (e) {
                      e.value = e.count;
                      e.company = '个';
                      return e;
                    });
                    that.option.series[0].data[0].value = dataStatics[dataStatics.length - 1].count;
                    that.option.series[1].data[0].value = dataStatics[dataStatics.length - 1].count;
                    that.option.series[2].data = dataStatics.slice(0, dataStatics.length - 1);
                    that.option.series[2].name = that.checkedLayerName.replace('图层', '');
                    that.option.series[2].itemStyle.normal.color = function (params) {
                      //自定义颜色
                      var colorList = [
                        new that.$echarts.graphic.LinearGradient(1, 0, 0, 0,
                          [
                            {offset: 0, color: '#0b84f4'},
                            {offset: 0.5, color: '#16a0f3'},
                            {offset: 1, color: '#23b4ec'}
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
                    }
                    that.pieChart.setOption(that.option);
                    that.pieChart.resize();
                    that.pieChart.hideLoading();
                  } else {
                    dataStatics = dataStatics.map(function (e) {
                      e.value = e.count;
                      if (('' + e.count).split('.')[1] && ('' + e.count).split('.')[1].length > 2) {
                        e.count = parseFloat(e.count).toFixed(2);
                      }
                      ;
//                    e.kind=that.checkedType==2?'条':'个';
                      return e;
                    });
                  }
                } else {
                  dataStatics = [{name: '', count: ''}];
                }
                ;
                that.dataStatics = dataStatics;
              } else {
                that.dataStatics = [{name: '', count: ''}];
              }
            }
          });
          if(that.checkedTable.indexOf('xwt_layer_highspeed') != -1) {
            that.getHightSpeedTopFive();
            that.getHightSpeedSorts();
          };
        },
        getHightSpeedTopFive(){
          let _this=this;
          _this.high_speed_chart = _this.$echarts.init(document.getElementById('hight_speed_chart_div'));
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
                _this.high_speed_chart.setOption(_this.hight_speed_option);
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
    right: 1%;
    top: 20%;
    width: auto;
    height: auto;
  .staticsIconCls{top:20%;right:1%;float:left;transition: transform 1.2s;cursor: pointer;}
    .rotate{transform: rotate(180deg);}
  .staticsDiv{
    max-width: 380px;
    font-size: 1.04vw;
    border-radius: 5%;
    line-height: 2.8em;
    min-width: 14vw;
    float:right;
  }
  }
 .box-card {
    height: auto;
    background: #024196;
    border-color: #00c6ff;
    color: #fff;
  }
  .chart{
    width: 308px;  height: auto;
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
