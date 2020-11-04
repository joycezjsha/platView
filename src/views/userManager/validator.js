/**
 * 校验帮助策略类类
 **/

const strategies = {
  isNonEmpty: function (value, errorMsg) {
    if (!value || value == "") {
      return errorMsg;// + this.value;
    }
  },
  minLenght: function (value, length, errorMsg) {
    if (value.length < length) {
      return errorMsg;
    }
  },
  maxLength: function (value, length, errorMsg) {
    if (value.length > length) {
      return errorMsg;
    }
  },
  isMobile: function (value, errorMsg) {
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
      return errorMsg;
    }
  },
  isTrue:function(value,errorMsg){
    if(!value){
      return errorMsg;
    }
  },
  checkChinese:function(value,errorMsg){
    if(/[\u4E00-\u9FA5]/g.test(value)){
      return errorMsg;
    }
  },
  isStrong:function(value,errorMsg){
    if(!/^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[_\-@&=.#$%*!~?><|])[a-zA-Z0-9_\-@&=.#$%*!~?><|]+$/.test(value)){
      return errorMsg;
    }
  }
};
//校验器
let Validator = function () {
  this.cache = [];
};
Validator.prototype.add = function (value, rule, errorMsg) {
  let arry = rule.split(':');
  this.cache.push(function () {
    let strategy = arry.shift();
    arry.unshift(value);
    arry.push(errorMsg);
    return strategies[strategy].apply(value, arry);
  });
  return this;
};
Validator.prototype.start = function (callback) {
  for (let i = 0, validatorFunc; validatorFunc = this.cache[i++];) {// 开始校验,并取得校验后的返回信息
    let msg = validatorFunc();
    if (msg) {// 如果有确切的返回值,说明校验没有通过
      return msg;
    }
  }
};
export {Validator}
