<template>
  <div id="changechart" class="boxstyle" ></div>
</template>

<script>
// import rankchart from "./rankchart.vue";
import echarts from 'echarts'
export default {
    name:'changechart',
    components:{
      // rankchart
    },
    data(){
        return{
            changechart:null,
            options:{       
                title: {
                     text: '保有量变化趋势',
                     textStyle:{
                      width:'116px',
                      height:'16px',
                      fontSize:'16px',
                      fontFamily:'Source Han Sans CN',
                      fontWeight:'400',
                      color:'rgba(255,255,255,1)',
                     }
                },
                backgroundColor:"rgba(2,6,31,0)",
                xAxis: {
                  boundaryGap:false,
                  axisTick:{ 
                      show: false ,
                    },
                  axisLine:{
                    lineStyle:{
                        color:'rgba(255,255,255,1)',
                    //     width:'2px',
                      }
                  },
                  data:['xx','xx','xx','xx','xx','xx','xx','xx','xx','xx','xx','xx'],
                 },
                 yAxis:[
                   {
                     name:'数量（万）',
                     type:'value',
                     nameTextStyle:{
                        width:'58px',
                        height:'14px',
                        fontSize:'13px',
                        fontFamily:'Microsoft YaHei',
                        fontWeight:'400',
                        color:'rgba(255,255,255,1)',
                        } ,
                     axisLine:{
			                lineStyle:{
                        width:2,
                        color:'rgba(255,255,255,1)',
                      }
                     },
                     splitLine:{
			                show:false
                    },
                     axisTick:{
			                show:false
			               },
                   },
                    {
                     name:'较上月（%）',
                      type:'value',
                       nameTextStyle:{
                        width:'58px',
                        height:'14px',
                        fontSize:'13px',
                        fontFamily:'Microsoft YaHei',
                        fontWeight:'400',
                        color:'rgba(255,255,255,1)',
                        } ,
                      axisLine:{
			                lineStyle:{
                        width:2,
                        color:'rgba(255,255,255,1)',
                      }
                    },
                     splitLine:{
			                show:false
                    },
                     axisTick:{
			                show:false
			               },
                   },
                    
                 ],
                 series:[
                   {
                    name: 'ns_csiqcs',
                    type: 'line',
                    symbol: 'none', 
                    color:['#5a6782'], 
                    smooth:true,
                    areaStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          { offset: 0, color: "#030b29" },
                          { offset: 0.5, color: "#002651" },
                          { offset: 1, color: "#f0f0f0" }
                        ])
                      }
                    }, //填充区域样式
                    yAxisIndex: 1,
                    data:[100,200,300,400,411,662],                  
                    itemStyle:{
                     borderColor:'red',
                    },
                   },
                   {
                    name: 'ns_lbi',
                    type: 'line',
                     symbol: 'none', 
                     color:['#00437d'], 
                    smooth:true,
                    areaStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "#030b29" },
                        { offset: 0.5, color: "#2a4869" },
                        { offset: 1, color: "#00527b" }
                      ])
                    }
                  }, //填充区域样式
                    data:[0,200,362,555,411,522,232,155],
                     itemStyle:{
                      borderColor:'#B7C5D6',
                     }
                   }
                 ]
           
            },
        }
    },
    methods:{
    // getIndexData() {
    //   let that = this;
    // },
    // getchangechart(){
    //     this.changechart=document.getElementById('changechart')
    //     // console.log(changechart)
    //     this.changechart=echarts.init(this.changechart)

    //    },
    initSumCharts(){
      if(!this.changechart){
        this.changechart = echarts.init(document.getElementById('changechart'));
      };
      this.changechart.setOption(this.options);
    },
    },
    mounted() {
    this.initSumCharts();

  },
}
</script>

<style>
#changechart{
  position: fixed;
    width:474px;
    height:344px;
    margin-top: 45px;
    margin-bottom: 44px;
    }
</style>