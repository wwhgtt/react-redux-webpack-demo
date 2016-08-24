const config = require('../config');

exports.fetchPost = (params) => {
	let str="";
	for(let i in params){
		str+=i+"="+params[i]+"&";
	}	
	str=str.substring(0,str.length-1);
	return {method: "POST",headers: {"Content-Type": "application/x-www-form-urlencoded"},body: str}
}
//设置cookie
const setCookie = exports.setCookie = function (name, value) {
  const Days = 30;
  const exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${exp.toGMTString()};path=/`;
};
//获取cookie
const getCookie=exports.getCookie=function(name){
	var b = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	return null != b ? decodeURI(unescape(b[2], "utf-8")) : null
}

//删除cookie
const delCookie=exports.delCookie=function(name){
	var b = new Date;
	b.setTime(b.getTime() - 1);
	var c = getCookie(name);
	null != c && (document.cookie = name + "=" + c + ";expires=" + b.toGMTString() + "; path=/")
}

//校验手机号
const phoneNumber=exports.phoneNumber=function(phone){
	var rule=/(^1([358][0-9]{9})|([7][3678][0-9]{8})|([4][57][0-9]{8})|(^09[0-9]{8}))$/;
	return rule.test(phone);
}

exports.getCurrentPosition = (success, error, config) => {
  const defaultConfig = {
    enableHighAccuracy: true,
    timeout: 2000,
    maximumAge: 1000 * 10,
  };
  navigator.geolocation.getCurrentPosition(pos => {
    if (success) {
      success(pos.coords);
    }
  }, err => {
    if (error) {
      error(err);
    }
  }, Object.assign({}, defaultConfig, config));
};

const replaceEmojiWith = exports.replaceEmojiWith = (value, str) => {
  if (!value || typeof value !== 'string') {
    return value;
  }
  return value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, str || '');
};

// 校验收货地址信息
exports.validateAddressInfo = (info, isTakeaway, filter) => {
  const rules = {
    name: [
      { msg: '请输入姓名', validate(value) { return !!replaceEmojiWith(value.trim(), ''); } },
    ],
    sex: [
      { msg: '请选择性别', validate(value) {
        const gender = +value;
        return gender === 1 || gender === 0;
      } },
    ],
    mobile: [
      { msg: '请输入手机号', validate(value) { return !!value.trim(); } },
      { msg: '请录入正确的手机号', validate(value) { return /^1[34578]\d{9}$/.test(value); } },
    ],
  };

  if (isTakeaway) {
    Object.assign(rules, {
      baseAddress: [
        { msg: '请输入收货地址', validate(value) { return !!value.trim(); } },
      ],
      street: [
        { msg: '请输入门牌信息', validate(value) { return !!replaceEmojiWith(value.trim(), ''); } },
      ],
    });
  }
  for (const key in rules) {
    if (!rules.hasOwnProperty(key)) {
      continue;
    }
    if (filter && filter(key)) {
      continue;
    }
    const rule = rules[key];
    let value = info[key];
    if (typeof value !== 'number') {
      value = value || '';
    }
    for (let i = 0, len = rule.length; i < len; i++) {
      const item = rule[i];
      const valid = item.validate(value);
      if (!valid) {
        return { valid: false, msg: item.msg };
      }
    }
  }
  return { valid: true, msg: '' };
};

