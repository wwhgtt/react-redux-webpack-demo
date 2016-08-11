require('es6-promise');
require('isomorphic-fetch');
const createAction = require('redux-actions').createAction;
const config = require('../../config');
const setAddressInfo = exports.setAddressInfo = createAction('SET_ADDRESS_INFO', address => address);
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);

const backCustomerAdressListPage = () => {
  const key = 'rurl_address';
  let url = sessionStorage.getItem(key);
  if (!url) {
    return;
  }

  sessionStorage.removeItem(key);
  url = JSON.parse(url);
  location.href = url;
};
exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
exports.fetchCustomerAddressInfo = (shopId, addressId) => (dispatch, getState) => {
  // 取新增数据
  if (!addressId) {
    const data = { _isGPSPoint: true, sex: 1 };
    navigator.geolocation.getCurrentPosition(pos => {
      Object.assign(data, {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      dispatch(setAddressInfo(data));
    }, error => {
      Object.assign(data, {
        latitude: '30.542718',
        longitude: '104.066082',
      });
      dispatch(setAddressInfo(data));
    }, {
      enableHighAccuracy: true,
      timeout: 2000,
      maximumAge: 1000 * 10,
    });
    return;
  }

  // 取数据
  fetch(`${config.customerAddressAPI}?shopId=${shopId || ''}&addressId=${addressId}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        console.log('获取用户地址信息失败...');
      }
      return res.json();
    }).
    then(coupons => {
      dispatch(setAddressInfo(coupons.data));
    }).
    catch(err => {
      console.log(err);
    });
};
exports.saveCustomerAddressInfo = (address) => (dispatch, getState) => {
  const requestOptions = Object.assign({}, config.requestOptions);
  requestOptions.method = 'POST';
  requestOptions.body = JSON.stringify(address);
  return fetch(config.saveAddressAPI, requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('保存收货地址失败'));
      }
      return res.json();
    }).
    then(result => {
      if (result.code === '200') {
        backCustomerAdressListPage();
      } else {
        dispatch(setErrorMsg(result.msg));
      }
    }).
    catch(err => {
      console.log(err);
    });
};
exports.deleteCustomerAddressInfo = (address) => (dispatch, getState) => {
  const addressId = address.id;
  return fetch(`${config.deleteAddressAPI}?addressId=${addressId}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('删除收货地址失败'));
      }
      return res.json();
    }).
    then(result => {
      if (result.code === '200') {
        backCustomerAdressListPage();
      } else {
        dispatch(setErrorMsg(result.msg));
      }
    }).
    catch(err => {
      console.log(err);
    });
};
exports.clearErrorMsg = () => (dispatch, getState) =>
  dispatch(setErrorMsg(null));
