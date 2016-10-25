require('es6-promise');
require('isomorphic-fetch');

const config = require('../config');
const getUrlParam = require('./common-helper').getUrlParam;
const wxClient = require('wechat-jssdk/client');

let wxAuthInfo = null;
const initWXAuthInfo = (callback) => {
  if (wxAuthInfo) {
    return;
  }

  const url = encodeURIComponent(location.href);
  const shopId = getUrlParam('shopId');
  fetch(`${config.getWXAuthInfoAPI}?shopId=${shopId}&reqUrl=${url}`, config.requestOptions)
    .then(res => {
      if (!res.ok) {
        throw new Error('获取信息失败...');
      }
      return res.json();
    })
    .then(result => {
      wxAuthInfo = result.data || {};
      callback();
    })
    .catch(err => {
      wxAuthInfo = {};
      throw new Error(err);
    });
};

const callWxClientMethod = (apiName, args) => {
  initWXAuthInfo(() => {
    const _wxClient = wxClient(Object.assign({
      debug: false,
      appId: wxAuthInfo.appid,
      timestamp: 0,
      nonceStr: wxAuthInfo.noncestr,
      signature: '',
      success: suc => {
        const { wx } = _wxClient;
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
    }, wxAuthInfo));
  });
};

exports.callWxClientMethod = (name, args) => callWxClientMethod(name, args);
