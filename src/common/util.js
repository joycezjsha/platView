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
  }
};
