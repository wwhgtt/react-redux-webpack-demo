import { createAction } from 'redux-actions';
exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
// const setPhone = createAction('SET_PHONE', phoneInfo => phoneInfo);

exports.bindPhone = phoneInfo => (dispatch) => {
  if (phoneInfo) {
    console.log(phoneInfo.phoneNum);
    window.sessionStorage.setItem('phoneNum', phoneInfo.phoneNum);
    dispatch(setErrorMsg('成功'));
    location.hash = '#phone-success';
  }
};
