const config = require('../config');

//得到验证码
exports.getCode = (phoneNumber,trp) => (dispatch, getStates) => {
    fetch(registerAPI+"?shopId="+shopId+"&mId="+mid).
    then(res => {
      return res.json();
    }).
    then(BasicData => {
      let code="1111"; //此处模拟验证码
      //dispatch(setCode(code));
    }).
    catch(err => {
      dispatch(setErrorMsg('获取基本信息失败...'));
    });
}