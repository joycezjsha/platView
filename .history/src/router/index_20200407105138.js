/**
 * Created by yqr on 2018/3/26.
 */
import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home.vue'
import MapCtrl from '@/views/map/MapCtrl'
import cruise from '@/views/traffic-detection/TCruise'
import overview from '@/views/overview/overViewIndex.vue'
import carFlow from '@/views/carFlow/carFlowIndex.vue'
import trafficIndex from '@/views/trafficIndex/trafficIndex.vue'
import accidentDistribution from '@/views/accidentDistribution/AccidentDistribution.vue'
import vehiclePopulation from '@/views/vehiclePopulation/vehiclePopulationIndex.vue'
import accidentMonitor from '@/views/accidentMonitor/accidentMonitorIndex.vue'

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
      path: '/main',
      name: 'Home',
      component: Home,
      redirect: '/accident/monitor',//设置默认指向的路径
      children: [
        {
          path: '/accident/monitor',
          name: 'accidentMonitor',
          components: {
            default: accidentMonitor
          }
        },
        {
          path: '/main/cruise',
          name: 'cruise',
          components: {
            default: cruise
          }
        },
        {
          path: '/main/car-flow',
          name: 'carFlow',
          components: {
            default: carFlow
          }
        },
        {
          path: '/main/traffic-index',
          name: 'trafficIndex',
          components: {
            default: trafficIndex
          }
        },
        {
          path: '/main/accident-distribution',
          name: 'accidentDistribution',
          components: {
            default: accidentDistribution
          }
        },
        {
          path: '/main/vehicle-population',
          name: 'vehiclePopulation',
          components: {
            default: vehiclePopulation
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
