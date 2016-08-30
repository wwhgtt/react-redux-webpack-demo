const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setCommercialProps = createAction('SET_COMMERCIAL_PROPS', props => props);
const setTableProps = createAction('SET_TABLE_PROPS', props => props);
exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
exports.setOrderProps = createAction('SET_ORDER_PROPS', (evt, option) => option);
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
