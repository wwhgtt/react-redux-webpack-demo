require('es6-promise');
require('isomorphic-fetch');
const config = require('../../config');
const createAction = require('redux-actions').createAction;

const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setPayProps = createAction('SET_PAY_PROPS', props => props);

const getUrlParam = require('../../helper/common-helper.js').getUrlParam;
const shopId = getUrlParam('shopId');

const wxClient = require('wechat-jssdk/client');

exports.fetchPayDetail = () => (dispatch, getState) =>
  fetch(`${config.getPayDetailAPI}?shopId=${shopId}&orderType=${getUrlParam('orderType')}&orderId=${getUrlParam('orderId')}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取支付信息失败'));
        return false;
      }
      return res.json();
    }).
    then(res => {
      if (String(res.code) === '200') {
        dispatch(setPayProps(res.data));
      } else {
        dispatch(setErrorMsg('获取支付信息失败'));
      }
    }).
    catch(err => {
      console.log(err);
    });

exports.setPayDetail = (payString, price) => (dispatch, getState) => {
  const requestDataString = `?shopId=${shopId}&orderId=${getUrlParam('orderId')}&price=${price}`;
  if (payString === 'baidu') {
    fetch(`${config.baiduPayAPI}${requestDataString}`, config.requestOptions).
      then(res => {
        if (!res.ok) {
          dispatch(setErrorMsg('支付失败，请稍后重试'));
          return false;
        }
        return res.json();
      }).
      then(res => {
        if (String(res.code) === '200') {
          location.href = res.data.url;
        } else {
          dispatch(setErrorMsg('支付失败，请稍后重试'));
        }
      }).
      catch(err => {
        console.log(err);
      });
  } else if (payString === 'weixin') {
    fetch(`${config.weixinPayAPI}${requestDataString}`, config.requestOptions).
      then(res => {
        if (!res.ok) {
          dispatch(setErrorMsg('支付失败，请稍后重试'));
          return false;
        }
        return res.json();
      }).
      then(res => {
        if (String(res.code) === '200') {
          const weChat = wxClient({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appId, // 必填，公众号的唯一标识
            timestamp: res.data.timeStamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature:res.data.paySign, // 必填，签名，见附录1
            jsApiList: ['chooseWXPay'],
            success() {
              if (weChat.wx && weChat.wx.chooseWXPay) {
                weChat.wx.chooseWXPay({
                  timestamp:res.data.timeStamp,
                  nonceStr: res.data.nonceStr,
                  package: res.data.package,
                  paySign: res.data.paySign,
                  signType: res.data.signType,
                  success: () => {
                    // 支付成功后的回调函数
                    setErrorMsg('支付成功');
                  },
                  cancle: () => {
                    setErrorMsg('您已经取消支付');
                  },
                  fail: () => {
                    setErrorMsg('支付失败');
                  },
                });
              }
            },
            error(err) {
              setErrorMsg(err);
            },
          });
        } else {
          dispatch(setErrorMsg('支付失败，请稍后重试'));
        }
      }).
      catch(err => {
        console.log(err);
      });
  }
};
