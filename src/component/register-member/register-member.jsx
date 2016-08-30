import React from 'react';
import InputPhone from '../mui/input/input-number.js';

const RegisterMember = React.createClass({
  getInitialState() {
    return { errorCode: 0, phoneNum: '' };
  },
  getPhoneNum(obj) {
    this.setState({ errorCode: obj.errorCode, phoneNum: obj.phoneVal });
  },
  registerMember() {
    console.log(this.state);
  },
  render() {
    // const abs = {
    //   maxLength: 12,
    // };
    return (
      <div className="register-member ">
        <div className="register-banner">
          <img className="register-banner-img" alt="" src="http://7i7ie3.com2.z0.glb.qiniucdn.com/o_1an1m1l19j5hapvdl468i18jf9.jpg" />
        </div>
        <div className="">
          <div className="options-group">
            <div className="option">
              <span className="option-title">手机号</span>
              <InputPhone
                maxLength={11}
                placeholder={"请填写手机号"}
                pattern={"\\d*"}
                className={'option-input register-input'}
                onGetPhoneNum={this.getPhoneNum}
              />
            </div>
          </div>

          <div className="options-group">
            <div className="option">
              <span className="option-title">姓名</span>
              <input type="text" className="option-input register-input" placeholder="请填写姓名" />
            </div>
            <div className="option">
              <span className="option-title">生日</span>
              <span className="btn-arrow-right"></span>
              <input type="text" className="option-input register-input" placeholder="请选择出生日期" />

            </div>
            <div className="option">
              <span className="option-title">交易密码</span>
              <span className="btn-arrow-right"></span>
              <input type="tel" className="option-input register-input" placeholder="请填写6位数字密码" maxLength="6" />
              <input type="password" className="option-input register-input" />
            </div>
          </div>
        </div>
        <button className="register-btn btn--yellow btn-bottom" onClick={this.registerMember}>注册会员</button>
      </div>
    );
  },
});

module.exports = RegisterMember;
