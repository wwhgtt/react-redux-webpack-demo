require('es6-promise');
require('isomorphic-fetch');
const createAction = require('redux-actions').createAction;
const config = require('../../config');
const setAddressInfo = exports.setAddressInfo = createAction('SET_ADDRESS_INFO', address => address);
const setAllAddressList = exports.setAllAddressList = createAction('SET_All_ADDRESSLIST', address => address);
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
    const defaultValue = { sex: 1 };
    dispatch(setAddressInfo(defaultValue));
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
    then(result => {
      dispatch(setAddressInfo(result.data));
    }).
    catch(err => {
      console.log(err);
    });
};
exports.fetchAllAddressList = () => (dispatch, getState) => {
  // 取所有收货地址
  fetch(config.getAllAddressListAPI, config.requestOptions).
    then(res => {
      if (!res.ok) {
        console.log('获取用户地址信息失败...');
      }
      return res.json();
    }).
    then(result => {
      dispatch(setAllAddressList(result.data));
    }).
    catch(err => {
      console.log(err);
    });
};
exports.saveCustomerAddressInfo = (evt, address) => (dispatch, getState) => {
  const requestOptions = Object.assign({}, config.requestOptions);
  requestOptions.method = 'POST';
  requestOptions.body = JSON.stringify(address);
  const btn = evt.target;
  btn.disabled = true;
  return fetch(config.saveAddressAPI, requestOptions).
    then(res => {
      btn.disabled = false;
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
      btn.disabled = false;
      console.log(err);
    });
};
exports.setSessionAndForwardEditUserAddress = (shopId, id) => (dispatch, getState) => {
  sessionStorage.setItem('rurl_address', JSON.stringify(location.href));
  let url = `${config.editUserAddressURL}?shopId=${shopId}`;
  if (typeof id === 'string') {
    url += `&addressId=${id}`;
  }
  location.href = url;
};
exports.deleteCustomerAddressInfo = (addressId) => (dispatch, getState) =>
  fetch(`${config.deleteAddressAPI}?addressId=${addressId}`, config.requestOptions).
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
exports.clearErrorMsg = () => (dispatch, getState) =>
  dispatch(setErrorMsg(null));
