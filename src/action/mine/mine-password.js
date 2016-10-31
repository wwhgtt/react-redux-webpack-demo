require('es6-promise');
require('isomorphic-fetch');

const config = require('../../config');
const getUrlParam = require('../../helper/common-helper').getUrlParam;
const shopId = getUrlParam('shopId');

// 修改密码
exports.modifyPassword = (data, setLoadding, showErrorMessage) => (dispatch, getStates) => {
  setLoadding({ ing: true, text: '系统处理中...' });
  fetch(`${config.modifyPwd}?shopId=${shopId}&newPwd=${data.newPassword}&oldPwd=${data.password}`, config.requestOptions)
    .then(res => {
      if (!res.ok) {
        return false;
      }
      return res.json();
    })
    .then(res => {
      setLoadding(false);
      if (res.code === '200') {
        location.href = config.mineSettingURL;
        return;
      }
      showErrorMessage({ msg: res.msg });
    })
    .catch(err => {
      setLoadding(false);
      throw new Error(err);
    });
};
