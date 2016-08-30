import React from 'react';
import InputPhone from '../mui/input/input-number.js';
import SexSwitch from '../mui/sexSwitch.jsx';
import Toast from '../mui/toast.jsx';

const RegisterMember = React.createClass({
  propTypes: {
    regs: React.PropTypes.Array,
  },

  getInitialState() {
    return {
      errorMsg: '',
      errorMsgP: '', // 手机提示信息
      errorMsgC: '', // 密码提示信息
      phoneNum: '', // 手机号码
      password: '', // 注册密码
      userSex: '',
    };
  },

  getPhoneNum(obj) {
    this.setState({ errorMsgP: obj.errorMsg, phoneNum: obj.numVal });
  },

  getPassword(obj) {
    this.setState({ errorMsgC: obj.errorMsg, password: obj.numVal });
  },

  handleSex(obj) {
    this.setState({ userSex: obj.sex });
  },

  registerMember() {
    const { errorMsgP, errorMsgC, phoneNum, password, userSex } = this.state;
    if (!phoneNum) {
      this.setState({ errorMsg: '请填写手机号码' });
    } else if (errorMsgP) {
      this.setState({ errorMsg: errorMsgP });
    } else if (!this.refs.userName.value) {
      this.setState({ errorMsg: '请填写用户名' });
    } else if (!userSex) {
      this.setState({ errorMsg: '请选择性别' });
    } else if (!password) {
      this.setState({ errorMsg: '请设置密码' });
    } else if (errorMsgC) {
      this.setState({ errorMsg: errorMsgC });
    } else {
      const registerInfo = {
        shopId: '123',
        birth: 'fasd',
        phone: phoneNum,
        sex: userSex,
        pwd: password,
      };
      console.log(registerInfo);
    }
  },

  handleClearErrorMsg() {
    this.setState({ errorMsg: false });
  },

  render() {
    const { password, userSex, errorMsg } = this.state;
    // 中国手机号码验证规则
    const regPhone = /^(1(?:[358]\d{9}|7[3678]\d{8}|4[57]\d{8}))|0[49]\d{8}$/;
    // const regEmpty = /\S/; // 非空验证规则
    const regCode = /\d{6}/; // 6位数字验证规则
    // 手机验证
    const regP = [
      // { regMsg: '电话空的', reg: regEmpty },
      { regMsg: '电话格式错误', reg: regPhone },
    ];
    // 6位密码验证
    const regC = [
      // { regMsg: '密码空的', reg: regEmpty },
      { regMsg: '6位密码', reg: regCode },
    ];
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
                regs={regP}
                className={'option-input register-input'}
                onGetNum={this.getPhoneNum}
              />
            </div>
          </div>

          <div className="options-group">
            <div className="option register-user">
              <span className="option-title register-user-name">姓名</span>
              <input
                type="text"
                className="option-input register-input register-user-input"
                placeholder="请填写姓名"
                maxLength="30"
                ref="userName"
              />
              <SexSwitch sex={userSex} getSex={this.handleSex} />
            </div>
            <div className="option">
              <span className="option-title">生日</span>
              <span className="btn-arrow-right"></span>
              <input type="text" className="option-input register-input" placeholder="请选择出生日期" />

            </div>
            <div className="option register-pwd">
              <span className="option-title">交易密码</span>
              <span className="btn-arrow-right"></span>
              <InputPhone
                maxLength={6}
                placeholder={"请填写6位数字密码"}
                regs={regC}
                className={'option-input register-input register-pwd-in'}
                onGetNum={this.getPassword}
              />
              <input
                type="password"
                ref="inputPwd"
                value={password}
                className="option-input register-input register-pwd-out"
                placeholder="请填写6位数字密码"
              />
            </div>
          </div>
        </div>
        <button className="register-btn btn--yellow btn-bottom" onClick={this.registerMember}>注册会员</button>
        {
          errorMsg ?
            <Toast errorMessage={errorMsg} clearErrorMsg={this.handleClearErrorMsg} />
          : ''
        }
      </div>
    );
  },
});

module.exports = RegisterMember;
