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
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
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
exports.fetchTables = () => (dispatch, getState) =>
  fetch(`${config.getPlaceOrderTablesAPI}?shopId=${shopId}`, config.requestOptions)
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
exports.setTableProps = (evt, props) => (dispatch, getState) => {
  const areaId = props.area.areaId;
  const num = props.table.pNum;
  const orderTime = getState().timeProps.selectedDateTime;
  if (!orderTime.time) {
    dispatch(setErrorMsg('请先选择预定时间...'));
    return false;
  }
  return fetch(`${config.getCheckTableAvaliable}?shopId=${shopId}&areaId=${areaId}&num=${num}&orderTime=${orderTime.date}%20${orderTime.time}`,
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
  const orderTime = `${state.timeProps.selectedDateTime.date}20%${state.timeProps.selectedDateTime.time}`;
  const params = '?name=' + state.customerProps.name
      + '&memo=' + note
      + '&mobile=' + state.customerProps.mobile
      + '&sex=' + state.customerProps.sex
      + '&tableId=' + state.tableProps.selectedTableId
      + '&orderNumber=' + state.dinePersonCount
      + '&orderTime=' + orderTime
      + '&shopId=' + getUrlParam('shopId');
  fetch(`${config.submitPlaceOrderAPI}${params}`, config.requestOptions)
    .then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('提交预定信息失败...'));
      }
      return res.json();
    })
    .then(result => {
      dispatch(setErrorMsg('提交预定信息成功...'));
    })
    .catch(err => {
      console.log(err);
    });
};
