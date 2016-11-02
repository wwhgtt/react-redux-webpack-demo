require('es6-promise');
require('isomorphic-fetch');
const config = require('../../config');
const createAction = require('redux-actions').createAction;
const helper = require('../../helper/common-helper.js');
const setQueueInfo = createAction('SET_QUEUE_INFO', queueInfo => queueInfo);

const shopId = helper.getUrlParam('shopId');
const orderId = helper.getUrlParam('orderId');

exports.getQueueInfo = () => (dispatch, getStates) => {
  const getQueueInfoURL = `${config.getQueueInfoAPI}?shopId=${shopId}&orderId=${orderId}`;
  fetch(getQueueInfoURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      return false;
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setQueueInfo(res.data));
    }
  });
};
