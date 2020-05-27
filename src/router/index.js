/**
 * Created by yqr on 2018/3/26.
 */
import Vue from 'vue'
import Router from 'vue-router'
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
import vehicleownership from '@/views/vehicleownership/vehicleownership.vue'
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
          path: '/main/car-flow', //车辆流量 
          name: 'carFlow',
          components: {
            default: carFlow
          }
        },
        {
          path: '/main/vehicleownership', //巡航
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
          path: '/main/measurement',//ETC龙门架数量
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
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/login')) {
    sessionStorage.removeItem('token')
    next()
  } else {
    if(to.path.startsWith(to.path)){
      next()
    }else{
      let user = sessionStorage.getItem('token')
      if (!user) {
        next({path: '/login'})
      } else {
        next()
      }
    };
  }
});
export default router
