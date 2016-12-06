require('es6-promise');
require('isomorphic-fetch');
const config = require('../../config');
const createAction = require('redux-actions').createAction;

const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setPayProps = createAction('SET_PAY_PROPS', props => props);
const setLoadingProps = exports.setLoadingProps = createAction('SET_LOAD_PROP', prop => prop);

const getUrlParam = require('../../helper/common-helper.js').getUrlParam;
const shopId = getUrlParam('shopId');

const wxClient = require('wechat-jssdk/client');
const returnUrl = decodeURIComponent(sessionStorage.getItem('rurl_payDetaill'));
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
        if (String(res.data.tradePayStatus) === '3') {
          // 表示已经支付过了
          dispatch(setErrorMsg('您已经支付成功了'));
          setTimeout(function () {
            // 缺乏链接
            location.href = returnUrl.replace(/"/g, '');
          }, 3000);
        } else {
          dispatch(setPayProps(res.data));
        }
      } else {
        dispatch(setErrorMsg('获取支付信息失败'));
      }
    }).
    catch(err => {
      console.log(err);
    });

let hasPayed = false;
exports.setPayDetail = (payString, price) => (dispatch, getState) => {
  const requestDataString = `?shopId=${shopId}&orderId=${getUrlParam('orderId')}&price=${price}&returnUrl=${encodeURIComponent(returnUrl)}`;
  let requestOptions = Object.assign({}, config.requestOptions);
  requestOptions.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  if (payString === 'baidu') {
    fetch(`${config.baiduPayAPI}${requestDataString}`, requestOptions).
      then(res => {
        if (!res.ok) {
          dispatch(setLoadingProps(false));
          dispatch(setErrorMsg('支付失败，请稍后重试'));
          return false;
        }
        return res.json();
      }).
      then(res => {
        if (String(res.code) === '200') {
          location.href = res.data.url;
        } else {
          dispatch(setLoadingProps(false));
          dispatch(setErrorMsg('支付失败，请稍后重试'));
        }
      }).
      catch(err => {
        console.log(err);
      });
  } else if (payString === 'weixin') {
    fetch(`${config.weixinPayAPI}${requestDataString}`, requestOptions).
      then(res => {
        if (!res.ok) {
          dispatch(setLoadingProps(false));
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
                  success(result) {
                    // 支付成功后的回调函数
                    dispatch(setLoadingProps(false));
                    dispatch(setErrorMsg('支付成功'));
                  },
                  cancel() {
                    dispatch(setLoadingProps(false));
                    dispatch(setErrorMsg('您已经取消支付'));
                  },
                  fail() {
                    dispatch(setLoadingProps(false));
                    dispatch(setErrorMsg('支付失败'));
                  },
                });
              }
            },
            error(err) {
              setErrorMsg(err);
            },
          });
        } else {
          dispatch(setLoadingProps(false));
          dispatch(setErrorMsg('支付失败，请稍后重试'));
        }
      }).
      catch(err => {
        console.log(err);
      });
  } else if (payString === 'alipay') {
    const orderType = getUrlParam('orderType') === 'recharge' ? 2 : 1;
    fetch(`${config.aliPayAPI}${requestDataString}&payBusinessType=${orderType}`, requestOptions).
      then(res => {
        if (!res.ok) {
          dispatch(setLoadingProps(false));
          dispatch(setErrorMsg('支付失败，请稍后重试'));
          return false;
        }
        return res.json();
      }).
      then(res => {
        if (String(res.code) === '200') {
          location.href = res.data;
        } else {
          dispatch(setLoadingProps(false));
          dispatch(setErrorMsg('支付失败，请稍后重试'));
        }
      }).
      catch(err => {
        console.log(err);
      });
  } else {
    // 余额支付   第一个参数为密码
    if (!hasPayed) {
      fetch(`${config.balancePayAPI}${requestDataString}&password=${payString}`, requestOptions).
        then(res => {
          if (!res.ok) {
            dispatch(setLoadingProps(false));
            dispatch(setErrorMsg('支付失败，请稍后重试'));
            return false;
          }
          return res.json();
        }).
        then(res => {
          if (String(res.code) === '200') {
            dispatch(setLoadingProps(false));
            dispatch(setErrorMsg('支付成功'));
            // 测试时出现多次余额支付的情况
            hasPayed = true;
            setTimeout(function () {
              location.href = returnUrl.replace(/"/g, '');
            }, 3000);
          } else {
            dispatch(setLoadingProps(false));
            dispatch(setErrorMsg(res.msg));
          }
        }).
        catch(err => {
          console.log(err);
        });
    }
  }
};

exports.clearErrorMsg = () => (dispatch, getState) =>
  dispatch(setErrorMsg(null));
