/**
 * Created by joyce on 2019/4/25.
 */
import service from  './httpUtil.js'
var TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;

export default{
  checkTel: {
    validateTel: function(tel){
      if(TEL_REGEXP.test(tel)){
        return true;
      }
      return false;
    }
  },
  // 当前时间的全局变量
  getTimeZone:function(){
    let newDate=new Date();
    let currentYear = newDate.getFullYear();
    let currentMonth = newDate.getMonth()+1;
    let currentdate = newDate.getDate();
    if(currentYear == 2019 && currentMonth == 2 && (4<=currentdate&&currentdate<=19)) {
      return true;
    } else {      return false;
    }
  },
  //补全所有10个支队
  initAreaDatas:function(data,flag){ //flag:0->NAME:城市 1->city:城市名称
    let newData=data;
    let areaList=['西安','榆林','宝鸡','商洛','咸阳','延安','汉中','铜川','安康','渭南'];
    if(flag){
      for(let i=0;i<areaList.length;i++){
        let f=true,index='';
        for(let j=0;j<data.length;j++){
          if(!data[j].city) continue;
          if(data[j].city==areaList[i] || data[j].city.indexOf(areaList[i])!=-1){
            f=false;
            index=i;
            break;
          }
        }
        if(f){
          newData.push({city:areaList[i]+'支队',NUM:'0'});
        }
      }
    }else{
      for(let i=0;i<areaList.length;i++){
        let f=true,index='';
        for(let j=0;j<data.length;j++){
          if(data[j].NAME==areaList[i] || data[j].NAME.indexOf(areaList[i])!=-1){
            f=false;
            index=i;
            break;
          }
        }
        if(f){
          newData.push({NAME:areaList[i]+'支队',NUM:'0'});
        }
      }
    }
    
    return newData;
  },
  //时间戳获取
  getTimeStr(date){
    function addZero(t){
      if(t>9) return t;
      else return '0'+t;
    }
    return date.getFullYear()+'-'+addZero(date.getMonth()+1)+'-'+addZero(date.getDate())+' '+addZero(date.getHours())+':'+addZero(date.getMinutes())+':'+addZero(date.getSeconds());
  }
};
