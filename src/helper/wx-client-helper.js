require('es6-promise');
require('isomorphic-fetch');

const config = require('../config');
const getUrlParam = require('./common-helper').getUrlParam;
const wxClient = require('wechat-jssdk/client');

let wxAuthInfo = null;
const fetchWXAuthInfo = () => {
  if (wxAuthInfo) {
    return new Promise((resolve, reject) => {
      resolve(wxAuthInfo);
    });
  }

  const url = encodeURIComponent(location.href.split('#').shift());
  const shopId = getUrlParam('shopId');
  return fetch(`${config.getWXAuthInfoAPI}?shopId=${shopId}&reqUrl=${url}`, config.requestOptions)
    .then(res => {
      if (!res.ok) {
        throw new Error('获取信息失败...');
      }
      return res.json();
    })
    .then(result => result.data || {})
    .catch(err => {
      wxAuthInfo = {};
      throw new Error(err);
    });
};

const callWxClientMethod = (apiName, args) => {
  fetchWXAuthInfo()
    .then(authInfo => {
      const _wxClient = wxClient(Object.assign({
        debug: false,
        appId: authInfo.appid,
        timestamp: 0,
        nonceStr: authInfo.noncestr,
        signature: '',
        success: suc => {
          const wx = _wxClient.wx || window.wx;
          if (wx[apiName]) {
            wx[apiName](args);
          }
        },
        error: err => {
          if (args.error) {
            args.error(err);
          }
        },
        jsApiList: [
          apiName,
        ],
      }, authInfo));
    });
};

exports.callWxClientMethod = (name, args) => callWxClientMethod(name, args);
