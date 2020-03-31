/**
 * Created by joyce on 2019/4/11.
 */
import connect from '../../common/httpUtil'
import zooom_out from './images/icon_zoom_out.png'
import zooom_in from './images/icon_zoom_in.png'
import icon_compass_bg from './images/icon_map_compass_bg.png'
import icon_compass from './images/icon_map_compass.png'
import icon_pitch2d from './images/icon_pitch_2d.png'
import icon_pitch3d from './images/icon_pitch_3d.png'
import icon_traffic from './images/icon_map_ctrl_traffic_show.png'
import icon_traffic_hide from './images/icon_map_ctrl_traffic_hide.png'
const conf={
  interf:{
    TRAFFIC_API:(url,data)=>{
      return connect.service({
        url:url,//${urlConf.BASE_URL}
        method:'get',
        params:data
      })}
  },
  IMG: {
    iconZoomOut: zooom_out,
    iconZoomIn: zooom_in,
    iconCompassBG: icon_compass_bg,
    iconCompass:icon_compass,
    iconPitch2d:icon_pitch2d,
    iconPitch3d:icon_pitch3d,
    iconTraffic:icon_traffic,
    icon_traffic_hide:icon_traffic_hide
  }
}
export default conf;
