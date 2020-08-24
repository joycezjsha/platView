/**
 * Created by ThinkPad on 2019/4/10.
 */
import http from '../../common/httpUtil'
import playImg from './image/cruise-play.png'
import stopImg from './image/cruise-stop.png'
import close_img from './image/close.png'
import close_hover_img from './image/close_hover.png'
import INTERSECTION_ESWN_ICON from './image/icon-e-s-w-n.png'
import DINGWEI_ICON from './image/icon-dingwei.png'
import NO_ICON from './image/no.png'
import INTERSECTION_IMG_ICON from './image/intersectionMax.png'
import INTERSECTION_MARKER_ICON from './image/icon-intersection-1.png'
import INTERSECTION_IMG_ICON1 from './image/intersectionMax1.png'
import INTERSECTION_ARROW_ROAD from './image/icon-12-arrow-road.png'
import INTERSECTION_STRIGHT from './image/straight.png'
import INTERSECTION_LEFT from './image/left.png'
import INTERSECTION_RIGHT from './image/right.png'
import INTERSECTION_STRIGHT_L from './image/straight_l.png'
import INTERSECTION_STRIGHT_R from './image/straight_r.png'
import INTERSECTION_MARKER_ICON_3 from './image/icon-intersection-3.png'


export const interf={
  // 设备查询 设备类型分析
  GET_QUERY_API:data=> {
    return http.service({
      url:`Device/getDevStatistics`,
      method:'get',
      params:data
    })
  }
}
export const IMG={
  /*路况巡航*/
  CRUISE_IMG_PLAY: playImg,
  CRUISE_IMG_STOP:stopImg,
  CLOSE_ICON:close_img,
  CLOSE_HOVER_IMG:close_hover_img,
  INTERSECTION_ESWN_ICON:INTERSECTION_ESWN_ICON,
  INTERSECTION_DINGWEI_ICON:DINGWEI_ICON,
  NO_ICON:NO_ICON,
  INTERSECTION_IMG_ICON:INTERSECTION_IMG_ICON,
  INTERSECTION_MARKER_ICON:INTERSECTION_MARKER_ICON,
  INTERSECTION_IMG_ICON1:INTERSECTION_IMG_ICON1,
  INTERSECTION_ARROW_ROAD:INTERSECTION_ARROW_ROAD,
  INTERSECTION_STRIGHT:INTERSECTION_STRIGHT,
  INTERSECTION_LEFT:INTERSECTION_LEFT,
  INTERSECTION_RIGHT:INTERSECTION_RIGHT,
  INTERSECTION_STRIGHT_L:INTERSECTION_STRIGHT_L,
  INTERSECTION_STRIGHT_R:INTERSECTION_STRIGHT_R,
  INTERSECTION_MARKER_ICON_3:INTERSECTION_MARKER_ICON_3
}
