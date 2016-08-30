const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setCommercialProps = createAction('SET_COMMERCIAL_PROPS', props => props);
const setTableProps = createAction('SET_TABLE_PROPS', props => props);
<<<<<<< fb9eb1c768ccdfc07b3a89ca93b2bb5edf60bd65
const setTableAvaliable = createAction('SET_TABLE_AVALIABLE', props => props);
=======
>>>>>>> taskID:6621
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
<<<<<<< fb9eb1c768ccdfc07b3a89ca93b2bb5edf60bd65
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
=======
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
>>>>>>> taskID:6621
