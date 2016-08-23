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