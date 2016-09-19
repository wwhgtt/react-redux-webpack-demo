// const config = require('../config');

exports.getFetchPostParam = params => {
  let str = '';
  let i = '';
  for (i in params) {
    if (params[i]) {
      str += `${i}=${params[i]}&`;
    }
  }
  str = str.substring(0, str.length - 1);
  return { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: str };
};
// 获取url参数
exports.getUrlParam = param => {
  const reg = new RegExp(`(^|&)${param}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.replace(/\?/g, '&').substr(1).match(reg);
  if (r != null) {
    return (r[2]);
  }
  return null;
};
// 设置cookie
exports.setCookie = (name, value) => {
  const Days = 30;
  const exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${exp.toGMTString()};path=/`;
};
// 获取cookie
const getCookie = exports.getCookie = name => {
  const con = document.cookie.match(new RegExp(`(^| )${name}=([^;]*)(;|$)`));
  return con != null ? decodeURI(unescape(con[2], 'utf-8')) : null;
};
// 删除cookie
exports.delCookie = name => {
  const exp = new Date;
  exp.setTime(exp.getTime() - 1);
  const nameT = getCookie(name);
  if (nameT != null) {
    document.cookie = `${name}=${nameT};expires=${exp.toGMTString()};path=/`;
  }
};
// 校验手机号
exports.phoneNumber = (phone) => {
  const rule = /(^1([358][0-9]{9})|^1([7][3678][0-9]{8})|^1([4][57][0-9]{8})|(^09[0-9]{8}))$/;
  return rule.test(phone);
};
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

exports.replaceEmojiWith = (value, str) => {
  if (!value || typeof value !== 'string') {
    return value;
  }
  return value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, str || '');
};

exports.getWeixinVersionInfo = () => {
  const result = { weixin: false, version: 0 };
  const match = /micromessenger\/([\d.]+)/i.exec(navigator.userAgent);
  if (match) {
    result.weixin = true;
    result.version = match[1];
  }
  return result;
};

exports.interValSetting = (num, timerEnd) => {
  let cnum = num;
  const timer = setInterval(() => {
    cnum = cnum - 1;
    if (cnum === 0) {
      timerEnd();
      clearInterval(timer);
    }
  }, 1000);
};
