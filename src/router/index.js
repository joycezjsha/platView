/**
 * Created by yqr on 2018/3/26.
 */
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Home from '@/views/home.vue'
import cruise from '@/views/traffic-detection/TCruise'
import overview from '@/views/overview/overViewIndex.vue'
import carFlow from '@/views/carFlow/carFlowIndex.vue'
import trafficIndex from '@/views/trafficIndex/trafficIndex.vue'
import accidentDistribution from '@/views/accidentDistribution/AccidentDistribution.vue'
import vehiclePopulation from '@/views/vehiclePopulation/vehiclePopulationIndex.vue'
import accidentMonitor from '@/views/accidentMonitor/accidentMonitorIndex.vue'
import IllegalDistribution from '@/views/IllegalDistribution/IllegalDistributionIndex.vue'
import deviceMonitor from '@/views/deviceMonitor/deviceMonitorIndex.vue'
import electricPolice from '@/views/electricPolice/electricPoliceIndex.vue'
import bayonet from '@/views/bayonet/bayonetIndex.vue'
import etc from '@/views/ETCquality/ETCqualityIndex.vue'
import measurement from '@/views/speedMeasurement/speedMeasurementIndex.vue'
import user from '@/views/userManager/userManage.vue'
import userAdd from '@/views/userManager/userAdd.vue'
import vehicleownership from '@/views/vehicleownership/vehicleownership.vue'
import induction from '@/views/induction/induction'
import Epidemic from '@/views/EpidemicConnect.vue'
import vehicleWarning from '@/views/vehicleWarning/vehicleWarningIndex.vue'
import overSpeed from '@/views/overSpeed/overSpeedIndex.vue'
import IntersectionEvaluation from '@/views/IntersectionEvaluation/IntersectionEvaluation.vue'
// 懒加载方式，当路由被访问的时候才加载对应组件       
const Login = resolve => require(['@/views/Login/Login'], resolve)

Vue.use(Router)

const router = new Router({
  routes: [
    {path: '/', redirect: '/overview'},
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/overview',
      name: 'overview',
      component: overview
    },
    {
      path: '/accident',
      name: 'Home',
      component: Home,
      redirect: '/accident/monitor',//设置默认指向的路径
      children: [
        {
          path: '/accident/monitor',//警情监测
          name: 'accidentMonitor',
          components: {
            default: accidentMonitor
          }
        },
        {
          path: '/main/cruise', //巡航 
          name: 'cruise',
          components: {
            default: cruise
          }
        },
        {
          path: '/main/induction', //诱导简图
          name: 'induction',
          components: {
            default: induction
          }
        },
        {
          path: '/main/car-flow', //车辆流量 
          name: 'carFlow',
          components: {
            default: carFlow
          }
        },
        {
          path: '/main/vehicleownership', //车辆保有量
          name: 'vehicleownership',
          components: {
            default: vehicleownership
          }
        },
        {
          path: '/main/traffic-index', //交通拥堵
          name: 'trafficIndex',
          components: {
            default: trafficIndex
          }
        },
        {
          path: '/main/Intersection', //路口均衡指数
          name: 'Intersection',
          components: {
            default: IntersectionEvaluation
          }
        },
        {
          path: '/main/accident-distribution', //事故分析
          name: 'accidentDistribution',
          components: {
            default: accidentDistribution
          }
        },
        {
          path: '/main/vehicle-population',//重点车辆
          name: 'vehiclePopulation',
          components: {
            default: vehiclePopulation
          }
        },
        {
          path: '/main/vehicle-warning',//重点车辆
          name: 'vehicleWarning',
          components: {
            default: vehicleWarning
          }
        },
        {
          path: '/main/illegal-distribution',//违法分析
          name: 'vehiclePopulation',
          components: {
            default: IllegalDistribution
          }
        },
        {
          path: '/main/device-monitor',//设备监测
          name: 'deviceMonitor',
          components: {
            default: deviceMonitor
          }
        },
        {
          path: '/main/electric-police',//活跃电警
          name: 'electricPolice',
          components: {
            default: electricPolice
          }
        },
        {
          path: '/main/bayonet',//卡口监测
          name: 'bayonet',
          components: {
            default: bayonet
          }
        },
        {
          path: '/main/etc',//ETC龙门架数量
          name: 'etc',
          components: {
            default: etc
          }
        },
        {
          path: '/main/measurement',//区间测速
          name: 'measurement',
          components: {
            default: measurement
          }
        },
        {
          path: '/main/user',//用户管理
          name: 'user',
          components: {
            default: user
          }
        },
        {
          path: '/main/over-speed',//超速
          name: 'overSpeed',
          components: {
            default: overSpeed
          }
        },
        {
          path: '/main/useradd',//用户账号新增
          name: 'useradd',
          components: {
            default: userAdd
          }
        },
      ]
    },
    {
      path: '/epidemic', 
      name: 'epidemic',
      component: Epidemic
    },
    
  ]
})
router.beforeEach((to, from, next) => {
  if(store.state.map){
    let _layers=store.state.map.__layersList;
    let _markers=store.state.map.__markerList;
    let _sources=store.state.map.__sourceList;
    let s=_sources.length;
    if(s>0){
      _sources.forEach(e=>{
        if(store.state.map.getSource(e)!=undefined){
          store.state.map.removeSource(e);
        }
      })
    };
    if(_layers.length>0){
      _layers.forEach(e=>{
        if(store.state.map.getLayer(e)!=undefined){
          store.state.map.removeLayer(e);
        }
      })
    };
    let l=_markers.length;
    if(l>0){
      for(let i=0;i<l;i++){
        if(_markers.length<l){
          l=_markers.length;
          i=0;
        }
        _markers[i].remove();
      }
      // _markers.forEach(e=>{
      //   e.remove();
      // })
    }
  }
  
  if (to.path.startsWith('/login')) {
    sessionStorage.removeItem('token')
    return next()
  }else{
    if(to.path.startsWith(to.path)){
      return next();
    }else{
      let user = sessionStorage.getItem('token')
      if (!user) return next({path: '/login'})
      next()
    };
  }
  
});

export default router
