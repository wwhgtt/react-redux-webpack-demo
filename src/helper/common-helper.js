const padStart = require('lodash.padstart');

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

/* 日期 */
exports.dateUtility = {
  format(date, formatStr = 'yyyy-MM-dd') {
    if (!date) {
      return date;
    }

    if (typeof date === 'string') {
      date = this.parse(date);
    }
    if (!(date instanceof Date)) {
      return date;
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const result = formatStr.replace(/yyyy/, year.toString())
      .replace(/(M+)/, (str, $1) => padStart(month.toString(), $1.length, '0'))
      .replace(/(d+)/, (str, $1) => padStart(date.getDate().toString(), $1.length, '0'))
      .replace(/(H+)/, (str, $1) => padStart(hours.toString(), $1.length, '0'))
      .replace(/(m+)/, (str, $1) => padStart(minutes.toString(), $1.length, '0'))
      .replace(/(s+)/, (str, $1) => padStart(seconds.toString(), $1.length, '0'));
    return result;
  },
  parse(str) {
    if (!str || typeof str !== 'string') {
      return str;
    }

    const [datePart, timePart = '00:00:00'] = str.split(/\s+/);
    const [year, month = 1, day = 1] = datePart.split(/\D+/);
    if (!year) {
      return null;
    }

    const [hours = 0, minutes = 0, seconds = 0] = timePart.split(/\D+/);
    const result = new Date(year, month - 1, day, hours, minutes, seconds);
    return isNaN(+result) ? null : result;
  },
};

