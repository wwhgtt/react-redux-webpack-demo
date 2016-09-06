const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setCommercialProps = createAction('SET_COMMERCIAL_PROPS', props => props);
const setTableProps = createAction('SET_TABLE_PROPS', props => props);
const setTableAvaliable = createAction('SET_TABLE_AVALIABLE', props => props);
exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
exports.setOrderProps = createAction('SET_ORDER_PROPS', (evt, option) => option);
exports.setCustomerProps = createAction('SET_CUSTOMER_PROPS', option => option);
const setPhoneValidateProps = exports.setPhoneValidateProps = createAction('SET_PHONE_VALIDATE_PROPS', bool => bool);
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const getSendCodeParamStr = require('../../helper/register-helper.js').getSendCodeParamStr;
const shopId = getUrlParam('shopId');
exports.fetchCommercialProps = () => (dispatch, getState) =>
  fetch(`${config.placeOrderAPI}?shopId=${shopId}`, config.requestOptions)
    .then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取商户信息失败...'));
      }
      return res.json();
    })
    .then(commercial => {
      dispatch(setCommercialProps(commercial.data));
    })
    .catch(err => {
      console.log(err);
    });
exports.fetchTables = () => (dispatch, getState) => {
  const orderTime = getState().timeProps.selectedDateTime;
  fetch(`${config.getPlaceOrderTablesAPI}?shopId=${shopId}&orderTime=${orderTime.date}%20${orderTime.time}:00`, config.requestOptions)
      .then(res => {
        if (!res.ok) {
          dispatch(setErrorMsg('获取商户桌台信息失败...'));
        }
        return res.json();
      })
      .then(tables => {
        dispatch(setTableProps(tables.data));
      })
      .catch(err => {
        console.log(err);
      });
};
exports.setTableProps = (evt, props) => (dispatch, getState) => {
  const areaId = props.area.areaId;
  const num = props.table.pNum;
  const orderTime = getState().timeProps.selectedDateTime;
  if (!orderTime.time) {
    dispatch(setErrorMsg('请先选择预定时间...'));
    return false;
  }
  return fetch(`${config.getCheckTableAvaliable}?shopId=${shopId}&areaId=${areaId}&num=${num}&orderTime=${orderTime.date}%20${orderTime.time}:00`,
    config.requestOptions
  )
    .then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取商户桌台信息失败...'));
      }
      return res.json();
    })
    .then(result => {
      dispatch(setTableAvaliable(Object.assign({}, result.data, props)));
    })
    .catch(err => {
      console.log(err);
    });
};

exports.clearErrorMsg = () => (dispatch, getState) =>
  dispatch(setErrorMsg(null));

exports.placeOrder = (note) => (dispatch, getState) => {
  const state = getState();
  const orderTime = `${state.timeProps.selectedDateTime.date} ${state.timeProps.selectedDateTime.time}:00`;
  if (!state.customerProps.name || !state.customerProps.mobile || !state.tableProps.selectedTableId
  || !orderTime || state.customerProps.sex === null) {
    dispatch(setErrorMsg('请先完善预定信息...'));
    return;
  }
  const code = state.phoneValidateCode ? `&code=${state.phoneValidateCode}` : '';
  let mobile = state.customerProps.mobile.toString();
  if (mobile.indexOf('4') === 0 && mobile.length === 9) {
    mobile = '0' + mobile;
  }
  const params = '?name=' + state.customerProps.name
      + '&memo=' + note
      + '&mobile=' + mobile
      + '&sex=' + state.customerProps.sex
      + '&tableId=' + state.tableProps.selectedTableId
      + '&orderNumber=' + state.dinePersonCount
      + '&orderTime=' + orderTime
      + '&shopId=' + getUrlParam('shopId')
      + code;
  fetch(`${config.submitPlaceOrderAPI}${params}`, config.requestOptions)
    .then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('提交预定信息失败...'));
      }
      return res.json();
    })
    .then(result => {
      if (result.code.toString() === '200') {
        dispatch(setErrorMsg('提交预定信息成功...'));
        location.href = `/booking/bookingDetail?shopId=${shopId}&orderId=${result.data.bookingId}`;
      } else if (result.code.toString() === '20013') {
        dispatch(setPhoneValidateProps(true));
      } else {
        dispatch(setErrorMsg(result.msg));
      }
    })
    .catch(err => {
      console.log(err);
    });
};
exports.fetchVericationCode = (phoneNum) => (dispatch, getState) => {
  const obj = Object.assign({}, { shopId, mobile: phoneNum, timestamp: new Date().getTime() });
  const paramStr = getSendCodeParamStr(obj);
  const url = `${config.sendCodeAPI}?${paramStr}`;
  return fetch(url, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('验证码获取失败'));
      }
      return res.json();
    }).
    then(result => {
      if (result.code !== '200') {
        dispatch(setErrorMsg(result.msg));
        return;
      }
    }).
    catch(err => {
      console.log(err);
    });
};
exports.checkCodeAvaliable = (data) => (dispatch, getState) =>
  fetch(`${config.checkCodeAvaliableAPI}?mobile=${data.phoneNum}&code=${data.code}`, config.requestOptions)
    .then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('校验验证码信息失败...'));
      }
      return res.json();
    })
    .then(result => {
      if (result.code.toString() === '200') {
        return { success:true };
      }
      dispatch(setErrorMsg(result.msg));
      return { success:false };
    })
    .catch(err => {
      console.log(err);
    });
